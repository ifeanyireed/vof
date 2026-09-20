package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"vof-backend/models"

	"github.com/go-chi/chi/v5"
)

type DonationHandler struct {
	DB *sql.DB
}

func NewDonationHandler(db *sql.DB) *DonationHandler {
	return &DonationHandler{DB: db}
}

func (h *DonationHandler) List(w http.ResponseWriter, r *http.Request) {
	currency := r.URL.Query().Get("currency")
	campaign := r.URL.Query().Get("campaign")

	query := `SELECT id, donor_name, COALESCE(donor_email, ''), COALESCE(donor_phone, ''), 
		amount, currency, COALESCE(campaign, ''), COALESCE(payment_method, ''), COALESCE(reference, ''), 
		status, anonymous, COALESCE(notes, ''), donated_at, created_at 
		FROM donations WHERE 1=1`
	var args []interface{}
	idx := 1

	if currency != "" {
		query += " AND currency = $" + strconv.Itoa(idx)
		args = append(args, currency)
		idx++
	}
	if campaign != "" {
		query += " AND campaign = $" + strconv.Itoa(idx)
		args = append(args, campaign)
		idx++
	}
	query += " ORDER BY donated_at DESC, id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var donations []models.Donation
	for rows.Next() {
		var d models.Donation
		if err := rows.Scan(
			&d.ID, &d.DonorName, &d.DonorEmail, &d.DonorPhone,
			&d.Amount, &d.Currency, &d.Campaign, &d.PaymentMethod,
			&d.Reference, &d.Status, &d.Anonymous, &d.Notes,
			&d.DonatedAt, &d.CreatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		donations = append(donations, d)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donations)
}

func (h *DonationHandler) Create(w http.ResponseWriter, r *http.Request) {
	var d models.Donation
	if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if d.DonorName == "" {
		d.DonorName = "Anonymous Donor"
	}
	if d.Currency == "" {
		d.Currency = "NGN"
	}
	if d.Status == "" {
		d.Status = "completed"
	}
	if d.DonatedAt.IsZero() {
		d.DonatedAt = time.Now()
	}

	query := `INSERT INTO donations (donor_name, donor_email, donor_phone, amount, currency, campaign, payment_method, reference, status, anonymous, notes, donated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at`

	err := h.DB.QueryRow(query, d.DonorName, d.DonorEmail, d.DonorPhone, d.Amount, d.Currency, d.Campaign, d.PaymentMethod, d.Reference, d.Status, d.Anonymous, d.Notes, d.DonatedAt).Scan(&d.ID, &d.CreatedAt)
	if err != nil {
		http.Error(w, "Failed to log donation: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(d)
}

func (h *DonationHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM donations WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete donation: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
}

func (h *DonationHandler) Stats(w http.ResponseWriter, r *http.Request) {
	var totalNGN, totalUSD float64
	var countNGN, countUSD, totalCount int

	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0), COUNT(*) FROM donations WHERE currency = 'NGN' AND status = 'completed'").Scan(&totalNGN, &countNGN)
	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0), COUNT(*) FROM donations WHERE currency = 'USD' AND status = 'completed'").Scan(&totalUSD, &countUSD)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM donations").Scan(&totalCount)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"totalNGN":   totalNGN,
		"totalUSD":   totalUSD,
		"countNGN":   countNGN,
		"countUSD":   countUSD,
		"totalCount": totalCount,
	})
}
