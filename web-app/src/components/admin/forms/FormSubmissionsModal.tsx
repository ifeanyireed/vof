'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Archive,
  Trash2,
  ExternalLink,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { CustomForm, CustomFormSubmission, SubmissionStatus } from '@/types/forms';
import { api } from '@/lib/api';

interface FormSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: CustomForm | null;
}

export default function FormSubmissionsModal({
  isOpen,
  onClose,
  form,
}: FormSubmissionsModalProps) {
  const [submissions, setSubmissions] = useState<CustomFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
  });

  // Active submission for detail drawer
  const [activeSubmission, setActiveSubmission] = useState<CustomFormSubmission | null>(null);
  const [activeNotes, setActiveNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadSubmissions = async () => {
    if (!form) return;
    try {
      setLoading(true);
      const res = await api.getFormSubmissions(form.id, {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        q: searchQuery.trim() || undefined,
      });
      setSubmissions(res.submissions || []);
      setStatusCounts(res.statusCounts || { all: 0 });
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && form) {
      loadSubmissions();
    }
  }, [isOpen, form, selectedStatus, searchQuery]);

  useEffect(() => {
    if (activeSubmission) {
      setActiveNotes(activeSubmission.adminNotes || '');
    }
  }, [activeSubmission]);

  if (!isOpen || !form) return null;

  const handleUpdateStatus = async (status: SubmissionStatus) => {
    if (!activeSubmission) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateSubmissionStatus(activeSubmission.id, status, activeNotes);
      setActiveSubmission(updated);
      setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      // Refresh status counts
      setStatusCounts((prev) => ({
        ...prev,
        [activeSubmission.status]: Math.max(0, (prev[activeSubmission.status] || 1) - 1),
        [status]: (prev[status] || 0) + 1,
      }));
      setNotification(`Status updated to ${status}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeSubmission) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateSubmissionStatus(activeSubmission.id, undefined, activeNotes);
      setActiveSubmission(updated);
      setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setNotification('Staff notes saved');
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save notes');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this submission?')) return;
    try {
      await api.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (activeSubmission?.id === id) setActiveSubmission(null);
      setNotification('Submission deleted');
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete submission');
    }
  };

  // CSV Export Generator
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert('No submissions available to export.');
      return;
    }

    // Build headers from respondent standard info + all dynamic form fields
    const dynamicFields = form.fields.filter((f) => f.type !== 'section');
    const headers = [
      'Submission ID',
      'Submitted At',
      'Status',
      'Respondent Name',
      'Respondent Email',
      'Respondent Phone',
      ...dynamicFields.map((f) => `"${f.label.replace(/"/g, '""')}"`),
      'Uploaded Files',
      'Admin Staff Notes',
    ];

    const rows = submissions.map((sub) => {
      const fieldValues = dynamicFields.map((f) => {
        const val = sub.data?.[f.id];
        if (val === undefined || val === null) return '""';
        if (Array.isArray(val)) return `"${val.join(', ').replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });

      const fileList = (sub.files || []).map((fl) => fl.url).join(' | ');

      return [
        sub.id,
        `"${new Date(sub.createdAt).toLocaleString()}"`,
        `"${sub.status}"`,
        `"${(sub.respondentName || '').replace(/"/g, '""')}"`,
        `"${(sub.respondentEmail || '').replace(/"/g, '""')}"`,
        `"${(sub.respondentPhone || '').replace(/"/g, '""')}"`,
        ...fieldValues,
        `"${fileList}"`,
        `"${(sub.adminNotes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.slug}-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-7xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-stone-50/80 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-gray-900 truncate max-w-md">
                  {form.title} — Submissions
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {statusCounts.all || 0} Total
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">
                /forms/{form.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-[#558b1a] hover:text-[#558b1a] text-gray-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-[#558b1a]" />
              <span>Export to CSV</span>
            </button>

            <a
              href={`/forms/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Form</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {notification && (
          <div className="px-6 py-2 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border-b border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* KPI Strip & Filter Bar */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All', count: statusCounts.all || 0 },
              { id: 'pending', label: 'Pending', count: statusCounts.pending || 0, color: 'text-amber-600' },
              { id: 'reviewed', label: 'Reviewed', count: statusCounts.reviewed || 0, color: 'text-blue-600' },
              { id: 'approved', label: 'Approved', count: statusCounts.approved || 0, color: 'text-emerald-600' },
              { id: 'rejected', label: 'Rejected', count: statusCounts.rejected || 0, color: 'text-rose-600' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedStatus === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#558b1a]"
            />
          </div>
        </div>

        {/* Content Body: Table (Left/Center) + Detail Drawer (Right) */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Submissions Table */}
          <div className={`${activeSubmission ? 'col-span-7' : 'col-span-12'} border-r border-gray-100 overflow-y-auto`}>
            {loading ? (
              <div className="py-24 text-center">
                <span className="w-6 h-6 border-2 border-[#558b1a]/30 border-t-[#558b1a] rounded-full animate-spin inline-block mb-2" />
                <p className="text-xs text-gray-500">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-24 text-center">
                <Layers className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <h4 className="text-sm font-bold text-gray-800">No Submissions Found</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? 'No submissions matched your search criteria.'
                    : 'Responses submitted to this form will appear here in real-time.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-stone-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3 px-4">Respondent</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {submissions.map((sub) => {
                    const isSelected = activeSubmission?.id === sub.id;
                    const name = sub.respondentName || 'Anonymous Submitter';
                    const email = sub.respondentEmail || 'No email provided';

                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setActiveSubmission(sub)}
                        className={`hover:bg-stone-50 transition cursor-pointer ${
                          isSelected ? 'bg-emerald-50/60 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center font-bold text-[11px] shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate max-w-[160px]">
                              <span className="font-bold text-gray-900 block truncate">
                                {name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                #{sub.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <div className="truncate max-w-[180px]">
                            <span className="block truncate">{email}</span>
                            {sub.respondentPhone && (
                              <span className="text-[10px] text-gray-400 block">
                                {sub.respondentPhone}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              sub.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : sub.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSubmission(sub);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-[#558b1a] hover:bg-[#558b1a]/10 rounded-lg transition"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Submission Details Drawer (Right Column) */}
          {activeSubmission && (
            <div className="col-span-5 p-6 overflow-y-auto bg-stone-50/50 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Header & Status Actions */}
                <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Submission #{activeSubmission.id}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-gray-900 mt-0.5">
                      {activeSubmission.respondentName || 'Anonymous Submitter'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Submitted on {new Date(activeSubmission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSubmission(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Bar */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 block uppercase tracking-wider">
                    Approval / Review Status
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { status: 'pending' as SubmissionStatus, label: 'Pending', icon: Clock, color: 'hover:bg-amber-100 text-amber-800' },
                      { status: 'reviewed' as SubmissionStatus, label: 'Reviewed', icon: CheckCircle2, color: 'hover:bg-blue-100 text-blue-800' },
                      { status: 'approved' as SubmissionStatus, label: 'Approve', icon: ThumbsUp, color: 'hover:bg-emerald-100 text-emerald-800' },
                      { status: 'rejected' as SubmissionStatus, label: 'Reject', icon: ThumbsDown, color: 'hover:bg-rose-100 text-rose-800' },
                    ].map((btn) => {
                      const Icon = btn.icon;
                      const isActive = activeSubmission.status === btn.status;
                      return (
                        <button
                          key={btn.status}
                          type="button"
                          onClick={() => handleUpdateStatus(btn.status)}
                          disabled={isUpdatingStatus}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            isActive
                              ? 'bg-gray-900 text-white shadow-xs'
                              : `bg-gray-100 ${btn.color}`
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question & Answer Responses */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                    Form Answers
                  </span>

                  <div className="space-y-3">
                    {form.fields.map((field) => {
                      if (field.type === 'section') {
                        return (
                          <div key={field.id} className="pt-3 pb-1 border-t border-gray-200">
                            <h5 className="font-bold text-xs text-gray-800">{field.label}</h5>
                          </div>
                        );
                      }

                      const val = activeSubmission.data?.[field.id];

                      return (
                        <div key={field.id} className="p-3 bg-white rounded-xl border border-gray-200">
                          <span className="text-[11px] font-bold text-gray-500 block mb-0.5">
                            {field.label}
                          </span>
                          <div className="text-xs text-gray-900">
                            {val === undefined || val === null || val === '' ? (
                              <span className="text-gray-400 italic">Not provided</span>
                            ) : Array.isArray(val) ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {val.map((item, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-gray-700 text-[11px] font-medium">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap leading-relaxed">{String(val)}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Uploaded Files Section */}
                {activeSubmission.files && activeSubmission.files.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                      Attached Files ({activeSubmission.files.length})
                    </span>
                    <div className="space-y-2">
                      {activeSubmission.files.map((fl, idx) => (
                        <a
                          key={idx}
                          href={fl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-white border border-gray-200 hover:border-[#558b1a] transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FileText className="w-4 h-4 text-[#558b1a] shrink-0" />
                            <span className="text-xs font-bold text-gray-800 truncate group-hover:text-[#558b1a]">
                              {fl.name || `Document #${idx + 1}`}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#558b1a] shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal Admin Notes */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 block">
                    Staff Internal Notes
                  </span>
                  <textarea
                    rows={3}
                    value={activeNotes}
                    onChange={(e) => setActiveNotes(e.target.value)}
                    placeholder="Add private staff comments or next steps..."
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#558b1a]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isUpdatingStatus}
                      className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

                {/* Metadata & Danger Zone */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
                  <span>IP: {activeSubmission.ipAddress || 'Internal'}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubmission(activeSubmission.id)}
                    className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Submission</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
