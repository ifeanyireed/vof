import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const partnerType = searchParams.get('type');

    let rows;
    if (status && status !== 'All') {
      rows = await sql`
        SELECT id, organization_name AS "organizationName", partner_type AS "partnerType",
          contact_person AS "contactPerson", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(city, '') AS city,
          COALESCE(website, '') AS website,
          COALESCE(partnership_interest, '') AS "partnershipInterest",
          COALESCE(message, '') AS message,
          status,
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt",
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM partners
        WHERE status = ${status}
        ORDER BY created_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, organization_name AS "organizationName", partner_type AS "partnerType",
          contact_person AS "contactPerson", email, phone,
          COALESCE(country, 'Nigeria') AS country,
          COALESCE(city, '') AS city,
          COALESCE(website, '') AS website,
          COALESCE(partnership_interest, '') AS "partnershipInterest",
          COALESCE(message, '') AS message,
          status,
          COALESCE(notes, '') AS notes,
          COALESCE(created_at, NOW()) AS "createdAt",
          COALESCE(updated_at, NOW()) AS "updatedAt"
        FROM partners
        ORDER BY created_at DESC, id DESC;
      `;
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const p = await req.json();

    if (!p.organizationName || !p.contactPerson || !p.email || !p.phone) {
      return NextResponse.json(
        { error: 'Organization name, contact person, email, and phone number are required' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO partners (
        organization_name, partner_type, contact_person, email, phone,
        country, city, website, partnership_interest, message,
        status, notes, created_at, updated_at
      ) VALUES (
        ${p.organizationName},
        ${p.partnerType || 'Corporate'},
        ${p.contactPerson},
        ${p.email},
        ${p.phone},
        ${p.country || 'Nigeria'},
        ${p.city || ''},
        ${p.website || ''},
        ${p.partnershipInterest || ''},
        ${p.message || ''},
        ${p.status || 'new'},
        ${p.notes || ''},
        NOW(),
        NOW()
      )
      RETURNING id, organization_name AS "organizationName", partner_type AS "partnerType",
        contact_person AS "contactPerson", email, phone,
        country, city, website, partnership_interest AS "partnershipInterest",
        message, status, notes, created_at AS "createdAt", updated_at AS "updatedAt";
    `;

    const saved = rows[0];

    // Dispatch notification to ADMIN_EMAIL
    sendFormCompletedNotification({
      formType: 'partner',
      formTitle: 'Strategic Partner Inquiry',
      submitterName: saved.contactPerson,
      submitterEmail: saved.email,
      submitterPhone: saved.phone,
      country: saved.country,
      details: {
        'Partner ID': saved.id,
        'Organization Name': saved.organizationName,
        'Partner Type': saved.partnerType,
        'City': saved.city,
        'Website': saved.website,
        'Partnership Interest': saved.partnershipInterest,
        'Proposal Message': saved.message,
      },
      submittedAt: saved.createdAt,
    }).catch((e) => console.warn('Notification error on partner route:', e));

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
