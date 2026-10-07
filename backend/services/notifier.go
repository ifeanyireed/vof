package services

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/smtp"
	"strings"
	"time"
)

type NotifierService struct {
	DB         *sql.DB
	AdminEmail string
	SMTPHost   string
	SMTPPort   string
	SMTPUser   string
	SMTPPass   string
	SMTPFrom   string
}

func NewNotifierService(
	db *sql.DB,
	adminEmail, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom string,
) *NotifierService {
	if adminEmail == "" {
		adminEmail = "admin@vonf.org"
	}
	if smtpPort == "" {
		smtpPort = "587"
	}
	if smtpFrom == "" {
		smtpFrom = "Veronica Onyeneke Foundation <notifications@vonf.org>"
	}

	return &NotifierService{
		DB:         db,
		AdminEmail: adminEmail,
		SMTPHost:   smtpHost,
		SMTPPort:   smtpPort,
		SMTPUser:   smtpUser,
		SMTPPass:   smtpPass,
		SMTPFrom:   smtpFrom,
	}
}

// NotifyFormCompletion asynchronously notifies ADMIN_EMAIL and records an audit log entry
func (n *NotifierService) NotifyFormCompletion(
	formType string,
	formTitle string,
	submitterName string,
	submitterEmail string,
	submitterPhone string,
	country string,
	details map[string]interface{},
) {
	// Execute in goroutine to keep API response instant
	go func() {
		timestamp := time.Now().UTC().Format(time.RFC3339)

		// 1. Audit Log in Postgres for permanent traceability
		if n.DB != nil {
			auditData := map[string]interface{}{
				"formType":       formType,
				"formTitle":      formTitle,
				"submitterName":  submitterName,
				"submitterEmail": submitterEmail,
				"submitterPhone": submitterPhone,
				"country":        country,
				"details":        details,
				"notifiedEmail":  n.AdminEmail,
				"timestamp":      timestamp,
			}
			detailsJSON, err := json.Marshal(auditData)
			if err == nil {
				_, logErr := n.DB.Exec(
					`INSERT INTO admin_audit_logs (admin_id, admin_email, action, module, record_id, details)
					 VALUES (1, $1, 'FORM_COMPLETED_NOTIFICATION', $2, 'new', $3)`,
					n.AdminEmail, formType, string(detailsJSON),
				)
				if logErr != nil {
					log.Printf("[Notifier] Warning: Failed to insert audit log: %v", logErr)
				}
			}
		}

		// 2. Deliver email notification if SMTP is configured
		if n.SMTPHost != "" && n.SMTPUser != "" && n.SMTPPass != "" {
			err := n.sendSMTPEmail(formType, formTitle, submitterName, submitterEmail, submitterPhone, country, details, timestamp)
			if err != nil {
				log.Printf("[Notifier] Failed to send email to ADMIN_EMAIL (%s): %v", n.AdminEmail, err)
			} else {
				log.Printf("[Notifier] Successfully dispatched email notification to ADMIN_EMAIL (%s) for %s", n.AdminEmail, formTitle)
			}
		} else {
			log.Printf("[Notifier to ADMIN_EMAIL (%s)]: New form completed: [%s] submitted by %s <%s>. (Logged to admin_audit_logs)",
				n.AdminEmail, formTitle, submitterName, submitterEmail)
		}
	}()
}

func (n *NotifierService) sendSMTPEmail(
	formType, formTitle, submitterName, submitterEmail, submitterPhone, country string,
	details map[string]interface{},
	timestamp string,
) error {
	addr := fmt.Sprintf("%s:%s", n.SMTPHost, n.SMTPPort)
	auth := smtp.PlainAuth("", n.SMTPUser, n.SMTPPass, n.SMTPHost)

	subject := fmt.Sprintf("[VOF Notification] New %s - %s", formTitle, submitterName)

	var detailsBuilder strings.Builder
	for k, v := range details {
		if v != nil && fmt.Sprintf("%v", v) != "" {
			detailsBuilder.WriteString(fmt.Sprintf("- %s: %v\n", k, v))
		}
	}

	body := fmt.Sprintf(`From: %s
To: %s
Subject: %s
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

=== NEW FORM SUBMISSION: %s ===
Received At: %s

SUBMITTER DETAILS:
- Name: %s
- Email: %s
- Phone: %s
- Country / Hub: %s

SUBMISSION DETAILS:
%s

Notification automatically sent to ADMIN_EMAIL (%s).
Veronica Onyeneke Foundation Secretariat.
`, n.SMTPFrom, n.AdminEmail, subject, strings.ToUpper(formTitle), timestamp,
		submitterName, submitterEmail, submitterPhone, country,
		detailsBuilder.String(), n.AdminEmail)

	to := []string{n.AdminEmail}
	return smtp.SendMail(addr, auth, n.SMTPFrom, to, []byte(body))
}
