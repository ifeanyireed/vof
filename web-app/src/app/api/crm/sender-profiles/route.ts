import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureCrmTables, makeCrmId, mapSenderProfileRow } from '@/lib/crm-db';
import { createSmtpTransporter, resolveCrmSmtp } from '@/lib/crm-mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCrmTables();
    const rows = await sql`
      SELECT * FROM crm_sender_profiles
      ORDER BY is_default DESC, created_at DESC;
    `;

    const envHost = process.env.SMTP_HOST || '';
    const envUser = process.env.SMTP_USER || process.env.SMTP_USERNAME || '';
    const envPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
    const envFrom = process.env.SMTP_FROM || envUser;

    return NextResponse.json({
      profiles: rows.map(mapSenderProfileRow),
      envSmtp: {
        configured: Boolean(envHost && envUser && envPass),
        host: envHost,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        fromEmail: envFrom,
      },
    });
  } catch (error: any) {
    console.error('[CRM Sender Profiles GET]:', error);
    return NextResponse.json({ error: error.message || 'Failed to load sender profiles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();

    // Action: test SMTP connection / send test email
    if (body.action === 'test') {
      const testEmail = String(body.testEmail || '').trim();
      let smtpConfig = null;

      if (body.profileId) {
        smtpConfig = await resolveCrmSmtp(String(body.profileId));
      } else if (body.host && body.username && body.password) {
        smtpConfig = {
          host: String(body.host).trim(),
          port: Number(body.port) || 587,
          encryption: (body.encryption || 'tls') as 'tls' | 'ssl' | 'none',
          username: String(body.username).trim(),
          password: String(body.password),
          fromName: String(body.fromName || 'Veronica Onyeneke Foundation').trim(),
          fromEmail: String(body.fromEmail || body.username).trim(),
          replyTo: body.replyTo ? String(body.replyTo).trim() : undefined,
        };
      } else {
        smtpConfig = await resolveCrmSmtp('env_default');
      }

      if (!smtpConfig) {
        return NextResponse.json({ error: 'No SMTP configuration found to test' }, { status: 400 });
      }

      const transporter = createSmtpTransporter(smtpConfig);
      await transporter.verify();

      if (testEmail && testEmail.includes('@')) {
        await transporter.sendMail({
          from: `"${smtpConfig.fromName.replace(/"/g, '')}" <${smtpConfig.fromEmail}>`,
          to: testEmail,
          replyTo: smtpConfig.replyTo || smtpConfig.fromEmail,
          subject: '[VOF CRM] SMTP Sender Test Successful',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px;">
              <div style="background:#0c1a05;color:#ffffff;padding:18px 20px;border-radius:12px;margin-bottom:16px;">
                <h2 style="margin:0;font-size:18px;">Veronica Onyeneke Foundation CRM</h2>
                <p style="margin:4px 0 0 0;font-size:12px;color:#a1e25e;">SMTP Sender Verification</p>
              </div>
              <p style="font-size:14px;color:#374151;line-height:1.6;">
                Your SMTP sender profile (<strong>${smtpConfig.fromName} &lt;${smtpConfig.fromEmail}&gt;</strong> via <code>${smtpConfig.host}:${smtpConfig.port}</code>) is verified and ready to send donor and partner email campaigns.
              </p>
            </div>
          `,
        });
        return NextResponse.json({
          success: true,
          message: `Connection verified and test email sent to ${testEmail}`,
        });
      }

      return NextResponse.json({
        success: true,
        message: `SMTP connection to ${smtpConfig.host}:${smtpConfig.port} verified successfully`,
      });
    }

    // Create new sender profile
    const profileName = String(body.profileName || '').trim();
    const host = String(body.host || '').trim();
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    const fromName = String(body.fromName || 'Veronica Onyeneke Foundation').trim();
    const fromEmail = String(body.fromEmail || '').trim();

    if (!profileName || !host || !username || !password || !fromEmail) {
      return NextResponse.json(
        { error: 'Profile name, SMTP host, username, password, and from email are required' },
        { status: 400 }
      );
    }

    const isDefault = Boolean(body.isDefault);
    if (isDefault) {
      await sql`UPDATE crm_sender_profiles SET is_default = FALSE;`;
    }

    const id = makeCrmId('SMTP');
    const rows = await sql`
      INSERT INTO crm_sender_profiles (
        id, profile_name, provider, host, port, encryption,
        username, password, from_name, from_email, reply_to, is_default
      ) VALUES (
        ${id},
        ${profileName},
        ${String(body.provider || 'Custom SMTP').trim()},
        ${host},
        ${Number(body.port) || 587},
        ${String(body.encryption || 'tls').trim()},
        ${username},
        ${password},
        ${fromName},
        ${fromEmail},
        ${String(body.replyTo || '').trim()},
        ${isDefault}
      )
      RETURNING *;
    `;

    return NextResponse.json({ profile: mapSenderProfileRow(rows[0]) }, { status: 201 });
  } catch (error: any) {
    console.error('[CRM Sender Profiles POST]:', error);
    return NextResponse.json({ error: error.message || 'Failed to save sender profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCrmTables();
    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    if (body.isDefault === true) {
      await sql`UPDATE crm_sender_profiles SET is_default = FALSE;`;
    }

    const profileName = body.profileName !== undefined ? String(body.profileName).trim() : null;
    const provider = body.provider !== undefined ? String(body.provider).trim() : null;
    const host = body.host !== undefined ? String(body.host).trim() : null;
    const port = body.port !== undefined && !isNaN(Number(body.port)) ? Number(body.port) : null;
    const encryption = body.encryption !== undefined ? String(body.encryption).trim() : null;
    const username = body.username !== undefined ? String(body.username).trim() : null;
    const password = body.password && String(body.password).trim() !== '' ? String(body.password) : null;
    const fromName = body.fromName !== undefined ? String(body.fromName).trim() : null;
    const fromEmail = body.fromEmail !== undefined ? String(body.fromEmail).trim() : null;
    const replyTo = body.replyTo !== undefined ? String(body.replyTo).trim() : null;
    const isDefault = body.isDefault !== undefined ? Boolean(body.isDefault) : null;

    const rows = await sql`
      UPDATE crm_sender_profiles SET
        profile_name = COALESCE(${profileName}, profile_name),
        provider = COALESCE(${provider}, provider),
        host = COALESCE(${host}, host),
        port = COALESCE(${port}, port),
        encryption = COALESCE(${encryption}, encryption),
        username = COALESCE(${username}, username),
        password = COALESCE(${password}, password),
        from_name = COALESCE(${fromName}, from_name),
        from_email = COALESCE(${fromEmail}, from_email),
        reply_to = COALESCE(${replyTo}, reply_to),
        is_default = COALESCE(${isDefault}, is_default),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 });
    }
    return NextResponse.json({ profile: mapSenderProfileRow(rows[0]) });
  } catch (error: any) {
    console.error('[CRM Sender Profiles PATCH]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update sender profile' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureCrmTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }
    const rows = await sql`DELETE FROM crm_sender_profiles WHERE id = ${id} RETURNING id;`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[CRM Sender Profiles DELETE]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete sender profile' }, { status: 500 });
  }
}
