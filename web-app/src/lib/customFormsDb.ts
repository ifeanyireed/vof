import { sql } from '@/lib/db';
import { CustomForm, CustomFormSubmission, FormField, FormSettings } from '@/types/forms';

let tablesInitialized = false;

export async function ensureCustomFormsTables() {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS custom_forms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'General',
        cover_image_url TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        fields JSONB NOT NULL DEFAULT '[]'::jsonb,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        views_count INT DEFAULT 0,
        submissions_count INT DEFAULT 0,
        created_by VARCHAR(150),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_custom_forms_slug ON custom_forms(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_custom_forms_status ON custom_forms(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_custom_forms_created_at ON custom_forms(created_at DESC);`;

    await sql`
      CREATE TABLE IF NOT EXISTS custom_form_submissions (
        id SERIAL PRIMARY KEY,
        form_id INT NOT NULL REFERENCES custom_forms(id) ON DELETE CASCADE,
        form_slug VARCHAR(255) NOT NULL,
        respondent_name VARCHAR(255),
        respondent_email VARCHAR(255),
        respondent_phone VARCHAR(100),
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        files JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'pending',
        admin_notes TEXT,
        ip_address VARCHAR(100),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_custom_form_subs_form_id ON custom_form_submissions(form_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_custom_form_subs_status ON custom_form_submissions(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_custom_form_subs_created_at ON custom_form_submissions(created_at DESC);`;

    tablesInitialized = true;
  } catch (err) {
    console.warn('Error in ensureCustomFormsTables:', err);
  }
}

export function mapFormRow(row: any): CustomForm {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    category: row.category || 'General',
    coverImageUrl: row.cover_image_url || '',
    status: row.status || 'draft',
    fields: Array.isArray(row.fields) ? row.fields : typeof row.fields === 'string' ? JSON.parse(row.fields) : [],
    settings: typeof row.settings === 'object' && row.settings !== null ? row.settings : {},
    viewsCount: Number(row.views_count) || 0,
    submissionsCount: Number(row.submissions_count) || 0,
    createdBy: row.created_by || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export function mapSubmissionRow(row: any): CustomFormSubmission {
  return {
    id: row.id,
    formId: row.form_id,
    formSlug: row.form_slug,
    respondentName: row.respondent_name || '',
    respondentEmail: row.respondent_email || '',
    respondentPhone: row.respondent_phone || '',
    data: typeof row.data === 'object' && row.data !== null ? row.data : {},
    files: Array.isArray(row.files) ? row.files : typeof row.files === 'string' ? JSON.parse(row.files) : [],
    status: row.status || 'pending',
    adminNotes: row.admin_notes || '',
    ipAddress: row.ip_address || '',
    userAgent: row.user_agent || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}
