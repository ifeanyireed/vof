'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Award,
  Plus,
  Search,
  Calendar,
  MapPin,
  FileText,
  DollarSign,
  Users,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { OutreachReportItem } from '@/lib/api';

export default function OutreachReportsView() {
  const {
    outreachReports,
    outreachCategoryFilter,
    setOutreachCategoryFilter,
    outreachYearFilter,
    setOutreachYearFilter,
    outreachStatusFilter,
    setOutreachStatusFilter,
    outreachSearchQuery,
    setOutreachSearchQuery,
    setIsOutreachModalOpen,
    setEditingOutreach,
    setOutreachFormData,
    previewingOutreach,
    setPreviewingOutreach,
    handleDeleteOutreachReport,
  } = useAdmin();

  const [previewDocModal, setPreviewDocModal] = useState<string | null>(null);

  const categories = [
    'All',
    'Education & Scholarships',
    'Vocational Training',
    'Community Relief',
    'Academic Competitions',
  ];

  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    outreachReports.forEach((r) => {
      if (r.year) yearsSet.add(r.year.toString());
    });
    return ['All', ...Array.from(yearsSet).sort((a, b) => Number(b) - Number(a))];
  }, [outreachReports]);

  const filteredReports = useMemo(() => {
    return outreachReports.filter((report) => {
      const matchesCategory =
        outreachCategoryFilter === 'All' ||
        outreachCategoryFilter === 'all' ||
        report.category === outreachCategoryFilter;

      const matchesYear =
        outreachYearFilter === 'All' ||
        outreachYearFilter === 'all' ||
        report.year.toString() === outreachYearFilter;

      const matchesStatus =
        outreachStatusFilter === 'All' ||
        outreachStatusFilter === 'all' ||
        (report.status || 'published') === outreachStatusFilter;

      const q = outreachSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        report.title.toLowerCase().includes(q) ||
        report.summary.toLowerCase().includes(q) ||
        report.venue.toLowerCase().includes(q) ||
        report.location.toLowerCase().includes(q) ||
        (report.theme && report.theme.toLowerCase().includes(q));

      return matchesCategory && matchesYear && matchesStatus && matchesSearch;
    });
  }, [outreachReports, outreachCategoryFilter, outreachYearFilter, outreachStatusFilter, outreachSearchQuery]);

  const openNewReportModal = () => {
    setEditingOutreach(null);
    setOutreachFormData({
      title: '',
      slug: '',
      theme: '',
      eventDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      year: new Date().getFullYear(),
      venue: '',
      location: '',
      category: 'Education & Scholarships',
      summary: '',
      objectives: [''],
      keyActivities: [''],
      complianceAndObservations: [''],
      nextSteps: [''],
      impactMetrics: [
        { label: 'Scholars / Beneficiaries', count: '10+' },
        { label: 'Verification Rate', count: '100%' },
      ],
      financials: null,
      delegationAndVolunteers: [{ name: '', role: '' }],
      signedBy: { name: '', title: '' },
      documents: [],
      showFinancials: false,
      showDocuments: true,
      featured: false,
      orderIndex: outreachReports.length,
      status: 'published',
    });
    setIsOutreachModalOpen(true);
  };

  const openEditReportModal = (report: OutreachReportItem) => {
    setEditingOutreach(report);
    setOutreachFormData({
      ...report,
      objectives: report.objectives?.length ? report.objectives : [''],
      keyActivities: report.keyActivities?.length ? report.keyActivities : [''],
      complianceAndObservations: report.complianceAndObservations?.length ? report.complianceAndObservations : [''],
      nextSteps: report.nextSteps?.length ? report.nextSteps : [''],
      impactMetrics: report.impactMetrics?.length ? report.impactMetrics : [{ label: '', count: '' }],
      delegationAndVolunteers: report.delegationAndVolunteers?.length ? report.delegationAndVolunteers : [{ name: '', role: '' }],
      signedBy: report.signedBy || { name: '', title: '' },
      documents: report.documents || [],
      showFinancials: Boolean(report.showFinancials ?? report.financials),
      showDocuments: Boolean(report.showDocuments ?? true),
      featured: Boolean(report.featured),
      orderIndex: Number(report.orderIndex ?? 0),
      status: report.status || 'published',
    });
    setIsOutreachModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SUMMARY METRICS */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#558b1a] inline-block animate-pulse" />
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Verified Field Outreach CMS
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0] font-bold">
              {outreachReports.length} Documented Events
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Publish event-by-event stewardship reports, impact metrics, financial audits, and signed MoUs/certified scans.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto shrink-0">
          <Link
            href="/outreach-reports"
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            <span>Public Page</span>
          </Link>
          <button
            onClick={openNewReportModal}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Field Report</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & CONTROLS BAR */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={outreachSearchQuery}
              onChange={(e) => setOutreachSearchQuery(e.target.value)}
              placeholder="Search reports by title, venue, location, theme..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a] transition"
            />
            {outreachSearchQuery && (
              <button
                onClick={() => setOutreachSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Year & Status dropdowns */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs">
              <span className="text-gray-400 font-medium">Year:</span>
              <select
                value={outreachYearFilter}
                onChange={(e) => setOutreachYearFilter(e.target.value)}
                className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs">
              <span className="text-gray-400 font-medium">Status:</span>
              <select
                value={outreachStatusFilter}
                onChange={(e) => setOutreachStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none border-t border-gray-100">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setOutreachCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                outreachCategoryFilter === cat || (cat === 'All' && outreachCategoryFilter === 'all')
                  ? 'bg-[#558b1a] text-white shadow-2xs'
                  : 'bg-gray-100/70 text-gray-600 hover:bg-gray-100 border border-gray-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. REPORT CARDS LIST */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No field outreach reports found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new field outreach report.
          </p>
          <button
            onClick={openNewReportModal}
            className="px-4 py-2 rounded-xl bg-[#558b1a] text-white text-xs font-bold inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Field Report</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id || report.slug}
              className="bg-white rounded-3xl border border-gray-200/90 hover:border-gray-300 transition-all shadow-2xs hover:shadow-sm overflow-hidden"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Top Banner Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0]">
                      {report.category}
                    </span>
                    {report.featured && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Featured Pin</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        report.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {report.status || 'published'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>{report.eventDate} ({report.year})</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 truncate max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#558b1a] shrink-0" />
                      <span className="truncate">{report.venue}, {report.location}</span>
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-snug">
                    {report.title}
                  </h3>
                  {report.theme && (
                    <p className="text-xs font-semibold text-gray-500 mb-2 italic">
                      &quot;{report.theme}&quot;
                    </p>
                  )}
                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed line-clamp-2">
                    {report.summary}
                  </p>
                </div>

                {/* Impact Metrics Row */}
                {report.impactMetrics && report.impactMetrics.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {report.impactMetrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-xl shrink-0 text-center"
                      >
                        <span className="text-xs font-bold text-[#558b1a] block">
                          {metric.count}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Badges / Extras */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-3 flex-wrap">
                    {report.financials && report.showFinancials !== false ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span>Audit: Spent <strong>{report.financials.totalSpent}</strong></span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">No public financial breakdown</span>
                    )}

                    {report.documents && report.documents.length > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium text-[11px]">
                        <FileCheck2 className="w-3 h-3 text-[#558b1a]" />
                        <span>{report.documents.length} Scanned Documents & Media</span>
                      </span>
                    ) : null}

                    {report.signedBy?.name && (
                      <span className="text-[11px] text-gray-500">
                        Certified by: <strong>{report.signedBy.name}</strong>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => setPreviewingOutreach(report)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition cursor-pointer"
                      title="Preview Report Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/outreach-reports#${report.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
                      title="View on Public Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openEditReportModal(report)}
                      className="p-1.5 rounded-lg bg-[#f4faec] hover:bg-[#e9f7dc] text-[#558b1a] border border-[#d6f0b0] transition cursor-pointer"
                      title="Edit Outreach Report"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => report.id && handleDeleteOutreachReport(report.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                      title="Delete Outreach Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. PREVIEW MODAL */}
      {previewingOutreach && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewingOutreach(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewingOutreach(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0]">
                  {previewingOutreach.category}
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  {previewingOutreach.eventDate} ({previewingOutreach.year})
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                {previewingOutreach.title}
              </h2>
              {previewingOutreach.theme && (
                <p className="text-xs text-gray-500 italic mt-1">&quot;{previewingOutreach.theme}&quot;</p>
              )}
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#558b1a]" />
                <span>{previewingOutreach.venue}, {previewingOutreach.location}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#558b1a] mb-1.5">
                Executive Summary
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {previewingOutreach.summary}
              </p>
            </div>

            {/* Metrics */}
            {previewingOutreach.impactMetrics && previewingOutreach.impactMetrics.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                  Impact Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {previewingOutreach.impactMetrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                      <span className="text-sm font-bold text-[#558b1a] block">{m.count}</span>
                      <span className="text-[11px] text-gray-500">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objectives & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-100">
                  Primary Objectives
                </h4>
                <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
                  {previewingOutreach.objectives?.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-900 mb-2 pb-1 border-b border-gray-100">
                  Key Activities & Outcomes
                </h4>
                <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
                  {previewingOutreach.keyActivities?.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            {previewingOutreach.financials && previewingOutreach.showFinancials !== false && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Fiduciary Breakdown
                  </h4>
                  <span className="text-xs text-gray-600">
                    Spent: <strong className="text-[#558b1a]">{previewingOutreach.financials.totalSpent}</strong>
                  </span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Item</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previewingOutreach.financials.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3">{it.item}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-gray-900">{it.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Documents */}
            {previewingOutreach.documents && previewingOutreach.documents.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                  Certified Documents & Scans ({previewingOutreach.documents.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {previewingOutreach.documents.map((doc, dIdx) => (
                    <div
                      key={dIdx}
                      onClick={() => setPreviewDocModal(doc.image)}
                      className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden cursor-pointer group"
                    >
                      <div className="aspect-[3/4] relative bg-stone-100">
                        <img
                          src={doc.image}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                      </div>
                      <div className="p-2 text-left">
                        <span className="text-[11px] font-bold text-gray-900 block truncate">{doc.title}</span>
                        <span className="text-[10px] text-gray-400 capitalize">{doc.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signatory */}
            {previewingOutreach.signedBy?.name && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Officially verified by:</span>
                <span className="font-bold text-gray-800">
                  {previewingOutreach.signedBy.name} ({previewingOutreach.signedBy.title})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox for Document preview */}
      {previewDocModal && (
        <div
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setPreviewDocModal(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center">
            <button
              onClick={() => setPreviewDocModal(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewDocModal} alt="Document Scan" className="max-h-[80vh] max-w-full rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
