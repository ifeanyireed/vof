'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Code,
  Edit3,
  Eye,
  Mail,
  MousePointer,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import type {
  CrmBlastLog,
  CrmEmailBlast,
  CrmEmailList,
  CrmEmailSubscriber,
  CrmSenderProfile,
} from '@/lib/crm-types';

interface CrmBlastsTabProps {
  blasts: CrmEmailBlast[];
  lists: CrmEmailList[];
  senderProfiles: CrmSenderProfile[];
  envSmtpConfigured: boolean;
  envSmtpFrom: string;
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
  onOpenSettings: () => void;
}

const DEFAULT_VOF_TEMPLATE = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;line-height:1.6;">
  <div style="background:linear-gradient(135deg,#0c1a05 0%,#2f5e17 100%);padding:28px 24px;border-radius:16px 16px 0 0;color:#ffffff;">
    <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1e25e;font-weight:700;">Veronica Onyeneke Foundation</p>
    <h1 style="margin:0;font-size:22px;font-weight:700;">Impact Update &amp; Partnership Invitation</h1>
  </div>
  <div style="background:#ffffff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;">
    <p>Dear {{first_name|Valued Partner}},</p>
    <p>Thank you for standing with the Veronica Onyeneke Foundation as we empower scholars, train youth through VOIE vocational programs, and support vulnerable families across Nigeria.</p>
    <p>We would love to share our latest verified field outreach report with you and {{company|your team}}.</p>
    <p style="margin:24px 0;">
      <a href="https://vonf.org/outreach-reports" style="display:inline-block;background:#558b1a;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;">Read Our Latest Field Reports →</a>
    </p>
    <p style="margin-bottom:0;">With gratitude,<br/><strong>Veronica Onyeneke Foundation Secretariat</strong></p>
  </div>
