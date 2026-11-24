'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRightCircle,
  Building2,
  Database,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  PhoneCall,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { CrmLead, LeadStatus } from '@/lib/crm-types';
import { LEAD_STATUS_OPTIONS, parseBulkContacts } from '@/lib/crm-types';

interface CrmLeadsTabProps {
  leads: CrmLead[];
  staffNames: string[];
  currentUserName: string;
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
  onOpenSyncModal: () => void;
  onQuickCallLead: (lead: CrmLead) => void;
}

const LEAD_CATEGORIES = [
  'Corporate Sponsor',
  'Individual Major Donor',
  'Grant Foundation',
  'Faith / Community Partner',
  'School / Academic Institution',
  'Diaspora Supporter',
  'Community Volunteer',
];

const STATUS_BADGE: Record<string, string> = {
  CURIOUS: 'bg-sky-50 text-sky-700 border-sky-200',
  CONTACTED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PROPOSAL: 'bg-purple-50 text-purple-700 border-purple-200',
  'AWAITING RESPONSE': 'bg-amber-50 text-amber-700 border-amber-200',
  'MEETING BOOKED': 'bg-teal-50 text-teal-700 border-teal-200',
  QUALIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'NOT READY': 'bg-gray-100 text-gray-600 border-gray-200',
  CONVERTED: 'bg-[#f4faec] text-[#558b1a] border-[#d6f0b0]',
  ARCHIVED: 'bg-stone-100 text-stone-500 border-stone-200',
};

