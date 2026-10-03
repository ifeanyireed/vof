'use client';

import React from 'react';
import {
  Plus,
  MapPin,
  CheckCircle2,
  Check,
  Eye,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function ProjectsView() {
  const {
    projects,
    setIsProjectModalOpen,
    setEditingProject,
    setProjectFormData,
    handleDeleteProject,
    formatMoney,
    popupSettings,
    setPopupSettings,
    setIsPreviewPopupOpen,
    isSavingPopup,
    handleSavePopupSettings,
  } = useAdmin();

  return (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">
                  Managing <strong>{projects.length}</strong> active & planned charity initiatives.
                </p>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectFormData({
                      title: '',
                      slug: '',
                      category: 'Vocational Education',
                      description: '',
                      targetAmount: 10000000,
                      raisedAmount: 0,
                      currency: 'NGN',
                      location: 'Mbieri, Imo State, Nigeria',
                      beneficiariesCount: 400,
                      status: 'active',
                      imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
                      startDate: '2026-02-01',
                      endDate: '2026-12-31',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Launch New Project
                </button>
              </div>

              {/* LANDING DONATE POP-UP MODAL CONFIGURATION PANEL */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#558b1a] flex items-center justify-center shrink-0">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900">
                          Landing Donate Pop-up Modal
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            popupSettings.isEnabled
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {popupSettings.isEnabled ? 'Active on Homepage' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Automatic campaign showcase pop-up that appears after landing on the homepage (guarded by visitor session storage).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsPreviewPopupOpen(true)}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>Preview Modal</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSavingPopup}
                      onClick={handleSavePopupSettings}
                      className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSavingPopup ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Toggle 1: Enabled / Disabled */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Modal Status</span>
                      <button
                        type="button"
                        onClick={() => setPopupSettings((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
                        className="cursor-pointer text-gray-700 focus:outline-none"
                      >
                        {popupSettings.isEnabled ? (
                          <ToggleRight className="w-8 h-8 text-[#558b1a]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {popupSettings.isEnabled
                        ? 'Pop-up triggers automatically when visitors land on the homepage.'
                        : 'Pop-up is disabled and will not show to visitors.'}
                    </p>
                  </div>

                  {/* Setting 2: Delay in Seconds */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">
                      Trigger Delay (Seconds)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={popupSettings.delaySeconds}
                        onChange={(e) =>
                          setPopupSettings((prev) => ({
                            ...prev,
                            delaySeconds: Math.max(1, parseInt(e.target.value) || 5),
                          }))
                        }
                        className="w-24 px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                      <span className="text-xs text-gray-500 font-medium">sec after landing</span>
                    </div>
                    <p className="text-[10px] text-gray-400">Recommended: 4 to 8 seconds</p>
                  </div>

                  {/* Setting 3: Modal Headline */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">
                      Pill Headline Tag
                    </label>
                    <input
                      type="text"
                      value={popupSettings.headline}
                      onChange={(e) => setPopupSettings((prev) => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g. Active Campaign"
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                    <p className="text-[10px] text-gray-400">Displays above campaign title</p>
                  </div>

                  {/* Setting 4: CTA Button Text & Mobile */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={popupSettings.ctaText}
                      onChange={(e) => setPopupSettings((prev) => ({ ...prev, ctaText: e.target.value }))}
                      placeholder="e.g. Donate Now"
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-600 font-medium">Show on mobile</span>
                      <button
                        type="button"
                        onClick={() => setPopupSettings((prev) => ({ ...prev, showOnMobile: !prev.showOnMobile }))}
                        className="cursor-pointer focus:outline-none"
                      >
                        {popupSettings.showOnMobile ? (
                          <ToggleRight className="w-6 h-6 text-[#558b1a]" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Smart Session Guard Enabled:</strong> When visitors click &ldquo;Later&rdquo; or close the modal, it stays dismissed for the remainder of their browser session (`vof_campaign_popup_seen`) so navigation remains pleasant.
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                    {popupSettings.updatedAt ? `Last saved: ${new Date(popupSettings.updatedAt).toLocaleTimeString()}` : ''}
                  </span>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => {
                  const pct = Math.min(100, Math.round((p.raisedAmount / p.targetAmount) * 100)) || 0;
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                      {p.imageUrl && (
                        <div className="w-full h-44 bg-gray-100 overflow-hidden relative border-b border-gray-100">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              (e.target as any).src = 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233536/vof/IMG01.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                              {p.category}
                            </span>
                            <h3 className="text-base font-bold text-gray-900 mt-2">{p.title}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" /> {p.location}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                              p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Progress */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-900">{formatMoney(p.raisedAmount, p.currency)}</span>
                            <span className="text-gray-500 font-medium">Target: {formatMoney(p.targetAmount, p.currency)}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#558b1a] to-[#7cb342] h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                            <span>{pct}% funded</span>
                            <span><strong>{p.beneficiariesCount}</strong> beneficiaries targeted</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
                        <span className="text-gray-500 text-[11px]">Duration: {p.startDate} - {p.endDate}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setProjectFormData(p);
                              setIsProjectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-semibold"
                          >
                            Edit
                          </button>
                          {p.id && (
                            <button
                              onClick={() => handleDeleteProject(p.id!)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
  );
}
