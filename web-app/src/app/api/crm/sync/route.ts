import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId } from '@/lib/crm-db';

export const dynamic = 'force-dynamic';

type SyncSource = 'donations' | 'partners' | 'volunteers' | 'scholarships' | 'skills';

interface ExtractedContact {
  email: string;
  name: string;
  organization: string;
  phone: string;
  location: string;
  category: string;
  sourceLabel: string;
  notes: string;
  website?: string;
}

async function safeCount(queryFn: () => Promise<any[]>): Promise<number> {
  try {
    const rows = await queryFn();
    return Number(rows?.[0]?.cnt ?? 0);
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    await ensureCrmTables();
    const [donations, partners, volunteers, scholarships, skills] = await Promise.all([
      safeCount(() => sql`SELECT COUNT(DISTINCT LOWER(donor_email))::int AS cnt FROM donations WHERE donor_email IS NOT NULL AND TRIM(donor_email) <> '';`),
      safeCount(() => sql`SELECT COUNT(DISTINCT LOWER(email))::int AS cnt FROM partners WHERE email IS NOT NULL AND TRIM(email) <> '';`),
      safeCount(() => sql`SELECT COUNT(DISTINCT LOWER(email))::int AS cnt FROM volunteers WHERE email IS NOT NULL AND TRIM(email) <> '';`),
      safeCount(() => sql`SELECT COUNT(DISTINCT LOWER(email))::int AS cnt FROM scholarship_applications WHERE email IS NOT NULL AND TRIM(email) <> '';`),
      safeCount(() => sql`SELECT COUNT(DISTINCT LOWER(email))::int AS cnt FROM skill_applications WHERE email IS NOT NULL AND TRIM(email) <> '';`),
    ]);

    return NextResponse.json({
      counts: { donations, partners, volunteers, scholarships, skills },
    });
  } catch (error: any) {
    console.error('[CRM Sync GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to inspect VOF records' }, { status: 500 });
  }
}

