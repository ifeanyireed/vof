'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wallet,
  HeartHandshake,
  DollarSign,
  GraduationCap,
  Building2,
  Target,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { canAccessTab } from '@/lib/auth';
import { formatApplicationDate } from '@/lib/dateUtils';

export default function OverviewView() {
  const {
    currentUser,
    stats,
    donations,
    projects,
    scholarships,
    skills,
    accounts,
    finSummary,
    formatMoney,
    getRecordCountry,
    renderCountryBadge,
    setIsProjectModalOpen,
    setEditingProject,
    setProjectFormData,
    setIsDonationModalOpen,
    setIsTxModalOpen,
    setIsBlogModalOpen,
    setEditingBlog,
    setBlogFormData,
    navigateToTab,
  } = useAdmin();

  const hasApplicationsAccess = canAccessTab(currentUser?.role || '', 'applications');
  const hasDonationsAccess = canAccessTab(currentUser?.role || '', 'donations');
  const hasFinancialsAccess = canAccessTab(currentUser?.role || '', 'financials');
  const hasBlogsAccess = canAccessTab(currentUser?.role || '', 'blogs');
  const hasProjectsAccess = canAccessTab(currentUser?.role || '', 'projects');

  const pendingApplicationsCount = (stats?.pendingScholarships || 0) + (stats?.pendingSkillApps || 0);

  const recentApplications = React.useMemo(() => {
    const list: Array<{
      id: number;
      name: string;
      email: string;
      type: 'Scholarship' | 'VOIE Skills';
      details: string;
      status: string;
      createdAt?: string;
      country: 'Nigeria' | 'Rwanda' | 'USA';
    }> = [];

    scholarships.slice(0, 4).forEach((s) => {
      list.push({
        id: s.id!,
        name: s.applicantName,
        email: s.email,
        type: 'Scholarship',
        details: `${s.institutionName} • ${s.courseOfStudy}`,
        status: s.status,
        createdAt: s.createdAt,
        country: getRecordCountry(s),
      });
    });

    skills.slice(0, 4).forEach((k) => {
      list.push({
        id: k.id!,
        name: k.applicantName,
        email: k.email,
        type: 'VOIE Skills',
        details: `Trade: ${k.tradeSelected} • Batch ${k.intakeBatch}`,
        status: k.status,
        createdAt: k.createdAt,
        country: getRecordCountry(k),
      });
    });

    return list
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 4);
  }, [scholarships, skills, getRecordCountry]);

  return (
            <div className="space-y-6">
              {/* Primary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Raised (NGN)</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {formatMoney(stats?.totalFundsRaisedNGN || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-emerald-600 font-semibold">{stats?.totalDonationsCount || 0}</span> confirmed contributions
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">USD / Diaspora Gifts</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {formatMoney(stats?.totalFundsRaisedUSD || 0, 'USD')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Zelle & International wire transfers
                  </p>
                </div>

                <div
                  onClick={() => hasProjectsAccess && navigateToTab('projects')}
                  className={`bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden transition ${
                    hasProjectsAccess ? 'cursor-pointer hover:border-[#558b1a] hover:shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {stats?.activeProjectsCount || projects.length}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      VOIE center, health & food relief
                    </p>
                    {hasProjectsAccess && (
                      <span className="text-xs text-[#558b1a] font-bold">
                        View &rarr;
                      </span>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => hasApplicationsAccess && navigateToTab('applications')}
                  className={`bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden transition ${
                    hasApplicationsAccess ? 'cursor-pointer hover:border-[#558b1a] hover:shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Applications</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {pendingApplicationsCount}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      Needs review & interview scheduling
                    </p>
                    {hasApplicationsAccess && (
                      <span className="text-xs text-[#558b1a] font-bold">
                        Review &rarr;
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Balances / Applications Intake & Projects Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {hasFinancialsAccess ? (
                  /* Bank Balances Widget */
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#558b1a]" />
                        Verified Treasury Accounts
                      </h3>
                      <button
                        onClick={() => navigateToTab('financials')}
                        className="text-xs text-[#558b1a] hover:underline font-semibold"
                      >
                        View Ledger
                      </button>
                    </div>

                    <div className="space-y-3">
                      {accounts.map((acc) => (
                        <div key={acc.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-900">{acc.accountName}</p>
                            <p className="text-[11px] text-gray-500">{acc.bankName} • {acc.accountNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-gray-900">{formatMoney(acc.balance, acc.currency)}</p>
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold uppercase">
                              {acc.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center text-xs text-gray-600">
                      <span>Total Liquid Capital (NGN):</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formatMoney(stats?.totalAccountBalanceNGN || 0, 'NGN')}
                      </span>
                    </div>
                  </div>
                ) : hasApplicationsAccess ? (
                  /* Applications Review Intake Widget for Content Editors */
                  <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#558b1a]" />
                        Applications Review Intake
                      </h3>
                      <button
                        onClick={() => navigateToTab('applications')}
                        className="text-xs text-[#558b1a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div
                        onClick={() => navigateToTab('applications')}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            🎓
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">Scholarship Aid</p>
                            <p className="text-[11px] text-gray-500">{scholarships.length} Submissions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                            {stats?.pendingScholarships || scholarships.filter((s) => s.status === 'pending').length} Pending
                          </span>
                        </div>
                      </div>

                      <div
                        onClick={() => navigateToTab('applications')}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-blue-50/40 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                            🛠️
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">VOIE Skills Intake</p>
                            <p className="text-[11px] text-gray-500">{skills.length} Trainees</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                            {stats?.pendingSkillApps || skills.filter((k) => k.status === 'pending').length} Pending
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center text-xs text-gray-600">
                      <span>Total Inflow to Review:</span>
                      <span className="font-bold text-[#558b1a] text-sm">
                        {scholarships.length + skills.length} Candidates
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Live Charity Projects Progress */}
                <div className={`${hasFinancialsAccess || hasApplicationsAccess ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4`}>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#558b1a]" />
                      Key Projects Funding Progress
                    </h3>
                    <button
                      onClick={() => navigateToTab('projects')}
                      className="text-xs text-[#558b1a] hover:underline font-semibold"
                    >
                      Manage Projects
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.map((proj) => {
                      const pct = Math.min(100, Math.round((proj.raisedAmount / proj.targetAmount) * 100)) || 0;
                      return (
                        <div key={proj.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{proj.title}</h4>
                              <p className="text-xs text-gray-500">{proj.category} • {proj.location}</p>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {pct}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#558b1a] to-[#7cb342] h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Raised: <strong className="text-gray-900">{formatMoney(proj.raisedAmount, proj.currency)}</strong></span>
                            <span>Target: <strong className="text-gray-900">{formatMoney(proj.targetAmount, proj.currency)}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#0c1a05] to-[#152a0d] text-white p-6 rounded-2xl shadow-md space-y-4">
                  <h3 className="font-bold text-base text-[#a1e25e]">Administrative Quick Actions</h3>
                  <p className="text-xs text-gray-300">
                    Directly trigger high-priority foundation actions, review applications, or add new stories.
                  </p>

                  <div className="space-y-2 pt-2">
                    {hasBlogsAccess && (
                      <button
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogFormData({
                            title: '',
                            slug: '',
                            category: 'Education Support',
                            region: 'NIGERIA',
                            excerpt: '',
                            content: '',
                            authorName: 'Rev. Fr. Charles Onyeneke',
                            authorRole: 'Founder / President',
                            authorAvatar: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg',
                            readTime: '4 min read',
                            dateDisplay: 'September 2026',
                            day: '20',
                            month: 'SEP',
                            likes: 50,
                            status: 'published',
                            imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
                          });
                          setIsBlogModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Publish New Blog Story
                      </button>
                    )}

                    {hasApplicationsAccess && (
                      <button
                        onClick={() => navigateToTab('applications')}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        Applications Review ({pendingApplicationsCount} Pending)
                      </button>
                    )}

                    {hasDonationsAccess && (
                      <button
                        onClick={() => setIsDonationModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <HeartHandshake className="w-4 h-4 text-emerald-400" />
                        Record Direct Transfer / Donation
                      </button>
                    )}

                    {hasFinancialsAccess && (
                      <button
                        onClick={() => setIsTxModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Wallet className="w-4 h-4 text-amber-400" />
                        Log Financial Inflow / Outflow
                      </button>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table: Donations or Applications Review Queue */}
                {hasDonationsAccess ? (
                  /* Recent Donations Table */
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-rose-500" />
                        Recent Donations Log
                      </h3>
                      <button
                        onClick={() => navigateToTab('donations')}
                        className="text-xs text-[#558b1a] hover:underline font-semibold cursor-pointer"
                      >
                        View All ({donations.length})
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {donations.slice(0, 4).map((d) => (
                        <div key={d.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{d.donorName}</p>
                            <p className="text-xs text-gray-500">{d.campaign} • {d.paymentMethod}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-emerald-700">{formatMoney(d.amount, d.currency)}</p>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {new Date(d.donatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : hasApplicationsAccess ? (
                  /* Recent Applications Review Queue Table (for Content Editors) */
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-amber-500" />
                        Applications Review Queue
                      </h3>
                      <button
                        onClick={() => navigateToTab('applications')}
                        className="text-xs text-[#558b1a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Review All ({scholarships.length + skills.length})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {recentApplications.map((app) => {
                        const appDate = formatApplicationDate(app.createdAt);
                        return (
                          <div key={`${app.type}-${app.id}`} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-gray-900 truncate">{app.name}</p>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    app.type === 'Scholarship'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {app.type}
                                </span>
                                {renderCountryBadge(app.country)}
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{app.details}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                              <span className="text-[10px] text-gray-400 font-mono">
                                {appDate.date}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  app.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : app.status === 'under_review' || app.status === 'interview_scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : app.status === 'approved' || app.status === 'enrolled'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {app.status.replace('_', ' ')}
                              </span>
                              <button
                                onClick={() => navigateToTab('applications')}
                                className="text-xs px-2.5 py-1 rounded-lg bg-[#558b1a]/10 hover:bg-[#558b1a] text-[#558b1a] hover:text-white font-semibold transition cursor-pointer"
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {recentApplications.length === 0 && (
                        <p className="py-6 text-center text-xs text-gray-500">
                          No applications currently awaiting review.
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
  );
}
