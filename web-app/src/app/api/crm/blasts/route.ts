import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapBlastLogRow, mapBlastRow } from '@/lib/crm-db';
import { dispatchCrmBlast } from '@/lib/crm-mailer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const blastId = searchParams.get('blastId');
    const includeLogs = searchParams.get('includeLogs') === 'true';

    if (blastId && includeLogs) {
      const logRows = await sql`
        SELECT * FROM crm_email_blast_logs
        WHERE blast_id = ${blastId}
        ORDER BY opened_at DESC NULLS LAST, clicked_at DESC NULLS LAST, created_at DESC;
      `;
      return NextResponse.json({ logs: logRows.map(mapBlastLogRow) });
    }

    const rows = await sql`
      SELECT * FROM crm_email_blasts
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({ blasts: rows.map(mapBlastRow) });
  } catch (error: any) {
    console.error('[CRM Blasts GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load email campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();

    const title = String(body.title || '').trim();
    const subject = String(body.subject || '').trim();
    const contentHtml = String(body.contentHtml || '').trim();
    if (!title || !subject || !contentHtml) {
      return NextResponse.json({ error: 'Campaign title, subject, and email content are required' }, { status: 400 });
    }

    const id = makeCrmId('BLAST');
    const listId = body.listId ? String(body.listId).trim() : null;
    let listName = String(body.listName || '').trim();
    let totalRecipients = 0;

    const recipientIds: string[] = Array.isArray(body.recipientIds)
      ? body.recipientIds.map((r: any) => String(r)).filter(Boolean)
      : [];

    if (listId) {
      const listRows = await sql`SELECT name FROM crm_email_lists WHERE id = ${listId} LIMIT 1;`;
      if (listRows.length > 0 && !listName) {
        listName = listRows[0].name;
      }
      if (recipientIds.length > 0) {
        totalRecipients = recipientIds.length;
      } else {
        const cntRows = await sql`
          SELECT COUNT(*)::int AS cnt FROM crm_email_subscribers
          WHERE list_id = ${listId} AND status = 'SUBSCRIBED';
        `;
        totalRecipients = Number(cntRows[0]?.cnt ?? 0);
      }
    }

    const mode = String(body.mode || 'DRAFT').toUpperCase(); // DRAFT | SCHEDULE | SEND_NOW
    const initialStatus = mode === 'SCHEDULE' ? 'SCHEDULED' : 'DRAFT';
    const scheduledAt = mode === 'SCHEDULE' && body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null;
    const recipientIdsJson = JSON.stringify(recipientIds);

    const rows = await sql`
      INSERT INTO crm_email_blasts (
        id, list_id, list_name, title, subject, preview_text, content_html,
        sender_name, sender_email, sender_profile_id, recipient_ids,
        status, scheduled_at, total_recipients
      ) VALUES (
        ${id},
        ${listId},
        ${listName},
        ${title},
        ${subject},
        ${String(body.previewText || '').trim()},
        ${contentHtml},
        ${String(body.senderName || 'Veronica Onyeneke Foundation').trim()},
        ${String(body.senderEmail || '').trim()},
        ${body.senderProfileId ? String(body.senderProfileId).trim() : null},
        ${recipientIdsJson}::jsonb,
        ${initialStatus},
        ${scheduledAt},
        ${totalRecipients}
      )
      RETURNING *;
    `;

    let blast = mapBlastRow(rows[0]);
    let dispatchResult: any = null;

    if (mode === 'SEND_NOW') {
      try {
        dispatchResult = await dispatchCrmBlast(id);
        const refreshed = await sql`SELECT * FROM crm_email_blasts WHERE id = ${id} LIMIT 1;`;
        if (refreshed.length > 0) blast = mapBlastRow(refreshed[0]);
      } catch (sendErr: any) {
        const refreshed = await sql`SELECT * FROM crm_email_blasts WHERE id = ${id} LIMIT 1;`;
        if (refreshed.length > 0) blast = mapBlastRow(refreshed[0]);
        return NextResponse.json(
          { blast, error: sendErr?.message || 'Campaign saved, but dispatch failed' },
          { status: 422 }
        );
      }
    }

    return NextResponse.json({ blast, dispatchResult }, { status: 201 });
  } catch (error: any) {
    console.error('[CRM Blasts POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to save email campaign' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    // Trigger immediate send / resume failed recipients
    if (body.action === 'send_now' || body.action === 'resume') {
      try {
        const dispatchResult = await dispatchCrmBlast(id);
        const refreshed = await sql`SELECT * FROM crm_email_blasts WHERE id = ${id} LIMIT 1;`;
        return NextResponse.json({
          blast: refreshed.length > 0 ? mapBlastRow(refreshed[0]) : null,
          dispatchResult,
        });
      } catch (err: any) {
        const refreshed = await sql`SELECT * FROM crm_email_blasts WHERE id = ${id} LIMIT 1;`;
        return NextResponse.json(
          {
            blast: refreshed.length > 0 ? mapBlastRow(refreshed[0]) : null,
            error: err?.message || 'Failed to dispatch campaign',
          },
          { status: 422 }
        );
      }
    }

    const title = body.title !== undefined ? String(body.title).trim() : null;
    const subject = body.subject !== undefined ? String(body.subject).trim() : null;
    const previewText = body.previewText !== undefined ? String(body.previewText).trim() : null;
    const contentHtml = body.contentHtml !== undefined ? String(body.contentHtml) : null;
    const listId = body.listId !== undefined ? (body.listId ? String(body.listId) : null) : undefined;
    const listName = body.listName !== undefined ? String(body.listName).trim() : null;
    const senderName = body.senderName !== undefined ? String(body.senderName).trim() : null;
    const senderEmail = body.senderEmail !== undefined ? String(body.senderEmail).trim() : null;
    const senderProfileId =
      body.senderProfileId !== undefined ? (body.senderProfileId ? String(body.senderProfileId) : null) : undefined;
    const recipientIdsJson =
      body.recipientIds !== undefined ? JSON.stringify(Array.isArray(body.recipientIds) ? body.recipientIds : []) : null;
    const status = body.status !== undefined ? String(body.status).trim() : null;
    const scheduledAt =
      body.scheduledAt !== undefined ? (body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null) : undefined;

    const rows = await sql`
      UPDATE crm_email_blasts SET
        title = COALESCE(${title}, title),
        subject = COALESCE(${subject}, subject),
        preview_text = COALESCE(${previewText}, preview_text),
        content_html = COALESCE(${contentHtml}, content_html),
        list_id = CASE WHEN ${listId !== undefined}::boolean THEN ${listId ?? null}::varchar ELSE list_id END,
        list_name = COALESCE(${listName}, list_name),
        sender_name = COALESCE(${senderName}, sender_name),
        sender_email = COALESCE(${senderEmail}, sender_email),
        sender_profile_id = CASE WHEN ${senderProfileId !== undefined}::boolean THEN ${senderProfileId ?? null}::varchar ELSE sender_profile_id END,
        recipient_ids = COALESCE(${recipientIdsJson}::jsonb, recipient_ids),
        status = COALESCE(${status}, status),
        scheduled_at = CASE WHEN ${scheduledAt !== undefined}::boolean THEN ${scheduledAt ?? null}::timestamptz ELSE scheduled_at END,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    return NextResponse.json({ blast: mapBlastRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Blasts PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_email_blasts WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Blasts DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete campaign' }, { status: 500 });
  }
}
