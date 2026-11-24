'use client';

import React from 'react';
import {
  ArrowRight,
  Building2,
  Clock,
  DollarSign,
  Mail,
  PhoneCall,
  Plus,
  Send,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import type {
  CrmCall,
  CrmCallStats,
  CrmDeal,
  CrmEmailBlast,
  CrmEmailList,
  CrmLead,
  CrmTabId,
} from '@/lib/crm-types';
import { formatCurrencyAmount, getCallScoreMeta, OUTCOME_CONFIG } from '@/lib/crm-types';

interface CrmOverviewTabProps {
  deals: CrmDeal[];
  leads: CrmLead[];
  blasts: CrmEmailBlast[];
  lists: CrmEmailList[];
  calls: CrmCall[];
  callStats: CrmCallStats;
  onNavigateTab: (tab: CrmTabId) => void;
  onOpenNewDeal: () => void;
  onOpenSyncModal: () => void;
  onDeleteDeal: (id: string, title: string) => void;
}

export default function CrmOverviewTab({
  deals,
  leads,
  blasts,
  lists,
  calls,
  callStats,
  onNavigateTab,
  onOpenNewDeal,
  onOpenSyncModal,
  onDeleteDeal,
}: CrmOverviewTabProps) {
  const openDeals = deals.filter((d) => d.stage !== 'WON' && d.stage !== 'LOST');
  const wonDeals = deals.filter((d) => d.stage === 'WON');
  const activePipelineTotal = openDeals.reduce((sum, d) => sum + (d.valueAmount || 0), 0);
  const wonTotal = wonDeals.reduce((sum, d) => sum + (d.valueAmount || 0), 0);

  const sentBlasts = blasts.filter((b) => b.status === 'SENT');
  const totalSentRecipients = sentBlasts.reduce((sum, b) => sum + (b.sentCount || 0), 0);
  const totalOpens = sentBlasts.reduce((sum, b) => sum + (b.openCount || 0), 0);
  const avgOpenRate = totalSentRecipients > 0 ? Math.round((totalOpens / totalSentRecipients) * 100) : 0;

  const totalSubscribers = lists.reduce((sum, l) => sum + (l.subscriberCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Active Fundraising Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-[#f4faec] text-[#558b1a] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrencyAmount(activePipelineTotal, 'NGN')}</p>
          <p className="text-[11px] text-[#558b1a] font-semibold mt-1">
            {openDeals.length} open · {wonDeals.length} funded ({formatCurrencyAmount(wonTotal, 'NGN')})
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Donor & Partner Leads</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            {leads.filter((l) => l.status === 'QUALIFIED' || l.status === 'MEETING BOOKED').length} qualified ·{' '}
            {leads.filter((l) => l.status === 'CONVERTED').length} converted
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Email Campaigns & Reach</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{blasts.length}</p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            {totalSubscribers.toLocaleString()} subscribers · {avgOpenRate}% open rate
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">Outreach Calls Logged</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{callStats.totalCalls}</p>
          <p className="text-[11px] text-sky-600 font-semibold mt-1">
            {callStats.connectRate}% connect rate · {callStats.highScoreCount} high-score calls
          </p>
        </div>
      </div>

      {/* Quick Module Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            tab: 'pipeline' as CrmTabId,
            title: 'Fundraising Pipeline',
            desc: 'Visual Kanban tracker for grants, pledges & corporate sponsorships.',
            icon: TrendingUp,
            iconBg: 'bg-sky-50 text-sky-600',
          },
          {
            tab: 'leads' as CrmTabId,
            title: 'Donor & Sponsor Leads',
            desc: 'Track prospects, fit scores, notes & convert directly into opportunities.',
            icon: Target,
            iconBg: 'bg-purple-50 text-purple-600',
          },
          {
            tab: 'blasts' as CrmTabId,
            title: 'Email Campaigns',
            desc: 'Personalized donor updates with open/click tracking & unsubscribe.',
            icon: Send,
            iconBg: 'bg-rose-50 text-rose-600',
          },
          {
            tab: 'lists' as CrmTabId,
            title: 'Audience Lists',
            desc: 'Segment donors, partners & volunteers — sync VOF records in 1 click.',
            icon: Users,
            iconBg: 'bg-[#f4faec] text-[#558b1a]',
          },
        ].map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.tab}
              type="button"
              onClick={() => onNavigateTab(tile.tab)}
              className="text-left bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#558b1a] hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${tile.iconBg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-[#558b1a] flex items-center gap-1">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 mt-3">{tile.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tile.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Split: High-Priority Opportunities + Blasts & Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Pipeline Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900">
                High-Priority Sponsorship & Grant Opportunities
              </h3>
              <p className="text-xs text-gray-500">
                Active donor pledges, corporate CSR proposals, and institutional grants.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenNewDeal}
                className="px-3 py-1.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" /> New Opportunity
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('pipeline')}
                className="text-xs font-bold text-[#558b1a] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Full Kanban <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {deals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#558b1a] mx-auto opacity-60" />
                <p className="text-sm font-bold text-gray-800">No fundraising opportunities yet</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Create your first sponsorship or grant opportunity, or sync existing VOF donors and partners into the CRM.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onOpenNewDeal}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold cursor-pointer"
                  >
                    Add Opportunity
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSyncModal}
                    className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Sync VOF Records
                  </button>
                </div>
              </div>
            ) : (
              deals.slice(0, 5).map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#558b1a]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {deal.id}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{deal.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#558b1a]" />
                        {deal.organization}
                      </span>
                      {deal.contactName && (
                        <>
                          <span>•</span>
                          <span>{deal.contactName}</span>
                        </>
                      )}
                      {deal.expectedClose && (
                        <>
                          <span>•</span>
                          <span>Target: {deal.expectedClose}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#558b1a]">{deal.valueDisplay}</div>
                      <div className="text-[10px] text-gray-400">{deal.probability}% probability</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                        deal.stage === 'WON'
                          ? 'bg-[#f4faec] text-[#558b1a] border-[#d6f0b0]'
                          : deal.stage === 'NEGOTIATION'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : deal.stage === 'PROPOSAL'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {deal.stage}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteDeal(deal.id, deal.title)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete opportunity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Email Blasts & Recent Calls */}
        <div className="space-y-6">
          {/* Email Blasts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-gray-900">Email Blasts Feed</h3>
              <button
                type="button"
                onClick={() => onNavigateTab('blasts')}
                className="text-xs font-bold text-[#558b1a] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                All Blasts <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {blasts.length === 0 ? (
              <div className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                No email campaigns created yet.
              </div>
            ) : (
              blasts.slice(0, 3).map((blast) => (
                <div
                  key={blast.id}
                  onClick={() => onNavigateTab('blasts')}
                  className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#558b1a]/40 transition space-y-2.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        blast.status === 'SENT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : blast.status === 'SCHEDULED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : blast.status === 'FAILED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {blast.status}
                    </span>
                    <span className="text-[11px] text-gray-400 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blast.sentAt
                        ? new Date(blast.sentAt).toLocaleDateString()
                        : blast.scheduledAt
                        ? new Date(blast.scheduledAt).toLocaleDateString()
                        : 'Draft'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{blast.subject}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{blast.title}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">{blast.totalRecipients} recipients</span>
                    {blast.status === 'SENT' ? (
                      <span className="font-bold text-[#558b1a]">
                        {blast.openCount} opens ({Math.round((blast.openCount / Math.max(1, blast.sentCount)) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-gray-400">Ready to send</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Calls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-gray-900">Recent Outreach Calls</h3>
              <button
                type="button"
                onClick={() => onNavigateTab('calls')}
                className="text-xs font-bold text-[#558b1a] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Call Logger <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {calls.length === 0 ? (
              <div className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                No outreach calls logged yet.
              </div>
            ) : (
              calls.slice(0, 3).map((c) => {
                const scoreMeta = getCallScoreMeta(c.score);
                const outcomeMeta = OUTCOME_CONFIG[c.outcome];
                return (
                  <div
                    key={c.id}
                    className="bg-white p-3.5 rounded-2xl border border-gray-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-gray-900 truncate">{c.contactName}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreMeta.className}`}>
                        {c.score}/12
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">
                      {c.organization || c.phoneNumber || 'Direct outreach'}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${outcomeMeta?.pill || 'bg-gray-100 text-gray-600'}`}>
                        {outcomeMeta?.label || c.outcome}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(c.calledAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
