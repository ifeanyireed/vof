package models

import (
	"encoding/json"
	"time"
)

// BlogCategory represents a blog classification category
type BlogCategory struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	Color       string    `json:"color"`
	PostCount   int       `json:"postCount,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

// BlogTag represents a label attached to blog posts
type BlogTag struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	PostCount int       `json:"postCount,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

// BlogPost represents an article in the Blog CMS
type BlogPost struct {
	ID           int       `json:"id"`
	Slug         string    `json:"slug"`
	Title        string    `json:"title"`
	Excerpt      string    `json:"excerpt"`
	Content      string    `json:"content"`
	Category     string    `json:"category"`
	CategoryID   *int      `json:"categoryId,omitempty"`
	Tags         []string  `json:"tags"`
	Region       string    `json:"region"`
	ImageURL     string    `json:"imageUrl"`
	AuthorName   string    `json:"authorName"`
	AuthorRole   string    `json:"authorRole"`
	AuthorAvatar string    `json:"authorAvatar"`
	ReadTime     string    `json:"readTime"`
	DateDisplay  string    `json:"dateDisplay"`
	Day          string    `json:"day"`
	Month        string    `json:"month"`
	Likes        int       `json:"likes"`
	Status       string    `json:"status"` // 'published', 'draft', 'archived'
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// Donation represents a received contribution
type Donation struct {
	ID            int       `json:"id"`
	DonorName     string    `json:"donorName"`
	DonorEmail    string    `json:"donorEmail"`
	DonorPhone    string    `json:"donorPhone"`
	Amount        float64   `json:"amount"`
	Currency      string    `json:"currency"` // 'NGN', 'USD', 'GBP'
	Campaign      string    `json:"campaign"`
	PaymentMethod string    `json:"paymentMethod"`
	Reference     string    `json:"reference"`
	Status        string    `json:"status"` // 'completed', 'pending', 'failed'
	Anonymous     bool      `json:"anonymous"`
	Notes         string    `json:"notes"`
	DonatedAt     time.Time `json:"donatedAt"`
	CreatedAt     time.Time `json:"createdAt"`
}

// Volunteer represents a community volunteer registration
type Volunteer struct {
	ID               int       `json:"id"`
	FullName         string    `json:"fullName"`
	Email            string    `json:"email"`
	Phone            string    `json:"phone"`
	Country          string    `json:"country"`
	Location         string    `json:"location"`
	InterestArea     string    `json:"interestArea"`
	Availability     string    `json:"availability"`
	SkillsExperience string    `json:"skillsExperience"`
	ResumeURL        string    `json:"resumeUrl"`
	Status           string    `json:"status"` // 'new', 'contacted', 'approved', 'active', 'inactive'
	Notes            string    `json:"notes"`
	CreatedAt        time.Time `json:"createdAt"`
}

// Partner represents an institutional, corporate, academic, or individual partner inquiry
type Partner struct {
	ID                  int       `json:"id"`
	OrganizationName    string    `json:"organizationName"`
	PartnerType         string    `json:"partnerType"` // 'corporate', 'school', 'company', 'individual', 'ngo', 'faith'
	ContactPerson       string    `json:"contactPerson"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	Country             string    `json:"country"`
	City                string    `json:"city"`
	Website             string    `json:"website"`
	PartnershipInterest string    `json:"partnershipInterest"`
	Message             string    `json:"message"`
	Status              string    `json:"status"` // 'new', 'under_review', 'contacted', 'active', 'declined'
	Notes               string    `json:"notes"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

// GalleryItem represents a media asset in the gallery organized by category and date
type GalleryItem struct {
	ID         int             `json:"id"`
	Title      string          `json:"title"`
	Category   string          `json:"category"`
	MediaURL   string          `json:"mediaUrl"`
	MediaType  string          `json:"mediaType"`
	Caption    string          `json:"caption"`
	EventDate  string          `json:"eventDate"`
	Year       int             `json:"year"`
	Region     string          `json:"region"`
	Location   string          `json:"location"`
	AlbumTitle string          `json:"albumTitle"`
	Featured   bool            `json:"featured"`
	OrderIndex int             `json:"orderIndex"`
	Status     string          `json:"status"`
	Photos     json.RawMessage `json:"photos"`
	CreatedAt  time.Time       `json:"createdAt"`
	UpdatedAt  time.Time       `json:"updatedAt"`
}

// CharityProject represents an outreach program or vocational center campaign
type CharityProject struct {
	ID                 int       `json:"id"`
	Title              string    `json:"title"`
	Slug               string    `json:"slug"`
	Category           string    `json:"category"`
	Description        string    `json:"description"`
	TargetAmount       float64   `json:"targetAmount"`
	RaisedAmount       float64   `json:"raisedAmount"`
	Currency           string    `json:"currency"`
	Location           string    `json:"location"`
	BeneficiariesCount int       `json:"beneficiariesCount"`
	ImageURL           string    `json:"imageUrl"`
	ImageURLs          []string  `json:"imageUrls,omitempty"`
	Status             string    `json:"status"` // 'active', 'completed', 'upcoming', 'paused'
	StartDate          string    `json:"startDate"`
	EndDate            string    `json:"endDate"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

// ScholarshipApplication represents a student financial aid request
type ScholarshipApplication struct {
	ID              int       `json:"id"`
	ApplicantName   string    `json:"applicantName"`
	Email           string    `json:"email"`
	Phone           string    `json:"phone"`
	Country         string    `json:"country"`
	DateOfBirth     string    `json:"dateOfBirth"`
	Gender          string    `json:"gender"`
	StateOfOrigin   string    `json:"stateOfOrigin"`
	LGA             string    `json:"lga"`
	InstitutionName string    `json:"institutionName"`
	CourseOfStudy   string    `json:"courseOfStudy"`
	CurrentLevel    string    `json:"currentLevel"`
	CGPA            string    `json:"cgpa"`
	AmountRequested float64   `json:"amountRequested"`
	ReasonForAid    string    `json:"reasonForAid"`
	DocumentURL     string    `json:"documentUrl"`
	Status          string    `json:"status"` // 'pending', 'under_review', 'approved', 'disbursed', 'rejected'
	ReviewerNotes   string    `json:"reviewerNotes"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// SkillApplication represents an applicant to the VOIE Institute
type SkillApplication struct {
	ID                 int       `json:"id"`
	ApplicantName      string    `json:"applicantName"`
	Email              string    `json:"email"`
	Phone              string    `json:"phone"`
	Country            string    `json:"country"`
	Gender             string    `json:"gender"`
	Address            string    `json:"address"`
	TradeSelected      string    `json:"tradeSelected"`
	EducationLevel     string    `json:"educationLevel"`
	EmploymentStatus   string    `json:"employmentStatus"`
	StatementOfPurpose string    `json:"statementOfPurpose"`
	DocumentURL        string    `json:"documentUrl"`
	Status             string    `json:"status"` // 'pending', 'interview_scheduled', 'enrolled', 'graduated', 'rejected'
	IntakeBatch        string    `json:"intakeBatch"`
	Notes              string    `json:"notes"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

// FinancialAccount represents a foundation bank account or cash ledger
type FinancialAccount struct {
	ID            int       `json:"id"`
	AccountName   string    `json:"accountName"`
	AccountNumber string    `json:"accountNumber"`
	BankName      string    `json:"bankName"`
	Currency      string    `json:"currency"`
	Balance       float64   `json:"balance"`
	Type          string    `json:"type"` // 'checking', 'savings', 'cash', 'domiciliary'
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"createdAt"`
}

// FinancialTransaction represents an inflow or outflow entry
type FinancialTransaction struct {
	ID               int       `json:"id"`
	AccountID        *int      `json:"accountId"`
	AccountName      string    `json:"accountName,omitempty"`
	TransactionType  string    `json:"transactionType"` // 'inflow', 'outflow'
	Category         string    `json:"category"`
	Amount           float64   `json:"amount"`
	Currency         string    `json:"currency"`
	Description      string    `json:"description"`
	Reference        string    `json:"reference"`
	RelatedProjectID *int      `json:"relatedProjectId"`
	TransactionDate  string    `json:"transactionDate"`
	ReceiptURL       string    `json:"receiptUrl"`
	CreatedAt        time.Time `json:"createdAt"`
}

// DashboardStats holds summary figures for the main admin screen
type DashboardStats struct {
	TotalFundsRaisedNGN     float64 `json:"totalFundsRaisedNGN"`
	TotalFundsRaisedUSD     float64 `json:"totalFundsRaisedUSD"`
	TotalDonationsCount     int     `json:"totalDonationsCount"`
	ActiveProjectsCount     int     `json:"activeProjectsCount"`
	TotalVolunteersCount    int     `json:"totalVolunteersCount"`
	PendingScholarships     int     `json:"pendingScholarships"`
	PendingSkillApps        int     `json:"pendingSkillApps"`
	PublishedBlogsCount     int     `json:"publishedBlogsCount"`
	TotalAccountBalanceNGN  float64 `json:"totalAccountBalanceNGN"`
	TotalAccountBalanceUSD  float64 `json:"totalAccountBalanceUSD"`
}

// PopupSettings represents configuration for the landing donate/projects popup modal
type PopupSettings struct {
	ID                 int              `json:"id"`
	IsEnabled          bool             `json:"isEnabled"`
	DelaySeconds       int              `json:"delaySeconds"`
	Headline           string           `json:"headline"`
	Subheadline        string           `json:"subheadline"`
	CtaText            string           `json:"ctaText"`
	ShowOnMobile       bool             `json:"showOnMobile"`
	SelectedProjectIDs []int            `json:"selectedProjectIds"`
	Projects           []CharityProject `json:"projects,omitempty"`
	UpdatedAt          time.Time        `json:"updatedAt"`
}

// AdminUser represents an authenticated staff member with RBAC role
type AdminUser struct {
	ID           int        `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	FullName     string     `json:"fullName"`
	Role         string     `json:"role"` // 'super_admin', 'admin', 'finance_officer', 'content_editor', 'programs_coordinator'
	AvatarURL    string     `json:"avatarUrl"`
	IsActive     bool       `json:"isActive"`
	LastLogin    *time.Time `json:"lastLogin,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

// OutreachBeneficiaryMetric represents a key metric card on an outreach report
type OutreachBeneficiaryMetric struct {
	Label string `json:"label"`
	Count string `json:"count"`
}

// OutreachFinancialItem represents a line item in an outreach budget/expense
type OutreachFinancialItem struct {
	Item   string `json:"item"`
	Amount string `json:"amount"`
}

// OutreachFinancials represents financial accounting for an outreach
type OutreachFinancials struct {
	TotalReceived string                  `json:"totalReceived"`
	TotalSpent    string                  `json:"totalSpent"`
	Items         []OutreachFinancialItem `json:"items"`
}

// OutreachDocument represents a certified scanned memo, report, award, or photo
type OutreachDocument struct {
	Title string `json:"title"`
	Image string `json:"image"`
	Type  string `json:"type"` // 'report', 'award', 'flyer', 'photo'
}

// OutreachPersonnel represents staff or volunteer members who served on the outreach
type OutreachPersonnel struct {
	Name string `json:"name"`
	Role string `json:"role"`
}

// OutreachSignatory represents the official certifying officer
type OutreachSignatory struct {
	Name  string `json:"name"`
	Title string `json:"title"`
}

// OutreachReport represents a field humanitarian intervention or program event report
type OutreachReport struct {
	ID                        int                         `json:"id"`
	Slug                      string                      `json:"slug"`
	Title                     string                      `json:"title"`
	Theme                     string                      `json:"theme"`
	EventDate                 string                      `json:"eventDate"`
	Year                      int                         `json:"year"`
	Venue                     string                      `json:"venue"`
	Location                  string                      `json:"location"`
	Category                  string                      `json:"category"`
	Summary                   string                      `json:"summary"`
	Objectives                []string                    `json:"objectives"`
	KeyActivities             []string                    `json:"keyActivities"`
	ComplianceAndObservations []string                    `json:"complianceAndObservations"`
	NextSteps                 []string                    `json:"nextSteps"`
	ImpactMetrics             []OutreachBeneficiaryMetric `json:"impactMetrics"`
	Financials                *OutreachFinancials         `json:"financials,omitempty"`
	DelegationAndVolunteers   []OutreachPersonnel         `json:"delegationAndVolunteers"`
	SignedBy                  OutreachSignatory           `json:"signedBy"`
	Documents                 []OutreachDocument          `json:"documents"`
	ShowFinancials            bool                        `json:"showFinancials"`
	ShowDocuments             bool                        `json:"showDocuments"`
	Featured                  bool                        `json:"featured"`
	OrderIndex                int                         `json:"orderIndex"`
	Status                    string                      `json:"status"` // 'published', 'draft', 'archived'
	CreatedAt                 time.Time                   `json:"createdAt"`
	UpdatedAt                 time.Time                   `json:"updatedAt"`
}


