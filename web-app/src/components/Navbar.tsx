"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconMenu2,
  IconX,
  IconChevronDown,
  IconShieldCheck,
  IconArrowRight,
  IconSchool,
  IconBriefcase,
  IconHeart,
  IconFileText,
  IconPhoto,
  IconUsers,
  IconBuilding,
  IconSparkles,
} from "@tabler/icons-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Structured navigation hierarchy to satisfy Google Ad Grants clear navigation standards
  const navSections = [
    {
      label: "About Us",
      href: "/about",
      id: "about",
      children: [
        {
          title: "About the Foundation",
          desc: "Our history, vision, and charitable mission in Nigeria, the USA, and Rwanda",
          href: "/about",
        },
        {
          title: "Founder Legacy & Leadership",
          desc: "The living legacy of Veronica Onyeneke and executive board direction",
          href: "/about#founder-legacy",
        },
        {
          title: "Board & Operational Team",
          desc: "Meet our trustees, regional program directors, and field coordinators",
          href: "/about#team",
        },
        {
          title: "Legal Entities & CAC 8101466",
          desc: "Full statutory non-profit incorporation, 501(c)(3) standing, and RGB accreditation",
          href: "/about#legal-entities",
        },
      ],
    },
    {
      label: "Our Programs",
      href: "/programs",
      id: "programs",
      children: [
        {
          title: "Youth Skills Acquisition (VOIE)",
          desc: "Vocational trades, cosmetology, tailoring, electrical, ICT, and starter toolkits",
          href: "/programs#voie",
        },
        {
          title: "Vulnerable Young Mothers Care",
          desc: "Compassionate maternal guidance, clinical referrals, and dignity support",
          href: "/programs#maternal",
        },
        {
          title: "Academic Scholarship Triad",
          desc: "JAMB CBT sponsorship, secondary school coverage, and university grants",
          href: "/programs#scholarships",
        },
        {
          title: "Scholarship & Skills Beneficiaries",
          desc: "Verified student cohorts across Primary, Secondary, Tertiary & Skills programs",
          href: "/beneficiaries",
        },
        {
          title: "View All Programs & Curricula",
          desc: "Explore full syllabus, enrollment requirements, and eligibility guidelines",
          href: "/programs",
        },
      ],
    },
    {
      label: "Impact & Reports",
      href: "/outreach-reports",
      id: "impact",
      children: [
        {
          title: "Beneficiaries Directory",
          desc: "Official roster of sponsored scholars and vocational skills trainees",
          href: "/beneficiaries",
        },
        {
          title: "Field Outreach Reports",
          desc: "Verified community missions, school partnerships, and signed MoUs",
          href: "/outreach-reports",
        },
        {
          title: "Audited Financial Reports",
          desc: "Annual financial transparency, expenditure breakdowns, and donor stewardship",
          href: "/financial-reports",
        },
        {
          title: "Photo & Media Gallery",
          desc: "High-resolution photographic records of distributions, classrooms, and graduations",
          href: "/gallery",
        },
      ],
    },
    {
      label: "Get Involved",
      href: "/apply",
      id: "involved",
      children: [
        {
          title: "Apply for Scholarship Aid",
          desc: "100% free secondary, tertiary, and JAMB CBT exam sponsorship portal",
          href: "/apply/scholarship",
        },
        {
          title: "Apply for Skills Training (VOIE)",
          desc: "Enroll in free hands-on vocational courses with starter business toolkits",
          href: "/apply/skills",
        },
        {
          title: "Volunteer With Us",
          desc: "Share your professional expertise, mentorship, or field logistics support",
          href: "/volunteer",
        },
      ],
    },
    {
      label: "Stories & News",
      href: "/blog",
      id: "blog",
    },
    {
      label: "Contact",
      href: "/contact",
      id: "contact",
    },
  ];

  return (
    <>
      {/* STATUTORY REGISTRATION NOTIFICATION BANNER */}
      <div className="bg-[#112708] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-[#21430f] relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8ac43e] animate-pulse" />
            <span className="font-semibold text-emerald-200">Veronica Onyeneke Foundation</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="hidden sm:inline text-gray-200">CAC Reg. No: 8101466 (Nigeria)</span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="hidden md:inline text-gray-300">
              Legal: The Trustees of Veronica Onyeneke Foundation
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <Link
              href="/about#legal-entities"
              className="text-[#8ac43e] hover:underline font-medium"
            >
              Legal Entities & Governance
            </Link>
            <span className="text-gray-500">•</span>
            <Link href="/contact" className="text-gray-300 hover:text-white">
              Secretariat
            </Link>
            <span className="text-gray-500">•</span>
            <Link href="/donate" className="text-[#fbbf24] hover:underline font-bold">
              Donate Online
            </Link>
          </div>
        </div>
      </div>

      {/* PRIMARY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="https://res.cloudinary.com/kmflnrxu/image/upload/f_auto,q_auto/v1790233488/vof/logo.webp"
              alt="Veronica Onyeneke Foundation Official Seal"
              width={180}
              height={52}
              className="object-contain h-11 sm:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation Menu (Organized & Uncluttered) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold text-gray-700">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === "/"
                  ? "text-[#558b1a] font-bold bg-[#f4faec]"
                  : "hover:text-[#558b1a] hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            {navSections.map((section) => {
              const isDropdown = section.children && section.children.length > 0;
              const isActive =
                pathname === section.href ||
                (section.children && section.children.some((c) => pathname === c.href));

              if (!isDropdown) {
                return (
                  <Link
                    key={section.label}
                    href={section.href}
                    className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-[#558b1a] font-bold bg-[#f4faec]"
                        : "hover:text-[#558b1a] hover:bg-gray-50"
                    }`}
                  >
                    {section.label}
                  </Link>
                );
              }

              return (
                <div
                  key={section.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(section.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={section.href}
                    className={`px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-1 whitespace-nowrap ${
                      isActive
                        ? "text-[#558b1a] font-bold bg-[#f4faec]"
                        : "hover:text-[#558b1a] hover:bg-gray-50"
                    }`}
                  >
                    <span>{section.label}</span>
                    <IconChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </Link>

                  {/* Dropdown Card */}
                  {activeDropdown === section.id && (
                    <div
                      className="absolute left-0 top-full pt-1.5 w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseEnter={() => handleMouseEnter(section.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2.5 space-y-1">
                        {section.children?.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className="block p-2.5 rounded-xl hover:bg-[#f4faec] transition-colors group/item"
                          >
                            <div className="text-xs font-bold text-gray-900 group-hover/item:text-[#558b1a] flex items-center justify-between">
                              <span>{child.title}</span>
                              <IconArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#558b1a]" />
                            </div>
                            <div className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 font-normal">
                              {child.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action CTAs (Direct Crawlable Links) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/donate"
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-gray-950 font-bold rounded-full text-xs shadow-xs hover:shadow-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <IconHeart className="w-3.5 h-3.5 fill-current text-gray-950" />
              <span>Donate Now</span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU ACCORDION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-3 rounded-lg text-sm font-bold ${
                pathname === "/" ? "bg-[#f4faec] text-[#558b1a]" : "text-gray-800"
              }`}
            >
              Home
            </Link>

            {navSections.map((section) => (
              <div key={section.label} className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between py-1 px-3">
                  <Link
                    href={section.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-gray-900 hover:text-[#558b1a]"
                  >
                    {section.label}
                  </Link>
                </div>

                {section.children && section.children.length > 0 && (
                  <div className="mt-1 pl-4 space-y-1 border-l-2 border-[#8ac43e]/30 ml-3">
                    {section.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 px-2 text-xs text-gray-600 hover:text-[#558b1a]"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-xl text-xs shadow-xs"
              >
                Donate Now
              </Link>
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-[#558b1a] text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Apply for Programs
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
