'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Target,
  FileText,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { formatApplicationDate } from '@/lib/dateUtils';

export default function ApplicationsView() {
  const [appTab, setAppTab] = useState<'scholarship' | 'skills'>('scholarship');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scholarshipHubFilter, setScholarshipHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');
  const [skillsHubFilter, setSkillsHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');

  const {
    scholarships,
    skills,
    handleUpdateScholarshipStatus,
    handleUpdateSkillStatus,
    getRecordCountry,
    renderCountryBadge,
    formatMoney,
  } = useAdmin();

  return (
            <div className="space-y-6">
              {/* Switcher Tab */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setAppTab('scholarship')}
                  className={`pb-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    appTab === 'scholarship'
                      ? 'border-[#558b1a] text-[#558b1a]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Scholarship Applications ({scholarships.length})
                </button>
                <button
                  onClick={() => setAppTab('skills')}
                  className={`pb-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    appTab === 'skills'
                      ? 'border-[#558b1a] text-[#558b1a]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  VOIE Skill Acquisition Institute ({skills.length})
                </button>
              </div>

              {/* Sub-tab 1: Scholarships */}
              {appTab === 'scholarship' && (
                <div className="space-y-4">
                  {/* Country Hub Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country Hub:</span>
                      <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            scholarshipHubFilter === 'all'
                              ? 'bg-white text-gray-900 shadow-xs'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          All Hubs ({scholarships.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('Nigeria')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            scholarshipHubFilter === 'Nigeria'
                              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇳🇬 Nigeria</span>
                          <span className="text-[10px] text-gray-400">
                            ({scholarships.filter((s) => getRecordCountry(s) === 'Nigeria').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('Rwanda')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            scholarshipHubFilter === 'Rwanda'
                              ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇷🇼 Rwanda</span>
                          <span className="text-[10px] text-gray-400">
                            ({scholarships.filter((s) => getRecordCountry(s) === 'Rwanda').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('USA')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            scholarshipHubFilter === 'USA'
                              ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇺🇸 USA</span>
                          <span className="text-[10px] text-gray-400">
                            ({scholarships.filter((s) => getRecordCountry(s) === 'USA').length})
                          </span>
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Showing <strong>{scholarships.filter((s) => scholarshipHubFilter === 'all' ? true : getRecordCountry(s) === scholarshipHubFilter).length}</strong> of {scholarships.length} applications
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Student Applicant</th>
                          <th className="p-4">Hub / Country</th>
                          <th className="p-4">Institution & Course</th>
                          <th className="p-4">Academic Level & CGPA</th>
                          <th className="p-4">Grant Requested</th>
                          <th className="p-4">Reason for Aid</th>
                          <th className="p-4">Date of Application</th>
                          <th className="p-4">Status & Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {scholarships
                          .filter((s) =>
                            scholarshipHubFilter === 'all' ? true : getRecordCountry(s) === scholarshipHubFilter
                          )
                          .map((s) => {
                            const appDate = formatApplicationDate(s.createdAt);
                            return (
                              <tr key={s.id} className="hover:bg-gray-50/70 transition">
                                <td className="p-4">
                                  <p className="font-bold text-gray-900">{s.applicantName}</p>
                                  <p className="text-[11px] text-gray-500">{s.email}</p>
                                  <p className="text-[11px] text-gray-400">{s.phone} • {s.stateOfOrigin} State</p>
                                  {s.documentUrl && (
                                    <a
                                      href={s.documentUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] text-[#558b1a] hover:underline font-bold mt-1"
                                    >
                                      <FileText className="w-3 h-3" /> View Transcript / ID
                                    </a>
                                  )}
                                </td>
                                <td className="p-4">
                                  {renderCountryBadge(getRecordCountry(s))}
                                </td>
                                <td className="p-4">
                                  <p className="font-semibold text-gray-900">{s.institutionName}</p>
                                  <p className="text-[11px] text-gray-500">{s.courseOfStudy}</p>
                                </td>
                                <td className="p-4">
                                  <p className="font-semibold text-gray-800">{s.currentLevel}</p>
                                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                    CGPA: {s.cgpa}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <p className="font-bold text-gray-900 text-sm">
                                    {formatMoney(s.amountRequested, getRecordCountry(s) === 'USA' ? 'USD' : 'NGN')}
                                  </p>
                                </td>
                                <td className="p-4 max-w-xs">
                                  <p className="text-gray-600 line-clamp-2 text-[11px]">{s.reasonForAid}</p>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <p className="font-semibold text-gray-900 text-xs flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                                    <span>{appDate.date}</span>
                                  </p>
                                  {appDate.time && (
                                    <p className="text-[10px] text-gray-400 pl-5">{appDate.time}</p>
                                  )}
                                </td>
                                <td className="p-4">
                                  <select
                                    value={s.status}
                                    onChange={(e) => handleUpdateScholarshipStatus(s.id!, e.target.value)}
                                    className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white font-medium focus:outline-none"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="disbursed">Disbursed</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        {scholarships.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                              No scholarship applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Skill Acquisition */}
              {appTab === 'skills' && (
                <div className="space-y-4">
                  {/* Country Hub Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country Hub:</span>
                      <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            skillsHubFilter === 'all'
                              ? 'bg-white text-gray-900 shadow-xs'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          All Hubs ({skills.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('Nigeria')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            skillsHubFilter === 'Nigeria'
                              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇳🇬 Nigeria</span>
                          <span className="text-[10px] text-gray-400">
                            ({skills.filter((k) => getRecordCountry(k) === 'Nigeria').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('Rwanda')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            skillsHubFilter === 'Rwanda'
                              ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇷🇼 Rwanda</span>
                          <span className="text-[10px] text-gray-400">
                            ({skills.filter((k) => getRecordCountry(k) === 'Rwanda').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('USA')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            skillsHubFilter === 'USA'
                              ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇺🇸 USA</span>
                          <span className="text-[10px] text-gray-400">
                            ({skills.filter((k) => getRecordCountry(k) === 'USA').length})
                          </span>
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Showing <strong>{skills.filter((k) => skillsHubFilter === 'all' ? true : getRecordCountry(k) === skillsHubFilter).length}</strong> of {skills.length} trainees
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Candidate</th>
                          <th className="p-4">Hub / Country</th>
                          <th className="p-4">Selected Trade</th>
                          <th className="p-4">Education & Status</th>
                          <th className="p-4">Statement of Purpose</th>
                          <th className="p-4">Batch</th>
                          <th className="p-4">Date of Application</th>
                          <th className="p-4">Enrollment Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {skills
                          .filter((k) =>
                            skillsHubFilter === 'all' ? true : getRecordCountry(k) === skillsHubFilter
                          )
                          .map((k) => {
                            const appDate = formatApplicationDate(k.createdAt);
                            return (
                              <tr key={k.id} className="hover:bg-gray-50/70 transition">
                                <td className="p-4">
                                  <p className="font-bold text-gray-900">{k.applicantName}</p>
                                  <p className="text-[11px] text-gray-500">{k.email}</p>
                                  <p className="text-[11px] text-gray-400">{k.phone} • {k.address}</p>
                                  {k.documentUrl && (
                                    <a
                                      href={k.documentUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] text-[#558b1a] hover:underline font-bold mt-1"
                                    >
                                      <FileText className="w-3 h-3" /> View ID / Document
                                    </a>
                                  )}
                                </td>
                                <td className="p-4">
                                  {renderCountryBadge(getRecordCountry(k))}
                                </td>
                                <td className="p-4">
                                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px]">
                                    {k.tradeSelected}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <p className="font-medium text-gray-900">{k.educationLevel}</p>
                                  <p className="text-[11px] text-gray-500">{k.employmentStatus}</p>
                                </td>
                                <td className="p-4 max-w-xs">
                                  <p className="text-gray-600 line-clamp-2 text-[11px]">{k.statementOfPurpose}</p>
                                </td>
                                <td className="p-4 text-gray-600 font-mono text-[11px]">
                                  {k.intakeBatch}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                  <p className="font-semibold text-gray-900 text-xs flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                                    <span>{appDate.date}</span>
                                  </p>
                                  {appDate.time && (
                                    <p className="text-[10px] text-gray-400 pl-5">{appDate.time}</p>
                                  )}
                                </td>
                                <td className="p-4">
                                  <select
                                    value={k.status}
                                    onChange={(e) => handleUpdateSkillStatus(k.id!, e.target.value)}
                                    className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white font-medium focus:outline-none"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="interview_scheduled">Interview Scheduled</option>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="graduated">Graduated</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        {skills.length === 0 && (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-500">
                              No skill acquisition applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
  );
}
