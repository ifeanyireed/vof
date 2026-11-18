import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import {
  isBot,
  maskIp,
  parseDeviceType,
  parseOS,
  parseBrowser,
  extractDomain,
  getCountryName,
} from '@/lib/analytics-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Exclude Admin Users if vof_admin_token is present
    const adminToken = req.cookies.get('vof_admin_token')?.value;
    if (adminToken) {
      return NextResponse.json({ ok: true, ignored: 'admin' });
    }

    // 2. Parse body
    const body = await req.json().catch(() => ({}));
    const {
      sessionId,
      visitorId,
      path = '/',
      title = '',
      referrer = '',
      utmSource = '',
      utmMedium = '',
      utmCampaign = '',
      utmContent = '',
      screenWidth = 0,
      screenHeight = 0,
      duration = 0,
      isHeartbeat = false,
      isFirstVisit = false,
      clientTimezone = '',
    } = body;

    if (!sessionId || !visitorId) {
      return NextResponse.json({ ok: false, error: 'Missing session or visitor identifiers' }, { status: 400 });
    }

    // 3. Extract User Agent & Check Bot Filter
    const userAgent = req.headers.get('user-agent') || '';
    if (isBot(userAgent)) {
      return NextResponse.json({ ok: true, ignored: 'bot' });
    }

    // 4. IP Masking
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      '';
    const ipMasked = maskIp(rawIp);

    // 5. Geolocation Resolution
    let country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || '';
    let region = req.headers.get('x-vercel-ip-country-region') || '';
    let city = req.headers.get('x-vercel-ip-city') || '';

    // Development/Local Fallback based on client timezone
    if (!country || country === 'XX') {
      if (clientTimezone?.includes('Lagos') || clientTimezone?.includes('Africa')) {
        country = 'NG';
        city = city || 'Lagos';
      } else if (clientTimezone?.includes('New_York') || clientTimezone?.includes('America')) {
        country = 'US';
        city = city || 'New York';
      } else if (clientTimezone?.includes('London') || clientTimezone?.includes('Europe/London')) {
        country = 'GB';
        city = city || 'London';
      } else if (clientTimezone?.includes('Kigali')) {
        country = 'RW';
        city = city || 'Kigali';
      } else {
        country = country || 'NG';
      }
    }

    const countryName = getCountryName(country);
    const deviceType = parseDeviceType(userAgent);
    const os = parseOS(userAgent);
    const browser = parseBrowser(userAgent);
    const referrerDomain = extractDomain(referrer);
    const resolution = screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : null;

    if (isHeartbeat) {
      // Periodic heartbeat or page exit: update session duration and exit path
      await sql`
        UPDATE analytics_sessions
        SET 
          duration_seconds = GREATEST(duration_seconds, ${Math.round(duration)}),
          exit_path = ${path},
          last_seen = NOW()
        WHERE session_id = ${sessionId};
      `;
      return NextResponse.json({ ok: true, updated: 'heartbeat' });
    }

    // Record individual pageview
    await sql`
      INSERT INTO analytics_pageviews (
        session_id, visitor_id, path, title, referrer, referrer_domain,
        utm_source, utm_medium, utm_campaign, utm_content,
        country, country_name, region, city,
        device_type, os, browser, screen_resolution, ip_masked, is_first_visit,
        created_at
      ) VALUES (
        ${sessionId}, ${visitorId}, ${path}, ${title}, ${referrer || null}, ${referrerDomain},
        ${utmSource || null}, ${utmMedium || null}, ${utmCampaign || null}, ${utmContent || null},
        ${country}, ${countryName}, ${region || null}, ${city || null},
        ${deviceType}, ${os}, ${browser}, ${resolution}, ${ipMasked}, ${Boolean(isFirstVisit)},
        NOW()
      );
    `;

    // Upsert session
    await sql`
      INSERT INTO analytics_sessions (
        session_id, visitor_id, entry_path, exit_path, page_count, duration_seconds,
        country, country_name, city, device_type, os, browser, referrer_domain,
        utm_source, utm_medium, utm_campaign, first_seen, last_seen
      ) VALUES (
        ${sessionId}, ${visitorId}, ${path}, ${path}, 1, 0,
        ${country}, ${countryName}, ${city || null}, ${deviceType}, ${os}, ${browser}, ${referrerDomain},
        ${utmSource || null}, ${utmMedium || null}, ${utmCampaign || null}, NOW(), NOW()
      )
      ON CONFLICT (session_id) DO UPDATE SET
        exit_path = EXCLUDED.exit_path,
        page_count = analytics_sessions.page_count + 1,
        last_seen = NOW();
    `;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Analytics tracking error:', err);
    // Return ok: true so client navigation is never blocked or alerted
    return NextResponse.json({ ok: false, error: err?.message || 'Tracking failed' }, { status: 200 });
  }
}
