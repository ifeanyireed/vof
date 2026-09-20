package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	DatabaseURL   string
	CloudinaryURL string
}

func LoadConfig() *Config {
	// Try loading from .env if present
	_ = godotenv.Load(".env")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("WARNING: DATABASE_URL environment variable is not set")
	}

	cloudinaryURL := os.Getenv("CLOUDINARY_URL")
	if cloudinaryURL == "" {
		log.Println("WARNING: CLOUDINARY_URL environment variable is not set")
	}

	return &Config{
		Port:          port,
		DatabaseURL:   dbURL,
		CloudinaryURL: cloudinaryURL,
	}
}
