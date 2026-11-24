import crypto from 'crypto';
import { sql } from '@/lib/db';
import type {
  CrmAccount,
  CrmBlastLog,
  CrmCall,
  CrmDeal,
  CrmEmailBlast,
  CrmEmailList,
  CrmEmailSubscriber,
  CrmLead,
  CrmSenderProfile,
} from '@/lib/crm-types';

let crmTablesReady = false;

export function makeCrmId(prefix: string): string {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function ensureCrmTables() {
  if (crmTablesReady) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS crm_leads (
        id VARCHAR(64) PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        website VARCHAR(255) DEFAULT '',
        category VARCHAR(120) DEFAULT 'Corporate Sponsor',
        location VARCHAR(255) DEFAULT '',
        contact_name VARCHAR(255) NOT NULL,
        contact_title VARCHAR(150) DEFAULT '',
        contact_email VARCHAR(255) DEFAULT '',
        contact_phone VARCHAR(80) DEFAULT '',
        linkedin_url TEXT DEFAULT '',
        fit_score INT DEFAULT 70,
        engagement_signals JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'CURIOUS',
        assigned_rep VARCHAR(150) DEFAULT '',
        source VARCHAR(100) DEFAULT 'Manual',
        notes TEXT DEFAULT '',
        converted_deal_id VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_deals (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        phone VARCHAR(80) DEFAULT '',
        value_display VARCHAR(80) DEFAULT '₦0',
        value_amount NUMERIC(16, 2) DEFAULT 0,
        currency VARCHAR(10) DEFAULT 'NGN',
        stage VARCHAR(40) DEFAULT 'DISCOVERY',
        owner VARCHAR(150) DEFAULT '',
        probability INT DEFAULT 50,
        expected_close VARCHAR(80) DEFAULT '',
        campaign_type VARCHAR(120) DEFAULT 'Scholarship Sponsorship',
        notes TEXT DEFAULT '',
        lead_id VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_accounts (
        id VARCHAR(64) PRIMARY KEY,
        organization VARCHAR(255) NOT NULL,
        category VARCHAR(120) DEFAULT 'Corporate Partner',
        location VARCHAR(255) DEFAULT '',
        total_contributed VARCHAR(80) DEFAULT '₦0',
        status VARCHAR(40) DEFAULT 'PROSPECT',
        key_contact VARCHAR(255) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        phone VARCHAR(80) DEFAULT '',
        website VARCHAR(255) DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_calls (
        id VARCHAR(64) PRIMARY KEY,
        lead_id VARCHAR(64),
        contact_name VARCHAR(255) NOT NULL,
        organization VARCHAR(255) DEFAULT '',
        phone_number VARCHAR(80) DEFAULT '',
        rep_name VARCHAR(150) DEFAULT '',
        rep_email VARCHAR(255) DEFAULT '',
        direction VARCHAR(20) DEFAULT 'OUTBOUND',
        outcome VARCHAR(50) DEFAULT 'CONNECTED_INTERESTED',
        duration_seconds INT DEFAULT 0,
        score INT DEFAULT 0,
        score_breakdown JSONB DEFAULT '{}'::jsonb,
        notes TEXT DEFAULT '',
        followup_date VARCHAR(80) DEFAULT '',
        called_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_email_lists (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        tags JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_email_subscribers (
        id VARCHAR(64) PRIMARY KEY,
        list_id VARCHAR(64) NOT NULL REFERENCES crm_email_lists(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT '',
        first_name VARCHAR(120) DEFAULT '',
        last_name VARCHAR(120) DEFAULT '',
        organization VARCHAR(255) DEFAULT '',
        phone VARCHAR(80) DEFAULT '',
        linkedin_url TEXT DEFAULT '',
        source VARCHAR(100) DEFAULT 'Manual',
        status VARCHAR(30) DEFAULT 'SUBSCRIBED',
        bounced_at TIMESTAMPTZ,
        bounce_reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (list_id, email)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_sender_profiles (
        id VARCHAR(64) PRIMARY KEY,
        profile_name VARCHAR(150) NOT NULL,
        provider VARCHAR(80) DEFAULT 'Custom SMTP',
        host VARCHAR(255) NOT NULL,
        port INT DEFAULT 587,
        encryption VARCHAR(20) DEFAULT 'tls',
        username VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        from_name VARCHAR(150) NOT NULL,
        from_email VARCHAR(255) NOT NULL,
        reply_to VARCHAR(255) DEFAULT '',
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_email_blasts (
        id VARCHAR(64) PRIMARY KEY,
        list_id VARCHAR(64),
        list_name VARCHAR(255) DEFAULT '',
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        preview_text VARCHAR(500) DEFAULT '',
        content_html TEXT NOT NULL,
        sender_name VARCHAR(150) DEFAULT '',
        sender_email VARCHAR(255) DEFAULT '',
        sender_profile_id VARCHAR(64),
        recipient_ids JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(30) DEFAULT 'DRAFT',
        scheduled_at TIMESTAMPTZ,
        sent_at TIMESTAMPTZ,
        total_recipients INT DEFAULT 0,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        open_count INT DEFAULT 0,
        click_count INT DEFAULT 0,
        bounce_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS crm_email_blast_logs (
        id VARCHAR(64) PRIMARY KEY,
        blast_id VARCHAR(64) NOT NULL REFERENCES crm_email_blasts(id) ON DELETE CASCADE,
        subscriber_id VARCHAR(64),
        email VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255) DEFAULT '',
        organization VARCHAR(255) DEFAULT '',
        status VARCHAR(30) DEFAULT 'PENDING',
        error_message TEXT DEFAULT '',
        opened_at TIMESTAMPTZ,
        open_count INT DEFAULT 0,
        clicked_at TIMESTAMPTZ,
        click_count INT DEFAULT 0,
        sent_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON crm_leads(LOWER(contact_email));`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON crm_deals(stage);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_calls_called_at ON crm_calls(called_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_subscribers_list ON crm_email_subscribers(list_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_crm_blast_logs_blast ON crm_email_blast_logs(blast_id);`;

    crmTablesReady = true;
  } catch (err) {
    console.error('[CRM DB] Failed ensuring CRM tables:', err);
    throw err;
  }
}

function parseJson<T>(val: any, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val as T;
  if (typeof val === 'string' && val.trim()) {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function mapLeadRow(row: any): CrmLead {
  return {
    id: row.id,
    organizationName: row.organization_name || '',
    website: row.website || '',
    category: row.category || 'Corporate Sponsor',
    location: row.location || '',
    contactName: row.contact_name || '',
    contactTitle: row.contact_title || '',
    contactEmail: row.contact_email || '',
    contactPhone: row.contact_phone || '',
    linkedinUrl: row.linkedin_url || '',
    fitScore: Number(row.fit_score ?? 70),
    engagementSignals: parseJson<string[]>(row.engagement_signals, []),
    status: row.status || 'CURIOUS',
    assignedRep: row.assigned_rep || '',
    source: row.source || 'Manual',
    notes: row.notes || '',
    convertedDealId: row.converted_deal_id || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export function mapDealRow(row: any): CrmDeal {
  return {
    id: row.id,
    title: row.title || '',
    organization: row.organization || '',
    contactName: row.contact_name || '',
    email: row.email || '',
    phone: row.phone || '',
    valueDisplay: row.value_display || '₦0',
    valueAmount: Number(row.value_amount ?? 0),
    currency: row.currency || 'NGN',
    stage: (row.stage || 'DISCOVERY') as CrmDeal['stage'],
    owner: row.owner || '',
    probability: Number(row.probability ?? 50),
    expectedClose: row.expected_close || '',
    campaignType: row.campaign_type || 'Scholarship Sponsorship',
    notes: row.notes || '',
    leadId: row.lead_id || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export function mapAccountRow(row: any): CrmAccount {
  return {
    id: row.id,
    organization: row.organization || '',
    category: row.category || 'Corporate Partner',
    location: row.location || '',
    totalContributed: row.total_contributed || '₦0',
    status: (row.status || 'PROSPECT') as CrmAccount['status'],
    keyContact: row.key_contact || '',
    email: row.email || '',
    phone: row.phone || '',
    website: row.website || '',
    notes: row.notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export function mapCallRow(row: any): CrmCall {
  return {
    id: row.id,
    leadId: row.lead_id || null,
    contactName: row.contact_name || '',
    organization: row.organization || '',
    phoneNumber: row.phone_number || '',
    repName: row.rep_name || '',
    repEmail: row.rep_email || '',
    direction: row.direction === 'INBOUND' ? 'INBOUND' : 'OUTBOUND',
    outcome: (row.outcome || 'CONNECTED_INTERESTED') as CrmCall['outcome'],
    durationSeconds: Number(row.duration_seconds ?? 0),
    score: Number(row.score ?? 0),
    scoreBreakdown: parseJson(row.score_breakdown, {}),
    notes: row.notes || '',
    followupDate: row.followup_date || '',
    calledAt: row.called_at ? new Date(row.called_at).toISOString() : new Date().toISOString(),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function mapListRow(row: any): CrmEmailList {
  return {
    id: row.id,
    name: row.name || '',
    description: row.description || '',
    tags: parseJson<string[]>(row.tags, []),
    subscriberCount: Number(row.subscriber_count ?? 0),
    bouncedCount: Number(row.bounced_count ?? 0),
    unsubscribedCount: Number(row.unsubscribed_count ?? 0),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function mapSubscriberRow(row: any): CrmEmailSubscriber {
  return {
    id: row.id,
    listId: row.list_id,
    email: row.email || '',
    name: row.name || '',
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    organization: row.organization || '',
    phone: row.phone || '',
    linkedinUrl: row.linkedin_url || '',
    source: row.source || 'Manual',
    status: (row.status || 'SUBSCRIBED') as CrmEmailSubscriber['status'],
    bouncedAt: row.bounced_at ? new Date(row.bounced_at).toISOString() : null,
    bounceReason: row.bounce_reason || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function mapSenderProfileRow(row: any): CrmSenderProfile {
  return {
    id: row.id,
    profileName: row.profile_name || '',
    provider: row.provider || 'Custom SMTP',
    host: row.host || '',
    port: Number(row.port ?? 587),
    encryption: (row.encryption || 'tls') as CrmSenderProfile['encryption'],
    username: row.username || '',
    hasPassword: Boolean(row.password),
    fromName: row.from_name || '',
    fromEmail: row.from_email || '',
    replyTo: row.reply_to || '',
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function mapBlastRow(row: any): CrmEmailBlast {
  return {
    id: row.id,
    listId: row.list_id || null,
    listName: row.list_name || '',
    title: row.title || '',
    subject: row.subject || '',
    previewText: row.preview_text || '',
    contentHtml: row.content_html || '',
    senderName: row.sender_name || '',
    senderEmail: row.sender_email || '',
    senderProfileId: row.sender_profile_id || null,
    recipientIds: parseJson<string[]>(row.recipient_ids, []),
    status: (row.status || 'DRAFT') as CrmEmailBlast['status'],
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at).toISOString() : null,
    sentAt: row.sent_at ? new Date(row.sent_at).toISOString() : null,
    totalRecipients: Number(row.total_recipients ?? 0),
    sentCount: Number(row.sent_count ?? 0),
    failedCount: Number(row.failed_count ?? 0),
    openCount: Number(row.open_count ?? 0),
    clickCount: Number(row.click_count ?? 0),
    bounceCount: Number(row.bounce_count ?? 0),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export function mapBlastLogRow(row: any): CrmBlastLog {
  return {
    id: row.id,
    blastId: row.blast_id,
    subscriberId: row.subscriber_id || null,
    email: row.email || '',
    recipientName: row.recipient_name || '',
    organization: row.organization || '',
    status: (row.status || 'PENDING') as CrmBlastLog['status'],
    errorMessage: row.error_message || '',
    openedAt: row.opened_at ? new Date(row.opened_at).toISOString() : null,
    openCount: Number(row.open_count ?? 0),
    clickedAt: row.clicked_at ? new Date(row.clicked_at).toISOString() : null,
    clickCount: Number(row.click_count ?? 0),
    sentAt: row.sent_at ? new Date(row.sent_at).toISOString() : null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}
