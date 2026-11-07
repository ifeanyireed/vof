import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { CharityProjectItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

function normalizeStatus(status?: string): 'active' | 'completed' | 'upcoming' | 'paused' {
  if (status === 'completed' || status === 'upcoming' || status === 'paused') {
    return status;
  }
  if (status === 'planned') {
    return 'upcoming';
  }
  return 'active';
}

function mapProject(p: any): CharityProjectItem {
  return {
    id: p.id,
    title: p.title || '',
    slug: p.slug || '',
    category: p.category || 'Community Initiative',
    description: p.description || '',
    targetAmount: Number(p.target_amount || 0),
    raisedAmount: Number(p.raised_amount || 0),
    currency: p.currency || 'NGN',
    location: p.location || '',
    beneficiariesCount: Number(p.beneficiaries_count || 0),
    imageUrl: p.image_url || '',
    status: normalizeStatus(p.status),
    startDate: p.start_date ? String(p.start_date) : undefined,
    endDate: p.end_date ? String(p.end_date) : undefined,
    createdAt: p.created_at ? new Date(p.created_at).toISOString() : undefined,
    updatedAt: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let rows;
    if (status) {
      rows = await sql`
        SELECT id, title, slug, COALESCE(category, '') AS category,
               COALESCE(description, '') AS description,
               target_amount, raised_amount, currency,
               COALESCE(location, '') AS location,
               beneficiaries_count, COALESCE(image_url, '') AS image_url,
               status, COALESCE(start_date::text, '') AS start_date,
               COALESCE(end_date::text, '') AS end_date,
               created_at, updated_at
        FROM charity_projects
        WHERE status = ${status}
        ORDER BY id ASC;
      `;
    } else {
      rows = await sql`
        SELECT id, title, slug, COALESCE(category, '') AS category,
               COALESCE(description, '') AS description,
               target_amount, raised_amount, currency,
               COALESCE(location, '') AS location,
               beneficiaries_count, COALESCE(image_url, '') AS image_url,
               status, COALESCE(start_date::text, '') AS start_date,
               COALESCE(end_date::text, '') AS end_date,
               created_at, updated_at
        FROM charity_projects
        ORDER BY id ASC;
      `;
    }

    return NextResponse.json((rows || []).map(mapProject));
  } catch (error: any) {
    console.error('Error fetching charity projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const title = (body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let slug = (body.slug || '').trim();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = body.category || 'Vocational Education';
    const description = body.description || '';
    const targetAmount = Number(body.targetAmount || 0);
    const raisedAmount = Number(body.raisedAmount || 0);
    const currency = body.currency || 'NGN';
    const location = body.location || '';
    const beneficiariesCount = Number(body.beneficiariesCount || 0);
    const imageUrl = body.imageUrl || '';
    const status = body.status || 'active';
    const startDate = body.startDate || null;
    const endDate = body.endDate || null;

    const rows = await sql`
      INSERT INTO charity_projects (
        title, slug, category, description, target_amount, raised_amount,
        currency, location, beneficiaries_count, image_url, image_urls, status, start_date, end_date
      )
      VALUES (
        ${title}, ${slug}, ${category}, ${description}, ${targetAmount}, ${raisedAmount},
        ${currency}, ${location}, ${beneficiariesCount}, ${imageUrl}, '{}'::text[], ${status}, ${startDate}, ${endDate}
      )
      RETURNING *;
    `;

    return NextResponse.json(mapProject(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Error creating charity project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
