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

type PartnerHandler struct {
	DB *sql.DB
}

func NewPartnerHandler(db *sql.DB) *PartnerHandler {
	return &PartnerHandler{DB: db}
}

// List returns all registered partner inquiries, optionally filtered by status, country, or partner_type
func (h *PartnerHandler) List(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	country := r.URL.Query().Get("country")
	partnerType := r.URL.Query().Get("type")

	query := `SELECT id, organization_name, partner_type, contact_person, email, phone, 
		COALESCE(country, 'Nigeria'), COALESCE(city, ''), COALESCE(website, ''), 
		COALESCE(partnership_interest, ''), COALESCE(message, ''), status, 
		COALESCE(notes, ''), created_at, updated_at 
		FROM partners WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	if country != "" && country != "All" {
		query += " AND country = $" + strconv.Itoa(idx)
		args = append(args, country)
		idx++
	}
	if partnerType != "" && partnerType != "All" {
		query += " AND partner_type = $" + strconv.Itoa(idx)
		args = append(args, partnerType)
		idx++
	}
	query += " ORDER BY id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var partners []models.Partner
	for rows.Next() {
		var p models.Partner
		if err := rows.Scan(
			&p.ID, &p.OrganizationName, &p.PartnerType, &p.ContactPerson, &p.Email, &p.Phone,
			&p.Country, &p.City, &p.Website, &p.PartnershipInterest, &p.Message,
			&p.Status, &p.Notes, &p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		partners = append(partners, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(partners)
}

// Create records a new partnership proposal from the public landing page form
func (h *PartnerHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p models.Partner
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if p.OrganizationName == "" || p.ContactPerson == "" || p.Email == "" || p.Phone == "" {
		http.Error(w, "Organization name, contact person, email, and phone number are required", http.StatusBadRequest)
		return
	}

	if p.Status == "" {
		p.Status = "new"
	}
	if p.Country == "" {
		p.Country = "Nigeria"
	}
	if p.PartnerType == "" {
		p.PartnerType = "Corporate"
	}
	now := time.Now()

	query := `INSERT INTO partners (organization_name, partner_type, contact_person, email, phone, country, city, website, partnership_interest, message, status, notes, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(
		query,
		p.OrganizationName, p.PartnerType, p.ContactPerson, p.Email, p.Phone,
		p.Country, p.City, p.Website, p.PartnershipInterest, p.Message,
		p.Status, p.Notes, now, now,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)

	if err != nil {
		http.Error(w, "Failed to submit partner inquiry: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

// UpdateStatus modifies the partner application review status and internal notes
func (h *PartnerHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid partner ID", http.StatusBadRequest)
		return
	}

	var payload struct {
		Status string `json:"status"`
		Notes  string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := `UPDATE partners SET status = $1, notes = COALESCE(NULLIF($2, ''), notes), updated_at = NOW() WHERE id = $3 RETURNING id`
	var updatedID int
	err = h.DB.QueryRow(query, payload.Status, payload.Notes, id).Scan(&updatedID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Partner not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to update partner: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"id":      updatedID,
		"status":  payload.Status,
		"message": "Partner status updated successfully",
	})
}

// Delete removes a partner record
func (h *PartnerHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid partner ID", http.StatusBadRequest)
		return
	}

	res, err := h.DB.Exec("DELETE FROM partners WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete partner: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Partner not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Partner record removed successfully",
	})
}
