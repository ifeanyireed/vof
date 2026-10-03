'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Plus,
  Search,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function DonationsView() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [donationPurposeFilter, setDonationPurposeFilter] = useState<string>('all');
  const [donationMethodFilter, setDonationMethodFilter] = useState<string>('all');
  const [donationStatusFilter, setDonationStatusFilter] = useState<string>('all');

  const {
    donations,
    projects,
    setIsDonationModalOpen,
    setDonationFormData,
    formatMoney,
  } = useAdmin();

            const pregnantDonations = donations.filter(
              (d) =>
                (d.campaign && d.campaign.toLowerCase().includes('pregnant')) ||
                (d.notes && d.notes.toLowerCase().includes('pregnant'))
            );
            const youthDonations = donations.filter(
              (d) =>
                d.campaign &&
                (d.campaign.toLowerCase().includes('youth') ||
                  d.campaign.toLowerCase().includes('voie') ||
                  d.campaign.toLowerCase().includes('vocational') ||
                  d.campaign.toLowerCase().includes('skills'))
            );
            const educationDonations = donations.filter(
              (d) =>
                d.campaign &&
                (d.campaign.toLowerCase().includes('education') ||
                  d.campaign.toLowerCase().includes('scholarship'))
            );

            const filteredDonations = donations.filter((d) => {
              // Search Filter
              const matchesSearch = searchQuery
                ? d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (d.reference && d.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (d.donorEmail && d.donorEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (d.notes && d.notes.toLowerCase().includes(searchQuery.toLowerCase()))
                : true;

              // Purpose Filter
              let matchesPurpose = true;
              if (donationPurposeFilter === 'Pregnant Women Support') {
                matchesPurpose = Boolean(
                  (d.campaign && d.campaign.toLowerCase().includes('pregnant')) ||
                  (d.notes && d.notes.toLowerCase().includes('pregnant'))
                );
              } else if (donationPurposeFilter === 'Youth Empowerment') {
                matchesPurpose = Boolean(
                  d.campaign &&
                  (d.campaign.toLowerCase().includes('youth') ||
                    d.campaign.toLowerCase().includes('voie') ||
                    d.campaign.toLowerCase().includes('vocational') ||
                    d.campaign.toLowerCase().includes('skills'))
                );
              } else if (donationPurposeFilter === 'Education Sponsorship') {
                matchesPurpose = Boolean(
                  d.campaign &&
                  (d.campaign.toLowerCase().includes('education') ||
                    d.campaign.toLowerCase().includes('scholarship'))
                );
              } else if (donationPurposeFilter === 'other') {
                const isMainThree = Boolean(
                  d.campaign &&
                  (d.campaign.toLowerCase().includes('pregnant') ||
                    d.campaign.toLowerCase().includes('youth') ||
                    d.campaign.toLowerCase().includes('voie') ||
                    d.campaign.toLowerCase().includes('vocational') ||
                    d.campaign.toLowerCase().includes('education') ||
                    d.campaign.toLowerCase().includes('scholarship'))
                );
                matchesPurpose = !isMainThree;
              }

              // Method Filter
              let matchesMethod = true;
              if (donationMethodFilter !== 'all') {
                matchesMethod = d.paymentMethod.toLowerCase().includes(donationMethodFilter.toLowerCase());
              }

              // Status Filter
              let matchesStatus = true;
              if (donationStatusFilter !== 'all') {
                matchesStatus = d.status.toLowerCase() === donationStatusFilter.toLowerCase();
              }

              return matchesSearch && matchesPurpose && matchesMethod && matchesStatus;
            });

            return (
              <div className="space-y-6">
                {/* 3a. Purpose Summary Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* All Donations */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Donations</span>
                    <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{donations.length}</p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">Logged across all channels</span>
                  </div>

                  {/* Pregnant Women Support */}
                  <div
                    onClick={() => setDonationPurposeFilter(donationPurposeFilter === 'Pregnant Women Support' ? 'all' : 'Pregnant Women Support')}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      donationPurposeFilter === 'Pregnant Women Support'
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:border-rose-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block flex items-center justify-between">
                      <span>Pregnant Women</span>
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    </span>
                    <p className="font-serif text-2xl font-bold text-rose-900 mt-1">{pregnantDonations.length}</p>
                    <span className="text-[10px] text-rose-600 mt-0.5 block">Maternal care & baby packs</span>
                  </div>

                  {/* Youth Empowerment */}
                  <div
                    onClick={() => setDonationPurposeFilter(donationPurposeFilter === 'Youth Empowerment' ? 'all' : 'Youth Empowerment')}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      donationPurposeFilter === 'Youth Empowerment'
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block flex items-center justify-between">
                      <span>Youth Empowerment</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    </span>
                    <p className="font-serif text-2xl font-bold text-amber-900 mt-1">{youthDonations.length}</p>
                    <span className="text-[10px] text-amber-600 mt-0.5 block">VOIE technical trades & tools</span>
                  </div>

                  {/* Education Sponsorship */}
                  <div
                    onClick={() => setDonationPurposeFilter(donationPurposeFilter === 'Education Sponsorship' ? 'all' : 'Education Sponsorship')}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      donationPurposeFilter === 'Education Sponsorship'
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block flex items-center justify-between">
                      <span>Education Aid</span>
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    </span>
                    <p className="font-serif text-2xl font-bold text-blue-900 mt-1">{educationDonations.length}</p>
                    <span className="text-[10px] text-blue-600 mt-0.5 block">JAMB, school fees & grants</span>
                  </div>
                </div>

                {/* 3b. Filterable Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search donor, reference, note..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-60 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                    </div>

                    {/* Purpose Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          donationPurposeFilter === 'all'
                            ? 'bg-white text-gray-900 shadow-xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        All Causes ({donations.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('Pregnant Women Support')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          donationPurposeFilter === 'Pregnant Women Support'
                            ? 'bg-rose-50 text-rose-900 shadow-xs ring-1 ring-rose-300'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Pregnant Women</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('Youth Empowerment')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          donationPurposeFilter === 'Youth Empowerment'
                            ? 'bg-amber-50 text-amber-900 shadow-xs ring-1 ring-amber-300'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Youth Empowerment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('Education Sponsorship')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          donationPurposeFilter === 'Education Sponsorship'
                            ? 'bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-300'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Education Aid</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Payment Method Filter */}
                    <select
                      value={donationMethodFilter}
                      onChange={(e) => setDonationMethodFilter(e.target.value)}
                      className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                    >
                      <option value="all">All Channels</option>
                      <option value="Paystack">Paystack Online</option>
                      <option value="Zenith">Zenith Bank Transfer</option>
                      <option value="GTBank">GTBank Transfer</option>
                      <option value="Kigali">Bank of Kigali (RWF)</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Zelle">Zelle 501(c)(3)</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={donationStatusFilter}
                      onChange={(e) => setDonationStatusFilter(e.target.value)}
                      className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="pledged">Pledged</option>
                    </select>

                    <button
                      onClick={() => setIsDonationModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Donation</span>
                    </button>
                  </div>
                </div>

                {/* 3c. Filterable Donations Table */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  {filteredDonations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <HeartHandshake className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">No donations match your filter</p>
                      <p className="text-xs text-gray-400 mt-1">Try resetting the purpose or channel filter</p>
                      <button
                        onClick={() => {
                          setDonationPurposeFilter('all');
                          setDonationMethodFilter('all');
                          setDonationStatusFilter('all');
                          setSearchQuery('');
                        }}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Donor Name & Contact</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Designated Purpose</th>
                          <th className="p-4">Payment Channel & Ref</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredDonations.map((d) => {
                          const isPregnant =
                            (d.campaign && d.campaign.toLowerCase().includes('pregnant')) ||
                            (d.notes && d.notes.toLowerCase().includes('pregnant'));
                          const isYouth =
                            d.campaign &&
                            (d.campaign.toLowerCase().includes('youth') ||
                              d.campaign.toLowerCase().includes('voie') ||
                              d.campaign.toLowerCase().includes('vocational') ||
                              d.campaign.toLowerCase().includes('skills'));
                          const isEducation =
                            d.campaign &&
                            (d.campaign.toLowerCase().includes('education') ||
                              d.campaign.toLowerCase().includes('scholarship'));

                          return (
                            <tr key={d.id} className="hover:bg-gray-50/70 transition">
                              <td className="p-4">
                                <p className="font-bold text-gray-900">{d.donorName}</p>
                                <p className="text-[11px] text-gray-500">{d.donorEmail || d.donorPhone || 'Direct Transfer'}</p>
                                {d.notes && <p className="text-[10px] text-gray-400 italic mt-0.5">&ldquo;{d.notes}&rdquo;</p>}
                              </td>
                              <td className="p-4">
                                <p className="font-black text-emerald-800 text-sm">
                                  {formatMoney(d.amount, d.currency)}
                                </p>
                                <span className="text-[10px] text-gray-500 font-mono uppercase">{d.currency}</span>
                              </td>
                              <td className="p-4">
                                {isPregnant ? (
                                  <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    Pregnant Women Support
                                  </span>
                                ) : isYouth ? (
                                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Youth Empowerment
                                  </span>
                                ) : isEducation ? (
                                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Education Sponsorship
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 border border-stone-200 rounded-full font-medium text-[10px]">
                                    {d.campaign || 'General Foundation Fund'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="font-medium text-gray-700">{d.paymentMethod}</p>
                                {d.reference && <p className="text-[10px] text-gray-400 font-mono">Ref: {d.reference}</p>}
                              </td>
                              <td className="p-4 text-gray-600">
                                {new Date(d.donatedAt).toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                                    d.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
}
