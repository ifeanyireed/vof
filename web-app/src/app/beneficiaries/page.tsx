'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSchool,
  IconSearch,
  IconAward,
  IconSparkles,
  IconHeart,
  IconMapPin,
  IconArrowRight,
  IconBriefcase,
  IconStar,
  IconUsers,
  IconBook,
  IconCalendar,
  IconCheck,
  IconX,
  IconChevronRight,
  IconExternalLink,
  IconShieldCheck,
} from '@tabler/icons-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DonateModal, { DonationMethod, DonationFrequency } from '@/components/DonateModal';
import { api, BeneficiaryItem } from '@/lib/api';

// Fallback initial cohorts to ensure immediate graceful rendering before/during API fetch
const FALLBACK_BENEFICIARIES: BeneficiaryItem[] = [
  {
    id: 1,
    fullName: 'Chiamaka Eze',
    category: 'Primary',
    institution: 'Community Primary School, Mbieri',
    classLevel: 'Primary 4',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Chiamaka is a diligent primary pupil whose basic education, school uniforms, and instructional textbooks are fully sponsored under the Veronica Onyeneke Basic Education Grant. She consistently ranks top of her class in mathematics and reading.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233535/vof/IMG04.jpg',
    location: 'Mbieri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
  },
  {
    id: 4,
    fullName: 'Precious Opara',
    category: 'Secondary',
    institution: "Saint Paul's Secondary School, Owerri",
    classLevel: 'SS 2',
    yearAwarded: '2023',
    awardStatus: 'Active',
    bioStory:
      'Precious aspires to study software engineering. Her full senior secondary school tuition, computer lab fees, and upcoming WAEC/JAMB exam registrations are completely funded by the Foundation.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233537/vof/IMG06.jpg',
    location: 'Owerri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
  },
  {
    id: 7,
    fullName: 'Blessing Okoro',
    category: 'Tertiary',
    institution: 'Federal University of Technology, Owerri (FUTO)',
    classLevel: '300 Level - Mechanical Engineering',
    yearAwarded: '2022',
    awardStatus: 'Active',
    bioStory:
      'Recipient of the Veronica Onyeneke Tertiary Merit Bursary. Blessing maintains a First-Class GPA in Mechanical Engineering, conducting research on clean rural renewable energy solutions.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233539/vof/IMG03.jpg',
    location: 'Owerri, Imo State, Nigeria',
    gender: 'Female',
    featured: true,
  },
  {
    id: 10,
    fullName: 'Ngozi Juliet Anokwute',
    category: 'Skills',
    institution: 'VOIE Vocational Training Center, Owerri',
    classLevel: 'Fashion Design & Haute Couture',
    yearAwarded: '2024',
    awardStatus: 'Active',
    bioStory:
      'Trained in industrial garment construction, pattern drafting, and entrepreneurial fashion design at VOIE. Recipient of complete starter sewing machine kit upon graduation.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233536/vof/IMG01.jpg',
    location: 'Owerri North, Imo State',
    gender: 'Female',
    featured: true,
  },
  {
    id: 11,
    fullName: 'Chukwuebuka Obi',
    category: 'Skills',
    institution: 'VOIE ICT & Innovation Hub, Owerri',
    classLevel: 'Computer Systems, Hardware & ICT',
    yearAwarded: '2024',
    awardStatus: 'Active',
    bioStory:
      'Completed a 6-month intensive ICT technician and digital literacy curriculum sponsored by VOF. Now runs a registered neighborhood tech repair and printing center.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233544/vof/blog/vocational-skills-empowerment.jpg',
    location: 'Mbieri, Imo State',
    gender: 'Male',
    featured: true,
  },
  {
    id: 12,
    fullName: 'Chinonso Sandra Madu',
    category: 'Skills',
    institution: 'VOIE Cosmetology & Esthetics Academy',
    classLevel: 'Professional Cosmetology & Hair Artistry',
    yearAwarded: '2024',
    awardStatus: 'Ongoing',
    bioStory:
      'Specializing in professional hair styling, scalp treatments, and beauty therapy under VOF full sponsorship covering course fees, salon practice kits, and startup mentorship.',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233535/vof/IMG04.jpg',
    location: 'Imo State, Nigeria',
    gender: 'Female',
    featured: false,
  },
];

