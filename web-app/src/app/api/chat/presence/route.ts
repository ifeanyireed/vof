import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql`
      SELECT staff_name, is_online, last_heartbeat,
             CASE
               WHEN is_online = true AND last_heartbeat > (NOW() - INTERVAL '40 seconds') THEN true
               ELSE false
             END as active_now
      FROM chat_presence
      WHERE id = 'support_staff'
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        isOnline: false,
        staffName: 'Support Team',
        lastSeen: null,
      });
    }

    const row = rows[0];
    return NextResponse.json({
      isOnline: Boolean(row.active_now),
      rawOnlineToggle: Boolean(row.is_online),
      staffName: row.staff_name,
      lastHeartbeat: row.last_heartbeat,
    });
  } catch (error: any) {
    console.error('Error fetching presence:', error);
    return NextResponse.json({ isOnline: false, staffName: 'Support Team', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { isOnline = true, staffName = 'Foundation Support' } = body;

    const rows = await sql`
      INSERT INTO chat_presence (id, staff_name, is_online, last_heartbeat, updated_at)
      VALUES ('support_staff', ${staffName}, ${Boolean(isOnline)}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE
      SET is_online = ${Boolean(isOnline)},
          staff_name = ${staffName},
          last_heartbeat = NOW(),
          updated_at = NOW()
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      isOnline: rows[0]?.is_online,
      staffName: rows[0]?.staff_name,
      lastHeartbeat: rows[0]?.last_heartbeat,
    });
  } catch (error: any) {
    console.error('Error updating presence:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
