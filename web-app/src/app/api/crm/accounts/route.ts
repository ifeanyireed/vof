import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapAccountRow } from '@/lib/crm-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCrmTables();
    const rows = await sql`
      SELECT * FROM crm_accounts
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({ accounts: rows.map(mapAccountRow) });
  } catch (error: any) {
    console.error('[CRM Accounts GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load organizations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const organization = String(body.organization || '').trim();
    if (!organization) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const id = makeCrmId('ORG');
    const rows = await sql`
      INSERT INTO crm_accounts (
        id, organization, category, location, total_contributed,
        status, key_contact, email, phone, website, notes
      ) VALUES (
        ${id},
        ${organization},
        ${String(body.category || 'Corporate Partner').trim()},
        ${String(body.location || 'Nigeria').trim()},
        ${String(body.totalContributed || '₦0').trim()},
        ${String(body.status || 'PROSPECT').trim()},
        ${String(body.keyContact || '').trim()},
        ${String(body.email || '').trim().toLowerCase()},
        ${String(body.phone || '').trim()},
        ${String(body.website || '').trim()},
        ${String(body.notes || '').trim()}
      )
      RETURNING *;
    `;

    return NextResponse.json({ account: mapAccountRow(rows[0]) }, { status: 201 });
  } catch (error: any) {
    console.error('[CRM Accounts POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create organization' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    const organization = body.organization !== undefined ? String(body.organization).trim() : null;
    const category = body.category !== undefined ? String(body.category).trim() : null;
    const location = body.location !== undefined ? String(body.location).trim() : null;
    const totalContributed = body.totalContributed !== undefined ? String(body.totalContributed).trim() : null;
    const status = body.status !== undefined ? String(body.status).trim() : null;
    const keyContact = body.keyContact !== undefined ? String(body.keyContact).trim() : null;
    const email = body.email !== undefined ? String(body.email).trim().toLowerCase() : null;
    const phone = body.phone !== undefined ? String(body.phone).trim() : null;
    const website = body.website !== undefined ? String(body.website).trim() : null;
    const notes = body.notes !== undefined ? String(body.notes) : null;

    const rows = await sql`
      UPDATE crm_accounts SET
        organization = COALESCE(${organization}, organization),
        category = COALESCE(${category}, category),
        location = COALESCE(${location}, location),
        total_contributed = COALESCE(${totalContributed}, total_contributed),
        status = COALESCE(${status}, status),
        key_contact = COALESCE(${keyContact}, key_contact),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        website = COALESCE(${website}, website),
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json({ account: mapAccountRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Accounts PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update organization' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_accounts WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Accounts DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete organization' }, { status: 500 });
  }
}
