"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconHeart,
  IconSparkles,
  IconShieldCheck,
  IconWorld,
  IconUsers,
  IconSchool,
  IconRocket,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCheck,
  IconCopy,
  IconArrowRight,
  IconBuildingBank,
  IconMenu2,
  IconX
} from "@tabler/icons-react";

// Board of Trustees & Executive Team
const leadershipTeam = [
  { name: "Rev. Charles Onyeneke", role: "Founder & Chairman", location: "Albany, NY / Imo State", image: "/team/charles-onyeneke.jpg" },
  { name: "Mrs. Glory Ozor", role: "Trustee / VOFC President", location: "United States", image: "/team/glory-ozor.png" },
  { name: "Mr. Elvis Onyeneke", role: "Trustee", location: "Nigeria", image: "/team/elvis-onyeneke.png" },
  { name: "Mr. Sixtus Igbokwe", role: "Trustee", location: "Nigeria", image: "/team/sixtus-igbokwe.png" },
  { name: "Dr. Chioma Okwudinma", role: "Trustee", location: "Nigeria", image: "/team/chioma-okwudinma.png" },
  { name: "Onyinyechi Emmanuela Eze", role: "Trustee", location: "Nigeria", image: "/team/onyinyechi-eze.png" },
  { name: "Patrick Chikaodinaka Ibekwe", role: "Board Secretary", location: "Nigeria", image: "/team/patrick-ibekwe.jpg" },
  { name: "Nora Chinwe Nwokorie", role: "Administrator", location: "Nigeria HQ", image: "/team/nora-nwokorie.jpg" },
  { name: "Uba Frances Ogochukwu", role: "Accounts Manager", location: "Nigeria HQ", image: "/team/uba-ogochukwu.jpg" },
  { name: "Rev. Fr. Oguledo Achilleus Chidiebere", role: "Imo State Coordinator", location: "Imo State", image: "/team/achilleus-oguledo.jpg" },
  { name: "Joselyne Umuhoza", role: "VOF Rwanda Legal Representative", location: "Kigali, Rwanda", image: "/team/joselyne-umuhoza.jpg" },
  { name: "Paula Husuna Umuneza", role: "VOF Rwanda Secretary", location: "Kigali, Rwanda", image: "/team/paula-umuneza.jpg" },
  { name: "Mary Anyanwu", role: "Community Outreach & Welfare", location: "Nigeria", image: "/team/mary-anyanwu.jpg" }
];

const coreValues = [
  { title: "Compassion", desc: "We treat every person with empathy, dignity, kindness, and deep respect." },
  { title: "Empowerment", desc: "We equip individuals with knowledge, skills, confidence, and opportunities to improve their lives." },
  { title: "Integrity", desc: "We embrace transparency, accountability, honesty, and responsible financial stewardship." },
  { title: "Dignity", desc: "We recognize and respect the inherent God-given worth of every person." },
  { title: "Innovation", desc: "We encourage creativity, entrepreneurship, and practical approaches to community challenges." },
  { title: "Inclusion", desc: "We create pathways that welcome and uplift people from diverse backgrounds and circumstances." },
  { title: "Sustainability", desc: "We prioritize initiatives that produce long-lasting, generational improvements." }
];

