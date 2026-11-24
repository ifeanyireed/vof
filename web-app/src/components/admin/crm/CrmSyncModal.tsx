'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Database, RefreshCw, X } from 'lucide-react';
import type { CrmEmailList } from '@/lib/crm-types';

interface CrmSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: CrmEmailList[];
  onSynced: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

const SOURCE_OPTIONS = [
  { key: 'donations', label: 'VOF Donors (Donations)', desc: 'Unique donor emails from completed & recorded donations' },
  { key: 'partners', label: 'Strategic Partners', desc: 'Corporate, institutional & NGO partner contacts' },
  { key: 'volunteers', label: 'Volunteer Network', desc: 'Registered field & community volunteers' },
  { key: 'scholarships', label: 'Scholarship Applicants', desc: 'Academic scholarship applicant emails' },
  { key: 'skills', label: 'VOIE Skills Applicants', desc: 'Vocational empowerment intake applicants' },
] as const;

export default function CrmSyncModal({ isOpen, onClose, lists, onSynced, onNotify }: CrmSyncModalProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['donations', 'partners']);
  const [target, setTarget] = useState<'list' | 'leads' | 'both'>('both');
  const [listId, setListId] = useState<string>('');
  const [newListName, setNewListName] = useState('VOF Donors & Partners');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingCounts(true);
    fetch('/api/crm/sync')
      .then((r) => r.json())
      .then((d) => {
        if (d?.counts) setCounts(d.counts);
      })
      .catch(() => {})
      .finally(() => setLoadingCounts(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSource = (key: string) => {
    setSelectedSources((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleSync = async () => {
    if (selectedSources.length === 0) {
      onNotify('error', 'Select at least one VOF record source');
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch('/api/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sources: selectedSources,
          target,
          listId: listId || undefined,
          newListName: !listId ? newListName : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');

      const summaryParts = [];
      if (target === 'leads' || target === 'both') {
        summaryParts.push(`${data.leadsAdded} new leads (${data.leadsSkipped} existing)`);
      }
      if (target === 'list' || target === 'both') {
        summaryParts.push(`${data.subscribersAdded} list subscribers (${data.subscribersSkipped} existing)`);
      }
      onNotify('success', `VOF Sync complete: ${summaryParts.join(' · ')}`);
      await onSynced();
      onClose();
    } catch (err: any) {
      onNotify('error', err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">1-Click Sync from VOF Database</h3>
              <p className="text-xs text-gray-500">
                Pull existing Donors, Partners, Volunteers & Applicants into CRM with auto-deduplication.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Checkboxes */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            1. Choose VOF Sources
          </label>
          <div className="space-y-2">
            {SOURCE_OPTIONS.map((opt) => {
              const checked = selectedSources.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    checked ? 'bg-[#f4faec]/70 border-[#558b1a]/50' : 'bg-gray-50/60 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSource(opt.key)}
                      className="rounded accent-[#558b1a]"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{opt.label}</p>
                      <p className="text-[11px] text-gray-500">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                    {loadingCounts ? '...' : counts[opt.key] ?? 0}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            2. Import Destination
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'both', label: 'Leads + Mailing List' },
              { id: 'list', label: 'Mailing List Only' },
              { id: 'leads', label: 'CRM Leads Only' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setTarget(d.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer transition ${
                  target === d.id
                    ? 'bg-[#558b1a] text-white border-[#558b1a]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {(target === 'list' || target === 'both') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Target Audience List</label>
                <select
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                >
                  <option value="">+ Create a New Mailing List</option>
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.subscriberCount})
                    </option>
                  ))}
                </select>
              </div>
              {!listId && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">New List Name</label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g. VOF Major Donors 2026"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={syncing || selectedSources.length === 0}
            onClick={handleSync}
            className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            {syncing ? 'Syncing Records...' : 'Sync Selected Records'}
          </button>
        </div>
      </div>
    </div>
  );
}
