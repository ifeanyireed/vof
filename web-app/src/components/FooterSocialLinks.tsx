"use client";

import React from "react";
import {
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandX,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

export const VOF_SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/veronica-onyeneke-foundation-vof/",
    icon: IconBrandLinkedin,
    color: "hover:bg-[#0a66c2]",
    label: "Follow VOF on LinkedIn",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/vero_foundation?igsh=MTR2aGxrb2FiaXQyaA==",
    icon: IconBrandInstagram,
    color: "hover:bg-gradient-to-tr hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af]",
    label: "Follow @vero_foundation on Instagram",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@Verofoundation",
    icon: IconBrandYoutube,
    color: "hover:bg-[#ff0000]",
    label: "Subscribe to @Verofoundation on YouTube",
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/VOnyeneke93105?t=KygyflMQ6Ddj9j23PbJOeA&s=09",
    icon: IconBrandX,
    color: "hover:bg-black",
    label: "Follow @VOnyeneke93105 on X",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/17ZfrGeGjM/?mibextid=qi2Omg",
    icon: IconBrandFacebook,
    color: "hover:bg-[#1877f2]",
    label: "Join VOF on Facebook",
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@vero.foundation6",
    icon: IconBrandTiktok,
    color: "hover:bg-neutral-900",
    label: "Watch @vero.foundation6 on TikTok",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/2349033736826",
    icon: IconBrandWhatsapp,
    color: "hover:bg-[#25d366]",
    label: "Chat with VOF on WhatsApp (+234 903 373 6826)",
  },
];

interface FooterSocialLinksProps {
  className?: string;
  showText?: boolean;
}

export default function FooterSocialLinks({ className = "", showText = true }: FooterSocialLinksProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6 relative z-10 ${className}`}>
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Connect With Veronica Onyeneke Foundation
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">
            Official social channels & direct WhatsApp desk (+234 903 373 6826)
          </span>
        </div>
      )}

      <div className="flex items-center flex-wrap gap-2.5">
        {VOF_SOCIAL_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
              className={`w-9 h-9 rounded-full bg-white/10 ${item.color} flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-sm group cursor-pointer`}
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
