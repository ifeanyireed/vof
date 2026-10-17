import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateChatbotReply } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const conversationIdParam = searchParams.get('conversationId');

    let conversation: any = null;

    if (conversationIdParam) {
      const convRows = await sql`
        SELECT * FROM chat_conversations WHERE id = ${Number(conversationIdParam)} LIMIT 1;
      `;
      conversation = convRows[0] || null;
    } else if (sessionId) {
      const convRows = await sql`
        SELECT * FROM chat_conversations WHERE session_id = ${sessionId} LIMIT 1;
      `;
      conversation = convRows[0] || null;
    }

    if (!conversation) {
      return NextResponse.json({
        conversation: null,
        messages: [],
        isStaffOnline: false,
      });
    }

    // Check staff presence
    const presenceRows = await sql`
      SELECT is_online, staff_name,
             CASE
               WHEN is_online = true AND last_heartbeat > (NOW() - INTERVAL '40 seconds') THEN true
               ELSE false
             END as active_now
      FROM chat_presence
      WHERE id = 'support_staff'
      LIMIT 1;
    `;
    const isStaffOnline = Boolean(presenceRows[0]?.active_now);
    const staffName = presenceRows[0]?.staff_name || 'Support Desk';

    // Fetch messages
    const messages = await sql`
      SELECT id, conversation_id, sender_type, sender_name, content, is_read, created_at
      FROM chat_messages
      WHERE conversation_id = ${conversation.id}
      ORDER BY created_at ASC;
    `;

    return NextResponse.json({
      conversation,
      messages,
      isStaffOnline,
      staffName,
    });
  } catch (error: any) {
    console.error('Error in GET /api/chat/messages:', error);
    return NextResponse.json({ error: error.message, messages: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      conversationId: passedConvId,
      senderType, // 'user' | 'staff'
      senderName,
      content,
      visitorName,
      visitorEmail,
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

    const cleanContent = content.trim();

    // 1. Resolve or Create Conversation
    let conv: any = null;
    if (passedConvId) {
      const res = await sql`
        SELECT * FROM chat_conversations WHERE id = ${Number(passedConvId)} LIMIT 1;
      `;
      conv = res[0];
    } else if (sessionId) {
      const res = await sql`
        SELECT * FROM chat_conversations WHERE session_id = ${sessionId} LIMIT 1;
      `;
      conv = res[0];

      if (!conv) {
        const newConv = await sql`
          INSERT INTO chat_conversations (session_id, visitor_name, visitor_email, status, last_message, last_message_at)
          VALUES (${sessionId}, ${visitorName || 'Website Visitor'}, ${visitorEmail || null}, 'ai_active', ${cleanContent}, NOW())
          RETURNING *;
        `;
        conv = newConv[0];
      }
    }

    if (!conv) {
      return NextResponse.json({ error: 'Unable to identify conversation' }, { status: 400 });
    }

    // 2. Check if Staff is currently Online
    const presenceRows = await sql`
      SELECT is_online, staff_name,
             CASE
               WHEN is_online = true AND last_heartbeat > (NOW() - INTERVAL '40 seconds') THEN true
               ELSE false
             END as active_now
      FROM chat_presence
      WHERE id = 'support_staff'
      LIMIT 1;
    `;
    const isStaffOnline = Boolean(presenceRows[0]?.active_now);
    const currentStaffName = presenceRows[0]?.staff_name || 'Support Desk';

    // 3. Handle STAFF sending a message
    if (senderType === 'staff') {
      const effectiveSenderName = (senderName && String(senderName).trim()) || currentStaffName || 'Support Staff';

      const staffMsgRows = await sql`
        INSERT INTO chat_messages (conversation_id, sender_type, sender_name, content, is_read, created_at)
        VALUES (${conv.id}, 'staff', ${effectiveSenderName}, ${cleanContent}, false, NOW())
        RETURNING *;
      `;

      await sql`
        UPDATE chat_conversations
        SET status = 'staff_active',
            unread_user = unread_user + 1,
            last_message = ${cleanContent},
            last_message_at = NOW(),
            updated_at = NOW()
        WHERE id = ${conv.id};
      `;

      // Keep chat_presence staff_name in sync with the active replying agent
      await sql`
        INSERT INTO chat_presence (id, staff_name, is_online, last_heartbeat, updated_at)
        VALUES ('support_staff', ${effectiveSenderName}, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE
        SET staff_name = ${effectiveSenderName},
            is_online = true,
            last_heartbeat = NOW(),
            updated_at = NOW();
      `;

      return NextResponse.json({
        success: true,
        message: staffMsgRows[0],
        isStaffOnline: true,
        staffName: effectiveSenderName,
        aiReplied: false,
      });
    }

    // 4. Handle USER sending a message
    // Save user message first
    const userMsgRows = await sql`
      INSERT INTO chat_messages (conversation_id, sender_type, sender_name, content, is_read, created_at)
      VALUES (${conv.id}, 'user', ${senderName || conv.visitor_name || 'Visitor'}, ${cleanContent}, false, NOW())
      RETURNING *;
    `;

    // Only pause the AI if human staff has actively claimed and taken over this specific conversation
    const isHumanActivelyEngaged = conv.status === 'staff_active';

    if (isHumanActivelyEngaged) {
      await sql`
        UPDATE chat_conversations
        SET unread_admin = unread_admin + 1,
            last_message = ${cleanContent},
            last_message_at = NOW(),
            updated_at = NOW()
        WHERE id = ${conv.id};
      `;

      return NextResponse.json({
        success: true,
        message: userMsgRows[0],
        isStaffOnline: true,
        staffName: currentStaffName,
        aiReplied: false,
      });
    }

    // AI Assistant (Stephanie) answers the visitor immediately!
    const historyRows = await sql`
      SELECT sender_type, content
      FROM chat_messages
      WHERE conversation_id = ${conv.id}
      ORDER BY created_at ASC
      LIMIT 12;
    `;

    const aiReplyText = await generateChatbotReply(
      historyRows.map((r: any) => ({ sender_type: r.sender_type, content: r.content })),
      cleanContent
    );

    // Save AI reply to database
    const aiMsgRows = await sql`
      INSERT INTO chat_messages (conversation_id, sender_type, sender_name, content, is_read, created_at)
      VALUES (${conv.id}, 'ai', 'Stephanie (VOF AI Assistant)', ${aiReplyText}, false, NOW())
      RETURNING *;
    `;

    // Update conversation record
    await sql`
      UPDATE chat_conversations
      SET status = 'ai_active',
          unread_admin = unread_admin + 1,
          unread_user = unread_user + 1,
          last_message = ${aiReplyText},
          last_message_at = NOW(),
          updated_at = NOW()
      WHERE id = ${conv.id};
    `;

    return NextResponse.json({
      success: true,
      message: userMsgRows[0],
      aiMessage: aiMsgRows[0],
      isStaffOnline: isStaffOnline,
      staffName: currentStaffName,
      aiReplied: true,
    });
  } catch (error: any) {
    console.error('Error in POST /api/chat/messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
