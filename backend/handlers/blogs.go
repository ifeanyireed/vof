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

type BlogHandler struct {
	DB *sql.DB
}

func NewBlogHandler(db *sql.DB) *BlogHandler {
	return &BlogHandler{DB: db}
}

func (h *BlogHandler) List(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	category := r.URL.Query().Get("category")

	query := `SELECT id, slug, title, COALESCE(excerpt, ''), COALESCE(content, ''), COALESCE(category, ''), 
		COALESCE(region, ''), COALESCE(image_url, ''), COALESCE(author_name, ''), COALESCE(author_role, ''), 
		COALESCE(author_avatar, ''), COALESCE(read_time, ''), COALESCE(date_display, ''), COALESCE(day, ''), 
		COALESCE(month, ''), likes, status, created_at, updated_at 
		FROM blogs WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	if category != "" {
		query += " AND category = $" + strconv.Itoa(idx)
		args = append(args, category)
		idx++
	}
	query += " ORDER BY id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var blogs []models.BlogPost
	for rows.Next() {
		var b models.BlogPost
		if err := rows.Scan(
			&b.ID, &b.Slug, &b.Title, &b.Excerpt, &b.Content, &b.Category,
			&b.Region, &b.ImageURL, &b.AuthorName, &b.AuthorRole,
			&b.AuthorAvatar, &b.ReadTime, &b.DateDisplay, &b.Day,
			&b.Month, &b.Likes, &b.Status, &b.CreatedAt, &b.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		blogs = append(blogs, b)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blogs)
}

func (h *BlogHandler) Get(w http.ResponseWriter, r *http.Request) {
	idOrSlug := chi.URLParam(r, "id")

	var b models.BlogPost
	query := `SELECT id, slug, title, COALESCE(excerpt, ''), COALESCE(content, ''), COALESCE(category, ''), 
		COALESCE(region, ''), COALESCE(image_url, ''), COALESCE(author_name, ''), COALESCE(author_role, ''), 
		COALESCE(author_avatar, ''), COALESCE(read_time, ''), COALESCE(date_display, ''), COALESCE(day, ''), 
		COALESCE(month, ''), likes, status, created_at, updated_at 
		FROM blogs WHERE slug = $1 OR id::text = $1 LIMIT 1`

	err := h.DB.QueryRow(query, idOrSlug).Scan(
		&b.ID, &b.Slug, &b.Title, &b.Excerpt, &b.Content, &b.Category,
		&b.Region, &b.ImageURL, &b.AuthorName, &b.AuthorRole,
		&b.AuthorAvatar, &b.ReadTime, &b.DateDisplay, &b.Day,
		&b.Month, &b.Likes, &b.Status, &b.CreatedAt, &b.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		http.Error(w, "Blog post not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(b)
}

func (h *BlogHandler) Create(w http.ResponseWriter, r *http.Request) {
	var b models.BlogPost
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if b.Slug == "" {
		b.Slug = strings.ToLower(strings.ReplaceAll(b.Title, " ", "-"))
	}
	if b.Status == "" {
		b.Status = "published"
	}

	query := `INSERT INTO blogs (slug, title, excerpt, content, category, region, image_url, author_name, author_role, author_avatar, read_time, date_display, day, month, likes, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(query, b.Slug, b.Title, b.Excerpt, b.Content, b.Category, b.Region, b.ImageURL, b.AuthorName, b.AuthorRole, b.AuthorAvatar, b.ReadTime, b.DateDisplay, b.Day, b.Month, b.Likes, b.Status).Scan(&b.ID, &b.CreatedAt, &b.UpdatedAt)
	if err != nil {
		http.Error(w, "Failed to create blog: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(b)
}

func (h *BlogHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var b models.BlogPost
	if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	query := `UPDATE blogs SET 
		title = $1, excerpt = $2, content = $3, category = $4, region = $5, 
		image_url = $6, author_name = $7, author_avatar = $8, date_display = $9, 
		day = $10, month = $11, status = $12, updated_at = NOW()
		WHERE id = $13`

	res, err := h.DB.Exec(query, b.Title, b.Excerpt, b.Content, b.Category, b.Region, b.ImageURL, b.AuthorName, b.AuthorAvatar, b.DateDisplay, b.Day, b.Month, b.Status, id)
	if err != nil {
		http.Error(w, "Failed to update blog: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAff, _ := res.RowsAffected()
	if rowsAff == 0 {
		http.Error(w, "Blog not found", http.StatusNotFound)
		return
	}

	b.ID = id
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Blog updated successfully",
		"id":      id,
	})
}

func (h *BlogHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM blogs WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete blog: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Blog deleted successfully",
	})
}
