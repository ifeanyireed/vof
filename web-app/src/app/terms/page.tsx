"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconShieldCheck,
  IconScale,
  IconHeartHandshake,
  IconBuildingBank,
  IconFileText,
  IconMail,
  IconMapPin,
  IconPhone,
  IconMenu2,
  IconX,
  IconArrowLeft,
  IconBuilding
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import DonateModal from "@/components/DonateModal";

export default function TermsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#112708]">
              Veronica Onyeneke <span className="text-[#558b1a]">Foundation</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
            <Link href="/" className="hover:text-[#558b1a] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#558b1a] transition-colors">About Us</Link>
            <Link href="/programs" className="hover:text-[#558b1a] transition-colors">Programs</Link>
            <Link href="/donate" className="hover:text-[#558b1a] transition-colors">Donate</Link>
            <Link href="/contact" className="hover:text-[#558b1a] transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 transition-all text-xs cursor-pointer shadow-xs"
            >
              Donate Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:text-[#558b1a]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2">
            <Link href="/" className="block py-1 text-sm font-semibold text-gray-700">Home</Link>
            <Link href="/about" className="block py-1 text-sm font-semibold text-gray-700">About Us</Link>
            <Link href="/programs" className="block py-1 text-sm font-semibold text-gray-700">Programs</Link>
            <Link href="/donate" className="block py-1 text-sm font-semibold text-gray-700">Donate</Link>
            <Link href="/contact" className="block py-1 text-sm font-semibold text-gray-700">Contact</Link>
          </div>
        )}
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#112708] to-[#1c3f0c] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8ac43e] hover:underline mb-6"
          >
            <IconArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#8ac43e] text-xs font-semibold mb-4 backdrop-blur-xs">
            <IconScale className="w-4 h-4" />
            <span>Governance, Terms & Stewardship</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Use & Donor Stewardship</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-200 leading-relaxed">
            Legal terms governing the use of this website, our charitable programs, donor rights, and transparent fund allocation.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-300 border-t border-white/10 pt-4">
            <div><strong>Registered Entity:</strong> The Trustees of Veronica Onyeneke Foundation</div>
            <div><strong>CAC Reg. No:</strong> 8101466</div>
            <div><strong>U.S. 501(c)(3):</strong> Veronica Onyeneke Foundation Corp.</div>
            <div><strong>Last Updated:</strong> 2026</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-10 space-y-8 text-gray-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconBuilding className="w-5 h-5 text-[#558b1a]" />
              1. Institutional Identity & Governance
            </h2>
            <p>
              This website is operated collaboratively by the Veronica Onyeneke Foundation’s recognized legal entities:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-2 text-xs">
              <p>
                <strong>Nigeria (Operating Trust):</strong> <span className="text-gray-900 font-semibold">The Trustees of Veronica Onyeneke Foundation</span>, officially registered with the Corporate Affairs Commission (CAC) under registration number <strong>8101466</strong>, incorporated on <strong>November 27, 2024</strong>. Responsible for operational program delivery, field operations, and vocational institutes in Nigeria.
              </p>
              <p>
                <strong>United States (501c3 Entity):</strong> <span className="text-gray-900 font-semibold">Veronica Onyeneke Foundation Corp.</span>, a recognized 501(c)(3) tax-exempt public charitable organization incorporated in Colorado, USA. Responsible for North American donor relations, institutional grants, and educational sponsorships.
              </p>
              <p>
                <strong>Rwanda Hub:</strong> <span className="text-gray-900 font-semibold">VOF Rwanda</span>, coordinating regional educational and humanitarian partnerships in Kigali.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconHeartHandshake className="w-5 h-5 text-[#558b1a]" />
              2. Strict Non-Profit & Non-Commercial Purpose
            </h2>
            <p>
              The Veronica Onyeneke Foundation is organized and operated exclusively for charitable, educational, and humanitarian public purposes within the meaning of applicable non-profit law.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>No Commercial Sales:</strong> The Foundation does not sell commercial goods, services, or multi-level products.</li>
              <li><strong>Tuition-Free & Subsidized Training:</strong> Vocational programs at the Veronica Onyeneke Institute of Entrepreneurship (VOIE) are charitable community programs aimed at reducing poverty and youth unemployment.</li>
              <li><strong>Transparent Allocation:</strong> 100% of all public donations, institutional grants, and corporate sponsorships directly support our core programs: vocational equipment and starter kits, maternal clinic care for vulnerable pregnant women, educational tuition scholarships, and rural medical outreaches.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconBuildingBank className="w-5 h-5 text-[#558b1a]" />
              3. Donation Policy, Entity Routing & Tax-Deductibility
            </h2>
            <p>
              To ensure legal compliance and tax transparency, donations are processed according to the donor’s location and selected channel:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-bold text-emerald-950 block text-sm">🇳🇬 Nigerian & African Giving</span>
                <p><strong>Recipient Entity:</strong> The Trustees of Veronica Onyeneke Foundation (CAC No. 8101466)</p>
                <p><strong>Channels:</strong> Paystack (cards, bank transfer, USSD) and Zenith Bank direct deposit.</p>
                <p><strong>Tax Treatment:</strong> In accordance with Nigerian tax regulations, contributions directly fund an incorporated charitable trust dedicated to public welfare in Nigeria.</p>
              </div>

              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-bold text-blue-950 block text-sm">🇺🇸 U.S. & International Giving</span>
                <p><strong>Recipient Entity:</strong> Veronica Onyeneke Foundation Corp. (USA 501(c)(3))</p>
                <p><strong>Channels:</strong> PayPal, Stripe, Zelle, international bank wire.</p>
                <p><strong>Tax Deductibility:</strong> Contributions by U.S. taxpayers are tax-deductible to the fullest extent allowed by Section 501(c)(3) of the U.S. Internal Revenue Code. Official tax receipts are generated for all qualifying gifts.</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              All online transactions are processed through certified, SSL-encrypted payment processors. Donors receive an automated digital acknowledgment upon successful completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconFileText className="w-5 h-5 text-[#558b1a]" />
              4. Beneficiary, Trainee & Volunteer Terms
            </h2>
            <p>
              Applicants for scholarships, vocational cohorts at VOIE, or volunteer programs agree to provide accurate, truthful personal and academic information.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Equal Opportunity:</strong> Programs are administered without discrimination based on religious affiliation, ethnicity, tribe, or gender.</li>
              <li><strong>Safeguarding & Dignity:</strong> All interactions with young pregnant women and vulnerable youth are guided by our strict Child & Vulnerable Person Safeguarding Code of Conduct.</li>
              <li><strong>Starter Kits:</strong> Starter business toolkits granted to VOIE graduates are conditional upon satisfactory cohort attendance and practical evaluation, designed solely to establish self-reliant livelihoods.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconScale className="w-5 h-5 text-[#558b1a]" />
              5. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria for matters concerning <strong>The Trustees of Veronica Onyeneke Foundation</strong>, and the laws of the State of Colorado and the United States of America for matters concerning <strong>Veronica Onyeneke Foundation Corp.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconMail className="w-5 h-5 text-[#558b1a]" />
              6. Legal Desk & Inquiries
            </h2>
            <p>
              For governance records, audit documentation, or inquiries regarding these Terms, contact our legal desk:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-1 text-xs">
              <p className="font-semibold text-gray-900">Office of the Board of Trustees</p>
              <p>The Trustees of Veronica Onyeneke Foundation (CAC Reg: 8101466)</p>
              <p>Email: <a href="mailto:info@vonf.org" className="text-[#558b1a] hover:underline">info@vonf.org</a> | Phone: +234 903 373 6826</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}
