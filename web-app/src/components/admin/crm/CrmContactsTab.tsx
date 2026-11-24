'use client';

import React, { useMemo, useState } from 'react';
import { Building2, Globe, Mail, MapPin, Pencil, Phone, Plus, Search, Trash2, Users, X } from 'lucide-react';
import type { AccountStatus, CrmAccount } from '@/lib/crm-types';

interface CrmContactsTabProps {
  accounts: CrmAccount[];
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

const STATUS_STYLE: Record<AccountStatus, string> = {
  DONOR: 'bg-[#f4faec] text-[#558b1a] border-[#d6f0b0]',
  SPONSOR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PARTNER: 'bg-sky-50 text-sky-700 border-sky-200',
  PROSPECT: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function CrmContactsTab({ accounts, onRefresh, onNotify }: CrmContactsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountStatus>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CrmAccount | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    organization: '',
    category: 'Corporate Partner',
    location: 'Nigeria',
    status: 'PARTNER' as AccountStatus,
    keyContact: '',
    email: '',
    phone: '',
    website: '',
    totalContributed: '₦0',
    notes: '',
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return accounts.filter((a) => {
      const matchSt = statusFilter === 'ALL' || a.status === statusFilter;
      const matchQ =
        !q ||
        a.organization.toLowerCase().includes(q) ||
        a.keyContact.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q);
      return matchSt && matchQ;
    });
  }, [accounts, search, statusFilter]);

  const openNew = () => {
    setEditing(null);
    setForm({
      organization: '',
      category: 'Corporate Partner',
      location: 'Nigeria',
      status: 'PARTNER',
      keyContact: '',
      email: '',
      phone: '',
      website: '',
      totalContributed: '₦0',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEdit = (acc: CrmAccount) => {
    setEditing(acc);
    setForm({
      organization: acc.organization,
      category: acc.category,
      location: acc.location,
      status: acc.status,
      keyContact: acc.keyContact,
      email: acc.email,
      phone: acc.phone,
      website: acc.website || '',
      totalContributed: acc.totalContributed,
      notes: acc.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organization.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/crm/accounts', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save organization');
      onNotify('success', editing ? 'Organization updated' : 'Organization added');
      setModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (acc: CrmAccount) => {
    if (!confirm(`Delete organization "${acc.organization}"?`)) return;
    try {
      const res = await fetch(`/api/crm/accounts?id=${encodeURIComponent(acc.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onNotify('success', 'Organization removed');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold">Managed Organizations</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{accounts.length}</p>
          </div>
          <Building2 className="w-8 h-8 text-[#558b1a] opacity-80" />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold">Active Donors & Sponsors</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {accounts.filter((a) => a.status === 'DONOR' || a.status === 'SPONSOR').length}
            </p>
          </div>
          <Users className="w-8 h-8 text-emerald-600 opacity-80" />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold">Strategic Partners</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {accounts.filter((a) => a.status === 'PARTNER').length}
            </p>
          </div>
          <Globe className="w-8 h-8 text-sky-600 opacity-80" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, key contact, email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'DONOR', 'SPONSOR', 'PARTNER', 'PROSPECT'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                statusFilter === st ? 'bg-[#558b1a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            type="button"
            onClick={openNew}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-2">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-800">No organizations recorded yet</p>
          <p className="text-xs text-gray-500">
            Add partner schools, corporate sponsors, churches, and institutional donors here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((acc) => (
            <div
              key={acc.id}
              className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-[#558b1a]/40 transition flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400">{acc.id}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[acc.status]}`}>
                    {acc.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{acc.organization}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-[#558b1a]" /> {acc.location} · {acc.category}
                  </p>
                </div>
                <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  {acc.keyContact && <p className="font-semibold text-gray-800">{acc.keyContact}</p>}
                  {acc.email && (
                    <p className="flex items-center gap-1.5 text-[#558b1a]">
                      <Mail className="w-3 h-3" /> {acc.email}
                    </p>
                  )}
                  {acc.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-400" /> {acc.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Total Support</span>
                  <span className="text-xs font-bold text-gray-900">{acc.totalContributed}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(acc)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(acc)}
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {editing ? 'Edit Organization' : 'Add Organization / Institutional Contact'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={form.organization}
                    onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                    placeholder="e.g. Saint Paul's Catholic College / Sterling CSR"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Relationship Type</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AccountStatus }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <option value="DONOR">Donor</option>
                    <option value="SPONSOR">Corporate Sponsor</option>
                    <option value="PARTNER">Strategic Partner</option>
                    <option value="PROSPECT">Prospect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category / Sector</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="Education / Finance / Faith"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Key Contact Person</label>
                  <input
                    type="text"
                    value={form.keyContact}
                    onChange={(e) => setForm((p) => ({ ...p, keyContact: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Contributed / Pledged</label>
                  <input
                    type="text"
                    value={form.totalContributed}
                    onChange={(e) => setForm((p) => ({ ...p, totalContributed: e.target.value }))}
                    placeholder="e.g. ₦2,500,000"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

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
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
