'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return 'vof_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getOrCreateVisitorId(): { id: string; isFirst: boolean } {
  try {
    const existing = localStorage.getItem('vof_vid');
    if (existing) {
      return { id: existing, isFirst: false };
    }
    const newId = generateId();
    localStorage.setItem('vof_vid', newId);
    return { id: newId, isFirst: true };
  } catch {
    return { id: generateId(), isFirst: true };
  }
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem('vof_sid');
    if (existing) {
      return existing;
    }
    const newId = generateId();
    sessionStorage.setItem('vof_sid', newId);
    return newId;
  } catch {
    return generateId();
  }
}

export default function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);
  const sessionStartTime = useRef<number>(Date.now());
  const activeSessionId = useRef<string>('');
  const activeVisitorId = useRef<string>('');

  useEffect(() => {
    // 1. Skip admin routes completely
    if (!pathname || pathname.startsWith('/admin')) {
      return;
    }

    const { id: visitorId, isFirst } = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    activeVisitorId.current = visitorId;
    activeSessionId.current = sessionId;

    const fullPath = searchParams && searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    // Prevent immediate duplicate fires on same path
    if (lastTrackedPath.current === fullPath) {
      return;
    }
    lastTrackedPath.current = fullPath;

    const utmSource = searchParams?.get('utm_source') || '';
    const utmMedium = searchParams?.get('utm_medium') || '';
    const utmCampaign = searchParams?.get('utm_campaign') || '';
    const utmContent = searchParams?.get('utm_content') || '';

    const payload = {
      sessionId,
      visitorId,
      path: fullPath,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
      clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      isFirstVisit: isFirst,
      isHeartbeat: false,
    };

    // Send pageview asynchronously
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/track', blob);
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking fail-safe
    }
  }, [pathname, searchParams]);

  // Resource-efficient session duration tracking (only on tab blur / exit, zero continuous polling)
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    const sendDurationUpdate = () => {
      if (!activeSessionId.current || !activeVisitorId.current) return;
      const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime.current) / 1000));

      const payload = {
        sessionId: activeSessionId.current,
        visitorId: activeVisitorId.current,
        path: pathname,
        duration: durationSeconds,
        isHeartbeat: true,
      };

      try {
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendDurationUpdate();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', sendDurationUpdate);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendDurationUpdate);
    };
  }, [pathname]);

  return null;
}
