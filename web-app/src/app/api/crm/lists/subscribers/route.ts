import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapSubscriberRow } from '@/lib/crm-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const listId = searchParams.get('listId');

    const rows = listId
      ? await sql`
          SELECT * FROM crm_email_subscribers
          WHERE list_id = ${listId}
          ORDER BY created_at DESC;
        `
      : await sql`
          SELECT * FROM crm_email_subscribers
          ORDER BY created_at DESC
          LIMIT 1000;
        `;

    return NextResponse.json({ subscribers: rows.map(mapSubscriberRow) });
  } catch (error: any) {
    console.error('[CRM Subscribers GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load subscribers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const listId = String(body.listId || '').trim();
    if (!listId) {
      return NextResponse.json({ error: 'listId is required' }, { status: 400 });
    }

    const items: any[] = Array.isArray(body.subscribers) ? body.subscribers : [body];
    const added: any[] = [];
    let skipped = 0;

    for (const item of items) {
      const email = String(item.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        skipped += 1;
        continue;
      }

      const fullName = String(item.name || '').trim();
      const nameParts = fullName.split(/\s+/).filter(Boolean);
      const firstName = String(item.firstName || nameParts[0] || '').trim();
      const lastName = String(item.lastName || nameParts.slice(1).join(' ') || '').trim();
      const id = makeCrmId('SUB');

      const rows = await sql`
        INSERT INTO crm_email_subscribers (
          id, list_id, email, name, first_name, last_name,
          organization, phone, linkedin_url, source, status
        ) VALUES (
          ${id},
          ${listId},
          ${email},
          ${fullName || [firstName, lastName].filter(Boolean).join(' ')},
          ${firstName},
          ${lastName},
          ${String(item.organization || item.company || '').trim()},
          ${String(item.phone || '').trim()},
          ${String(item.linkedinUrl || '').trim()},
          ${String(item.source || 'Manual').trim()},
          'SUBSCRIBED'
        )
        ON CONFLICT (list_id, email) DO NOTHING
        RETURNING *;
      `;

      if (rows.length > 0) {
        added.push(mapSubscriberRow(rows[0]));
      } else {
        skipped += 1;
      }
    }

    return NextResponse.json(
      {
        addedCount: added.length,
        skippedCount: skipped,
        subscribers: added,
        subscriber: added[0] || null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[CRM Subscribers POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to add subscriber(s)' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    const name = body.name !== undefined ? String(body.name).trim() : null;
    const firstName =
      body.firstName !== undefined
        ? String(body.firstName).trim()
        : name !== null
        ? name.split(/\s+/)[0] || ''
        : null;
    const lastName =
      body.lastName !== undefined
        ? String(body.lastName).trim()
        : name !== null
        ? name.split(/\s+/).slice(1).join(' ')
        : null;
    const organization = body.organization !== undefined ? String(body.organization).trim() : null;
    const phone = body.phone !== undefined ? String(body.phone).trim() : null;
    const status = body.status !== undefined ? String(body.status).trim() : null;

    const rows = await sql`
      UPDATE crm_email_subscribers SET
        name = COALESCE(${name}, name),
        first_name = COALESCE(${firstName}, first_name),
        last_name = COALESCE(${lastName}, last_name),
        organization = COALESCE(${organization}, organization),
        phone = COALESCE(${phone}, phone),
        status = COALESCE(${status}, status)
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
    return NextResponse.json({ subscriber: mapSubscriberRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Subscribers PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update subscriber' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_email_subscribers WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Subscribers DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete subscriber' }, { status: 500 });
  }
}
