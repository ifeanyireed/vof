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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    const conditions: string[] = [];
    const params: any[] = [];

    if (id) {
      params.push(Number(id));
      conditions.push(`id = $${params.length}`);
    } else if (slug) {
      params.push(slug);
      conditions.push(`slug = $${params.length}`);
    } else {
      if (status && status !== 'all') {
        params.push(status);
        conditions.push(`status = $${params.length}`);
      } else if (!status) {
        params.push('published');
        conditions.push(`status = $${params.length}`);
      }

      if (category && category !== 'All') {
        params.push(`%${category}%`);
        conditions.push(`category ILIKE $${params.length}`);
      }

      if (tag && tag !== 'All') {
        params.push(tag);
        conditions.push(`($${params.length} = ANY(tags) OR EXISTS (
          SELECT 1 FROM blog_post_tags pt
          JOIN blog_tags bt ON pt.tag_id = bt.id
          WHERE pt.post_id = blogs.id AND (bt.name ILIKE $${params.length} OR bt.slug = $${params.length})
        ))`);
      }

      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        conditions.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT * FROM blogs
      ${whereClause}
      ORDER BY id DESC;
    `;

    const rows = await sql.query(query, params);
    const blogs = (rows || []).map(mapBlogRow);

    if (slug || id) {
      if (blogs.length === 0) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json(blogs[0]);
    }

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs from Neon:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      title,
      excerpt,
      content,
      category = 'Community Outreach',
      categoryId,
      tags = [],
      region = 'NIGERIA',
      imageUrl,
      authorName = 'VOF Outreach Team',
      authorAvatar = '/team/charles-onyeneke.jpg',
      readTime = '4 min read',
      dateDisplay,
      day = '28',
      month = 'SEP',
      likes = 0,
      status = 'published',
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const cleanSlug = (
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    ).trim();

    const rows = await sql`
      INSERT INTO blogs (
        slug, title, excerpt, content, category, category_id, tags,
        region, image_url, author_name, author_avatar, read_time,
        date_display, day, month, likes, status
      ) VALUES (
        ${cleanSlug}, ${title}, ${excerpt || ''}, ${content || ''}, ${category},
        ${categoryId || null}, ${tags}, ${region}, ${imageUrl || ''},
        ${authorName}, ${authorAvatar}, ${readTime}, ${dateDisplay || `${day} ${month}`},
        ${day}, ${month}, ${likes}, ${status}
      )
      ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          category = EXCLUDED.category,
          category_id = EXCLUDED.category_id,
          tags = EXCLUDED.tags,
          image_url = CASE WHEN EXCLUDED.image_url IS NOT NULL AND EXCLUDED.image_url != '' THEN EXCLUDED.image_url ELSE blogs.image_url END,
          status = EXCLUDED.status,
          updated_at = NOW()
      RETURNING *;
    `;

    return NextResponse.json(mapBlogRow(rows[0]));
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
