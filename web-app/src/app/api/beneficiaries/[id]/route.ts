import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beneficiaryId = parseInt(id, 10);
    if (isNaN(beneficiaryId)) {
      return NextResponse.json({ error: 'Invalid beneficiary ID' }, { status: 400 });
    }

    const rows = await sql`
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
      WHERE id = ${beneficiaryId}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error fetching beneficiary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beneficiaryId = parseInt(id, 10);
    if (isNaN(beneficiaryId)) {
      return NextResponse.json({ error: 'Invalid beneficiary ID' }, { status: 400 });
    }

    const b = await req.json();

    const rows = await sql`
      UPDATE scholarship_beneficiaries
      SET
        full_name = COALESCE(${b.fullName}, full_name),
        category = COALESCE(${b.category}, category),
        institution = COALESCE(${b.institution}, institution),
        class_level = COALESCE(${b.classLevel}, class_level),
        year_awarded = COALESCE(${b.yearAwarded ? b.yearAwarded.toString() : null}, year_awarded),
        award_status = COALESCE(${b.awardStatus}, award_status),
        bio_story = COALESCE(${b.bioStory}, bio_story),
        image_url = COALESCE(${b.imageUrl}, image_url),
        location = COALESCE(${b.location}, location),
        gender = COALESCE(${b.gender}, gender),
        featured = COALESCE(${b.featured !== undefined ? b.featured : null}, featured),
        sort_order = COALESCE(${b.sortOrder !== undefined ? b.sortOrder : null}, sort_order),
        updated_at = NOW()
      WHERE id = ${beneficiaryId}
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

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error updating beneficiary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const beneficiaryId = parseInt(id, 10);
    if (isNaN(beneficiaryId)) {
      return NextResponse.json({ error: 'Invalid beneficiary ID' }, { status: 400 });
    }

    await sql`
      DELETE FROM scholarship_beneficiaries
      WHERE id = ${beneficiaryId};
    `;

    return NextResponse.json({ success: true, message: 'Beneficiary deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting beneficiary:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