export default function CrmLeadsTab({
  leads,
  staffNames,
  currentUserName,
  onRefresh,
  onNotify,
  onOpenSyncModal,
  onQuickCallLead,
}: CrmLeadsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Add/Edit Lead Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<CrmLead | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    organizationName: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    linkedinUrl: '',
    location: 'Nigeria',
    category: 'Corporate Sponsor',
    fitScore: 75,
    status: 'CURIOUS' as LeadStatus,
    assignedRep: currentUserName,
    source: 'Manual',
    notes: '',
  });

  // Bulk Paste Import Modal
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Corporate Sponsor');
  const [bulkImporting, setBulkImporting] = useState(false);

  // Convert Modal
  const [convertingLead, setConvertingLead] = useState<CrmLead | null>(null);
  const [convertTitle, setConvertTitle] = useState('');
  const [convertValue, setConvertValue] = useState('₦1,500,000');
  const [convertCampaign, setConvertCampaign] = useState('Scholarship Sponsorship');
  const [converting, setConverting] = useState(false);

  const parsedBulkPreview = useMemo(() => parseBulkContacts(bulkText), [bulkText]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
      const matchSearch =
        !q ||
        l.organizationName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.contactEmail.toLowerCase().includes(q) ||
        (l.contactPhone || '').toLowerCase().includes(q) ||
        (l.category || '').toLowerCase().includes(q) ||
        (l.location || '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [leads, search, statusFilter]);

  const openAddModal = () => {
    setEditingLead(null);
    setForm({
      organizationName: '',
      contactName: '',
      contactTitle: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      linkedinUrl: '',
      location: 'Nigeria',
      category: 'Corporate Sponsor',
      fitScore: 75,
      status: 'CURIOUS',
      assignedRep: currentUserName,
      source: 'Manual',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (lead: CrmLead) => {
    setEditingLead(lead);
    setForm({
      organizationName: lead.organizationName || '',
      contactName: lead.contactName || '',
      contactTitle: lead.contactTitle || '',
      contactEmail: lead.contactEmail || '',
      contactPhone: lead.contactPhone || '',
      website: lead.website || '',
      linkedinUrl: lead.linkedinUrl || '',
      location: lead.location || '',
      category: lead.category || 'Corporate Sponsor',
      fitScore: lead.fitScore ?? 75,
      status: (lead.status as LeadStatus) || 'CURIOUS',
      assignedRep: lead.assignedRep || currentUserName,
      source: lead.source || 'Manual',
      notes: lead.notes || '',
    });
    setModalOpen(true);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organizationName.trim() && !form.contactName.trim()) {
      onNotify('error', 'Please enter an organization or contact name');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/crm/leads', {
        method: editingLead ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLead ? { id: editingLead.id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save lead');
      onNotify('success', editingLead ? 'Lead updated successfully' : 'New lead added to CRM');
      setModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleDeleteLead = async (lead: CrmLead) => {
    if (!confirm(`Delete lead "${lead.organizationName || lead.contactName}"?`)) return;
    try {
      const res = await fetch(`/api/crm/leads?id=${encodeURIComponent(lead.id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete lead');
      onNotify('success', 'Lead removed');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleBulkImport = async () => {
    if (parsedBulkPreview.length === 0) return;
    setBulkImporting(true);
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk',
          defaultCategory: bulkCategory,
          assignedRep: currentUserName,
          leads: parsedBulkPreview.map((p) => ({
            organizationName: p.organization || p.name || 'Supporter',
            contactName: p.name || p.organization || 'Contact',
            contactEmail: p.email,
            contactPhone: p.phone,
            linkedinUrl: p.linkedinUrl,
            category: bulkCategory,
            source: 'Bulk Import',
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk import failed');
      onNotify(
        'success',
        `Imported ${data.createdCount} leads (${data.skippedCount} duplicate/invalid skipped)`
      );
      setBulkOpen(false);
      setBulkText('');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setBulkImporting(false);
    }
  };

  const handleConvertLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;
    setConverting(true);
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert',
          leadId: convertingLead.id,
          title: convertTitle.trim() || `${convertingLead.organizationName} — Sponsorship Proposal`,
          valueDisplay: convertValue.trim() || '₦1,000,000',
          campaignType: convertCampaign,
          owner: convertingLead.assignedRep || currentUserName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to convert lead');
      onNotify('success', `Converted "${convertingLead.organizationName}" into a Pipeline Opportunity!`);
      setConvertingLead(null);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor, organization, email, phone, location..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenSyncModal}
              className="px-3.5 py-2 rounded-xl border border-[#d6f0b0] bg-[#f4faec] hover:bg-[#e9f7dc] text-[#558b1a] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Database className="w-3.5 h-3.5" />
              Sync VOF Records
            </button>
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Upload className="w-3.5 h-3.5" />
              Bulk Paste Import
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-100 scrollbar-none">
          {['ALL', ...LEAD_STATUS_OPTIONS].map((st) => {
            const count = st === 'ALL' ? leads.length : leads.filter((l) => l.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#558b1a] text-white'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-[#558b1a] mx-auto opacity-60" />
          <h3 className="text-sm font-bold text-gray-800">No donor or sponsor leads found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Add prospective donors, corporate sponsors, and grant foundations — or pull them automatically from your existing VOF Donations, Partners, and Volunteers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 p-4 sm:p-5 transition shadow-2xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {lead.id}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900">{lead.organizationName}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {lead.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0]">
                      Fit {lead.fitScore}%
                    </span>
                    {lead.source && (
                      <span className="text-[10px] text-gray-400 font-medium">via {lead.source}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span className="font-semibold text-gray-800">
                      {lead.contactName}
                      {lead.contactTitle ? ` · ${lead.contactTitle}` : ''}
                    </span>
                    {lead.contactEmail && (
                      <a
                        href={`mailto:${lead.contactEmail}`}
                        className="inline-flex items-center gap-1 text-[#558b1a] hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" /> {lead.contactEmail}
                      </a>
                    )}
                    {lead.contactPhone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {lead.contactPhone}
                      </span>
                    )}
                    {lead.location && (
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {lead.location}
                      </span>
                    )}
                    {lead.website && (
                      <a
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                  </div>

                  {lead.notes && (
                    <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 line-clamp-2">
                      {lead.notes}
                    </p>
                  )}
                </div>

                {/* Right Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                      STATUS_BADGE[lead.status] || 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {LEAD_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => onQuickCallLead(lead)}
                    className="px-2.5 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition"
                    title="Log outreach call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call
                  </button>

                  {lead.status !== 'CONVERTED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setConvertingLead(lead);
                        setConvertTitle(`${lead.organizationName} — Sponsorship Partnership`);
                        setConvertValue('₦1,500,000');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#f4faec] hover:bg-[#e9f7dc] border border-[#d6f0b0] text-[#558b1a] text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition"
                      title="Convert into Pipeline Opportunity"
                    >
                      <ArrowRightCircle className="w-3.5 h-3.5" /> Pipeline
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openEditModal(lead)}
                    className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer"
                    title="Edit lead"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLead(lead)}
                    className="p-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                    title="Delete lead"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {editingLead ? 'Edit Donor / Sponsor Lead' : 'Add Donor / Sponsor Lead'}
                </h3>
                <p className="text-xs text-gray-500">
                  Capture institutional donors, CSR leads, grant officers, and key supporters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Organization / Donor Group *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organizationName}
                    onChange={(e) => setForm((p) => ({ ...p, organizationName: e.target.value }))}
                    placeholder="e.g. Zenith CSR Foundation"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  >
                    {LEAD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                    placeholder="e.g. Dr. Chinedu Okeke"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={form.contactTitle}
                    onChange={(e) => setForm((p) => ({ ...p, contactTitle: e.target.value }))}
                    placeholder="e.g. Head of CSR & Grants"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                    placeholder="grants@organization.org"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))}
                    placeholder="+234 803 ..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Lagos / Abuja / UK Diaspora"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  >
                    {LEAD_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mission Fit Score ({form.fitScore}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.fitScore}
                    onChange={(e) => setForm((p) => ({ ...p, fitScore: Number(e.target.value) }))}
                    className="w-full accent-[#558b1a]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Staff</label>
                  <input
                    list="vof-crm-staff-list"
                    value={form.assignedRep}
                    onChange={(e) => setForm((p) => ({ ...p, assignedRep: e.target.value }))}
                    placeholder="Select or type staff name"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                  <datalist id="vof-crm-staff-list">
                    {staffNames.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Notes & Context</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Interest areas, scholarship sponsorship capacity, warm introductions..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
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
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingLead ? 'Save Changes' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Paste Import Modal */}
      {bulkOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setBulkOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">Smart Bulk Paste Lead Import</h3>
                <p className="text-xs text-gray-500">
                  Paste rows with names, organizations, emails, or phones (CSV, tab, or comma separated).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Default Category</label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
              >
                {LEAD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              rows={7}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`Examples:\nAdaeze Nwosu, Access Bank CSR, adaeze@accessbank.com, +2348031234567\nJohn Doe <john@foundation.org>\ndonor@example.com`}
              className="w-full p-3 text-xs font-mono bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Detected <strong className="text-[#558b1a]">{parsedBulkPreview.length}</strong> valid contact(s)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBulkOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={bulkImporting || parsedBulkPreview.length === 0}
                  onClick={handleBulkImport}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {bulkImporting ? 'Importing...' : `Import ${parsedBulkPreview.length} Leads`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Pipeline Modal */}
      {convertingLead && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConvertingLead(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">Convert to Pipeline Opportunity</h3>
                <p className="text-xs text-gray-500">
                  Move <Building2 className="w-3 h-3 inline mx-0.5" />
                  <strong>{convertingLead.organizationName}</strong> into the Fundraising Kanban Pipeline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConvertLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={convertTitle}
                  onChange={(e) => setConvertTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Pledge / Grant</label>
                  <input
                    type="text"
                    required
                    value={convertValue}
                    onChange={(e) => setConvertValue(e.target.value)}
                    placeholder="₦1,500,000 or $5,000"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Program Focus</label>
                  <select
                    value={convertCampaign}
                    onChange={(e) => setConvertCampaign(e.target.value)}
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
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {converting ? 'Converting...' : 'Move to Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
