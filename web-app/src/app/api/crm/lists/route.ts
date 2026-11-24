import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapListRow } from '@/lib/crm-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCrmTables();
    const rows = await sql`
      SELECT
        l.*,
        COALESCE(SUM(CASE WHEN s.status = 'SUBSCRIBED' THEN 1 ELSE 0 END), 0)::int AS subscriber_count,
        COALESCE(SUM(CASE WHEN s.status = 'BOUNCED' THEN 1 ELSE 0 END), 0)::int AS bounced_count,
        COALESCE(SUM(CASE WHEN s.status = 'UNSUBSCRIBED' THEN 1 ELSE 0 END), 0)::int AS unsubscribed_count
      FROM crm_email_lists l
      LEFT JOIN crm_email_subscribers s ON s.list_id = l.id
      GROUP BY l.id
      ORDER BY l.created_at DESC;
    `;
    return NextResponse.json({ lists: rows.map(mapListRow) });
  } catch (error: any) {
    console.error('[CRM Lists GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load lists' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ error: 'List name is required' }, { status: 400 });
    }

    const id = makeCrmId('LIST');
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: any) => String(t).trim()).filter(Boolean)
      : String(body.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
    const tagsJson = JSON.stringify(tags);

    const rows = await sql`
      INSERT INTO crm_email_lists (id, name, description, tags)
      VALUES (${id}, ${name}, ${String(body.description || '').trim()}, ${tagsJson}::jsonb)
      RETURNING *;
    `;

    return NextResponse.json(
      { list: mapListRow({ ...rows[0], subscriber_count: 0, bounced_count: 0, unsubscribed_count: 0 }) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[CRM Lists POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create list' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
    }

    const name = body.name !== undefined ? String(body.name).trim() : null;
    const description = body.description !== undefined ? String(body.description).trim() : null;
    const tagsJson =
      body.tags !== undefined
        ? JSON.stringify(
            Array.isArray(body.tags)
              ? body.tags.map((t: any) => String(t).trim()).filter(Boolean)
              : String(body.tags || '')
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
          )
        : null;

    const rows = await sql`
      UPDATE crm_email_lists SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        tags = COALESCE(${tagsJson}::jsonb, tags),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    return NextResponse.json({ list: mapListRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Lists PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update list' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_email_lists WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Lists DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete list' }, { status: 500 });
  }
}
