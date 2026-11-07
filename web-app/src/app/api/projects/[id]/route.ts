import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { CharityProjectItem } from '@/lib/api';

export const dynamic = 'force-dynamic';

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
    status: (p.status || 'active') as 'active' | 'completed' | 'planned',
    startDate: p.start_date ? String(p.start_date) : undefined,
    endDate: p.end_date ? String(p.end_date) : undefined,
    createdAt: p.created_at ? new Date(p.created_at).toISOString() : undefined,
    updatedAt: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, title, slug, COALESCE(category, '') AS category,
             COALESCE(description, '') AS description,
             target_amount, raised_amount, currency,
             COALESCE(location, '') AS location,
             beneficiaries_count, COALESCE(image_url, '') AS image_url,
             status, COALESCE(start_date::text, '') AS start_date,
             COALESCE(end_date::text, '') AS end_date,
             created_at, updated_at
      FROM charity_projects
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(mapProject(rows[0]));
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const body = await req.json();

    const title = body.title !== undefined ? String(body.title).trim() : undefined;
    const slug = body.slug !== undefined ? String(body.slug).trim() : undefined;
    const category = body.category !== undefined ? String(body.category).trim() : undefined;
    const description = body.description !== undefined ? String(body.description) : undefined;
    const targetAmount = body.targetAmount !== undefined ? Number(body.targetAmount) : undefined;
    const raisedAmount = body.raisedAmount !== undefined ? Number(body.raisedAmount) : undefined;
    const currency = body.currency !== undefined ? String(body.currency).trim() : undefined;
    const location = body.location !== undefined ? String(body.location).trim() : undefined;
    const beneficiariesCount = body.beneficiariesCount !== undefined ? Number(body.beneficiariesCount) : undefined;
    const imageUrl = body.imageUrl !== undefined ? String(body.imageUrl).trim() : undefined;
    const status = body.status !== undefined ? String(body.status).trim() : undefined;
    const startDate = body.startDate !== undefined ? (body.startDate ? String(body.startDate) : null) : undefined;
    const endDate = body.endDate !== undefined ? (body.endDate ? String(body.endDate) : null) : undefined;

    const rows = await sql`
      UPDATE charity_projects
      SET
        title = COALESCE(${title}, title),
        slug = COALESCE(${slug}, slug),
        category = COALESCE(${category}, category),
        description = COALESCE(${description}, description),
        target_amount = COALESCE(${targetAmount}, target_amount),
        raised_amount = COALESCE(${raisedAmount}, raised_amount),
        currency = COALESCE(${currency}, currency),
        location = COALESCE(${location}, location),
        beneficiaries_count = COALESCE(${beneficiariesCount}, beneficiaries_count),
        image_url = COALESCE(${imageUrl}, image_url),
        status = COALESCE(${status}, status),
        start_date = COALESCE(${startDate}, start_date),
        end_date = COALESCE(${endDate}, end_date),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(mapProject(rows[0]));
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const rows = await sql`
      DELETE FROM charity_projects
      WHERE id = ${id}
      RETURNING id;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
