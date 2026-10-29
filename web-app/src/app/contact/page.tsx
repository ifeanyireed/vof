"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconShieldCheck,
  IconSend,
  IconCheck,
  IconAlertCircle,
  IconLoader2,
  IconMenu2,
  IconX,
  IconArrowLeft,
  IconBuilding
} from "@tabler/icons-react";
import Footer from "@/components/Footer";
import DonateModal from "@/components/DonateModal";

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("General Inquiry");
  const [hub, setHub] = useState("Nigeria HQ");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMessage("Please complete all required fields (Name, Email, Message).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, category, hub, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while sending your message. Please email info@vonf.org directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Contact Us", href: "/contact", active: true },
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
            <Link href="/donate" className="text-[#fbbf24] hover:underline font-bold">
              Donate Online
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
                className={`transition-colors whitespace-nowrap ${
                  item.active ? "text-[#558b1a] font-bold" : "hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              onClick={(e) => {
                e.preventDefault();
                setIsDonateOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 transition-all text-xs cursor-pointer shadow-xs"
            >
              Donate Now
            </Link>
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
                className={`block py-1 text-sm font-semibold ${
                  item.active ? "text-[#558b1a] font-bold" : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
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
            <span>Official Non-Profit Secretariat & Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Our Global Teams</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-200 leading-relaxed">
            Reach out to our Nigerian Global Headquarters, United States 501(c)(3) Branch, or Rwanda Regional Office. We are here to answer questions regarding programs, partnerships, donations, and beneficiary applications.
          </p>
        </div>
      </section>

      {/* Global Offices Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Nigeria Global HQ Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border-2 border-[#558b1a]/30 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇳🇬</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Global HQ
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                The Trustees of Veronica Onyeneke Foundation
              </h3>
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 border border-gray-100 space-y-1">
                <div><strong>CAC Reg No:</strong> 8101466</div>
                <div><strong>Incorporation Date:</strong> Nov 27, 2024</div>
                <div><strong>Authority:</strong> Corporate Affairs Commission, Nigeria</div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-start gap-2.5">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] shrink-0 mt-0.5" />
                  <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State, Nigeria</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconPhone className="w-4 h-4 text-[#558b1a] shrink-0" />
                  <a href="tel:+2349033736826" className="hover:text-[#558b1a] font-semibold text-gray-800">+234 903 373 6826</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconMail className="w-4 h-4 text-[#558b1a] shrink-0" />
                  <a href="mailto:info@vonf.org" className="hover:text-[#558b1a] font-semibold text-gray-800">info@vonf.org</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconClock className="w-4 h-4 text-[#558b1a] shrink-0" />
                  <span>Mon – Fri: 8:30 AM – 5:00 PM WAT</span>
                </div>
              </div>
            </div>
          </div>

          {/* USA 501(c)(3) Branch Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  501(c)(3) Charity
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Veronica Onyeneke Foundation Corp.
              </h3>
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 border border-gray-100 space-y-1">
                <div><strong>Legal Status:</strong> U.S. 501(c)(3) Public Charity</div>
                <div><strong>Jurisdiction:</strong> Colorado, United States</div>
                <div><strong>Tax Deductible:</strong> Section 170(c)(2) eligible</div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-start gap-2.5">
                  <IconMapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>4196 S Himalaya Way, Aurora, CO 80013, United States</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconPhone className="w-4 h-4 text-blue-600 shrink-0" />
                  <a href="tel:+17206754211" className="hover:text-blue-600 font-semibold text-gray-800">+1 (720) 675-4211</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconMail className="w-4 h-4 text-blue-600 shrink-0" />
                  <a href="mailto:vofcorp@gmail.com" className="hover:text-blue-600 font-semibold text-gray-800">vofcorp@gmail.com</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconClock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Mon – Fri: 9:00 AM – 5:00 PM MST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rwanda Regional Hub Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🇷🇼</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Regional Hub
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                VOF Rwanda Office
              </h3>
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 border border-gray-100 space-y-1">
                <div><strong>Focus:</strong> East Africa Student Support & Alliances</div>
                <div><strong>Location:</strong> Kigali, Rwanda</div>
                <div><strong>Coordination:</strong> Community Field Desk</div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-start gap-2.5">
                  <IconMapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Kn82 Kiyovu Nyarurembo, Kigali, Rwanda</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconPhone className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href="tel:+250793156562" className="hover:text-amber-600 font-semibold text-gray-800">+250 793 156 562</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconMail className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href="mailto:admin.rwanda@vonf.org" className="hover:text-amber-600 font-semibold text-gray-800">admin.rwanda@vonf.org</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconClock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Mon – Fri: 9:00 AM – 4:30 PM CAT</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 sm:p-10">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Send an Official Message to Our Team</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Have a question about our vocational programs, scholarship intakes, young mother assistance, or institutional partnerships? Complete the form below and our secretariat will respond promptly.
            </p>
          </div>

          {submitSuccess ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                <IconCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">Thank You! Message Delivered Successfully</h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                We have received your inquiry. Our secretariat team at <strong>The Trustees of Veronica Onyeneke Foundation</strong> has logged your message and will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="inline-block mt-3 px-4 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <IconAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chinelo Okonkwo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#558b1a] focus:ring-2 focus:ring-[#558b1a]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#558b1a] focus:ring-2 focus:ring-[#558b1a]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#558b1a] focus:ring-2 focus:ring-[#558b1a]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Inquiry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#558b1a] focus:ring-2 focus:ring-[#558b1a]/20 bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="VOIE Vocational Training">VOIE Vocational Training</option>
                    <option value="Young Pregnant Women Support">Young Pregnant Women Support</option>
                    <option value="Education Scholarships">Education Scholarships</option>
                    <option value="Partnership / Grant Proposal">Partnership / Grant Proposal</option>
                    <option value="Donation / Receipt Verification">Donation / Receipt Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Recipient Hub
                  </label>
                  <select
                    value={hub}
                    onChange={(e) => setHub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#558b1a] focus:ring-2 focus:ring-[#558b1a]/20 bg-white"
                  >
                    <option value="Nigeria HQ">Nigeria Global HQ</option>
                    <option value="USA Branch">USA 501(c)(3) Branch</option>
                    <option value="Rwanda Hub">Rwanda Regional Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe how we can assist you or your organization..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#558b1a] focus:ring-2 focus:ring-[#558b1a]/20"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-gray-500">
                  By submitting, you agree to our <Link href="/privacy" className="text-[#558b1a] hover:underline">Privacy Policy</Link>.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-[#558b1a] hover:bg-[#467315] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <IconSend className="w-4 h-4" />
                      <span>Send Official Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}
