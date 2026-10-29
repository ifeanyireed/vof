import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import LiveChatWidget from "@/components/LiveChatWidget";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vonf.org"),
  title: {
    default: "The Trustees of Veronica Onyeneke Foundation (VOF) | Empowering Lives, Building Futures",
    template: "%s | Veronica Onyeneke Foundation",
  },
  description:
    "The Trustees of Veronica Onyeneke Foundation (CAC Reg. No. 8101466) is an incorporated Nigerian charitable nonprofit dedicated to youth vocational training (VOIE), compassionate maternal care for vulnerable young pregnant women, and academic scholarships.",
  keywords: [
    "Veronica Onyeneke Foundation",
    "VOF",
    "The Trustees of Veronica Onyeneke Foundation",
    "CAC 8101466",
    "Nigeria NGO",
    "vocational training Nigeria",
    "VOIE",
    "vulnerable pregnant women support",
    "Imo State charity",
    "Owerri vocational skills",
    "scholarships Nigeria",
    "501c3 foundation",
  ],
  authors: [{ name: "The Trustees of Veronica Onyeneke Foundation" }],
  creator: "Veronica Onyeneke Foundation",
  publisher: "The Trustees of Veronica Onyeneke Foundation",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://www.vonf.org",
  },
  openGraph: {
    title: "The Trustees of Veronica Onyeneke Foundation (VOF)",
    description:
      "Transforming lives through vocational empowerment, academic sponsorships, and compassionate community care for young pregnant women. Registered with the CAC (No. 8101466).",
    url: "https://www.vonf.org",
    siteName: "Veronica Onyeneke Foundation",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 600,
        height: 600,
        alt: "The Trustees of Veronica Onyeneke Foundation Official Seal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Trustees of Veronica Onyeneke Foundation (VOF)",
    description:
      "Transforming lives through vocational empowerment, academic sponsorships, and compassionate community care for young pregnant women. CAC Reg: 8101466.",
    images: ["/logo.webp"],
  },
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "The Trustees of Veronica Onyeneke Foundation",
  "alternateName": "Veronica Onyeneke Foundation",
  "legalName": "The Trustees of Veronica Onyeneke Foundation",
  "taxID": "8101466",
  "identifier": "CAC/IT/NO: 8101466",
  "foundingDate": "2024-11-27",
  "url": "https://www.vonf.org",
  "logo": "https://www.vonf.org/logo.webp",
  "image": "https://www.vonf.org/logo.webp",
  "description":
    "The Trustees of Veronica Onyeneke Foundation is a registered Nigerian non-governmental charitable trust (CAC Reg. No. 8101466) committed to youth vocational training through the Veronica Onyeneke Institute of Entrepreneurship, compassionate assistance for vulnerable young pregnant women, and education scholarships.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji",
    "addressLocality": "Owerri North",
    "addressRegion": "Imo State",
    "addressCountry": "NG",
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+234-903-373-6826",
      "contactType": "headquarters",
      "email": "info@vonf.org",
      "areaServed": ["NG", "Global"],
      "availableLanguage": ["English", "Igbo"],
    },
    {
      "@type": "ContactPoint",
      "telephone": "+1-720-675-4211",
      "contactType": "US 501(c)(3) Branch Operations",
      "email": "vofcorp@gmail.com",
      "areaServed": "US",
      "availableLanguage": "English",
    },
  ],
  "sameAs": [
    "https://facebook.com/veronicaonyenekefoundation",
    "https://instagram.com/veronicaonyenekefoundation",
    "https://x.com/veronicaonyenekefoundation",
    "https://youtube.com/@veronicaonyenekefoundation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrains.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <LiveChatWidget />
      </body>
    </html>
  );
}
