package database

import (
	"database/sql"
	"fmt"
	"log"
)

func RunMigrations(db *sql.DB) error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS blogs (
			id SERIAL PRIMARY KEY,
			slug VARCHAR(255) UNIQUE NOT NULL,
			title VARCHAR(255) NOT NULL,
			excerpt TEXT,
			content TEXT,
			category VARCHAR(100),
			region VARCHAR(100),
			image_url TEXT,
			author_name VARCHAR(100),
			author_role VARCHAR(100),
			author_avatar TEXT,
			read_time VARCHAR(50) DEFAULT '4 min read',
			date_display VARCHAR(50),
			day VARCHAR(10),
			month VARCHAR(10),
			likes INT DEFAULT 0,
			status VARCHAR(20) DEFAULT 'published',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS donations (
			id SERIAL PRIMARY KEY,
			donor_name VARCHAR(255) NOT NULL,
			donor_email VARCHAR(255),
			donor_phone VARCHAR(50),
			amount NUMERIC(14,2) NOT NULL,
			currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
			campaign VARCHAR(255) DEFAULT 'General Donation',
			payment_method VARCHAR(50) DEFAULT 'Bank Transfer',
			reference VARCHAR(100),
			status VARCHAR(50) DEFAULT 'completed',
			anonymous BOOLEAN DEFAULT FALSE,
			notes TEXT,
			donated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS volunteers (
			id SERIAL PRIMARY KEY,
			full_name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			phone VARCHAR(50) NOT NULL,
			location VARCHAR(255),
			interest_area VARCHAR(100),
			availability VARCHAR(100) DEFAULT 'Weekends',
			skills_experience TEXT,
			status VARCHAR(50) DEFAULT 'new',
			notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS partners (
			id SERIAL PRIMARY KEY,
			organization_name VARCHAR(255) NOT NULL,
			partner_type VARCHAR(100) NOT NULL DEFAULT 'Corporate',
			contact_person VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			phone VARCHAR(50) NOT NULL,
			country VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
			city VARCHAR(100),
			website VARCHAR(255),
			partnership_interest VARCHAR(150),
			message TEXT,
			status VARCHAR(50) DEFAULT 'new',
			notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS gallery_items (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			category VARCHAR(100) NOT NULL DEFAULT 'Vocational Skills',
			media_url TEXT NOT NULL,
			media_type VARCHAR(20) DEFAULT 'image',
			caption TEXT,
			event_date VARCHAR(50),
			year INT DEFAULT 2024,
			region VARCHAR(50) DEFAULT 'Global',
			location VARCHAR(255),
			album_title VARCHAR(255),
			featured BOOLEAN DEFAULT FALSE,
			order_index INT DEFAULT 0,
			status VARCHAR(20) DEFAULT 'published',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS charity_projects (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			slug VARCHAR(255) UNIQUE NOT NULL,
			category VARCHAR(100),
			description TEXT,
			target_amount NUMERIC(14,2) NOT NULL,
			raised_amount NUMERIC(14,2) DEFAULT 0,
			currency VARCHAR(10) DEFAULT 'NGN',
			location VARCHAR(255),
			beneficiaries_count INT DEFAULT 0,
			image_url TEXT,
			status VARCHAR(50) DEFAULT 'active',
			start_date VARCHAR(50),
			end_date VARCHAR(50),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS scholarship_applications (
			id SERIAL PRIMARY KEY,
			applicant_name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			phone VARCHAR(50) NOT NULL,
			date_of_birth VARCHAR(50),
			gender VARCHAR(20),
			state_of_origin VARCHAR(100),
			lga VARCHAR(100),
			institution_name VARCHAR(255) NOT NULL,
			course_of_study VARCHAR(255) NOT NULL,
			current_level VARCHAR(50),
			cgpa VARCHAR(20),
			amount_requested NUMERIC(14,2) DEFAULT 0,
			reason_for_aid TEXT,
			document_url TEXT,
			status VARCHAR(50) DEFAULT 'pending',
			reviewer_notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS skill_applications (
			id SERIAL PRIMARY KEY,
			applicant_name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			phone VARCHAR(50) NOT NULL,
			gender VARCHAR(20),
			address VARCHAR(255),
			trade_selected VARCHAR(100) NOT NULL,
			education_level VARCHAR(100),
			employment_status VARCHAR(100),
			statement_of_purpose TEXT,
			status VARCHAR(50) DEFAULT 'pending',
			intake_batch VARCHAR(50) DEFAULT 'Batch 2026-A',
			notes TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS financial_accounts (
			id SERIAL PRIMARY KEY,
			account_name VARCHAR(255) NOT NULL,
			account_number VARCHAR(100),
			bank_name VARCHAR(100),
			currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
			balance NUMERIC(16,2) NOT NULL DEFAULT 0,
			type VARCHAR(50) DEFAULT 'checking',
			status VARCHAR(50) DEFAULT 'active',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS financial_transactions (
			id SERIAL PRIMARY KEY,
			account_id INT REFERENCES financial_accounts(id) ON DELETE SET NULL,
			transaction_type VARCHAR(20) NOT NULL,
			category VARCHAR(100) NOT NULL,
			amount NUMERIC(14,2) NOT NULL,
			currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
			description TEXT NOT NULL,
			reference VARCHAR(100),
			related_project_id INT REFERENCES charity_projects(id) ON DELETE SET NULL,
			transaction_date VARCHAR(50) NOT NULL,
			receipt_url TEXT,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);`,

		`ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'Nigeria';`,
		`ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS resume_url TEXT;`,
		`ALTER TABLE scholarship_applications ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'Nigeria';`,
		`ALTER TABLE skill_applications ADD COLUMN IF NOT EXISTS country VARCHAR(50) DEFAULT 'Nigeria';`,
		`ALTER TABLE skill_applications ADD COLUMN IF NOT EXISTS document_url TEXT;`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return fmt.Errorf("migration error: %w", err)
		}
	}

	log.Println("Database schema verified & tables migrated")
	return seedInitialData(db)
}

func seedInitialData(db *sql.DB) error {
	// Seed Blogs if empty
	var blogCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM blogs").Scan(&blogCount)
	if blogCount == 0 {
		log.Println("Seeding initial blogs...")
		blogs := []struct {
			slug, title, excerpt, content, category, region, image, author, avatar, date, day, month string
			likes                                                                                     int
		}{
			{
				slug:     "appreciation-message",
				title:    "Appreciation Message: Beyond the Degree Program",
				excerpt:  "On behalf of the student community, the SUG Vice Presidency of Alvan Ikoku Federal University of Education expresses deep gratitude to VOF for funding the 'Beyond the Degree' student empowerment initiative.",
				content:  "From the Office of the SUG Vice President, AIFUE. On behalf of my office and the entire student community, I extend my deepest appreciation to the Veronica Onyeneke Foundation.",
				category: "Education Support",
				region:   "IMO STATE, NIGERIA",
				image:    "/blog/appreciation-aifue.jpg",
				author:   "Comr. Okereke Stellamaris",
				avatar:   "/team/charles-onyeneke.jpg",
				date:     "May 10, 2026",
				day:      "10",
				month:    "MAY",
				likes:    3200,
			},
			{
				slug:     "valentines-day-outreach",
				title:    "Spreading Hope: 14th February Rural Food Outreach & JAMB Candidate Registration",
				excerpt:  "Highlights from our February rural food distribution outreach and the nationwide JAMB candidate scholarship registration for aspiring university students.",
				content:  "You won't believe the joy we captured here. More pictures from our concluded 14th February outreach showing up changes lives.",
				category: "Community Outreach",
				region:   "NIGERIA",
				image:    "/blog/valentines-outreach.jpg",
				author:   "VOF Outreach Team",
				avatar:   "/team/charles-onyeneke.jpg",
				date:     "February 19, 2026",
				day:      "19",
				month:    "FEB",
				likes:    4800,
			},
			{
				slug:     "happy-international-womens-day",
				title:    "Celebrating International Women's Day: Strength, Resilience, and Empowerment",
				excerpt:  "Celebrating the resilience, strength, and remarkable achievements of women worldwide—from community leaders and innovators to mothers and young entrepreneurs breaking barriers.",
				content:  "Today we celebrate the strength, resilience, achievements, and contributions of women all around the world.",
				category: "Women Empowerment",
				region:   "GLOBAL & NIGERIA",
				image:    "/blog/womens-day.jpg",
				author:   "Glory Ozor",
				avatar:   "/team/glory-ozor.png",
				date:     "March 9, 2026",
				day:      "09",
				month:    "MAR",
				likes:    3500,
			},
			{
				slug:     "happy-easter-season-of-renewal",
				title:    "Easter: A Season of Hope, Renewal, and Compassionate Service",
				excerpt:  "Easter invites us to reflect on hope, selfless service, and renewal as we continue building brighter futures for underserved youth and vulnerable mothers.",
				content:  "Easter is a time that reminds us of hope, renewal, and new beginnings. As nature comes alive, we reflect on compassionate service.",
				category: "Outreach",
				region:   "NIGERIA & RWANDA",
				image:    "/blog/easter-outreach.jpg",
				author:   "Fr. Achilleus Oguledo",
				avatar:   "/team/achilleus-oguledo.jpg",
				date:     "April 7, 2026",
				day:      "07",
				month:    "APR",
				likes:    2900,
			},
			{
				slug:     "annual-audit-and-tax-documentation",
				title:    "VOF Organizational Profile for Annual Audit & Tax Documentation",
				excerpt:  "Official organizational profile detailing VOF's governance, program areas, healthcare and food relief initiatives, and operational framework for annual audit and tax compliance.",
				content:  "The Veronica Onyeneke Foundation (VOF) is a non-profit charitable organization established in memory of Mrs. Veronica Onyeneke.",
				category: "Transparency & Audit",
				region:   "UNITED STATES & NIGERIA",
				image:    "/blog/annual-audit.jpg",
				author:   "VOF Board of Trustees",
				avatar:   "/team/charles-onyeneke.jpg",
				date:     "March 11, 2026",
				day:      "11",
				month:    "MAR",
				likes:    5100,
			},
		}

		for _, b := range blogs {
			_, err := db.Exec(`INSERT INTO blogs (slug, title, excerpt, content, category, region, image_url, author_name, author_avatar, date_display, day, month, likes, status) 
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'published')`,
				b.slug, b.title, b.excerpt, b.content, b.category, b.region, b.image, b.author, b.avatar, b.date, b.day, b.month, b.likes)
			if err != nil {
				log.Printf("Error seeding blog %s: %v", b.slug, err)
			}
		}
	}

	// Seed Charity Projects if empty
	var projectCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM charity_projects").Scan(&projectCount)
	if projectCount == 0 {
		log.Println("Seeding initial charity projects...")
		projects := []struct {
			title, slug, category, description, location, status, startDate, endDate, image string
			target, raised                                                                  float64
			beneficiaries                                                                   int
		}{
			{
				title:         "VOIE Permanent Skills Training Center",
				slug:          "voie-permanent-center",
				category:      "Vocational Education",
				description:   "Construction and outfitting of the ultra-modern Veronica Onyeneke Institute of Entrepreneurship (VOIE) campus in Mbieri, Imo State, housing 6 modern training workshops.",
				location:      "Mbieri, Imo State, Nigeria",
				target:        35000000.00,
				raised:        24800000.00,
				beneficiaries: 600,
				status:        "active",
				startDate:     "2025-09-01",
				endDate:       "2026-12-31",
				image:         "/blog/appreciation-aifue.jpg",
			},
			{
				title:         "2026 Maternal & Infant Care Healthcare Outreach",
				slug:          "maternal-infant-care-2026",
				category:      "Healthcare",
				description:   "Free medical checkups, prenatal vitamins, safe delivery kits, and direct medical bill subsidies for 1,200 indigent rural mothers and newborns across Southeast Nigeria.",
				location:      "Imo & Abia States, Nigeria",
				target:        15000000.00,
				raised:        11400000.00,
				beneficiaries: 1200,
				status:        "active",
				startDate:     "2026-01-15",
				endDate:       "2026-08-30",
				image:         "/blog/womens-day.jpg",
			},
			{
				title:         "Rural Tertiary Scholars Support Fund",
				slug:          "rural-scholars-fund",
				category:      "Scholarships",
				description:   "Tuition grants, textbook allowances, and JAMB registration support for underprivileged students entering accredited universities and polytechnics.",
				location:      "Nationwide, Nigeria",
				target:        20000000.00,
				raised:        18250000.00,
				beneficiaries: 350,
				status:        "active",
				startDate:     "2026-01-01",
				endDate:       "2026-11-30",
				image:         "/blog/valentines-outreach.jpg",
			},
			{
				title:         "Emergency Rural Food Basket Distribution",
				slug:          "food-basket-relief",
				category:      "Food Relief",
				description:   "Bi-monthly nutritious food parcel distribution (rice, beans, garri, oil) to elderly widows and vulnerable households in deep rural settlements.",
				location:      "Mbieri, Owerri West & Orlu LGAs",
				target:        8000000.00,
				raised:        6800000.00,
				beneficiaries: 1500,
				status:        "active",
				startDate:     "2026-02-01",
				endDate:       "2026-12-31",
				image:         "/blog/easter-outreach.jpg",
			},
		}

		for _, p := range projects {
			_, err := db.Exec(`INSERT INTO charity_projects (title, slug, category, description, target_amount, raised_amount, currency, location, beneficiaries_count, image_url, status, start_date, end_date)
				VALUES ($1, $2, $3, $4, $5, $6, 'NGN', $7, $8, $9, $10, $11, $12)`,
				p.title, p.slug, p.category, p.description, p.target, p.raised, p.location, p.beneficiaries, p.image, p.status, p.startDate, p.endDate)
			if err != nil {
				log.Printf("Error seeding project %s: %v", p.slug, err)
			}
		}
	}

	// Seed Financial Accounts if empty
	var accCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM financial_accounts").Scan(&accCount)
	if accCount == 0 {
		log.Println("Seeding financial accounts...")
		accounts := []struct {
			name, number, bank, currency, accType string
			balance                               float64
		}{
			{
				name:     "Zenith Bank Operating Account",
				number:   "1018392014",
				bank:     "Zenith Bank Plc",
				currency: "NGN",
				balance:  18450250.00,
				accType:  "checking",
			},
			{
				name:     "Guaranty Trust Bank Projects Account",
				number:   "0248591028",
				bank:     "Guaranty Trust Bank (GTBank)",
				currency: "NGN",
				balance:  12840000.00,
				accType:  "checking",
			},
			{
				name:     "Chase Bank US Domiciliary Account",
				number:   "4820194821",
				bank:     "JPMorgan Chase & Co.",
				currency: "USD",
				balance:  28650.00,
				accType:  "domiciliary",
			},
			{
				name:     "VOF Central Petty Cash Fund",
				number:   "CASH-HQ-01",
				bank:     "Internal Treasury",
				currency: "NGN",
				balance:  620000.00,
				accType:  "cash",
			},
		}

		for _, a := range accounts {
			_, err := db.Exec(`INSERT INTO financial_accounts (account_name, account_number, bank_name, currency, balance, type, status)
				VALUES ($1, $2, $3, $4, $5, $6, 'active')`,
				a.name, a.number, a.bank, a.currency, a.balance, a.accType)
			if err != nil {
				log.Printf("Error seeding account %s: %v", a.name, err)
			}
		}
	}

	// Seed Financial Transactions if empty
	var txCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM financial_transactions").Scan(&txCount)
	if txCount == 0 {
		log.Println("Seeding financial transactions...")
		txs := []struct {
			accID  int
			txType string
			cat    string
			amount float64
			curr   string
			desc   string
			ref    string
			date   string
		}{
			{1, "inflow", "Public Donation", 2500000.00, "NGN", "Endowment contribution from Houston diaspora partners for VOIE", "ZEN-2026-0582", "2026-05-02"},
			{1, "outflow", "Project Disbursement", 850000.00, "NGN", "Procurement of 12 industrial sewing machines for Fashion Trade", "VOIE-EQUIP-019", "2026-05-05"},
			{2, "inflow", "Corporate Grant", 5000000.00, "NGN", "Quarterly healthcare subsidy grant for indigent rural maternal care", "GTB-GR-9941", "2026-04-28"},
			{2, "outflow", "Project Disbursement", 1200000.00, "NGN", "Procurement of essential maternal drugs & delivery packs", "MED-OUT-004", "2026-05-08"},
			{3, "inflow", "Public Donation", 3500.00, "USD", "Zelle donation for Imo rural student scholarship bursaries", "ZEL-US-99120", "2026-05-01"},
			{3, "outflow", "Administrative & Utilities", 420.00, "USD", "Domain hosting, cloud databases, and compliance filings", "AWS-NEON-SUB", "2026-05-04"},
			{4, "outflow", "Logistics & Welfare", 185000.00, "NGN", "Community food distribution transportation and volunteer lunch packs", "PETTY-FD-103", "2026-05-09"},
		}

		for _, t := range txs {
			_, err := db.Exec(`INSERT INTO financial_transactions (account_id, transaction_type, category, amount, currency, description, reference, transaction_date)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				t.accID, t.txType, t.cat, t.amount, t.curr, t.desc, t.ref, t.date)
			if err != nil {
				log.Printf("Error seeding tx: %v", err)
			}
		}
	}

	// Seed Donations if empty
	var donCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM donations").Scan(&donCount)
	if donCount == 0 {
		log.Println("Seeding donations...")
		donations := []struct {
			name, email, phone, campaign, method, ref string
			amount                                    float64
			curr                                      string
			notes                                     string
		}{
			{"Chief Emeka Nwosu", "e.nwosu@consulting.ng", "+234 803 291 0041", "VOIE Vocational Training", "Zenith Bank Transfer", "ZEN-TRF-90211", 500000.00, "NGN", "In support of Youth Skills batch 2026"},
			{"Dr. Ngozi Adeleke", "adeleke.n@ushealth.org", "+1 (713) 482-9901", "Maternal Healthcare Outreach", "Zelle", "ZEL-48201", 1200.00, "USD", "For prenatal kits in Imo State rural clinics"},
			{"Anonymous Benefactor", "donor@private.com", "+234 812 000 8822", "Rural Education & Scholarships", "GTBank Transfer", "GTB-883912", 250000.00, "NGN", "JAMB candidate registrations"},
			{"Mrs. Chinyere Okoro", "chinyere.okoro@gmail.com", "+234 805 771 2290", "General Donation", "Online Card", "PAY-CARD-0199", 50000.00, "NGN", "God bless Veronica Onyeneke Foundation"},
			{"Engr. Patrick Ibe", "p.ibe@ibeglobal.com", "+1 (404) 918-2231", "VOIE Vocational Training", "Zelle", "ZEL-10928", 2500.00, "USD", "Computer Lab workstations sponsorship"},
		}

		for _, d := range donations {
			_, err := db.Exec(`INSERT INTO donations (donor_name, donor_email, donor_phone, amount, currency, campaign, payment_method, reference, status, notes)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed', $9)`,
				d.name, d.email, d.phone, d.amount, d.curr, d.campaign, d.method, d.ref, d.notes)
			if err != nil {
				log.Printf("Error seeding donation: %v", err)
			}
		}
	}

	// Seed Volunteers if empty
	var volCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM volunteers").Scan(&volCount)
	if volCount == 0 {
		log.Println("Seeding volunteers...")
		volunteers := []struct {
			name, email, phone, location, interest, avail, skills, status string
		}{
			{"Amara Jennifer Eze", "amara.eze@gmail.com", "+234 806 331 9283", "Owerri, Imo State", "VOIE Skills Mentorship", "Weekends", "Experienced fashion designer and pattern maker of 7 years", "approved"},
			{"Dr. Victor Kalu", "victor.kalu@fmc.gov.ng", "+234 803 719 4402", "Owerri, Imo State", "Medical Outreach", "Weekends", "Medical Officer at FMC Owerri, general medicine & pediatrics", "approved"},
			{"Blessing Chukwu", "blessing.c@outlook.com", "+234 814 990 1284", "Enugu, Enugu State", "Media & Content", "Remote", "Social media content creation, videography, photography", "contacted"},
			{"Obinna Michael Madu", "obinna.madu@gmail.com", "+234 809 112 3901", "Mbieri, Imo State", "Event Planning & Logistics", "Flexible", "Community mobilizer, crowd control, warehouse distribution", "active"},
			{"Grace Nwachukwu", "grace.nw@gmail.com", "+234 703 881 2940", "Aba, Abia State", "Fundraising & Grants", "Remote", "Nonprofit grant writing and donor relations experience", "new"},
		}

		for _, v := range volunteers {
			_, err := db.Exec(`INSERT INTO volunteers (full_name, email, phone, location, interest_area, availability, skills_experience, status)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				v.name, v.email, v.phone, v.location, v.interest, v.avail, v.skills, v.status)
			if err != nil {
				log.Printf("Error seeding volunteer: %v", err)
			}
		}
	}

	// Seed Scholarship Applications if empty
	var schCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM scholarship_applications").Scan(&schCount)
	if schCount == 0 {
		log.Println("Seeding scholarship applications...")
		schApps := []struct {
			name, email, phone, state, institution, course, level, cgpa, status, reason string
			amount                                                                      float64
		}{
			{"Chidiebube Emmanuel Okon", "chidiebube.o@gmail.com", "+234 810 449 2011", "Imo", "Federal University of Technology Owerri (FUTO)", "Electrical & Electronics Engineering", "300 Level", "4.45 / 5.0", "approved", "Orphaned in 2023, requires assistance for third-year tuition and laboratory fees.", 150000.00},
			{"Faith Chinaza Anya", "faith.anya@aifue.edu.ng", "+234 701 883 1944", "Abia", "Alvan Ikoku Federal University of Education", "English & Literary Studies", "200 Level", "4.12 / 5.0", "under_review", "Struggling to cover accommodation and faculty textbook levies as first-generation university student.", 100000.00},
			{"Kelechi Samuel Nnadi", "kelechi.nnadi@futo.edu.ng", "+234 816 772 0019", "Imo", "Imo State University (IMSU)", "Medicine & Surgery", "400 Level", "4.68 / 5.0", "approved", "Outstanding academic record, clinical rotations fees pending.", 250000.00},
			{"Somtochukwu Divine Umeh", "somto.umeh@gmail.com", "+234 808 331 4455", "Anambra", "Federal Polytechnic Nekede", "Computer Science", "ND II", "3.60 / 4.0", "pending", "Requesting assistance for final year project development and exam registration.", 85000.00},
		}

		for _, s := range schApps {
			_, err := db.Exec(`INSERT INTO scholarship_applications (applicant_name, email, phone, state_of_origin, institution_name, course_of_study, current_level, cgpa, amount_requested, reason_for_aid, status)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
				s.name, s.email, s.phone, s.state, s.institution, s.course, s.level, s.cgpa, s.amount, s.reason, s.status)
			if err != nil {
				log.Printf("Error seeding scholarship application: %v", err)
			}
		}
	}

	// Seed Skill Applications if empty
	var sklCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM skill_applications").Scan(&sklCount)
	if sklCount == 0 {
		log.Println("Seeding skill applications...")
		skillApps := []struct {
			name, email, phone, gender, address, trade, edu, emp, status, purpose string
		}{
			{"Precious Ifeoma Uzoma", "precious.uzoma@gmail.com", "+234 803 119 5544", "Female", "Mbieri, Mbaitoli LGA", "Fashion Design & Tailoring", "SSCE / WAEC", "Unemployed", "enrolled", "I desire to gain practical tailoring skills to start a women's clothing studio and support my siblings."},
			{"Chinedu Daniel Ogbonna", "chinedu.ogbonna@yahoo.com", "+234 814 662 9012", "Male", "Ikenegbu, Owerri", "ICT & Digital Skills", "OND / NCE", "Unemployed", "interview_scheduled", "Looking forward to mastering web development and digital marketing to work remotely as a freelancer."},
			{"Miracle Ngozi Anyanwu", "miracle.anyanwu@gmail.com", "+234 706 991 3320", "Female", "Orji, Owerri North", "Baking & Confectionery", "SSCE / WAEC", "Self-employed", "enrolled", "I currently bake small snacks from home; I want structured training in commercial cakes and bread to expand my business."},
			{"Sunday Christopher Ebere", "sunday.ebere@gmail.com", "+234 809 441 8821", "Male", "Umuonyeali, Mbieri", "Shoe Making & Leather Works", "Primary", "Apprentice", "pending", "I want to master handcrafted leather shoes, sandals, and belts to establish a genuine manufacturing workshop in Imo State."},
			{"Peace Chidera Obi", "peace.obi@gmail.com", "+234 812 770 1933", "Female", "Aladinma, Owerri", "Cosmetology & Hair Styling", "SSCE / WAEC", "Unemployed", "pending", "Desire professional cosmetology training in wig installation, bridal makeup, and skincare formulation."},
		}

		for _, k := range skillApps {
			_, err := db.Exec(`INSERT INTO skill_applications (applicant_name, email, phone, gender, address, trade_selected, education_level, employment_status, statement_of_purpose, status)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
				k.name, k.email, k.phone, k.gender, k.address, k.trade, k.edu, k.emp, k.purpose, k.status)
			if err != nil {
				log.Printf("Error seeding skill application: %v", err)
			}
		}
	}

	// Seed Partners if empty
	var partnerCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM partners").Scan(&partnerCount)
	if partnerCount == 0 {
		log.Println("Seeding partners...")
		seedPartners := []struct {
			org, pType, contact, email, phone, country, city, web, interest, msg, status, notes string
		}{
			{
				"Saint Paul's Secondary School", "School", "Principal Fr. Augustine", "contact@saintpaulsnvosi.edu.ng", "+234 803 555 1201",
				"Nigeria", "Isiala Ngwa South, Abia", "https://saintpaulsnvosi.edu.ng", "Secondary School Scholarships",
				"Strategic partnership placing 10 vulnerable students on full academic sponsorship from SS1 through SS3.",
				"active", "Official Educational Partner. Regular termly progress reports submitted.",
			},
			{
				"Evette Institute of Catering & Fashion Design", "School", "Mrs. Evelyn Nwachukwu", "info@evetteinstitute.org", "+234 802 443 9081",
				"Nigeria", "Umuguma, Owerri", "https://evetteinstitute.org", "Vocational Training & Apprenticeships",
				"Partnering to deliver 1-year professional fashion design and catering apprenticeships for vulnerable young women.",
				"active", "Vocational Skills Training Hub. Cohort 2026 ongoing.",
			},
			{
				"Cloveebiz Limited", "Corporate", "Engr. Elvis Onyeneke", "contact@cloveebiz.com", "+234 809 112 3456",
				"Nigeria", "Lagos / International", "https://cloveebiz.com", "Technology & Cybersecurity Support",
				"Enterprise IT architecture, cybersecurity systems, and equipment for youth digital learning.",
				"active", "Technology Infrastructure Partner. Annual hardware endowment renewed.",
			},
			{
				"All Saints Catholic Academy", "School", "Academic Dean", "info@allsaintsalbany.org", "+1 (518) 438-0066",
				"USA", "Albany, NY", "https://allsaintsalbany.org", "Educational & Pastoral Exchange",
				"Cross-border educational support, scholastic book drives, and academic collaboration.",
				"active", "USA Educational Ally.",
			},
			{
				"Kigali Youth Empowerment Initiative", "NGO", "Shekinah Umuringa", "partnerships.rw@vonf.org", "+250 789 066 186",
				"Rwanda", "Kigali", "https://rwanda.vonf.org", "Maternal Care & Youth Outreach",
				"Field coordinator for educational aid distribution and young mothers support across Kigali.",
				"active", "In-country partner for VOF Rwanda operations.",
			},
		}

		for _, p := range seedPartners {
			_, err := db.Exec(`INSERT INTO partners (organization_name, partner_type, contact_person, email, phone, country, city, website, partnership_interest, message, status, notes)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
				p.org, p.pType, p.contact, p.email, p.phone, p.country, p.city, p.web, p.interest, p.msg, p.status, p.notes)
			if err != nil {
				log.Printf("Error seeding partner: %v", err)
			}
		}
	}

	// Seed Gallery Media if empty
	var galleryCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM gallery_items").Scan(&galleryCount)
	if galleryCount == 0 {
		log.Println("Seeding gallery media...")
		seedMedia := []struct {
			title, category, url, mediaType, caption, date string
			year                                            int
			region, location, album                         string
			featured                                        bool
		}{
			{
				"Garment Construction Masterclass", "Vocational Skills", "/IMG01.jpeg", "image",
				"Students engaged in modern garment construction and tailoring at VOIE Center.", "2024-08-15",
				2024, "Nigeria", "VOIE Center, Owerri, Imo State", "VOIE Vocational Trades & Fashion Cohort", true,
			},
			{
				"Precision Fabric Measuring & Pattern Drafting", "Vocational Skills", "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80", "image",
				"Measuring and drafting precision tailoring patterns on durable fabrics.", "2024-08-10",
				2024, "Nigeria", "VOIE Center, Owerri, Imo State", "VOIE Vocational Trades & Fashion Cohort", false,
			},
			{
				"Sewing Starter Packs Presentation", "Vocational Skills", "/IMG05.jpeg", "image",
				"Graduation ceremony and presentation of sewing starter kits to certified alumni.", "2024-09-02",
				2024, "Nigeria", "VOIE Center, Owerri, Imo State", "VOIE Vocational Trades & Fashion Cohort", true,
			},
			{
				"Prenatal Wellness & Maternal Dignity Outreach", "Maternal Dignity", "/IMG03.jpeg", "image",
				"Prenatal health guidance and distribution of maternal dignity care packages.", "2024-06-18",
				2024, "Nigeria", "Owerri & Surrounding Communities", "Vulnerable Young Mothers Care Outreach", true,
			},
			{
				"Mother & Child Nutritional Counseling", "Maternal Dignity", "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1200&q=80", "image",
				"Compassionate counseling and mother-child nutritional wellness orientation.", "2024-06-20",
				2024, "Nigeria", "Owerri, Imo State", "Vulnerable Young Mothers Care Outreach", false,
			},
			{
				"Secondary School Sponsorship Cohort", "Academic Scholarships", "/IMG04.jpeg", "image",
				"Full tuition, uniforms, and textbooks awarded to 10 vulnerable students at Saint Paul's Secondary School.", "2024-01-22",
				2024, "Nigeria", "Saint Paul's Secondary School, Abia State", "The Academic Triad Scholarship Awards", true,
			},
			{
				"JAMB National Exam Coaching & Registration", "Academic Scholarships", "/stats.jpeg", "image",
				"Free JAMB registration and intensive computer-based test orientation for underprivileged youths.", "2024-02-14",
				2024, "Nigeria", "Owerri CBT Center, Imo State", "The Academic Triad Scholarship Awards", false,
			},
			{
				"Kigali Community Primary School Support", "Rwanda Mission", "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80", "image",
				"Handing over scholastic materials, notebooks, and learning packages in Kigali schools.", "2024-04-12",
				2024, "Rwanda", "Kigali, Rwanda", "VOF Rwanda School & Community Mission", true,
			},
			{
				"Rural Food & Welfare Package Distribution", "Community Relief", "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80", "image",
				"Providing food staples, vegetable oil, and essential supplies to elderly women and struggling families.", "2023-12-18",
				2023, "Nigeria", "Rural Imo & Abia Communities", "Rural Family Relief & Nutrition Drive", true,
			},
		}

		for _, m := range seedMedia {
			_, err := db.Exec(`INSERT INTO gallery_items (title, category, media_url, media_type, caption, event_date, year, region, location, album_title, featured, status)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'published')`,
				m.title, m.category, m.url, m.mediaType, m.caption, m.date, m.year, m.region, m.location, m.album, m.featured)
			if err != nil {
				log.Printf("Error seeding gallery item: %v", err)
			}
		}
	}

	return nil
}
