import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let rows;
    if (status) {
      rows = await sql`
        SELECT id, applicant_name AS "applicantName", email, phone, 
          COALESCE(country, 'Nigeria') AS country, 
          COALESCE(date_of_birth, '') AS "dateOfBirth", 
          COALESCE(gender, '') AS gender, 
          COALESCE(state_of_origin, '') AS "stateOfOrigin", 
          COALESCE(lga, '') AS lga, 
          institution_name AS "institutionName", 
          course_of_study AS "courseOfStudy", 
          COALESCE(current_level, '') AS "currentLevel", 
          COALESCE(cgpa, '') AS cgpa, 
          amount_requested AS "amountRequested", 
          COALESCE(reason_for_aid, '') AS "reasonForAid", 
          COALESCE(document_url, '') AS "documentUrl", 
          status, 
          COALESCE(reviewer_notes, '') AS "reviewerNotes", 
          COALESCE(created_at, NOW()) AS "createdAt", 
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM scholarship_applications
        WHERE status = ${status}
        ORDER BY created_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, applicant_name AS "applicantName", email, phone, 
          COALESCE(country, 'Nigeria') AS country, 
          COALESCE(date_of_birth, '') AS "dateOfBirth", 
          COALESCE(gender, '') AS gender, 
          COALESCE(state_of_origin, '') AS "stateOfOrigin", 
          COALESCE(lga, '') AS lga, 
          institution_name AS "institutionName", 
          course_of_study AS "courseOfStudy", 
          COALESCE(current_level, '') AS "currentLevel", 
          COALESCE(cgpa, '') AS cgpa, 
          amount_requested AS "amountRequested", 
          COALESCE(reason_for_aid, '') AS "reasonForAid", 
          COALESCE(document_url, '') AS "documentUrl", 
          status, 
          COALESCE(reviewer_notes, '') AS "reviewerNotes", 
          COALESCE(created_at, NOW()) AS "createdAt", 
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM scholarship_applications
        ORDER BY created_at DESC, id DESC;
      `;
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching scholarship applications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const a = await req.json();

    if (!a.applicantName || !a.email || !a.institutionName) {
      return NextResponse.json(
        { error: 'Applicant name, email, and institution are required' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO scholarship_applications (
        applicant_name, email, phone, country, date_of_birth, gender,
        state_of_origin, lga, institution_name, course_of_study,
        current_level, cgpa, amount_requested, reason_for_aid,
        document_url, status
      ) VALUES (
        ${a.applicantName},
        ${a.email},
        ${a.phone || ''},
        ${a.country || 'Nigeria'},
        ${a.dateOfBirth || ''},
        ${a.gender || ''},
        ${a.stateOfOrigin || ''},
        ${a.lga || ''},
        ${a.institutionName},
        ${a.courseOfStudy || ''},
        ${a.currentLevel || '200 Level'},
        ${a.cgpa || ''},
        ${Number(a.amountRequested) || 0},
        ${a.reasonForAid || ''},
        ${a.documentUrl || ''},
        ${a.status || 'pending'}
      )
      RETURNING id, applicant_name AS "applicantName", email, phone,
        country, date_of_birth AS "dateOfBirth", gender,
        state_of_origin AS "stateOfOrigin", lga,
        institution_name AS "institutionName",
        course_of_study AS "courseOfStudy",
        current_level AS "currentLevel", cgpa,
        amount_requested AS "amountRequested",
        reason_for_aid AS "reasonForAid",
        document_url AS "documentUrl", status,
        created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const saved = rows[0];

    // Dispatch notification to ADMIN_EMAIL
    sendFormCompletedNotification({
      formType: 'scholarship',
      formTitle: 'Academic Scholarship Application',
      submitterName: saved.applicantName,
      submitterEmail: saved.email,
      submitterPhone: saved.phone,
      country: saved.country,
      details: {
        'Application ID': saved.id,
        'Institution': saved.institutionName,
        'Course of Study': saved.courseOfStudy,
        'Current Level': saved.currentLevel,
        'CGPA / Grade': saved.cgpa,
        'Amount Requested': saved.amountRequested,
        'Reason for Aid': saved.reasonForAid,
        'Document URL': saved.documentUrl,
        'State / District': saved.stateOfOrigin,
      },
      submittedAt: saved.createdAt,
    }).catch((e) => console.warn('Notification error on scholarship route:', e));

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error('Error creating scholarship application:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
