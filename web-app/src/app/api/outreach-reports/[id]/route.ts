import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureOutreachTable, mapOutreachRow, seedFallbackReportsIfEmpty } from '../outreachMapper';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureOutreachTable();
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Missing report identifier' }, { status: 400 });
    }

    const isNumericId = /^\d+$/.test(rawId);
    const numId = isNumericId ? Number(rawId) : null;
    let rows;
    if (numId !== null) {
      rows = await sql`
        SELECT * FROM outreach_reports WHERE id = ${numId} OR slug = ${rawId} LIMIT 1;
      `;
    } else {
      rows = await sql`
        SELECT * FROM outreach_reports WHERE slug = ${rawId} LIMIT 1;
      `;
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Outreach report not found' }, { status: 404 });
    }

    return NextResponse.json(mapOutreachRow(rows[0]));
  } catch (error: any) {
    console.error('Error fetching single outreach report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureOutreachTable();
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Missing report identifier' }, { status: 400 });
    }

    const data = await req.json();
    const isNumericId = /^\d+$/.test(rawId);
    const numId = isNumericId ? Number(rawId) : null;

    const slug =
      data.slug !== undefined && String(data.slug).trim() !== ''
        ? String(data.slug)
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') || null
        : null;
    const title = data.title !== undefined ? String(data.title) : null;
    const theme = data.theme !== undefined ? String(data.theme) : null;
    const eventDate = data.eventDate !== undefined ? String(data.eventDate) : null;
    const year =
      data.year !== undefined && data.year !== '' && !isNaN(Number(data.year))
        ? Number(data.year)
        : null;
    const venue = data.venue !== undefined ? String(data.venue) : null;
    const location = data.location !== undefined ? String(data.location) : null;
    const category = data.category !== undefined ? String(data.category) : null;
    const summary = data.summary !== undefined ? String(data.summary) : null;

    const objectivesJson = data.objectives !== undefined ? JSON.stringify(data.objectives) : null;
    const keyActivitiesJson = data.keyActivities !== undefined ? JSON.stringify(data.keyActivities) : null;
    const complianceJson = data.complianceAndObservations !== undefined ? JSON.stringify(data.complianceAndObservations) : null;
    const nextStepsJson = data.nextSteps !== undefined ? JSON.stringify(data.nextSteps) : null;
    const impactMetricsJson = data.impactMetrics !== undefined ? JSON.stringify(data.impactMetrics) : null;
    const hasFinancialsUpdate = data.financials !== undefined;
    const financialsJson = hasFinancialsUpdate && data.financials ? JSON.stringify(data.financials) : null;
    const delegationJson = data.delegationAndVolunteers !== undefined ? JSON.stringify(data.delegationAndVolunteers) : null;
    const signedByJson = data.signedBy !== undefined ? JSON.stringify(data.signedBy) : null;
    const documentsJson = data.documents !== undefined ? JSON.stringify(data.documents) : null;

    const showFinancials = data.showFinancials !== undefined ? Boolean(data.showFinancials) : null;
    const showDocuments = data.showDocuments !== undefined ? Boolean(data.showDocuments) : null;
    const featured = data.featured !== undefined ? Boolean(data.featured) : null;
    const orderIndex =
      data.orderIndex !== undefined && data.orderIndex !== '' && !isNaN(Number(data.orderIndex))
        ? Number(data.orderIndex)
        : null;
    const status = data.status !== undefined ? String(data.status) : null;

    const runUpdate = async (targetNumId: number | null, targetSlugOrRaw: string) => {
      if (targetNumId !== null) {
        return sql`
          UPDATE outreach_reports SET
            slug = COALESCE(${slug}, slug),
            title = COALESCE(${title}, title),
            theme = COALESCE(${theme}, theme),
            event_date = COALESCE(${eventDate}, event_date),
            year = COALESCE(${year}, year),
            venue = COALESCE(${venue}, venue),
            location = COALESCE(${location}, location),
            category = COALESCE(${category}, category),
            summary = COALESCE(${summary}, summary),
            objectives = COALESCE(${objectivesJson}::jsonb, objectives),
            key_activities = COALESCE(${keyActivitiesJson}::jsonb, key_activities),
            compliance_observations = COALESCE(${complianceJson}::jsonb, compliance_observations),
            next_steps = COALESCE(${nextStepsJson}::jsonb, next_steps),
            impact_metrics = COALESCE(${impactMetricsJson}::jsonb, impact_metrics),
            financials = CASE WHEN ${hasFinancialsUpdate}::boolean THEN ${financialsJson}::jsonb ELSE financials END,
            delegation_volunteers = COALESCE(${delegationJson}::jsonb, delegation_volunteers),
            signed_by = COALESCE(${signedByJson}::jsonb, signed_by),
            documents = COALESCE(${documentsJson}::jsonb, documents),
            show_financials = COALESCE(${showFinancials}, show_financials),
            show_documents = COALESCE(${showDocuments}, show_documents),
            featured = COALESCE(${featured}, featured),
            order_index = COALESCE(${orderIndex}, order_index),
            status = COALESCE(${status}, status),
            updated_at = NOW()
          WHERE id = ${targetNumId} OR slug = ${targetSlugOrRaw}
          RETURNING *;
        `;
      }
      return sql`
        UPDATE outreach_reports SET
          slug = COALESCE(${slug}, slug),
          title = COALESCE(${title}, title),
          theme = COALESCE(${theme}, theme),
          event_date = COALESCE(${eventDate}, event_date),
          year = COALESCE(${year}, year),
          venue = COALESCE(${venue}, venue),
          location = COALESCE(${location}, location),
          category = COALESCE(${category}, category),
          summary = COALESCE(${summary}, summary),
          objectives = COALESCE(${objectivesJson}::jsonb, objectives),
          key_activities = COALESCE(${keyActivitiesJson}::jsonb, key_activities),
          compliance_observations = COALESCE(${complianceJson}::jsonb, compliance_observations),
          next_steps = COALESCE(${nextStepsJson}::jsonb, next_steps),
          impact_metrics = COALESCE(${impactMetricsJson}::jsonb, impact_metrics),
          financials = CASE WHEN ${hasFinancialsUpdate}::boolean THEN ${financialsJson}::jsonb ELSE financials END,
          delegation_volunteers = COALESCE(${delegationJson}::jsonb, delegation_volunteers),
          signed_by = COALESCE(${signedByJson}::jsonb, signed_by),
          documents = COALESCE(${documentsJson}::jsonb, documents),
          show_financials = COALESCE(${showFinancials}, show_financials),
          show_documents = COALESCE(${showDocuments}, show_documents),
          featured = COALESCE(${featured}, featured),
          order_index = COALESCE(${orderIndex}, order_index),
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE slug = ${targetSlugOrRaw}
        RETURNING *;
      `;
    };

    let rows = await runUpdate(numId, rawId);

    // If table was not yet seeded (UI was displaying static fallback reports), seed and retry update
    if (rows.length === 0) {
      const seeded = await seedFallbackReportsIfEmpty();
      if (seeded) {
        rows = await runUpdate(numId, slug || rawId);
      }
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Outreach report not found' }, { status: 404 });
    }

    return NextResponse.json(mapOutreachRow(rows[0]));
  } catch (error: any) {
    console.error('Error updating outreach report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await ensureOutreachTable();
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Missing report identifier' }, { status: 400 });
    }

    const isNumericId = /^\d+$/.test(rawId);
    const numId = isNumericId ? Number(rawId) : null;
    let result;
    if (numId !== null) {
      result = await sql`
        DELETE FROM outreach_reports WHERE id = ${numId} OR slug = ${rawId} RETURNING id;
      `;
    } else {
      result = await sql`
        DELETE FROM outreach_reports WHERE slug = ${rawId} RETURNING id;
      `;
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Outreach report deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting outreach report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
