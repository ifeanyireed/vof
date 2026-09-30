package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"vof-backend/models"

	"github.com/lib/pq"
)

type PopupHandler struct {
	DB *sql.DB
}

func NewPopupHandler(db *sql.DB) *PopupHandler {
	return &PopupHandler{DB: db}
}

// GetSettings returns popup configuration alongside active campaigns for the showcase
func (h *PopupHandler) GetSettings(w http.ResponseWriter, r *http.Request) {
	var s models.PopupSettings
	var selectedIDs pq.Int64Array

	query := `SELECT id, is_enabled, delay_seconds, COALESCE(headline, 'Active Campaign'), 
		COALESCE(subheadline, 'Support Ongoing Community Initiatives'), COALESCE(cta_text, 'Donate Now'), 
		show_on_mobile, COALESCE(selected_project_ids, '{}'), updated_at 
		FROM popup_settings WHERE id = 1 LIMIT 1`

	err := h.DB.QueryRow(query).Scan(
		&s.ID, &s.IsEnabled, &s.DelaySeconds, &s.Headline,
		&s.Subheadline, &s.CtaText, &s.ShowOnMobile,
		&selectedIDs, &s.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		// Defaults if row not initialized
		s = models.PopupSettings{
			ID:                 1,
			IsEnabled:          true,
			DelaySeconds:       5,
			Headline:           "Active Campaign",
			Subheadline:        "Support Ongoing Community Initiatives",
			CtaText:            "Donate Now",
			ShowOnMobile:       true,
			SelectedProjectIDs: []int{},
		}
	} else if err != nil {
		http.Error(w, "Failed to load popup settings: "+err.Error(), http.StatusInternalServerError)
		return
	}

	s.SelectedProjectIDs = make([]int, len(selectedIDs))
	for i, id := range selectedIDs {
		s.SelectedProjectIDs[i] = int(id)
	}

	// Fetch active charity projects to bundle with the popup
	pQuery := `SELECT id, title, slug, COALESCE(category, 'Outreach'), COALESCE(description, ''), 
		target_amount, raised_amount, currency, COALESCE(location, ''), 
		beneficiaries_count, COALESCE(image_url, ''), status, 
		COALESCE(start_date, ''), COALESCE(end_date, ''), created_at, updated_at 
		FROM charity_projects WHERE status = 'active'`
	
	if len(s.SelectedProjectIDs) > 0 {
		pQuery += " AND id = ANY($1)"
	}
	pQuery += " ORDER BY id ASC"

	var pRows *sql.Rows
	if len(s.SelectedProjectIDs) > 0 {
		pRows, err = h.DB.Query(pQuery, pq.Array(s.SelectedProjectIDs))
	} else {
		pRows, err = h.DB.Query(pQuery)
	}

	if err == nil {
		defer pRows.Close()
		projects := make([]models.CharityProject, 0)
		for pRows.Next() {
			var p models.CharityProject
			if err := pRows.Scan(
				&p.ID, &p.Title, &p.Slug, &p.Category, &p.Description,
				&p.TargetAmount, &p.RaisedAmount, &p.Currency, &p.Location,
				&p.BeneficiariesCount, &p.ImageURL, &p.Status,
				&p.StartDate, &p.EndDate, &p.CreatedAt, &p.UpdatedAt,
			); err == nil {
				projects = append(projects, p)
			}
		}
		s.Projects = projects
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}

// UpdateSettings saves popup configuration changes
func (h *PopupHandler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	var s models.PopupSettings
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if s.DelaySeconds < 1 {
		s.DelaySeconds = 5
	}
	if s.Headline == "" {
		s.Headline = "Active Campaign"
	}
	if s.CtaText == "" {
		s.CtaText = "Donate Now"
	}
	if s.SelectedProjectIDs == nil {
		s.SelectedProjectIDs = []int{}
	}

	query := `INSERT INTO popup_settings (id, is_enabled, delay_seconds, headline, subheadline, cta_text, show_on_mobile, selected_project_ids, updated_at)
		VALUES (1, $1, $2, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (id) DO UPDATE SET 
			is_enabled = EXCLUDED.is_enabled,
			delay_seconds = EXCLUDED.delay_seconds,
			headline = EXCLUDED.headline,
			subheadline = EXCLUDED.subheadline,
			cta_text = EXCLUDED.cta_text,
			show_on_mobile = EXCLUDED.show_on_mobile,
			selected_project_ids = EXCLUDED.selected_project_ids,
			updated_at = NOW()
		RETURNING updated_at`

	err := h.DB.QueryRow(
		query,
		s.IsEnabled, s.DelaySeconds, s.Headline, s.Subheadline, s.CtaText, s.ShowOnMobile, pq.Array(s.SelectedProjectIDs),
	).Scan(&s.UpdatedAt)

	if err != nil {
		http.Error(w, "Failed to update popup settings: "+err.Error(), http.StatusInternalServerError)
		return
	}

	s.ID = 1
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s)
}
