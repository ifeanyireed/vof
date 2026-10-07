import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local or .env
function loadEnv() {
  const envFiles = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
  ];

  const env = {};
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
        if (match) {
          let val = (match[2] || '').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (env[match[1]] === undefined) {
            env[match[1]] = val;
          }
        }
      });
    }
  }
  return env;
}

const env = loadEnv();

const toEmail = process.argv[2] || process.env.TEST_EMAIL_RECIPIENT || 'ifeanyireed@gmail.com';
const smtpHost = process.env.SMTP_HOST || env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = parseInt(process.env.SMTP_PORT || env.SMTP_PORT || '465', 10);
const smtpUser = process.env.SMTP_USER || env.SMTP_USER || 'admin@vonf.org';
const smtpPass = process.env.SMTP_PASS || env.SMTP_PASS || '';
const smtpFrom = process.env.SMTP_FROM || env.SMTP_FROM || `"Veronica Onyeneke Foundation" <${smtpUser}>`;

console.log('----------------------------------------------------');
console.log(' Veronica Onyeneke Foundation - SMTP Diagnostic Tool');
console.log('----------------------------------------------------');
console.log(` Target Recipient : ${toEmail}`);
console.log(` SMTP Host        : ${smtpHost}`);
console.log(` SMTP Port        : ${smtpPort}`);
console.log(` SMTP Secure      : ${smtpPort === 465}`);
console.log(` SMTP User        : ${smtpUser}`);
console.log(` SMTP Pass Set    : ${smtpPass ? 'Yes (' + smtpPass.length + ' chars)' : 'NO (Missing)'}`);
console.log(` SMTP From        : ${smtpFrom}`);
console.log('----------------------------------------------------');

if (!smtpPass) {
  console.error('\n❌ ERROR: SMTP_PASS is empty. Please set SMTP_PASS in web-app/.env.local\n');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

async function run() {
  try {
    console.log('Connecting to SMTP server and verifying credentials...');
    await transporter.verify();
    console.log('✅ Connection and authentication verified successfully!\n');

    console.log(`Sending test email to ${toEmail}...`);
    const sentAt = new Date().toUTCString();

    const info = await transporter.sendMail({
      from: smtpFrom,
      to: toEmail,
      subject: `[VOF Test] SMTP Delivery Verification - ${sentAt}`,
      text: `Hello,

This is a test notification confirming that email delivery is working properly for the Veronica Onyeneke Foundation web platform.

Verification Details:
- Recipient: ${toEmail}
- Sent At: ${sentAt}
- Outgoing Mail Server: ${smtpHost}:${smtpPort}
- Sender: ${smtpFrom}

Best regards,
Veronica Onyeneke Foundation Secretariat`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #16300b 0%, #2f5e17 100%); padding: 20px 24px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">Veronica Onyeneke Foundation</h2>
            <p style="color: #a3e635; margin: 4px 0 0 0; font-size: 13px; font-weight: 600;">System Notification &bull; SMTP Delivery Test</p>
          </div>
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">Hello,</p>
          <p style="font-size: 15px; color: #334155; line-height: 1.6;">
            This is a test notification confirming that email delivery is working properly for the <strong>Veronica Onyeneke Foundation (VOF)</strong> web platform.
          </p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: 700;">Verification Details</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #14532d; line-height: 1.8;">
              <li><strong>Recipient:</strong> ${toEmail}</li>
              <li><strong>Sent At:</strong> ${sentAt}</li>
              <li><strong>Outgoing Mail Server:</strong> ${smtpHost}:${smtpPort}</li>
              <li><strong>Sender:</strong> ${smtpFrom}</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #166534; font-weight: 600;">
            &#x2714; If you received this email, the SMTP configuration is working as expected.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            Veronica Onyeneke Foundation Secretariat &bull; <a href="https://vonf.org" style="color: #558b1a; text-decoration: none;">vonf.org</a>
          </p>
        </div>
      `,
    });

    console.log('✅ Email successfully dispatched!');
    console.log(`   Message ID : ${info.messageId}`);
    console.log(`   Response   : ${info.response}\n`);
  } catch (error) {
    console.error('\n❌ Failed to dispatch test email:');
    if (error.code === 'EAUTH') {
      console.error('   Authentication Error (535): The SMTP server rejected the username/password combination.');
      console.error('   Please check that the password in .env.local matches the current password for this mailbox in Hostinger hPanel.');
    } else {
      console.error(`   ${error.message || error}`);
    }
    console.error('');
    process.exit(1);
  }
}

run();
