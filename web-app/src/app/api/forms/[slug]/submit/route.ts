import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapFormRow } from '@/lib/customFormsDb';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { slug } = await params;

    const rows = await sql`
      SELECT * FROM custom_forms
      WHERE slug = ${slug} OR id = ${/^\d+$/.test(slug) ? Number(slug) : -1}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const form = mapFormRow(rows[0]);

    if (form.status === 'closed') {
      return NextResponse.json(
        { error: 'This form is currently closed for new submissions.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const data = body.data || {};
    const files = Array.isArray(body.files) ? body.files : [];

    // Validate required fields
    const missingFields: string[] = [];
    form.fields.forEach((field) => {
      if (field.type === 'section') return;
      if (field.required) {
        const val = data[field.id];
        const hasFile = files.some((f: any) => f.fieldId === field.id);
        if (
          (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) &&
          !hasFile
        ) {
          missingFields.push(field.label || field.id);
        }
      }
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Please complete required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Try to extract respondent name, email, phone from fields if present
    let respondentName = body.respondentName || '';
    let respondentEmail = body.respondentEmail || '';
    let respondentPhone = body.respondentPhone || '';

    form.fields.forEach((field) => {
      const val = data[field.id];
      if (!val) return;
      const lowerLabel = (field.label || '').toLowerCase();

      if (!respondentEmail && (field.type === 'email' || lowerLabel.includes('email'))) {
        respondentEmail = String(val).trim();
      }
      if (!respondentPhone && (field.type === 'phone' || lowerLabel.includes('phone') || lowerLabel.includes('whatsapp'))) {
        respondentPhone = String(val).trim();
      }
      if (!respondentName && (lowerLabel.includes('name') || lowerLabel.includes('full name') || lowerLabel.includes('applicant'))) {
        respondentName = String(val).trim();
      }
    });

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    const insertResult = await sql`
      INSERT INTO custom_form_submissions (
        form_id, form_slug, respondent_name, respondent_email, respondent_phone,
        data, files, status, ip_address, user_agent
      ) VALUES (
        ${form.id}, ${form.slug}, ${respondentName}, ${respondentEmail}, ${respondentPhone},
        ${JSON.stringify(data)}::jsonb, ${JSON.stringify(files)}::jsonb,
        'pending', ${ipAddress}, ${userAgent}
      )
      RETURNING id, created_at;
    `;

    if (insertResult.length === 0) {
      return NextResponse.json({ error: 'Failed to record submission' }, { status: 500 });
    }

    const submissionId = insertResult[0].id;
    const referenceId = `VOF-${form.slug.slice(0, 4).toUpperCase()}-${submissionId}`;

    // Increment submissions_count
    await sql`
      UPDATE custom_forms
      SET submissions_count = submissions_count + 1, updated_at = NOW()
      WHERE id = ${form.id};
    `;

    // Attempt email notification if emails configured or default admin
    try {
      const notifyEmails = form.settings?.notifyEmails;
      if (Array.isArray(notifyEmails) && notifyEmails.length > 0) {
        // Send notification async
        sendFormCompletedNotification({
          formType: 'support',
          formTitle: form.title,
          submitterName: respondentName || 'Anonymous Respondent',
          submitterEmail: respondentEmail || 'no-reply@vonf.org',
          submitterPhone: respondentPhone,
          details: {
            'Reference ID': referenceId,
            'Form Name': form.title,
            ...data,
          },
        }).catch((e) => console.warn('Could not send notification email:', e));
      }
    } catch {}

    return NextResponse.json({
      success: true,
      submissionId,
      referenceId,
      message: form.settings?.successMessage || 'Your response has been successfully submitted. Thank you!',
      redirectUrl: form.settings?.redirectUrl || null,
    });
  } catch (error: any) {
    console.error('Failed to submit form:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
