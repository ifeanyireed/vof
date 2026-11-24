'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  Clock,
  Pause,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type { CallOutcome, CallScoreBreakdown, CrmCall, CrmCallStats, CrmLead } from '@/lib/crm-types';
import { CALL_SCORE_CRITERIA, computeCallScore, getCallScoreMeta, OUTCOME_CONFIG } from '@/lib/crm-types';

interface CrmCallsTabProps {
  calls: CrmCall[];
  stats: CrmCallStats;
  leads: CrmLead[];
  currentUserName: string;
  currentUserEmail: string;
  preselectedLead: CrmLead | null;
  onClearPreselectedLead: () => void;
  onRefresh: () => Promise<void>;
  onNotify: (type: 'success' | 'error', text: string) => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CrmCallsTab({
  calls,
  stats,
  leads,
  currentUserName,
  currentUserEmail,
  preselectedLead,
  onClearPreselectedLead,
  onRefresh,
  onNotify,
}: CrmCallsTabProps) {
  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [scoreFilter, setScoreFilter] = useState('ALL');

  // Call Logger Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [contactName, setContactName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [direction, setDirection] = useState<'OUTBOUND' | 'INBOUND'>('OUTBOUND');
  const [outcome, setOutcome] = useState<CallOutcome>('CONNECTED_INTERESTED');
  const [notes, setNotes] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [scoreBreakdown, setScoreBreakdown] = useState<CallScoreBreakdown>({
    callerName: false,
    rfp: false,
    differentContact: false,
    rescheduleFollowup: false,
    referral: false,
    alternateContact: '',
    referralDetails: '',
  });

  // Live Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [manualMin, setManualMin] = useState('');
  const [manualSec, setManualSec] = useState('');

  useEffect(() => {
    if (!isTimerRunning) return;
    const t = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isTimerRunning]);

  useEffect(() => {
    if (preselectedLead) {
      setSelectedLeadId(preselectedLead.id);
      setContactName(preselectedLead.contactName || '');
      setOrganization(preselectedLead.organizationName || '');
      setPhoneNumber(preselectedLead.contactPhone || '');
      setDirection('OUTBOUND');
      setOutcome('CONNECTED_INTERESTED');
      setNotes('');
      setFollowupDate('');
      setScoreBreakdown({
        callerName: Boolean(preselectedLead.contactName),
        rfp: false,
        differentContact: false,
        rescheduleFollowup: false,
        referral: false,
        alternateContact: '',
        referralDetails: '',
      });
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setManualMin('');
      setManualSec('');
      setModalOpen(true);
      onClearPreselectedLead();
    }
  }, [preselectedLead, onClearPreselectedLead]);

  const liveScore = useMemo(() => computeCallScore(scoreBreakdown), [scoreBreakdown]);
  const liveScoreMeta = getCallScoreMeta(liveScore);

  const openBlankModal = () => {
    setSelectedLeadId('');
    setContactName('');
    setOrganization('');
    setPhoneNumber('');
    setDirection('OUTBOUND');
    setOutcome('CONNECTED_INTERESTED');
    setNotes('');
    setFollowupDate('');
    setScoreBreakdown({
      callerName: false,
      rfp: false,
      differentContact: false,
      rescheduleFollowup: false,
      referral: false,
      alternateContact: '',
      referralDetails: '',
    });
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setManualMin('');
    setManualSec('');
    setModalOpen(true);
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setContactName(found.contactName || '');
      setOrganization(found.organizationName || '');
      setPhoneNumber(found.contactPhone || '');
    }
  };

