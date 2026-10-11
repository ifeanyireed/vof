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

type OutreachHandler struct {
	DB *sql.DB
}

func NewOutreachHandler(db *sql.DB) *OutreachHandler {
	return &OutreachHandler{DB: db}
}

// List returns outreach reports filtered by category, year, status, or search term
func (h *OutreachHandler) List(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	yearStr := r.URL.Query().Get("year")
	status := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")

	query := `SELECT id, slug, title, COALESCE(theme, ''), event_date, year, venue, location, 
		category, summary, objectives, key_activities, compliance_observations, next_steps,
		impact_metrics, financials, delegation_volunteers, signed_by, documents,
		show_financials, show_documents, featured, order_index, status, created_at, updated_at
		FROM outreach_reports WHERE 1=1`

	var args []interface{}
	idx := 1

	if category != "" && category != "All" {
		query += " AND category = $" + strconv.Itoa(idx)
		args = append(args, category)
		idx++
	}

	if yearStr != "" && yearStr != "All" {
		if y, err := strconv.Atoi(yearStr); err == nil {
			query += " AND year = $" + strconv.Itoa(idx)
			args = append(args, y)
			idx++
		}
	}

	if status != "" && status != "All" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}

	if search != "" {
		sPattern := "%" + search + "%"
		query += " AND (title ILIKE $" + strconv.Itoa(idx) + " OR summary ILIKE $" + strconv.Itoa(idx) + " OR location ILIKE $" + strconv.Itoa(idx) + " OR venue ILIKE $" + strconv.Itoa(idx) + ")"
		args = append(args, sPattern)
		idx++
	}

	query += " ORDER BY order_index ASC, id ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, "Failed to query outreach reports: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var reports []models.OutreachReport
	for rows.Next() {
		var rpt models.OutreachReport
		var objectivesBytes, keyActivitiesBytes, complianceBytes, nextStepsBytes []byte
		var impactBytes, delegationBytes, signedByBytes, documentsBytes []byte
		var financialsBytes sql.NullString

		if err := rows.Scan(
			&rpt.ID, &rpt.Slug, &rpt.Title, &rpt.Theme, &rpt.EventDate, &rpt.Year,
			&rpt.Venue, &rpt.Location, &rpt.Category, &rpt.Summary,
			&objectivesBytes, &keyActivitiesBytes, &complianceBytes, &nextStepsBytes,
			&impactBytes, &financialsBytes, &delegationBytes, &signedByBytes, &documentsBytes,
			&rpt.ShowFinancials, &rpt.ShowDocuments, &rpt.Featured, &rpt.OrderIndex, &rpt.Status,
			&rpt.CreatedAt, &rpt.UpdatedAt,
		); err != nil {
			http.Error(w, "Error scanning report: "+err.Error(), http.StatusInternalServerError)
			return
		}

		_ = json.Unmarshal(objectivesBytes, &rpt.Objectives)
		_ = json.Unmarshal(keyActivitiesBytes, &rpt.KeyActivities)
		_ = json.Unmarshal(complianceBytes, &rpt.ComplianceAndObservations)
		_ = json.Unmarshal(nextStepsBytes, &rpt.NextSteps)
		_ = json.Unmarshal(impactBytes, &rpt.ImpactMetrics)
		if financialsBytes.Valid && financialsBytes.String != "" && financialsBytes.String != "null" {
			var fin models.OutreachFinancials
			if err := json.Unmarshal([]byte(financialsBytes.String), &fin); err == nil {
				rpt.Financials = &fin
			}
		}
		_ = json.Unmarshal(delegationBytes, &rpt.DelegationAndVolunteers)
		_ = json.Unmarshal(signedByBytes, &rpt.SignedBy)
		_ = json.Unmarshal(documentsBytes, &rpt.Documents)

		reports = append(reports, rpt)
	}

	if reports == nil {
		reports = []models.OutreachReport{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}

// Get returns a single outreach report by ID or Slug
func (h *OutreachHandler) Get(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	if idParam == "" {
		http.Error(w, "Missing report identifier", http.StatusBadRequest)
		return
	}

	query := `SELECT id, slug, title, COALESCE(theme, ''), event_date, year, venue, location, 
		category, summary, objectives, key_activities, compliance_observations, next_steps,
		impact_metrics, financials, delegation_volunteers, signed_by, documents,
		show_financials, show_documents, featured, order_index, status, created_at, updated_at
		FROM outreach_reports WHERE id::text = $1 OR slug = $1 LIMIT 1`

	var rpt models.OutreachReport
	var objectivesBytes, keyActivitiesBytes, complianceBytes, nextStepsBytes []byte
	var impactBytes, delegationBytes, signedByBytes, documentsBytes []byte
	var financialsBytes sql.NullString

	err := h.DB.QueryRow(query, idParam).Scan(
		&rpt.ID, &rpt.Slug, &rpt.Title, &rpt.Theme, &rpt.EventDate, &rpt.Year,
		&rpt.Venue, &rpt.Location, &rpt.Category, &rpt.Summary,
		&objectivesBytes, &keyActivitiesBytes, &complianceBytes, &nextStepsBytes,
		&impactBytes, &financialsBytes, &delegationBytes, &signedByBytes, &documentsBytes,
		&rpt.ShowFinancials, &rpt.ShowDocuments, &rpt.Featured, &rpt.OrderIndex, &rpt.Status,
		&rpt.CreatedAt, &rpt.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		http.Error(w, "Outreach report not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Failed to retrieve report: "+err.Error(), http.StatusInternalServerError)
		return
	}

	_ = json.Unmarshal(objectivesBytes, &rpt.Objectives)
	_ = json.Unmarshal(keyActivitiesBytes, &rpt.KeyActivities)
	_ = json.Unmarshal(complianceBytes, &rpt.ComplianceAndObservations)
	_ = json.Unmarshal(nextStepsBytes, &rpt.NextSteps)
	_ = json.Unmarshal(impactBytes, &rpt.ImpactMetrics)
	if financialsBytes.Valid && financialsBytes.String != "" && financialsBytes.String != "null" {
		var fin models.OutreachFinancials
		if err := json.Unmarshal([]byte(financialsBytes.String), &fin); err == nil {
			rpt.Financials = &fin
		}
	}
	_ = json.Unmarshal(delegationBytes, &rpt.DelegationAndVolunteers)
	_ = json.Unmarshal(signedByBytes, &rpt.SignedBy)
	_ = json.Unmarshal(documentsBytes, &rpt.Documents)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rpt)
}

