"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowRight,
  IconMapPin,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import FooterDirectGiving from "./FooterDirectGiving";
import DonateModal, { DonationMethod, DonationFrequency } from "./DonateModal";
import PartnerModal from "./PartnerModal";

export interface FooterProps {
  onDonateClick?: (method: DonationMethod, frequency?: "once" | "monthly") => void;
  onPartnerClick?: () => void;
}

export default function Footer({ onDonateClick, onPartnerClick }: FooterProps) {
  const [internalDonateOpen, setInternalDonateOpen] = useState(false);
  const [internalDonateMethod, setInternalDonateMethod] = useState<DonationMethod>("paystack");
  const [internalDonateFreq, setInternalDonateFreq] = useState<DonationFrequency>("once");
  const [internalPartnerOpen, setInternalPartnerOpen] = useState(false);

  const handleDonateClick = (method: DonationMethod, frequency?: "once" | "monthly") => {
    if (onDonateClick) {
      onDonateClick(method, frequency);
    } else {
      setInternalDonateMethod(method);
      setInternalDonateFreq(frequency || "once");
      setInternalDonateOpen(true);
    }
  };

  const handlePartnerClick = () => {
    if (onPartnerClick) {
      onPartnerClick();
    } else {
      setInternalPartnerOpen(true);
    }
  };

  return (
    <>
      {/* FOOTER SECTION (IDENTICAL TO HOMEPAGE DESIGN) */}
      <footer id="contact" className="relative w-full text-white overflow-hidden py-24 px-6 lg:px-16 isolate scroll-mt-20">
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <Image
            src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/footer.jpg"
            alt="Veronica Onyeneke Foundation Community Support Background"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091503]/95 via-[#112708]/85 to-[#1c3f0c]/70 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between min-h-[480px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            {/* Col 1: Mission & Quick Links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="text-xs text-[#8ac43e] font-semibold">
                &ldquo;Empowering individuals. Strengthening families.&rdquo;
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-xs">
                <Link href="/about" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>About Us & Founder Story</span>
                </Link>
                <Link href="/programs" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Vocational Programs & Institute</span>
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
                <Link href="/support" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Support Center & FAQs</span>
                </Link>
                <button
                  type="button"
                  onClick={handlePartnerClick}
                  className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Become a Partner Today</span>
                </button>
              </div>
            </div>

            {/* Col 2: Nigeria Global HQ */}
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>🇳🇬 Nigeria (Global HQ)</span>
              </h4>
              <p className="flex items-start gap-2">
                <IconMapPin className="w-4 h-4 text-[#8ac43e] flex-shrink-0 mt-0.5" stroke={1.2} />
                <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</span>
              </p>
              <p className="flex items-center gap-2">
                <IconPhone className="w-4 h-4 text-[#8ac43e] flex-shrink-0" stroke={1.2} />
                <span>+234 903 373 6826</span>
              </p>
              <p className="flex items-center gap-2">
                <IconMail className="w-4 h-4 text-[#8ac43e] flex-shrink-0" stroke={1.2} />
                <span>info@vonf.org</span>
              </p>
            </div>

            {/* Col 3: USA & Rwanda Hubs */}
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>🇺🇸 USA (501c3) & 🇷🇼 Rwanda</span>
              </h4>
              <div className="space-y-1">
                <span className="font-bold text-white block">VOF Corp. (USA):</span>
                <span>4196 S Himalaya Way, Aurora, CO 80013</span>
                <span className="block text-gray-400">+1 (720) 675-4211 • vofcorp@gmail.com</span>
              </div>
              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="font-bold text-white block">VOF Rwanda:</span>
                <span>Kn82 Kiyovu Nyarurembo, Kigali, Rwanda</span>
                <span className="block text-gray-400">+250 793 156 562 • admin.rwanda@vonf.org</span>
              </div>
            </div>

            {/* Col 4: Direct Giving & Online Donate Buttons */}
            <FooterDirectGiving onDonateClick={handleDonateClick} />
          </div>

          {/* Social Media Link Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 relative z-10 border-t border-white/10 pt-6">
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Follow Our Journey</span>
              <span className="text-xs text-gray-300 mt-0.5">@veronicaonyenekefoundation on all major platforms</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/veronicaonyenekefoundation" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#558b1a] flex items-center justify-center text-white transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="https://instagram.com/veronicaonyenekefoundation" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#558b1a] flex items-center justify-center text-white transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://x.com/veronicaonyenekefoundation" target="_blank" rel="noopener noreferrer" aria-label="X" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#558b1a] flex items-center justify-center text-white transition-all">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com/@veronicaonyenekefoundation" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#558b1a] flex items-center justify-center text-white transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center border-t border-white/10 pt-6 text-xs text-gray-400 font-medium w-full">
            <div className="text-center md:text-left mb-3 md:mb-0">
              © {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.
            </div>
            <div className="text-center mb-3 md:mb-0 text-gray-300">
              Empowering Lives. Restoring Hope. Creating Opportunities.
            </div>
            <div className="text-center md:text-right text-[11px] text-gray-400 flex items-center justify-center md:justify-end gap-3">
              <span>501(c)(3) Nonprofit</span>
              <span>•</span>
              <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 font-semibold underline-offset-4 hover:underline">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Internal DonateModal fallback if page doesn't manage its own */}
      {!onDonateClick && (
        <DonateModal
          isOpen={internalDonateOpen}
          onClose={() => setInternalDonateOpen(false)}
          initialMethod={internalDonateMethod}
          initialFrequency={internalDonateFreq}
        />
      )}

      {/* Internal PartnerModal fallback if page doesn't manage its own */}
      {!onPartnerClick && (
        <PartnerModal
          isOpen={internalPartnerOpen}
          onClose={() => setInternalPartnerOpen(false)}
        />
      )}
    </>
  );
}
