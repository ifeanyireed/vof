package handlers

import (
	"encoding/json"
	"net/http"
	"path/filepath"
	"strings"

	"vof-backend/services"
)

type UploadHandler struct {
	Cloudinary *services.CloudinaryService
}

func NewUploadHandler(cld *services.CloudinaryService) *UploadHandler {
	return &UploadHandler{Cloudinary: cld}
}

func (h *UploadHandler) Upload(w http.ResponseWriter, r *http.Request) {
	// 20 MB max file size
	if err := r.ParseMultipartForm(20 << 20); err != nil {
		http.Error(w, "File too large or invalid multipart form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to get file from form: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	folder := r.FormValue("folder")
	if folder == "" {
		folder = "vof_uploads"
	}

	baseName := strings.TrimSuffix(header.Filename, filepath.Ext(header.Filename))
	secureURL, err := h.Cloudinary.UploadFile(r.Context(), file, baseName, folder)
	if err != nil {
		http.Error(w, "Cloudinary upload failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"url":      secureURL,
		"filename": header.Filename,
	})
}
