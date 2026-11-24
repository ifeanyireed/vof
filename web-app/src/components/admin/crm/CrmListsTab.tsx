'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Database,
  Download,
  Mail,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type { CrmEmailList, CrmEmailSubscriber } from '@/lib/crm-types';
import { parseBulkContacts } from '@/lib/crm-types';

interface CrmListsTabProps {
  lists: CrmEmailList[];
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
  onOpenSyncModal: () => void;
}

export default function CrmListsTab({ lists, onRefresh, onNotify, onOpenSyncModal }: CrmListsTabProps) {
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [subscribers, setSubscribers] = useState<CrmEmailSubscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subSearch, setSubSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'BOUNCED'>('ALL');

  // Create List Modal
  const [createListOpen, setCreateListOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [listTags, setListTags] = useState('');
  const [savingList, setSavingList] = useState(false);

  // Add Subscriber Modal
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [subMode, setSubMode] = useState<'single' | 'bulk'>('single');
  const [subForm, setSubForm] = useState({ email: '', name: '', organization: '', phone: '' });
  const [bulkText, setBulkText] = useState('');
  const [bulkDefaultOrg, setBulkDefaultOrg] = useState('');
  const [savingSub, setSavingSub] = useState(false);

  useEffect(() => {
    if (!selectedListId && lists.length > 0) {
      setSelectedListId(lists[0].id);
    } else if (selectedListId && !lists.some((l) => l.id === selectedListId)) {
      setSelectedListId(lists[0]?.id || '');
    }
  }, [lists, selectedListId]);

  const loadSubscribers = async (listId: string) => {
    if (!listId) {
      setSubscribers([]);
      return;
    }
    setLoadingSubs(true);
    try {
      const res = await fetch(`/api/crm/lists/subscribers?listId=${encodeURIComponent(listId)}`);
      const data = await res.json();
      setSubscribers(data?.subscribers || []);
    } catch {
      setSubscribers([]);
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    if (selectedListId) {
      loadSubscribers(selectedListId);
    } else {
      setSubscribers([]);
    }
  }, [selectedListId]);

  const selectedList = lists.find((l) => l.id === selectedListId) || null;
  const parsedBulk = useMemo(() => parseBulkContacts(bulkText, bulkDefaultOrg), [bulkText, bulkDefaultOrg]);

  const filteredSubs = useMemo(() => {
    const q = subSearch.trim().toLowerCase();
    return subscribers.filter((s) => {
      const matchSt = statusFilter === 'ALL' || s.status === statusFilter;
      const matchQ =
        !q ||
        s.email.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q);
      return matchSt && matchQ;
    });
  }, [subscribers, subSearch, statusFilter]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;
    setSavingList(true);
    try {
      const res = await fetch('/api/crm/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: listName, description: listDesc, tags: listTags }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create list');
      onNotify('success', `Audience list "${listName}" created`);
      setCreateListOpen(false);
      setListName('');
      setListDesc('');
      setListTags('');
      await onRefresh();
      if (data.list?.id) setSelectedListId(data.list.id);
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSavingList(false);
    }
  };

  const handleDeleteList = async (list: CrmEmailList) => {
    if (!confirm(`Delete audience list "${list.name}" and all its subscribers?`)) return;
    try {
      const res = await fetch(`/api/crm/lists?id=${encodeURIComponent(list.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete list');
      onNotify('success', 'Audience list deleted');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleSaveSubscribers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId) return;
    setSavingSub(true);
    try {
      const payload =
        subMode === 'single'
          ? { listId: selectedListId, ...subForm }
          : {
              listId: selectedListId,
              subscribers: parsedBulk
                .filter((p) => p.email)
                .map((p) => ({
                  email: p.email,
                  name: p.name,
                  organization: p.organization,
                  phone: p.phone,
                  linkedinUrl: p.linkedinUrl,
                  source: 'Bulk Paste',
                })),
            };

      const res = await fetch('/api/crm/lists/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add subscriber(s)');
      onNotify(
        'success',
        `Added ${data.addedCount} contact(s)${data.skippedCount ? ` (${data.skippedCount} duplicate/invalid skipped)` : ''}`
      );
      setAddSubOpen(false);
      setSubForm({ email: '', name: '', organization: '', phone: '' });
      setBulkText('');
      await Promise.all([loadSubscribers(selectedListId), onRefresh()]);
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSavingSub(false);
    }
  };

  const handleDeleteSubscriber = async (sub: CrmEmailSubscriber) => {
    try {
      const res = await fetch(`/api/crm/lists/subscribers?id=${encodeURIComponent(sub.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove subscriber');
      await Promise.all([loadSubscribers(selectedListId), onRefresh()]);
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const handleExportCsv = () => {
    if (filteredSubs.length === 0) return;
    const header = ['Name', 'Email', 'Organization', 'Phone', 'Status', 'Source'];
    const rows = filteredSubs.map((s) =>
      [s.name, s.email, s.organization, s.phone, s.status, s.source]
        .map((v) => `"${String(v || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedList?.name || 'vof-list').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Sidebar: Lists */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-gray-900">Audience Segments ({lists.length})</h3>
            <button
              type="button"
              onClick={() => setCreateListOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New List
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSyncModal}
            className="w-full py-2 px-3 rounded-xl border border-[#d6f0b0] bg-[#f4faec] hover:bg-[#e9f7dc] text-[#558b1a] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            <Database className="w-3.5 h-3.5" /> 1-Click Sync from VOF Records
          </button>

          <div className="space-y-2 pt-1">
            {lists.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                No lists yet. Create a list or sync your VOF Donors & Partners.
              </p>
            ) : (
              lists.map((list) => {
                const active = list.id === selectedListId;
                return (
                  <div
                    key={list.id}
                    onClick={() => setSelectedListId(list.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      active
                        ? 'bg-[#f4faec] border-[#558b1a] shadow-2xs'
                        : 'bg-gray-50/70 border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{list.name}</p>
                        {list.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{list.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[#558b1a]">
                        {list.subscriberCount} active
                      </span>
                      {list.bouncedCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600">
                          {list.bouncedCount} bounced
                        </span>
                      )}
                      {list.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="inline-flex items-center gap-0.5 text-gray-500">
                          <Tag className="w-2.5 h-2.5" /> {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Subscribers Table */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-4">
          {!selectedList ? (
            <div className="py-16 text-center space-y-2">
              <Users className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">Select or create an audience list</p>
              <p className="text-xs text-gray-500">
                Segment donors, sponsors, volunteers, and partners for targeted email campaigns.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">{selectedList.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedList.description || 'Managed foundation mailing segment'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={filteredSubs.length === 0}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubMode('bulk');
                      setAddSubOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Bulk Paste
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubMode('single');
                      setAddSubOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add Contact
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="Filter contacts by name, email, or organization..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUBSCRIBED">Subscribed</option>
                  <option value="UNSUBSCRIBED">Unsubscribed</option>
                  <option value="BOUNCED">Bounced</option>
                </select>
              </div>

              {loadingSubs ? (
                <p className="text-xs text-gray-400 text-center py-8">Loading subscribers...</p>
              ) : filteredSubs.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  No subscribers in this list yet. Add contacts manually, bulk paste, or sync VOF records.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Contact</th>
                        <th className="py-2.5 px-3">Organization</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Source</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredSubs.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/70">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-gray-900">{s.name || '—'}</p>
                            <p className="text-[11px] text-[#558b1a] flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {s.email}
                            </p>
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">{s.organization || '—'}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                s.status === 'SUBSCRIBED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : s.status === 'BOUNCED'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-gray-400">{s.source}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteSubscriber(s)}
                              className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create List Modal */}
      {createListOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCreateListOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-gray-900">Create Audience List</h3>
              <button
                type="button"
                onClick={() => setCreateListOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateList} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="e.g. Q4 Scholarship Donors & Diaspora Sponsors"
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={listDesc}
                  onChange={(e) => setListDesc(e.target.value)}
                  placeholder="Who is in this mailing segment?"
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={listTags}
                  onChange={(e) => setListTags(e.target.value)}
                  placeholder="donors, corporate, abia, diaspora"
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateListOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingList}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingList ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Bulk Import Subscribers Modal */}
      {addSubOpen && selectedList && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setAddSubOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  Add Subscribers to {selectedList.name}
                </h3>
                <p className="text-xs text-gray-500">Add a single contact or smart-paste a list of contacts.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddSubOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSubMode('single')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  subMode === 'single' ? 'bg-[#558b1a] text-white border-[#558b1a]' : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                Single Contact
              </button>
              <button
                type="button"
                onClick={() => setSubMode('bulk')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  subMode === 'bulk' ? 'bg-[#558b1a] text-white border-[#558b1a]' : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                Smart Bulk Paste
              </button>
            </div>

            <form onSubmit={handleSaveSubscribers} className="space-y-3">
              {subMode === 'single' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={subForm.email}
                      onChange={(e) => setSubForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="supporter@example.com"
                      className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={subForm.name}
                      onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Chidinma Eze"
                      className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Organization</label>
                    <input
                      type="text"
                      value={subForm.organization}
                      onChange={(e) => setSubForm((p) => ({ ...p, organization: e.target.value }))}
                      placeholder="e.g. Grace Foundation"
                      className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={subForm.phone}
                      onChange={(e) => setSubForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+234 ..."
                      className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={bulkDefaultOrg}
                    onChange={(e) => setBulkDefaultOrg(e.target.value)}
                    placeholder="Optional default organization for rows without one"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                  <textarea
                    rows={6}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Paste one contact per line:\nNgozi Obi, Zenith CSR, ngozi@zenith.com, +2348012345678\nSamuel Ade <samuel@donor.org>`}
                    className="w-full p-3 text-xs font-mono bg-gray-50 rounded-xl border border-gray-200"
                  />
                  <p className="text-xs text-gray-500">
                    Detected <strong className="text-[#558b1a]">{parsedBulk.filter((p) => p.email).length}</strong> valid email contact(s)
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddSubOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSub || (subMode === 'bulk' && parsedBulk.filter((p) => p.email).length === 0)}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingSub ? 'Saving...' : 'Save Contacts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
