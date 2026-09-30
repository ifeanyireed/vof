import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { BlogItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

function mapBlogRow(row: any): BlogItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    category: row.category || 'General',
    categoryId: row.category_id,
    tags: Array.isArray(row.tags)
      ? row.tags
      : typeof row.tags === 'string' && row.tags.startsWith('[')
      ? JSON.parse(row.tags)
      : [],
    region: row.region || 'NIGERIA',
    imageUrl:
      row.image_url ||
      'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
    authorName: row.author_name || 'VOF Outreach Team',
    authorRole: row.author_role || '',
    authorAvatar:
      row.author_avatar ||
      'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg',
    readTime: row.read_time || '4 min read',
    dateDisplay: row.date_display || `${row.day || '28'} ${row.month || 'SEP'}`,
    day: row.day || '28',
    month: row.month || 'SEP',
    likes: Number(row.likes) || 0,
    status: row.status || 'published',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug or ID required' }, { status: 400 });
    }

    const isNumeric = /^\d+$/.test(slug);
    let rows: any[] = [];

    if (isNumeric) {
      rows = await sql`
        SELECT * FROM blogs
        WHERE id = ${Number(slug)}
        LIMIT 1;
      `;
    }

    if (rows.length === 0) {
      rows = await sql`
        SELECT * FROM blogs
        WHERE slug = ${slug}
        LIMIT 1;
      `;
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(mapBlogRow(rows[0]));
  } catch (error: any) {
    console.error('Error fetching blog by slug from Neon:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const isNumeric = /^\d+$/.test(slug);

    const rows = isNumeric
      ? await sql`
          UPDATE blogs
          SET title = COALESCE(${body.title}, title),
              excerpt = COALESCE(${body.excerpt}, excerpt),
              content = COALESCE(${body.content}, content),
              category = COALESCE(${body.category}, category),
              category_id = COALESCE(${body.categoryId}, category_id),
              tags = COALESCE(${body.tags}, tags),
              region = COALESCE(${body.region}, region),
              image_url = COALESCE(${body.imageUrl}, image_url),
              author_name = COALESCE(${body.authorName}, author_name),
              author_avatar = COALESCE(${body.authorAvatar}, author_avatar),
              read_time = COALESCE(${body.readTime}, read_time),
              likes = COALESCE(${body.likes}, likes),
              status = COALESCE(${body.status}, status),
              updated_at = NOW()
          WHERE id = ${Number(slug)}
          RETURNING *;
        `
      : await sql`
          UPDATE blogs
          SET title = COALESCE(${body.title}, title),
              excerpt = COALESCE(${body.excerpt}, excerpt),
              content = COALESCE(${body.content}, content),
              category = COALESCE(${body.category}, category),
              category_id = COALESCE(${body.categoryId}, category_id),
              tags = COALESCE(${body.tags}, tags),
              region = COALESCE(${body.region}, region),
              image_url = COALESCE(${body.imageUrl}, image_url),
              author_name = COALESCE(${body.authorName}, author_name),
              author_avatar = COALESCE(${body.authorAvatar}, author_avatar),
              read_time = COALESCE(${body.readTime}, read_time),
              likes = COALESCE(${body.likes}, likes),
              status = COALESCE(${body.status}, status),
              updated_at = NOW()
          WHERE slug = ${slug}
          RETURNING *;
        `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Blog not found to update' }, { status: 404 });
    }

    return NextResponse.json(mapBlogRow(rows[0]));
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const isNumeric = /^\d+$/.test(slug);

    if (isNumeric) {
      await sql`DELETE FROM blogs WHERE id = ${Number(slug)};`;
    } else {
      await sql`DELETE FROM blogs WHERE slug = ${slug};`;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
