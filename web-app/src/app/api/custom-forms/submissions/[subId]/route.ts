import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapSubmissionRow } from '@/lib/customFormsDb';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ subId: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { subId } = await params;
    const submissionId = Number(subId);

    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 });
    }

    const rows = await sql`
      SELECT * FROM custom_form_submissions
      WHERE id = ${submissionId}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(mapSubmissionRow(rows[0]));
  } catch (error: any) {
    console.error('Failed to get submission:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { subId } = await params;
    const submissionId = Number(subId);

    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 });
    }

    const body = await req.json();
    const { status, adminNotes } = body;

    let rows: any[];
    if (status && adminNotes !== undefined) {
      rows = await sql`
        UPDATE custom_form_submissions
        SET status = ${status}, admin_notes = ${adminNotes}, updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING *;
      `;
    } else if (status) {
      rows = await sql`
        UPDATE custom_form_submissions
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING *;
      `;
    } else if (adminNotes !== undefined) {
      rows = await sql`
        UPDATE custom_form_submissions
        SET admin_notes = ${adminNotes}, updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING *;
      `;
    } else {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(mapSubmissionRow(rows[0]));
  } catch (error: any) {
    console.error('Failed to update submission:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { subId } = await params;
    const submissionId = Number(subId);

    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 });
    }

    const rows = await sql`
      DELETE FROM custom_form_submissions
      WHERE id = ${submissionId}
      RETURNING id, form_id;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const formId = rows[0].form_id;
    await sql`
      UPDATE custom_forms
      SET submissions_count = GREATEST(0, submissions_count - 1)
      WHERE id = ${formId};
    `;

    return NextResponse.json({ success: true, deletedId: submissionId });
  } catch (error: any) {
    console.error('Failed to delete submission:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
