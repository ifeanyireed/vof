import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapDealRow } from '@/lib/crm-db';
import { parseNumericValue } from '@/lib/crm-types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCrmTables();
    const rows = await sql`
      SELECT * FROM crm_deals
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({ deals: rows.map(mapDealRow) });
  } catch (error: any) {
    console.error('[CRM Deals GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load opportunities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const title = String(body.title || '').trim();
    const organization = String(body.organization || '').trim();
    if (!title || !organization) {
      return NextResponse.json({ error: 'Title and organization are required' }, { status: 400 });
    }

    const id = makeCrmId('OPP');
    const valueDisplay = String(body.valueDisplay || body.value || '₦0').trim();
    const valueAmount =
      body.valueAmount !== undefined && !isNaN(Number(body.valueAmount))
        ? Number(body.valueAmount)
        : parseNumericValue(valueDisplay);
    const currency =
      body.currency ||
      (valueDisplay.includes('$') ? 'USD' : valueDisplay.includes('£') ? 'GBP' : valueDisplay.includes('€') ? 'EUR' : 'NGN');

    const rows = await sql`
      INSERT INTO crm_deals (
        id, title, organization, contact_name, email, phone,
        value_display, value_amount, currency, stage, owner,
        probability, expected_close, campaign_type, notes, lead_id
      ) VALUES (
        ${id},
        ${title},
        ${organization},
        ${String(body.contactName || '').trim()},
        ${String(body.email || '').trim().toLowerCase()},
        ${String(body.phone || '').trim()},
        ${valueDisplay},
        ${valueAmount},
        ${currency},
        ${String(body.stage || 'DISCOVERY')},
        ${String(body.owner || 'VOF Partnerships Desk').trim()},
        ${Math.min(100, Math.max(0, Number(body.probability ?? 50)))},
        ${String(body.expectedClose || '').trim()},
        ${String(body.campaignType || 'Scholarship Sponsorship').trim()},
        ${String(body.notes || '').trim()},
        ${body.leadId ? String(body.leadId) : null}
      )
      RETURNING *;
    `;

    return NextResponse.json({ deal: mapDealRow(rows[0]) }, { status: 201 });
  } catch (error: any) {
    console.error('[CRM Deals POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create opportunity' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    const title = body.title !== undefined ? String(body.title).trim() : null;
    const organization = body.organization !== undefined ? String(body.organization).trim() : null;
    const contactName = body.contactName !== undefined ? String(body.contactName).trim() : null;
    const email = body.email !== undefined ? String(body.email).trim().toLowerCase() : null;
    const phone = body.phone !== undefined ? String(body.phone).trim() : null;
    const valueDisplay = body.valueDisplay !== undefined ? String(body.valueDisplay).trim() : null;
    const valueAmount =
      valueDisplay !== null
        ? parseNumericValue(valueDisplay)
        : body.valueAmount !== undefined && !isNaN(Number(body.valueAmount))
        ? Number(body.valueAmount)
        : null;
    const currency = body.currency !== undefined ? String(body.currency).trim() : null;
    const stage = body.stage !== undefined ? String(body.stage).trim() : null;
    const owner = body.owner !== undefined ? String(body.owner).trim() : null;
    const probability =
      body.probability !== undefined && !isNaN(Number(body.probability)) ? Number(body.probability) : null;
    const expectedClose = body.expectedClose !== undefined ? String(body.expectedClose).trim() : null;
    const campaignType = body.campaignType !== undefined ? String(body.campaignType).trim() : null;
    const notes = body.notes !== undefined ? String(body.notes) : null;

    const rows = await sql`
      UPDATE crm_deals SET
        title = COALESCE(${title}, title),
        organization = COALESCE(${organization}, organization),
        contact_name = COALESCE(${contactName}, contact_name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        value_display = COALESCE(${valueDisplay}, value_display),
        value_amount = COALESCE(${valueAmount}, value_amount),
        currency = COALESCE(${currency}, currency),
        stage = COALESCE(${stage}, stage),
        owner = COALESCE(${owner}, owner),
        probability = COALESCE(${probability}, probability),
        expected_close = COALESCE(${expectedClose}, expected_close),
        campaign_type = COALESCE(${campaignType}, campaign_type),
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }
    return NextResponse.json({ deal: mapDealRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Deals PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update opportunity' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_deals WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Deals DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete opportunity' }, { status: 500 });
  }
}
