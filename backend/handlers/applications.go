package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"vof-backend/models"

	"github.com/go-chi/chi/v5"
)

type ApplicationHandler struct {
	DB *sql.DB
}

func NewApplicationHandler(db *sql.DB) *ApplicationHandler {
	return &ApplicationHandler{DB: db}
}

// --- Scholarship Applications ---

func (h *ApplicationHandler) ListScholarships(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")

	query := `SELECT id, applicant_name, email, phone, COALESCE(country, 'Nigeria'), COALESCE(date_of_birth, ''), 
		COALESCE(gender, ''), COALESCE(state_of_origin, ''), COALESCE(lga, ''), 
		institution_name, course_of_study, COALESCE(current_level, ''), 
		COALESCE(cgpa, ''), amount_requested, COALESCE(reason_for_aid, ''), 
		COALESCE(document_url, ''), status, COALESCE(reviewer_notes, ''), 
		created_at, updated_at 
		FROM scholarship_applications WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	query += " ORDER BY id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var apps []models.ScholarshipApplication
	for rows.Next() {
		var a models.ScholarshipApplication
		if err := rows.Scan(
			&a.ID, &a.ApplicantName, &a.Email, &a.Phone, &a.Country, &a.DateOfBirth,
			&a.Gender, &a.StateOfOrigin, &a.LGA, &a.InstitutionName,
			&a.CourseOfStudy, &a.CurrentLevel, &a.CGPA, &a.AmountRequested,
			&a.ReasonForAid, &a.DocumentURL, &a.Status, &a.ReviewerNotes,
			&a.CreatedAt, &a.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		apps = append(apps, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apps)
}

func (h *ApplicationHandler) CreateScholarship(w http.ResponseWriter, r *http.Request) {
	var a models.ScholarshipApplication
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if a.ApplicantName == "" || a.Email == "" || a.InstitutionName == "" {
		http.Error(w, "Applicant name, email, and institution are required", http.StatusBadRequest)
		return
	}
	if a.Status == "" {
		a.Status = "pending"
	}
	if a.Country == "" {
		a.Country = "Nigeria"
	}

	query := `INSERT INTO scholarship_applications (applicant_name, email, phone, country, date_of_birth, gender, state_of_origin, lga, institution_name, course_of_study, current_level, cgpa, amount_requested, reason_for_aid, document_url, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(query, a.ApplicantName, a.Email, a.Phone, a.Country, a.DateOfBirth, a.Gender, a.StateOfOrigin, a.LGA, a.InstitutionName, a.CourseOfStudy, a.CurrentLevel, a.CGPA, a.AmountRequested, a.ReasonForAid, a.DocumentURL, a.Status).Scan(&a.ID, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		http.Error(w, "Failed to submit application: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(a)
}

func (h *ApplicationHandler) UpdateScholarshipStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var payload struct {
		Status        string `json:"status"`
		ReviewerNotes string `json:"reviewerNotes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	query := `UPDATE scholarship_applications SET status = $1, reviewer_notes = COALESCE(NULLIF($2, ''), reviewer_notes), updated_at = NOW() WHERE id = $3`
	_, err = h.DB.Exec(query, payload.Status, payload.ReviewerNotes, id)
	if err != nil {
		http.Error(w, "Failed to update status: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "id": id, "status": payload.Status})
}

// --- Skill Acquisition Applications ---

func (h *ApplicationHandler) ListSkills(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	trade := r.URL.Query().Get("trade")

	query := `SELECT id, applicant_name, email, phone, COALESCE(country, 'Nigeria'), COALESCE(gender, ''), 
		COALESCE(address, ''), trade_selected, COALESCE(education_level, ''), 
		COALESCE(employment_status, ''), COALESCE(statement_of_purpose, ''), 
		COALESCE(document_url, ''), status, COALESCE(intake_batch, ''), COALESCE(notes, ''), 
		created_at, updated_at 
		FROM skill_applications WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	if trade != "" {
		query += " AND trade_selected = $" + strconv.Itoa(idx)
		args = append(args, trade)
		idx++
	}
	query += " ORDER BY id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var apps []models.SkillApplication
	for rows.Next() {
		var a models.SkillApplication
		if err := rows.Scan(
			&a.ID, &a.ApplicantName, &a.Email, &a.Phone, &a.Country, &a.Gender,
			&a.Address, &a.TradeSelected, &a.EducationLevel, &a.EmploymentStatus,
			&a.StatementOfPurpose, &a.DocumentURL, &a.Status, &a.IntakeBatch, &a.Notes,
			&a.CreatedAt, &a.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		apps = append(apps, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apps)
}

func (h *ApplicationHandler) CreateSkill(w http.ResponseWriter, r *http.Request) {
	var a models.SkillApplication
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if a.ApplicantName == "" || a.Email == "" || a.TradeSelected == "" {
		http.Error(w, "Applicant name, email, and trade are required", http.StatusBadRequest)
		return
	}
	if a.Country == "" {
		a.Country = "Nigeria"
	}
	if a.Status == "" {
		a.Status = "pending"
	}
	if a.IntakeBatch == "" {
		a.IntakeBatch = "Batch 2026-A"
	}

	query := `INSERT INTO skill_applications (applicant_name, email, phone, country, gender, address, trade_selected, education_level, employment_status, statement_of_purpose, document_url, status, intake_batch, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(query, a.ApplicantName, a.Email, a.Phone, a.Country, a.Gender, a.Address, a.TradeSelected, a.EducationLevel, a.EmploymentStatus, a.StatementOfPurpose, a.DocumentURL, a.Status, a.IntakeBatch, a.Notes).Scan(&a.ID, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		http.Error(w, "Failed to submit skill application: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(a)
}

func (h *ApplicationHandler) UpdateSkillStatus(w http.ResponseWriter, r *http.Request) {
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

	query := `UPDATE skill_applications SET status = $1, notes = COALESCE(NULLIF($2, ''), notes), updated_at = NOW() WHERE id = $3`
	_, err = h.DB.Exec(query, payload.Status, payload.Notes, id)
	if err != nil {
		http.Error(w, "Failed to update status: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "id": id, "status": payload.Status})
}
