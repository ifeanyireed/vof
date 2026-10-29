"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBriefcase,
  IconSchool,
  IconHeart,
  IconRocket,
  IconCheck,
  IconArrowRight,
  IconCopy,
  IconSparkles,
  IconShieldCheck,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import DonateModal, { DonationMethod, DonationFrequency } from "@/components/DonateModal";
import FooterDirectGiving from "@/components/FooterDirectGiving";
import Footer from "@/components/Footer";

const programsList = [
  {
    id: "voie",
    badge: "Flagship Vocational Academy • Imo State",
    title: "Veronica Onyeneke Institute of Entrepreneurship (VOIE)",
    subtitle: "Practical Vocational Trades, Entrepreneurial Coaching & Starter Kits",
    description: "At the center of our youth empowerment mission is the Veronica Onyeneke Institute of Entrepreneurship (VOIE), operated in Owerri North, Imo State by The Trustees of Veronica Onyeneke Foundation (CAC Reg. No. 8101466). We equip unemployed youths and vulnerable school leavers with marketable, high-demand technical skills and provide business starter toolkits upon graduation to ensure immediate self-reliance.",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233536/vof/IMG01.jpg",
    trades: [
      {
        name: "Fashion Design & Garment Construction",
        details: "Garment construction, pattern drafting, measurement precision, fabric cutting, modern styling, and garment finishing for independent fashion businesses."
      },
      {
        name: "Footwear Making & Leathercraft",
        details: "Shoe upper drafting, lasting, sole attachment, leather selection, and durable footwear craftsmanship for commercial retail."
      },
      {
        name: "Hairdressing & Cosmetology",
        details: "Professional hair styling, braiding, salon hygiene, scalp treatments, makeup artistry, and salon business management."
      },
      {
        name: "Electrical Installation & Solar Technology",
        details: "Domestic building wiring, circuit safety, inverter configurations, solar panel installations, battery bank sizing, and CCTV maintenance."
      },
      {
        name: "ICT & Digital Office Skills",
        details: "Computer literacy, office productivity software, web fundamentals, graphic branding, and digital marketing for modern office roles."
      },
      {
        name: "Modern Domestic Plumbing",
        details: "Residential piping, drainage installation, water filtration maintenance, sanitary ware fitting, and domestic plumbing diagnostics."
      }
    ],
    eligibility: [
      "Young adults aged 18 to 35 residing in Imo State or neighboring communities with demonstrated economic need.",
      "Young pregnant women and young mothers seeking financial independence to care for their children.",
      "Commitment to complete intensive hands-on workshop training (3 to 6-month cohorts) and practical skill assessments.",
      "Zero registration or tuition fees for indigent beneficiaries approved under VOF scholarship sponsorship."
    ],
    evidence: [
      "Physical training workshops conducted at Spring Plaza, Spibat Road (Off Orji Flyover), Orji, Owerri North, Imo State.",
      "Provision of practical graduation starter toolkits (industrial sewing machines, hair dryers, shoe-lasting anvils, multimeter testing kits) given directly to certified graduates.",
      "Post-graduation business incubation and mentorship to track micro-enterprise revenue generation."
    ],
    highlight: "Upon successful cohort graduation, certified students receive free practical starter toolkits and initial micro-mentorship to establish independent businesses.",
    applyUrl: "/apply/skills",
    applyText: "Apply for VOIE Skills Cohort"
  },
  {
    id: "maternal-care",
    badge: "Compassionate Maternal Care & Dignity",
    title: "Supporting Young Vulnerable Pregnant Women",
    subtitle: "Upholding Dignity, Prenatal Care Navigation & Hope",
    description: "VOF provides compassionate support, guidance, mentorship, and skills development to help young pregnant women navigate difficult circumstances, build sustainable futures, and create better opportunities for themselves and their children. Our program combines confidential healthcare referrals with emotional counseling and long-term economic empowerment.",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233565/vof/root/IMG21.jpg",
    trades: [
      {
        name: "Prenatal Medical Care & Clinical Checkups",
        details: "Coordination with certified maternal health facilities to ensure comprehensive prenatal clinic attendance, ultrasounds, and safe hospital delivery."
      },
      {
        name: "Maternal Dignity & Newborn Care Packages",
        details: "Distribution of clean newborn infant clothing, sanitary essentials, diapers, nursing supplies, and nutritious infant provisions."
      },
      {
        name: "Trauma-Informed Counseling & Mediation",
        details: "One-on-one confidential emotional guidance, life mentorship, and compassionate family mediation to support social reintegration."
      },
      {
        name: "Post-Delivery Vocational Placement",
        details: "Guaranteed admission into VOIE vocational trades or flexible livelihood skills so young mothers can independently provide for their children."
      }
    ],
    eligibility: [
      "Young pregnant women and young mothers experiencing economic vulnerability, familial distress, or social isolation.",
      "Open to beneficiaries in Imo State and surrounding southeastern Nigerian communities regardless of background or denomination.",
      "Strict confidentiality maintained across all medical, counseling, and social support services."
    ],
    evidence: [
      "Community healthcare partnerships and maternal welfare drives across Owerri North and Mbieri communities.",
      "Direct sponsorship of clinic registration fees, delivery kits, and infant nutritional packages.",
      "Documented transitions of young mothers into VOIE tailoring and cosmetology training tracks."
    ],
    highlight: "Every woman deserves dignity, respect, and the tools to build an honorable, self-sufficient future for herself and her child.",
    applyUrl: "/contact",
    applyText: "Request Confidential Support"
  },
  {
    id: "scholarships",
    badge: "Academic Advancement & Grants",
    title: "JAMB Coaching & Educational Scholarships",
    subtitle: "Removing Financial Barriers for Deserving Scholars",
    description: "VOF believes that financial limitations should never extinguish an indigent scholar's academic potential. We organize intensive Joint Admissions and Matriculation Board (JAMB UTME) preparatory bootcamps, pay candidate examination fees, cover secondary school tuition, and provide tertiary tuition grants.",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233578/vof/root/IMG04.jpg",
    trades: [
      {
        name: "JAMB UTME Preparatory CBT Bootcamps",
        details: "Rigorous academic coaching across core subjects, computerized test simulations, and full payment of UTME registration fees."
      },
      {
        name: "Secondary School Fee Sponsorships",
        details: "Direct payment of termly school fees, WAEC/NECO examination fees, and textbook supplies for indigent secondary students."
      },
      {
        name: "Tertiary University Tuition Grants",
        details: "Annual tuition disbursements for high-achieving indigent scholars in federal and state universities across Nigeria."
      },
      {
        name: "'Beyond the Degree' Leadership Mentorship",
        details: "Career guidance clinics, professional internships, and student leadership seminars in partnership with higher education institutions."
      }
    ],
    eligibility: [
      "Academically promising primary, secondary, or tertiary students from low-income households, single-parent homes, or orphanages.",
      "Documented academic excellence (verified previous report cards, JAMB scores, or semester CGPA transcripts).",
      "Recommendation letter from a school head, local community leader, or parish priest confirming financial need."
    ],
    evidence: [
      "Executed legal Memorandum of Understanding (MoU) with Saint Paul's Catholic College, Umuezu-Igbosi, covering 10 fully sponsored students.",
      "Hosted 'Beyond the Degree' youth capacity seminar in partnership with the Student Union Government at Alvan Ikoku Federal University of Education, Owerri.",
      "Sponsored national JAMB registration fees for over 100 disadvantaged candidates across Imo and Abia States."
    ],
    highlight: "Hundreds of disadvantaged young scholars have successfully gained university admission and completed their degrees through VOF academic sponsorships.",
    applyUrl: "/apply/scholarship",
    applyText: "Apply for Scholarship Aid"
  },
  {
    id: "community-relief",
    badge: "Humanitarian Relief & Welfare",
    title: "Community Food Security & Emergency Assistance",
    subtitle: "Emergency Outreaches to Rural & Underserved Communities",
    description: "VOF organizes periodic grassroots food relief outreaches, primary healthcare screenings, and essential household welfare distributions for elderly widows, displaced families, and vulnerable rural households across southeastern Nigeria.",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233536/vof/IMG03.jpg",
    trades: [
      {
        name: "Emergency Staple Food Distribution",
        details: "Parcels of staple nutritious food (rice, beans, garri, vegetable oil, cereals) provided to struggling households during severe economic hardship."
      },
      {
        name: "Elderly & Widow Welfare Support",
        details: "Direct home welfare visits, essential blankets, clothing, and nutritional care packages for vulnerable elderly community members."
      },
      {
        name: "Community Health & Vital Screenings",
        details: "Free blood pressure checks, blood sugar screenings, basic medications, and clinical referrals in partnership with volunteer medical personnel."
      }
    ],
    eligibility: [
      "Identified low-income rural households, elderly widows with minimal support, and families facing severe food distress.",
      "Beneficiary identification conducted in coordination with local community heads, women's welfare leaders, and local parishes."
    ],
    evidence: [
      "Valentine Day Community Outreach distributing cooked meals and essential food packs across Owerri street communities.",
      "Periodic food parcel distribution drives across rural Mbieri and Aboh Mbaise communities.",
      "Documented photo journals and transparent expenditure logs published in our Outreach Reports archive."
    ],
    highlight: "Direct grassroots delivery with verified zero administrative overhead diluting emergency food allocations.",
    applyUrl: "/volunteer",
    applyText: "Join as Community Volunteer"
  }
];

