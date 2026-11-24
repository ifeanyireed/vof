import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyTrackingToken } from '@/lib/crm-mailer';

export const dynamic = 'force-dynamic';

const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || '';
  const payload = verifyTrackingToken(token);

  if (payload) {
    try {
      const updated = await sql`
        UPDATE crm_email_blast_logs
        SET
          opened_at = COALESCE(opened_at, NOW()),
          open_count = open_count + 1
        WHERE id = ${payload.logId}
        RETURNING open_count;
      `;

      // Increment unique open_count on blast when first opened
      if (updated.length > 0 && Number(updated[0].open_count) === 1) {
        await sql`
          UPDATE crm_email_blasts
          SET open_count = open_count + 1, updated_at = NOW()
          WHERE id = ${payload.blastId};
        `;
      }
    } catch (err) {
      console.warn('[CRM Open Track] Error recording open:', err);
    }
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