</div>`;

function renderPreviewHtml(html: string): string {
  return html
    .replace(/\{\{\s*first_name(?:\|[^}]*)?\s*\}\}/gi, 'Adaeze')
    .replace(/\{\{\s*name(?:\|[^}]*)?\s*\}\}/gi, 'Adaeze Nwosu')
    .replace(/\{\{\s*(?:company|organization)(?:\|[^}]*)?\s*\}\}/gi, 'Partner Foundation')
    .replace(/\{\{\s*email(?:\|[^}]*)?\s*\}\}/gi, 'adaeze@example.org')
    .replace(/\{\{\s*unsubscribe_url\s*\}\}/gi, '#unsubscribe');
}

export default function CrmBlastsTab({
  blasts,
  lists,
  senderProfiles,
  envSmtpConfigured,
  envSmtpFrom,
  onRefresh,
  onNotify,
  onOpenSettings,
}: CrmBlastsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Composer Modal
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingBlastId, setEditingBlastId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [listId, setListId] = useState('');
  const [senderProfileId, setSenderProfileId] = useState('');
  const [senderName, setSenderName] = useState('Veronica Onyeneke Foundation');
  const [senderEmail, setSenderEmail] = useState('');
  const [contentHtml, setContentHtml] = useState(DEFAULT_VOF_TEMPLATE);
  const [bodyMode, setBodyMode] = useState<'edit' | 'preview'>('edit');
  const [sendMode, setSendMode] = useState<'SEND_NOW' | 'DRAFT' | 'SCHEDULE'>('SEND_NOW');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);

  // Audience subset selection
  const [listSubs, setListSubs] = useState<CrmEmailSubscriber[]>([]);
  const [recipientMode, setRecipientMode] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);

  // Logs Inspector Modal
  const [inspectBlast, setInspectBlast] = useState<CrmEmailBlast | null>(null);
  const [logs, setLogs] = useState<CrmBlastLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'OPENED' | 'CLICKED' | 'FAILED'>('ALL');
  const [sendingBlastId, setSendingBlastId] = useState<string | null>(null);

  useEffect(() => {
    if (!composerOpen || !listId) {
      setListSubs([]);
      return;
    }
    fetch(`/api/crm/lists/subscribers?listId=${encodeURIComponent(listId)}`)
      .then((r) => r.json())
      .then((d) => setListSubs((d?.subscribers || []).filter((s: CrmEmailSubscriber) => s.status === 'SUBSCRIBED')))
      .catch(() => setListSubs([]));
  }, [composerOpen, listId]);

  const openNewComposer = () => {
    setEditingBlastId(null);
    setTitle('');
    setSubject('');
    setListId(lists[0]?.id || '');
    const defaultProfile = senderProfiles.find((p) => p.isDefault) || senderProfiles[0];
    if (defaultProfile) {
      setSenderProfileId(defaultProfile.id);
      setSenderName(defaultProfile.fromName);
      setSenderEmail(defaultProfile.fromEmail);
    } else {
      setSenderProfileId('env_default');
      setSenderName('Veronica Onyeneke Foundation');
      setSenderEmail(envSmtpFrom || '');
    }
    setContentHtml(DEFAULT_VOF_TEMPLATE);
    setBodyMode('edit');
    setSendMode('SEND_NOW');
    setScheduledAt('');
    setRecipientMode('ALL');
    setSelectedSubIds([]);
    setComposerOpen(true);
  };

  const openEditComposer = (b: CrmEmailBlast) => {
    setEditingBlastId(b.id);
    setTitle(b.title);
    setSubject(b.subject);
    setListId(b.listId || '');
    setSenderProfileId(b.senderProfileId || 'env_default');
    setSenderName(b.senderName || 'Veronica Onyeneke Foundation');
    setSenderEmail(b.senderEmail || '');
    setContentHtml(b.contentHtml || DEFAULT_VOF_TEMPLATE);
    setBodyMode('edit');
    setSendMode(b.status === 'SCHEDULED' ? 'SCHEDULE' : 'DRAFT');
    setScheduledAt(b.scheduledAt ? b.scheduledAt.slice(0, 16) : '');
    setRecipientMode(b.recipientIds?.length ? 'CUSTOM' : 'ALL');
    setSelectedSubIds(b.recipientIds || []);
    setComposerOpen(true);
  };

  const handleSenderProfileChange = (profId: string) => {
    setSenderProfileId(profId);
    const prof = senderProfiles.find((p) => p.id === profId);
    if (prof) {
      setSenderName(prof.fromName);
      setSenderEmail(prof.fromEmail);
    } else if (profId === 'env_default') {
      setSenderName('Veronica Onyeneke Foundation');
      setSenderEmail(envSmtpFrom || '');
    }
  };

  const handleSubmitCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !contentHtml.trim()) {
      onNotify('error', 'Title, subject, and HTML content are required');
      return;
    }
    if (sendMode === 'SEND_NOW' && !listId) {
      onNotify('error', 'Select an audience list before sending');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(editingBlastId ? { id: editingBlastId } : {}),
        title: title.trim(),
        subject: subject.trim(),
        listId: listId || null,
        listName: lists.find((l) => l.id === listId)?.name || '',
        senderProfileId: senderProfileId || null,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        contentHtml,
        recipientIds: recipientMode === 'CUSTOM' ? selectedSubIds : [],
        mode: sendMode,
        scheduledAt: sendMode === 'SCHEDULE' && scheduledAt ? scheduledAt : null,
      };

      const res = await fetch('/api/crm/blasts', {
        method: editingBlastId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        await onRefresh();
        throw new Error(data.error || 'Failed to save campaign');
      }

      // If editing an existing draft and user chose SEND_NOW, trigger dispatch
      if (editingBlastId && sendMode === 'SEND_NOW') {
        const sendRes = await fetch('/api/crm/blasts', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBlastId, action: 'send_now' }),
        });
        const sendData = await sendRes.json();
        if (!sendRes.ok) throw new Error(sendData.error || 'Saved, but dispatch failed');
        onNotify(
          'success',
          `Campaign sent! ${sendData.dispatchResult?.sentCount ?? 0} delivered, ${sendData.dispatchResult?.failedCount ?? 0} failed.`
        );
      } else if (sendMode === 'SEND_NOW' && data.dispatchResult) {
        onNotify(
          'success',
          `Campaign sent! ${data.dispatchResult.sentCount} delivered, ${data.dispatchResult.failedCount} failed.`
        );
      } else {
        onNotify('success', sendMode === 'SCHEDULE' ? 'Campaign scheduled' : 'Campaign draft saved');
      }

      setComposerOpen(false);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Campaign error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendExisting = async (blast: CrmEmailBlast) => {
    if (!confirm(`Send campaign "${blast.title}" to its audience now?`)) return;
    setSendingBlastId(blast.id);
    try {
      const res = await fetch('/api/crm/blasts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blast.id, action: 'send_now' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Dispatch failed');
      onNotify(
        'success',
        `Dispatched "${blast.title}": ${data.dispatchResult?.sentCount ?? 0} sent, ${data.dispatchResult?.failedCount ?? 0} failed.`
      );
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSendingBlastId(null);
    }
  };

  const handleDeleteBlast = async (blast: CrmEmailBlast) => {
    if (!confirm(`Delete campaign "${blast.title}"?`)) return;
    try {
      const res = await fetch(`/api/crm/blasts?id=${encodeURIComponent(blast.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete campaign');
      onNotify('success', 'Campaign deleted');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const openLogsModal = async (blast: CrmEmailBlast) => {
    setInspectBlast(blast);
    setLogFilter('ALL');
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/crm/blasts?blastId=${encodeURIComponent(blast.id)}&includeLogs=true`);
      const data = await res.json();
      setLogs(data?.logs || []);
    } catch {
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handlePromoteLogToLead = async (log: CrmBlastLog) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: log.organization || log.recipientName || log.email,
          contactName: log.recipientName || log.email.split('@')[0],
          contactEmail: log.email,
          category: 'Individual Major Donor',
          fitScore: log.clickCount > 0 ? 90 : 80,
          status: 'CURIOUS',
          source: 'Email Engagement',
          notes: `Engaged with campaign "${inspectBlast?.title || ''}" (${log.openCount} opens, ${log.clickCount} clicks).`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add lead');
      onNotify('success', `Promoted ${log.email} to CRM Leads!`);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const filteredBlasts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blasts.filter((b) => {
      const matchSt = statusFilter === 'ALL' || b.status === statusFilter;
      const matchQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        b.listName.toLowerCase().includes(q);
      return matchSt && matchQ;
    });
  }, [blasts, search, statusFilter]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (logFilter === 'OPENED') return l.openCount > 0;
      if (logFilter === 'CLICKED') return l.clickCount > 0;
      if (logFilter === 'FAILED') return l.status === 'FAILED' || l.status === 'BOUNCED';
      return true;
    });
  }, [logs, logFilter]);

  const hasAnySmtp = senderProfiles.length > 0 || envSmtpConfigured;

  return (
    <div className="space-y-5">
      {!hasAnySmtp && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-amber-900">
            <strong>No SMTP sender configured yet.</strong> Configure an SMTP Sender Profile (Brevo, Gmail, Zoho, or custom SMTP) to dispatch live email campaigns.
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Configure Sender SMTP →
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by title, subject, list..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'SENT', 'SCHEDULED', 'DRAFT', 'FAILED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                statusFilter === st ? 'bg-[#558b1a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            type="button"
            onClick={openNewComposer}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Email Blast
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      {filteredBlasts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-2">
          <Mail className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-800">No email campaigns yet</p>
          <p className="text-xs text-gray-500">
            Launch personalized donor updates, outreach newsletters, and sponsorship appeals with open & click tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBlasts.map((b) => {
            const openPct = b.sentCount > 0 ? Math.round((b.openCount / b.sentCount) * 100) : 0;
            const clickPct = b.sentCount > 0 ? Math.round((b.clickCount / b.sentCount) * 100) : 0;
            return (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-gray-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        b.status === 'SENT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.status === 'SCHEDULED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : b.status === 'FAILED'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {b.status}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900">{b.title}</h4>
                    {b.listName && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-[#f4faec] text-[#558b1a] font-semibold">
                        List: {b.listName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    Subject: <strong className="text-gray-800">{b.subject}</strong>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 pt-1">
                    <span>From: {b.senderName} {b.senderEmail ? `<${b.senderEmail}>` : ''}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {b.sentAt
                        ? `Sent ${new Date(b.sentAt).toLocaleString()}`
                        : b.scheduledAt
                        ? `Scheduled ${new Date(b.scheduledAt).toLocaleString()}`
                        : `Created ${new Date(b.createdAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                {/* Metrics + Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {b.sentCount}/{b.totalRecipients}
                      </span>
                      <span className="text-[10px] text-gray-400">Sent</span>
                    </div>
                    <div className="w-px h-6 bg-stone-200" />
                    <div>
                      <span className="text-xs font-bold text-[#558b1a] block">
                        {b.openCount} ({openPct}%)
                      </span>
                      <span className="text-[10px] text-gray-400">Opens</span>
                    </div>
                    <div className="w-px h-6 bg-stone-200" />
                    <div>
                      <span className="text-xs font-bold text-sky-600 block">
                        {b.clickCount} ({clickPct}%)
                      </span>
                      <span className="text-[10px] text-gray-400">Clicks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {b.status !== 'SENT' && (
                      <button
                        type="button"
                        disabled={sendingBlastId === b.id}
                        onClick={() => handleSendExisting(b)}
                        className="px-3 py-1.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {sendingBlastId === b.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        Send
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openLogsModal(b)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      title="Inspect delivery & opens"
                    >
                      <Eye className="w-3.5 h-3.5" /> Logs
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditComposer(b)}
                      className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer"
                      title="Edit campaign"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlast(b)}
                      className="p-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Composer Modal */}
      {composerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setComposerOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {editingBlastId ? 'Edit Email Campaign' : 'Compose Donor / Partner Email Blast'}
                </h3>
                <p className="text-xs text-gray-500">
                  Supports merge tags: <code>{'{{first_name}}'}</code>, <code>{'{{name}}'}</code>,{' '}
                  <code>{'{{company}}'}</code>, <code>{'{{unsubscribe_url}}'}</code>. Open & click tracking is automatic.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCampaign} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Internal Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q4 Scholarship Impact Update"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Subject Line *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. {{first_name|Friend}}, see how your support changed 10 lives"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Audience List *</label>
                  <select
                    value={listId}
                    onChange={(e) => {
                      setListId(e.target.value);
                      setSelectedSubIds([]);
                    }}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <option value="">— Select Audience List —</option>
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.subscriberCount} active)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SMTP Sender Profile</label>
                  <select
                    value={senderProfileId}
                    onChange={(e) => handleSenderProfileChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    {senderProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.profileName} ({p.fromEmail}){p.isDefault ? ' ★ Default' : ''}
                      </option>
                    ))}
                    <option value="env_default">
                      Environment Default SMTP {envSmtpConfigured ? `(${envSmtpFrom})` : '(Not configured)'}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sender Display Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sender From Email</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="notifications@vonf.org"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              {/* Recipient Selection Mode */}
              {listSubs.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">
                      Recipients ({recipientMode === 'ALL' ? listSubs.length : selectedSubIds.length} selected)
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRecipientMode('ALL')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          recipientMode === 'ALL' ? 'bg-[#558b1a] text-white' : 'bg-white border border-gray-200 text-gray-600'
                        }`}
                      >
                        All Active ({listSubs.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecipientMode('CUSTOM')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          recipientMode === 'CUSTOM' ? 'bg-[#558b1a] text-white' : 'bg-white border border-gray-200 text-gray-600'
                        }`}
                      >
                        Select Specific
                      </button>
                    </div>
                  </div>
                  {recipientMode === 'CUSTOM' && (
                    <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {listSubs.map((s) => {
                        const checked = selectedSubIds.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 text-[11px] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setSelectedSubIds((prev) =>
                                  checked ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                                )
                              }
                              className="accent-[#558b1a]"
                            />
                            <span className="truncate font-medium text-gray-800">{s.name || s.email}</span>
                            <span className="truncate text-gray-400 ml-auto">{s.email}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* HTML Editor / Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Email Body (HTML)</label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBodyMode('edit')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                        bodyMode === 'edit' ? 'bg-[#0c1a05] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Code className="w-3 h-3" /> HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setBodyMode('preview')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                        bodyMode === 'preview' ? 'bg-[#0c1a05] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Live Preview
                    </button>
                  </div>
                </div>

                {bodyMode === 'edit' ? (
                  <textarea
                    rows={10}
                    required
                    value={contentHtml}
                    onChange={(e) => setContentHtml(e.target.value)}
                    className="w-full p-3 text-xs font-mono bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                ) : (
                  <div
                    className="p-5 rounded-2xl border border-gray-200 bg-gray-50 min-h-[220px]"
                    dangerouslySetInnerHTML={{ __html: renderPreviewHtml(contentHtml) }}
                  />
                )}
              </div>

              {/* Dispatch Mode */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'SEND_NOW', label: 'Send Immediately' },
                    { id: 'DRAFT', label: 'Save as Draft' },
                    { id: 'SCHEDULE', label: 'Schedule Date' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSendMode(m.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        sendMode === m.id
                          ? 'bg-[#558b1a] text-white border-[#558b1a]'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {sendMode === 'SCHEDULE' && (
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white rounded-xl border border-gray-200"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {saving
                    ? sendMode === 'SEND_NOW'
                      ? 'Dispatching...'
                      : 'Saving...'
                    : sendMode === 'SEND_NOW'
                    ? 'Send Campaign Now'
                    : sendMode === 'SCHEDULE'
                    ? 'Schedule Campaign'
                    : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivery & Engagement Logs Modal */}
      {inspectBlast && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInspectBlast(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">{inspectBlast.title} — Engagement Logs</h3>
                <p className="text-xs text-gray-500">{inspectBlast.subject}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectBlast(null)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
              {(['ALL', 'OPENED', 'CLICKED', 'FAILED'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLogFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    logFilter === f ? 'bg-[#558b1a] text-white' : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingLogs ? (
                <p className="text-xs text-gray-400 text-center py-8">Loading delivery logs...</p>
              ) : filteredLogs.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">No delivery log entries match this filter.</p>
              ) : (
                <div className="space-y-2">
                  {filteredLogs.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {l.recipientName || l.email}
                          {l.organization ? <span className="text-gray-400 font-normal"> · {l.organization}</span> : null}
                        </p>
                        <p className="text-[11px] text-gray-500">{l.email}</p>
                        {l.errorMessage && <p className="text-[11px] text-red-600 mt-0.5">{l.errorMessage}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            l.status === 'SENT'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {l.status}
                        </span>
                        {l.openCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a]">
                            <CheckCircle2 className="w-3 h-3" /> {l.openCount} opens
                          </span>
                        )}
                        {l.clickCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                            <MousePointer className="w-3 h-3" /> {l.clickCount} clicks
                          </span>
                        )}
                        {(l.openCount > 0 || l.clickCount > 0) && (
                          <button
                            type="button"
                            onClick={() => handlePromoteLogToLead(l)}
                            className="px-2.5 py-1 rounded-lg bg-[#558b1a] text-white text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            title="Add engaged recipient to CRM Leads"
                          >
                            <UserPlus className="w-3 h-3" /> Add Lead
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
