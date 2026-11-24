import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId } from '@/lib/crm-db';

const TRACKING_SECRET =
  process.env.CRM_UNSUBSCRIBE_SECRET ||
  process.env.JWT_SECRET ||
  'vof-crm-tracking-secret';

export interface TrackingPayload {
  blastId: string;
  logId: string;
  subscriberId?: string;
  email: string;
}

export function signTrackingToken(payload: TrackingPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', TRACKING_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyTrackingToken(token: string): TrackingPayload | null {
  try {
    const [encoded, sig] = String(token || '').split('.');
    if (!encoded || !sig) return null;
    const expected = crypto.createHmac('sha256', TRACKING_SECRET).update(encoded).digest('base64url');
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as TrackingPayload;
  } catch {
    return null;
  }
}

export function resolveSiteBaseUrl(): string {
  const raw =
    process.env.CRM_TRACKING_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://vonf.org';
  return raw.replace(/\/+$/, '');
}

export interface ResolvedSmtp {
  host: string;
  port: number;
  encryption: 'tls' | 'ssl' | 'none';
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
}

export async function resolveCrmSmtp(senderProfileId?: string | null): Promise<ResolvedSmtp | null> {
  await ensureCrmTables();

  if (senderProfileId && senderProfileId !== 'env_default') {
    const rows = await sql`
      SELECT host, port, encryption, username, password, from_name, from_email, reply_to
      FROM crm_sender_profiles
      WHERE id = ${senderProfileId}
      LIMIT 1;
    `;
    if (rows.length > 0 && rows[0].host && rows[0].password) {
      const p = rows[0];
      return {
        host: p.host,
        port: Number(p.port) || 587,
        encryption: (p.encryption || 'tls') as ResolvedSmtp['encryption'],
        username: p.username,
        password: p.password,
        fromName: p.from_name,
        fromEmail: p.from_email,
        replyTo: p.reply_to || undefined,
      };
    }
  }

  const defaultRows = await sql`
    SELECT host, port, encryption, username, password, from_name, from_email, reply_to
    FROM crm_sender_profiles
    WHERE is_default = TRUE
    ORDER BY updated_at DESC
    LIMIT 1;
  `;
  if (defaultRows.length > 0 && defaultRows[0].host && defaultRows[0].password) {
    const p = defaultRows[0];
    return {
      host: p.host,
      port: Number(p.port) || 587,
      encryption: (p.encryption || 'tls') as ResolvedSmtp['encryption'],
      username: p.username,
      password: p.password,
      fromName: p.from_name,
      fromEmail: p.from_email,
      replyTo: p.reply_to || undefined,
    };
  }

  const host = process.env.SMTP_HOST;
  const username = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const password = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  if (host && username && password) {
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const rawFrom = process.env.SMTP_FROM || '';
    const emailMatch = rawFrom.match(/<([^>]+)>/);
    const fromEmail = emailMatch ? emailMatch[1] : rawFrom.includes('@') ? rawFrom : username;
    const fromName = emailMatch
      ? rawFrom.replace(/<[^>]+>/, '').replace(/^["'\s]+|["'\s]+$/g, '')
      : 'Veronica Onyeneke Foundation';
    return {
      host,
      port,
      encryption: port === 465 ? 'ssl' : 'tls',
      username,
      password,
      fromName: fromName || 'Veronica Onyeneke Foundation',
      fromEmail,
    };
  }

  return null;
}

export function createSmtpTransporter(cfg: ResolvedSmtp) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.encryption === 'ssl' || cfg.port === 465,
    auth: {
      user: cfg.username,
      pass: cfg.password,
    },
    ...(cfg.encryption === 'none' ? { ignoreTLS: true } : {}),
  });
}

export function isRecipientBounceError(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || '').toLowerCase();
  const resp = String(err.response || '').toLowerCase();
  const code = String(err.code || '').toUpperCase();
  const respCode = Number(err.responseCode || 0);

  if (
    code === 'EAUTH' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    msg.includes('authentication failed') ||
    msg.includes('quota exceeded') ||
    msg.includes('rate limit')
  ) {
    return false;
  }

  if (respCode >= 550 && respCode <= 559) return true;
  if (
    resp.includes('user unknown') ||
    resp.includes('no such user') ||
    resp.includes('mailbox unavailable') ||
    resp.includes('does not exist') ||
    resp.includes('invalid recipient')
  ) {
    return true;
  }
  return false;
}

