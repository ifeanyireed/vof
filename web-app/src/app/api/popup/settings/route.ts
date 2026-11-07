import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { CharityProjectItem, PopupSettings } from '@/lib/api';

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

function mapProjectRow(p: any): CharityProjectItem {
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

async function fetchProjects(selectedIds?: number[]): Promise<CharityProjectItem[]> {
  try {
    const projectRows = await sql`
      SELECT id, title, slug, COALESCE(category, 'Outreach') AS category,
             COALESCE(description, '') AS description,
             target_amount, raised_amount, currency,
             COALESCE(location, '') AS location,
             beneficiaries_count, COALESCE(image_url, '') AS image_url,
             status, COALESCE(start_date::text, '') AS start_date,
             COALESCE(end_date::text, '') AS end_date,
             created_at, updated_at
      FROM charity_projects
      WHERE status = 'active'
      ORDER BY id ASC;
    `;

    const mapped = (projectRows || []).map(mapProjectRow);

    if (Array.isArray(selectedIds) && selectedIds.length > 0) {
      const filtered = mapped.filter((p) => p.id !== undefined && selectedIds.includes(p.id));
      if (filtered.length > 0) {
        return filtered;
      }
    }

    return mapped;
  } catch (err) {
    console.warn('Could not fetch projects for popup:', err);
    return [];
  }
}

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, is_enabled, delay_seconds,
             COALESCE(headline, 'Active Campaign') AS headline,
             COALESCE(subheadline, 'Support Ongoing Community Initiatives') AS subheadline,
             COALESCE(cta_text, 'Donate Now') AS cta_text,
             show_on_mobile,
             COALESCE(selected_project_ids, '{}') AS selected_project_ids,
             updated_at
      FROM popup_settings
      WHERE id = 1
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      const defaultProjects = await fetchProjects();
      const defaultSettings: PopupSettings = {
        id: 1,
        isEnabled: false,
        delaySeconds: 5,
        headline: 'Active Campaign',
        subheadline: 'Support Ongoing Community Initiatives',
        ctaText: 'Donate Now',
        showOnMobile: true,
        selectedProjectIds: [],
        projects: defaultProjects,
      };
      return NextResponse.json(defaultSettings);
    }

    const row = rows[0];
    const selectedIds = Array.isArray(row.selected_project_ids)
      ? row.selected_project_ids.map(Number)
      : [];

    const projects = await fetchProjects(selectedIds);

    const settings: PopupSettings = {
      id: row.id,
      isEnabled: Boolean(row.is_enabled),
      delaySeconds: Number(row.delay_seconds) || 5,
      headline: row.headline || 'Active Campaign',
      subheadline: row.subheadline || 'Support Ongoing Community Initiatives',
      ctaText: row.cta_text || 'Donate Now',
      showOnMobile: Boolean(row.show_on_mobile),
      selectedProjectIds: selectedIds,
      projects,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    };

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching popup settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const isEnabled = typeof body.isEnabled === 'boolean' ? body.isEnabled : false;
    const delaySeconds = Math.max(1, Number(body.delaySeconds) || 5);
    const headline = (body.headline || 'Active Campaign').trim();
    const subheadline = (body.subheadline || 'Support Ongoing Community Initiatives').trim();
    const ctaText = (body.ctaText || 'Donate Now').trim();
    const showOnMobile = typeof body.showOnMobile === 'boolean' ? body.showOnMobile : true;
    const selectedProjectIds: number[] = Array.isArray(body.selectedProjectIds)
      ? (body.selectedProjectIds as any[]).map(Number).filter((n: number) => !isNaN(n))
      : [];

    const rows = await sql`
      INSERT INTO popup_settings (
        id, is_enabled, delay_seconds, headline, subheadline, cta_text, show_on_mobile, selected_project_ids, updated_at
      )
      VALUES (
        1,
        ${isEnabled},
        ${delaySeconds},
        ${headline},
        ${subheadline},
        ${ctaText},
        ${showOnMobile},
        ${selectedProjectIds}::int[],
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        is_enabled = EXCLUDED.is_enabled,
        delay_seconds = EXCLUDED.delay_seconds,
        headline = EXCLUDED.headline,
        subheadline = EXCLUDED.subheadline,
        cta_text = EXCLUDED.cta_text,
        show_on_mobile = EXCLUDED.show_on_mobile,
        selected_project_ids = EXCLUDED.selected_project_ids,
        updated_at = NOW()
      RETURNING *;
    `;

    const row = rows[0];
    const projects = await fetchProjects(selectedProjectIds);

    const settings: PopupSettings = {
      id: row.id,
      isEnabled: Boolean(row.is_enabled),
      delaySeconds: Number(row.delay_seconds) || 5,
      headline: row.headline,
      subheadline: row.subheadline,
      ctaText: row.cta_text,
      showOnMobile: Boolean(row.show_on_mobile),
      selectedProjectIds,
      projects,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    };

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error updating popup settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
