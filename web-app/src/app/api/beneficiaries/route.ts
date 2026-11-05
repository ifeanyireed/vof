import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let rows;
    if (category && category !== 'All' && status && status !== 'All') {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        WHERE category = ${category} AND award_status = ${status}
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    } else if (category && category !== 'All') {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        WHERE category = ${category}
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    } else if (status && status !== 'All') {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        WHERE award_status = ${status}
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id,
          full_name AS "fullName",
          category,
          institution,
          class_level AS "classLevel",
          year_awarded AS "yearAwarded",
          award_status AS "awardStatus",
          COALESCE(bio_story, '') AS "bioStory",
          COALESCE(image_url, '') AS "imageUrl",
          COALESCE(location, 'Imo State, Nigeria') AS location,
          COALESCE(gender, '') AS gender,
          COALESCE(featured, false) AS featured,
          COALESCE(sort_order, 0) AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM scholarship_beneficiaries
        ORDER BY sort_order ASC, created_at DESC, id DESC;
      `;
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching scholarship beneficiaries:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    if (!b.fullName || !b.category || !b.institution || !b.classLevel || !b.yearAwarded) {
      return NextResponse.json(
        { error: 'Full name, category, institution, class level, and year awarded are required' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO scholarship_beneficiaries (
        full_name, category, institution, class_level, year_awarded,
        award_status, bio_story, image_url, location, gender,
        featured, sort_order, created_at, updated_at
      ) VALUES (
        ${b.fullName.trim()},
        ${b.category.trim()},
        ${b.institution.trim()},
        ${b.classLevel.trim()},
        ${b.yearAwarded.toString().trim()},
        ${b.awardStatus || 'Active'},
        ${b.bioStory || ''},
        ${b.imageUrl || ''},
        ${b.location || 'Imo State, Nigeria'},
        ${b.gender || 'Not specified'},
        ${b.featured === true || b.featured === 'true'},
        ${typeof b.sortOrder === 'number' ? b.sortOrder : 0},
        NOW(),
        NOW()
      )
      RETURNING id,
        full_name AS "fullName",
        category,
        institution,
        class_level AS "classLevel",
        year_awarded AS "yearAwarded",
        award_status AS "awardStatus",
        COALESCE(bio_story, '') AS "bioStory",
        COALESCE(image_url, '') AS "imageUrl",
        location,
        gender,
        featured,
        sort_order AS "sortOrder",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating scholarship beneficiary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
