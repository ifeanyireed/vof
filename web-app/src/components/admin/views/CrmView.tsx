'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2,
  Database,
  LayoutGrid,
  Mail,
  PhoneCall,
  Plus,
  RefreshCw,
  Settings,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import type {
  CrmAccount,
  CrmCall,
  CrmCallStats,
  CrmDeal,
  CrmEmailBlast,
  CrmEmailList,
  CrmLead,
  CrmSenderProfile,
  CrmTabId,
  DealStage,
} from '@/lib/crm-types';
import { DEAL_STAGES } from '@/lib/crm-types';
import CrmOverviewTab from '../crm/CrmOverviewTab';
import CrmLeadsTab from '../crm/CrmLeadsTab';
import CrmPipelineTab from '../crm/CrmPipelineTab';
import CrmContactsTab from '../crm/CrmContactsTab';
import CrmCallsTab from '../crm/CrmCallsTab';
import CrmListsTab from '../crm/CrmListsTab';
import CrmBlastsTab from '../crm/CrmBlastsTab';
import CrmSenderSettingsTab from '../crm/CrmSenderSettingsTab';
import CrmSyncModal from '../crm/CrmSyncModal';

const EMPTY_CALL_STATS: CrmCallStats = {
  totalCalls: 0,
  connectedCalls: 0,
  connectRate: 0,
  positiveCount: 0,
  wonCount: 0,
  avgDurationSec: 0,
  todayCalls: 0,
  highScoreCount: 0,
};

