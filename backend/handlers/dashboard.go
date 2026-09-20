package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"vof-backend/models"
)

type DashboardHandler struct {
	DB *sql.DB
}

func NewDashboardHandler(db *sql.DB) *DashboardHandler {
	return &DashboardHandler{DB: db}
}

func (h *DashboardHandler) Overview(w http.ResponseWriter, r *http.Request) {
	var stats models.DashboardStats

	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0), COUNT(*) FROM donations WHERE currency = 'NGN' AND status = 'completed'").Scan(&stats.TotalFundsRaisedNGN, &stats.TotalDonationsCount)
	_ = h.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM donations WHERE currency = 'USD' AND status = 'completed'").Scan(&stats.TotalFundsRaisedUSD)

	_ = h.DB.QueryRow("SELECT COUNT(*) FROM charity_projects WHERE status = 'active'").Scan(&stats.ActiveProjectsCount)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM volunteers").Scan(&stats.TotalVolunteersCount)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM scholarship_applications WHERE status = 'pending'").Scan(&stats.PendingScholarships)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM skill_applications WHERE status = 'pending'").Scan(&stats.PendingSkillApps)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM blogs WHERE status = 'published'").Scan(&stats.PublishedBlogsCount)

	_ = h.DB.QueryRow("SELECT COALESCE(SUM(balance), 0) FROM financial_accounts WHERE currency = 'NGN'").Scan(&stats.TotalAccountBalanceNGN)
	_ = h.DB.QueryRow("SELECT COALESCE(SUM(balance), 0) FROM financial_accounts WHERE currency = 'USD'").Scan(&stats.TotalAccountBalanceUSD)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
