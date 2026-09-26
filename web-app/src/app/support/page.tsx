'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Copy,
  Check,
  Send,
  Building2,
  Heart,
  Globe2,
  ArrowRight,
  ShieldCheck,
  LifeBuoy,
  Menu,
  X
} from 'lucide-react';
import { faqItems, FAQ_CATEGORIES } from '@/data/faqs';
import DonateModal from '@/components/DonateModal';
import FooterDirectGiving from '@/components/FooterDirectGiving';
import Footer from '@/components/Footer';

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(faqItems[0]?.id || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // SWIFT copy feedback
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('General Support');
  const [inquiryHub, setInquiryHub] = useState('Nigeria HQ');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  // Donation Modal state
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(key);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) return;

    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setInquirySubmitted(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 600);
  };

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;

      const qText = item.q.toLowerCase();
      const aText = Array.isArray(item.a)
        ? item.a.join(' ').toLowerCase()
        : item.a.toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === '' || qText.includes(query) || aText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Gallery", href: "/gallery" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "News & Stories", href: "/blog" },
    { label: "Support & FAQs", href: "/support", active: true },
  ];

  return (
    <div className="min-h-screen bg-[#fbfdfa] text-[#1b2124] flex flex-col font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#152a0d] text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium border-b border-[#213f14] tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#8ac43e] animate-pulse" />
        <span>VOF Support Hub: Official Assistance, Institutional Inquiries & SWIFT Bank Channels</span>
        <span className="hidden md:inline text-white/50">|</span>
        <span className="hidden md:inline text-white/80">Nigeria • USA 501(c)(3) • Rwanda</span>
      </div>

      {/* 2. MAIN HEADER NAV (RESPONSIVE) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-xs ring-1 ring-black/5 bg-white p-1">
              <Image
                src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg"
                alt="Veronica Onyeneke Foundation Logo"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-base sm:text-lg text-[#1b2124] tracking-tight leading-none">
                Veronica Onyeneke
              </span>
              <span className="text-[10px] font-bold text-[#558b1a] uppercase tracking-widest mt-0.5">
                Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs xl:text-[13px] font-semibold text-gray-700">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors whitespace-nowrap ${
                  item.active ? "text-[#558b1a] font-bold border-b-2 border-[#558b1a] pb-0.5" : "hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/volunteer"
              className="hidden sm:inline-flex py-2 px-3 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#558b1a] hover:text-[#558b1a] transition-all"
            >
              Volunteer
            </Link>
            <button
              onClick={() => setIsDonateOpen(true)}
              className="py-2 px-4 sm:px-5 rounded-full bg-[#558b1a] hover:bg-[#467315] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate</span>
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2.5 shadow-sm"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-1.5 text-sm font-semibold ${
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

      {/* 3. HERO / BREADCRUMB */}
      <section className="relative bg-gradient-to-b from-[#f2f8eb] via-white to-[#fbfdfa] py-12 sm:py-16 border-b border-gray-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#558b1a]/10 border border-[#558b1a]/20 text-[#558b1a] text-xs font-bold uppercase tracking-wider mb-4">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Help, Inquiries & Support Center</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            How Can We Assist You Today?
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to frequently asked questions regarding our programs, application procedures, maternal support, tax deductibility, and international bank SWIFT wire transfers.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords (e.g. SWIFT, VOIE, maternal, scholarship, tax, 501c3)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-300/80 shadow-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. GLOBAL OFFICES CONTACT CARDS */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#558b1a] uppercase tracking-widest block mb-1">Direct Outreach</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Regional Offices & Hubs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nigeria Global HQ */}
            <div className="bg-[#fafcfa] border border-[#e3edd9] p-6 rounded-3xl shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🇳🇬</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Global HQ & VOIE
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">Nigeria Global Office</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#558b1a] shrink-0 mt-0.5" />
                <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</span>
              </p>
              <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#558b1a]" />
                  <a href="tel:+2349033736826" className="hover:text-[#558b1a] font-semibold">+234 903 373 6826</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#558b1a]" />
                  <a href="mailto:info@vonf.org" className="hover:text-[#558b1a]">info@vonf.org</a>
                </p>
                <p className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mon – Fri: 8:30 AM – 5:00 PM WAT</span>
                </p>
              </div>
            </div>

            {/* USA 501c3 */}
            <div className="bg-[#fafcfa] border border-[#e3edd9] p-6 rounded-3xl shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🇺🇸</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  501(c)(3) Tax Exempt
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">VOF Corp. (United States)</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#558b1a] shrink-0 mt-0.5" />
                <span>4196 S Himalaya Way, Aurora, CO 80013, USA.</span>
              </p>
              <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#558b1a]" />
                  <a href="tel:+17206754211" className="hover:text-[#558b1a] font-semibold">+1 (720) 675-4211</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#558b1a]" />
                  <a href="mailto:vofcorp@gmail.com" className="hover:text-[#558b1a]">vofcorp@gmail.com</a>
                </p>
                <p className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mon – Fri: 9:00 AM – 5:00 PM MT</span>
                </p>
              </div>
            </div>

            {/* Rwanda Regional Hub */}
            <div className="bg-[#fafcfa] border border-[#e3edd9] p-6 rounded-3xl shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🇷🇼</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                  East Africa Hub
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">VOF Rwanda Office</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#558b1a] shrink-0 mt-0.5" />
                <span>Kn82 Kiyovu Nyarurembo, Kigali, Rwanda.</span>
              </p>
              <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#558b1a]" />
                  <a href="tel:+250793156562" className="hover:text-[#558b1a] font-semibold">+250 793 156 562</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#558b1a]" />
                  <a href="mailto:admin.rwanda@vonf.org" className="hover:text-[#558b1a]">admin.rwanda@vonf.org</a>
                </p>
                <p className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mon – Fri: 8:30 AM – 5:00 PM CAT</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FAQ ACCORDION (MIGRATED & CATEGORIZED) */}
      <section id="faq-list" className="py-16 bg-[#fbfdf9] flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#558b1a] uppercase tracking-widest block mb-1">Knowledge Base</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Browse by topic or search above to find precise clarifications.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#558b1a] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200">
              <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-base">No Matching Questions Found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search query or send our administration team a direct message using the form below.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full px-6 py-4.5 flex items-center justify-between text-left font-serif font-bold text-base sm:text-lg text-gray-900 hover:text-[#558b1a] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3 pr-4">
                        <span className="text-xs uppercase font-sans font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#558b1a]/10 text-[#558b1a] shrink-0 mt-0.5">
                          {faq.category}
                        </span>
                        <span>{faq.q}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#558b1a] shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 space-y-2.5"
                        >
                          {Array.isArray(faq.a) ? (
                            faq.a.map((para, pIdx) => (
                              <p key={pIdx} className="leading-relaxed">
                                {para}
                              </p>
                            ))
                          ) : (
                            <p className="leading-relaxed">{faq.a}</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. BANK WIRE & SWIFT CODES HIGHLIGHT (INCLUDING BANK OF KIGALI) */}
      <section className="py-14 bg-gradient-to-br from-[#12230a] via-[#1a3310] to-[#0c1906] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#8ac43e] uppercase tracking-widest block mb-2">
              Official Wire Channels
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black">
              Bank Details & SWIFT Codes
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              For direct wire deposits, corporate grants, or international remittances, please quote the verified account and SWIFT details below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* GTBank Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-xs">Guaranty Trust Bank</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                    GTB • NGN
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-200">
                  <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[11px]">Account No:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">3000273596</span>
                      <button
                        onClick={() => copyToClipboard('3000273596', 'gtb-acc')}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy account number"
                      >
                        {copiedBank === 'gtb-acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[11px]">Bank SWIFT:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8ac43e] text-sm">GTBINGLA</span>
                      <button
                        onClick={() => copyToClipboard('GTBINGLA', 'gtb-swift')}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy SWIFT code"
                      >
                        {copiedBank === 'gtb-swift' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-300 pt-3 border-t border-white/10 mt-3">
                <strong>Name:</strong> Veronica Onyeneke Foundation
              </p>
            </div>

            {/* Zenith Bank Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-xs">Zenith Bank Plc</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/30">
                    ZENITH • NGN
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-200">
                  <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[11px]">Account No:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">1228980969</span>
                      <button
                        onClick={() => copyToClipboard('1228980969', 'zenith-acc')}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy account number"
                      >
                        {copiedBank === 'zenith-acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[11px]">Bank SWIFT:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8ac43e] text-sm">ZEIBNGLA</span>
                      <button
                        onClick={() => copyToClipboard('ZEIBNGLA', 'zenith-swift')}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy SWIFT code"
                      >
                        {copiedBank === 'zenith-swift' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-300 pt-3 border-t border-white/10 mt-3">
                <strong>Name:</strong> Veronica Onyeneke Foundation
              </p>
            </div>

            {/* Bank of Kigali Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-xs">Bank of Kigali (Rwanda Hub)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                    BOK • RWF
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-200">
                  <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[11px]">Account (RWF):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">100267865048</span>
                      <button
                        onClick={() => copyToClipboard('100267865048', 'bok-acc')}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy Bank of Kigali account"
                      >
                        {copiedBank === 'bok-acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[11px]">IBAN (RWF):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8ac43e] text-xs">RW34...8646</span>
                      <button
                        onClick={() => copyToClipboard('RW34040100267865048646', 'bok-iban')}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy Bank of Kigali IBAN"
                      >
                        {copiedBank === 'bok-iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-300 pt-3 border-t border-white/10 mt-3">
                <strong>Name:</strong> Veronica Onyeneke Foundation
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-300 bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <span>Transfer Reference Note: Please state your giving purpose: </span>
            <span className="font-bold text-[#8ac43e]">Pregnant Women Support</span>,{' '}
            <span className="font-bold text-[#8ac43e]">Youth Empowerment</span>, or{' '}
            <span className="font-bold text-[#8ac43e]">Education Sponsorship</span>.
          </div>
        </div>
      </section>

      {/* 7. DIRECT SUPPORT INQUIRY FORM */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#558b1a] uppercase tracking-widest block mb-1">Send a Message</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
              Submit a Support Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Need assistance with an application or partnership proposal? Our Secretariat will respond within 24 business hours.
            </p>
          </div>

          {inquirySubmitted ? (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">Inquiry Transmitted Successfully</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you for contacting the Veronica Onyeneke Foundation. An administrative officer from our secretariat will follow up with you promptly.
              </p>
              <button
                onClick={() => setInquirySubmitted(false)}
                className="mt-4 px-5 py-2.5 bg-[#558b1a] text-white text-xs font-bold rounded-xl hover:bg-[#467315]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="bg-stone-50/70 p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Chinelo Okonkwo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+234 ... / +1 ... / +250 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Regional Office Hub</label>
                  <select
                    value={inquiryHub}
                    onChange={(e) => setInquiryHub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white"
                  >
                    <option value="Nigeria HQ">🇳🇬 Nigeria HQ (Owerri / VOIE)</option>
                    <option value="USA 501c3">🇺🇸 USA 501(c)(3) Branch</option>
                    <option value="Rwanda Office">🇷🇼 Rwanda Regional Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry Topic</label>
                <select
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white"
                >
                  <option value="General Support">General Inquiries & Information</option>
                  <option value="Skills Application">VOIE Skills Acquisition Admission</option>
                  <option value="Scholarships">Scholarship Aid & UTME Grants</option>
                  <option value="Maternal Support">Maternal Care & Young Mothers Welfare</option>
                  <option value="Donation & SWIFT">Donations, Tax Exemption & SWIFT Wires</option>
                  <option value="Partnerships">Institutional & Corporate Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message / Question *</label>
                <textarea
                  rows={4}
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Please describe how we can assist you..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingInquiry}
                className="w-full py-3 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingInquiry ? 'Sending...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="relative w-full text-white overflow-hidden py-16 px-6 lg:px-16 isolate bg-[#091503] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-12">
            {/* Col 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-xs">
                <Link href="/about" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>About Us & Founder Story</span>
                </Link>
                <Link href="/programs" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Vocational Programs & Institute</span>
                </Link>
                <Link href="/outreach-reports" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Field Outreach Reports</span>
                </Link>
                <Link href="/gallery" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Photo & Impact Gallery</span>
                </Link>
                <Link href="/financial-reports" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Financial Transparency & Audit</span>
                </Link>
                <Link href="/support" className="text-[#8ac43e] font-semibold flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Support Center & FAQs</span>
                </Link>
              </div>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">🇳🇬 Nigeria (Global HQ)</h4>
              <p>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</p>
              <p>+234 903 373 6826 • info@vonf.org</p>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">🇺🇸 USA & 🇷🇼 Rwanda</h4>
              <p><strong>USA (501c3):</strong> 4196 S Himalaya Way, Aurora, CO 80013 • +1 (720) 675-4211</p>
              <p><strong>Rwanda:</strong> Kn82 Kiyovu Nyarurembo, Kigali • +250 793 156 562</p>
            </div>

            {/* Col 4 */}
            <FooterDirectGiving onDonateClick={() => setIsDonateOpen(true)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center border-t border-white/10 pt-6 text-xs text-gray-400 font-medium w-full">
            <div className="text-center md:text-left mb-3 md:mb-0">
              © {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.
            </div>
            <div className="text-center mb-3 md:mb-0 text-gray-300">
              Empowering Lives. Restoring Hope. Creating Opportunities.
            </div>
            <div className="text-center md:text-right text-[11px] text-gray-400 flex items-center justify-center md:justify-end gap-3">
              <span>501(c)(3) Nonprofit</span>
              <span>•</span>
              <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* DONATION MODAL */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />
    </div>
  );
}
