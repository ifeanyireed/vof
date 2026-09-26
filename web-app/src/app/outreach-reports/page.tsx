"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { outreachReports, OutreachReport, OutreachDocument } from "@/data/outreachReports";
import {
  IconCalendar,
  IconMapPin,
  IconCheck,
  IconArrowRight,
  IconFileText,
  IconShieldCheck,
  IconExternalLink,
  IconDownload,
  IconEye,
  IconX,
  IconSparkles,
  IconUsers,
  IconSchool,
  IconBriefcase,
  IconHeart,
  IconTrophy,
  IconSearch,
  IconMenu2,
  IconCopy,
  IconCoin
} from "@tabler/icons-react";
import Footer from "@/components/Footer";

export default function OutreachReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<OutreachDocument | null>(null);

  // Donation Modal state
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donationCurrency, setDonationCurrency] = useState<"NGN" | "USD" | "RWF">("NGN");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const categories = [
    "All",
    "Education & Scholarships",
    "Vocational Training",
    "Community Relief",
    "Academic Competitions"
  ];

  const years = ["All", "2026", "2025"];

  const filteredReports = useMemo(() => {
    return outreachReports.filter((report) => {
      const matchesCategory =
        selectedCategory === "All" || report.category === selectedCategory;
      const matchesYear =
        selectedYear === "All" || report.year.toString() === selectedYear;
      const matchesSearch =
        !searchQuery.trim() ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [selectedCategory, selectedYear, searchQuery]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports", active: true },
    { label: "Gallery", href: "/gallery" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "News & Stories", href: "/blog" },
    { label: "Support & FAQs", href: "/support" }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs transition-all">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
              alt="Veronica Onyeneke Foundation Logo"
              width={180}
              height={52}
              className="object-contain h-11 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-semibold transition-colors duration-200 text-xs xl:text-[13px] 2xl:text-sm whitespace-nowrap ${
                  item.active
                    ? "text-[#558b1a] font-bold"
                    : "text-gray-700 hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-xs cursor-pointer shadow-sm shrink-0"
            >
              Donate Now
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2.5 shadow-md"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-semibold py-1.5 ${
                    item.active ? "text-[#558b1a] font-bold" : "text-gray-700 hover:text-[#558b1a]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-[#558b1a] font-semibold">Field Outreach Reports</span>
        </nav>

        {/* Heading Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#4d7f16] text-xs font-bold uppercase tracking-wider mb-4"
          >
            <IconShieldCheck className="w-4 h-4" />
            <span>Verified Field Documentation & Transparency</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b2124] tracking-tight leading-tight mb-4"
          >
            Field Outreach & <span className="text-[#558b1a]">Impact Reports</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            A transparent, event-by-event record of the Veronica Onyeneke Foundation&apos;s direct humanitarian interventions, student academic sponsorships, vocational cohorts, and community relief drives across Nigeria and Rwanda.
          </motion.p>
        </div>

        {/* 3. KEY HIGHLIGHT METRICS BANNER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#558b1a] block mb-1">
              6+
            </span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Documented Field Events
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#558b1a] block mb-1">
              7
            </span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Geopolitical States Reached
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#558b1a] block mb-1">
              100+
            </span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Undergrads Empowered
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs text-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#558b1a] block mb-1">
              100%
            </span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Audit Transparency
            </span>
          </div>
        </div>

        {/* 4. CONTROLS: CATEGORIES, YEARS & SEARCH */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-10 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#558b1a] text-white shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Controls: Year & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200/70 text-xs">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedYear === year
                      ? "bg-gray-900 text-white font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="relative">
              <IconSearch className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#558b1a] w-36 sm:w-48 transition-all text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IconX className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. EVENT-BY-EVENT STRUCTURED SECTIONS */}
        <div className="space-y-12">
          {filteredReports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/80 shadow-xs">
              <IconFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-700 mb-1">No outreach reports found</h3>
              <p className="text-xs text-gray-400 mb-4">Try clearing filters or searching another keyword.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedYear("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#558b1a] text-white text-xs font-bold rounded-full hover:opacity-90"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredReports.map((report, idx) => (
              <motion.article
                key={report.id}
                id={report.slug}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Event Header Ribbon */}
                <div className="px-6 lg:px-8 py-5 border-b border-gray-100 bg-[#fbfdf9] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0]">
                        {report.category}
                      </span>
                      {report.theme && (
                        <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {report.theme}
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                      {report.title}
                    </h2>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-2 text-xs text-gray-500 shrink-0">
                    <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <IconCalendar className="w-4 h-4 text-[#558b1a]" />
                      <strong className="text-gray-800">{report.eventDate}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <IconMapPin className="w-4 h-4 text-[#558b1a]" />
                      <span>{report.venue}, {report.location}</span>
                    </span>
                  </div>
                </div>

                {/* Event Body Grid */}
                <div className="p-6 lg:p-8 space-y-8">
                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#558b1a] mb-2 flex items-center gap-1.5">
                      <IconSparkles className="w-3.5 h-3.5" />
                      <span>Executive Summary</span>
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-[15px] leading-relaxed">
                      {report.summary}
                    </p>
                  </div>

                  {/* Impact Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/70">
                    {report.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx} className="text-center p-2">
                        <span className="font-serif text-lg sm:text-xl font-bold text-[#558b1a] block">
                          {metric.count}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Key Objectives & Activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Objectives */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
                        Primary Objectives
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                        {report.objectives.map((obj, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-2">
                            <IconCheck className="w-4 h-4 text-[#558b1a] shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Activities */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
                        Key Activities & Outcomes
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                        {report.keyActivities.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#558b1a] shrink-0 mt-2" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Financial Breakdown Table (If Available) */}
                  {report.financials && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                          <IconCoin className="w-4 h-4 text-[#558b1a]" />
                          <span>Fiduciary & Expense Breakdown</span>
                        </h4>
                        <div className="text-xs font-semibold text-gray-600 space-x-3">
                          <span>Received: <strong className="text-gray-900">{report.financials.totalReceived}</strong></span>
                          <span>Spent: <strong className="text-[#558b1a]">{report.financials.totalSpent}</strong></span>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-gray-200/80">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-[11px] border-b border-gray-200/80">
                            <tr>
                              <th className="py-2.5 px-4">Line Item / Expense Description</th>
                              <th className="py-2.5 px-4 text-right">Amount (NGN)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {report.financials.items.map((item, fIdx) => (
                              <tr key={fIdx} className="hover:bg-gray-50/50">
                                <td className="py-2.5 px-4 font-medium">{item.item}</td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-gray-900">{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Signatories & Delegation */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-xs text-gray-500">
                      <span className="font-bold text-gray-800 block mb-1">Field Personnel & Volunteers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {report.delegationAndVolunteers.map((vol, vIdx) => (
                          <span key={vIdx} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px]">
                            <strong>{vol.name}</strong> ({vol.role})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/70 text-right self-stretch sm:self-auto shrink-0">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">
                        Officially Documented By
                      </span>
                      <span className="font-serif font-bold text-sm text-gray-900 block mt-0.5">
                        {report.signedBy.name}
                      </span>
                      <span className="text-[11px] text-[#558b1a] font-semibold">
                        {report.signedBy.title}
                      </span>
                    </div>
                  </div>

                  {/* Original Scanned Documents & Media Assets */}
                  {report.documents && report.documents.length > 0 && (
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                        <IconFileText className="w-3.5 h-3.5 text-[#558b1a]" />
                        <span>Original Field Documentation & Certified Scans ({report.documents.length})</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {report.documents.map((doc, dIdx) => (
                          <div
                            key={dIdx}
                            onClick={() => setPreviewDoc(doc)}
                            className="bg-stone-50 border border-stone-200/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                          >
                            <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                              <Image
                                src={doc.image}
                                alt={doc.title}
                                fill
                                className="object-contain p-2 group-hover:scale-103 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/95 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                                  <IconEye className="w-3 h-3 text-[#558b1a]" />
                                  <span>View Scan</span>
                                </span>
                              </div>
                            </div>
                            <div className="p-2.5 text-left bg-white border-t border-gray-100">
                              <span className="text-[11px] font-bold text-gray-900 block truncate">
                                {doc.title}
                              </span>
                              <span className="text-[10px] text-gray-400 capitalize">
                                {doc.type} Archive
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </main>

      {/* 6. ORIGINAL DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex flex-col items-center justify-center"
            onClick={() => setPreviewDoc(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-stone-50">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#558b1a] bg-[#f4faec] px-2 py-0.5 rounded-full border border-[#d6f0b0] inline-block mb-0.5">
                    Verified Field Document
                  </span>
                  <h4 className="font-serif text-base font-bold text-gray-900">{previewDoc.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDoc.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Open full resolution in new tab"
                  >
                    <IconExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={previewDoc.image}
                    download
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Download document"
                  >
                    <IconDownload className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <IconX className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative flex-1 p-4 bg-stone-100 flex items-center justify-center overflow-auto min-h-[60vh]">
                <img
                  src={previewDoc.image}
                  alt={previewDoc.title}
                  className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. SHARED FOOTER */}
      <Footer onDonateClick={() => setIsDonateOpen(true)} />

      {/* 8. DONATION MODAL */}
      <AnimatePresence>
        {isDonateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 backdrop-blur-md p-4 md:p-8"
          >
            <div className="absolute inset-0" onClick={() => setIsDonateOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white text-gray-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl z-10 p-6 md:p-8"
            >
              <button
                onClick={() => setIsDonateOpen(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
              >
                ✕
              </button>

              <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider block mb-1">
                Direct Program Funding
              </span>
              <h3 className="font-serif text-2xl font-bold mb-2">Support VOF Field Outreaches</h3>
              <p className="text-gray-500 text-xs mb-6">
                Your contributions directly fund verified community programs, school fees, and vocational training starter toolkits.
              </p>

              {/* Currency Selector */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-5 gap-1">
                <button
                  onClick={() => setDonationCurrency("NGN")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    donationCurrency === "NGN"
                      ? "bg-[#558b1a] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇳🇬 NGN (Nigeria)
                </button>
                <button
                  onClick={() => setDonationCurrency("RWF")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    donationCurrency === "RWF"
                      ? "bg-[#558b1a] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇷🇼 RWF (Rwanda)
                </button>
                <button
                  onClick={() => setDonationCurrency("USD")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    donationCurrency === "USD"
                      ? "bg-[#558b1a] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇺🇸 USD (501c3)
                </button>
              </div>

              {donationCurrency === "NGN" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                        Guaranty Trust Bank (GTBank)
                      </span>
                      <span className="text-lg font-mono font-bold text-gray-900 block mt-0.5">
                        3000273596
                      </span>
                      <span className="text-xs text-gray-600">
                        Veronica Onyeneke Foundation
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("3000273596", "gtb")}
                      className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-[#558b1a] hover:text-[#558b1a] flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      {copiedAccount === "gtb" ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {donationCurrency === "RWF" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                        Bank of Kigali (Rwanda Hub — RWF)
                      </span>
                      <span className="text-lg font-mono font-bold text-gray-900 block mt-0.5">
                        100267865048
                      </span>
                      <span className="text-xs text-gray-600">
                        Veronica Onyeneke Foundation
                      </span>
                      <div className="text-[11px] text-gray-700 font-mono mt-2 pt-2 border-t border-emerald-100 flex items-center gap-2">
                        <span className="text-gray-500 uppercase text-[9px]">IBAN:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("RW34040100267865048646", "bok-iban")}
                          className="font-bold text-gray-900 hover:text-[#558b1a] flex items-center gap-1 cursor-pointer"
                          title="Copy Bank of Kigali IBAN"
                        >
                          <span>RW34040100267865048646</span>
                          {copiedAccount === "bok-iban" ? <IconCheck className="w-2.5 h-2.5 text-green-600" /> : <IconCopy className="w-2.5 h-2.5 opacity-50" />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard("100267865048", "bok-acc")}
                      className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:border-[#558b1a] hover:text-[#558b1a] flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      {copiedAccount === "bok-acc" ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {donationCurrency === "USD" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#faf5ff] border border-purple-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">
                        Zelle (U.S. 501c3 Tax-Deductible)
                      </span>
                      <span className="text-base font-mono font-bold text-gray-900 block mt-0.5">
                        vofcorp@gmail.com
                      </span>
                      <span className="text-xs text-gray-600">
                        Veronica Onyeneke Foundation Corp.
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("vofcorp@gmail.com", "zelle")}
                      className="px-3.5 py-2 rounded-xl bg-white border border-purple-200 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      {copiedAccount === "zelle" ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>100% of public gifts go directly into outreach programs</span>
                <button
                  onClick={() => setIsDonateOpen(false)}
                  className="text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
