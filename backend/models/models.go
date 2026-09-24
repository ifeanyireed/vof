package models

import (
	"time"
)

// BlogPost represents an article in the Blog CMS
type BlogPost struct {
	ID           int       `json:"id"`
	Slug         string    `json:"slug"`
	Title        string    `json:"title"`
	Excerpt      string    `json:"excerpt"`
	Content      string    `json:"content"`
	Category     string    `json:"category"`
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
