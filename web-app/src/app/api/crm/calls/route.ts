import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapCallRow } from '@/lib/crm-db';
import { computeCallScore } from '@/lib/crm-types';

export const dynamic = 'force-dynamic';

const CONNECTED_OUTCOMES = new Set([
  'CONNECTED_INTERESTED',
  'CONNECTED_NEGOTIATING',
  'CONNECTED_WON',
  'CONNECTED_FOLLOWUP',
]);

export async function GET() {
  try {
    await ensureCrmTables();
    const rows = await sql`
      SELECT * FROM crm_calls
      ORDER BY called_at DESC, created_at DESC;
    `;
    const calls = rows.map(mapCallRow);

    const todayStr = new Date().toISOString().slice(0, 10);
    const totalCalls = calls.length;
    const connectedCalls = calls.filter((c) => CONNECTED_OUTCOMES.has(c.outcome)).length;
    const positiveCount = calls.filter((c) =>
      ['CONNECTED_INTERESTED', 'CONNECTED_NEGOTIATING', 'CONNECTED_WON'].includes(c.outcome)
    ).length;
    const wonCount = calls.filter((c) => c.outcome === 'CONNECTED_WON').length;
    const totalDur = calls.reduce((sum, c) => sum + (c.durationSeconds || 0), 0);
    const todayCalls = calls.filter((c) => c.calledAt.slice(0, 10) === todayStr).length;
    const highScoreCount = calls.filter((c) => c.score >= 7).length;

    return NextResponse.json({
      calls,
      stats: {
        totalCalls,
        connectedCalls,
        connectRate: totalCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 0,
        positiveCount,
        wonCount,
        avgDurationSec: totalCalls > 0 ? Math.round(totalDur / totalCalls) : 0,
        todayCalls,
        highScoreCount,
      },
    });
  } catch (error: any) {
    console.error('[CRM Calls GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load calls' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const contactName = String(body.contactName || '').trim();
    if (!contactName) {
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });
    }

    const id = makeCrmId('CALL');
    const breakdown = body.scoreBreakdown && typeof body.scoreBreakdown === 'object' ? body.scoreBreakdown : {};
    const score = computeCallScore(breakdown);
    const breakdownJson = JSON.stringify(breakdown);
    const durationSeconds = Math.max(0, Number(body.durationSeconds ?? 0));
    const outcome = String(body.outcome || 'CONNECTED_INTERESTED');

    const rows = await sql`
      INSERT INTO crm_calls (
        id, lead_id, contact_name, organization, phone_number,
        rep_name, rep_email, direction, outcome, duration_seconds,
        score, score_breakdown, notes, followup_date, called_at
      ) VALUES (
        ${id},
        ${body.leadId ? String(body.leadId) : null},
        ${contactName},
        ${String(body.organization || '').trim()},
        ${String(body.phoneNumber || '').trim()},
        ${String(body.repName || 'VOF Staff').trim()},
        ${String(body.repEmail || '').trim().toLowerCase()},
        ${body.direction === 'INBOUND' ? 'INBOUND' : 'OUTBOUND'},
        ${outcome},
        ${durationSeconds},
        ${score},
        ${breakdownJson}::jsonb,
        ${String(body.notes || '').trim()},
        ${String(body.followupDate || '').trim()},
        NOW()
      )
      RETURNING *;
    `;

    // Automatically advance linked lead status if appropriate
    if (body.leadId) {
      const nextStatus =
        outcome === 'CONNECTED_WON'
          ? 'QUALIFIED'
          : outcome === 'CONNECTED_NEGOTIATING'
          ? 'PROPOSAL'
          : outcome === 'CONNECTED_FOLLOWUP'
          ? 'MEETING BOOKED'
          : outcome === 'CONNECTED_INTERESTED'
          ? 'CONTACTED'
          : null;
      if (nextStatus) {
        await sql`
          UPDATE crm_leads
          SET status = CASE WHEN status = 'CONVERTED' THEN status ELSE ${nextStatus} END, updated_at = NOW()
          WHERE id = ${String(body.leadId)};
        `;
      }
    }

    return NextResponse.json({ call: mapCallRow(rows[0]) }, { status: 201 });
  } catch (error: any) {
    console.error('[CRM Calls POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to log call' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_calls WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Call log not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Calls DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete call log' }, { status: 500 });
  }
}
