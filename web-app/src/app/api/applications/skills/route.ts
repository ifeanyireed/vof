import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const trade = searchParams.get('trade');

    let rows;
    if (status && trade) {
      rows = await sql`
        SELECT id, applicant_name AS "applicantName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(gender, '') AS gender,
          COALESCE(address, '') AS address,
          trade_selected AS "tradeSelected",
          COALESCE(education_level, '') AS "educationLevel",
          COALESCE(employment_status, '') AS "employmentStatus",
          COALESCE(statement_of_purpose, '') AS "statementOfPurpose",
          COALESCE(document_url, '') AS "documentUrl",
          status,
          COALESCE(intake_batch, '') AS "intakeBatch",
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt",
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM skill_applications
        WHERE status = ${status} AND trade_selected = ${trade}
        ORDER BY created_at DESC, id DESC;
      `;
    } else if (status) {
      rows = await sql`
        SELECT id, applicant_name AS "applicantName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(gender, '') AS gender,
          COALESCE(address, '') AS address,
          trade_selected AS "tradeSelected",
          COALESCE(education_level, '') AS "educationLevel",
          COALESCE(employment_status, '') AS "employmentStatus",
          COALESCE(statement_of_purpose, '') AS "statementOfPurpose",
          COALESCE(document_url, '') AS "documentUrl",
          status,
          COALESCE(intake_batch, '') AS "intakeBatch",
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt",
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM skill_applications
        WHERE status = ${status}
        ORDER BY created_at DESC, id DESC;
      `;
    } else if (trade) {
      rows = await sql`
        SELECT id, applicant_name AS "applicantName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(gender, '') AS gender,
          COALESCE(address, '') AS address,
          trade_selected AS "tradeSelected",
          COALESCE(education_level, '') AS "educationLevel",
          COALESCE(employment_status, '') AS "employmentStatus",
          COALESCE(statement_of_purpose, '') AS "statementOfPurpose",
          COALESCE(document_url, '') AS "documentUrl",
          status,
          COALESCE(intake_batch, '') AS "intakeBatch",
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt",
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM skill_applications
        WHERE trade_selected = ${trade}
        ORDER BY created_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, applicant_name AS "applicantName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(gender, '') AS gender,
          COALESCE(address, '') AS address,
          trade_selected AS "tradeSelected",
          COALESCE(education_level, '') AS "educationLevel",
          COALESCE(employment_status, '') AS "employmentStatus",
          COALESCE(statement_of_purpose, '') AS "statementOfPurpose",
          COALESCE(document_url, '') AS "documentUrl",
          status,
          COALESCE(intake_batch, '') AS "intakeBatch",
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt",
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM skill_applications
        ORDER BY created_at DESC, id DESC;
      `;
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching skill applications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const a = await req.json();

    if (!a.applicantName || !a.email || !a.tradeSelected) {
      return NextResponse.json(
        { error: 'Applicant name, email, and trade are required' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO skill_applications (
        applicant_name, email, phone, country, gender, address,
        trade_selected, education_level, employment_status,
        statement_of_purpose, document_url, status,
        intake_batch, notes
      ) VALUES (
        ${a.applicantName},
        ${a.email},
        ${a.phone || ''},
        ${a.country || 'Nigeria'},
        ${a.gender || ''},
        ${a.address || ''},
        ${a.tradeSelected},
        ${a.educationLevel || ''},
        ${a.employmentStatus || ''},
        ${a.statementOfPurpose || ''},
        ${a.documentUrl || ''},
        ${a.status || 'pending'},
        ${a.intakeBatch || 'Batch 2026-A'},
        ${a.notes || ''}
      )
      RETURNING id, applicant_name AS "applicantName", email, phone,
        country, gender, address, trade_selected AS "tradeSelected",
        education_level AS "educationLevel",
        employment_status AS "employmentStatus",
        statement_of_purpose AS "statementOfPurpose",
        document_url AS "documentUrl", status,
        intake_batch AS "intakeBatch", notes,
        created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const saved = rows[0];

    // Dispatch notification to ADMIN_EMAIL
    sendFormCompletedNotification({
      formType: 'skills',
      formTitle: 'Vocational Skills Application',
      submitterName: saved.applicantName,
      submitterEmail: saved.email,
      submitterPhone: saved.phone,
      country: saved.country,
      details: {
        'Application ID': saved.id,
        'Trade Selected': saved.tradeSelected,
        'Education Level': saved.educationLevel,
        'Employment Status': saved.employmentStatus,
        'Statement of Purpose': saved.statementOfPurpose,
        'Intake Batch': saved.intakeBatch,
        'Address / Location': saved.address,
        'Document URL': saved.documentUrl,
      },
      submittedAt: saved.createdAt,
    }).catch((e) => console.warn('Notification error on skills route:', e));

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error('Error creating skill application:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
