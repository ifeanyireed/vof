import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { outreachReports as fallbackReports } from '@/data/outreachReports';
import { ensureOutreachTable, mapOutreachRow, seedFallbackReportsIfEmpty } from './outreachMapper';

export const dynamic = 'force-dynamic';

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
    await seedFallbackReportsIfEmpty();
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
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'outreach-report'}-${Date.now()}`;
    }

    const existingSlug = await sql`
      SELECT id FROM outreach_reports WHERE slug = ${slug} LIMIT 1;
    `;
    if (existingSlug && existingSlug.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
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
        ${financialsJson}::jsonb,
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