export function applyMergeTags(
  template: string,
  recipient: {
    email: string;
    name?: string;
    firstName?: string;
    organization?: string;
    unsubscribeUrl: string;
  }
): string {
  const fullName = (recipient.name || '').trim();
  const firstName = (recipient.firstName || fullName.split(/\s+/)[0] || '').trim();
  const org = (recipient.organization || '').trim();

  const values: Record<string, string> = {
    first_name: firstName,
    firstname: firstName,
    name: fullName || firstName,
    full_name: fullName || firstName,
    company: org,
    organization: org,
    email: recipient.email,
    unsubscribe_url: recipient.unsubscribeUrl,
  };

  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)(?:\|([^}]*))?\s*\}\}/g, (_match, rawKey, fallbackVal) => {
    const key = String(rawKey).toLowerCase();
    const val = values[key];
    if (val && val.trim()) return val;
    if (fallbackVal !== undefined) return String(fallbackVal).trim();
    if (key === 'first_name' || key === 'firstname' || key === 'name' || key === 'full_name') {
      return 'Friend';
    }
    if (key === 'company' || key === 'organization') {
      return 'your organization';
    }
    return '';
  });
}

function injectTrackingAndFooter(html: string, token: string, unsubscribeUrl: string, baseUrl: string): string {
  let out = html;

  // Rewrite http/https links for click tracking (skip unsubscribe & mailto)
  out = out.replace(/href=(["'])(https?:\/\/[^"']+)\1/gi, (full, quote, url) => {
    if (url.includes('/crm/unsubscribe') || url.includes('/api/crm/track/')) {
      return full;
    }
    const tracked = `${baseUrl}/api/crm/track/click?t=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}`;
    return `href=${quote}${tracked}${quote}`;
  });

  // Add CAN-SPAM compliant foundation footer if unsubscribe link is not already present
  if (!out.includes(unsubscribeUrl) && !out.includes('/crm/unsubscribe')) {
    out += `
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;text-align:center;font-family:Arial,sans-serif;">
        <p style="margin:0 0 6px 0;">Sent by <strong>Veronica Onyeneke Foundation</strong> · Philanthropy, Education & Community Empowerment</p>
        <p style="margin:0;">
          Don&apos;t want to receive these updates?
          <a href="${unsubscribeUrl}" style="color:#558b1a;text-decoration:underline;">Unsubscribe here</a>.
        </p>
      </div>
    `;
  }

  // Append 1x1 open tracking pixel
  const pixelUrl = `${baseUrl}/api/crm/track/open?t=${encodeURIComponent(token)}`;
  out += `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;opacity:0;" />`;

  return out;
}

export async function dispatchCrmBlast(blastId: string): Promise<{
  sentCount: number;
  failedCount: number;
  bounceCount: number;
  totalRecipients: number;
  status: string;
  error?: string;
}> {
  await ensureCrmTables();

  const blastRows = await sql`SELECT * FROM crm_email_blasts WHERE id = ${blastId} LIMIT 1;`;
  if (blastRows.length === 0) {
    throw new Error('Campaign blast not found');
  }
  const blast = blastRows[0];

  const smtp = await resolveCrmSmtp(blast.sender_profile_id);
  if (!smtp) {
    await sql`UPDATE crm_email_blasts SET status = 'FAILED', updated_at = NOW() WHERE id = ${blastId};`;
    throw new Error(
      'No SMTP sender configured. Add a Sender Profile in CRM > Sender Settings or set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.'
    );
  }

  // Determine target subscribers
  const recipientIds: string[] = Array.isArray(blast.recipient_ids)
    ? blast.recipient_ids
    : typeof blast.recipient_ids === 'string' && blast.recipient_ids.trim()
    ? JSON.parse(blast.recipient_ids)
    : [];

  let subscribers: any[] = [];
  if (recipientIds.length > 0) {
    subscribers = await sql`
      SELECT * FROM crm_email_subscribers
      WHERE id = ANY(${recipientIds}::text[]) AND status = 'SUBSCRIBED';
    `;
  } else if (blast.list_id) {
    subscribers = await sql`
      SELECT * FROM crm_email_subscribers
      WHERE list_id = ${blast.list_id} AND status = 'SUBSCRIBED'
      ORDER BY created_at ASC;
    `;
  }

  if (subscribers.length === 0) {
    await sql`UPDATE crm_email_blasts SET status = 'FAILED', total_recipients = 0, updated_at = NOW() WHERE id = ${blastId};`;
    throw new Error('No active subscribed recipients found for this audience list.');
  }

  // Skip already-sent emails if resuming a partially sent blast
  const alreadySentRows = await sql`
    SELECT LOWER(email) AS email FROM crm_email_blast_logs
    WHERE blast_id = ${blastId} AND status = 'SENT';
  `;
  const alreadySentSet = new Set(alreadySentRows.map((r: any) => String(r.email)));

  const pendingSubscribers = subscribers.filter(
    (sub) => sub.email && !alreadySentSet.has(String(sub.email).toLowerCase())
  );

  await sql`
    UPDATE crm_email_blasts
    SET status = 'SENDING', total_recipients = ${subscribers.length}, updated_at = NOW()
    WHERE id = ${blastId};
  `;

  const transporter = createSmtpTransporter(smtp);
  const baseUrl = resolveSiteBaseUrl();
  const fromName = (blast.sender_name || smtp.fromName || 'Veronica Onyeneke Foundation').trim();
  const fromEmail = (blast.sender_email || smtp.fromEmail).trim();

  let sentCount = alreadySentSet.size;
  let failedCount = 0;
  let bounceCount = 0;

  for (const sub of pendingSubscribers) {
    const logId = makeCrmId('LOG');
    const token = signTrackingToken({
      blastId,
      logId,
      subscriberId: sub.id,
      email: sub.email,
    });
    const unsubscribeUrl = `${baseUrl}/crm/unsubscribe?t=${encodeURIComponent(token)}`;
    const personalizedSubject = applyMergeTags(blast.subject, {
      email: sub.email,
      name: sub.name,
      firstName: sub.first_name,
      organization: sub.organization,
      unsubscribeUrl,
    });
    const personalizedHtml = applyMergeTags(blast.content_html, {
      email: sub.email,
      name: sub.name,
      firstName: sub.first_name,
      organization: sub.organization,
      unsubscribeUrl,
    });
    const finalHtml = injectTrackingAndFooter(personalizedHtml, token, unsubscribeUrl, baseUrl);

    try {
      await transporter.sendMail({
        from: `"${fromName.replace(/"/g, '')}" <${fromEmail}>`,
        to: sub.email,
        replyTo: smtp.replyTo || fromEmail,
        subject: personalizedSubject,
        html: finalHtml,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
      });

      sentCount += 1;
      await sql`
        INSERT INTO crm_email_blast_logs (
          id, blast_id, subscriber_id, email, recipient_name, organization, status, sent_at
        ) VALUES (
          ${logId}, ${blastId}, ${sub.id}, ${sub.email}, ${sub.name || ''}, ${sub.organization || ''}, 'SENT', NOW()
        );
      `;
    } catch (err: any) {
      const errMsg = String(err?.message || err || 'SMTP delivery failed').slice(0, 500);
      const isBounce = isRecipientBounceError(err);

      if (isBounce) {
        bounceCount += 1;
        await sql`
          UPDATE crm_email_subscribers
          SET status = 'BOUNCED', bounced_at = NOW(), bounce_reason = ${errMsg}
          WHERE id = ${sub.id};
        `;
      } else {
        failedCount += 1;
      }

      await sql`
        INSERT INTO crm_email_blast_logs (
          id, blast_id, subscriber_id, email, recipient_name, organization, status, error_message
        ) VALUES (
          ${logId},
          ${blastId},
          ${sub.id},
          ${sub.email},
          ${sub.name || ''},
          ${sub.organization || ''},
          ${isBounce ? 'BOUNCED' : 'FAILED'},
          ${errMsg}
        );
      `;
    }
  }

  const finalStatus = sentCount > 0 ? 'SENT' : 'FAILED';
  await sql`
    UPDATE crm_email_blasts
    SET
      status = ${finalStatus},
      sent_at = CASE WHEN ${finalStatus} = 'SENT' THEN NOW() ELSE sent_at END,
      total_recipients = ${subscribers.length},
      sent_count = ${sentCount},
      failed_count = ${failedCount},
      bounce_count = ${bounceCount},
      updated_at = NOW()
    WHERE id = ${blastId};
  `;

  return {
    sentCount,
    failedCount,
    bounceCount,
    totalRecipients: subscribers.length,
    status: finalStatus,
  };
}
