import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await sql`
      SELECT c.*,
             (SELECT COUNT(*) FROM blogs b WHERE b.category_id = c.id OR b.category = c.name) as article_count
      FROM blog_categories c
      ORDER BY c.name ASC;
    `;
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, color = '#558b1a' } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = (slug || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const rows = await sql`
      INSERT INTO blog_categories (name, slug, description, color)
      VALUES (${cleanName}, ${cleanSlug}, ${description || null}, ${color})
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description, color = EXCLUDED.color
      RETURNING *;
    `;

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error creating blog category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, slug, description, color } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const rows = await sql`
      UPDATE blog_categories
      SET name = COALESCE(${name}, name),
          slug = COALESCE(${slug}, slug),
          description = COALESCE(${description}, description),
          color = COALESCE(${color}, color)
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error updating blog category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    // Unlink from blogs
    await sql`
      UPDATE blogs SET category_id = NULL WHERE category_id = ${Number(id)};
    `;

    await sql`
      DELETE FROM blog_categories WHERE id = ${Number(id)};
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
