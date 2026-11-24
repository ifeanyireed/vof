import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyTrackingToken } from '@/lib/crm-mailer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') || '';
  const targetUrl = req.nextUrl.searchParams.get('url') || 'https://vonf.org';
  const payload = verifyTrackingToken(token);

  // Guard against open redirect to non-http(s) schemes
  const safeRedirect = /^https?:\/\//i.test(targetUrl) ? targetUrl : 'https://vonf.org';

  if (payload) {
    try {
      const updated = await sql`
        UPDATE crm_email_blast_logs
        SET
          clicked_at = COALESCE(clicked_at, NOW()),
          click_count = click_count + 1,
          opened_at = COALESCE(opened_at, NOW()),
          open_count = CASE WHEN open_count = 0 THEN 1 ELSE open_count END
        WHERE id = ${payload.logId}
        RETURNING click_count, open_count;
      `;

      if (updated.length > 0 && Number(updated[0].click_count) === 1) {
        await sql`
          UPDATE crm_email_blasts
          SET click_count = click_count + 1, updated_at = NOW()
          WHERE id = ${payload.blastId};
        `;
      }
    } catch (err) {
      console.warn('[CRM Click Track] Error recording click:', err);
    }
  }

  return NextResponse.redirect(safeRedirect, 302);
}
