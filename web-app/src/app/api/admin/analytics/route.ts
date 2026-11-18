import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/server-auth';
import { canAccessTab } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize admin
    const currentUser = await getAuthUserFromRequest(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    if (!canAccessTab(currentUser.role, 'analytics' as any)) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions for traffic analytics' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '7d';

    // Calculate time threshold
    let intervalStr = '7 days';
    let truncFormat = 'day';

    if (range === 'today') {
      intervalStr = '1 day';
      truncFormat = 'hour';
    } else if (range === '24h') {
      intervalStr = '24 hours';
      truncFormat = 'hour';
    } else if (range === '7d') {
      intervalStr = '7 days';
      truncFormat = 'day';
    } else if (range === '30d') {
      intervalStr = '30 days';
      truncFormat = 'day';
    } else if (range === '90d') {
      intervalStr = '90 days';
      truncFormat = 'day';
    }

    // 2. Query Active Users (active within the last 1 hour)
    const liveUsersRows = await sql`
      SELECT COUNT(DISTINCT visitor_id)::int AS count
      FROM analytics_sessions
      WHERE last_seen >= NOW() - INTERVAL '1 hour';
    `;
    const liveUsersCount = liveUsersRows[0]?.count || 0;

    // 3. Query Key Stats within Time Range
    const statsQuery = await sql.query(`
      SELECT 
        (SELECT COUNT(*)::int FROM analytics_pageviews WHERE created_at >= NOW() - INTERVAL '${intervalStr}') AS total_pageviews,
        (SELECT COUNT(DISTINCT visitor_id)::int FROM analytics_pageviews WHERE created_at >= NOW() - INTERVAL '${intervalStr}') AS unique_visitors,
        (SELECT COUNT(*)::int FROM analytics_sessions WHERE first_seen >= NOW() - INTERVAL '${intervalStr}') AS total_sessions,
        (SELECT COALESCE(AVG(duration_seconds), 0)::int FROM analytics_sessions WHERE first_seen >= NOW() - INTERVAL '${intervalStr}') AS avg_duration,
        (SELECT 
           CASE WHEN COUNT(*) > 0 
                THEN ROUND((COUNT(*) FILTER (WHERE page_count = 1)::numeric / COUNT(*)::numeric) * 100, 1) 
                ELSE 0 
           END
         FROM analytics_sessions WHERE first_seen >= NOW() - INTERVAL '${intervalStr}') AS bounce_rate
    `);
    const stats = statsQuery[0] || {
      total_pageviews: 0,
      unique_visitors: 0,
      total_sessions: 0,
      avg_duration: 0,
      bounce_rate: 0,
    };

    // 4. Query Time Series Chart Data
    const timeseriesRows = await sql.query(`
      SELECT 
        DATE_TRUNC('${truncFormat}', created_at) AS time_bucket,
        COUNT(*)::int AS pageviews,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_pageviews
      WHERE created_at >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY time_bucket
      ORDER BY time_bucket ASC;
    `);

    // 5. Query Top Visited Pages
    const topPages = await sql.query(`
      SELECT 
        path,
        COUNT(*)::int AS views,
        COUNT(DISTINCT visitor_id)::int AS unique_visitors
      FROM analytics_pageviews
      WHERE created_at >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10;
    `);

    // 6. Query Traffic Referrers & Acquisition
    const referrers = await sql.query(`
      SELECT 
        COALESCE(referrer_domain, 'Direct') AS domain,
        COUNT(*)::int AS views,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_pageviews
      WHERE created_at >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY domain
      ORDER BY views DESC
      LIMIT 8;
    `);

    // 7. Query Geographic Distribution (Countries)
    const countries = await sql.query(`
      SELECT 
        COALESCE(country, 'NG') AS country_code,
        COALESCE(country_name, 'Nigeria') AS country_name,
        COUNT(DISTINCT visitor_id)::int AS visitors,
        COUNT(*)::int AS pageviews
      FROM analytics_pageviews
      WHERE created_at >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY country_code, country_name
      ORDER BY visitors DESC
      LIMIT 8;
    `);

    // 8. Query Top Cities
    const cities = await sql.query(`
      SELECT 
        city,
        COALESCE(country, 'NG') AS country_code,
        COUNT(DISTINCT visitor_id)::int AS visitors
      FROM analytics_pageviews
      WHERE created_at >= NOW() - INTERVAL '${intervalStr}'
        AND city IS NOT NULL AND city != ''
      GROUP BY city, country_code
      ORDER BY visitors DESC
      LIMIT 8;
    `);

    // 9. Query Device Breakdown
    const devices = await sql.query(`
      SELECT 
        COALESCE(device_type, 'desktop') AS device,
        COUNT(*)::int AS count
      FROM analytics_sessions
      WHERE first_seen >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY device
      ORDER BY count DESC;
    `);

    // 10. Query Browsers
    const browsers = await sql.query(`
      SELECT 
        COALESCE(browser, 'Other') AS browser,
        COUNT(*)::int AS count
      FROM analytics_sessions
      WHERE first_seen >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 6;
    `);

    // 11. Query Operating Systems
    const osRows = await sql.query(`
      SELECT 
        COALESCE(os, 'Other') AS os,
        COUNT(*)::int AS count
      FROM analytics_sessions
      WHERE first_seen >= NOW() - INTERVAL '${intervalStr}'
      GROUP BY os
      ORDER BY count DESC
      LIMIT 6;
    `);

    // 12. Query Recent Visitor Sessions (Feed)
    const recentVisitors = await sql.query(`
      SELECT 
        session_id AS "sessionId",
        visitor_id AS "visitorId",
        entry_path AS "entryPath",
        exit_path AS "exitPath",
        page_count AS "pageCount",
        duration_seconds AS "durationSeconds",
        country,
        country_name AS "countryName",
        city,
        device_type AS "deviceType",
        os,
        browser,
        referrer_domain AS "referrerDomain",
        first_seen AS "firstSeen",
        last_seen AS "lastSeen"
      FROM analytics_sessions
      ORDER BY last_seen DESC
      LIMIT 40;
    `);

    return NextResponse.json({
      range,
      liveUsersCount,
      stats: {
        totalPageviews: Number(stats.total_pageviews || 0),
        uniqueVisitors: Number(stats.unique_visitors || 0),
        totalSessions: Number(stats.total_sessions || 0),
        avgDuration: Number(stats.avg_duration || 0),
        bounceRate: Number(stats.bounce_rate || 0),
      },
      timeseries: timeseriesRows,
      topPages,
      referrers,
      countries,
      cities,
      devices,
      browsers,
      operatingSystems: osRows,
      recentVisitors,
    });
  } catch (err: any) {
    console.error('Failed to fetch analytics:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}
