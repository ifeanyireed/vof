'use client';

import React, { useMemo, useState } from 'react';
import { Building2, Calendar, Plus, Search, Trash2, User, X } from 'lucide-react';
import type { CrmDeal, DealStage } from '@/lib/crm-types';
import { DEAL_STAGES, formatCurrencyAmount } from '@/lib/crm-types';

interface CrmPipelineTabProps {
  deals: CrmDeal[];
  currentUserName: string;
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
  onOpenNewDeal: () => void;
}

export default function CrmPipelineTab({
  deals,
  currentUserName,
  onRefresh,
  onNotify,
  onOpenNewDeal,
}: CrmPipelineTabProps) {
  const [search, setSearch] = useState('');
  const [showLost, setShowLost] = useState(false);
  const [editingDeal, setEditingDeal] = useState<CrmDeal | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deals.filter(
      (d) =>
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.organization.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q) ||
        d.campaignType.toLowerCase().includes(q)
    );
  }, [deals, search]);

  const handleStageChange = async (deal: CrmDeal, newStage: DealStage) => {
    const stageInfo = DEAL_STAGES.find((s) => s.key === newStage);
    const probability = newStage === 'LOST' ? 0 : stageInfo?.defaultProbability ?? deal.probability;
    try {
      const res = await fetch('/api/crm/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deal.id, stage: newStage, probability }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stage');
      onNotify('success', `Moved "${deal.title}" to ${newStage}`);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleDeleteDeal = async (deal: CrmDeal) => {
    if (!confirm(`Delete opportunity "${deal.title}"?`)) return;
    try {
      const res = await fetch(`/api/crm/deals?id=${encodeURIComponent(deal.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete opportunity');
      onNotify('success', 'Opportunity deleted');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;
    setSaving(true);
    try {
      const res = await fetch('/api/crm/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDeal.id,
          title: editingDeal.title,
          organization: editingDeal.organization,
          contactName: editingDeal.contactName,
          email: editingDeal.email,
          phone: editingDeal.phone,
          valueDisplay: editingDeal.valueDisplay,
          stage: editingDeal.stage,
          probability: editingDeal.probability,
          expectedClose: editingDeal.expectedClose,
          campaignType: editingDeal.campaignType,
          owner: editingDeal.owner || currentUserName,
          notes: editingDeal.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update opportunity');
      onNotify('success', 'Opportunity updated');
      setEditingDeal(null);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const lostDeals = filtered.filter((d) => d.stage === 'LOST');

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search grant, sponsor, or campaign..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-gray-600 font-semibold">{filtered.length} Opportunities</span>
          <span className="text-[#558b1a] font-bold">
            {filtered.filter((d) => d.stage === 'WON').length} Funded
          </span>
          {lostDeals.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLost((v) => !v)}
              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
            >
              {showLost ? 'Hide' : 'Show'} Lost ({lostDeals.length})
            </button>
          )}
          <button
            type="button"
            onClick={onOpenNewDeal}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
        {DEAL_STAGES.map((col) => {
          const colDeals = filtered.filter((d) => d.stage === col.key);
          const colTotal = colDeals.reduce((sum, d) => sum + (d.valueAmount || 0), 0);
          return (
            <div
              key={col.key}
              className={`bg-stone-50/90 rounded-2xl border border-gray-200/80 border-t-4 ${col.accent} p-3 space-y-3`}
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200/70">
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{col.label}</h4>
                  <p className="text-[10px] text-gray-500">{col.subtitle}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.badge}`}>
                  {colDeals.length}
                </span>
              </div>

              <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Stage Value</span>
                <span>{formatCurrencyAmount(colTotal, 'NGN')}</span>
              </div>

              <div className="space-y-2.5">
                {colDeals.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-[11px] text-gray-400">
                    No opportunities
                  </div>
                ) : (
                  colDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-2xs hover:border-[#558b1a]/50 transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingDeal(deal)}
                          className="text-left text-xs font-bold text-gray-900 hover:text-[#558b1a] leading-snug cursor-pointer"
                        >
                          {deal.title}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDeal(deal)}
                          className="p-1 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-1 text-[11px] text-gray-500">
                        <p className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 text-[#558b1a] shrink-0" />
                          <span className="truncate">{deal.organization}</span>
                        </p>
                        {deal.contactName && (
                          <p className="flex items-center gap-1 truncate">
                            <User className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{deal.contactName}</span>
                          </p>
                        )}
                        {deal.expectedClose && (
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{deal.expectedClose}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                        <span className="text-xs font-bold text-[#558b1a]">{deal.valueDisplay}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{deal.probability}%</span>
                      </div>

                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageChange(deal, e.target.value as DealStage)}
                        className="w-full px-2 py-1 text-[10px] font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#558b1a] cursor-pointer"
                      >
                        {DEAL_STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            Move → {s.label}
                          </option>
                        ))}
                        <option value="LOST">Mark → Lost / Declined</option>
                      </select>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lost Deals Drawer */}
      {showLost && lostDeals.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-200 p-4 space-y-3">
          <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Declined / Lost Opportunities ({lostDeals.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lostDeals.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-red-50/40 border border-red-100 space-y-1.5">
                <p className="text-xs font-bold text-gray-900">{d.title}</p>
                <p className="text-[11px] text-gray-500">
                  {d.organization} · {d.valueDisplay}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleStageChange(d, 'DISCOVERY')}
                    className="text-[11px] font-bold text-[#558b1a] hover:underline cursor-pointer"
                  >
                    Reopen
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDeal(d)}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {editingDeal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingDeal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-gray-900">Edit Opportunity</h3>
              <button
                type="button"
                onClick={() => setEditingDeal(null)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingDeal.title}
                  onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Organization</label>
                  <input
                    type="text"
                    required
                    value={editingDeal.organization}
                    onChange={(e) => setEditingDeal({ ...editingDeal, organization: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Value</label>
                  <input
                    type="text"
                    required
                    value={editingDeal.valueDisplay}
                    onChange={(e) => setEditingDeal({ ...editingDeal, valueDisplay: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stage</label>
                  <select
                    value={editingDeal.stage}
                    onChange={(e) => setEditingDeal({ ...editingDeal, stage: e.target.value as DealStage })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    {DEAL_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                    <option value="LOST">Lost / Declined</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Close Date</label>
                  <input
                    type="text"
                    value={editingDeal.expectedClose}
                    onChange={(e) => setEditingDeal({ ...editingDeal, expectedClose: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editingDeal.notes || ''}
                  onChange={(e) => setEditingDeal({ ...editingDeal, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDeal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
