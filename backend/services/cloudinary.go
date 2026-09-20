package services

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
}

func NewCloudinaryService(cloudinaryURL string) (*CloudinaryService, error) {
	if cloudinaryURL == "" {
		return nil, fmt.Errorf("cloudinary URL is empty")
	}

	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return nil, fmt.Errorf("failed to init cloudinary from URL: %w", err)
	}

	return &CloudinaryService{cld: cld}, nil
}

func (s *CloudinaryService) UploadFile(ctx context.Context, file io.Reader, filename string, folder string) (string, error) {
	if s == nil || s.cld == nil {
		return "", fmt.Errorf("cloudinary service not configured")
	}

	unique := true
	overwrite := false
	uploadParams := uploader.UploadParams{
		Folder:         folder,
		PublicID:       fmt.Sprintf("%s_%d", filename, time.Now().Unix()),
		UniqueFilename: &unique,
		Overwrite:      &overwrite,
	}

	uploadResult, err := s.cld.Upload.Upload(ctx, file, uploadParams)
	if err != nil {
		return "", fmt.Errorf("cloudinary upload error: %w", err)
	}

	return uploadResult.SecureURL, nil
}
