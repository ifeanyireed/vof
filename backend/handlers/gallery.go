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

type GalleryHandler struct {
	DB *sql.DB
}

func NewGalleryHandler(db *sql.DB) *GalleryHandler {
	return &GalleryHandler{DB: db}
}

// List returns all gallery media assets, optionally filtered by category, year, region, or search query
func (h *GalleryHandler) List(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	yearStr := r.URL.Query().Get("year")
	region := r.URL.Query().Get("region")
	status := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")

	query := `SELECT id, title, category, media_url, COALESCE(media_type, 'image'), 
		COALESCE(caption, ''), COALESCE(event_date, ''), COALESCE(year, 2024), 
		COALESCE(region, 'Global'), COALESCE(location, ''), COALESCE(album_title, ''), 
		COALESCE(featured, FALSE), COALESCE(order_index, 0), COALESCE(status, 'published'), 
		created_at, updated_at 
		FROM gallery_items WHERE 1=1`

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

	if region != "" && region != "All" && region != "Global" {
		query += " AND (region = $" + strconv.Itoa(idx) + " OR region = 'Global')"
		args = append(args, region)
		idx++
	}

	if status != "" && status != "All" {
		query += " AND status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}

	if search != "" {
		sPattern := "%" + search + "%"
		query += " AND (title ILIKE $" + strconv.Itoa(idx) + " OR caption ILIKE $" + strconv.Itoa(idx) + " OR location ILIKE $" + strconv.Itoa(idx) + " OR album_title ILIKE $" + strconv.Itoa(idx) + ")"
		args = append(args, sPattern)
		idx++
	}

	query += " ORDER BY id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []models.GalleryItem
	for rows.Next() {
		var item models.GalleryItem
		if err := rows.Scan(
			&item.ID, &item.Title, &item.Category, &item.MediaURL, &item.MediaType,
			&item.Caption, &item.EventDate, &item.Year, &item.Region, &item.Location,
			&item.AlbumTitle, &item.Featured, &item.OrderIndex, &item.Status,
			&item.CreatedAt, &item.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	if items == nil {
		items = []models.GalleryItem{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

// Get retrieves a single gallery media item by its ID
func (h *GalleryHandler) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid media ID", http.StatusBadRequest)
		return
	}

	var item models.GalleryItem
	err = h.DB.QueryRow(`SELECT id, title, category, media_url, COALESCE(media_type, 'image'), 
		COALESCE(caption, ''), COALESCE(event_date, ''), COALESCE(year, 2024), 
		COALESCE(region, 'Global'), COALESCE(location, ''), COALESCE(album_title, ''), 
		COALESCE(featured, FALSE), COALESCE(order_index, 0), COALESCE(status, 'published'), 
		created_at, updated_at 
		FROM gallery_items WHERE id = $1`, id).Scan(
		&item.ID, &item.Title, &item.Category, &item.MediaURL, &item.MediaType,
		&item.Caption, &item.EventDate, &item.Year, &item.Region, &item.Location,
		&item.AlbumTitle, &item.Featured, &item.OrderIndex, &item.Status,
		&item.CreatedAt, &item.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Media item not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// Create stores a new gallery media item added by category and date
func (h *GalleryHandler) Create(w http.ResponseWriter, r *http.Request) {
	var item models.GalleryItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if item.Title == "" || item.MediaURL == "" || item.Category == "" {
		http.Error(w, "Title, Category, and Media URL are required", http.StatusBadRequest)
		return
	}

	if item.MediaType == "" {
		item.MediaType = "image"
	}
	if item.Region == "" {
		item.Region = "Global"
	}
	if item.Status == "" {
		item.Status = "published"
	}
	if item.EventDate == "" {
		item.EventDate = time.Now().Format("2006-01-02")
	}
	if item.Year == 0 {
		if t, err := time.Parse("2006-01-02", item.EventDate); err == nil {
			item.Year = t.Year()
		} else {
			item.Year = time.Now().Year()
		}
	}

	err := h.DB.QueryRow(`INSERT INTO gallery_items 
		(title, category, media_url, media_type, caption, event_date, year, region, location, album_title, featured, order_index, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
		RETURNING id, created_at, updated_at`,
		item.Title, item.Category, item.MediaURL, item.MediaType, item.Caption,
		item.EventDate, item.Year, item.Region, item.Location, item.AlbumTitle,
		item.Featured, item.OrderIndex, item.Status,
	).Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt)

	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

// Update modifies an existing gallery item
func (h *GalleryHandler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid media ID", http.StatusBadRequest)
		return
	}

	var item models.GalleryItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if item.Year == 0 && item.EventDate != "" {
		if t, err := time.Parse("2006-01-02", item.EventDate); err == nil {
			item.Year = t.Year()
		}
	}

	_, err = h.DB.Exec(`UPDATE gallery_items SET 
		title = $1, category = $2, media_url = $3, media_type = $4, caption = $5,
		event_date = $6, year = $7, region = $8, location = $9, album_title = $10,
		featured = $11, order_index = $12, status = $13, updated_at = NOW()
		WHERE id = $14`,
		item.Title, item.Category, item.MediaURL, item.MediaType, item.Caption,
		item.EventDate, item.Year, item.Region, item.Location, item.AlbumTitle,
		item.Featured, item.OrderIndex, item.Status, id,
	)

	if err != nil {
		http.Error(w, "Failed to update media: "+err.Error(), http.StatusInternalServerError)
		return
	}

	item.ID = id
	item.UpdatedAt = time.Now()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// Delete permanently removes a gallery media asset
func (h *GalleryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid media ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM gallery_items WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete media: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
