import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { mapOutreachRow } from '../outreachMapper';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Missing report identifier' }, { status: 400 });
    }

    const numId = Number(rawId);
    let rows;
    if (!isNaN(numId)) {
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
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Missing report identifier' }, { status: 400 });
    }

    const data = await req.json();
    const numId = Number(rawId);

    const title = data.title;
    const theme = data.theme;
    const eventDate = data.eventDate;
    const year = data.year !== undefined ? Number(data.year) : undefined;
    const venue = data.venue;
    const location = data.location;
    const category = data.category;
    const summary = data.summary;

    const objectivesJson = data.objectives !== undefined ? JSON.stringify(data.objectives) : undefined;
    const keyActivitiesJson = data.keyActivities !== undefined ? JSON.stringify(data.keyActivities) : undefined;
    const complianceJson = data.complianceAndObservations !== undefined ? JSON.stringify(data.complianceAndObservations) : undefined;
    const nextStepsJson = data.nextSteps !== undefined ? JSON.stringify(data.nextSteps) : undefined;
    const impactMetricsJson = data.impactMetrics !== undefined ? JSON.stringify(data.impactMetrics) : undefined;
    const financialsJson = data.financials !== undefined ? (data.financials ? JSON.stringify(data.financials) : null) : undefined;
    const delegationJson = data.delegationAndVolunteers !== undefined ? JSON.stringify(data.delegationAndVolunteers) : undefined;
    const signedByJson = data.signedBy !== undefined ? JSON.stringify(data.signedBy) : undefined;
    const documentsJson = data.documents !== undefined ? JSON.stringify(data.documents) : undefined;

    const showFinancials = data.showFinancials !== undefined ? Boolean(data.showFinancials) : undefined;
    const showDocuments = data.showDocuments !== undefined ? Boolean(data.showDocuments) : undefined;
    const featured = data.featured !== undefined ? Boolean(data.featured) : undefined;
    const orderIndex = data.orderIndex !== undefined ? Number(data.orderIndex) : undefined;
    const status = data.status;

    let rows;
    if (!isNaN(numId)) {
      rows = await sql`
        UPDATE outreach_reports SET
          title = COALESCE(${title}, title),
          theme = COALESCE(${theme}, theme),
          event_date = COALESCE(${eventDate}, event_date),
          year = COALESCE(${year}, year),
          venue = COALESCE(${venue}, venue),
          location = COALESCE(${location}, location),
          category = COALESCE(${category}, category),
          summary = COALESCE(${summary}, summary),
          objectives = CASE WHEN ${objectivesJson} IS NOT NULL THEN ${objectivesJson}::jsonb ELSE objectives END,
          key_activities = CASE WHEN ${keyActivitiesJson} IS NOT NULL THEN ${keyActivitiesJson}::jsonb ELSE key_activities END,
          compliance_observations = CASE WHEN ${complianceJson} IS NOT NULL THEN ${complianceJson}::jsonb ELSE compliance_observations END,
          next_steps = CASE WHEN ${nextStepsJson} IS NOT NULL THEN ${nextStepsJson}::jsonb ELSE next_steps END,
          impact_metrics = CASE WHEN ${impactMetricsJson} IS NOT NULL THEN ${impactMetricsJson}::jsonb ELSE impact_metrics END,
          financials = CASE WHEN ${data.financials !== undefined} THEN (${financialsJson})::jsonb ELSE financials END,
          delegation_volunteers = CASE WHEN ${delegationJson} IS NOT NULL THEN ${delegationJson}::jsonb ELSE delegation_volunteers END,
          signed_by = CASE WHEN ${signedByJson} IS NOT NULL THEN ${signedByJson}::jsonb ELSE signed_by END,
          documents = CASE WHEN ${documentsJson} IS NOT NULL THEN ${documentsJson}::jsonb ELSE documents END,
          show_financials = COALESCE(${showFinancials}, show_financials),
          show_documents = COALESCE(${showDocuments}, show_documents),
          featured = COALESCE(${featured}, featured),
          order_index = COALESCE(${orderIndex}, order_index),
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE id = ${numId} OR slug = ${rawId}
        RETURNING *;
      `;
    } else {
      rows = await sql`
        UPDATE outreach_reports SET
          title = COALESCE(${title}, title),
          theme = COALESCE(${theme}, theme),
          event_date = COALESCE(${eventDate}, event_date),
          year = COALESCE(${year}, year),
          venue = COALESCE(${venue}, venue),
          location = COALESCE(${location}, location),
          category = COALESCE(${category}, category),
          summary = COALESCE(${summary}, summary),
          objectives = CASE WHEN ${objectivesJson} IS NOT NULL THEN ${objectivesJson}::jsonb ELSE objectives END,
          key_activities = CASE WHEN ${keyActivitiesJson} IS NOT NULL THEN ${keyActivitiesJson}::jsonb ELSE key_activities END,
          compliance_observations = CASE WHEN ${complianceJson} IS NOT NULL THEN ${complianceJson}::jsonb ELSE compliance_observations END,
          next_steps = CASE WHEN ${nextStepsJson} IS NOT NULL THEN ${nextStepsJson}::jsonb ELSE next_steps END,
          impact_metrics = CASE WHEN ${impactMetricsJson} IS NOT NULL THEN ${impactMetricsJson}::jsonb ELSE impact_metrics END,
          financials = CASE WHEN ${data.financials !== undefined} THEN (${financialsJson})::jsonb ELSE financials END,
          delegation_volunteers = CASE WHEN ${delegationJson} IS NOT NULL THEN ${delegationJson}::jsonb ELSE delegation_volunteers END,
          signed_by = CASE WHEN ${signedByJson} IS NOT NULL THEN ${signedByJson}::jsonb ELSE signed_by END,
          documents = CASE WHEN ${documentsJson} IS NOT NULL THEN ${documentsJson}::jsonb ELSE documents END,
          show_financials = COALESCE(${showFinancials}, show_financials),
          show_documents = COALESCE(${showDocuments}, show_documents),
          featured = COALESCE(${featured}, featured),
          order_index = COALESCE(${orderIndex}, order_index),
          status = COALESCE(${status}, status),
          updated_at = NOW()
        WHERE slug = ${rawId}
        RETURNING *;
      `;
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
    const resolvedParams = await Promise.resolve(params);
    const rawId = resolvedParams?.id;
    if (!rawId) {
      return NextResponse.json({ error: 'Missing report identifier' }, { status: 400 });
    }

    const numId = Number(rawId);
    let result;
    if (!isNaN(numId)) {
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
