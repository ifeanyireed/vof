import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapDealRow, mapLeadRow } from '@/lib/crm-db';
import { parseNumericValue } from '@/lib/crm-types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = (searchParams.get('search') || '').trim().toLowerCase();

    const rows = await sql`
      SELECT * FROM crm_leads
      ORDER BY created_at DESC;
    `;

    let leads = rows.map(mapLeadRow);
    if (status && status !== 'ALL') {
      leads = leads.filter((l) => l.status.toUpperCase() === status.toUpperCase());
    }
    if (search) {
      leads = leads.filter(
        (l) =>
          l.organizationName.toLowerCase().includes(search) ||
          l.contactName.toLowerCase().includes(search) ||
          l.contactEmail.toLowerCase().includes(search) ||
          (l.contactPhone || '').toLowerCase().includes(search) ||
          (l.location || '').toLowerCase().includes(search) ||
          (l.category || '').toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error('[CRM Leads GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();

    // 1. Convert lead to fundraising pipeline opportunity
    if (body.action === 'convert' && body.leadId) {
      const leadRows = await sql`SELECT * FROM crm_leads WHERE id = ${String(body.leadId)} LIMIT 1;`;
      if (leadRows.length === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      const lead = mapLeadRow(leadRows[0]);
      const dealId = makeCrmId('OPP');
      const valueDisplay = String(body.valueDisplay || '₦1,000,000');
      const valueAmount = parseNumericValue(valueDisplay);
      const currency = valueDisplay.includes('$') ? 'USD' : valueDisplay.includes('£') ? 'GBP' : 'NGN';
      const title = String(body.title || `${lead.organizationName} — Sponsorship & Grant Partnership`);

      const dealRows = await sql`
        INSERT INTO crm_deals (
          id, title, organization, contact_name, email, phone,
          value_display, value_amount, currency, stage, owner,
          probability, expected_close, campaign_type, notes, lead_id
        ) VALUES (
          ${dealId},
          ${title},
          ${lead.organizationName},
          ${lead.contactName},
          ${lead.contactEmail},
          ${lead.contactPhone || ''},
          ${valueDisplay},
          ${valueAmount},
          ${currency},
          ${String(body.stage || 'QUALIFIED')},
          ${String(body.owner || lead.assignedRep || 'VOF Partnerships Desk')},
          ${Number(body.probability ?? 50)},
          ${String(body.expectedClose || 'Next Quarter')},
          ${String(body.campaignType || lead.category || 'Scholarship Sponsorship')},
          ${String(body.notes || lead.notes || '')},
          ${lead.id}
        )
        RETURNING *;
      `;

      const updatedLeadRows = await sql`
        UPDATE crm_leads
        SET status = 'CONVERTED', converted_deal_id = ${dealId}, updated_at = NOW()
        WHERE id = ${lead.id}
        RETURNING *;
      `;

      return NextResponse.json(
        {
          lead: mapLeadRow(updatedLeadRows[0]),
          deal: mapDealRow(dealRows[0]),
        },
        { status: 201 }
      );
    }

    // 2. Bulk import leads
    if (body.action === 'bulk' && Array.isArray(body.leads)) {
      const existingRows = await sql`SELECT LOWER(contact_email) AS email FROM crm_leads WHERE contact_email <> '';`;
      const existingEmails = new Set(existingRows.map((r: any) => String(r.email)));
      const created: any[] = [];
      let skipped = 0;

      for (const item of body.leads) {
        const email = String(item.contactEmail || item.email || '').trim().toLowerCase();
        if (email && existingEmails.has(email)) {
          skipped += 1;
          continue;
        }
        const id = makeCrmId('LEAD');
        const orgName = String(item.organizationName || item.organization || item.name || 'Individual Supporter').trim();
        const contactName = String(item.contactName || item.name || orgName).trim();
        const signalsJson = JSON.stringify(Array.isArray(item.engagementSignals) ? item.engagementSignals : []);

        const inserted = await sql`
          INSERT INTO crm_leads (
            id, organization_name, website, category, location, contact_name,
            contact_title, contact_email, contact_phone, linkedin_url,
            fit_score, engagement_signals, status, assigned_rep, source, notes
          ) VALUES (
            ${id},
            ${orgName},
            ${String(item.website || '')},
            ${String(item.category || body.defaultCategory || 'Corporate Sponsor')},
            ${String(item.location || '')},
            ${contactName},
            ${String(item.contactTitle || '')},
            ${email},
            ${String(item.contactPhone || item.phone || '')},
            ${String(item.linkedinUrl || '')},
            ${Number(item.fitScore ?? 70)},
            ${signalsJson}::jsonb,
            ${String(item.status || 'CURIOUS')},
            ${String(item.assignedRep || body.assignedRep || '')},
            ${String(item.source || 'Bulk Import')},
            ${String(item.notes || '')}
          )
          RETURNING *;
        `;
        if (email) existingEmails.add(email);
        created.push(mapLeadRow(inserted[0]));
      }

      return NextResponse.json({ createdCount: created.length, skippedCount: skipped, leads: created }, { status: 201 });
    }

    // 3. Single create
    const orgName = String(body.organizationName || '').trim();
    const contactName = String(body.contactName || '').trim();
    if (!orgName && !contactName) {
      return NextResponse.json({ error: 'Organization name or contact name is required' }, { status: 400 });
    }

    const id = makeCrmId('LEAD');
    const signalsJson = JSON.stringify(Array.isArray(body.engagementSignals) ? body.engagementSignals : []);

    const rows = await sql`
      INSERT INTO crm_leads (
        id, organization_name, website, category, location, contact_name,
        contact_title, contact_email, contact_phone, linkedin_url,
        fit_score, engagement_signals, status, assigned_rep, source, notes
      ) VALUES (
        ${id},
        ${orgName || contactName},
        ${String(body.website || '').trim()},
        ${String(body.category || 'Corporate Sponsor').trim()},
        ${String(body.location || '').trim()},
        ${contactName || orgName},
        ${String(body.contactTitle || '').trim()},
        ${String(body.contactEmail || '').trim().toLowerCase()},
        ${String(body.contactPhone || '').trim()},
        ${String(body.linkedinUrl || '').trim()},
        ${Math.min(100, Math.max(0, Number(body.fitScore ?? 75)))},
        ${signalsJson}::jsonb,
        ${String(body.status || 'CURIOUS').trim()},
        ${String(body.assignedRep || '').trim()},
        ${String(body.source || 'Manual').trim()},
        ${String(body.notes || '').trim()}
      )
      RETURNING *;
    `;

    return NextResponse.json({ lead: mapLeadRow(rows[0]) }, { status: 201 });
  } catch (error: any) {
    console.error('[CRM Leads POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to save lead' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const organizationName = body.organizationName !== undefined ? String(body.organizationName).trim() : null;
    const website = body.website !== undefined ? String(body.website).trim() : null;
    const category = body.category !== undefined ? String(body.category).trim() : null;
    const location = body.location !== undefined ? String(body.location).trim() : null;
    const contactName = body.contactName !== undefined ? String(body.contactName).trim() : null;
    const contactTitle = body.contactTitle !== undefined ? String(body.contactTitle).trim() : null;
    const contactEmail = body.contactEmail !== undefined ? String(body.contactEmail).trim().toLowerCase() : null;
    const contactPhone = body.contactPhone !== undefined ? String(body.contactPhone).trim() : null;
    const linkedinUrl = body.linkedinUrl !== undefined ? String(body.linkedinUrl).trim() : null;
    const fitScore = body.fitScore !== undefined && !isNaN(Number(body.fitScore)) ? Number(body.fitScore) : null;
    const signalsJson =
      body.engagementSignals !== undefined ? JSON.stringify(Array.isArray(body.engagementSignals) ? body.engagementSignals : []) : null;
    const status = body.status !== undefined ? String(body.status).trim() : null;
    const assignedRep = body.assignedRep !== undefined ? String(body.assignedRep).trim() : null;
    const source = body.source !== undefined ? String(body.source).trim() : null;
    const notes = body.notes !== undefined ? String(body.notes) : null;

    const rows = await sql`
      UPDATE crm_leads SET
        organization_name = COALESCE(${organizationName}, organization_name),
        website = COALESCE(${website}, website),
        category = COALESCE(${category}, category),
        location = COALESCE(${location}, location),
        contact_name = COALESCE(${contactName}, contact_name),
        contact_title = COALESCE(${contactTitle}, contact_title),
        contact_email = COALESCE(${contactEmail}, contact_email),
        contact_phone = COALESCE(${contactPhone}, contact_phone),
        linkedin_url = COALESCE(${linkedinUrl}, linkedin_url),
        fit_score = COALESCE(${fitScore}, fit_score),
        engagement_signals = COALESCE(${signalsJson}::jsonb, engagement_signals),
        status = COALESCE(${status}, status),
        assigned_rep = COALESCE(${assignedRep}, assigned_rep),
        source = COALESCE(${source}, source),
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead: mapLeadRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Leads PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const rows = await sql`DELETE FROM crm_leads WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Leads DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete lead' }, { status: 500 });
  }
}
