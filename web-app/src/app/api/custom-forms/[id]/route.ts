import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapFormRow } from '@/lib/customFormsDb';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { id } = await params;

    let rows: any[];
    if (/^\d+$/.test(id)) {
      rows = await sql`SELECT * FROM custom_forms WHERE id = ${Number(id)} LIMIT 1;`;
    } else {
      rows = await sql`SELECT * FROM custom_forms WHERE slug = ${id} LIMIT 1;`;
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(mapFormRow(rows[0]));
  } catch (error: any) {
    console.error('Failed to get custom form:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { id } = await params;
    const formId = Number(id);

    if (isNaN(formId)) {
      return NextResponse.json({ error: 'Invalid form id' }, { status: 400 });
    }

    const body = await req.json();

    const title = (body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = (body.slug || '').trim();
    const description = (body.description || '').trim();
    const category = (body.category || 'General').trim();
    const coverImageUrl = (body.coverImageUrl || '').trim();
    const status = body.status || 'draft';
    const fields = JSON.stringify(Array.isArray(body.fields) ? body.fields : []);
    const settings = JSON.stringify(typeof body.settings === 'object' && body.settings !== null ? body.settings : {});

    // Check slug collision with another form
    if (slug) {
      const collision = await sql`SELECT id FROM custom_forms WHERE slug = ${slug} AND id != ${formId} LIMIT 1;`;
      if (collision.length > 0) {
        return NextResponse.json({ error: 'URL slug is already taken by another form' }, { status: 400 });
      }
    }

    const rows = await sql`
      UPDATE custom_forms
      SET
        title = ${title},
        slug = COALESCE(NULLIF(${slug}, ''), slug),
        description = ${description},
        category = ${category},
        cover_image_url = ${coverImageUrl},
        status = ${status},
        fields = ${fields}::jsonb,
        settings = ${settings}::jsonb,
        updated_at = NOW()
      WHERE id = ${formId}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(mapFormRow(rows[0]));
  } catch (error: any) {
    console.error('Failed to update custom form:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { id } = await params;
    const formId = Number(id);

    if (isNaN(formId)) {
      return NextResponse.json({ error: 'Invalid form id' }, { status: 400 });
    }

    // Cascade delete submissions first if FK cascade isn't triggered
    await sql`DELETE FROM custom_form_submissions WHERE form_id = ${formId};`;
    const rows = await sql`DELETE FROM custom_forms WHERE id = ${formId} RETURNING id;`;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: formId });
  } catch (error: any) {
    console.error('Failed to delete custom form:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