const CATEGORY_TABS = [
  { id: 'All', label: 'All Cohorts', countKey: 'total', desc: 'All verified academic scholars & skills trainees' },
  { id: 'Primary', label: 'Primary', countKey: 'primary', desc: 'Basic school tuition, uniforms, books & nutritional support' },
  { id: 'Secondary', label: 'Secondary', countKey: 'secondary', desc: 'Tuition fees, textbooks & WAEC/JAMB CBT exam sponsorships' },
  { id: 'Tertiary', label: 'Tertiary / University', countKey: 'tertiary', desc: 'Undergraduate tuition bursaries & faculty academic grants' },
  { id: 'Skills', label: 'Skills Acquisition (VOIE)', countKey: 'skills', desc: 'Practical vocational trades, ICT, fashion & starter toolkits' },
] as const;

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryItem[]>(FALLBACK_BENEFICIARIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<BeneficiaryItem | null>(null);

  // Donation Modal
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateMethod, setDonateMethod] = useState<DonationMethod>('paystack');
  const [donateFrequency, setDonateFrequency] = useState<DonationFrequency>('once');

  const openDonate = (method: DonationMethod = 'paystack', frequency: DonationFrequency = 'once') => {
    setDonateMethod(method);
    setDonateFrequency(frequency);
    setIsDonateOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getBeneficiaries();
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setBeneficiaries(data);
        }
      } catch (err) {
        console.warn('Using fallback beneficiaries data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute metrics
  const metrics = useMemo(() => {
    const total = beneficiaries.length;
    const primary = beneficiaries.filter((b) => b.category.toLowerCase().includes('primary')).length;
    const secondary = beneficiaries.filter((b) => b.category.toLowerCase().includes('secondary')).length;
    const tertiary = beneficiaries.filter((b) => b.category.toLowerCase().includes('tertiary')).length;
    const skills = beneficiaries.filter((b) => b.category.toLowerCase().includes('skill')).length;
    const active = beneficiaries.filter(
      (b) => b.awardStatus.toLowerCase() === 'active' || b.awardStatus.toLowerCase() === 'ongoing'
    ).length;
    return { total, primary, secondary, tertiary, skills, active };
  }, [beneficiaries]);

  // Filtered List
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        b.fullName.toLowerCase().includes(q) ||
        b.institution.toLowerCase().includes(q) ||
        b.classLevel.toLowerCase().includes(q) ||
        (b.location && b.location.toLowerCase().includes(q));

      const matchesCategory =
        activeCategory === 'All' ||
        b.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        (activeCategory === 'Skills' && b.category.toLowerCase().includes('skill'));

      const matchesStatus =
        statusFilter === 'All' || b.awardStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [beneficiaries, searchQuery, activeCategory, statusFilter]);

  const getCategoryBadge = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('primary')) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Primary Education',
      };
    }
    if (lower.includes('secondary')) {
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Secondary Education',
      };
    }
    if (lower.includes('tertiary')) {
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        dot: 'bg-purple-500',
        label: 'Tertiary / University',
      };
    }
    if (lower.includes('skill')) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Skills Acquisition (VOIE)',
      };
    }
    return {
      bg: 'bg-stone-50 text-stone-800 border-stone-200',
      dot: 'bg-stone-500',
      label: cat,
    };
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 flex flex-col justify-between">
      {/* PUBLIC NAVBAR WITH ACCREDITATION HEADER */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">›</span>
          <Link href="/programs" className="hover:text-gray-700 transition-colors">
            Programs
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-[#558b1a] font-semibold">Scholarship & Skills Beneficiaries</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4faec] border border-[#d8eec2] text-[#467315] text-xs font-bold uppercase tracking-wider mb-4">
            <IconSparkles className="w-3.5 h-3.5 text-[#558b1a]" />
            <span>Verified Impact & Public Accountability Ledger</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b2124] tracking-tight leading-tight mb-4"
          >
            Scholarship & Skills Beneficiaries
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed"
          >
            Every scholar and trainee represents an open door to breaking generational poverty. Explore our
            verified roster of beneficiaries supported across Primary, Secondary, Tertiary, and VOIE Vocational
            Skills programs in Nigeria and the African diaspora.
          </motion.p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8">
            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">All Beneficiaries</span>
                <IconUsers className="w-4 h-4 text-gray-400" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{metrics.total}</p>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Verified foundation awards</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Primary School</span>
                <IconBook className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800 mt-2">{metrics.primary}</p>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Tuition, books & uniforms</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Secondary</span>
                <IconSchool className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-blue-800 mt-2">{metrics.secondary}</p>
              <span className="text-[11px] text-gray-400 mt-0.5 block">WAEC, NECO & JAMB aid</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Tertiary / Uni</span>
                <IconAward className="w-4 h-4 text-purple-600" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-purple-800 mt-2">{metrics.tertiary}</p>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Undergraduate bursaries</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Skills (VOIE)</span>
                <IconBriefcase className="w-4 h-4 text-amber-600" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-800 mt-2">{metrics.skills}</p>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Trades & starter toolkits</span>
            </div>
          </div>
        </div>

        {/* Category Tabs & Interactive Search Filter */}
        <div className="space-y-4 mb-8">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              const count = metrics[tab.countKey as keyof typeof metrics];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#1b3f0c] text-white shadow-sm'
                      : 'bg-white hover:bg-stone-100 text-gray-600 border border-gray-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-[#558b1a] text-white' : 'bg-stone-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-Filter Bar: Search & Status Dropdown */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <IconSearch className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student name, school, course, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-stone-50 text-gray-700 font-semibold focus:outline-none focus:bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Scholars</option>
                <option value="Ongoing">Ongoing Programs</option>
                <option value="Graduated">Graduated / Alumni</option>
              </select>

              {(searchQuery || activeCategory !== 'All' || statusFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setStatusFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Description Banner (Dynamically contextualized) */}
        {activeCategory !== 'All' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#f4faec] border border-[#d8eec2] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#558b1a] text-white shrink-0 mt-0.5">
              {activeCategory === 'Primary' && <IconBook className="w-4 h-4" />}
              {activeCategory === 'Secondary' && <IconSchool className="w-4 h-4" />}
              {activeCategory === 'Tertiary' && <IconAward className="w-4 h-4" />}
              {activeCategory === 'Skills' && <IconBriefcase className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#1b3f0c]">
                {activeCategory === 'Primary' && 'Primary Basic Education Initiative'}
                {activeCategory === 'Secondary' && 'Secondary Tuition & WAEC/JAMB Sponsorship'}
                {activeCategory === 'Tertiary' && 'Tertiary & University Academic Bursaries'}
                {activeCategory === 'Skills' && 'VOIE Vocational Skills & Entrepreneurship Trainees'}
              </h3>
              <p className="text-xs text-[#2e5e0f] mt-0.5 leading-relaxed">
                {activeCategory === 'Primary' &&
                  'Providing underprivileged primary pupils with tuition coverage, branded exercise books, backpacks, uniforms, and daily lunch sustenance to build foundational literacy and numeracy.'}
                {activeCategory === 'Secondary' &&
                  'Bridging junior and senior secondary education, underwriting school term fees, instructional material, and 100% exam registration subsidies for WAEC, NECO, and JAMB CBT.'}
                {activeCategory === 'Tertiary' &&
                  'Merit-based undergraduate scholarships providing tuition grants, medical books, lab support, and living bursaries for students enrolled in accredited Nigerian and African universities.'}
                {activeCategory === 'Skills' &&
                  'Hands-on technical and entrepreneurial training at the Veronica Onyeneke Institute of Entrepreneurship (VOIE). Every trainee masters a trade and receives a professional startup toolkit upon completion.'}
              </p>
            </div>
          </div>
        )}

        {/* Beneficiaries Grid */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-gray-200">
            <div className="w-8 h-8 border-3 border-[#558b1a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Loading scholarship beneficiaries roster...</p>
          </div>
        ) : filteredBeneficiaries.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 space-y-4">
            <IconSchool className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-900 text-base">No beneficiaries match this filter</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We could not find any beneficiaries matching your search or filter criteria. Try adjusting your
              search term or switching category tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#558b1a] text-white text-xs font-bold hover:bg-[#467315] transition cursor-pointer"
            >
              View All Beneficiaries
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBeneficiaries.map((b) => {
              const badge = getCategoryBadge(b.category);
              const initials = b.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group hover:border-[#8ac43e]/40"
                >
                  <div>
                    {/* Top Status & Category Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {b.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            <IconStar className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Featured
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.awardStatus.toLowerCase() === 'active' ||
                            b.awardStatus.toLowerCase() === 'ongoing'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {b.awardStatus}
                        </span>
                      </div>
                    </div>

                    {/* Student Portrait & Header */}
                    <div className="flex items-start gap-3.5 mb-4">
                      {b.imageUrl ? (
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-200 group-hover:scale-105 transition-transform duration-200">
                          <Image
                            src={b.imageUrl}
                            alt={b.fullName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b3f0c] to-[#558b1a] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                          {initials}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-[#558b1a] transition-colors">
                            {b.fullName}
                          </h3>
                          <IconShieldCheck
                            className="w-4 h-4 text-[#558b1a] shrink-0"
                            title="Verified Foundation Beneficiary"
                          />
                        </div>
                        <p className="text-xs text-[#558b1a] font-semibold truncate flex items-center gap-1 mt-0.5">
                          <IconSchool className="w-3.5 h-3.5 shrink-0" />
                          <span>{b.institution}</span>
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">{b.classLevel}</p>
                      </div>
                    </div>

                    {/* Bio Story Snippet */}
                    {b.bioStory && (
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 bg-stone-50/80 p-3 rounded-xl border border-gray-100 italic mb-4">
                        &ldquo;{b.bioStory}&rdquo;
                      </p>
                    )}

                    {/* Meta Tags: Award Year & Location */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <IconCalendar className="w-3.5 h-3.5 text-gray-400" />
                        Awarded: {b.yearAwarded}
                      </span>
                      {b.location && (
                        <span className="flex items-center gap-1">
                          <IconMapPin className="w-3.5 h-3.5 text-gray-400" />
                          {b.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(b)}
                      className="text-xs font-bold text-[#558b1a] hover:text-[#467315] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Story & Impact</span>
                      <IconChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openDonate('paystack', 'monthly')}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#f4faec] text-[#467315] hover:bg-[#558b1a] hover:text-white transition cursor-pointer flex items-center gap-1"
                      title="Sponsor scholars like this"
                    >
                      <IconHeart className="w-3 h-3 fill-current" />
                      <span>Sponsor</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Foundation Call to Action Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Sponsor a Student */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#112708] to-[#1b3f0c] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold mb-4">
                <IconHeart className="w-3.5 h-3.5 fill-current text-rose-400" />
                <span>Partner in Education & Vocational Mastery</span>
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-tight mb-2">
                Help Sponsor the Next Cohort
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md">
                100% of your tax-deductible educational donation goes directly to verified school tuition fees,
                JAMB/WAEC registrations, and VOIE starter toolkits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 relative z-10">
              <button
                type="button"
                onClick={() => openDonate('paystack', 'monthly')}
                className="px-5 py-2.5 rounded-full bg-[#fbbf24] hover:bg-[#f59e0b] text-gray-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <IconHeart className="w-3.5 h-3.5 fill-current" />
                <span>Sponsor a Student (Donate)</span>
              </button>
              <Link
                href="/donate"
                className="text-xs text-gray-300 hover:text-white font-semibold underline underline-offset-4"
              >
                View Financial Transparency
              </Link>
            </div>
          </div>

          {/* Card 2: Apply for Scholarship or Skills */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4faec] text-[#467315] text-xs font-bold mb-4">
                <IconSparkles className="w-3.5 h-3.5 text-[#558b1a]" />
                <span>Open Application Portals</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 tracking-tight mb-2">
                Apply for Academic Aid or Skills Training
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                Are you an ambitious student in need of school tuition support, or a youth looking to learn a
                high-demand vocational trade at VOIE? Applications are 100% free of charge.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <Link
                href="/apply/scholarship"
                className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <IconSchool className="w-3.5 h-3.5" />
                <span>Apply for Scholarship</span>
              </Link>
              <Link
                href="/apply/skills"
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-800 font-bold text-xs transition flex items-center gap-1.5"
              >
                <IconBriefcase className="w-3.5 h-3.5" />
                <span>Apply for VOIE Skills</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* STUDENT DETAIL SPOTLIGHT MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative"
            >
              {/* Modal Top Header */}
              <div className="p-6 bg-gradient-to-r from-[#1b3f0c] to-[#558b1a] text-white relative">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                  aria-label="Close dialog"
                >
                  <IconX className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  {selectedStudent.imageUrl ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/50 shadow-md">
                      <Image
                        src={selectedStudent.imageUrl}
                        alt={selectedStudent.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-2xl">
                      {selectedStudent.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider inline-block mb-1">
                      {selectedStudent.category} Category
                    </span>
                    <h3 className="font-bold text-xl text-white truncate">{selectedStudent.fullName}</h3>
                    <p className="text-xs text-emerald-100 truncate flex items-center gap-1 mt-0.5">
                      <IconSchool className="w-3.5 h-3.5 shrink-0" />
                      <span>{selectedStudent.institution}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 text-xs">
                  <div>
                    <span className="text-gray-400 block font-semibold">Academic / Trade Level:</span>
                    <span className="font-bold text-gray-800">{selectedStudent.classLevel}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold">Award Status:</span>
                    <span className="font-bold text-emerald-700">{selectedStudent.awardStatus}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold">Session Awarded:</span>
                    <span className="font-bold text-gray-800">{selectedStudent.yearAwarded}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold">Location:</span>
                    <span className="font-bold text-gray-800">
                      {selectedStudent.location || 'Imo State, Nigeria'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Impact Story & Background
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {selectedStudent.bioStory ||
                      'This verified beneficiary is actively enrolled and receiving full educational or trade assistance under the Veronica Onyeneke Foundation empowerment mission.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      openDonate('paystack', 'monthly');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <IconHeart className="w-4 h-4 fill-current" />
                    <span>Sponsor This Scholar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHARED PUBLIC FOOTER */}
      <Footer onDonateClick={(m, freq) => openDonate(m, freq)} />

      {/* UNIFIED DONATION MODAL */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialMethod={donateMethod}
        initialFrequency={donateFrequency}
      />
    </div>
  );
}
