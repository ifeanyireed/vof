import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables } from '@/lib/crm-db';
import { verifyTrackingToken } from '@/lib/crm-mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const token = String(body.token || '');
    const payload = verifyTrackingToken(token);

    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid or expired unsubscribe link' }, { status: 400 });
    }

    await sql`
      UPDATE crm_email_subscribers
      SET status = 'UNSUBSCRIBED'
      WHERE LOWER(email) = ${payload.email.toLowerCase()};
    `;

    return NextResponse.json({
      success: true,
      email: payload.email,
      message: 'You have been unsubscribed from Veronica Onyeneke Foundation email updates.',
    });
  } catch (error: any) {
    console.error('[CRM Unsubscribe POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to process unsubscribe request' }, { status: 500 });
  }
}
