import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export interface FormSetting {
  id: number;
  formKey: string;
  formName: string;
  isVisible: boolean;
  intakeStatus: 'open' | 'paused';
  pauseNoticeTitle?: string;
  pauseNoticeMessage?: string;
  updatedBy?: number;
  updatedAt?: string;
}

function mapRow(row: any): FormSetting {
  return {
    id: row.id,
    formKey: row.form_key,
    formName: row.form_name,
    isVisible: Boolean(row.is_visible),
    intakeStatus: row.intake_status === 'paused' ? 'paused' : 'open',
    pauseNoticeTitle: row.pause_notice_title || undefined,
    pauseNoticeMessage: row.pause_notice_message || undefined,
    updatedBy: row.updated_by || undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      const rows = await sql`
        SELECT * FROM form_settings WHERE form_key = ${key} LIMIT 1;
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Form setting not found' }, { status: 404 });
      }
      return NextResponse.json(mapRow(rows[0]));
    }

    const rows = await sql`
      SELECT * FROM form_settings ORDER BY id ASC;
    `;

    return NextResponse.json(rows.map(mapRow));
  } catch (error: any) {
    console.error('Error fetching form settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(req);
    // Optional check or soft auth: if not logged in as admin, reject
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Staff login required.' }, { status: 401 });
    }

    const body = await req.json();
    const { formKey, isVisible, intakeStatus, pauseNoticeTitle, pauseNoticeMessage } = body;

    if (!formKey) {
      return NextResponse.json({ error: 'formKey is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (typeof isVisible === 'boolean') {
      values.push(isVisible);
      updates.push(`is_visible = $${values.length}`);
    }

    if (intakeStatus === 'open' || intakeStatus === 'paused') {
      values.push(intakeStatus);
      updates.push(`intake_status = $${values.length}`);
    }

    if (pauseNoticeTitle !== undefined) {
      values.push(pauseNoticeTitle);
      updates.push(`pause_notice_title = $${values.length}`);
    }

    if (pauseNoticeMessage !== undefined) {
      values.push(pauseNoticeMessage);
      updates.push(`pause_notice_message = $${values.length}`);
    }

    values.push(authUser.id);
    updates.push(`updated_by = $${values.length}`);

    updates.push(`updated_at = NOW()`);

    values.push(formKey);
    const query = `
      UPDATE form_settings
      SET ${updates.join(', ')}
      WHERE form_key = $${values.length}
      RETURNING *;
    `;

    const updated = await sql.query(query, values);
    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Form setting not found for formKey: ' + formKey }, { status: 404 });
    }

    // Record audit log
    try {
      await sql`
        INSERT INTO admin_audit_logs (admin_id, admin_email, action, module, record_id, details)
        VALUES (
          ${authUser.id},
          ${authUser.email},
          'UPDATE_FORM_SETTING',
          'forms',
          ${String(updated[0].id)},
          ${JSON.stringify({ formKey, isVisible, intakeStatus })}
        );
      `;
    } catch (e) {
      console.warn('Audit log write error:', e);
    }

    return NextResponse.json({
      success: true,
      setting: mapRow(updated[0]),
    });
  } catch (error: any) {
    console.error('Error updating form setting:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
