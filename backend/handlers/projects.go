package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"vof-backend/models"

	"github.com/go-chi/chi/v5"
)

type ProjectHandler struct {
	DB *sql.DB
}

func NewProjectHandler(db *sql.DB) *ProjectHandler {
	return &ProjectHandler{DB: db}
}

func (h *ProjectHandler) List(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")

	query := `SELECT id, title, slug, COALESCE(category, ''), COALESCE(description, ''), 
		target_amount, raised_amount, currency, COALESCE(location, ''), 
		beneficiaries_count, COALESCE(image_url, ''), status, 
		COALESCE(start_date, ''), COALESCE(end_date, ''), created_at, updated_at 
		FROM charity_projects WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	query += " ORDER BY id ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var projects []models.CharityProject
	for rows.Next() {
		var p models.CharityProject
		if err := rows.Scan(
			&p.ID, &p.Title, &p.Slug, &p.Category, &p.Description,
			&p.TargetAmount, &p.RaisedAmount, &p.Currency, &p.Location,
			&p.BeneficiariesCount, &p.ImageURL, &p.Status,
			&p.StartDate, &p.EndDate, &p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		projects = append(projects, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p models.CharityProject
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if p.Slug == "" {
		p.Slug = strings.ToLower(strings.ReplaceAll(p.Title, " ", "-"))
	}
	if p.Currency == "" {
		p.Currency = "NGN"
	}
	if p.Status == "" {
		p.Status = "active"
	}

	query := `INSERT INTO charity_projects (title, slug, category, description, target_amount, raised_amount, currency, location, beneficiaries_count, image_url, status, start_date, end_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(query, p.Title, p.Slug, p.Category, p.Description, p.TargetAmount, p.RaisedAmount, p.Currency, p.Location, p.BeneficiariesCount, p.ImageURL, p.Status, p.StartDate, p.EndDate).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		http.Error(w, "Failed to create project: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(p)
}

func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var p models.CharityProject
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	query := `UPDATE charity_projects SET 
		title = $1, category = $2, description = $3, target_amount = $4, 
		raised_amount = $5, location = $6, beneficiaries_count = $7, 
		image_url = $8, status = $9, start_date = $10, end_date = $11, updated_at = NOW()
		WHERE id = $12`

	_, err = h.DB.Exec(query, p.Title, p.Category, p.Description, p.TargetAmount, p.RaisedAmount, p.Location, p.BeneficiariesCount, p.ImageURL, p.Status, p.StartDate, p.EndDate, id)
	if err != nil {
		http.Error(w, "Failed to update project: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "id": id})
}

func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM charity_projects WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete project: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
}
