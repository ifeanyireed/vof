"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowLeft,
  IconShieldCheck,
  IconBuildingBank,
  IconFileText,
  IconCheck,
  IconExternalLink,
  IconDownload,
  IconCopy
} from "@tabler/icons-react";

export default function FinancialReportsPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 3000);
  };

  const certificates = [
    {
      title: "U.S. IRS 501(c)(3) Determination Letter (Page 1)",
      issuer: "Department of the Treasury — Internal Revenue Service (IRS)",
      image: "/docs/vof-corp-501c3-cert-1.jpg",
      tag: "United States 501(c)(3)",
      desc: "Official IRS determination confirming Veronica Onyeneke Foundation Corp. as a tax-exempt charitable organization."
    },
    {
      title: "U.S. IRS 501(c)(3) Determination Letter (Page 2)",
      issuer: "Department of the Treasury — Internal Revenue Service (IRS)",
      image: "/docs/vof-corp-501c3-cert-2.jpg",
      tag: "United States 501(c)(3)",
      desc: "Detailed compliance codes and tax-deductible contribution authorizations under Section 170 of the Code."
    },
    {
      title: "VOF Rwanda Legal Registration Certificate (Page 1)",
      issuer: "Republic of Rwanda — Governance Board",
      image: "/docs/vof-rwanda-cert-1.jpg",
      tag: "Rwanda Registration",
      desc: "Legal compliance certificate authorizing humanitarian and educational initiatives in Rwanda."
    },
    {
      title: "VOF Rwanda Compliance Authorization (Page 2)",
      issuer: "Republic of Rwanda — Governance Board",
      image: "/docs/vof-rwanda-cert-2.jpg",
      tag: "Rwanda Registration",
      desc: "Statutory governance certificate validating educational partnerships and community support."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full px-6 lg:px-16 py-4 flex items-center justify-between border-b border-gray-100 shadow-xs">
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

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#558b1a] transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/blog"
            className="hidden sm:inline-flex text-xs font-bold text-gray-700 hover:text-[#558b1a] transition-colors"
          >
            VOF News & Stories
          </Link>
          <Link
            href="/#donate"
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs"
          >
            Donate
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#4d7f16] text-xs font-bold uppercase tracking-wider mb-4">
            <IconShieldCheck className="w-4 h-4" />
            <span>Fiduciary Responsibility & Audit Compliance</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1b2124] leading-tight mb-4">
            Financial Transparency & <br />
            <span className="text-[#558b1a]">Audit Documentation</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            The Veronica Onyeneke Foundation (VOF) operates under strict standards of transparency, accountability, and responsible stewardship across all international entities.
          </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden group">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-contain p-4 group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#558b1a] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {cert.tag}
                  </div>
                  <a
                    href={cert.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <span>View High-Res</span>
                    <IconExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">{cert.title}</h3>
                  <span className="text-xs font-semibold text-[#558b1a] mb-2">{cert.issuer}</span>
                  <p className="text-gray-600 text-xs leading-relaxed flex-grow">{cert.desc}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs">
            {/* GTBank */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#8ac43e] block mb-1">GTBank (Nigeria — NGN)</span>
                <span className="font-mono text-base font-bold text-white block my-1">3000273596</span>
                <span className="text-gray-400 block text-[11px]">Veronica Onyeneke Foundation</span>
              </div>
              <button
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
              </div>
              <button
                onClick={() => copyText("1228980969", "zenith")}
                className="mt-4 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{copiedItem === "zenith" ? "Copied!" : "Copy Account"}</span>
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
                onClick={() => copyText("vofcorp@gmail.com", "zelle")}
                className="mt-4 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{copiedItem === "zelle" ? "Copied!" : "Copy Zelle ID"}</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span>For institutional audit inquiries or grant verification, please email <strong>info@vonf.org</strong> or <strong>vofcorp@gmail.com</strong>.</span>
            <Link
              href="/#donate"
              className="px-6 py-2.5 bg-[#558b1a] text-white font-bold rounded-full hover:bg-[#477516] transition-colors text-xs whitespace-nowrap"
            >
              Make an Online Donation
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 px-6 border-t border-gray-100 bg-[#fbfdf9] text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.</p>
        <p className="mt-1">Empowering Lives. Restoring Hope. Creating Opportunities.</p>
      </footer>
    </div>
  );
}
