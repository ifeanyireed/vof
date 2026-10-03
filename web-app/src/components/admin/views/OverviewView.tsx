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
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function OverviewView() {
  const {
    stats,
    donations,
    projects,
    scholarships,
    skills,
    accounts,
    finSummary,
    formatMoney,
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

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {stats?.activeProjectsCount || projects.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    VOIE center, health & food relief
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Applications</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {(stats?.pendingScholarships || 0) + (stats?.pendingSkillApps || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Needs review & interview scheduling
                  </p>
                </div>
              </div>

              {/* Bank Balances & Projects Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bank Balances Widget */}
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

                {/* Live Charity Projects Progress */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
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

              {/* Quick Actions & Recent Donations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#0c1a05] to-[#152a0d] text-white p-6 rounded-2xl shadow-md space-y-4">
                  <h3 className="font-bold text-base text-[#a1e25e]">Administrative Quick Actions</h3>
                  <p className="text-xs text-gray-300">
                    Directly trigger high-priority foundation actions, log donations, or add new stories.
                  </p>

                  <div className="space-y-2 pt-2">
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
                      className="w-full py-2.5 px-4 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Publish New Blog Story
                    </button>

                    <button
                      onClick={() => setIsDonationModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <HeartHandshake className="w-4 h-4 text-emerald-400" />
                      Record Direct Transfer / Donation
                    </button>

                    <button
                      onClick={() => setIsTxModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-4 h-4 text-amber-400" />
                      Log Financial Inflow / Outflow
                    </button>
                  </div>
                </div>

                {/* Recent Donations Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-rose-500" />
                      Recent Donations Log
                    </h3>
                    <button
                      onClick={() => navigateToTab('donations')}
                      className="text-xs text-[#558b1a] hover:underline font-semibold"
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
              </div>
            </div>
  );
}
