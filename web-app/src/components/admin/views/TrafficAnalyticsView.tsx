'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Download,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Compass,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { api, AnalyticsData } from '@/lib/api';
import { getCountryFlag } from '@/lib/analytics-utils';

export default function TrafficAnalyticsView() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('7d');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  const fetchAnalytics = useCallback(async (selectedRange = range, isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await api.getAnalytics(selectedRange);
      setData(res);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.error('Failed to load traffic analytics:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  // Periodic polling: refresh gently every 5 minutes (or manual refresh) to conserve database compute & egress
  useEffect(() => {
    const timer = setInterval(() => {
      fetchAnalytics(range, false);
    }, 300000);
    return () => clearInterval(timer);
  }, [range, fetchAnalytics]);

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return 'Just now';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 30) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getDeviceIcon = (deviceType: string) => {
    const type = (deviceType || '').toLowerCase();
    if (type === 'mobile') return <Smartphone className="w-4 h-4 text-emerald-600" />;
    if (type === 'tablet') return <Tablet className="w-4 h-4 text-amber-600" />;
    return <Laptop className="w-4 h-4 text-blue-600" />;
  };

  const exportVisitorsCsv = () => {
    if (!data?.recentVisitors?.length) return;
    const headers = [
      'Session ID',
      'Visitor ID',
      'Country',
      'City',
      'Device',
      'OS',
      'Browser',
      'Entry Path',
      'Exit Path',
      'Pages Viewed',
      'Duration (sec)',
      'Referrer',
      'First Seen',
      'Last Seen',
    ];

    const rows = data.recentVisitors.map((v) => [
      v.sessionId,
      v.visitorId,
      v.countryName || v.country || 'Unknown',
      v.city || 'Unknown',
      v.deviceType,
      v.os,
      v.browser,
      v.entryPath,
      v.exitPath,
      v.pageCount,
      v.durationSeconds,
      v.referrerDomain,
      v.firstSeen,
      v.lastSeen,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vof_traffic_visitors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVisitors = (data?.recentVisitors || []).filter((v) => {
    if (!visitorSearch.trim()) return true;
    const query = visitorSearch.toLowerCase();
    return (
      v.entryPath?.toLowerCase().includes(query) ||
      v.exitPath?.toLowerCase().includes(query) ||
      v.countryName?.toLowerCase().includes(query) ||
      v.city?.toLowerCase().includes(query) ||
      v.browser?.toLowerCase().includes(query) ||
      v.referrerDomain?.toLowerCase().includes(query)
    );
  });

  // Calculate highest count for relative progress bars
  const maxPageViews = data?.topPages?.length ? Math.max(...data.topPages.map((p) => p.views), 1) : 1;
  const maxReferrerViews = data?.referrers?.length ? Math.max(...data.referrers.map((r) => r.views), 1) : 1;
  const maxCountryVisitors = data?.countries?.length ? Math.max(...data.countries.map((c) => c.visitors), 1) : 1;

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-[#558b1a] animate-spin" />
        <p className="text-gray-500 font-medium">Gathering traffic intelligence and live logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Traffic & Visitor Intelligence</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{data?.liveUsersCount || 0} Active Now</span>
              <span className="text-[10px] text-emerald-600 font-normal">(Last 1 hr)</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Privacy-first real-time tracking with masked IPs and automatic bot/admin exclusions.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Time Range Selector */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
            {[
              { key: 'today', label: 'Today' },
              { key: '24h', label: '24h' },
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setRange(btn.key)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  range === btn.key
                    ? 'bg-white text-gray-900 shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(range, true)}
            disabled={refreshing}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition flex items-center justify-center disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#558b1a]' : ''}`} />
          </button>

          {/* Export CSV */}
          <button
            onClick={exportVisitorsCsv}
            disabled={!data?.recentVisitors?.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#558b1a] hover:bg-[#436e14] text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Live Active */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white p-5 rounded-2xl border border-emerald-500/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{data?.liveUsersCount || 0}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Active in the last hour</p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{data?.stats?.uniqueVisitors?.toLocaleString() || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Distinct individuals</p>
        </div>

        {/* Total Pageviews */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pageviews</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{data?.stats?.totalPageviews?.toLocaleString() || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Pages viewed across site</p>
        </div>

        {/* Avg Duration */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg. Time On Site</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{formatDuration(data?.stats?.avgDuration || 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Session engagement</p>
        </div>

        {/* Bounce Rate */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Bounce Rate</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{data?.stats?.bounceRate || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">Single page visits</p>
        </div>
      </div>

      {/* Traffic Volume Timeline (Histogram / Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#558b1a]" />
              Traffic Volume Over Time
            </h3>
            <p className="text-xs text-gray-500">Pageviews and unique visitor trajectory for {range}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-[#558b1a]"></div>
              <span className="text-gray-600 font-medium">Pageviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-gray-600 font-medium">Visitors</span>
            </div>
          </div>
        </div>

        {/* Timeline Bars */}
        {data?.timeseries && data.timeseries.length > 0 ? (
          <div className="pt-4">
            <div className="flex items-end gap-2 h-44 w-full pt-4 overflow-x-auto pb-2">
              {(() => {
                const maxVal = Math.max(...data.timeseries.map((t) => t.pageviews), 1);
                return data.timeseries.map((bucket, idx) => {
                  const viewHeight = Math.max(8, Math.round((bucket.pageviews / maxVal) * 130));
                  const dateLabel = new Date(bucket.time_bucket).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: range === '24h' || range === 'today' ? 'numeric' : undefined,
                  });

                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[28px] max-w-[50px] flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                        <span className="font-bold">{dateLabel}</span>: {bucket.pageviews} views, {bucket.visitors} visitors
                      </div>

                      {/* Bar Stack */}
                      <div className="w-full flex items-end justify-center gap-1">
                        <div
                          style={{ height: `${viewHeight}px` }}
                          className="w-full bg-[#558b1a] rounded-t-sm transition-all duration-300 hover:bg-[#436e14]"
                        ></div>
                      </div>

                      <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">
                        {range === '24h' || range === 'today'
                          ? new Date(bucket.time_bucket).getHours() + ':00'
                          : new Date(bucket.time_bucket).getDate()}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-gray-400 text-xs">
            <p>Traffic events are recording. First trends will graph automatically.</p>
          </div>
        )}
      </div>

      {/* Two Column Grid: Top Pages & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#558b1a]" />
              Top Visited Pages
            </h3>
            <span className="text-xs text-gray-400 font-medium">Views & Depth</span>
          </div>

          <div className="space-y-3">
            {data?.topPages && data.topPages.length > 0 ? (
              data.topPages.map((page, idx) => {
                const percentage = Math.round((page.views / maxPageViews) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium text-gray-800 truncate max-w-[260px] sm:max-w-[340px]">
                        {page.path}
                      </span>
                      <span className="text-gray-500 font-semibold">
                        {page.views.toLocaleString()} <span className="font-normal text-gray-400">views</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#558b1a] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No page views recorded yet in this range.</p>
            )}
          </div>
        </div>

        {/* Acquisition & Referrers */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              Traffic Sources & Referrers
            </h3>
            <span className="text-xs text-gray-400 font-medium">Acquisition Channels</span>
          </div>

          <div className="space-y-3">
            {data?.referrers && data.referrers.length > 0 ? (
              data.referrers.map((ref, idx) => {
                const percentage = Math.round((ref.views / maxReferrerViews) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-800 truncate max-w-[260px]">
                        {ref.domain === 'Direct' ? 'Direct / Bookmarks / App' : ref.domain}
                      </span>
                      <span className="text-gray-500 font-semibold">
                        {ref.views.toLocaleString()} <span className="font-normal text-gray-400">hits</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">Referrals will appear as visitors arrive.</p>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Geographic & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries & Cities */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              Geographic Presence
            </h3>
            <span className="text-xs text-gray-400 font-medium">Top Countries & Cities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Countries list */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Top Countries</p>
              <div className="space-y-2.5">
                {data?.countries && data.countries.length > 0 ? (
                  data.countries.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{getCountryFlag(c.country_code)}</span>
                        <span className="font-medium text-gray-800 truncate">{c.country_name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{c.visitors}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No geo data yet.</p>
                )}
              </div>
            </div>

            {/* Cities list */}
            <div className="sm:border-l sm:pl-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Top Cities</p>
              <div className="space-y-2.5">
                {data?.cities && data.cities.length > 0 ? (
                  data.cities.map((city, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="font-medium text-gray-800 truncate">{city.city}</span>
                      </div>
                      <span className="font-bold text-gray-900">{city.visitors}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Local cities will display here.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Devices, OS & Browsers */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Laptop className="w-4 h-4 text-purple-600" />
              Devices & Technology
            </h3>
            <span className="text-xs text-gray-400 font-medium">Hardware & Browsers</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Device Categories */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Device Form Factors</p>
              <div className="grid grid-cols-3 gap-2">
                {['mobile', 'desktop', 'tablet'].map((dev) => {
                  const match = data?.devices?.find((d) => d.device.toLowerCase() === dev);
                  const count = match?.count || 0;
                  return (
                    <div key={dev} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2">
                      {getDeviceIcon(dev)}
                      <div>
                        <p className="text-[11px] font-bold capitalize text-gray-700">{dev}</p>
                        <p className="text-xs font-black text-gray-900">{count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browsers & OS Badges */}
            <div className="grid grid-cols-2 gap-4 pt-1 border-t">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Top Browsers</p>
                <div className="space-y-1.5">
                  {data?.browsers?.slice(0, 4).map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{b.browser}</span>
                      <span className="font-bold text-gray-900">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Operating Systems</p>
                <div className="space-y-1.5">
                  {data?.operatingSystems?.slice(0, 4).map((o, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{o.os}</span>
                      <span className="font-bold text-gray-900">{o.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live / Recent Visitor Activity Stream Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#558b1a]" />
              Detailed Visitor Feed
            </h3>
            <p className="text-xs text-gray-500">Live stream of the latest 40 user sessions visiting the website</p>
          </div>

          {/* Search in Visitor Feed */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by page, city, referrer..."
              value={visitorSearch}
              onChange={(e) => setVisitorSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#558b1a] w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
                <th className="py-3 px-4 font-bold">Visitor / Location</th>
                <th className="py-3 px-4 font-bold">Device & OS</th>
                <th className="py-3 px-4 font-bold">Entry Page</th>
                <th className="py-3 px-4 font-bold">Acquisition / Source</th>
                <th className="py-3 px-4 font-bold text-center">Pages</th>
                <th className="py-3 px-4 font-bold text-center">Duration</th>
                <th className="py-3 px-4 font-bold text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((session, idx) => (
                  <tr key={session.sessionId || idx} className="hover:bg-gray-50/60 transition">
                    {/* Visitor & Location */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(session.country)}</span>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {session.city ? `${session.city}, ` : ''}
                            {session.countryName || session.country || 'Global'}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            ID: {session.visitorId?.slice(0, 10)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Device & OS */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.deviceType)}
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{session.deviceType}</p>
                          <p className="text-[10px] text-gray-400">
                            {session.os} • {session.browser}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Entry Page */}
                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-mono text-[11px] text-[#558b1a] truncate" title={session.entryPath}>
                        {session.entryPath}
                      </div>
                      {session.exitPath && session.exitPath !== session.entryPath && (
                        <div className="text-[10px] text-gray-400 truncate" title={`Exit: ${session.exitPath}`}>
                          Exit: {session.exitPath}
                        </div>
                      )}
                    </td>

                    {/* Referrer */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {session.referrerDomain === 'Direct' ? 'Direct / Search' : session.referrerDomain}
                      </span>
                    </td>

                    {/* Pages */}
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      {session.pageCount}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-center text-gray-600 font-medium">
                      {formatDuration(session.durationSeconds)}
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-4 text-right whitespace-nowrap text-gray-500 font-medium">
                      {formatTimeAgo(session.lastSeen)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    {visitorSearch ? 'No visitors match your search filter.' : 'Live visitor sessions will appear here as users browse the site.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
