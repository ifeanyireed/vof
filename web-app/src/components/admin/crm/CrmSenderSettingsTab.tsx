'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Server,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type { CrmSenderProfile } from '@/lib/crm-types';

interface CrmSenderSettingsTabProps {
  profiles: CrmSenderProfile[];
  envSmtp: { configured: boolean; host: string; port: number; fromEmail: string };
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

const SMTP_PRESETS = [
  { label: 'Brevo (Sendinblue)', provider: 'Brevo', host: 'smtp-relay.brevo.com', port: 587, encryption: 'tls' as const },
  { label: 'Google Workspace / Gmail', provider: 'Gmail', host: 'smtp.gmail.com', port: 587, encryption: 'tls' as const },
  { label: 'Zoho Mail', provider: 'Zoho', host: 'smtp.zoho.com', port: 465, encryption: 'ssl' as const },
  { label: 'Resend SMTP', provider: 'Resend', host: 'smtp.resend.com', port: 465, encryption: 'ssl' as const },
  { label: 'Custom cPanel / Host', provider: 'Custom SMTP', host: '', port: 465, encryption: 'ssl' as const },
];

export default function CrmSenderSettingsTab({
  profiles,
  envSmtp,
  onRefresh,
  onNotify,
}: CrmSenderSettingsTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CrmSenderProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const [testingId, setTestingId] = useState<string | null>(null);
  const [testEmailTarget, setTestEmailTarget] = useState('');

  const [form, setForm] = useState({
    profileName: '',
    provider: 'Brevo',
    host: 'smtp-relay.brevo.com',
    port: 587,
    encryption: 'tls' as 'tls' | 'ssl' | 'none',
    username: '',
    password: '',
    fromName: 'Veronica Onyeneke Foundation',
    fromEmail: '',
    replyTo: '',
    isDefault: true,
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      profileName: 'VOF Primary Outreach',
      provider: 'Brevo',
      host: 'smtp-relay.brevo.com',
      port: 587,
      encryption: 'tls',
      username: '',
      password: '',
      fromName: 'Veronica Onyeneke Foundation',
      fromEmail: '',
      replyTo: '',
      isDefault: profiles.length === 0,
    });
    setModalOpen(true);
  };

