import nodemailer from 'nodemailer';
import { sql } from '@/lib/db';

export interface FormNotificationPayload {
  formType: 'scholarship' | 'skills' | 'volunteer' | 'partner' | 'donation' | 'support';
  formTitle: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  country?: string;
  details: Record<string, any>;
  submittedAt?: string;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vonf.org';

function getAdminUrlForForm(formType: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://vonf.org';
  switch (formType) {
    case 'scholarship':
    case 'skills':
      return `${base}/admin/applications`;
    case 'volunteer':
      return `${base}/admin/volunteers`;
    case 'partner':
      return `${base}/admin/partners`;
    case 'donation':
      return `${base}/admin/donations`;
    case 'support':
      return `${base}/admin/support`;
    default:
      return `${base}/admin/overview`;
  }
}

function buildHtmlTemplate(payload: FormNotificationPayload): string {
  const adminUrl = getAdminUrlForForm(payload.formType);
  const dateStr = payload.submittedAt
    ? new Date(payload.submittedAt).toUTCString()
    : new Date().toUTCString();

  const detailsRows = Object.entries(payload.details)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      const formattedVal =
        typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 13px; font-weight: 600; width: 35%;">${formattedKey}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 13px; word-break: break-word;">${formattedVal}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${payload.formTitle} Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #16300b 0%, #2f5e17 100%); padding: 32px 28px; text-align: left;">
                  <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 255, 255, 0.15); border-radius: 9999px; color: #a3e635; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
                    New Form Submission
                  </span>
                  <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: -0.02em;">
                    ${payload.formTitle}
                  </h1>
                  <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                    Veronica Onyeneke Foundation Secretariat Intake
                  </p>
                </td>
              </tr>

              <!-- Submitter Quick Summary Card -->
              <tr>
                <td style="padding: 24px 28px 12px 28px;">
                  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 14px; font-weight: 700; color: #166534; padding-bottom: 8px;">
                          Submitter Information
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #14532d; line-height: 1.6;">
                          <strong>Name:</strong> ${payload.submitterName}<br/>
                          <strong>Email:</strong> <a href="mailto:${payload.submitterEmail}" style="color: #15803d; text-decoration: underline;">${payload.submitterEmail}</a><br/>
                          ${payload.submitterPhone ? `<strong>Phone:</strong> ${payload.submitterPhone}<br/>` : ''}
                          ${payload.country ? `<strong>Country / Hub:</strong> ${payload.country}<br/>` : ''}
                          <strong>Received At:</strong> ${dateStr}
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- Detailed Form Data -->
              <tr>
                <td style="padding: 12px 28px 24px 28px;">
                  <h3 style="font-size: 14px; font-weight: 700; color: #334155; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.03em;">
                    Submission Details
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 10px; border-collapse: collapse; overflow: hidden;">
                    <tbody>
                      ${detailsRows}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Call to Action -->
              <tr>
                <td align="center" style="padding: 8px 28px 28px 28px;">
                  <a href="${adminUrl}" style="display: inline-block; background-color: #558b1a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(85, 139, 26, 0.35);">
                    Open in Admin Portal &rarr;
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 18px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                    This notification was automatically sent to <strong>ADMIN_EMAIL (${ADMIN_EMAIL})</strong> following a public form intake submission on the Veronica Onyeneke Foundation web portal.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function buildPlainText(payload: FormNotificationPayload): string {
  const adminUrl = getAdminUrlForForm(payload.formType);
  const lines: string[] = [
    `=== NEW FORM SUBMISSION: ${payload.formTitle.toUpperCase()} ===`,
    `Received At: ${payload.submittedAt || new Date().toISOString()}`,
    ``,
    `SUBMITTER DETAILS:`,
    `- Name: ${payload.submitterName}`,
    `- Email: ${payload.submitterEmail}`,
    payload.submitterPhone ? `- Phone: ${payload.submitterPhone}` : '',
    payload.country ? `- Country: ${payload.country}` : '',
    ``,
    `SUBMISSION DETAILS:`,
  ];

  for (const [k, v] of Object.entries(payload.details)) {
    if (v !== undefined && v !== null && v !== '') {
      lines.push(`- ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
    }
  }

  lines.push('');
  lines.push(`View and manage in Admin Portal: ${adminUrl}`);
  lines.push(`Notification sent to: ${ADMIN_EMAIL}`);

  return lines.filter(Boolean).join('\n');
}

/**
 * Sends a notification to ADMIN_EMAIL when a form is completed.
 * Logs to database audit logs and delivers via SMTP if configured.
 */
export async function sendFormCompletedNotification(payload: FormNotificationPayload): Promise<{
  success: boolean;
  emailSent: boolean;
  adminEmail: string;
  error?: string;
}> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vonf.org';
  const subject = `[VOF Notification] New ${payload.formTitle} - ${payload.submitterName}`;
  const html = buildHtmlTemplate(payload);
  const text = buildPlainText(payload);

  let emailSent = false;
  let emailError: string | undefined;

  // 1. Audit log in Postgres for permanent traceability
  try {
    await sql`
      INSERT INTO admin_audit_logs (
        admin_id,
        admin_email,
        action,
        module,
        record_id,
        details
      ) VALUES (
        1,
        ${adminEmail},
        'FORM_COMPLETED_NOTIFICATION',
        ${payload.formType},
        ${String(payload.details?.id || 'new')},
        ${JSON.stringify({
          formTitle: payload.formTitle,
          submitterName: payload.submitterName,
          submitterEmail: payload.submitterEmail,
          submitterPhone: payload.submitterPhone,
          country: payload.country,
          details: payload.details,
          notifiedEmail: adminEmail,
          timestamp: new Date().toISOString(),
        })}
      );
    `;
  } catch (err: any) {
    console.warn('[Notification] Failed to record audit log in database:', err?.message || err);
  }

  // 2. Transmit via SMTP if credentials are configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || `"Veronica Onyeneke Foundation" <notifications@vonf.org>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: adminEmail,
        replyTo: payload.submitterEmail,
        subject,
        text,
        html,
      });

      emailSent = true;
      console.log(`[Notification] Successfully dispatched email to ADMIN_EMAIL (${adminEmail}) for ${payload.formTitle}`);
    } catch (err: any) {
      emailError = err?.message || String(err);
      console.error(`[Notification] Failed to send email via SMTP to ADMIN_EMAIL (${adminEmail}):`, emailError);
    }
  } else {
    // If SMTP is not configured yet, console log notice and acknowledge audit capture
    console.log(
      `[Notification to ADMIN_EMAIL (${adminEmail})]: New completed form "${payload.formTitle}" from ${payload.submitterName} (${payload.submitterEmail}). Logged to admin_audit_logs. Set SMTP_HOST, SMTP_USER, SMTP_PASS to enable SMTP delivery.`
    );
  }

  return {
    success: true,
    emailSent,
    adminEmail,
    error: emailError,
  };
}
