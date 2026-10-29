"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconShieldCheck,
  IconLock,
  IconEye,
  IconFileText,
  IconMail,
  IconPhone,
  IconMapPin,
  IconMenu2,
  IconX,
  IconArrowLeft,
  IconBuilding
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import DonateModal from "@/components/DonateModal";

export default function PrivacyPolicyPage() {
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
            <IconShieldCheck className="w-4 h-4" />
            <span>Official Policy & Legal Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-200 leading-relaxed">
            How The Trustees of Veronica Onyeneke Foundation and affiliated entities protect, manage, and respect your personal information and donor privacy.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-300 border-t border-white/10 pt-4">
            <div><strong>Entity:</strong> The Trustees of Veronica Onyeneke Foundation</div>
            <div><strong>CAC Reg. No:</strong> 8101466 (Nigeria)</div>
            <div><strong>Incorporation Date:</strong> November 27, 2024</div>
            <div><strong>Effective Date:</strong> November 27, 2024 (Last Updated: 2026)</div>
          </div>
        </div>
      </section>

      {/* Main Policy Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-10 space-y-8 text-gray-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconBuilding className="w-5 h-5 text-[#558b1a]" />
              1. Organization Identity & Data Controller
            </h2>
            <p>
              This Privacy Policy applies to all services, websites, programs, and outreach activities operated by:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-2 text-xs">
              <p><strong>Primary Operating Entity (Nigeria):</strong> <span className="text-gray-900 font-semibold">The Trustees of Veronica Onyeneke Foundation</span></p>
              <p><strong>Corporate Affairs Commission (CAC) Registration:</strong> <span className="text-gray-900 font-semibold">8101466</span> (Incorporated on November 27, 2024)</p>
              <p><strong>Head Office:</strong> Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State, Nigeria</p>
              <p><strong>United States Branch:</strong> <span className="text-gray-900 font-semibold">Veronica Onyeneke Foundation Corp.</span> (Colorado 501(c)(3) tax-exempt public charity, 4196 S Himalaya Way, Aurora, CO 80013)</p>
              <p><strong>East Africa Regional Hub:</strong> <span className="text-gray-900 font-semibold">VOF Rwanda</span> (Kn82 Kiyovu Nyarurembo, Kigali, Rwanda)</p>
            </div>
            <p>
              We treat the privacy of our website visitors, scholarship applicants, vocational trainees, young mothers, donors, and volunteers with the highest level of care, strict confidentiality, and integrity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconEye className="w-5 h-5 text-[#558b1a]" />
              2. Information We Collect
            </h2>
            <p>
              We only collect personal information that you voluntarily provide to us when interacting with our organization, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Contact & Inquiry Details:</strong> Full name, email address, telephone number, and message content submitted via our contact or support forms.</li>
              <li><strong>Beneficiary & Student Applications:</strong> Date of birth, gender, educational background, local government area (LGA), vocational trade preferences, and guardian details when applying for the Veronica Onyeneke Institute of Entrepreneurship (VOIE) or academic scholarships.</li>
              <li><strong>Maternal Assistance Records:</strong> Medical clinic intake, nutritional assistance records, and confidential family counseling details provided voluntarily by young pregnant women seeking care.</li>
              <li><strong>Volunteer Applications:</strong> Professional background, location, skills, availability, and uploaded CV/résumé.</li>
              <li><strong>Donation Transaction Records:</strong> Donor name, email address, transaction reference, contribution amount, and currency. <em>Note: We do not store or capture raw credit card numbers or banking passwords. All payments are processed through secure, PCI-DSS compliant third-party payment gateways (Paystack, PayPal, Stripe).</em></li>
              <li><strong>Technical Browsing Data:</strong> Standard server logs, anonymized IP addresses, browser types, and device information gathered strictly to ensure website performance and security.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconLock className="w-5 h-5 text-[#558b1a]" />
              3. How We Use Your Information
            </h2>
            <p>We use your personal data strictly for legitimate charitable and administrative purposes, specifically to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Process and review applications for vocational training, starter kits, and educational scholarships.</li>
              <li>Provide confidential healthcare, counseling, and nutritional support to young pregnant women and their infants.</li>
              <li>Issue official donation receipts, tax acknowledgments (for 501(c)(3) contributions), and stewardship reports.</li>
              <li>Coordinate volunteer cohorts and community outreach teams across Nigeria, Rwanda, and the United States.</li>
              <li>Respond directly to questions, institutional inquiries, and partnership proposals sent to our team.</li>
              <li>Ensure the security, integrity, and optimal technical speed of our web platform.</li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-medium">
              We never sell, rent, commercialize, or trade your personal information or donor details to third parties, commercial marketing agencies, or data brokers under any circumstances.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconShieldCheck className="w-5 h-5 text-[#558b1a]" />
              4. Data Protection & Security Standards
            </h2>
            <p>
              We maintain robust physical, electronic, and procedural safeguards to guard your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>SSL/TLS Encryption:</strong> All communications between your browser and our servers are encrypted with modern HTTPS 256-bit SSL certificates.</li>
              <li><strong>Role-Based Access:</strong> Only authorized Foundation staff, program coordinators, and legal representatives have access to sensitive beneficiary information.</li>
              <li><strong>Vulnerable Community Safeguards:</strong> Personal details and medical situations of vulnerable young mothers are treated with absolute confidentiality in strict compliance with child protection and human dignity standards.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconFileText className="w-5 h-5 text-[#558b1a]" />
              5. Your Legal Rights (NDPR, GDPR & Applicable Laws)
            </h2>
            <p>
              Under the Nigeria Data Protection Act (NDPA), the EU General Data Protection Regulation (GDPR), and relevant international data privacy laws, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request corrections to any inaccurate or incomplete records.</li>
              <li>Request the erasure of your personal records where no statutory or legal retention obligation applies.</li>
              <li>Withdraw your consent to communications at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
              <IconMail className="w-5 h-5 text-[#558b1a]" />
              6. Privacy Inquiries & Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy, your personal information, or wish to exercise your data rights, please contact our administrative desk:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-1.5 text-xs">
              <p className="font-semibold text-gray-900">The Trustees of Veronica Onyeneke Foundation</p>
              <p className="flex items-center gap-2 text-gray-600">
                <IconMapPin className="w-4 h-4 text-[#558b1a]" />
                Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State, Nigeria
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <IconPhone className="w-4 h-4 text-[#558b1a]" />
                +234 903 373 6826 / +1 (720) 675-4211
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <IconMail className="w-4 h-4 text-[#558b1a]" />
                <a href="mailto:info@vonf.org" className="text-[#558b1a] hover:underline">info@vonf.org</a> / <a href="mailto:vofcorp@gmail.com" className="text-[#558b1a] hover:underline">vofcorp@gmail.com</a>
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}