// Create inserts a new outreach report
func (h *OutreachHandler) Create(w http.ResponseWriter, r *http.Request) {
	var rpt models.OutreachReport
	if err := json.NewDecoder(r.Body).Decode(&rpt); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(rpt.Title) == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	if rpt.Slug == "" {
		rpt.Slug = strings.ToLower(strings.ReplaceAll(rpt.Title, " ", "-"))
	}
	if rpt.Status == "" {
		rpt.Status = "published"
	}

	objJSON, _ := json.Marshal(rpt.Objectives)
	actJSON, _ := json.Marshal(rpt.KeyActivities)
	compJSON, _ := json.Marshal(rpt.ComplianceAndObservations)
	nextJSON, _ := json.Marshal(rpt.NextSteps)
	impJSON, _ := json.Marshal(rpt.ImpactMetrics)
	delJSON, _ := json.Marshal(rpt.DelegationAndVolunteers)
	sigJSON, _ := json.Marshal(rpt.SignedBy)
	docJSON, _ := json.Marshal(rpt.Documents)

	var finJSON *string
	if rpt.Financials != nil {
		bytes, _ := json.Marshal(rpt.Financials)
		s := string(bytes)
		finJSON = &s
	}

	query := `INSERT INTO outreach_reports (
		slug, title, theme, event_date, year, venue, location, category, summary,
		objectives, key_activities, compliance_observations, next_steps,
		impact_metrics, financials, delegation_volunteers, signed_by, documents,
		show_financials, show_documents, featured, order_index, status
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9,
		$10, $11, $12, $13,
		$14, $15, $16, $17, $18,
		$19, $20, $21, $22, $23
	) RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(
		query,
		rpt.Slug, rpt.Title, rpt.Theme, rpt.EventDate, rpt.Year, rpt.Venue, rpt.Location, rpt.Category, rpt.Summary,
		objJSON, actJSON, compJSON, nextJSON,
		impJSON, finJSON, delJSON, sigJSON, docJSON,
		rpt.ShowFinancials, rpt.ShowDocuments, rpt.Featured, rpt.OrderIndex, rpt.Status,
	).Scan(&rpt.ID, &rpt.CreatedAt, &rpt.UpdatedAt)

	if err != nil {
		http.Error(w, "Failed to create outreach report: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(rpt)
}

// Update modifies an existing outreach report
func (h *OutreachHandler) Update(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var rpt models.OutreachReport
	if err := json.NewDecoder(r.Body).Decode(&rpt); err != nil {
		http.Error(w, "Invalid payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	objJSON, _ := json.Marshal(rpt.Objectives)
	actJSON, _ := json.Marshal(rpt.KeyActivities)
	compJSON, _ := json.Marshal(rpt.ComplianceAndObservations)
	nextJSON, _ := json.Marshal(rpt.NextSteps)
	impJSON, _ := json.Marshal(rpt.ImpactMetrics)
	delJSON, _ := json.Marshal(rpt.DelegationAndVolunteers)
	sigJSON, _ := json.Marshal(rpt.SignedBy)
	docJSON, _ := json.Marshal(rpt.Documents)

	var finJSON *string
	if rpt.Financials != nil {
		bytes, _ := json.Marshal(rpt.Financials)
		s := string(bytes)
		finJSON = &s
	}

	query := `UPDATE outreach_reports SET
		title = $1, theme = $2, event_date = $3, year = $4, venue = $5, location = $6, category = $7, summary = $8,
		objectives = $9, key_activities = $10, compliance_observations = $11, next_steps = $12,
		impact_metrics = $13, financials = $14, delegation_volunteers = $15, signed_by = $16, documents = $17,
		show_financials = $18, show_documents = $19, featured = $20, order_index = $21, status = $22, updated_at = NOW()
		WHERE id = $23`

	_, err = h.DB.Exec(
		query,
		rpt.Title, rpt.Theme, rpt.EventDate, rpt.Year, rpt.Venue, rpt.Location, rpt.Category, rpt.Summary,
		objJSON, actJSON, compJSON, nextJSON,
		impJSON, finJSON, delJSON, sigJSON, docJSON,
		rpt.ShowFinancials, rpt.ShowDocuments, rpt.Featured, rpt.OrderIndex, rpt.Status, id,
	)
	if err != nil {
		http.Error(w, "Failed to update outreach report: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "id": id})
}

// Delete removes an outreach report
func (h *OutreachHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM outreach_reports WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete outreach report: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
}
