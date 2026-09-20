package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"vof-backend/models"

	"github.com/go-chi/chi/v5"
)

type VolunteerHandler struct {
	DB *sql.DB
}

func NewVolunteerHandler(db *sql.DB) *VolunteerHandler {
	return &VolunteerHandler{DB: db}
}

func (h *VolunteerHandler) List(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	interest := r.URL.Query().Get("interest")

	query := `SELECT id, full_name, email, phone, COALESCE(location, ''), 
		COALESCE(interest_area, ''), COALESCE(availability, ''), COALESCE(skills_experience, ''), 
		status, COALESCE(notes, ''), created_at 
		FROM volunteers WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	if interest != "" {
		query += " AND interest_area = $" + strconv.Itoa(idx)
		args = append(args, interest)
		idx++
	}
	query += " ORDER BY id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var volunteers []models.Volunteer
	for rows.Next() {
		var v models.Volunteer
		if err := rows.Scan(
			&v.ID, &v.FullName, &v.Email, &v.Phone, &v.Location,
			&v.InterestArea, &v.Availability, &v.SkillsExperience,
			&v.Status, &v.Notes, &v.CreatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		volunteers = append(volunteers, v)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(volunteers)
}

func (h *VolunteerHandler) Create(w http.ResponseWriter, r *http.Request) {
	var v models.Volunteer
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if v.FullName == "" || v.Email == "" || v.Phone == "" {
		http.Error(w, "Full name, email, and phone number are required", http.StatusBadRequest)
		return
	}
	if v.Status == "" {
		v.Status = "new"
	}

	query := `INSERT INTO volunteers (full_name, email, phone, location, interest_area, availability, skills_experience, status, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at`

	err := h.DB.QueryRow(query, v.FullName, v.Email, v.Phone, v.Location, v.InterestArea, v.Availability, v.SkillsExperience, v.Status, v.Notes).Scan(&v.ID, &v.CreatedAt)
	if err != nil {
		http.Error(w, "Failed to register volunteer: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(v)
}

func (h *VolunteerHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var payload struct {
		Status string `json:"status"`
		Notes  string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	query := `UPDATE volunteers SET status = $1, notes = COALESCE(NULLIF($2, ''), notes) WHERE id = $3`
	_, err = h.DB.Exec(query, payload.Status, payload.Notes, id)
	if err != nil {
		http.Error(w, "Failed to update volunteer: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "id": id, "status": payload.Status})
}

func (h *VolunteerHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM volunteers WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete volunteer: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
}
