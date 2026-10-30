import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCustomFormsTables, mapSubmissionRow } from '@/lib/customFormsDb';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await ensureCustomFormsTables();
    const { id } = await params;
    const formId = Number(id);

    if (isNaN(formId)) {
      return NextResponse.json({ error: 'Invalid form id' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 500);
    const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

    let rows: any[];
    if (q && status && status !== 'all') {
      const pattern = `%${q}%`;
      rows = await sql`
        SELECT * FROM custom_form_submissions
        WHERE form_id = ${formId}
          AND status = ${status}
          AND (respondent_name ILIKE ${pattern} OR respondent_email ILIKE ${pattern} OR respondent_phone ILIKE ${pattern} OR data::text ILIKE ${pattern})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (q) {
      const pattern = `%${q}%`;
      rows = await sql`
        SELECT * FROM custom_form_submissions
        WHERE form_id = ${formId}
          AND (respondent_name ILIKE ${pattern} OR respondent_email ILIKE ${pattern} OR respondent_phone ILIKE ${pattern} OR data::text ILIKE ${pattern})
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else if (status && status !== 'all') {
      rows = await sql`
        SELECT * FROM custom_form_submissions
        WHERE form_id = ${formId} AND status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    } else {
      rows = await sql`
        SELECT * FROM custom_form_submissions
        WHERE form_id = ${formId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
    }

    // Get status breakdown counts
    const countRows = await sql`
      SELECT status, COUNT(*)::int AS count
      FROM custom_form_submissions
      WHERE form_id = ${formId}
      GROUP BY status;
    `;

    const statusCounts: Record<string, number> = {
      all: 0,
      pending: 0,
      reviewed: 0,
      approved: 0,
      rejected: 0,
      archived: 0,
    };

    let total = 0;
    countRows.forEach((r: any) => {
      const s = r.status;
      const c = Number(r.count) || 0;
      statusCounts[s] = c;
      total += c;
    });
    statusCounts.all = total;

    return NextResponse.json({
      submissions: rows.map(mapSubmissionRow),
      totalCount: total,
      statusCounts,
    });
  } catch (error: any) {
    console.error('Failed to get submissions:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
