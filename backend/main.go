package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"vof-backend/config"
	"vof-backend/database"
	"vof-backend/handlers"
	"vof-backend/services"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	cfg := config.LoadConfig()

	// Connect to Neon Postgres & migrate
	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Initialize Cloudinary Service
	cldService, err := services.NewCloudinaryService(cfg.CloudinaryURL)
	if err != nil {
		log.Printf("Warning: Cloudinary initialization error: %v", err)
	} else {
		log.Println("Cloudinary service initialized successfully")
	}

	// Instantiate Handlers
	blogHandler := handlers.NewBlogHandler(db)
	donationHandler := handlers.NewDonationHandler(db)
	volunteerHandler := handlers.NewVolunteerHandler(db)
	partnerHandler := handlers.NewPartnerHandler(db)
	projectHandler := handlers.NewProjectHandler(db)
	appHandler := handlers.NewApplicationHandler(db)
	financialHandler := handlers.NewFinancialHandler(db)
	galleryHandler := handlers.NewGalleryHandler(db)
	uploadHandler := handlers.NewUploadHandler(cldService)
	dashboardHandler := handlers.NewDashboardHandler(db)

	// Setup Router
	r := chi.NewRouter()

	// Standard Middleware
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// CORS Setup
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001", "https://vof-gamma.vercel.app", "https://*.vercel.app", "https://vonf.org", "https://www.vonf.org", "http://127.0.0.1:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health Check
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","message":"Veronica Onyeneke Foundation API is healthy","timestamp":"` + time.Now().Format(time.RFC3339) + `"}`))
	})

	// API Routes Group
	r.Route("/api", func(api chi.Router) {
		// Dashboard Overview
		api.Get("/dashboard/overview", dashboardHandler.Overview)

		// 1. Blog CMS Management
		api.Route("/blogs", func(r chi.Router) {
			r.Get("/", blogHandler.List)
			r.Post("/", blogHandler.Create)
			r.Get("/{id}", blogHandler.Get)
			r.Put("/{id}", blogHandler.Update)
			r.Delete("/{id}", blogHandler.Delete)
		})

		// 2. Donation Funds Management
		api.Route("/donations", func(r chi.Router) {
			r.Get("/", donationHandler.List)
			r.Post("/", donationHandler.Create)
			r.Delete("/{id}", donationHandler.Delete)
			r.Get("/stats", donationHandler.Stats)
		})

		// 3. Volunteer SignUp and List
		api.Route("/volunteers", func(r chi.Router) {
			r.Get("/", volunteerHandler.List)
			r.Post("/", volunteerHandler.Create) // Public volunteer signup
			r.Patch("/{id}/status", volunteerHandler.UpdateStatus)
			r.Delete("/{id}", volunteerHandler.Delete)
		})

		// 3b. Partner Inquiries & Collaborations
		api.Route("/partners", func(r chi.Router) {
			r.Get("/", partnerHandler.List)
			r.Post("/", partnerHandler.Create) // Public partner inquiry form
			r.Patch("/{id}/status", partnerHandler.UpdateStatus)
			r.Delete("/{id}", partnerHandler.Delete)
		})

		// 4. Charity Projects Management
		api.Route("/projects", func(r chi.Router) {
			r.Get("/", projectHandler.List)
			r.Post("/", projectHandler.Create)
			r.Put("/{id}", projectHandler.Update)
			r.Delete("/{id}", projectHandler.Delete)
		})

		// 5. Scholarship & Skill Acquisition Applications
		api.Route("/applications", func(r chi.Router) {
			r.Get("/scholarships", appHandler.ListScholarships)
			r.Post("/scholarships", appHandler.CreateScholarship) // Public student application
			r.Patch("/scholarships/{id}/status", appHandler.UpdateScholarshipStatus)

			r.Get("/skills", appHandler.ListSkills)
			r.Post("/skills", appHandler.CreateSkill) // Public VOIE student application
			r.Patch("/skills/{id}/status", appHandler.UpdateSkillStatus)
		})

		// 6. Financial Accounts & Transactions
		api.Route("/financials", func(r chi.Router) {
			r.Get("/accounts", financialHandler.ListAccounts)
			r.Post("/accounts", financialHandler.CreateAccount)
			r.Get("/transactions", financialHandler.ListTransactions)
			r.Post("/transactions", financialHandler.CreateTransaction)
			r.Get("/summary", financialHandler.GetSummary)
		})

		// 7. Gallery Media Management (Category, Date, Media Assets)
		api.Route("/gallery", func(r chi.Router) {
			r.Get("/", galleryHandler.List)
			r.Post("/", galleryHandler.Create)
			r.Get("/{id}", galleryHandler.Get)
			r.Put("/{id}", galleryHandler.Update)
			r.Delete("/{id}", galleryHandler.Delete)
		})

		// Cloudinary Upload
		api.Post("/upload", uploadHandler.Upload)
	})

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Starting VOF Go Backend on %s...\n", serverAddr)
	if err := http.ListenAndServe(serverAddr, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
