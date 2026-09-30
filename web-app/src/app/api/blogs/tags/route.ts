import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tags = await sql`
      SELECT t.*,
             (SELECT COUNT(*) FROM blog_post_tags pt WHERE pt.tag_id = t.id) as article_count
      FROM blog_tags t
      ORDER BY t.name ASC;
    `;
    return NextResponse.json(tags);
  } catch (error: any) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = (slug || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const rows = await sql`
      INSERT INTO blog_tags (name, slug)
      VALUES (${cleanName}, ${cleanSlug})
      ON CONFLICT (slug) DO NOTHING
      RETURNING *;
    `;

    if (!rows || rows.length === 0) {
      const existing = await sql`SELECT * FROM blog_tags WHERE slug = ${cleanSlug} LIMIT 1`;
      return NextResponse.json(existing[0]);
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error creating blog tag:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Tag ID required' }, { status: 400 });
    }

    await sql`
      DELETE FROM blog_post_tags WHERE tag_id = ${Number(id)};
    `;

    await sql`
      DELETE FROM blog_tags WHERE id = ${Number(id)};
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog tag:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
