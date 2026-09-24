'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Globe2,
  CheckCircle2,
  Heart
} from 'lucide-react';

export default function ApplyHubPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full px-6 lg:px-16 py-4 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Veronica Onyeneke Foundation Logo"
            width={180}
            height={50}
            className="object-contain h-12 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            About Us
          </Link>
          <Link href="/programs" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Programs
          </Link>
          <Link href="/volunteer" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Volunteer
          </Link>
          <Link href="/financial-reports" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Financial Reports
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/#donate"
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs"
          >
            Donate
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0c1a05] via-[#1a3811] to-[#0c1a05] text-white py-20 px-6 lg:px-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Opportunities for Growth & Service</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            VOF Community <br />
            <span className="text-[#8ac43e]">Application Portal</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Choose your application track below to apply for tuition aid, enroll in free technical training, or register as a global volunteer.
          </p>
        </div>
      </section>

      {/* Application Cards */}
      <main className="max-w-5xl mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Volunteer Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col justify-between hover:shadow-2xl transition group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#558b1a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                Join The Movement
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-4 mb-2">
                Volunteer Network
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Lend your medical, educational, mentorship, or logistics expertise to serve communities in Nigeria, Rwanda, and the United States.
              </p>
            </div>
            <Link
              href="/volunteer"
              className="w-full py-3 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Apply to Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* VOIE Skills Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col justify-between hover:shadow-2xl transition group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                VOIE Institute
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-4 mb-2">
                Skills Acquisition
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Apply for 100% tuition-free vocational courses in Fashion, ICT, Baking, Leatherwork, Cosmetology, and Solar Technology with starter toolkits.
              </p>
            </div>
            <Link
              href="/apply/skills"
              className="w-full py-3 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Apply for VOIE Training</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Scholarship Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col justify-between hover:shadow-2xl transition group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                Academic Aid
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-4 mb-2">
                Scholarship Grants
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Tuition coverage, JAMB/WAEC exam waivers, and academic bursaries for indigent students in accredited universities and polytechnics.
              </p>
            </div>
            <Link
              href="/apply/scholarship"
              className="w-full py-3 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Apply for Scholarship</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 px-6 border-t border-gray-100 bg-[#fbfdf9] text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.</p>
        <p className="mt-1">Empowering Lives. Restoring Hope. Creating Opportunities.</p>
      </footer>
    </div>
  );
}
