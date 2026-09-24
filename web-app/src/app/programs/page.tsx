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

const programsList = [
  {
    id: "voie",
    badge: "Flagship Youth Initiative",
    title: "Veronica Onyeneke Institute of Entrepreneurship (VOIE)",
    subtitle: "Practical Vocational Trades, Entrepreneurial Coaching & Starter Kits",
    description: "At the center of our youth empowerment mission is the Veronica Onyeneke Institute of Entrepreneurship. We equip young people with marketable, high-demand skills that break the cycle of poverty and open clear pathways to sustainable livelihoods.",
    image: "/IMG01.jpeg",
    trades: [
      {
        name: "Fashion Design & Tailoring",
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
        name: "Electrical Installation & Solar Tech",
        details: "Domestic building wiring, circuit safety, inverter configurations, solar panel installations, battery bank sizing, and CCTV security maintenance."
      },
      {
        name: "ICT & Digital Skills",
        details: "Computer literacy, web design fundamentals, coding basics, graphic branding, and digital marketing for freelance and modern office roles."
      },
      {
        name: "Modern Plumbing",
        details: "Residential piping, drainage installation, water filtration maintenance, sanitary ware fitting, and domestic plumbing diagnostics."
      }
    ],
    highlight: "Upon successful cohort graduation, eligible students receive practical starter toolkits and initial mentorship to launch their independent enterprises."
  },
  {
    id: "scholarships",
    badge: "Academic Advancement",
    title: "JAMB Coaching & University Scholarships",
    subtitle: "Removing Financial Barriers for Deserving Scholars",
    description: "VOF believes that no brilliant student should be locked out of higher education due to financial distress. We run intensive JAMB UTME preparatory bootcamps, pay candidate examination fees, and sponsor promising students in university degrees.",
    image: "/IMG02.jpeg",
    trades: [
      {
        name: "JAMB UTME CBT Bootcamps",
        details: "Rigorous academic coaching across core subjects, computerized test simulations, and exam registration sponsorships."
      },
      {
        name: "Higher Education Tuition Support",
        details: "Direct payment of institutional tuition and academic fees for students in federal and state universities across Nigeria."
      },
      {
        name: "'Beyond the Degree' Mentorship",
        details: "Career counseling, professional internships, and student union partnerships such as our work with Alvan Ikoku Federal University of Education."
      }
    ],
    highlight: "Hundreds of disadvantaged young scholars have gained university admission through VOF scholarship programs."
  },
  {
    id: "maternal-care",
    badge: "Compassionate Care",
    title: "Supporting Young Vulnerable Pregnant Women",
    subtitle: "Upholding Dignity, Prenatal Care Navigation & Hope",
    description: "VOF provides compassionate support, guidance, mentorship, and skills development to help young mothers navigate difficult circumstances, build sustainable futures, and create better opportunities for themselves and their children.",
    image: "/IMG03.jpeg",
    trades: [
      {
        name: "Prenatal Care & Medical Navigation",
        details: "Guidance and financial assistance to attend certified clinic visits, receive obstetric checkups, and access safe hospital delivery."
      },
      {
        name: "Maternal Dignity Packages",
        details: "Provision of clean infant clothing, sanitary essentials, baby crib supplies, and newborn nutritional support."
      },
      {
        name: "Life Mentorship & Counseling",
        details: "One-on-one emotional encouragement, trauma-informed guidance, and family mediation support."
      },
      {
        name: "Vocational Transition",
        details: "Post-delivery enrollment into VOIE vocational trades or flexible livelihood skills so young mothers achieve lasting financial autonomy."
      }
    ],
    highlight: "Every woman deserves dignity, respect, and the tools to build an honorable, self-sufficient future for herself and her child."
  },
  {
    id: "community-relief",
    badge: "Humanitarian Relief",
    title: "Community Food Security & Emergency Assistance",
    subtitle: "Emergency Outreaches to Rural & Underserved Communities",
    description: "VOF organizes periodic food relief outreaches, healthcare assistance, and essential household supply distribution for elderly widows, displaced families, and vulnerable rural households.",
    image: "/IMG04.jpeg",
    trades: [
      {
        name: "Rural Food Distribution",
        details: "Staple food parcels (rice, beans, cooking oil, cereals) provided to struggling households during festive seasons and severe economic inflation."
      },
      {
        name: "Medical Outreach & Health Screenings",
        details: "Basic vital checks, blood pressure screenings, malaria medications, and clinical referrals in partnership with local healthcare volunteers."
      }
    ],
    highlight: "Direct grassroots impact with zero administrative overhead diluting humanitarian distributions."
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
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Financial Reports", href: "/financial-reports" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs transition-all">
        <div className="w-full px-6 lg:px-16 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.webp"
              alt="Veronica Onyeneke Foundation Logo"
              width={180}
              height={52}
              className="object-contain h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Clean Desktop Navigation (External Pages Only) */}
          <nav className="hidden md:flex items-center gap-8">
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
                className={`font-semibold transition-colors duration-200 text-sm ${
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-xs cursor-pointer shadow-sm"
            >
              Donate Now
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] transition-colors"
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
              className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-sm"
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

              <button
                onClick={() => setIsDonateOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#558b1a] hover:bg-[#477516] text-white font-bold rounded-full text-xs transition-colors shadow-sm cursor-pointer"
              >
                <span>Sponsor This Program</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-7 space-y-4 text-left">
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
          </section>
        ))}
      </motion.main>

      {/* FOOTER */}
      <footer className="relative w-full text-white overflow-hidden py-20 px-6 lg:px-16 isolate bg-[#091503]">
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-xs">
                <Link href="/about" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>About Us & Founder Story</span>
                </Link>
                <Link href="/gallery" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Photo & Impact Gallery</span>
                </Link>
                <Link href="/blog" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>News & Field Updates</span>
                </Link>
                <Link href="/outreach-reports" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Field Outreach Reports</span>
                </Link>
                <Link href="/financial-reports" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Financial Transparency & Audit</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">🇳🇬 Nigeria HQ</h4>
              <p>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</p>
              <p>+234 903 373 6826 • info@vonf.org</p>
            </div>

            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">🇺🇸 USA & 🇷🇼 Rwanda</h4>
              <p><strong>USA (501c3):</strong> 4196 S Himalaya Way, Aurora, CO 80013 • +1 (720) 675-4211</p>
              <p><strong>Rwanda:</strong> Kn82 Kiyovu Nyarurembo, Kigali • +250 793 156 562</p>
            </div>

            {/* Col 4: Direct Giving & Online Donate Buttons */}
            <FooterDirectGiving onDonateClick={(m, freq) => openDonate(m, freq)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center border-t border-white/10 pt-6 text-xs text-gray-400 font-medium w-full">
            <div className="text-center md:text-left mb-3 md:mb-0">
              © {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.
            </div>
            <div className="text-center mb-3 md:mb-0 text-gray-300">
              Empowering Lives. Restoring Hope. Creating Opportunities.
            </div>
            <div className="text-center md:text-right text-[11px] text-gray-400">
              VOF Corp. is a U.S. 501(c)(3) registered nonprofit.
            </div>
          </div>
        </div>
      </footer>

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