export default function CrmView() {
  const { currentUser, adminUsers, showNotification } = useAdmin();

  const [activeTab, setActiveTab] = useState<CrmTabId>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [deals, setDeals] = useState<CrmDeal[]>([]);
  const [accounts, setAccounts] = useState<CrmAccount[]>([]);
  const [calls, setCalls] = useState<CrmCall[]>([]);
  const [callStats, setCallStats] = useState<CrmCallStats>(EMPTY_CALL_STATS);
  const [lists, setLists] = useState<CrmEmailList[]>([]);
  const [blasts, setBlasts] = useState<CrmEmailBlast[]>([]);
  const [senderProfiles, setSenderProfiles] = useState<CrmSenderProfile[]>([]);
  const [envSmtp, setEnvSmtp] = useState({ configured: false, host: '', port: 587, fromEmail: '' });

  // Shared Modals
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [newDealModalOpen, setNewDealModalOpen] = useState(false);
  const [preselectedCallLead, setPreselectedCallLead] = useState<CrmLead | null>(null);
  const [savingDeal, setSavingDeal] = useState(false);

  const [dealForm, setDealForm] = useState({
    title: '',
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    valueDisplay: '₦1,000,000',
    stage: 'QUALIFIED' as DealStage,
    expectedClose: 'Next Month',
    campaignType: 'Scholarship Sponsorship',
    notes: '',
  });

  const loadAllCrmData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [leadsRes, dealsRes, accountsRes, callsRes, listsRes, blastsRes, profilesRes] =
        await Promise.all([
          fetch('/api/crm/leads').then((r) => r.json()).catch(() => null),
          fetch('/api/crm/deals').then((r) => r.json()).catch(() => null),
          fetch('/api/crm/accounts').then((r) => r.json()).catch(() => null),
          fetch('/api/crm/calls').then((r) => r.json()).catch(() => null),
          fetch('/api/crm/lists').then((r) => r.json()).catch(() => null),
          fetch('/api/crm/blasts').then((r) => r.json()).catch(() => null),
          fetch('/api/crm/sender-profiles').then((r) => r.json()).catch(() => null),
        ]);

      if (leadsRes?.leads) setLeads(leadsRes.leads);
      if (dealsRes?.deals) setDeals(dealsRes.deals);
      if (accountsRes?.accounts) setAccounts(accountsRes.accounts);
      if (callsRes?.calls) setCalls(callsRes.calls);
      if (callsRes?.stats) setCallStats(callsRes.stats);
      if (listsRes?.lists) setLists(listsRes.lists);
      if (blastsRes?.blasts) setBlasts(blastsRes.blasts);
      if (profilesRes?.profiles) setSenderProfiles(profilesRes.profiles);
      if (profilesRes?.envSmtp) setEnvSmtp(profilesRes.envSmtp);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllCrmData(false);
  }, [loadAllCrmData]);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.title.trim() || !dealForm.organization.trim()) return;
    setSavingDeal(true);
    try {
      const stageMeta = DEAL_STAGES.find((s) => s.key === dealForm.stage);
      const res = await fetch('/api/crm/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dealForm,
          owner: currentUser?.fullName || 'VOF Partnerships Desk',
          probability: stageMeta?.defaultProbability ?? 50,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create opportunity');
      showNotification('success', 'New fundraising opportunity added to pipeline');
      setNewDealModalOpen(false);
      setDealForm({
        title: '',
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        valueDisplay: '₦1,000,000',
        stage: 'QUALIFIED',
        expectedClose: 'Next Month',
        campaignType: 'Scholarship Sponsorship',
        notes: '',
      });
      await loadAllCrmData(true);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save opportunity');
    } finally {
      setSavingDeal(false);
    }
  };

  const handleDeleteDealFromOverview = async (id: string, title: string) => {
    if (!confirm(`Delete opportunity "${title}"?`)) return;
    try {
      const res = await fetch(`/api/crm/deals?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete opportunity');
      showNotification('success', 'Opportunity deleted');
      await loadAllCrmData(true);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleQuickCallLead = (lead: CrmLead) => {
    setPreselectedCallLead(lead);
    setActiveTab('calls');
  };

  const staffNames = Array.from(
    new Set(
      [currentUser?.fullName, ...adminUsers.map((u) => u.fullName)].filter((v): v is string => Boolean(v))
    )
  );

  const tabs: { id: CrmTabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'leads', label: 'Leads', icon: Target, count: leads.length },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp, count: deals.filter((d) => d.stage !== 'LOST').length },
    { id: 'contacts', label: 'Contacts', icon: Building2, count: accounts.length },
    { id: 'calls', label: 'Calls', icon: PhoneCall, count: calls.length },
    { id: 'lists', label: 'Lists', icon: Users, count: lists.length },
    { id: 'blasts', label: 'Email Blasts', icon: Mail, count: blasts.length },
    { id: 'settings', label: 'Sender SMTP', icon: Settings, count: senderProfiles.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top CRM Command Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#558b1a] inline-block animate-pulse" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                Foundation CRM &amp; Donor Outreach Center
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0] font-bold">
                Donors · Grants · Partnerships · Email Blasts
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage donor &amp; corporate sponsor pipelines, log scored outreach calls, segment mailing lists, and send tracked email campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => loadAllCrmData(true)}
              disabled={refreshing}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer transition"
              title="Refresh CRM records"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#558b1a]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setSyncModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[#d6f0b0] bg-[#f4faec] hover:bg-[#e9f7dc] text-[#558b1a] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Database className="w-3.5 h-3.5" />
              Sync VOF Records
            </button>
            <button
              type="button"
              onClick={() => setNewDealModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              New Opportunity
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-gray-100 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
                  active
                    ? 'bg-[#0c1a05] text-white shadow-xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#a1e25e]' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-white/15 text-[#a1e25e]' : 'bg-white border border-gray-200 text-gray-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-16 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-7 h-7 text-[#558b1a] animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Loading Foundation CRM workspace...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <CrmOverviewTab
              deals={deals}
              leads={leads}
              blasts={blasts}
              lists={lists}
              calls={calls}
              callStats={callStats}
              onNavigateTab={setActiveTab}
              onOpenNewDeal={() => setNewDealModalOpen(true)}
              onOpenSyncModal={() => setSyncModalOpen(true)}
              onDeleteDeal={handleDeleteDealFromOverview}
            />
          )}

          {activeTab === 'leads' && (
            <CrmLeadsTab
              leads={leads}
              staffNames={staffNames}
              currentUserName={currentUser?.fullName || 'VOF Admin'}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
              onOpenSyncModal={() => setSyncModalOpen(true)}
              onQuickCallLead={handleQuickCallLead}
            />
          )}

          {activeTab === 'pipeline' && (
            <CrmPipelineTab
              deals={deals}
              currentUserName={currentUser?.fullName || 'VOF Admin'}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
              onOpenNewDeal={() => setNewDealModalOpen(true)}
            />
          )}

          {activeTab === 'contacts' && (
            <CrmContactsTab
              accounts={accounts}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
            />
          )}

          {activeTab === 'calls' && (
            <CrmCallsTab
              calls={calls}
              stats={callStats}
              leads={leads}
              currentUserName={currentUser?.fullName || 'VOF Staff'}
              currentUserEmail={currentUser?.email || ''}
              preselectedLead={preselectedCallLead}
              onClearPreselectedLead={() => setPreselectedCallLead(null)}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
            />
          )}

          {activeTab === 'lists' && (
            <CrmListsTab
              lists={lists}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
              onOpenSyncModal={() => setSyncModalOpen(true)}
            />
          )}

          {activeTab === 'blasts' && (
            <CrmBlastsTab
              blasts={blasts}
              lists={lists}
              senderProfiles={senderProfiles}
              envSmtpConfigured={envSmtp.configured}
              envSmtpFrom={envSmtp.fromEmail}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
              onOpenSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'settings' && (
            <CrmSenderSettingsTab
              profiles={senderProfiles}
              envSmtp={envSmtp}
              onRefresh={() => loadAllCrmData(true)}
              onNotify={showNotification}
            />
          )}
        </>
      )}

      {/* 1-Click VOF Sync Modal */}
      <CrmSyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        lists={lists}
        onSynced={() => loadAllCrmData(true)}
        onNotify={showNotification}
      />

      {/* New Opportunity Modal */}
      {newDealModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setNewDealModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">New Fundraising Opportunity</h3>
                <p className="text-xs text-gray-500">
                  Track corporate CSR sponsorships, grant proposals, and major donor pledges.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewDealModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  value={dealForm.title}
                  onChange={(e) => setDealForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. 2026 Secondary Scholarship Sponsorship (10 Students)"
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Donor / Sponsor Organization *</label>
                  <input
                    type="text"
                    required
                    value={dealForm.organization}
                    onChange={(e) => setDealForm((p) => ({ ...p, organization: e.target.value }))}
                    placeholder="e.g. Access Bank CSR / Diaspora Circle"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expected Value *</label>
                  <input
                    type="text"
                    required
                    value={dealForm.valueDisplay}
                    onChange={(e) => setDealForm((p) => ({ ...p, valueDisplay: e.target.value }))}
                    placeholder="e.g. ₦2,500,000 or $5,000"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Key Contact Name</label>
                  <input
                    type="text"
                    value={dealForm.contactName}
                    onChange={(e) => setDealForm((p) => ({ ...p, contactName: e.target.value }))}
                    placeholder="e.g. Mrs. Ngozi Adeyemi"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={dealForm.email}
                    onChange={(e) => setDealForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="contact@sponsor.org"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pipeline Stage</label>
                  <select
                    value={dealForm.stage}
                    onChange={(e) => setDealForm((p) => ({ ...p, stage: e.target.value as DealStage }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    {DEAL_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label} — {s.subtitle}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Program Focus</label>
                  <select
                    value={dealForm.campaignType}
                    onChange={(e) => setDealForm((p) => ({ ...p, campaignType: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <option value="Scholarship Sponsorship">Scholarship Sponsorship</option>
                    <option value="VOIE Vocational Training">VOIE Vocational Training</option>
                    <option value="Community Relief Outreach">Community Relief Outreach</option>
                    <option value="Institutional Grant">Institutional Grant</option>
                    <option value="General Endowment">General Endowment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Close Date</label>
                <input
                  type="text"
                  value={dealForm.expectedClose}
                  onChange={(e) => setDealForm((p) => ({ ...p, expectedClose: e.target.value }))}
                  placeholder="e.g. December 2026"
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewDealModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDeal}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingDeal ? 'Saving...' : 'Save Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
