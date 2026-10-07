import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get('currency');
    const campaign = searchParams.get('campaign');

    let rows;
    if (currency && campaign) {
      rows = await sql`
        SELECT id, donor_name AS "donorName",
          COALESCE(donor_email, '') AS "donorEmail",
          COALESCE(donor_phone, '') AS "donorPhone",
          amount, currency,
          COALESCE(campaign, '') AS campaign,
          COALESCE(payment_method, '') AS "paymentMethod",
          COALESCE(reference, '') AS reference,
          status, anonymous,
          COALESCE(notes, '') AS notes,
          donated_at AS "donatedAt",
          created_at AS "createdAt"
        FROM donations
        WHERE currency = ${currency} AND campaign = ${campaign}
        ORDER BY donated_at DESC, id DESC;
      `;
    } else if (currency) {
      rows = await sql`
        SELECT id, donor_name AS "donorName",
          COALESCE(donor_email, '') AS "donorEmail",
          COALESCE(donor_phone, '') AS "donorPhone",
          amount, currency,
          COALESCE(campaign, '') AS campaign,
          COALESCE(payment_method, '') AS "paymentMethod",
          COALESCE(reference, '') AS reference,
          status, anonymous,
          COALESCE(notes, '') AS notes,
          donated_at AS "donatedAt",
          created_at AS "createdAt"
        FROM donations
        WHERE currency = ${currency}
        ORDER BY donated_at DESC, id DESC;
      `;
    } else if (campaign) {
      rows = await sql`
        SELECT id, donor_name AS "donorName",
          COALESCE(donor_email, '') AS "donorEmail",
          COALESCE(donor_phone, '') AS "donorPhone",
          amount, currency,
          COALESCE(campaign, '') AS campaign,
          COALESCE(payment_method, '') AS "paymentMethod",
          COALESCE(reference, '') AS reference,
          status, anonymous,
          COALESCE(notes, '') AS notes,
          donated_at AS "donatedAt",
          created_at AS "createdAt"
        FROM donations
        WHERE campaign = ${campaign}
        ORDER BY donated_at DESC, id DESC;
      `;
    } else {
      rows = await sql`
        SELECT id, donor_name AS "donorName",
          COALESCE(donor_email, '') AS "donorEmail",
          COALESCE(donor_phone, '') AS "donorPhone",
          amount, currency,
          COALESCE(campaign, '') AS campaign,
          COALESCE(payment_method, '') AS "paymentMethod",
          COALESCE(reference, '') AS reference,
          status, anonymous,
          COALESCE(notes, '') AS notes,
          donated_at AS "donatedAt",
          created_at AS "createdAt"
        FROM donations
        ORDER BY donated_at DESC, id DESC;
      `;
    }

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();

    const donorName = d.donorName || 'Anonymous Donor';
    const currency = d.currency || 'NGN';
    const status = d.status || 'completed';
    const amount = Number(d.amount) || 0;
    const anonymous = Boolean(d.anonymous);
    const donatedAt = d.donatedAt ? new Date(d.donatedAt) : new Date();

    const rows = await sql`
      INSERT INTO donations (
        donor_name, donor_email, donor_phone, amount, currency,
        campaign, payment_method, reference, status, anonymous,
        notes, donated_at
      ) VALUES (
        ${donorName},
        ${d.donorEmail || ''},
        ${d.donorPhone || ''},
        ${amount},
        ${currency},
        ${d.campaign || 'General Foundation Support'},
        ${d.paymentMethod || 'Paystack'},
        ${d.reference || ''},
        ${status},
        ${anonymous},
        ${d.notes || ''},
        ${donatedAt.toISOString()}
      )
      RETURNING id, donor_name AS "donorName",
        donor_email AS "donorEmail", donor_phone AS "donorPhone",
        amount, currency, campaign, payment_method AS "paymentMethod",
        reference, status, anonymous, notes,
        donated_at AS "donatedAt", created_at AS "createdAt";
    `;

    const saved = rows[0];

    // Dispatch notification to ADMIN_EMAIL
    const submitterDisplayName = anonymous ? `${saved.donorName} (Anonymous)` : saved.donorName;
    sendFormCompletedNotification({
      formType: 'donation',
      formTitle: 'Direct Giving & Donation',
      submitterName: submitterDisplayName,
      submitterEmail: saved.donorEmail || '',
      submitterPhone: saved.donorPhone || '',
      country: 'Global',
      details: {
        'Donation ID': saved.id,
        'Amount': `${saved.amount} ${saved.currency}`,
        'Campaign': saved.campaign,
        'Payment Method': saved.paymentMethod,
        'Payment Reference': saved.reference,
        'Status': saved.status,
        'Anonymous': anonymous ? 'Yes' : 'No',
        'Notes': saved.notes,
      },
      submittedAt: saved.donatedAt,
    }).catch((e) => console.warn('Notification error on donation route:', e));

    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    console.error('Error creating donation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
