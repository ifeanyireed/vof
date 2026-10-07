import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const interest = searchParams.get('interest');

    let rows;
    if (status && interest) {
      rows = await sql`
        SELECT id, full_name AS "fullName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(location, '') AS location,
          COALESCE(interest_area, '') AS "interestArea",
          COALESCE(availability, '') AS availability,
          COALESCE(skills_experience, '') AS "skillsExperience",
          COALESCE(resume_url, '') AS "resumeUrl",
          status,
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt"
        FROM volunteers
        WHERE status = ${status} AND interest_area = ${interest}
        ORDER BY created_at DESC, id DESC;
      `;
    } else if (status) {
      rows = await sql`
        SELECT id, full_name AS "fullName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(location, '') AS location,
          COALESCE(interest_area, '') AS "interestArea",
          COALESCE(availability, '') AS availability,
          COALESCE(skills_experience, '') AS "skillsExperience",
          COALESCE(resume_url, '') AS "resumeUrl",
          status,
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt"
        FROM volunteers
        WHERE status = ${status}
        ORDER BY created_at DESC, id DESC;
      `;
    } else if (interest) {
      rows = await sql`
        SELECT id, full_name AS "fullName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(location, '') AS location,
          COALESCE(interest_area, '') AS "interestArea",
          COALESCE(availability, '') AS availability,
          COALESCE(skills_experience, '') AS "skillsExperience",
          COALESCE(resume_url, '') AS "resumeUrl",
          status,
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt"
        FROM volunteers
        WHERE interest_area = ${interest}
        ORDER BY created_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, full_name AS "fullName", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(location, '') AS location,
          COALESCE(interest_area, '') AS "interestArea",
          COALESCE(availability, '') AS availability,
          COALESCE(skills_experience, '') AS "skillsExperience",
          COALESCE(resume_url, '') AS "resumeUrl",
          status,
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt"
        FROM volunteers
        ORDER BY created_at DESC, id DESC;
      `;
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const v = await req.json();

    if (!v.fullName || !v.email || !v.phone) {
      return NextResponse.json(
        { error: 'Full name, email, and phone number are required' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO volunteers (
        full_name, email, phone, country, location,
        interest_area, availability, skills_experience,
        resume_url, status, notes
      ) VALUES (
        ${v.fullName},
        ${v.email},
        ${v.phone},
        ${v.country || 'Nigeria'},
        ${v.location || ''},
        ${v.interestArea || ''},
        ${v.availability || ''},
        ${v.skillsExperience || ''},
        ${v.resumeUrl || ''},
        ${v.status || 'new'},
        ${v.notes || ''}
      )
      RETURNING id, full_name AS "fullName", email, phone,
        country, location, interest_area AS "interestArea",
        availability, skills_experience AS "skillsExperience",
        resume_url AS "resumeUrl", status, notes,
        created_at AS "createdAt";
    `;

    const saved = rows[0];

    // Dispatch notification to ADMIN_EMAIL
    sendFormCompletedNotification({
      formType: 'volunteer',
      formTitle: 'Volunteer Sign-up & Network',
      submitterName: saved.fullName,
      submitterEmail: saved.email,
      submitterPhone: saved.phone,
      country: saved.country,
      details: {
        'Volunteer ID': saved.id,
        'Location': saved.location,
        'Interest Area': saved.interestArea,
        'Availability': saved.availability,
        'Skills & Experience': saved.skillsExperience,
        'Resume URL': saved.resumeUrl,
      },
      submittedAt: saved.createdAt,
    }).catch((e) => console.warn('Notification error on volunteer route:', e));

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error('Error creating volunteer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
