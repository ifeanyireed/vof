import { sql } from '@/lib/db';
import { outreachReports as fallbackReports } from '@/data/outreachReports';

let tableChecked = false;

export async function ensureOutreachTable() {
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

export async function seedFallbackReportsIfEmpty() {
  const countRows = await sql`SELECT COUNT(*)::int AS count FROM outreach_reports;`;
  const count = Number(countRows?.[0]?.count ?? 0);
  if (count > 0) return false;

  for (let i = 0; i < fallbackReports.length; i++) {
    const report = fallbackReports[i];
    const objectivesJson = JSON.stringify(report.objectives || []);
    const keyActivitiesJson = JSON.stringify(report.keyActivities || []);
    const complianceJson = JSON.stringify(report.complianceAndObservations || []);
    const nextStepsJson = JSON.stringify(report.nextSteps || []);
    const impactMetricsJson = JSON.stringify(report.impactMetrics || []);
    const financialsJson = report.financials ? JSON.stringify(report.financials) : null;
    const delegationJson = JSON.stringify(report.delegationAndVolunteers || []);
    const signedByJson = JSON.stringify(report.signedBy || { name: '', title: '' });
    const documentsJson = JSON.stringify(report.documents || []);

    await sql`
      INSERT INTO outreach_reports (
        slug, title, theme, event_date, year, venue, location, category, summary,
        objectives, key_activities, compliance_observations, next_steps,
        impact_metrics, financials, delegation_volunteers, signed_by, documents,
        show_financials, show_documents, featured, order_index, status
      )
      VALUES (
        ${report.slug},
        ${report.title},
        ${report.theme || ''},
        ${report.eventDate},
        ${report.year},
        ${report.venue},
        ${report.location},
        ${report.category},
        ${report.summary},
        ${objectivesJson}::jsonb,
        ${keyActivitiesJson}::jsonb,
        ${complianceJson}::jsonb,
        ${nextStepsJson}::jsonb,
        ${impactMetricsJson}::jsonb,
        ${financialsJson}::jsonb,
        ${delegationJson}::jsonb,
        ${signedByJson}::jsonb,
        ${documentsJson}::jsonb,
        ${Boolean(report.financials)},
        ${Boolean(report.documents && report.documents.length > 0)},
        ${i === 0},
        ${i},
        'published'
      )
      ON CONFLICT (slug) DO NOTHING;
    `;
  }
  return true;
}

function parseJsonField<T>(field: any, defaultValue: T): T {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string' && field.trim()) {
    try {
      return JSON.parse(field) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

export function mapOutreachRow(row: any) {
  return {
    id: row.id,
    slug: row.slug || '',
    title: row.title || '',
    theme: row.theme || '',
    eventDate: row.event_date || '',
    year: Number(row.year) || new Date().getFullYear(),
    venue: row.venue || '',
    location: row.location || '',
    category: row.category || 'Community Relief',
    summary: row.summary || '',
    objectives: parseJsonField<string[]>(row.objectives, []),
    keyActivities: parseJsonField<string[]>(row.key_activities, []),
    complianceAndObservations: parseJsonField<string[]>(row.compliance_observations, []),
    nextSteps: parseJsonField<string[]>(row.next_steps, []),
    impactMetrics: parseJsonField<{ label: string; count: string }[]>(row.impact_metrics, []),
    financials: parseJsonField<any>(row.financials, null),
    delegationAndVolunteers: parseJsonField<{ name: string; role: string }[]>(row.delegation_volunteers, []),
    signedBy: parseJsonField<{ name: string; title: string }>(row.signed_by, { name: '', title: '' }),
    documents: parseJsonField<{ title: string; image: string; type: string }[]>(row.documents, []),
    showFinancials: row.show_financials !== false,
    showDocuments: row.show_documents !== false,
    featured: Boolean(row.featured),
    orderIndex: Number(row.order_index) || 0,
    status: row.status || 'published',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}
