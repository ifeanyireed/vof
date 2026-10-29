"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconHeart,
  IconShieldCheck,
  IconBuildingBank,
  IconCreditCard,
  IconBrandPaypal,
  IconCheck,
  IconCopy,
  IconSparkles,
  IconSchool,
  IconBriefcase,
  IconHeartHandshake,
  IconMenu2,
  IconX,
  IconArrowLeft,
  IconFileText,
  IconBuilding
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import DonateModal, { DonationMethod, DonationFrequency } from "@/components/DonateModal";
import { PaystackIcon, ZelleIcon } from "@/components/PaymentIcons";

export default function DonatePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateMethod, setDonateMethod] = useState<DonationMethod>("paystack");
  const [donateFrequency, setDonateFrequency] = useState<DonationFrequency>("once");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const openDonateModal = (method: DonationMethod, freq: DonationFrequency = "once") => {
    setDonateMethod(method);
    setDonateFrequency(freq);
    setIsDonateOpen(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
    { label: "Support & FAQs", href: "/support" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
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
            <Link href="/financial-reports" className="text-[#fbbf24] hover:underline font-bold">
              Audited Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#112708]">
              Veronica Onyeneke <span className="text-[#558b1a]">Foundation</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5 text-xs xl:text-sm font-semibold text-gray-700">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-[#558b1a] transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openDonateModal("paystack")}
              className="px-4 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 transition-all text-xs cursor-pointer shadow-xs"
            >
              Give Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:text-[#558b1a]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-sm font-semibold text-gray-700 hover:text-[#558b1a]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#112708] to-[#1c3f0c] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8ac43e] hover:underline mb-6"
          >
            <IconArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#8ac43e] text-xs font-semibold mb-4 backdrop-blur-xs">
            <IconShieldCheck className="w-4 h-4" />
            <span>100% Non-Profit Charitable Stewardship</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Support Our Humanitarian Mission</h1>
          <p className="mt-4 text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Your generous contributions equip young people with marketable vocational starter kits, care for young pregnant women in vulnerable circumstances, and sponsor educational scholarships.
          </p>
        </div>
      </section>

      {/* Entity Routing & Tax Deductibility Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Nigerian Charitable Entity */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border-2 border-emerald-200/90 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇳🇬</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Nigeria HQ • CAC 8101466
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">The Trustees of Veronica Onyeneke Foundation</h2>
                <p className="text-xs text-gray-500 mt-0.5">Incorporated Non-Governmental Charitable Trust (Nigeria)</p>
              </div>
              <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100 text-xs space-y-1 text-emerald-950">
                <div><strong>CAC Reg. No:</strong> 8101466</div>
                <div><strong>Incorporation Date:</strong> November 27, 2024</div>
                <div><strong>Authority:</strong> Corporate Affairs Commission, Nigeria</div>
                <div><strong>Designated Use:</strong> 100% funds VOIE skills toolkits, young mothers care, and local scholarships.</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => openDonateModal("paystack")}
                className="w-full px-4 py-2.5 bg-[#558b1a] hover:bg-[#467315] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <PaystackIcon className="w-4 h-4 text-white" />
                <span>Donate in Naira (Paystack)</span>
              </button>
              <button
                type="button"
                onClick={() => openDonateModal("bank")}
                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <IconBuildingBank className="w-4 h-4 text-gray-600" />
                <span>Direct Bank Wire (Zenith / GTB)</span>
              </button>
            </div>
          </div>

          {/* US 501(c)(3) Entity */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-blue-200/90 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  U.S. 501(c)(3) Tax-Deductible
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Veronica Onyeneke Foundation Corp.</h2>
                <p className="text-xs text-gray-500 mt-0.5">United States Public Charity (Colorado Non-Profit)</p>
              </div>
              <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 text-xs space-y-1 text-blue-950">
                <div><strong>Tax Status:</strong> 501(c)(3) Public Charity (IRS Authorized)</div>
                <div><strong>Tax Deductibility:</strong> Deductible under IRC Section 170 for U.S. taxpayers.</div>
                <div><strong>Receipts:</strong> Official digital IRS-compliant donation receipts issued.</div>
                <div><strong>Designated Use:</strong> Cross-border educational scholarships & grants.</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => openDonateModal("paypal")}
                className="w-full px-4 py-2.5 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <IconBrandPaypal className="w-4 h-4" />
                <span>Donate via PayPal (USD / Global)</span>
              </button>
              <button
                type="button"
                onClick={() => openDonateModal("zelle")}
                className="w-full px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-purple-200"
              >
                <ZelleIcon className="w-4 h-4 text-purple-700" />
                <span>Zelle Transfer (vofcorp@gmail.com)</span>
              </button>
            </div>
          </div>

          {/* Rwanda Regional Hub */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-amber-200/90 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇷🇼</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Rwanda RGB Registered
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Veronica Onyeneke Foundation Rwanda</h2>
                <p className="text-xs text-gray-500 mt-0.5">Accredited Non-Governmental Organization</p>
              </div>
              <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100 text-xs space-y-1 text-amber-950">
                <div><strong>Statutory Authority:</strong> Rwanda Governance Board (RGB)</div>
                <div><strong>Regional Mandate:</strong> East African student education & relief</div>
                <div><strong>Banking:</strong> Bank of Kigali (IBAN: RW34040100267865048646)</div>
                <div><strong>Designated Use:</strong> Textbooks, school fees, and child assistance in Kigali.</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => openDonateModal("bank")}
                className="w-full px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <IconBuildingBank className="w-4 h-4" />
                <span>Bank of Kigali Wire (RWF)</span>
              </button>
              <Link
                href="/contact"
                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <span>Contact Rwanda Desk</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Program Impact Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider">Transparent Allocation</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Where Your Donation Goes</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Every donation is deployed with absolute financial accountability and stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#558b1a] flex items-center justify-center">
              <IconBriefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">VOIE Vocational Starter Kits</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Provides modern sewing machines, solar installation tools, hair salon kits, and leathercrafting equipment to graduating youths so they can launch self-sustaining small enterprises.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <IconHeart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Young Pregnant Women Care</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Funds confidential prenatal clinic care, safe deliveries, infant nutritional support, family mediation, and subsequent vocational training to protect vulnerable mothers and their babies.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <IconSchool className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Academic Tuition Scholarships</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Covers full primary, secondary, and tertiary tuition fees, learning textbooks, uniforms, and examination registrations for brilliant but economically disadvantaged students.
            </p>
          </div>
        </div>

        {/* Bank Wire Details Accordion / Card */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <IconBuildingBank className="w-5 h-5 text-[#558b1a]" />
            Official Direct Bank Accounts (For Wire & Grants)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-700">
            {/* Zenith Bank */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-gray-900 block text-xs">Zenith Bank (Nigeria NGN)</span>
                <div><strong>Account Name:</strong> The Trustees of Veronica Onyeneke Foundation</div>
                <div><strong>Bank Name:</strong> Zenith Bank PLC</div>
                <div><strong>SWIFT:</strong> ZEIBNGLA</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-mono font-bold text-sm text-gray-900">1228980969</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("1228980969", "zenith")}
                  className="px-2 py-1 rounded-md bg-white border border-gray-200 text-[#558b1a] hover:bg-gray-100 text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedText === "zenith" ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "zenith" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* GTBank */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-gray-900 block text-xs">GTBank (Nigeria NGN)</span>
                <div><strong>Account Name:</strong> Veronica Onyeneke Foundation</div>
                <div><strong>Bank Name:</strong> Guaranty Trust Bank</div>
                <div><strong>SWIFT:</strong> GTBINGLA</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-mono font-bold text-sm text-gray-900">3000273596</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("3000273596", "gtb")}
                  className="px-2 py-1 rounded-md bg-white border border-gray-200 text-[#558b1a] hover:bg-gray-100 text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedText === "gtb" ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "gtb" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Bank of Kigali */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-gray-900 block text-xs">Bank of Kigali (Rwanda RWF)</span>
                <div><strong>Account Name:</strong> Veronica Onyeneke Foundation</div>
                <div><strong>IBAN:</strong> RW34040100267865048646</div>
                <div><strong>Currency:</strong> RWF</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-mono font-bold text-sm text-gray-900">100267865048</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("100267865048", "bok")}
                  className="px-2 py-1 rounded-md bg-white border border-gray-200 text-amber-700 hover:bg-gray-100 text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedText === "bok" ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "bok" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* United States */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-gray-900 block text-xs">United States (Zelle / ACH)</span>
                <div><strong>Organization:</strong> Veronica Onyeneke Foundation Corp.</div>
                <div><strong>Tax Status:</strong> 501(c)(3) Public Charity</div>
                <div><strong>Designation:</strong> International Scholarships & Grants</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-mono font-bold text-xs text-blue-700 truncate mr-1">vofcorp@gmail.com</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("vofcorp@gmail.com", "zelle")}
                  className="px-2 py-1 rounded-md bg-white border border-gray-200 text-blue-600 hover:bg-gray-100 text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  {copiedText === "zelle" ? <IconCheck className="w-3.5 h-3.5 text-blue-600" /> : <IconCopy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "zelle" ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              For audited financial reports, please visit our <Link href="/financial-reports" className="text-[#558b1a] font-semibold underline">Financial Transparency & Audit</Link> section or contact <a href="mailto:info@vonf.org" className="text-[#558b1a] font-semibold">info@vonf.org</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialMethod={donateMethod}
        initialFrequency={donateFrequency}
      />
    </div>
  );
}
