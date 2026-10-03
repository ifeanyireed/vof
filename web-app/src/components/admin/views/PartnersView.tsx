'use client';

import React, { useState } from 'react';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function PartnersView() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [partnerHubFilter, setPartnerHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<string>('all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('all');

  const {
    partners,
    setSelectedPartner,
    setPartnerStatusUpdate,
    setPartnerNotesUpdate,
    handleUpdatePartnerStatus,
    handleDeletePartner,
    getRecordCountry,
    renderCountryBadge,
  } = useAdmin();

  return (
            <div className="space-y-6">
              {/* Partner Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Inquiries</span>
                  <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{partners.length}</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Corporate, schools & individuals</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Active Alliances</span>
                  <p className="font-serif text-2xl font-bold text-emerald-700 mt-1">
                    {partners.filter((p) => p.status === 'active').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Approved & executing programs</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">Corporate Entities</span>
                  <p className="font-serif text-2xl font-bold text-amber-700 mt-1">
                    {partners.filter((p) => p.partnerType === 'Corporate' || p.partnerType === 'Private Company').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Companies & CSR sponsors</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Academic & Schools</span>
                  <p className="font-serif text-2xl font-bold text-blue-700 mt-1">
                    {partners.filter((p) => p.partnerType === 'School' || p.partnerType === 'Academic').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Secondary & tertiary schools</span>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search organization, contact, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>

                  {/* Country Hub Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        partnerHubFilter === 'all'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      All Hubs ({partners.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('Nigeria')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        partnerHubFilter === 'Nigeria'
                          ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇳🇬 Nigeria</span>
                      <span className="text-[10px] text-gray-400">
                        ({partners.filter((p) => getRecordCountry(p) === 'Nigeria').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('Rwanda')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        partnerHubFilter === 'Rwanda'
                          ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇷🇼 Rwanda</span>
                      <span className="text-[10px] text-gray-400">
                        ({partners.filter((p) => getRecordCountry(p) === 'Rwanda').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('USA')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        partnerHubFilter === 'USA'
                          ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇺🇸 USA</span>
                      <span className="text-[10px] text-gray-400">
                        ({partners.filter((p) => getRecordCountry(p) === 'USA').length})
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={partnerTypeFilter}
                    onChange={(e) => setPartnerTypeFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                  >
                    <option value="all">All Partner Types</option>
                    <option value="Corporate">Corporate Entities</option>
                    <option value="School">Schools & Academies</option>
                    <option value="Private Company">Private Companies</option>
                    <option value="NGO">NGOs / Nonprofits</option>
                    <option value="Individual">Individuals / Donors</option>
                  </select>

                  <select
                    value={partnerStatusFilter}
                    onChange={(e) => setPartnerStatusFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                  >
                    <option value="all">All Review Statuses</option>
                    <option value="new">New Inquiries</option>
                    <option value="under_review">Under Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="active">Active Alliances</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              {/* Partners Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                      <th className="p-4">Organization & Type</th>
                      <th className="p-4">Hub / Country</th>
                      <th className="p-4">Contact Person</th>
                      <th className="p-4">Partnership Interest</th>
                      <th className="p-4">Proposal / Message</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {partners
                      .filter((p) => (partnerHubFilter === 'all' ? true : getRecordCountry(p) === partnerHubFilter))
                      .filter((p) => (partnerTypeFilter === 'all' ? true : p.partnerType.toLowerCase() === partnerTypeFilter.toLowerCase()))
                      .filter((p) => (partnerStatusFilter === 'all' ? true : p.status === partnerStatusFilter))
                      .filter((p) => {
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          p.organizationName.toLowerCase().includes(q) ||
                          p.contactPerson.toLowerCase().includes(q) ||
                          p.email.toLowerCase().includes(q) ||
                          (p.city && p.city.toLowerCase().includes(q)) ||
                          (p.partnershipInterest && p.partnershipInterest.toLowerCase().includes(q))
                        );
                      })
                      .map((partner) => (
                        <tr key={partner.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-gray-900 text-sm leading-snug">{partner.organizationName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-gray-700 text-[10px] font-bold border border-gray-200">
                                {partner.partnerType}
                              </span>
                              {partner.website && (
                                <a
                                  href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-0.5 text-[10px] text-[#558b1a] hover:underline font-semibold"
                                >
                                  <span>Site</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {renderCountryBadge(getRecordCountry(partner))}
                            {partner.city && (
                              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{partner.city}</span>
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{partner.contactPerson}</p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <a href={`mailto:${partner.email}`} className="hover:text-[#558b1a] hover:underline">
                                {partner.email}
                              </a>
                            </p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <a href={`tel:${partner.phone}`} className="hover:text-[#558b1a]">
                                {partner.phone}
                              </a>
                            </p>
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                              {partner.partnershipInterest || 'General Collaboration'}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-gray-600 line-clamp-2 leading-relaxed">
                              {partner.message || 'No proposal message provided.'}
                            </p>
                            {partner.message && partner.message.length > 70 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPartner(partner);
                                  setPartnerStatusUpdate(partner.status);
                                  setPartnerNotesUpdate(partner.notes || '');
                                }}
                                className="text-[10px] font-bold text-[#558b1a] hover:underline mt-1 cursor-pointer"
                              >
                                Read Full Proposal →
                              </button>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] inline-block ${
                                partner.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : partner.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : partner.status === 'under_review'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : partner.status === 'declined'
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {partner.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={partner.status}
                                onChange={(e) => handleUpdatePartnerStatus(partner.id!, e.target.value)}
                                className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium focus:outline-none cursor-pointer"
                              >
                                <option value="new">New</option>
                                <option value="under_review">Under Review</option>
                                <option value="contacted">Contacted</option>
                                <option value="active">Active</option>
                                <option value="declined">Declined</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPartner(partner);
                                  setPartnerStatusUpdate(partner.status);
                                  setPartnerNotesUpdate(partner.notes || '');
                                }}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                title="View Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePartner(partner.id!)}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Delete Partner"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {partners.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No partner inquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  );
}
