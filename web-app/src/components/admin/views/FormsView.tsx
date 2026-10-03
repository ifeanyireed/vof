'use client';

import React from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Check,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { api } from '@/lib/api';

export default function FormsView() {
  const {
    formVisibility,
    setFormVisibility,
    formStatuses,
    setFormStatuses,
    handleToggleFormVisibility,
    handleToggleFormStatus,
    popupSettings,
    setPopupSettings,
    setIsPreviewPopupOpen,
    setPreviewProjectIndex,
    isSavingPopup,
    handleSavePopupSettings,
    showNotification,
    loadAllData,
  } = useAdmin();

  return (
            <div className="space-y-8">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#0c1a05] via-[#162f0d] to-[#091503] text-white p-6 sm:p-8 rounded-3xl border border-[#2b5219] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ac43e]/20 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-2">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Intake & Forms Control Board</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">Forms Visibility & Status Controller</h2>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    Toggle which forms are visible on the dashboard below. Inspect interactive form views, test public submission pipelines, and manage program enrollment availability.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      (['skills', 'scholarship', 'volunteer', 'partner', 'donation'] as const).forEach((k) => {
                        if (!formVisibility[k]) handleToggleFormVisibility(k);
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Show All Forms (5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      (['skills', 'scholarship', 'volunteer', 'partner', 'donation'] as const).forEach((k) => {
                        if (formVisibility[k]) handleToggleFormVisibility(k);
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hide All</span>
                  </button>
                </div>
              </div>

              {/* Toggle Switchboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 1. Skills Acquisition Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.skills
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleFormVisibility('skills')}
                      className="cursor-pointer transition-colors"
                      title={formVisibility.skills ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.skills ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Skills Acquisition (VOIE)</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Vocational technical cohorts & workshop starter toolkits.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFormStatus('skills', formStatuses.skills === 'open' ? 'paused' : 'open')}
                      className={`font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        formStatuses.skills === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle intake between Open and Paused"
                    >
                      {formStatuses.skills === 'open' ? '● Open' : '⏸ Paused'}
                    </button>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.skills ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.skills ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 2. Scholarship Aid Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.scholarship
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleFormVisibility('scholarship')}
                      className="cursor-pointer transition-colors"
                      title={formVisibility.scholarship ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.scholarship ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Scholarship Aid Form</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    JAMB fees, secondary school tuition & university grants.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFormStatus('scholarship', formStatuses.scholarship === 'open' ? 'paused' : 'open')}
                      className={`font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        formStatuses.scholarship === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle intake between Open and Paused"
                    >
                      {formStatuses.scholarship === 'open' ? '● Open' : '⏸ Paused'}
                    </button>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.scholarship ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.scholarship ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 3. Volunteer Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.volunteer
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleFormVisibility('volunteer')}
                      className="cursor-pointer transition-colors"
                      title={formVisibility.volunteer ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.volunteer ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Volunteer Registration</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Mentorship, community outreach, and logistics volunteers.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFormStatus('volunteer', formStatuses.volunteer === 'open' ? 'paused' : 'open')}
                      className={`font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        formStatuses.volunteer === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle intake between Open and Paused"
                    >
                      {formStatuses.volunteer === 'open' ? '● Open' : '⏸ Paused'}
                    </button>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.volunteer ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.volunteer ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 4. Strategic Partner Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.partner
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleFormVisibility('partner')}
                      className="cursor-pointer transition-colors"
                      title={formVisibility.partner ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.partner ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Partnership Proposal</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Corporate CSR alliances, academic institutions & foundations.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFormStatus('partner', formStatuses.partner === 'open' ? 'paused' : 'open')}
                      className={`font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        formStatuses.partner === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle intake between Open and Paused"
                    >
                      {formStatuses.partner === 'open' ? '● Open' : '⏸ Paused'}
                    </button>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.partner ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.partner ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 5. Direct Donation Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.donation
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      5
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleFormVisibility('donation')}
                      className="cursor-pointer transition-colors"
                      title={formVisibility.donation ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.donation ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Donation & Giving Form</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Pregnant Women, Youth, Education + SWIFT Wire channels.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFormStatus('donation', formStatuses.donation === 'open' ? 'paused' : 'open')}
                      className={`font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        formStatuses.donation === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Click to toggle intake between Open and Paused"
                    >
                      {formStatuses.donation === 'open' ? '● Open' : '⏸ Paused'}
                    </button>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.donation ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.donation ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RENDERED FORMS CONTAINER */}
              <div className="space-y-8 pt-4">
                {/* 1. Skills Acquisition Form View */}
                {formVisibility.skills && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-purple-50/70 border-b border-purple-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-200 text-purple-900">
                            VOIE Vocational Program
                          </span>
                          <span className="text-[11px] text-purple-800 font-semibold">
                            Application Intake (Nigeria & Rwanda)
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Skills Acquisition Application Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/apply/skills"
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white text-purple-900 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Public Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleFormVisibility('skills')}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-gray-500 mb-4">
                        Note: The Skills Acquisition program operates strictly in <strong>Nigeria</strong> and <strong>Rwanda</strong>. The USA hub is intentionally excluded.
                      </p>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testSkillName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testSkillEmail') as HTMLInputElement)?.value;
                          const phone = (target.elements.namedItem('testSkillPhone') as HTMLInputElement)?.value;
                          const program = (target.elements.namedItem('testSkillProgram') as HTMLSelectElement)?.value;
                          const hub = (target.elements.namedItem('testSkillHub') as HTMLSelectElement)?.value;
                          try {
                            await api.createSkill({
                              applicantName: name || 'Test Applicant',
                              fullName: name || 'Test Applicant',
                              email: email || 'applicant@example.com',
                              phone: phone || '+234 801 234 5678',
                              tradeSelected: program || 'Fashion Design & Tailoring',
                              chosenProgram: program || 'Fashion Design & Tailoring',
                              centerLocation: hub === 'Rwanda' ? 'Kigali Training Center' : 'VOIE Mbieri, Imo State',
                              country: hub as 'Nigeria' | 'Rwanda',
                              status: 'pending',
                            });
                            showNotification('success', `Test Skills application submitted for ${name}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Country Hub (2 Hubs)</label>
                          <select
                            name="testSkillHub"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Nigeria">🇳🇬 Nigeria (VOIE HQ, Imo State)</option>
                            <option value="Rwanda">🇷🇼 Rwanda (Kigali Training Center)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Applicant Full Name *</label>
                          <input
                            name="testSkillName"
                            required
                            placeholder="e.g. Grace Amarachi"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                          <input
                            name="testSkillPhone"
                            required
                            placeholder="+234 800 000 0000"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                          <input
                            name="testSkillEmail"
                            type="email"
                            placeholder="grace@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Vocational Trade Chosen</label>
                          <select
                            name="testSkillProgram"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Fashion Design & Tailoring">Fashion Design & Tailoring</option>
                            <option value="Solar Installation & Electrical">Solar Installation & Electrical</option>
                            <option value="ICT & Digital Skills">ICT & Digital Skills</option>
                            <option value="Cosmetology & Hairdressing">Cosmetology & Hairdressing</option>
                            <option value="Footwear & Leatherwork">Footwear & Leatherwork</option>
                            <option value="Plumbing & Pipefitting">Plumbing & Pipefitting</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submit Direct Entry (VOIE)</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 2. Scholarship Aid Form View */}
                {formVisibility.scholarship && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900">
                            Academic Sponsorship
                          </span>
                          <span className="text-[11px] text-emerald-800 font-semibold">
                            JAMB, Secondary & Tertiary Scholarships (Nigeria & Rwanda)
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Scholarship Application Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/apply/scholarship"
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Public Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleFormVisibility('scholarship')}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-gray-500 mb-4">
                        Note: Scholarships are available strictly across <strong>Nigeria</strong> and <strong>Rwanda</strong>. The USA hub is intentionally excluded.
                      </p>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testScholName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testScholEmail') as HTMLInputElement)?.value;
                          const phone = (target.elements.namedItem('testScholPhone') as HTMLInputElement)?.value;
                          const level = (target.elements.namedItem('testScholLevel') as HTMLSelectElement)?.value;
                          const inst = (target.elements.namedItem('testScholInst') as HTMLInputElement)?.value;
                          const hub = (target.elements.namedItem('testScholHub') as HTMLSelectElement)?.value;
                          try {
                            await api.createScholarship({
                              applicantName: name || 'Test Student',
                              fullName: name || 'Test Student',
                              email: email || 'student@example.com',
                              phone: phone || '+234 800 111 2222',
                              scholarshipType: level || 'JAMB / UTME Registration Fee Grant',
                              institutionName: inst || 'Alvan Ikoku Federal Univ. of Education',
                              country: hub as 'Nigeria' | 'Rwanda',
                              status: 'pending',
                            });
                            showNotification('success', `Scholarship entry logged for ${name}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Country Hub (2 Hubs)</label>
                          <select
                            name="testScholHub"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Nigeria">🇳🇬 Nigeria (Global HQ & Schools)</option>
                            <option value="Rwanda">🇷🇼 Rwanda (Kigali Education Partnerships)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Student Full Name *</label>
                          <input
                            name="testScholName"
                            required
                            placeholder="e.g. Uchechukwu Obi"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                          <input
                            name="testScholPhone"
                            required
                            placeholder="+234 ..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                          <input
                            name="testScholEmail"
                            type="email"
                            placeholder="uche@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Scholarship Milestone</label>
                          <select
                            name="testScholLevel"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="JAMB / UTME Registration Fee Grant">JAMB / UTME Examination Grant</option>
                            <option value="Secondary School Tuition Sponsorship">Secondary School Sponsorship</option>
                            <option value="University Degree Scholarship (Beyond the Degree)">University Grant (&quot;Beyond the Degree&quot;)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Institution Name</label>
                          <input
                            name="testScholInst"
                            placeholder="e.g. Saint Paul's Secondary / AIFUE"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                          <button
                            type="submit"
                            className="py-2.5 px-6 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submit Direct Scholarship Entry</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 3. Volunteer Registration Form View */}
                {formVisibility.volunteer && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-200 text-blue-900">
                            Volunteer Service
                          </span>
                          <span className="text-[11px] text-blue-800 font-semibold">
                            Nigeria, Rwanda & USA Hubs
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Volunteer Registration Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/volunteer"
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white text-blue-900 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Public Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleFormVisibility('volunteer')}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testVolName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testVolEmail') as HTMLInputElement)?.value;
                          const phone = (target.elements.namedItem('testVolPhone') as HTMLInputElement)?.value;
                          const area = (target.elements.namedItem('testVolArea') as HTMLSelectElement)?.value;
                          const hub = (target.elements.namedItem('testVolHub') as HTMLSelectElement)?.value;
                          try {
                            await api.createVolunteer({
                              fullName: name || 'Test Volunteer',
                              email: email || 'volunteer@example.com',
                              phone: phone || '+234 ...',
                              location: hub,
                              interestArea: area || 'VOIE Skills Mentorship',
                              availability: 'Weekends',
                              status: 'new',
                            });
                            showNotification('success', `Volunteer registered: ${name}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Country Hub (3 Hubs)</label>
                          <select
                            name="testVolHub"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Nigeria">🇳🇬 Nigeria Hub (Imo State)</option>
                            <option value="Rwanda">🇷🇼 Rwanda Hub (Kigali)</option>
                            <option value="USA">🇺🇸 United States (501c3 Diaspora)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Volunteer Full Name *</label>
                          <input
                            name="testVolName"
                            required
                            placeholder="e.g. David Nnamdi"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                          <input
                            name="testVolEmail"
                            required
                            type="email"
                            placeholder="david@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                          <input
                            name="testVolPhone"
                            placeholder="+234 ... / +1 ..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Area of Contribution</label>
                          <select
                            name="testVolArea"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="VOIE Skills Mentorship">VOIE Skills Mentorship & Technical Coaching</option>
                            <option value="Maternal Care & Young Mothers">Maternal Care & Young Mothers Counseling</option>
                            <option value="Field Outreach Logistics">Field Outreach & Food Distribution</option>
                            <option value="Digital Media & Photography">Digital Media, Design & Communications</option>
                            <option value="Academic Tutoring">Academic Tutoring & JAMB Coaching</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Register Volunteer</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. Strategic Partner Proposal Form View */}
                {formVisibility.partner && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                            Strategic Alliances
                          </span>
                          <span className="text-[11px] text-amber-800 font-semibold">
                            Corporate CSR, University & Healthcare Proposals
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Partner Proposal Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFormVisibility('partner')}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const org = (target.elements.namedItem('testPartOrg') as HTMLInputElement)?.value;
                          const contact = (target.elements.namedItem('testPartContact') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testPartEmail') as HTMLInputElement)?.value;
                          const type = (target.elements.namedItem('testPartType') as HTMLSelectElement)?.value;
                          const focus = (target.elements.namedItem('testPartFocus') as HTMLInputElement)?.value;
                          try {
                            await api.createPartner({
                              organizationName: org || 'Acme Group',
                              contactPerson: contact || 'Director of CSR',
                              email: email || 'csr@acme.com',
                              phone: '+1 555 019 2834',
                              partnerType: type || 'Corporate',
                              focusArea: focus || 'Youth Skills Cohort Sponsorship',
                              status: 'new',
                            });
                            showNotification('success', `Partner inquiry recorded: ${org}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Organization Name *</label>
                          <input
                            name="testPartOrg"
                            required
                            placeholder="e.g. Zenith Bank CSR / MTN Foundation"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Contact Person *</label>
                          <input
                            name="testPartContact"
                            required
                            placeholder="e.g. Dr. Ngozi Balogun"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Official Email *</label>
                          <input
                            name="testPartEmail"
                            required
                            type="email"
                            placeholder="ngozi@organization.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Organization Category</label>
                          <select
                            name="testPartType"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Corporate">Corporate / Private Business</option>
                            <option value="School">School / Academic University</option>
                            <option value="NGO">International NGO / Foundation</option>
                            <option value="Healthcare">Hospital / Healthcare Facility</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Focus Area</label>
                          <input
                            name="testPartFocus"
                            placeholder="e.g. Solar toolkits & Maternal care kits"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Log Partner Proposal</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5. Direct Donation & Giving Form View */}
                {formVisibility.donation && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-rose-50/70 border-b border-rose-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900">
                            Donation Intake
                          </span>
                          <span className="text-[11px] text-rose-800 font-semibold">
                            3 Purposes: Pregnant Women, Youth & Education + SWIFT Wire
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Direct Donation & Purpose Routing Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFormVisibility('donation')}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* SWIFT Codes Box */}
                      <div className="mb-5 p-4 rounded-2xl bg-stone-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div>
                          <span className="font-bold text-gray-900 block">GTBank (NGN)</span>
                          <span className="font-mono text-gray-700">0923058866</span> • <span className="font-bold text-[#558b1a]">SWIFT: GTBINGLA</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">Zenith Bank (NGN)</span>
                          <span className="font-mono text-gray-700">1310650942</span> • <span className="font-bold text-[#558b1a]">SWIFT: ZEIBNGLA</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">Bank of Kigali (RWF)</span>
                          <span className="font-mono text-gray-700">100267865048</span> • <span className="font-bold text-blue-700">IBAN: RW34...8646</span>
                        </div>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testDonName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testDonEmail') as HTMLInputElement)?.value;
                          const amount = parseFloat((target.elements.namedItem('testDonAmount') as HTMLInputElement)?.value || '50000');
                          const curr = (target.elements.namedItem('testDonCurr') as HTMLSelectElement)?.value || 'NGN';
                          const purposeVal = (target.elements.namedItem('testDonPurpose') as HTMLSelectElement)?.value;
                          const methodVal = (target.elements.namedItem('testDonMethod') as HTMLSelectElement)?.value;
                          try {
                            await api.createDonation({
                              donorName: name || 'Anonymous Donor',
                              donorEmail: email || 'donor@example.com',
                              amount: amount,
                              currency: curr,
                              campaign: purposeVal || 'Pregnant Women Support',
                              paymentMethod: methodVal || 'Zenith Bank Transfer',
                              reference: `ADM-${Date.now().toString().slice(-6)}`,
                              status: 'completed',
                              notes: `Direct administrative entry via Forms Controller (${purposeVal})`,
                            });
                            showNotification('success', `Donation recorded under ${purposeVal}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">
                            Designated Purpose * (Routes to Filterable List)
                          </label>
                          <select
                            name="testDonPurpose"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-semibold text-rose-900"
                          >
                            <option value="Pregnant Women Support">Pregnant Women Support</option>
                            <option value="Youth Empowerment">Youth Empowerment</option>
                            <option value="Education Sponsorship">Education Sponsorship</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Donor Name *</label>
                          <input
                            name="testDonName"
                            required
                            placeholder="e.g. Chief Raymond Nkem"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Donor Email / Phone</label>
                          <input
                            name="testDonEmail"
                            placeholder="raymond@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Donation Amount</label>
                          <input
                            name="testDonAmount"
                            type="number"
                            defaultValue={50000}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none font-bold text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Currency</label>
                          <select
                            name="testDonCurr"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="NGN">NGN (₦ Nigerian Naira)</option>
                            <option value="USD">USD ($ US Dollar)</option>
                            <option value="RWF">RWF (Rwanda Francs)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Payment Channel</label>
                          <select
                            name="testDonMethod"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Paystack">Paystack Online</option>
                            <option value="Zenith Bank Transfer">Zenith Bank Transfer (SWIFT: ZEIBNGLA)</option>
                            <option value="GTBank Transfer">GTBank Transfer (SWIFT: GTBINGLA)</option>
                            <option value="Bank of Kigali">Bank of Kigali Transfer (RWF)</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Stripe">Stripe</option>
                            <option value="Zelle">Zelle (vofcorp@gmail.com)</option>
                          </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                          <button
                            type="submit"
                            className="py-2.5 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Log Donation & Route to Filterable List</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
  );
}
