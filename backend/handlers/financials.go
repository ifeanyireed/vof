package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"vof-backend/models"
)

type FinancialHandler struct {
	DB *sql.DB
}

func NewFinancialHandler(db *sql.DB) *FinancialHandler {
	return &FinancialHandler{DB: db}
}

// --- Accounts ---

func (h *FinancialHandler) ListAccounts(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(`SELECT id, account_name, COALESCE(account_number, ''), 
		COALESCE(bank_name, ''), currency, balance, type, status, created_at 
		FROM financial_accounts ORDER BY id ASC`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var accounts []models.FinancialAccount
	for rows.Next() {
		var a models.FinancialAccount
		if err := rows.Scan(
			&a.ID, &a.AccountName, &a.AccountNumber, &a.BankName,
			&a.Currency, &a.Balance, &a.Type, &a.Status, &a.CreatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		accounts = append(accounts, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(accounts)
}

func (h *FinancialHandler) CreateAccount(w http.ResponseWriter, r *http.Request) {
	var a models.FinancialAccount
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if a.AccountName == "" {
		http.Error(w, "Account name is required", http.StatusBadRequest)
		return
	}
	if a.Currency == "" {
		a.Currency = "NGN"
	}
	if a.Type == "" {
		a.Type = "checking"
	}
	if a.Status == "" {
		a.Status = "active"
	}

	query := `INSERT INTO financial_accounts (account_name, account_number, bank_name, currency, balance, type, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at`

	err := h.DB.QueryRow(query, a.AccountName, a.AccountNumber, a.BankName, a.Currency, a.Balance, a.Type, a.Status).Scan(&a.ID, &a.CreatedAt)
	if err != nil {
		http.Error(w, "Failed to create account: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(a)
}

// --- Transactions ---

func (h *FinancialHandler) ListTransactions(w http.ResponseWriter, r *http.Request) {
	txType := r.URL.Query().Get("type")
	accountID := r.URL.Query().Get("accountId")

	query := `SELECT t.id, t.account_id, COALESCE(a.account_name, 'Unknown Account'), 
		t.transaction_type, t.category, t.amount, t.currency, t.description, 
		COALESCE(t.reference, ''), t.related_project_id, t.transaction_date, 
		COALESCE(t.receipt_url, ''), t.created_at
		FROM financial_transactions t
		LEFT JOIN financial_accounts a ON t.account_id = a.id
		WHERE 1=1`
	var args []interface{}
	idx := 1

	if txType != "" {
		query += " AND t.transaction_type = $" + strconv.Itoa(idx)
		args = append(args, txType)
		idx++
	}
	if accountID != "" {
		query += " AND t.account_id = $" + strconv.Itoa(idx)
		args = append(args, accountID)
		idx++
	}
	query += " ORDER BY t.transaction_date DESC, t.id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var txs []models.FinancialTransaction
	for rows.Next() {
		var t models.FinancialTransaction
		if err := rows.Scan(
			&t.ID, &t.AccountID, &t.AccountName, &t.TransactionType,
			&t.Category, &t.Amount, &t.Currency, &t.Description,
			&t.Reference, &t.RelatedProjectID, &t.TransactionDate,
			&t.ReceiptURL, &t.CreatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		txs = append(txs, t)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(txs)
}

func (h *FinancialHandler) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	var t models.FinancialTransaction
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if t.Amount <= 0 || t.Description == "" || t.TransactionType == "" {
		http.Error(w, "Amount, description, and type (inflow/outflow) are required", http.StatusBadRequest)
		return
	}
	if t.Currency == "" {
		t.Currency = "NGN"
	}

	tx, err := h.DB.Begin()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	query := `INSERT INTO financial_transactions (account_id, transaction_type, category, amount, currency, description, reference, related_project_id, transaction_date, receipt_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at`

	err = tx.QueryRow(query, t.AccountID, t.TransactionType, t.Category, t.Amount, t.Currency, t.Description, t.Reference, t.RelatedProjectID, t.TransactionDate, t.ReceiptURL).Scan(&t.ID, &t.CreatedAt)
	if err != nil {
		http.Error(w, "Failed to insert transaction: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Update account balance
	if t.AccountID != nil {
		var balanceDelta float64 = t.Amount
		if t.TransactionType == "outflow" {
			balanceDelta = -t.Amount
		}
		_, err = tx.Exec("UPDATE financial_accounts SET balance = balance + $1 WHERE id = $2", balanceDelta, *t.AccountID)
		if err != nil {
			http.Error(w, "Failed to update account balance: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, "Transaction commit failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

func (h *FinancialHandler) GetSummary(w http.ResponseWriter, r *http.Request) {
	var totalNGNBalance, totalUSDBalance float64
	var totalNGNInflow, totalNGNOutflow float64
	var totalUSDInflow, totalUSDOutflow float64

	_ = h.DB.QueryRow("SELECT COALESCE(SUM(balance), 0) FROM financial_accounts WHERE currency = 'NGN'").Scan(&totalNGNBalance)
	_ = h.DB.QueryRow("SELECT COALESCE(SUM(balance), 0) FROM financial_accounts WHERE currency = 'USD'").Scan(&totalUSDBalance)

	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE transaction_type = 'inflow' AND currency = 'NGN'").Scan(&totalNGNInflow)
	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE transaction_type = 'outflow' AND currency = 'NGN'").Scan(&totalNGNOutflow)

	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE transaction_type = 'inflow' AND currency = 'USD'").Scan(&totalUSDInflow)
	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM financial_transactions WHERE transaction_type = 'outflow' AND currency = 'USD'").Scan(&totalUSDOutflow)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"totalNGNBalance": totalNGNBalance,
		"totalUSDBalance": totalUSDBalance,
		"totalNGNInflow":  totalNGNInflow,
		"totalNGNOutflow": totalNGNOutflow,
		"totalUSDInflow":  totalUSDInflow,
		"totalUSDOutflow": totalUSDOutflow,
	})
}