async function fetchSourceContacts(source: SyncSource): Promise<ExtractedContact[]> {
  try {
    if (source === 'donations') {
      const rows = await sql`
        SELECT DISTINCT ON (LOWER(donor_email))
          donor_name, donor_email, donor_phone, campaign, currency, amount
        FROM donations
        WHERE donor_email IS NOT NULL AND TRIM(donor_email) <> ''
        ORDER BY LOWER(donor_email), donated_at DESC;
      `;
      return rows.map((r: any) => ({
        email: String(r.donor_email).trim().toLowerCase(),
        name: String(r.donor_name || 'VOF Donor').trim(),
        organization: 'Individual Donor',
        phone: String(r.donor_phone || '').trim(),
        location: '',
        category: 'Individual Major Donor',
        sourceLabel: 'VOF Donor Sync',
        notes: `Contributed ${r.currency || 'NGN'} ${Number(r.amount || 0).toLocaleString()} (${r.campaign || 'General Donation'})`,
      }));
    }

    if (source === 'partners') {
      const rows = await sql`
        SELECT DISTINCT ON (LOWER(email))
          organization_name, partner_type, contact_person, email, phone, country, city, website, partnership_interest
        FROM partners
        WHERE email IS NOT NULL AND TRIM(email) <> ''
        ORDER BY LOWER(email), created_at DESC;
      `;
      return rows.map((r: any) => ({
        email: String(r.email).trim().toLowerCase(),
        name: String(r.contact_person || r.organization_name || 'Partner Contact').trim(),
        organization: String(r.organization_name || 'Partner Organization').trim(),
        phone: String(r.phone || '').trim(),
        location: [r.city, r.country].filter(Boolean).join(', '),
        category: r.partner_type || 'Corporate Sponsor',
        sourceLabel: 'VOF Partner Sync',
        website: String(r.website || '').trim(),
        notes: r.partnership_interest ? `Partnership interest: ${r.partnership_interest}` : '',
      }));
    }

    if (source === 'volunteers') {
      const rows = await sql`
        SELECT DISTINCT ON (LOWER(email))
          full_name, email, phone, location, country, interest_area
        FROM volunteers
        WHERE email IS NOT NULL AND TRIM(email) <> ''
        ORDER BY LOWER(email), created_at DESC;
      `;
      return rows.map((r: any) => ({
        email: String(r.email).trim().toLowerCase(),
        name: String(r.full_name || 'VOF Volunteer').trim(),
        organization: 'VOF Volunteer Network',
        phone: String(r.phone || '').trim(),
        location: [r.location, r.country].filter(Boolean).join(', '),
        category: 'Community Volunteer',
        sourceLabel: 'VOF Volunteer Sync',
        notes: r.interest_area ? `Volunteer interest: ${r.interest_area}` : '',
      }));
    }

    if (source === 'scholarships') {
      const rows = await sql`
        SELECT DISTINCT ON (LOWER(email))
          applicant_name, email, phone, state_of_origin, institution_name, course_of_study
        FROM scholarship_applications
        WHERE email IS NOT NULL AND TRIM(email) <> ''
        ORDER BY LOWER(email), created_at DESC;
      `;
      return rows.map((r: any) => ({
        email: String(r.email).trim().toLowerCase(),
        name: String(r.applicant_name || 'Scholarship Applicant').trim(),
        organization: String(r.institution_name || 'Academic Applicant').trim(),
        phone: String(r.phone || '').trim(),
        location: String(r.state_of_origin || 'Nigeria').trim(),
        category: 'Scholarship Applicant',
        sourceLabel: 'VOF Scholarship Sync',
        notes: r.course_of_study ? `Course: ${r.course_of_study}` : '',
      }));
    }

    if (source === 'skills') {
      const rows = await sql`
        SELECT DISTINCT ON (LOWER(email))
          applicant_name, email, phone, address, trade_selected
        FROM skill_applications
        WHERE email IS NOT NULL AND TRIM(email) <> ''
        ORDER BY LOWER(email), created_at DESC;
      `;
      return rows.map((r: any) => ({
        email: String(r.email).trim().toLowerCase(),
        name: String(r.applicant_name || 'VOIE Applicant').trim(),
        organization: 'VOIE Skills Applicant',
        phone: String(r.phone || '').trim(),
        location: String(r.address || 'Nigeria').trim(),
        category: 'Vocational Applicant',
        sourceLabel: 'VOF Skills Sync',
        notes: r.trade_selected ? `Trade: ${r.trade_selected}` : '',
      }));
    }
  } catch (err) {
    console.warn(`[CRM Sync] Source ${source} query skipped:`, err);
  }
  return [];
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();

    const sources: SyncSource[] = Array.isArray(body.sources) ? body.sources : [];
    const target: 'leads' | 'list' | 'both' = body.target || 'list';
    let targetListId: string | null = body.listId ? String(body.listId).trim() : null;
    const newListName = String(body.newListName || '').trim();

    if (sources.length === 0) {
      return NextResponse.json({ error: 'Select at least one VOF source to sync' }, { status: 400 });
    }

    // Collect deduplicated contacts across selected sources
    const byEmail = new Map<string, ExtractedContact>();
    for (const src of sources) {
      const extracted = await fetchSourceContacts(src);
      for (const c of extracted) {
        if (!c.email || !c.email.includes('@')) continue;
        if (!byEmail.has(c.email)) {
          byEmail.set(c.email, c);
        }
      }
    }

    const contacts = Array.from(byEmail.values());
    let leadsAdded = 0;
    let leadsSkipped = 0;
    let subscribersAdded = 0;
    let subscribersSkipped = 0;

    // 1. Sync into CRM Leads
    if (target === 'leads' || target === 'both') {
      const existingLeadRows = await sql`SELECT LOWER(contact_email) AS email FROM crm_leads WHERE contact_email <> '';`;
      const existingLeadEmails = new Set(existingLeadRows.map((r: any) => String(r.email)));

      for (const c of contacts) {
        if (existingLeadEmails.has(c.email)) {
          leadsSkipped += 1;
          continue;
        }
        const id = makeCrmId('LEAD');
        const signalsJson = JSON.stringify([c.sourceLabel]);
        await sql`
          INSERT INTO crm_leads (
            id, organization_name, website, category, location, contact_name,
            contact_email, contact_phone, fit_score, engagement_signals,
            status, source, notes
          ) VALUES (
            ${id},
            ${c.organization || c.name},
            ${c.website || ''},
            ${c.category},
            ${c.location},
            ${c.name},
            ${c.email},
            ${c.phone},
            ${c.sourceLabel === 'VOF Donor Sync' ? 90 : c.sourceLabel === 'VOF Partner Sync' ? 88 : 72},
            ${signalsJson}::jsonb,
            ${c.sourceLabel === 'VOF Donor Sync' || c.sourceLabel === 'VOF Partner Sync' ? 'QUALIFIED' : 'CURIOUS'},
            ${c.sourceLabel},
            ${c.notes}
          );
        `;
        existingLeadEmails.add(c.email);
        leadsAdded += 1;
      }
    }

    // 2. Sync into Audience List
    if (target === 'list' || target === 'both') {
      if (!targetListId) {
        const listName =
          newListName ||
          `VOF Synced ${sources.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ')}`;
        targetListId = makeCrmId('LIST');
        const tagsJson = JSON.stringify(['VOF Sync', ...sources]);
        await sql`
          INSERT INTO crm_email_lists (id, name, description, tags)
          VALUES (
            ${targetListId},
            ${listName},
            ${`Auto-synced from Veronica Onyeneke Foundation records (${sources.join(', ')})`},
            ${tagsJson}::jsonb
          );
        `;
      }

      for (const c of contacts) {
        const parts = c.name.split(/\s+/).filter(Boolean);
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ');
        const subId = makeCrmId('SUB');

        const inserted = await sql`
          INSERT INTO crm_email_subscribers (
            id, list_id, email, name, first_name, last_name,
            organization, phone, source, status
          ) VALUES (
            ${subId},
            ${targetListId},
            ${c.email},
            ${c.name},
            ${firstName},
            ${lastName},
            ${c.organization},
            ${c.phone},
            ${c.sourceLabel},
            'SUBSCRIBED'
          )
          ON CONFLICT (list_id, email) DO NOTHING
          RETURNING id;
        `;

        if (inserted.length > 0) subscribersAdded += 1;
        else subscribersSkipped += 1;
      }
    }

    return NextResponse.json({
      success: true,
      totalFound: contacts.length,
      leadsAdded,
      leadsSkipped,
      subscribersAdded,
      subscribersSkipped,
      listId: targetListId,
    });
  } catch (error: any) {
    console.error('[CRM Sync POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync VOF records' }, { status: 500 });
  }
}
