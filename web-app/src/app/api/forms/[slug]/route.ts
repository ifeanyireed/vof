import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapFormRow } from '@/lib/customFormsDb';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { slug } = await params;

    let rows = await sql`
      SELECT * FROM custom_forms
      WHERE slug = ${slug} OR id = ${/^\d+$/.test(slug) ? Number(slug) : -1}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const form = mapFormRow(rows[0]);

    // Asynchronously increment views_count without blocking
    sql`
      UPDATE custom_forms
      SET views_count = views_count + 1
      WHERE id = ${form.id};
    `.catch((err) => console.warn('Could not increment view count:', err));

    return NextResponse.json(form);
  } catch (error: any) {
    console.error('Failed to get public form:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
