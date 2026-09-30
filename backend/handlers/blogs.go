package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"vof-backend/models"

	"github.com/go-chi/chi/v5"
	"github.com/lib/pq"
)

type BlogHandler struct {
	DB *sql.DB
}

func NewBlogHandler(db *sql.DB) *BlogHandler {
	return &BlogHandler{DB: db}
}

// helper to slugify strings
var nonAlphaNumRegex = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = nonAlphaNumRegex.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

// ==========================================
// 1. BLOG POSTS CRUD
// ==========================================

func (h *BlogHandler) List(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	category := r.URL.Query().Get("category")
	tag := r.URL.Query().Get("tag")
	search := r.URL.Query().Get("search")

	query := `SELECT b.id, b.slug, b.title, COALESCE(b.excerpt, ''), COALESCE(b.content, ''), 
		COALESCE(b.category, ''), b.category_id, COALESCE(b.tags, '{}'),
		COALESCE(b.region, ''), COALESCE(b.image_url, ''), COALESCE(b.author_name, ''), COALESCE(b.author_role, ''), 
		COALESCE(b.author_avatar, ''), COALESCE(b.read_time, ''), COALESCE(b.date_display, ''), COALESCE(b.day, ''), 
		COALESCE(b.month, ''), b.likes, b.status, b.created_at, b.updated_at 
		FROM blogs b 
		LEFT JOIN blog_categories c ON b.category_id = c.id
		WHERE 1=1`
	var args []interface{}
	idx := 1

	if status != "" && status != "all" {
		query += " AND b.status = $" + strconv.Itoa(idx)
		args = append(args, status)
		idx++
	}
	if category != "" && category != "All" {
		query += " AND (b.category ILIKE $" + strconv.Itoa(idx) + " OR c.slug = $" + strconv.Itoa(idx) + " OR c.name ILIKE $" + strconv.Itoa(idx) + ")"
		args = append(args, category)
		idx++
	}
	if tag != "" && tag != "All" {
		query += " AND $" + strconv.Itoa(idx) + " = ANY(b.tags)"
		args = append(args, tag)
		idx++
	}
	if search != "" {
		query += " AND (b.title ILIKE $" + strconv.Itoa(idx) + " OR b.excerpt ILIKE $" + strconv.Itoa(idx) + " OR b.content ILIKE $" + strconv.Itoa(idx) + ")"
		args = append(args, "%"+search+"%")
		idx++
	}
	query += " ORDER BY b.id DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	blogs := make([]models.BlogPost, 0)
	for rows.Next() {
		var b models.BlogPost
		var tags pq.StringArray
		if err := rows.Scan(
			&b.ID, &b.Slug, &b.Title, &b.Excerpt, &b.Content, &b.Category,
			&b.CategoryID, &tags,
			&b.Region, &b.ImageURL, &b.AuthorName, &b.AuthorRole,
			&b.AuthorAvatar, &b.ReadTime, &b.DateDisplay, &b.Day,
			&b.Month, &b.Likes, &b.Status, &b.CreatedAt, &b.UpdatedAt,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		b.Tags = []string(tags)
		if b.Tags == nil {
			b.Tags = []string{}
		}
		blogs = append(blogs, b)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blogs)
}

func (h *BlogHandler) Get(w http.ResponseWriter, r *http.Request) {
	idOrSlug := chi.URLParam(r, "id")

	var b models.BlogPost
	var tags pq.StringArray
	query := `SELECT b.id, b.slug, b.title, COALESCE(b.excerpt, ''), COALESCE(b.content, ''), 
		COALESCE(b.category, ''), b.category_id, COALESCE(b.tags, '{}'),
		COALESCE(b.region, ''), COALESCE(b.image_url, ''), COALESCE(b.author_name, ''), COALESCE(b.author_role, ''), 
		COALESCE(b.author_avatar, ''), COALESCE(b.read_time, ''), COALESCE(b.date_display, ''), COALESCE(b.day, ''), 
		COALESCE(b.month, ''), b.likes, b.status, b.created_at, b.updated_at 
		FROM blogs b 
		WHERE b.slug = $1 OR b.id::text = $1 LIMIT 1`

	err := h.DB.QueryRow(query, idOrSlug).Scan(
		&b.ID, &b.Slug, &b.Title, &b.Excerpt, &b.Content, &b.Category,
		&b.CategoryID, &tags,
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

	b.Tags = []string(tags)
	if b.Tags == nil {
		b.Tags = []string{}
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
		b.Slug = slugify(b.Title)
	}
	if b.Status == "" {
		b.Status = "published"
	}
	if b.Tags == nil {
		b.Tags = []string{}
	}

	// Auto-resolve category_id if not supplied but category name exists
	if b.CategoryID == nil && b.Category != "" {
		var catID int
		err := h.DB.QueryRow("SELECT id FROM blog_categories WHERE name ILIKE $1 LIMIT 1", b.Category).Scan(&catID)
		if err == nil {
			b.CategoryID = &catID
		}
	}

	query := `INSERT INTO blogs (slug, title, excerpt, content, category, category_id, tags, region, image_url, author_name, author_role, author_avatar, read_time, date_display, day, month, likes, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
		RETURNING id, created_at, updated_at`

	err := h.DB.QueryRow(
		query,
		b.Slug, b.Title, b.Excerpt, b.Content, b.Category, b.CategoryID, pq.Array(b.Tags),
		b.Region, b.ImageURL, b.AuthorName, b.AuthorRole, b.AuthorAvatar,
		b.ReadTime, b.DateDisplay, b.Day, b.Month, b.Likes, b.Status,
	).Scan(&b.ID, &b.CreatedAt, &b.UpdatedAt)

	if err != nil {
		http.Error(w, "Failed to create blog: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Ensure any new tags are inserted into blog_tags
	for _, tagName := range b.Tags {
		tTrim := strings.TrimSpace(tagName)
		if tTrim != "" {
			_, _ = h.DB.Exec("INSERT INTO blog_tags (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING", tTrim, slugify(tTrim))
		}
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

	if b.Tags == nil {
		b.Tags = []string{}
	}

	// Auto-resolve category_id if not supplied but category name exists
	if b.CategoryID == nil && b.Category != "" {
		var catID int
		err := h.DB.QueryRow("SELECT id FROM blog_categories WHERE name ILIKE $1 LIMIT 1", b.Category).Scan(&catID)
		if err == nil {
			b.CategoryID = &catID
		}
	}

	query := `UPDATE blogs SET 
		title = $1, excerpt = $2, content = $3, category = $4, category_id = $5, tags = $6, region = $7, 
		image_url = $8, author_name = $9, author_avatar = $10, date_display = $11, 
		day = $12, month = $13, status = $14, updated_at = NOW()
		WHERE id = $15`

	res, err := h.DB.Exec(
		query,
		b.Title, b.Excerpt, b.Content, b.Category, b.CategoryID, pq.Array(b.Tags), b.Region,
		b.ImageURL, b.AuthorName, b.AuthorAvatar, b.DateDisplay,
		b.Day, b.Month, b.Status, id,
	)
	if err != nil {
		http.Error(w, "Failed to update blog: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAff, _ := res.RowsAffected()
	if rowsAff == 0 {
		http.Error(w, "Blog not found", http.StatusNotFound)
		return
	}

	// Ensure any new tags are inserted into blog_tags
	for _, tagName := range b.Tags {
		tTrim := strings.TrimSpace(tagName)
		if tTrim != "" {
			_, _ = h.DB.Exec("INSERT INTO blog_tags (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING", tTrim, slugify(tTrim))
		}
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

// Like increments the like counter for a post
func (h *BlogHandler) Like(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var newLikes int
	err = h.DB.QueryRow("UPDATE blogs SET likes = likes + 1 WHERE id = $1 RETURNING likes", id).Scan(&newLikes)
	if err != nil {
		http.Error(w, "Failed to like post: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"likes":   newLikes,
	})
}

// ==========================================
// 2. CATEGORIES CRUD
// ==========================================

func (h *BlogHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	query := `SELECT c.id, c.name, c.slug, COALESCE(c.description, ''), COALESCE(c.color, '#558b1a'), c.created_at,
		COUNT(b.id) AS post_count
		FROM blog_categories c
		LEFT JOIN blogs b ON b.category_id = c.id OR b.category ILIKE c.name
		GROUP BY c.id
		ORDER BY c.name ASC`

	rows, err := h.DB.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	categories := make([]models.BlogCategory, 0)
	for rows.Next() {
		var c models.BlogCategory
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.Description, &c.Color, &c.CreatedAt, &c.PostCount); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

func (h *BlogHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var c models.BlogCategory
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	c.Name = strings.TrimSpace(c.Name)
	if c.Name == "" {
		http.Error(w, "Category name is required", http.StatusBadRequest)
		return
	}
	if c.Slug == "" {
		c.Slug = slugify(c.Name)
	}
	if c.Color == "" {
		c.Color = "#558b1a"
	}

	query := `INSERT INTO blog_categories (name, slug, description, color)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`

	err := h.DB.QueryRow(query, c.Name, c.Slug, c.Description, c.Color).Scan(&c.ID, &c.CreatedAt)
	if err != nil {
		http.Error(w, "Failed to create category: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(c)
}

func (h *BlogHandler) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var c models.BlogCategory
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if c.Slug == "" {
		c.Slug = slugify(c.Name)
	}

	query := `UPDATE blog_categories SET name = $1, slug = $2, description = $3, color = $4 WHERE id = $5`
	_, err = h.DB.Exec(query, c.Name, c.Slug, c.Description, c.Color, id)
	if err != nil {
		http.Error(w, "Failed to update category: "+err.Error(), http.StatusInternalServerError)
		return
	}

	c.ID = id
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func (h *BlogHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM blog_categories WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete category: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Category deleted successfully",
	})
}

// ==========================================
// 3. TAGS CRUD
// ==========================================

func (h *BlogHandler) ListTags(w http.ResponseWriter, r *http.Request) {
	query := `SELECT t.id, t.name, t.slug, t.created_at,
		COUNT(b.id) AS post_count
		FROM blog_tags t
		LEFT JOIN blogs b ON t.name = ANY(b.tags)
		GROUP BY t.id
		ORDER BY t.name ASC`

	rows, err := h.DB.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tags := make([]models.BlogTag, 0)
	for rows.Next() {
		var t models.BlogTag
		if err := rows.Scan(&t.ID, &t.Name, &t.Slug, &t.CreatedAt, &t.PostCount); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tags = append(tags, t)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func (h *BlogHandler) CreateTag(w http.ResponseWriter, r *http.Request) {
	var t models.BlogTag
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	t.Name = strings.TrimSpace(t.Name)
	if t.Name == "" {
		http.Error(w, "Tag name is required", http.StatusBadRequest)
		return
	}
	if t.Slug == "" {
		t.Slug = slugify(t.Name)
	}

	query := `INSERT INTO blog_tags (name, slug)
		VALUES ($1, $2)
		ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
		RETURNING id, created_at`

	err := h.DB.QueryRow(query, t.Name, t.Slug).Scan(&t.ID, &t.CreatedAt)
	if err != nil {
		http.Error(w, "Failed to create tag: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

func (h *BlogHandler) DeleteTag(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = h.DB.Exec("DELETE FROM blog_tags WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete tag: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Tag deleted successfully",
	})
}
