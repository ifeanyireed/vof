import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapFormRow } from '@/lib/customFormsDb';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  try {
    await ensureCustomFormsTables();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');

    let rows: any[];
    if (q && status) {
      const queryPattern = `%${q}%`;
      rows = await sql`
        SELECT * FROM custom_forms
        WHERE (title ILIKE ${queryPattern} OR description ILIKE ${queryPattern} OR slug ILIKE ${queryPattern})
          AND status = ${status}
        ORDER BY created_at DESC;
      `;
    } else if (q) {
      const queryPattern = `%${q}%`;
      rows = await sql`
        SELECT * FROM custom_forms
        WHERE (title ILIKE ${queryPattern} OR description ILIKE ${queryPattern} OR slug ILIKE ${queryPattern})
        ORDER BY created_at DESC;
      `;
    } else if (status) {
      rows = await sql`
        SELECT * FROM custom_forms
        WHERE status = ${status}
        ORDER BY created_at DESC;
      `;
    } else {
      rows = await sql`
        SELECT * FROM custom_forms
        ORDER BY created_at DESC;
      `;
    }

    const forms = rows.map(mapFormRow);
    return NextResponse.json(forms);
  } catch (error: any) {
    console.error('Failed to fetch custom forms:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCustomFormsTables();
    const body = await req.json();

    const title = (body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let slug = slugify(body.slug || title);
    if (!slug) slug = `form-${Date.now()}`;

    // Ensure slug uniqueness
    const existing = await sql`SELECT id FROM custom_forms WHERE slug = ${slug} LIMIT 1;`;
    if (existing.length > 0) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const description = (body.description || '').trim();
    const category = (body.category || 'General').trim();
    const coverImageUrl = (body.coverImageUrl || '').trim();
    const status = body.status || 'draft';
    const fields = JSON.stringify(Array.isArray(body.fields) ? body.fields : []);
    const settings = JSON.stringify(typeof body.settings === 'object' && body.settings !== null ? body.settings : {});
    const createdBy = (body.createdBy || 'Admin').trim();

    const rows = await sql`
      INSERT INTO custom_forms (
        title, slug, description, category, cover_image_url, status, fields, settings, created_by
      ) VALUES (
        ${title}, ${slug}, ${description}, ${category}, ${coverImageUrl}, ${status}, ${fields}::jsonb, ${settings}::jsonb, ${createdBy}
      )
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Could not create form' }, { status: 500 });
    }

    return NextResponse.json(mapFormRow(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Failed to create custom form:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