export default function AboutPage() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donationCurrency, setDonationCurrency] = useState<"NGN" | "USD">("NGN");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const navLinks = [
    { label: "About Us", href: "/about", active: true },
    { label: "Programs", href: "/programs" },
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
                  onClick={() => setMobileMenuOpen(false)}
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

      {/* SUB-NAVIGATION STICKY BAR FOR QUICK JUMP */}
      <div className="bg-[#f7faf5] border-b border-gray-200/70 py-3 px-6 lg:px-16 sticky top-[69px] z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-8 text-xs font-semibold text-gray-600 whitespace-nowrap">
          <span className="text-gray-400 uppercase tracking-wider text-[11px]">Jump to:</span>
          <a href="#who-we-are" className="hover:text-[#558b1a] transition-colors">Who We Are</a>
          <a href="#inspiration" className="hover:text-[#558b1a] transition-colors">The Inspiration</a>
          <a href="#founder" className="hover:text-[#558b1a] transition-colors">The Founder</a>
          <a href="#leadership" className="hover:text-[#558b1a] transition-colors">Leadership & Trustees</a>
          <a href="#values" className="hover:text-[#558b1a] transition-colors">Core Values</a>
          <a href="#global" className="hover:text-[#558b1a] transition-colors">Global Presence</a>
        </div>
      </div>

      {/* HERO BANNER */}
      <section className="relative w-full bg-gradient-to-b from-[#0c1a05] via-[#142e09] to-[#1c400d] text-white py-20 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8ac43e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#8ac43e] font-bold text-xs uppercase tracking-widest mb-4 backdrop-blur-xs">
            <IconSparkles className="w-4 h-4" />
            <span>Rooted in Love. Driven by Purpose.</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
            Empowering Lives, Building Futures
          </h1>
          <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
            The Veronica Onyeneke Foundation (VOF) is a charitable organization established to preserve a legacy of compassion, self-reliance, and practical hope across Nigeria, the United States, and Rwanda.
          </p>
        </div>
      </section>

      {/* 1. WHO WE ARE & GENESIS */}
      <section id="who-we-are" className="w-full py-20 px-6 lg:px-16 max-w-7xl mx-auto scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block">About Veronica Onyeneke Foundation</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Standing in the Gaps for Youth & Vulnerable Mothers
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We recognize that many young people have tremendous potential but lack access to vocational training, mentorship, and economic opportunities. Simultaneously, many young pregnant women experience circumstances that leave them economically vulnerable, socially isolated, or uncertain about their futures.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              VOF exists to bridge these gaps. Our initiatives combine hands-on trade apprenticeships at the <strong>Veronica Onyeneke Institute of Entrepreneurship (VOIE)</strong> with comprehensive maternal dignity, educational scholarships, and compassionate community relief.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#fafbfa] border border-gray-100">
                <span className="font-serif text-2xl font-bold text-[#558b1a] block">Our Mission</span>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  To empower young people with practical skills, entrepreneurial tools, and academic opportunities while providing compassionate support to young pregnant women.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#fafbfa] border border-gray-100">
                <span className="font-serif text-2xl font-bold text-[#558b1a] block">Our Vision</span>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  A society where every youth realizes their potential, and where young pregnant women facing vulnerable circumstances are treated with dignity, compassion, and hope.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <Image
                src="/IMG01.jpeg"
                alt="Veronica Onyeneke Foundation Training & Community Empowerment"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8ac43e] block mb-1">Impact in Action</span>
                <p className="text-sm sm:text-base font-serif font-bold">
                  &ldquo;True service is not merely about giving; it is about recognizing dignity and building pathways to independence.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE INSPIRATION SECTION (MRS. VERONICA ONYENEKE) */}
      <section id="inspiration" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Guiding Legacy</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              The Inspiration: Mrs. Veronica Onyeneke
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              A woman of deep faith, extraordinary kindness, and unwavering commitment to uplifting the less privileged.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/70 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-[#8ac43e]/30 shadow-lg mb-6">
                  <Image
                    src="/veronica.png"
                    alt="Mrs. Veronica Ulumma Chinenyenwa Onyeneke"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">Mrs. Veronica Onyeneke</h3>
                <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider mt-1">1946 – 2021 • In Loving Memory</span>
                <span className="text-xs text-gray-500 mt-1">Umuodu Mbieri, Imo State, Nigeria</span>
              </div>

              <div className="lg:col-span-7 space-y-5 text-left text-gray-600 text-sm sm:text-base leading-relaxed">
                <div className="p-5 rounded-2xl bg-[#558b1a]/5 border-l-4 border-[#558b1a] italic text-gray-800 font-serif">
                  &ldquo;Empowering individuals. Strengthening families. Building futures.&rdquo;
                </div>
                <p>
                  The Veronica Onyeneke Foundation was founded by Rev. Fr. Charles Onyeneke in honor of his late mother, <strong>Mrs. Veronica Ulumma Chinenyenwa Onyeneke</strong>, whose life was marked by deep Catholic faith, generosity, and genuine concern for vulnerable people.
                </p>
                <p>
                  Throughout her life in Imo State, Mrs. Veronica was renowned for opening her home to young mothers with nowhere else to turn, financing school fees for children whose parents struggled, and providing nourishment and warm counsel to anyone experiencing hardship.
                </p>
                <p>
                  Her life reflected a simple but transformative truth: <em>true service is not merely about giving handouts; it is about recognizing an individual&apos;s inherent worth and equipping them with the strength and opportunity to stand on their own feet.</em>
                </p>
                <p>
                  What began as a son&apos;s expression of love and remembrance has blossomed into an international nonprofit institution dedicated to carrying her compassion forward across generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE FOUNDER SECTION (REV. CHARLES ONYENEKE) */}
      <section id="founder" className="w-full bg-white py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Visionary Leadership</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Meet the Founder
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              Pastoral dedication, theological scholarship, and a heart for transformative global charity.
            </p>
          </div>

          <div className="bg-[#fafbfa] rounded-3xl border border-gray-200/70 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Founder Image & Credentials Card */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-full max-w-sm h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6">
                  <Image
                    src="/team/charles-onyeneke.jpg"
                    alt="Rev. Charles Onyeneke - Founder and Chairman"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8ac43e] block">Founder & Chairman</span>
                    <h3 className="font-serif text-xl font-bold">Rev. Charles Onyeneke</h3>
                    <span className="text-xs text-gray-200">Diocese of Albany, New York</span>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-2.5 text-left text-xs bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-semibold text-gray-800">
                    <span>Ordination</span>
                    <span className="text-[#558b1a]">2020 • Diocese of Albany, NY</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-semibold text-gray-800">
                    <span>Current Pastorates</span>
                    <span className="text-gray-600 text-right">Mater Christi & All Saints, Albany</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1 font-semibold text-gray-800">
                    <span>Academic Qualifications:</span>
                    <span className="text-gray-500 font-normal">
                      • Licentiate in Sacred Theology (S.T.L.) — St. Mary&apos;s Seminary, Baltimore, MD<br />
                      • Master of Arts (M.A.) — Saint Leo University, FL<br />
                      • B.A. Philosophy & Theology — Pontifical Urban University, Rome & Imo State Univ.
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Biography */}
              <div className="lg:col-span-7 space-y-5 text-left text-gray-600 text-sm sm:text-base leading-relaxed">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">Rev. Charles Onyeneke</h3>
                  <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider">Founder & Chairman of the Board</span>
                </div>

                <p>
                  Rev. Charles Onyeneke is the Founder of the Veronica Onyeneke Foundation. Born and raised in a devout Catholic family in Umuodu Mbieri, Imo State, Nigeria, Charles witnessed firsthand the powerful example of faith, generosity, and service lived by his mother, Veronica, and his father. This upbringing inspired his lifelong devotion to the Church and his calling to the priesthood.
                </p>

                <p>
                  After completing extensive philosophical and theological formation at Seat of Wisdom Seminary, Imo State University, and the Pontifical Urban University in Rome, Charles continued advanced graduate studies in the United States. He earned a Master&apos;s degree from Saint Leo University, Florida, and a prestigious Licentiate in Sacred Theology (S.T.L.) from St. Mary&apos;s Seminary and University in Baltimore, Maryland.
                </p>

                <p>
                  Ordained as a Roman Catholic priest for the Diocese of Albany, New York, in 2020, Rev. Charles now serves as the Pastor of Mater Christi Church and School, as well as the Pastor of All Saints Church in Albany. His deep pastoral commitment to service extends beyond parish walls—he works tirelessly to sponsor educational scholarships for students in Nigeria and Rwanda, uplift low-income households, and equip young adults through vocational mastery.
                </p>

                <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider block">Founder&apos;s Message</span>
                  <p className="font-serif italic text-gray-900 text-base leading-relaxed">
                    &ldquo;VOF was established from a desire to create meaningful opportunities for people whose potential can sometimes be limited by circumstances beyond their control. Every child who learns a trade, every young mother restored to dignity, and every student whose tuition is provided represents a future permanently transformed.&rdquo;
                  </p>
                  <span className="block text-xs font-bold text-gray-500 not-italic pt-1">— Rev. Charles Onyeneke</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR LEADERSHIP & BOARD OF TRUSTEES (THE TEAM) */}
      <section id="leadership" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Governance & Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Our Leadership Team & Trustees
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              VOF is guided by experienced leaders, trustees, coordinators, and humanitarian professionals committed to institutional integrity and community impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#8ac43e] hover:shadow-lg transition-all duration-300 text-left flex flex-col group"
              >
                <div className="relative w-full h-60 bg-gray-100 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10">
                    {member.location}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-gray-900 leading-snug group-hover:text-[#558b1a] transition-colors">
                      {member.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#558b1a] block mt-1">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES SECTION */}
      <section id="values" className="w-full bg-white py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Guiding Pillars</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              The Principles That Guide Our Work
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              Everything we do is anchored in transparency, empathy, and sustainable community empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
            {coreValues.map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#fafbfa] border border-gray-100 hover:border-[#8ac43e] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center font-bold text-sm mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1a05] to-[#1c400d] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#8ac43e] uppercase tracking-wider block mb-2">Commitment</span>
                <h3 className="font-serif text-lg font-bold mb-2">100% Transparency</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  We maintain strict audit compliance and annual filings across all global branches.
                </p>
              </div>
              <Link
                href="/financial-reports"
                className="mt-4 text-xs font-bold text-[#8ac43e] hover:underline flex items-center gap-1"
              >
                <span>View Audit Reports</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GLOBAL REACH SECTION */}
      <section id="global" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Physical Hubs</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Three Locations, One United Mission
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Operating across Nigeria, the United States, and Rwanda to deliver impactful grassroots transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Nigeria Hub */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇳🇬</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1 rounded-full">Global HQ</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Nigeria (Global Head Office)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                Home of the flagship <strong>Veronica Onyeneke Institute of Entrepreneurship (VOIE)</strong>, youth vocational trades, JAMB coaching cohorts, and community relief.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>+234 903 373 6826</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>info@vonf.org</span>
                </div>
              </div>
            </div>

            {/* United States Hub */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇺🇸</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full">501(c)(3) Nonprofit</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">United States (VOF Corp.)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                <strong>VOF Corp.</strong> is a registered U.S. 501(c)(3) nonprofit organization providing an international donor platform. Donations are tax-deductible under U.S. law.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>4196 S Himalaya Way, Aurora, CO 80013, United States.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>+1 (720) 675-4211</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>vofcorp@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Rwanda Hub */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇷🇼</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-3 py-1 rounded-full">Rwanda NGO</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Rwanda (VOF Rwanda)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                Registered under the Rwanda Governance Board, directing localized educational partnerships, student materials, and community assistance.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>Kn82 Kiyovu Nyarurembo, Kigali, Rwanda.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>+250 793 156 562</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>admin.rwanda@vonf.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative w-full text-white overflow-hidden py-20 px-6 lg:px-16 isolate bg-[#091503]">
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="text-xs text-[#8ac43e] font-semibold">
                &ldquo;Empowering individuals. Strengthening families.&rdquo;
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-xs">
                <Link href="/programs" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Vocational Programs & Institute</span>
                </Link>
                <Link href="/blog" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>News & Field Updates</span>
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

            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Direct Giving</h4>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                <span className="font-bold text-[#8ac43e] block">GTBank (NGN):</span>
                <span>3000273596 • Veronica Onyeneke Foundation</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                <span className="font-bold text-[#fbbf24] block">Zelle (USD):</span>
                <span>vofcorp@gmail.com</span>
              </div>
            </div>
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

      {/* DONATION MODAL */}
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
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
              >
                ✕
              </button>

              <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider block mb-1">Make an Impact</span>
              <h3 className="font-serif text-2xl font-bold mb-2">Support VOF Initiatives</h3>
              <p className="text-gray-500 text-xs mb-6">
                Your direct contribution sponsors youth vocational training, university scholarships, and maternal health kits.
              </p>

              <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
                <button
                  onClick={() => setDonationCurrency("NGN")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    donationCurrency === "NGN" ? "bg-[#558b1a] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇳🇬 Nigeria (NGN)
                </button>
                <button
                  onClick={() => setDonationCurrency("USD")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    donationCurrency === "USD" ? "bg-[#558b1a] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🇺🇸 International / USD
                </button>
              </div>

              {donationCurrency === "NGN" ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-stone-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-800">Guaranty Trust Bank (GTBank)</span>
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">NGN</span>
                    </div>
                    <div className="text-base font-mono font-bold text-gray-900 my-1">3000273596</div>
                    <div className="text-xs text-gray-500">Veronica Onyeneke Foundation</div>
                    <button
                      onClick={() => copyToClipboard("3000273596", "gtbank")}
                      className="mt-2.5 w-full py-2 px-3 rounded-lg bg-gray-200 hover:bg-[#558b1a] hover:text-white flex items-center justify-center gap-1.5 text-xs font-bold text-gray-800 transition-colors"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                      <span>{copiedAccount === "gtbank" ? "Account Copied!" : "Copy GTBank Account"}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-800">Zenith Bank</span>
                      <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">NGN</span>
                    </div>
                    <div className="text-base font-mono font-bold text-gray-900 my-1">1228980969</div>
                    <div className="text-xs text-gray-500">Veronica Onyeneke Foundation</div>
                    <button
                      onClick={() => copyToClipboard("1228980969", "zenith")}
                      className="mt-2.5 w-full py-2 px-3 rounded-lg bg-gray-200 hover:bg-[#558b1a] hover:text-white flex items-center justify-center gap-1.5 text-xs font-bold text-gray-800 transition-colors"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                      <span>{copiedAccount === "zenith" ? "Account Copied!" : "Copy Zenith Account"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-stone-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-amber-800">Zelle (USA Direct)</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">501(c)(3)</span>
                    </div>
                    <div className="text-base font-mono font-bold text-gray-900 my-1">vofcorp@gmail.com</div>
                    <div className="text-xs text-gray-500">Veronica Onyeneke Foundation Corp.</div>
                    <button
                      onClick={() => copyToClipboard("vofcorp@gmail.com", "zelle")}
                      className="mt-2.5 w-full py-2 px-3 rounded-lg bg-gray-200 hover:bg-[#558b1a] hover:text-white flex items-center justify-center gap-1.5 text-xs font-bold text-gray-800 transition-colors"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                      <span>{copiedAccount === "zelle" ? "Zelle Email Copied!" : "Copy Zelle Address"}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-900">
                    <strong>U.S. Tax Exemption:</strong> Donations to VOF Corp. are fully tax-deductible under IRS Section 501(c)(3).
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