  const openEdit = (p: CrmSenderProfile) => {
    setEditing(p);
    setForm({
      profileName: p.profileName,
      provider: p.provider,
      host: p.host,
      port: p.port,
      encryption: p.encryption,
      username: p.username,
      password: '',
      fromName: p.fromName,
      fromEmail: p.fromEmail,
      replyTo: p.replyTo || '',
      isDefault: p.isDefault,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/crm/sender-profiles', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save sender profile');
      onNotify('success', editing ? 'Sender profile updated' : 'Sender profile added');
      setModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (p: CrmSenderProfile) => {
    try {
      const res = await fetch('/api/crm/sender-profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, isDefault: true }),
      });
      if (!res.ok) throw new Error('Failed to set default');
      onNotify('success', `"${p.profileName}" is now the default sender`);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleDelete = async (p: CrmSenderProfile) => {
    if (!confirm(`Delete sender profile "${p.profileName}"?`)) return;
    try {
      const res = await fetch(`/api/crm/sender-profiles?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete sender profile');
      onNotify('success', 'Sender profile deleted');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleTestSmtp = async (profileId: string) => {
    setTestingId(profileId);
    try {
      const res = await fetch('/api/crm/sender-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          profileId,
          testEmail: testEmailTarget.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'SMTP verification failed');
      onNotify('success', data.message || 'SMTP verified successfully');
    } catch (err: any) {
      onNotify('error', err.message || 'SMTP test failed');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-gray-900">SMTP Sender Profiles & Deliverability</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure multiple sender identities (e.g. Partnerships, Fundraising, Secretariat) for CRM email blasts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="email"
            value={testEmailTarget}
            onChange={(e) => setTestEmailTarget(e.target.value)}
            placeholder="Optional test recipient email..."
            className="px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 w-56"
          />
          <button
            type="button"
            onClick={openNew}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Sender Profile
          </button>
        </div>
      </div>

      {/* Environment Fallback Status */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-gray-900">Server Environment SMTP Fallback</p>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  envSmtp.configured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
              >
                {envSmtp.configured ? 'Configured' : 'Not Set'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              {envSmtp.configured
                ? `${envSmtp.host}:${envSmtp.port} · From: ${envSmtp.fromEmail}`
                : 'Set SMTP_HOST, SMTP_USER, SMTP_PASS in Vercel env or add a Sender Profile below.'}
            </p>
          </div>
        </div>

        {envSmtp.configured && (
          <button
            type="button"
            disabled={testingId === 'env_default'}
            onClick={() => handleTestSmtp('env_default')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {testingId === 'env_default' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-[#558b1a]" />
            )}
            Test Env SMTP
          </button>
        )}
      </div>

      {/* Configured Profiles */}
      {profiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-2">
          <Mail className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-800">No custom SMTP sender profiles yet</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Add Brevo, Gmail App Password, Zoho Mail, Resend, or cPanel SMTP credentials to send branded foundation campaigns right from this dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={`bg-white p-5 rounded-2xl border transition space-y-3 ${
                p.isDefault ? 'border-[#558b1a] ring-1 ring-[#558b1a]/20' : 'border-gray-200/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">{p.profileName}</h4>
                    {p.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0] inline-flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#558b1a] font-medium mt-0.5">
                    {p.fromName} &lt;{p.fromEmail}&gt;
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">
                  {p.provider}
                </span>
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl space-y-1 font-mono">
                <p>Host: {p.host}:{p.port} ({p.encryption.toUpperCase()})</p>
                <p>User: {p.username}</p>
                {p.replyTo && <p>Reply-To: {p.replyTo}</p>}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={testingId === p.id}
                    onClick={() => handleTestSmtp(p.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#f4faec] hover:bg-[#e9f7dc] border border-[#d6f0b0] text-[#558b1a] text-xs font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {testingId === p.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {testEmailTarget ? 'Send Test' : 'Verify'}
                  </button>
                  {!p.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(p)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold cursor-pointer"
                    >
                      Set Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editing ? 'Edit SMTP Sender Profile' : 'Add SMTP Sender Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {SMTP_PRESETS.map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      provider: pr.provider,
                      host: pr.host || f.host,
                      port: pr.port,
                      encryption: pr.encryption,
                    }))
                  }
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#f4faec] hover:text-[#558b1a] text-[11px] font-bold text-gray-700 cursor-pointer transition"
                >
                  {pr.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Profile Label *</label>
                  <input
                    type="text"
                    required
                    value={form.profileName}
                    onChange={(e) => setForm((p) => ({ ...p, profileName: e.target.value }))}
                    placeholder="e.g. VOF Partnerships Desk"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">From Display Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fromName}
                    onChange={(e) => setForm((p) => ({ ...p, fromName: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">From Email *</label>
                  <input
                    type="email"
                    required
                    value={form.fromEmail}
                    onChange={(e) => setForm((p) => ({ ...p, fromEmail: e.target.value }))}
                    placeholder="outreach@vonf.org"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SMTP Host *</label>
                  <input
                    type="text"
                    required
                    value={form.host}
                    onChange={(e) => setForm((p) => ({ ...p, host: e.target.value }))}
                    placeholder="smtp-relay.brevo.com"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Port *</label>
                    <input
                      type="number"
                      required
                      value={form.port}
                      onChange={(e) => setForm((p) => ({ ...p, port: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Encryption</label>
                    <select
                      value={form.encryption}
                      onChange={(e) => setForm((p) => ({ ...p, encryption: e.target.value as any }))}
                      className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <option value="tls">STARTTLS (587)</option>
                      <option value="ssl">SSL/TLS (465)</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">SMTP Username *</label>
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    SMTP Password / API Key {editing ? '(leave blank to keep)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editing}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Reply-To Email (Optional)</label>
                  <input
                    type="email"
                    value={form.replyTo}
                    onChange={(e) => setForm((p) => ({ ...p, replyTo: e.target.value }))}
                    placeholder="partnerships@vonf.org"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
                  className="accent-[#558b1a]"
                />
                Set as default sender profile for CRM campaigns
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Save Sender Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
