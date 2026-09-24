"use client";

import React, { useState } from "react";
import {
  IconCopy,
  IconCheck,
  IconBrandPaypal,
  IconBrandStripe,
  IconRepeat,
} from "@tabler/icons-react";
import { PaystackIcon, ZelleIcon } from "./PaymentIcons";
import { DonationMethod } from "./DonateModal";

interface FooterDirectGivingProps {
  onDonateClick: (method: DonationMethod, frequency?: "once" | "monthly") => void;
}

export default function FooterDirectGiving({ onDonateClick }: FooterDirectGivingProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="flex flex-col gap-3 text-xs text-gray-300">
      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Direct Giving</h4>

      {/* GTBank Card */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 relative group">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[#8ac43e] text-[11px]">GTBank (NGN):</span>
          <button
            type="button"
            onClick={() => copyToClipboard("3000273596", "gtb")}
            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy account number"
          >
            {copiedKey === "gtb" ? (
              <span className="text-green-400 flex items-center gap-0.5">
                <IconCheck className="w-3 h-3" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-0.5">
                <IconCopy className="w-3 h-3" /> Copy
              </span>
            )}
          </button>
        </div>
        <div className="font-mono text-white text-[12px] font-semibold tracking-wide">3000273596</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Veronica Onyeneke Foundation</div>
      </div>

      {/* Zenith Bank Card */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 relative group">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[#8ac43e] text-[11px]">Zenith Bank (NGN):</span>
          <button
            type="button"
            onClick={() => copyToClipboard("1228980969", "zenith")}
            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy account number"
          >
            {copiedKey === "zenith" ? (
              <span className="text-green-400 flex items-center gap-0.5">
                <IconCheck className="w-3 h-3" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-0.5">
                <IconCopy className="w-3 h-3" /> Copy
              </span>
            )}
          </button>
        </div>
        <div className="font-mono text-white text-[12px] font-semibold tracking-wide">1228980969</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Veronica Onyeneke Foundation</div>
      </div>

      {/* Zelle Card */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 relative group">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#fbbf24] text-[11px]">Zelle (USD):</span>
            <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded">501(c)(3)</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard("vofcorp@gmail.com", "zelle")}
            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            title="Copy Zelle email"
          >
            {copiedKey === "zelle" ? (
              <span className="text-green-400 flex items-center gap-0.5">
                <IconCheck className="w-3 h-3" /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-0.5">
                <IconCopy className="w-3 h-3" /> Copy
              </span>
            )}
          </button>
        </div>
        <div className="font-mono text-white text-[12px] font-semibold">vofcorp@gmail.com</div>
        <div className="text-[10px] text-gray-400 mt-0.5">Veronica Onyeneke Foundation Corp.</div>
      </div>

      {/* ONLINE DONATE BUTTONS (PAYPAL, STRIPE, ZELLE, PAYSTACK) WITH RECURRING GIVING */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
            Donate Online
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#558b1a]/30 text-[#8ac43e] px-2 py-0.5 rounded-full border border-[#558b1a]/40">
            <IconRepeat className="w-2.5 h-2.5" />
            Recurring
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Paystack Donate Button */}
          <button
            type="button"
            onClick={() => onDonateClick("paystack")}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#00c3f7]/15 hover:bg-[#00c3f7]/25 border border-[#00c3f7]/40 text-white text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            title="Donate via Paystack (Cards, Bank, USSD, Apple Pay - One-time or Recurring)"
          >
            <PaystackIcon className="w-3.5 h-3.5 text-[#00c3f7]" />
            <span className="group-hover:text-[#00c3f7] transition-colors">Paystack</span>
          </button>

          {/* PayPal Donate Button */}
          <button
            type="button"
            onClick={() => onDonateClick("paypal")}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#0070ba]/20 hover:bg-[#0070ba]/35 border border-[#0070ba]/50 text-white text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            title="Donate via PayPal to veronicaonyenekefoundation@gmail.com (One-time or Recurring)"
          >
            <IconBrandPaypal className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="group-hover:text-[#38bdf8] transition-colors">PayPal</span>
          </button>

          {/* Stripe Donate Button */}
          <button
            type="button"
            onClick={() => onDonateClick("stripe")}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#635bff]/20 hover:bg-[#635bff]/35 border border-[#635bff]/50 text-white text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            title="Donate via Stripe to veronicaonyenekefoundation@gmail.com (One-time or Recurring)"
          >
            <IconBrandStripe className="w-3.5 h-3.5 text-[#a5b4fc]" />
            <span className="group-hover:text-[#a5b4fc] transition-colors">Stripe</span>
          </button>

          {/* Zelle Donate Button */}
          <button
            type="button"
            onClick={() => onDonateClick("zelle")}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#7414ca]/20 hover:bg-[#7414ca]/35 border border-[#7414ca]/50 text-white text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer group shadow-xs"
            title="Donate via Zelle to vofcorp@gmail.com (One-time or Recurring)"
          >
            <ZelleIcon className="w-3.5 h-3.5 text-[#c084fc]" />
            <span className="group-hover:text-[#c084fc] transition-colors">Zelle</span>
          </button>
        </div>

        <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1">
          <span>US 501(c)(3) & NG NGO Tax-deductible</span>
          <button
            type="button"
            onClick={() => onDonateClick("paystack", "monthly")}
            className="text-[#8ac43e] hover:underline font-semibold cursor-pointer"
          >
            Give Monthly →
          </button>
        </div>
      </div>
    </div>
  );
}
