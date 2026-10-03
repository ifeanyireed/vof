import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = `
      SELECT c.*,
             (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) as message_count
      FROM chat_conversations c
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      params.push(status);
      query += ` AND c.status = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(c.visitor_name) LIKE $${params.length} OR LOWER(c.last_message) LIKE $${params.length} OR LOWER(c.session_id) LIKE $${params.length})`;
    }

    query += ` ORDER BY c.last_message_at DESC LIMIT 100`;

    // Using raw query via sql.query
    const conversations = await sql.query(query, params);

    // Total unread admin count across all conversations
    const unreadResult = await sql`
      SELECT COALESCE(SUM(unread_admin), 0) as total_unread
      FROM chat_conversations;
    `;

    return NextResponse.json({
      conversations,
      totalUnread: Number(unreadResult[0]?.total_unread || 0),
    });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ conversations: [], error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, status, resetAdminUnread, resetUserUnread, visitorName, visitorEmail } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      values.push(status);
      updates.push(`status = $${values.length}`);
    }

    if (resetAdminUnread) {
      updates.push(`unread_admin = 0`);
    }

    if (resetUserUnread) {
      updates.push(`unread_user = 0`);
    }

    if (visitorName) {
      values.push(visitorName);
      updates.push(`visitor_name = $${values.length}`);
    }

    if (visitorEmail) {
      values.push(visitorEmail);
      updates.push(`visitor_email = $${values.length}`);
    }

    updates.push(`updated_at = NOW()`);

    values.push(conversationId);
    const sqlText = `
      UPDATE chat_conversations
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const updated = await sql.query(sqlText, values);

    // Also mark messages as read if unread was reset
    if (resetAdminUnread) {
      await sql`
        UPDATE chat_messages
        SET is_read = true
        WHERE conversation_id = ${conversationId} AND sender_type = 'user';
      `;
    }

    return NextResponse.json({
      success: true,
      conversation: updated[0],
    });
  } catch (error: any) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