  const handleSaveCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      onNotify('error', 'Contact name is required');
      return;
    }

    setIsTimerRunning(false);
    const manualTotal =
      manualMin !== '' || manualSec !== ''
        ? (parseInt(manualMin || '0', 10) || 0) * 60 + (parseInt(manualSec || '0', 10) || 0)
        : timerSeconds;

    setSaving(true);
    try {
      const res = await fetch('/api/crm/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLeadId || null,
          contactName: contactName.trim(),
          organization: organization.trim(),
          phoneNumber: phoneNumber.trim(),
          repName: currentUserName,
          repEmail: currentUserEmail,
          direction,
          outcome,
          durationSeconds: manualTotal,
          scoreBreakdown,
          notes: notes.trim(),
          followupDate: followupDate.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log call');
      onNotify('success', `Call logged (Score: ${liveScore}/12)`);
      setModalOpen(false);
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCall = async (call: CrmCall) => {
    if (!confirm(`Delete call log with ${call.contactName}?`)) return;
    try {
      const res = await fetch(`/api/crm/calls?id=${encodeURIComponent(call.id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete call');
      onNotify('success', 'Call log removed');
      await onRefresh();
    } catch (err: any) {
      onNotify('error', err.message);
    }
  };

  const filteredCalls = useMemo(() => {
    const q = search.trim().toLowerCase();
    return calls.filter((c) => {
      const matchOutcome = outcomeFilter === 'ALL' || c.outcome === outcomeFilter;
      const matchDir = directionFilter === 'ALL' || c.direction === directionFilter;
      const matchScore =
        scoreFilter === 'ALL' ||
        (scoreFilter === 'HOT' && c.score >= 9) ||
        (scoreFilter === 'WARM' && c.score >= 5 && c.score < 9) ||
        (scoreFilter === 'LOW' && c.score < 5);
      const matchSearch =
        !q ||
        c.contactName.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.phoneNumber.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        c.repName.toLowerCase().includes(q);
      return matchOutcome && matchDir && matchScore && matchSearch;
    });
  }, [calls, search, outcomeFilter, directionFilter, scoreFilter]);

  return (
    <div className="space-y-5">
      {/* Call KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80">
          <p className="text-xs text-gray-500 font-semibold">Total Calls Logged</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCalls}</p>
          <p className="text-[11px] text-[#558b1a] font-semibold mt-0.5">{stats.todayCalls} logged today</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80">
          <p className="text-xs text-gray-500 font-semibold">Connect Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.connectRate}%</p>
          <p className="text-[11px] text-sky-600 font-semibold mt-0.5">{stats.connectedCalls} connected</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80">
          <p className="text-xs text-gray-500 font-semibold">High-Quality Calls (7+/12)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.highScoreCount}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{stats.wonCount} commitments won</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80">
          <p className="text-xs text-gray-500 font-semibold">Avg. Call Duration</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatDuration(stats.avgDurationSec)}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">mm:ss per call</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contact, org, phone, notes..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-700"
          >
            <option value="ALL">All Outcomes</option>
            {Object.entries(OUTCOME_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-700"
          >
            <option value="ALL">All Directions</option>
            <option value="OUTBOUND">Outbound</option>
            <option value="INBOUND">Inbound</option>
          </select>

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-semibold text-gray-700"
          >
            <option value="ALL">All Scores</option>
            <option value="HOT">Hot (9–12 pts)</option>
            <option value="WARM">Warm (5–8 pts)</option>
            <option value="LOW">Initial (0–4 pts)</option>
          </select>

          <button
            type="button"
            onClick={openBlankModal}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" /> Log Call
          </button>
        </div>
      </div>

      {/* Calls Feed */}
      {filteredCalls.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-2">
          <PhoneCall className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-800">No outreach calls logged yet</p>
          <p className="text-xs text-gray-500">
            Track donor & corporate sponsor calls with the live timer and 0–12 call quality scorecard.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCalls.map((c) => {
            const scoreMeta = getCallScoreMeta(c.score);
            const outcomeMeta = OUTCOME_CONFIG[c.outcome];
            return (
              <div
                key={c.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {c.direction === 'INBOUND' ? (
                        <PhoneIncoming className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <PhoneOutgoing className="w-3 h-3 text-sky-600" />
                      )}
                      {c.direction}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">{c.contactName}</h4>
                    {c.organization && <span className="text-xs text-gray-500">· {c.organization}</span>}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${scoreMeta.className}`}>
                      <Award className="w-3 h-3 inline mr-0.5" />
                      {c.score}/12 · {scoreMeta.label}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${outcomeMeta?.pill || ''}`}>
                      {outcomeMeta?.label || c.outcome}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    {c.phoneNumber && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {c.phoneNumber}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDuration(c.durationSeconds)}
                    </span>
                    <span>Rep: <strong className="text-gray-700">{c.repName}</strong></span>
                    <span>{new Date(c.calledAt).toLocaleString()}</span>
                    {c.followupDate && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        <Calendar className="w-3 h-3" /> Follow-up: {c.followupDate}
                      </span>
                    )}
                  </div>

                  {c.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                      {c.notes}
                    </p>
                  )}

                  {(c.scoreBreakdown?.alternateContact || c.scoreBreakdown?.referralDetails) && (
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {c.scoreBreakdown.alternateContact && (
                        <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                          Direct Contact: <strong>{c.scoreBreakdown.alternateContact}</strong>
                        </span>
                      )}
                      {c.scoreBreakdown.referralDetails && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Referral: <strong>{c.scoreBreakdown.referralDetails}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCall(c)}
                  className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 self-end lg:self-center cursor-pointer"
                  title="Delete call log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Log Call Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900">Log Donor / Partner Outreach Call</h3>
                <p className="text-xs text-gray-500">Use the live timer and 0–12 scorecard to rate call quality.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCall} className="p-5 space-y-5">
              {/* Live Stopwatch Widget */}
              <div className="p-4 rounded-2xl bg-[#0c1a05] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1e25e]">
                    Live Call Timer
                  </span>
                  <div className="text-3xl font-mono font-bold tracking-wider mt-0.5">
                    {formatDuration(timerSeconds)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning((r) => !r)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                      isTimerRunning ? 'bg-amber-500 text-white' : 'bg-[#558b1a] text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isTimerRunning ? 'Pause' : 'Start Timer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Link Existing Lead */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Link to CRM Lead (Optional)
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleSelectLead(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                >
                  <option value="">— Manual / Unlinked Contact —</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.organizationName} ({l.contactName}) {l.contactPhone ? `· ${l.contactPhone}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Chief Emeka Okafor"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. First Bank CSR"
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234 803 ..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Direction</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <option value="OUTBOUND">Outbound Call</option>
                    <option value="INBOUND">Inbound Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Call Outcome</label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as CallOutcome)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  >
                    {Object.entries(OUTCOME_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Follow-Up Date (Optional)</label>
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Manual Duration Override (optional — leave blank to use live timer)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="Mins"
                      value={manualMin}
                      onChange={(e) => setManualMin(e.target.value)}
                      className="w-24 px-3 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    />
                    <span className="text-xs text-gray-400">:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      placeholder="Secs"
                      value={manualSec}
                      onChange={(e) => setManualSec(e.target.value)}
                      className="w-24 px-3 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* 0-12 Call Quality Scorecard */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Call Quality Scorecard (0 – 12 pts)
                    </h4>
                    <p className="text-[11px] text-gray-500">Check all milestones achieved during this call.</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${liveScoreMeta.className}`}>
                    {liveScore} / 12 · {liveScoreMeta.label}
                  </span>
                </div>

                <div className="space-y-2">
                  {CALL_SCORE_CRITERIA.map((crit) => {
                    const checked = Boolean(scoreBreakdown[crit.key]);
                    return (
                      <button
                        key={crit.key}
                        type="button"
                        onClick={() =>
                          setScoreBreakdown((prev) => ({ ...prev, [crit.key]: !prev[crit.key] }))
                        }
                        className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                          checked
                            ? 'bg-[#f4faec] border-[#558b1a]/50'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              checked ? 'bg-[#558b1a] border-[#558b1a] text-white' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" />}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{crit.label}</p>
                            <p className="text-[10px] text-gray-500">{crit.description}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#558b1a] shrink-0">+{crit.points} pts</span>
                      </button>
                    );
                  })}
                </div>

                {scoreBreakdown.differentContact && (
                  <input
                    type="text"
                    value={scoreBreakdown.alternateContact || ''}
                    onChange={(e) =>
                      setScoreBreakdown((p) => ({ ...p, alternateContact: e.target.value }))
                    }
                    placeholder="Enter direct phone / email obtained..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-sky-200"
                  />
                )}
                {scoreBreakdown.referral && (
                  <input
                    type="text"
                    value={scoreBreakdown.referralDetails || ''}
                    onChange={(e) =>
                      setScoreBreakdown((p) => ({ ...p, referralDetails: e.target.value }))
                    }
                    placeholder="Enter referral full name & phone number..."
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-emerald-200"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Call Notes & Next Steps</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summary of conversation, pledge appetite, requested documents..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200"
                />
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
                  {saving ? 'Saving...' : 'Save Call Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
