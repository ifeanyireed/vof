"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowLeft,
  IconShieldCheck,
  IconBuildingBank,
  IconFileText,
  IconCheck,
  IconExternalLink,
  IconDownload,
  IconCopy,
  IconX,
  IconEye,
  IconBrandPaypal,
  IconBrandStripe,
  IconRepeat,
  IconMenu2
} from "@tabler/icons-react";
import DonateModal, { DonationMethod, DonationFrequency } from "@/components/DonateModal";
import { PaystackIcon, ZelleIcon } from "@/components/PaymentIcons";
import Footer from "@/components/Footer";

export default function FinancialReportsPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ image: string; title: string; tag: string } | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateMethod, setDonateMethod] = useState<DonationMethod>("paystack");
  const [donateFrequency, setDonateFrequency] = useState<DonationFrequency>("once");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openDonate = (method: DonationMethod = "paystack", frequency: DonationFrequency = "once") => {
    setDonateMethod(method);
    setDonateFrequency(frequency);
    setIsDonateOpen(true);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 3000);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Financial Reports", href: "/financial-reports", active: true },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Support & FAQs", href: "/support" }
  ];

  const certificates = [
    {
      title: "U.S. IRS 501(c)(3) Determination Letter (Page 1)",
      issuer: "Department of the Treasury — Internal Revenue Service (IRS)",
      image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233538/vof/docs/vof-corp-501c3-cert-1.jpg",
      tag: "United States 501(c)(3)",
      desc: "Official IRS determination confirming Veronica Onyeneke Foundation Corp. as a tax-exempt charitable organization."
    },
    {
      title: "U.S. IRS 501(c)(3) Determination Letter (Page 2)",
      issuer: "Department of the Treasury — Internal Revenue Service (IRS)",
      image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233538/vof/docs/vof-corp-501c3-cert-2.jpg",
      tag: "United States 501(c)(3)",
      desc: "Detailed compliance codes and tax-deductible contribution authorizations under Section 170 of the Code."
    },
    {
      title: "VOF Rwanda Legal Registration Certificate (Page 1)",
      issuer: "Republic of Rwanda — Governance Board",
      image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233538/vof/docs/vof-rwanda-cert-1.jpg",
      tag: "Rwanda Registration",
      desc: "Legal compliance certificate authorizing humanitarian and educational initiatives in Rwanda."
    },
    {
      title: "VOF Rwanda Compliance Authorization (Page 2)",
      issuer: "Republic of Rwanda — Governance Board",
      image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233538/vof/docs/vof-rwanda-cert-2.jpg",
      tag: "Rwanda Registration",
      desc: "Statutory governance certificate validating educational partnerships and community support."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs transition-all">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
            alt="Veronica Onyeneke Foundation Logo"
            width={180}
            height={50}
            className="object-contain h-12 w-auto"
            priority
          />
        </Link>

        {/* Clean Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-semibold transition-colors duration-200 text-xs xl:text-sm whitespace-nowrap ${
                item.active
                  ? "text-[#558b1a] font-bold"
                  : "text-gray-700 hover:text-[#558b1a]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openDonate("paystack", "once")}
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs cursor-pointer transition-transform hover:scale-105"
          >
            Donate
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3 shadow-sm sticky top-[73px] z-40"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-semibold ${
                  item.active ? "text-[#558b1a] font-bold" : "text-gray-700 hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.main
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#4d7f16] text-xs font-bold uppercase tracking-wider mb-4"
          >
            <IconShieldCheck className="w-4 h-4" />
            <span>Fiduciary Responsibility & Audit Compliance</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1b2124] leading-tight mb-4"
          >
            Financial Transparency & <br />
            <span className="text-[#558b1a]">Audit Documentation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
          >
            The Veronica Onyeneke Foundation (VOF) operates under strict standards of transparency, accountability, and responsible stewardship across all international entities.
          </motion.p>
        </div>

        {/* Section 1: Organizational Profile for Annual Audit */}
        <section className="bg-stone-50/70 border border-stone-200/80 rounded-3xl p-8 lg:p-12 mb-16 text-left shadow-xs">
          <div className="flex items-center gap-3 mb-6 border-b border-stone-200 pb-4">
            <IconFileText className="w-7 h-7 text-[#558b1a]" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Official Policy Statement</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                Organizational Profile for Annual Audit & Tax Documentation
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-1">1. Background & Legal Mandate</h3>
              <p>
                The Veronica Onyeneke Foundation (VOF) is a non-profit charitable organization established in memory of Mrs. Veronica Onyeneke, whose life was marked by compassion, generosity, and an unwavering commitment to supporting those in need. The foundation was founded by Rev. Fr. Charles Onyeneke to preserve her legacy of service and extend assistance to vulnerable individuals and communities across Nigeria, Rwanda, and Africa.
              </p>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-1">2. Nature of Charitable Services</h3>
              <p>
                VOF provides charitable services aimed at empowering less privileged individuals through educational assistance, vocational skill development, maternal healthcare guidance, and social welfare initiatives. The organization’s services primarily focus on enabling young people and vulnerable individuals to become self-reliant, productive members of society.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-5 rounded-2xl bg-white border border-stone-200">
                <span className="font-serif font-bold text-base text-[#558b1a] block mb-1">Our Vision</span>
                <p className="text-xs text-gray-600">
                  To build a society where individuals, particularly youth and vulnerable groups, have access to opportunities, resources, and support systems that enable them to achieve their full potential.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-stone-200">
                <span className="font-serif font-bold text-base text-[#558b1a] block mb-1">Our Mission</span>
                <p className="text-xs text-gray-600">
                  To empower individuals and communities through education, mentorship, skills development, and humanitarian programs that promote sustainable development and dignity.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-gray-900 mb-2">3. Fiduciary Account Separation Across Programmatic Lines</h3>
              <p className="mb-3">
                To guarantee zero fund commingling and audit readiness, donations and expenditures are segregated into discrete accounting cost centres:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <li className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span><strong>Vocational Skills Training (VOIE):</strong> Workshop tools, student tuition, equipment starter kits.</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span><strong>Maternal Care & Young Mothers:</strong> Prenatal care referrals, emotional mentorship, and dignity toolkits.</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span><strong>Academic Sponsorships:</strong> JAMB examination fees, secondary school tuition, and tertiary scholarships.</span>
                </li>
                <li className="p-3 rounded-xl bg-white border border-stone-200 flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span><strong>Community Relief:</strong> Rural nutritional support drives, emergency food parcels, and healthcare outreach.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Official Registration & Tax-Exempt Certificates */}
        <section className="mb-20 text-left">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-1">Official Legal Documentation</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              Registration & Tax Compliance Certificates
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Official certificates validating the legal operations of Veronica Onyeneke Foundation in the United States and Rwanda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#558b1a]/40 transition-all flex flex-col group"
              >
                {/* Document Preview Image */}
                <div
                  onClick={() => setPreviewDoc(cert)}
                  className="relative w-full aspect-[3/4] bg-stone-100/90 overflow-hidden cursor-pointer"
                >
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-3 group-hover:scale-103 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#558b1a] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    {cert.tag}
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/95 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                      <IconEye className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>Preview</span>
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="font-serif text-sm sm:text-[15px] font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
                    {cert.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#558b1a] mb-2 line-clamp-1">
                    {cert.issuer}
                  </span>
                  <p className="text-gray-600 text-xs leading-relaxed flex-grow line-clamp-3 mb-4">
                    {cert.desc}
                  </p>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-gray-100 mt-auto flex items-center justify-between text-xs">
                    <button
                      onClick={() => setPreviewDoc(cert)}
                      className="inline-flex items-center gap-1 text-[#558b1a] font-bold hover:underline cursor-pointer"
                    >
                      <span>Preview High-Res</span>
                      <IconExternalLink className="w-3 h-3" />
                    </button>
                    <a
                      href={cert.image}
                      download
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors"
                      title="Download Certificate"
                    >
                      <IconDownload className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Official Donation Accounts & Auditor Contact */}
        <section className="p-8 lg:p-12 rounded-3xl bg-[#0c1a05] text-white text-left">
          <div className="max-w-3xl mb-8">
            <span className="text-[#8ac43e] text-xs font-bold uppercase tracking-widest block mb-1">Financial Stewardship</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Official Donor & Fiduciary Banking Details
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Supporters and institutional partners can securely contribute directly to VOF through our designated non-profit accounts:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs">
            {/* GTBank */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#8ac43e] block mb-1">GTBank (Nigeria — NGN)</span>
                <span className="font-mono text-base font-bold text-white block my-1">3000273596</span>
                <span className="text-gray-400 block text-[11px]">Veronica Onyeneke Foundation</span>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 text-[10px] uppercase">Bank SWIFT:</span>
                  <button
                    type="button"
                    onClick={() => copyText("GTBINGLA", "gtb-swift")}
                    className="font-mono text-white hover:text-[#8ac43e] flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy GTBank SWIFT Code"
                  >
                    <span>GTBINGLA</span>
                    {copiedItem === "gtb-swift" ? <IconCheck className="w-3 h-3 text-green-400" /> : <IconCopy className="w-3 h-3 opacity-60" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyText("3000273596", "gtbank")}
                className="mt-4 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{copiedItem === "gtbank" ? "Copied!" : "Copy Account"}</span>
              </button>
            </div>

            {/* Zenith */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#8ac43e] block mb-1">Zenith Bank (Nigeria — NGN)</span>
                <span className="font-mono text-base font-bold text-white block my-1">1228980969</span>
                <span className="text-gray-400 block text-[11px]">Veronica Onyeneke Foundation</span>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 text-[10px] uppercase">Bank SWIFT:</span>
                  <button
                    type="button"
                    onClick={() => copyText("ZEIBNGLA", "zenith-swift")}
                    className="font-mono text-white hover:text-[#8ac43e] flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy Zenith Bank SWIFT Code"
                  >
                    <span>ZEIBNGLA</span>
                    {copiedItem === "zenith-swift" ? <IconCheck className="w-3 h-3 text-green-400" /> : <IconCopy className="w-3 h-3 opacity-60" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyText("1228980969", "zenith")}
                className="mt-4 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{copiedItem === "zenith" ? "Copied!" : "Copy Account"}</span>
              </button>
            </div>

            {/* Bank of Kigali */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#8ac43e] block mb-1">Bank of Kigali (Rwanda — RWF)</span>
                <span className="font-mono text-base font-bold text-white block my-1">100267865048</span>
                <span className="text-gray-400 block text-[11px]">Veronica Onyeneke Foundation</span>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 text-[10px] uppercase">IBAN:</span>
                  <button
                    type="button"
                    onClick={() => copyText("RW34040100267865048646", "bok-iban")}
                    className="font-mono text-white hover:text-[#8ac43e] flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy IBAN"
                  >
                    <span>RW34...8646</span>
                    {copiedItem === "bok-iban" ? <IconCheck className="w-3 h-3 text-green-400" /> : <IconCopy className="w-3 h-3 opacity-60" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyText("100267865048", "bok-acc")}
                className="mt-4 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{copiedItem === "bok-acc" ? "Copied!" : "Copy Account"}</span>
              </button>
            </div>

            {/* Zelle */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#fbbf24] block mb-1">Zelle (USA — 501(c)(3) USD)</span>
                <span className="font-mono text-sm font-bold text-white block my-1">vofcorp@gmail.com</span>
                <span className="text-gray-400 block text-[11px]">Veronica Onyeneke Foundation Corp.</span>
              </div>
              <button
                type="button"
                onClick={() => copyText("vofcorp@gmail.com", "zelle")}
                className="mt-4 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{copiedItem === "zelle" ? "Copied!" : "Copy Zelle ID"}</span>
              </button>
            </div>
          </div>

          {/* Online Giving Channels (Paystack, PayPal, Stripe, Zelle) with Recurring */}
          <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">Instant Online Giving Channels</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#558b1a]/30 text-[#8ac43e] px-2.5 py-0.5 rounded-full border border-[#558b1a]/40">
                    <IconRepeat className="w-3 h-3" />
                    Recurring Available
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Direct online donations with instant receipting. Choose your preferred platform below to give once or monthly:
                </p>
              </div>
              <button
                type="button"
                onClick={() => openDonate("paystack", "monthly")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                <IconRepeat className="w-3.5 h-3.5" />
                <span>Set Up Monthly Donation</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Paystack */}
              <button
                type="button"
                onClick={() => openDonate("paystack", "once")}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00c3f7]/15 hover:bg-[#00c3f7]/25 border border-[#00c3f7]/40 text-white text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
                title="Donate via Paystack (Cards, Bank Transfer, USSD, Apple Pay)"
              >
                <PaystackIcon className="w-4 h-4 text-[#00c3f7]" />
                <span className="group-hover:text-[#00c3f7] transition-colors">Paystack</span>
              </button>

              {/* PayPal */}
              <button
                type="button"
                onClick={() => openDonate("paypal", "once")}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0070ba]/20 hover:bg-[#0070ba]/35 border border-[#0070ba]/50 text-white text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
                title="Donate via PayPal to veronicaonyenekefoundation@gmail.com"
              >
                <IconBrandPaypal className="w-4 h-4 text-[#38bdf8]" />
                <span className="group-hover:text-[#38bdf8] transition-colors">PayPal</span>
              </button>

              {/* Stripe */}
              <button
                type="button"
                onClick={() => openDonate("stripe", "once")}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#635bff]/20 hover:bg-[#635bff]/35 border border-[#635bff]/50 text-white text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
                title="Donate via Stripe to veronicaonyenekefoundation@gmail.com"
              >
                <IconBrandStripe className="w-4 h-4 text-[#a5b4fc]" />
                <span className="group-hover:text-[#a5b4fc] transition-colors">Stripe</span>
              </button>

              {/* Zelle */}
              <button
                type="button"
                onClick={() => openDonate("zelle", "once")}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#7414ca]/20 hover:bg-[#7414ca]/35 border border-[#7414ca]/50 text-white text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
                title="Donate via Zelle to vofcorp@gmail.com"
              >
                <ZelleIcon className="w-4 h-4 text-[#c084fc]" />
                <span className="group-hover:text-[#c084fc] transition-colors">Zelle</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span>For institutional audit inquiries or grant verification, please email <strong>info@vonf.org</strong> or <strong>vofcorp@gmail.com</strong>.</span>
            <button
              type="button"
              onClick={() => openDonate("paystack", "once")}
              className="px-6 py-2.5 bg-[#558b1a] text-white font-bold rounded-full hover:bg-[#477516] transition-colors text-xs whitespace-nowrap cursor-pointer"
            >
              Make an Online Donation
            </button>
          </div>
        </section>
      </motion.main>

      {/* SHARED FOOTER */}
      <Footer onDonateClick={(m, freq) => openDonate(m, freq)} />

      {/* Document Preview Lightbox Modal */}
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
                    {previewDoc.tag}
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

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialMethod={donateMethod}
        initialFrequency={donateFrequency}
      />
    </div>
  );
}
