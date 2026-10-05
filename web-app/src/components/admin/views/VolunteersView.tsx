'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { formatApplicationDate } from '@/lib/dateUtils';

export default function VolunteersView() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [volunteerHubFilter, setVolunteerHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');

  const {
    volunteers,
    setIsVolunteerModalOpen,
    handleUpdateVolunteerStatus,
    getRecordCountry,
    renderCountryBadge,
  } = useAdmin();

  return (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search volunteer by name or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-60 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>

                  {/* Country / Hub Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        volunteerHubFilter === 'all'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      All Hubs ({volunteers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('Nigeria')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        volunteerHubFilter === 'Nigeria'
                          ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇳🇬 Nigeria</span>
                      <span className="text-[10px] text-gray-400">
                        ({volunteers.filter((v) => getRecordCountry(v) === 'Nigeria').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('Rwanda')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        volunteerHubFilter === 'Rwanda'
                          ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇷🇼 Rwanda</span>
                      <span className="text-[10px] text-gray-400">
                        ({volunteers.filter((v) => getRecordCountry(v) === 'Rwanda').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('USA')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        volunteerHubFilter === 'USA'
                          ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇺🇸 USA</span>
                      <span className="text-[10px] text-gray-400">
                        ({volunteers.filter((v) => getRecordCountry(v) === 'USA').length})
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVolunteerModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Volunteer
                  </button>
                </div>
              </div>

              {/* Volunteers Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                      <th className="p-4">Volunteer</th>
                      <th className="p-4">Hub / Country</th>
                      <th className="p-4">Interest Area</th>
                      <th className="p-4">Availability & Location</th>
                      <th className="p-4">Experience / Bio</th>
                      <th className="p-4">Date of Application</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {volunteers
                      .filter((v) =>
                        volunteerHubFilter === 'all' ? true : getRecordCountry(v) === volunteerHubFilter
                      )
                      .filter((v) =>
                        searchQuery
                          ? v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.skillsExperience.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.location.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((vol) => {
                        const appDate = formatApplicationDate(vol.createdAt);
                        return (
                          <tr key={vol.id} className="hover:bg-gray-50/70 transition">
                            <td className="p-4">
                              <p className="font-bold text-gray-900">{vol.fullName}</p>
                              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {vol.email}
                              </p>
                              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {vol.phone}
                              </p>
                              {vol.resumeUrl && (
                                <a
                                  href={vol.resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-[#558b1a] hover:underline font-bold mt-1"
                                >
                                  <FileText className="w-3 h-3" /> View Resume / CV
                                </a>
                              )}
                            </td>
                            <td className="p-4">
                              {renderCountryBadge(getRecordCountry(vol))}
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                                {vol.interestArea}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-medium text-gray-800">{vol.availability}</p>
                              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {vol.location}
                              </p>
                            </td>
                            <td className="p-4 max-w-xs">
                              <p className="text-gray-600 line-clamp-2">{vol.skillsExperience}</p>
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
                              <span
                                className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                                  vol.status === 'approved' || vol.status === 'active'
                                      ? 'bg-emerald-100 text-emerald-800'
                                    : vol.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {vol.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <select
                                value={vol.status}
                                onChange={(e) => handleUpdateVolunteerStatus(vol.id!, e.target.value)}
                                className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium focus:outline-none"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="approved">Approved</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    {volunteers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No volunteers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  );
}
