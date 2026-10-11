import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { outreachReports as fallbackReports } from '@/data/outreachReports';
import { mapOutreachRow } from './outreachMapper';

export const dynamic = 'force-dynamic';

let tableChecked = false;
async function ensureOutreachTable() {
  if (tableChecked) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS outreach_reports (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        theme VARCHAR(255),
        event_date VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        venue VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Community Relief',
        summary TEXT NOT NULL,
        objectives JSONB DEFAULT '[]'::jsonb,
        key_activities JSONB DEFAULT '[]'::jsonb,
        compliance_observations JSONB DEFAULT '[]'::jsonb,
        next_steps JSONB DEFAULT '[]'::jsonb,
        impact_metrics JSONB DEFAULT '[]'::jsonb,
        financials JSONB DEFAULT NULL,
        delegation_volunteers JSONB DEFAULT '[]'::jsonb,
        signed_by JSONB DEFAULT '{}'::jsonb,
        documents JSONB DEFAULT '[]'::jsonb,
        show_financials BOOLEAN DEFAULT TRUE,
        show_documents BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        order_index INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'published',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_slug ON outreach_reports(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_status ON outreach_reports(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_year ON outreach_reports(year);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_category ON outreach_reports(category);`;
    tableChecked = true;
  } catch (err) {
    console.warn('Could not auto-verify outreach_reports table:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureOutreachTable();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const rows = await sql`
      SELECT *
      FROM outreach_reports
      ORDER BY order_index ASC, id ASC;
    `;

    if (!rows || rows.length === 0) {
      // Fallback gracefully to static reports if database has not yet been seeded
      let fallbackList = fallbackReports.map((r, idx) => ({
        ...r,
        id: idx + 1,
        showFinancials: Boolean(r.financials),
        showDocuments: Boolean(r.documents && r.documents.length > 0),
        featured: idx === 0,
        orderIndex: idx,
        status: 'published',
      }));

      if (category && category !== 'All') {
        fallbackList = fallbackList.filter((item) => item.category === category);
      }
      if (year && year !== 'All') {
        fallbackList = fallbackList.filter((item) => item.year.toString() === year);
      }
      if (search) {
        const s = search.toLowerCase();
        fallbackList = fallbackList.filter(
          (item) =>
            item.title.toLowerCase().includes(s) ||
            item.summary.toLowerCase().includes(s) ||
            item.location.toLowerCase().includes(s) ||
            item.venue.toLowerCase().includes(s)
        );
      }
      return NextResponse.json(fallbackList);
    }

    let mapped = rows.map(mapOutreachRow);

    if (category && category !== 'All') {
      mapped = mapped.filter((item) => item.category === category);
    }
    if (year && year !== 'All') {
      mapped = mapped.filter((item) => item.year.toString() === year);
    }
    if (status && status !== 'All') {
      mapped = mapped.filter((item) => item.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      mapped = mapped.filter(
        (item) =>
          item.title.toLowerCase().includes(s) ||
          item.summary.toLowerCase().includes(s) ||
          item.location.toLowerCase().includes(s) ||
          item.venue.toLowerCase().includes(s) ||
          (item.theme && item.theme.toLowerCase().includes(s))
      );
    }

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error('Error fetching outreach reports:', error);
    // Graceful fallback to static array if database error occurs
    return NextResponse.json(
      fallbackReports.map((r, idx) => ({
        ...r,
        id: idx + 1,
        showFinancials: Boolean(r.financials),
        showDocuments: Boolean(r.documents && r.documents.length > 0),
        featured: idx === 0,
        orderIndex: idx,
        status: 'published',
      }))
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureOutreachTable();
    const data = await req.json();

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const title = data.title.trim();
    let slug = (data.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) {
      slug = `${title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')}-${Date.now()}`;
    }

    const theme = data.theme || '';
    const eventDate = data.eventDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const year = Number(data.year) || new Date().getFullYear();
    const venue = data.venue || '';
    const location = data.location || '';
    const category = data.category || 'Education & Scholarships';
    const summary = data.summary || '';

    const objectivesJson = JSON.stringify(data.objectives || []);
    const keyActivitiesJson = JSON.stringify(data.keyActivities || []);
    const complianceJson = JSON.stringify(data.complianceAndObservations || []);
    const nextStepsJson = JSON.stringify(data.nextSteps || []);
    const impactMetricsJson = JSON.stringify(data.impactMetrics || []);
    const financialsJson = data.financials ? JSON.stringify(data.financials) : null;
    const delegationJson = JSON.stringify(data.delegationAndVolunteers || []);
    const signedByJson = JSON.stringify(data.signedBy || { name: '', title: '' });
    const documentsJson = JSON.stringify(data.documents || []);

    const showFinancials = data.showFinancials !== undefined ? Boolean(data.showFinancials) : Boolean(data.financials);
    const showDocuments = data.showDocuments !== undefined ? Boolean(data.showDocuments) : true;
    const featured = Boolean(data.featured);
    const orderIndex = Number(data.orderIndex) || 0;
    const status = data.status || 'published';

    const rows = await sql`
      INSERT INTO outreach_reports (
        slug, title, theme, event_date, year, venue, location, category, summary,
        objectives, key_activities, compliance_observations, next_steps,
        impact_metrics, financials, delegation_volunteers, signed_by, documents,
        show_financials, show_documents, featured, order_index, status
      )
      VALUES (
        ${slug},
        ${title},
        ${theme},
        ${eventDate},
        ${year},
        ${venue},
        ${location},
        ${category},
        ${summary},
        ${objectivesJson}::jsonb,
        ${keyActivitiesJson}::jsonb,
        ${complianceJson}::jsonb,
        ${nextStepsJson}::jsonb,
        ${impactMetricsJson}::jsonb,
        ${financialsJson ? sql`${financialsJson}::jsonb` : null},
        ${delegationJson}::jsonb,
        ${signedByJson}::jsonb,
        ${documentsJson}::jsonb,
        ${showFinancials},
        ${showDocuments},
        ${featured},
        ${orderIndex},
        ${status}
      )
      RETURNING *;
    `;

    return NextResponse.json(mapOutreachRow(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Error creating outreach report:', error);
    return NextResponse.json({ error: error.message || 'Failed to create report' }, { status: 500 });
  }
}