export default function ProgramsPage() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateMethod, setDonateMethod] = useState<DonationMethod>("paystack");
  const [donateFrequency, setDonateFrequency] = useState<DonationFrequency>("once");

  const openDonate = (method: DonationMethod = "paystack", frequency: DonationFrequency = "once") => {
    setDonateMethod(method);
    setDonateFrequency(frequency);
    setIsDonateOpen(true);
  };
  const [donationCurrency, setDonationCurrency] = useState<"NGN" | "USD">("NGN");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs", active: true },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
    { label: "Support & FAQs", href: "/support" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* STATUTORY REGISTRATION NOTIFICATION BANNER */}
      <div className="bg-[#112708] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-[#21430f]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8ac43e] animate-pulse" />
            <span className="font-semibold text-emerald-200">The Trustees of Veronica Onyeneke Foundation</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="hidden sm:inline text-gray-200">CAC Reg. No: 8101466 (Nigeria)</span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="hidden md:inline text-gray-300">Incorporated: Nov 27, 2024</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/about#legal-entities" className="text-[#8ac43e] hover:underline font-medium">
              Legal Entities & Governance
            </Link>
            <span className="text-gray-500">•</span>
            <Link href="/contact" className="text-gray-300 hover:text-white">
              Nigeria Global HQ
            </Link>
            <span className="text-gray-500">•</span>
            <Link href="/donate" className="text-[#fbbf24] hover:underline font-bold">
              Donate Online
            </Link>
          </div>
        </div>
      </div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs transition-all">
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

          {/* Clean Desktop Navigation (External Pages Only) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.active) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
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

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/donate"
              onClick={(e) => {
                e.preventDefault();
                setIsDonateOpen(true);
              }}
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-xs cursor-pointer shadow-sm shrink-0"
            >
              Donate Now
            </Link>

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

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2.5 shadow-sm"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (item.active) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`block py-2 text-sm font-semibold ${
                    item.active ? "text-[#558b1a] font-bold" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/donate"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDonateOpen(true);
                  }}
                  className="block text-center py-2 bg-[#fbbf24] text-gray-950 font-bold rounded-xl text-xs"
                >
                  Donate Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO BANNER */}
      <section className="relative w-full bg-gradient-to-b from-[#0c1a05] via-[#142e09] to-[#1c400d] text-white py-20 px-6 lg:px-16 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#8ac43e] font-bold text-xs uppercase tracking-widest mb-4 backdrop-blur-xs"
          >
            <IconSparkles className="w-4 h-4" />
            <span>Pathways to Self-Reliance</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight"
          >
            Our Programs & Initiatives
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto"
          >
            From comprehensive trade apprenticeships at the Veronica Onyeneke Institute of Entrepreneurship to higher education scholarships and maternal health navigation.
          </motion.p>
        </div>
      </section>

      {/* DETAILED PROGRAMS LIST */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 lg:px-16 py-20 space-y-24"
      >
        {programsList.map((prog, index) => (
          <section
            key={prog.id}
            id={prog.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8 ${
              index > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#558b1a]/10 text-[#558b1a] px-3 py-1 rounded-full inline-block">
                {prog.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {prog.title}
              </h2>
              <p className="font-semibold text-gray-700 text-sm">{prog.subtitle}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{prog.description}</p>

              <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <Image
                  src={prog.image}
                  alt={prog.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#558b1a]/5 border-l-4 border-[#558b1a] text-xs text-gray-800 leading-relaxed">
                <strong>Key Milestone:</strong> {prog.highlight}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={prog.applyUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#558b1a] hover:bg-[#477516] text-white font-bold rounded-full text-xs transition-colors shadow-sm"
                >
                  <span>{prog.applyText}</span>
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/donate"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDonateOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-full text-xs transition-colors"
                >
                  <span>Sponsor / Donate</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
                  Core Components & Curriculum
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prog.trades.map((trade, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-5 rounded-2xl bg-[#fafbfa] border border-gray-100 hover:border-[#8ac43e] hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[#558b1a] font-bold text-sm mb-1.5">
                          <IconCheck className="w-4 h-4 flex-shrink-0" />
                          <span>{trade.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{trade.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Criteria */}
              {prog.eligibility && prog.eligibility.length > 0 && (
                <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <IconShieldCheck className="w-4 h-4 text-[#558b1a]" />
                    <span>Eligibility Criteria & Beneficiary Selection</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    {prog.eligibility.map((crit, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#558b1a] shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified Field Activities & Documentation */}
              {prog.evidence && prog.evidence.length > 0 && (
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#558b1a]" />
                      <span>Verified Field Activities & Accountability Records</span>
                    </h4>
                    <Link href="/outreach-reports" className="text-[11px] text-[#558b1a] font-bold hover:underline">
                      View Reports Archive →
                    </Link>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {prog.evidence.map((ev, eIdx) => (
                      <li key={eIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{ev}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 flex flex-wrap gap-3 text-[11px]">
                    <Link href="/gallery" className="text-[#558b1a] font-semibold hover:underline">
                      Browse Activity Photographs in Gallery
                    </Link>
                    <span className="text-gray-300">•</span>
                    <Link href="/financial-reports" className="text-[#558b1a] font-semibold hover:underline">
                      Audit & Transparency Statements
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </motion.main>

      {/* SHARED FOOTER */}
      <Footer onDonateClick={(m, freq) => openDonate(m, freq)} />

      {/* UNIFIED DONATION MODAL (PAYSTACK, PAYPAL, STRIPE, ZELLE, RECURRING) */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialMethod={donateMethod}
        initialFrequency={donateFrequency}
      />
    </div>
  );
}
