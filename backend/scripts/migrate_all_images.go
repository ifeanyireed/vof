package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type ImageMigrationResult struct {
	LocalPath     string `json:"local_path"`
	CloudinaryURL string `json:"cloudinary_url"`
	PublicID      string `json:"public_id"`
}

func main() {
	cldURL := "cloudinary://471389829985299:73lW8nFAXx-fD3LU38sQ8GRmksc@kmflnrxu"
	cld, err := cloudinary.NewFromURL(cldURL)
	if err != nil {
		fmt.Printf("Init error: %v\n", err)
		os.Exit(1)
	}

	publicDir := "../web-app/public"
	var filesToUpload []string

	validExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".svg":  true,
		".gif":  true,
	}

	err = filepath.WalkDir(publicDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		if validExts[ext] {
			// Skip next.svg, vercel.svg, file.svg, window.svg, globe.svg
			base := filepath.Base(path)
			if base == "next.svg" || base == "vercel.svg" || base == "file.svg" || base == "window.svg" || base == "globe.svg" {
				return nil
			}
			filesToUpload = append(filesToUpload, path)
		}
		return nil
	})
	if err != nil {
		fmt.Printf("Walk error: %v\n", err)
		os.Exit(1)
	}

	// Also check root images like IMG-*.jpeg
	rootFiles, _ := filepath.Glob("../*.jpeg")
	for _, rf := range rootFiles {
		filesToUpload = append(filesToUpload, rf)
	}
	rootJpgs, _ := filepath.Glob("../*.jpg")
	for _, rf := range rootJpgs {
		filesToUpload = append(filesToUpload, rf)
	}

	fmt.Printf("Found %d images to upload to Cloudinary.\n", len(filesToUpload))

	results := make(map[string]ImageMigrationResult)
	var mu sync.Mutex
	var completed int64
	total := int64(len(filesToUpload))

	// Concurrency worker pool
	jobs := make(chan string, len(filesToUpload))
	for _, f := range filesToUpload {
		jobs <- f
	}
	close(jobs)

	numWorkers := 8
	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for filePath := range jobs {
				relPath := ""
				folder := "vof"
				publicID := ""

				if strings.HasPrefix(filePath, publicDir) {
					rel, _ := filepath.Rel(publicDir, filePath)
					relPath = "/" + filepath.ToSlash(rel)
					dir := filepath.Dir(rel)
					if dir != "." {
						folder = "vof/" + filepath.ToSlash(dir)
					}
					baseName := strings.TrimSuffix(filepath.Base(rel), filepath.Ext(rel))
					publicID = baseName
				} else {
					// Root file
					base := filepath.Base(filePath)
					relPath = "/" + base
					folder = "vof/root"
					publicID = strings.TrimSuffix(base, filepath.Ext(base))
				}

				// Upload to Cloudinary with retry
				var uploadedURL string
				var uploadErr error
				for attempt := 1; attempt <= 3; attempt++ {
					f, err := os.Open(filePath)
					if err != nil {
						uploadErr = err
						break
					}

					unique := false
					overwrite := true
					resourceType := "image"
					if strings.HasSuffix(strings.ToLower(filePath), ".svg") {
						resourceType = "auto"
					}

					resp, err := cld.Upload.Upload(context.Background(), f, uploader.UploadParams{
						Folder:         folder,
						PublicID:       publicID,
						UniqueFilename: &unique,
						Overwrite:      &overwrite,
						ResourceType:   resourceType,
					})
					f.Close()

					if err == nil {
						uploadedURL = resp.SecureURL
						uploadErr = nil
						break
					} else {
						uploadErr = err
						time.Sleep(time.Duration(attempt) * 500 * time.Millisecond)
					}
				}

				done := atomic.AddInt64(&completed, 1)
				if uploadErr != nil {
					fmt.Printf("[%d/%d] FAILED: %s -> %v\n", done, total, relPath, uploadErr)
				} else {
					fmt.Printf("[%d/%d] UPLOADED: %s -> %s\n", done, total, relPath, uploadedURL)
					mu.Lock()
					results[relPath] = ImageMigrationResult{
						LocalPath:     relPath,
						CloudinaryURL: uploadedURL,
						PublicID:      folder + "/" + publicID,
					}
					mu.Unlock()
				}
			}
		}()
	}

	wg.Wait()

	// Write mapping to JSON files
	mapJSON, _ := json.MarshalIndent(results, "", "  ")
	_ = os.WriteFile("cloudinary_mapping.json", mapJSON, 0644)
	_ = os.WriteFile("../web-app/src/data/cloudinaryMap.json", mapJSON, 0644)

	fmt.Printf("\nSUCCESSFULLY MIGRATED %d / %d IMAGES TO CLOUDINARY!\n", len(results), total)
}
