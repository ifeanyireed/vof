import { neon } from '@neondatabase/serverless';
import { outreachReports } from '../src/data/outreachReports';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_LouPIU72xaSO@ep-broad-moon-b5bq0zrt-pooler.c-7.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const sql = neon(DATABASE_URL);

async function run() {
  console.log('Connecting to Neon Database...');
  console.log('Target database URL:', DATABASE_URL.replace(/:[^:]+@/, ':****@'));

  console.log('\n--- 1. Creating outreach_reports table ---');
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
  console.log('✓ Table outreach_reports ensured.');

  await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_slug ON outreach_reports(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_status ON outreach_reports(status);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_year ON outreach_reports(year);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_outreach_reports_category ON outreach_reports(category);`;
  console.log('✓ Indexes verified.');

  console.log(`\n--- 2. Seeding ${outreachReports.length} static outreach reports ---`);

  for (let i = 0; i < outreachReports.length; i++) {
    const report = outreachReports[i];
    console.log(`Processing [${i + 1}/${outreachReports.length}]: ${report.title} (${report.slug})`);

    const objectivesJson = JSON.stringify(report.objectives || []);
    const keyActivitiesJson = JSON.stringify(report.keyActivities || []);
    const complianceJson = JSON.stringify(report.complianceAndObservations || []);
    const nextStepsJson = JSON.stringify(report.nextSteps || []);
    const impactMetricsJson = JSON.stringify(report.impactMetrics || []);
    const financialsJson = report.financials ? JSON.stringify(report.financials) : null;
    const delegationJson = JSON.stringify(report.delegationAndVolunteers || []);
    const signedByJson = JSON.stringify(report.signedBy || {});
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
        ${financialsJson ? sql`${financialsJson}::jsonb` : null},
        ${delegationJson}::jsonb,
        ${signedByJson}::jsonb,
        ${documentsJson}::jsonb,
        ${report.financials ? true : false},
        ${(report.documents && report.documents.length > 0) ? true : false},
        ${i === 0},
        ${i},
        'published'
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        theme = EXCLUDED.theme,
        event_date = EXCLUDED.event_date,
        year = EXCLUDED.year,
        venue = EXCLUDED.venue,
        location = EXCLUDED.location,
        category = EXCLUDED.category,
        summary = EXCLUDED.summary,
        objectives = EXCLUDED.objectives,
        key_activities = EXCLUDED.key_activities,
        compliance_observations = EXCLUDED.compliance_observations,
        next_steps = EXCLUDED.next_steps,
        impact_metrics = EXCLUDED.impact_metrics,
        financials = EXCLUDED.financials,
        delegation_volunteers = EXCLUDED.delegation_volunteers,
        signed_by = EXCLUDED.signed_by,
        documents = EXCLUDED.documents,
        updated_at = NOW();
    `;
  }

  console.log('\n--- 3. Verifying database table contents ---');
  const rows = await sql`
    SELECT id, slug, title, year, category, status,
           jsonb_array_length(documents) as docs_count,
           jsonb_array_length(impact_metrics) as metrics_count,
           CASE WHEN financials IS NOT NULL THEN 'yes' ELSE 'no' END as has_financials
    FROM outreach_reports
    ORDER BY order_index ASC, id ASC;
  `;

  console.table(rows);
  console.log(`\nMigration completed successfully! Total records in outreach_reports: ${rows.length}`);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
