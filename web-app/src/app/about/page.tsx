"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconHeart,
  IconSparkles,
  IconShieldCheck,
  IconWorld,
  IconUsers,
  IconSchool,
  IconRocket,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCheck,
  IconCopy,
  IconArrowRight,
  IconBuildingBank,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import DonateModal, { DonationMethod, DonationFrequency } from "@/components/DonateModal";
import FooterDirectGiving from "@/components/FooterDirectGiving";

export interface TeamMember {
  name: string;
  role: string;
  location: string;
  image: string;
  bio: string[];
  highlights: string[];
  email?: string;
  phone?: string;
}

// Board of Trustees & Executive Team
const leadershipTeam: TeamMember[] = [
  {
    name: "Rev. Charles Onyeneke",
    role: "Founder & Chairman",
    location: "Albany, NY / Imo State",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg",
    bio: [
      "Rev. Charles Onyeneke is the Founder of the Veronica Onyeneke Foundation. Born and raised in a devout Catholic family in Umuodu Mbieri, Imo State, Nigeria, Charles witnessed the powerful example of faith, generosity, and service lived by his late mother, Veronica Onyeneke, and his father. This upbringing inspired his lifelong devotion to the Church and his calling to the priesthood.",
      "After completing extensive philosophical and theological formation at Seat of Wisdom Seminary, Imo State University, and the Pontifical Urban University in Rome, Charles continued advanced graduate studies in the United States. He earned a Master's degree from Saint Leo University, Florida, and a prestigious Licentiate in Sacred Theology (S.T.L.) from St. Mary's Seminary and University in Baltimore, Maryland.",
      "Ordained as a Roman Catholic priest for the Diocese of Albany, New York, in 2020, Rev. Charles now serves as Pastor for several parishes in Albany and as Chaplain of All Saints Catholic Academy. His deep pastoral commitment extends to uplifting vulnerable youths, widows, and low-income families through educational scholarships, maternal healthcare, and practical vocational empowerment.",
      "The Veronica Onyeneke Foundation was established in honor of his late mother, continuing her legacy of selfless generosity and care for the poor across Nigeria and Africa."
    ],
    highlights: [
      "Licentiate in Sacred Theology (S.T.L.) — St. Mary's Seminary & University, Baltimore, MD",
      "Master of Arts (M.A.) — Saint Leo University, Florida",
      "B.A. Philosophy & Theology — Pontifical Urban University, Rome & Imo State University",
      "Ordained Roman Catholic Priest (2020), Diocese of Albany, New York",
      "Founder of VOF Nigeria and VOF Corp. USA (501(c)(3) tax-exempt entity)"
    ]
  },
  {
    name: "Mrs. Glory Ozor",
    role: "Trustee / VOFC President",
    location: "Colorado, United States",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233561/vof/team/glory-ozor.png",
    bio: [
      "Mrs. Glory Ozor, based in Colorado, is one of the Foundation’s most cheerful, dedicated, and caring leaders. Serving as a Trustee, President of VOF Corp. (VOFC), and our primary representative in the United States, she brings warmth, dedication, and a true love for philanthropic service.",
      "She plays a key role in guiding foundation governance, connecting with international partners, and helping VOF expand its reach to serve vulnerable communities in Nigeria and Africa. Her kindness and commitment continue to inspire everything we do."
    ],
    highlights: [
      "President, Veronica Onyeneke Foundation Corp. (VOFC USA)",
      "Member, Board of Trustees",
      "Oversees U.S. 501(c)(3) governance, compliance, and international donor partnerships",
      "Strategic director for transatlantic community outreach and resource mobilization"
    ]
  },
  {
    name: "Mr. Elvis Onyeneke",
    role: "Trustee / CEO Cloveebiz Limited",
    location: "Nigeria",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233561/vof/team/elvis-onyeneke.png",
    email: "enomso@yahoo.com",
    bio: [
      "Elvis Onyeneke is a Trustee of the Veronica Onyeneke Foundation and the visionary Founder and CEO of Cloveebiz Limited, a premier technology consulting firm specializing in enterprise IT infrastructure and cybersecurity.",
      "With over 20 years of industry experience, Elvis has led Cloveebiz to deliver innovative, growth-focused technology solutions for enterprises across various sectors, scaling the company into a multi-million-dollar enterprise.",
      "He brings his extensive corporate leadership, cybersecurity background, and strategic planning skills to guide VOF's digital growth, IT operations, and youth technical training."
    ],
    highlights: [
      "Founder and CEO, Cloveebiz Limited",
      "Certified Information Systems Security Professional (CISSP)",
      "Member, Information Systems Audit and Control Association (ISACA)",
      "Over 20 years experience in IT infrastructure, cloud computing & digital transformation",
      "Reduced enterprise data breaches by 40% through proactive cybersecurity architectures"
    ]
  },
  {
    name: "Mr. Sixtus Igbokwe",
    role: "Trustee / Writer & Educator",
    location: "Nigeria / United States",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233564/vof/team/sixtus-igbokwe.png",
    bio: [
      "Sixtus Cheta Igbokwe serves as a Trustee of the Veronica Onyeneke Foundation. He is an accomplished Nigerian writer, playwright, and educator dedicated to youth education, storytelling, and cultural empowerment.",
      "He is currently an MFA candidate at the prestigious University of Iowa in the United States. At VOF, he advises on youth curriculum development, educational mentorship, and narrative strategies that highlight the resilience and potential of the communities we serve."
    ],
    highlights: [
      "Member, Board of Trustees",
      "MFA Candidate, The University of Iowa, United States",
      "Celebrated Nigerian writer, educator, and dramatist",
      "Advises on youth literacy, curriculum development, and educational mentorship"
    ]
  },
  {
    name: "Dr. Chioma Okwudinma",
    role: "Trustee / Optometrist",
    location: "Nigeria",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/chioma-okwudinma.png",
    bio: [
      "Dr. Chioma Okwudinma serves as a Trustee of the Veronica Onyeneke Foundation, where she helps guide the organization's governance, community health initiatives, and strategic direction.",
      "As a practicing optometrist, Dr. Okwudinma has spent her career putting smiles on people's faces by restoring their sight and caring for their eye health. She brings that same compassion, clinical precision, and dedication to everything she does.",
      "She has a deep passion for charity work and believes wholeheartedly in reaching out to the vulnerable and bringing hope to those who need it most. Her warmth and commitment make her a valued pillar on the Board."
    ],
    highlights: [
      "Doctor of Optometry (O.D.) & clinical eye care specialist",
      "Member, Board of Trustees",
      "Guides VOF healthcare outreach, vision screenings, and medical relief interventions",
      "Advocate for maternal healthcare, rural wellness, and community support"
    ]
  },
  {
    name: "Onyinyechi Emmanuela Eze",
    role: "Trustee / Finance & Accounting Specialist",
    location: "Nigeria",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233564/vof/team/onyinyechi-eze.png",
    bio: [
      "Onyinyechi Emmanuela Eze serves as a Trustee of the Veronica Onyeneke Foundation. In this role, she helps guide the Foundation’s governance, provide strategic financial oversight, and support its mission to serve vulnerable communities.",
      "She brings nearly a decade of experience in accounting and financial management, with a strong focus on accuracy, compliance, and internal financial controls. Her professional background includes managing complex financial processes and ensuring institutional accountability at every level.",
      "Beyond her finance career, Onyinyechi has extensive volunteer experience in event planning, logistics management, vendor relations, and on-site operational execution. Driven by a deep passion for humanity, she is committed to helping VOF create lasting and sustainable impact."
    ],
    highlights: [
      "Nearly a decade of experience in corporate accounting, financial controls & compliance",
      "Member, Board of Trustees",
      "Directs fiduciary oversight, budget accountability, and audit readiness",
      "Specialist in event logistics, vendor relations, and volunteer project coordination"
    ]
  },
  {
    name: "Patrick Chikaodinaka Ibekwe",
    role: "Board Secretary",
    location: "Nigeria",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233563/vof/team/patrick-ibekwe.jpg",
    bio: [
      "Patrick Chikaodinaka Ibekwe serves as the Board Secretary of the Veronica Onyeneke Foundation. In this capacity, he provides executive administrative support to the Board of Trustees, ensures the meticulous recording and archiving of minutes, and coordinates official communications.",
      "He brings years of experience in administrative and secretarial roles, with a strong focus on documentation, record-keeping, and coordination. His background includes managing correspondence, scheduling meetings, preparing comprehensive reports, and ensuring seamless communication across all teams.",
      "Beyond his administrative career, Patrick is actively involved in coordinating Foundation activities and volunteer engagements on the ground. His ability to organize, document, and follow through on action points makes him an integral part of VOF's daily operations."
    ],
    highlights: [
      "Board Secretary & Chief Administrative Liaison",
      "Custodian of official Board minutes, statutory documentation, and correspondence",
      "Coordinates cross-functional communication between leadership and operational teams",
      "Field coordinator for volunteer mobilization and community welfare activations"
    ]
  },
  {
    name: "Nora Chinwe Nwokorie",
    role: "Administrator",
    location: "Nigeria HQ",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233563/vof/team/nora-nwokorie.jpg",
    bio: [
      "Nora Chinwe Nwokorie is an organized, resourceful professional serving as the Administrator at the Veronica Onyeneke Foundation. With a strong practical background in administrative management, virtual assistance, and operational coordination, she brings a structured, reliable approach to supporting daily workflows and core visions.",
      "In addition to her administrative expertise, Nora is an enterprising entrepreneur who has successfully managed independent business ventures in the fashion and aquaculture sectors. This background equips her with a versatile skill set, a sharp eye for operational detail, and a deep understanding of resource management and community engagement.",
      "Outside of her professional life, Nora is a passionate lover of music and choral performance. She believes that a balanced life fuels professional excellence, bringing vibrant energy and organizational dedication to VOF's mission."
    ],
    highlights: [
      "Lead Administrator, Veronica Onyeneke Foundation Headquarters",
      "Specialist in administrative management, operational coordination & executive support",
      "Entrepreneurial leadership experience across fashion design and aquaculture",
      "Oversees office logistics, resource allocation, and beneficiary documentation"
    ]
  },
  {
    name: "Uba Frances Ogochukwu",
    role: "Accounts Manager",
    location: "Nigeria HQ",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233564/vof/team/uba-ogochukwu.jpg",
    bio: [
      "Frances Ogochukwu Uba serves as the Accounts Manager for the Veronica Onyeneke Foundation. With a deep passion for charity and community service, Miss Frances was inspired to join the foundation by the extraordinary life and legacy of her late grandmother, Veronica Onyeneke.",
      "Raised by her grandparents, she carries forward her grandmother’s values of compassion, empathy, and steadfast dedication to serving others as guiding principles in her life and work.",
      "In her role as Accounts Manager, Miss Frances brings expertise in accounting and community outreach. She is responsible for overseeing the financial operations of the foundation, ensuring that resources and donations are effectively utilized to maximize grassroots impact. Outside her professional commitments, she dedicates her time to community volunteering and environmental projects."
    ],
    highlights: [
      "Granddaughter of late Mrs. Veronica Onyeneke, stewarding the founding family legacy",
      "Accounts Manager overseeing financial operations, disbursements & bookkeeping",
      "Ensures transparent resource utilization and donor fund accountability",
      "Active volunteer in youth environmental and grassroots outreach initiatives"
    ]
  },
  {
    name: "Rev. Fr. Oguledo Achilleus Chidiebere",
    role: "Imo State Coordinator",
    location: "Imo State, Nigeria",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233559/vof/team/achilleus-oguledo.jpg",
    email: "oguledoachilleus@gmail.com",
    phone: "08139094216",
    bio: [
      "Rev. Fr. Oguledo Achilleus Chidiebere serves as the Imo State Coordinator for the Veronica Onyeneke Foundation. A devoted Catholic priest of the Diocese of Ahiara Mbaise, he embodies a life dedicated to pastoral care, compassion, and community transformation.",
      "Fr. Oguledo has an impressive academic background, holding a Bachelor of Arts in Philosophy, a Bachelor of Theology, and B1 & B2 Diplomas in the French Language. He currently serves as the Assistant Parish Priest at St. Anthony’s Parish, Umunama Ezinihitte Mbaise, demonstrating an unwavering commitment to pastoral care and community upliftment.",
      "A skilled polyglot residing at Umuakali Amaohuru Nguru, Aboh Mbaise LGA, his field leadership ensures seamless planning, direct beneficiary verification, and grassroots engagement for VOF's community initiatives across Imo State."
    ],
    highlights: [
      "Imo State Field Coordinator, Veronica Onyeneke Foundation",
      "Catholic Priest, Diocese of Ahiara Mbaise & Assistant Parish Priest at St. Anthony's Parish",
      "B.A. Philosophy, Bachelor of Theology (B.Th.), B1/B2 Diplomas in French Language",
      "Coordinates grassroots logistics, beneficiary onboarding, and community welfare programs across Imo State"
    ]
  },
  {
    name: "Mary Cynthia Ijeoma Anyanwu",
    role: "Community Outreach & Media Lead",
    location: "Nigeria",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233563/vof/team/mary-anyanwu.jpg",
    bio: [
      "Mary Cynthia Ijeoma Anyanwu serves as the Media Lead and Community Outreach Specialist for the Veronica Onyeneke Foundation. She believes that the right story, told to the right people, can move entire communities—and that belief is exactly what she brings to VOF.",
      "A qualified Nutritionist Dietitian and passionate advocate for UN Sustainable Development Goal 4 (Quality Education), Mary Cynthia understands that lasting change is built on education, healthcare, and purposeful storytelling. She is responsible for shaping VOF's digital presence, creating impactful content that amplifies our mission, and engaging supporters worldwide.",
      "Beyond her media work with VOF, Mary Cynthia is the initiator and Project Lead of Clean Water Brighter Future 2025, reflecting her dedication to sustainable community development. She also operates as an independent social media strategist and technical virtual assistant."
    ],
    highlights: [
      "Media Lead & Community Outreach Specialist, Veronica Onyeneke Foundation",
      "Professional Nutritionist Dietitian & UN SDG 4 (Quality Education) Advocate",
      "Initiator & Project Lead, 'Clean Water Brighter Future 2025'",
      "Directs digital communications, multimedia storytelling, and public relations"
    ]
  }
];

// VOF Rwanda Team
const rwandaTeam: TeamMember[] = [
  {
    name: "Rev. Charles Onyeneke",
    role: "Founder & Chairman",
    location: "Kigali, Rwanda / Global",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg",
    bio: [
      "Rev. Charles Onyeneke is the Founder and Chairman of the Veronica Onyeneke Foundation. He established VOF Rwanda to expand the foundation's compassionate outreach across East Africa, providing vital educational support, school supplies, healthcare awareness, and economic empowerment to vulnerable families.",
      "Under his visionary leadership, VOF Rwanda has secured legal registration, forging strategic partnerships with local community stakeholders, schools, and civic organizations to deliver sustainable, long-term impact across Kigali and neighboring Rwandan communities.",
      "Rev. Charles continues to champion the foundation's international expansion, uniting global resources with local grassroots leadership to uplift underprivileged youth, vulnerable women, and underserved communities."
    ],
    highlights: [
      "Founder and Chairman of Veronica Onyeneke Foundation Global and VOF Rwanda",
      "Spearheaded international outreach and legal registration of VOF in Rwanda",
      "Directs philanthropic expansion, cross-border resource mobilization, and partner networks",
      "Dedicated Roman Catholic Priest and lifelong humanitarian advocate"
    ]
  },
  {
    name: "Shekinah Umuringa",
    role: "Rwanda Legal Representative",
    location: "Kigali, Rwanda",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233563/vof/team/shekinah-umuringa.jpg",
    phone: "+250 789 066 186",
    bio: [
      "Shekinah Umuringa serves as the Legal Representative of the Veronica Onyeneke Foundation in Rwanda. She is deeply passionate about community development and committed to advancing the foundation’s mission of compassion, empowerment, and support for vulnerable communities.",
      "In her role, Shekinah coordinates and oversees the foundation’s statutory compliance, institutional governance, and on-ground project execution in Rwanda, working closely with local partners and communities to implement impactful programs that promote positive social change.",
      "Her leadership focuses on sustainable humanitarian relief, educational sponsorships, and community empowerment initiatives, ensuring every project creates long-lasting transformation across Rwanda."
    ],
    highlights: [
      "VOF Rwanda Legal Representative & In-Country Director",
      "Coordinates statutory compliance, institutional governance, and local partnership agreements",
      "Oversees program planning, grassroots implementation, and field operations",
      "Leads educational assistance, community empowerment, and humanitarian relief initiatives"
    ]
  },
  {
    name: "Byiringiro Elie Prince",
    role: "Volunteer Coordinator",
    location: "Kigali, Rwanda",
    image: "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233559/vof/team/byiringiro-elie-prince.jpg",
    phone: "+250 783 404 941",
    bio: [
      "Byiringiro Elie Prince serves in the Veronica Onyeneke Foundation as the Volunteer Coordinator in Rwanda. In this role, he supports the planning and coordination of volunteer activities, mobilizes volunteers, and helps ensure that community initiatives run smoothly and effectively.",
      "He is passionate about youth empowerment, community service, leadership, and creating positive social impact through volunteerism.",
      "Through his dedication and service, he works to inspire collaboration among volunteers and contribute to initiatives that bring meaningful change to communities."
    ],
    highlights: [
      "Volunteer Coordinator, VOF Rwanda",
      "Mobilizes, trains, and coordinates volunteer teams for on-ground community outreach",
      "Supports project logistics, community engagement, and youth mentorship",
      "Passionate advocate for youth leadership and civic community transformation"
    ]
  }
];

const coreValues = [
  { title: "Compassion", desc: "We treat every person with empathy, dignity, kindness, and deep respect." },
  { title: "Empowerment", desc: "We equip individuals with knowledge, skills, confidence, and opportunities to improve their lives." },
  { title: "Integrity", desc: "We embrace transparency, accountability, honesty, and responsible financial stewardship." },
  { title: "Dignity", desc: "We recognize and respect the inherent God-given worth of every person." },
  { title: "Innovation", desc: "We encourage creativity, entrepreneurship, and practical approaches to community challenges." },
  { title: "Inclusion", desc: "We create pathways that welcome and uplift people from diverse backgrounds and circumstances." },
  { title: "Sustainability", desc: "We prioritize initiatives that produce long-lasting, generational improvements." }
];

export default function AboutPage() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateMethod, setDonateMethod] = useState<DonationMethod>("paystack");
  const [donateFrequency, setDonateFrequency] = useState<DonationFrequency>("once");

  const openDonate = (method: DonationMethod = "paystack", frequency: DonationFrequency = "once") => {
    setDonateMethod(method);
    setDonateFrequency(frequency);
    setIsDonateOpen(true);
  };
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [donationCurrency, setDonationCurrency] = useState<"NGN" | "USD">("NGN");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (selectedMember || isDonateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMember, isDonateOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMember(null);
        setIsDonateOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about", active: true },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Financial Reports", href: "/financial-reports" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs transition-all">
        <div className="w-full px-6 lg:px-16 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
              alt="Veronica Onyeneke Foundation Logo"
              width={180}
              height={52}
              className="object-contain h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Clean Desktop Navigation (External Pages Only) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.active) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`font-semibold transition-colors duration-200 text-sm ${
                  item.active
                    ? "text-[#558b1a] font-bold"
                    : "text-gray-700 hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-xs cursor-pointer shadow-sm"
            >
              Donate Now
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-sm"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (item.active) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`block py-2 text-sm font-semibold ${
                    item.active ? "text-[#558b1a] font-bold" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SUB-NAVIGATION STICKY BAR FOR QUICK JUMP */}
      <div className="bg-[#f7faf5] border-b border-gray-200/70 py-3 px-6 lg:px-16 sticky top-[69px] z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-8 text-xs font-semibold text-gray-600 whitespace-nowrap">
          <span className="text-gray-400 uppercase tracking-wider text-[11px]">Jump to:</span>
          <a href="#who-we-are" className="hover:text-[#558b1a] transition-colors">Who We Are</a>
          <a href="#inspiration" className="hover:text-[#558b1a] transition-colors">The Inspiration</a>
          <a href="#founder" className="hover:text-[#558b1a] transition-colors">The Founder</a>
          <a href="#leadership" className="hover:text-[#558b1a] transition-colors">Leadership & Trustees</a>
          <a href="#values" className="hover:text-[#558b1a] transition-colors">Core Values</a>
          <a href="#global" className="hover:text-[#558b1a] transition-colors">Global Presence</a>
        </div>
      </div>

      {/* HERO BANNER */}
      <section className="relative w-full bg-gradient-to-b from-[#0c1a05] via-[#142e09] to-[#1c400d] text-white py-20 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8ac43e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#8ac43e] font-bold text-xs uppercase tracking-widest mb-4 backdrop-blur-xs"
          >
            <IconSparkles className="w-4 h-4" />
            <span>Rooted in Love. Driven by Purpose.</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight"
          >
            Empowering Lives, Building Futures
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto"
          >
            The Veronica Onyeneke Foundation (VOF) is a charitable organization established to preserve a legacy of compassion, self-reliance, and practical hope across Nigeria, the United States, and Rwanda.
          </motion.p>
        </div>
      </section>

      {/* 1. WHO WE ARE & GENESIS */}
      <motion.section
        id="who-we-are"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full py-20 px-6 lg:px-16 max-w-7xl mx-auto scroll-mt-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block">About Veronica Onyeneke Foundation</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Standing in the Gaps for Youth & Vulnerable Mothers
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We recognize that many young people have tremendous potential but lack access to vocational training, mentorship, and economic opportunities. Simultaneously, many young pregnant women experience circumstances that leave them economically vulnerable, socially isolated, or uncertain about their futures.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              VOF exists to bridge these gaps. Our initiatives combine hands-on trade apprenticeships at the <strong>Veronica Onyeneke Institute of Entrepreneurship (VOIE)</strong> with comprehensive maternal dignity, educational scholarships, and compassionate community relief.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#fafbfa] border border-gray-100">
                <span className="font-serif text-2xl font-bold text-[#558b1a] block">Our Mission</span>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  To empower young people with practical skills, entrepreneurial tools, and academic opportunities while providing compassionate support to young pregnant women.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#fafbfa] border border-gray-100">
                <span className="font-serif text-2xl font-bold text-[#558b1a] block">Our Vision</span>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  A society where every youth realizes their potential, and where young pregnant women facing vulnerable circumstances are treated with dignity, compassion, and hope.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <Image
                src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233536/vof/IMG01.jpg"
                alt="Veronica Onyeneke Foundation Training & Community Empowerment"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8ac43e] block mb-1">Impact in Action</span>
                <p className="text-sm sm:text-base font-serif font-bold">
                  &ldquo;True service is not merely about giving; it is about recognizing dignity and building pathways to independence.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. THE INSPIRATION SECTION (MRS. VERONICA ONYENEKE) */}
      <section id="inspiration" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Guiding Legacy</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              The Inspiration: Mrs. Veronica Onyeneke
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              A woman of deep faith, extraordinary kindness, and unwavering commitment to uplifting the less privileged.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/70 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-[#8ac43e]/30 shadow-lg mb-6">
                  <Image
                    src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233564/vof/veronica.jpg"
                    alt="Mrs. Veronica Ulumma Chinenyenwa Onyeneke"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">Mrs. Veronica Onyeneke</h3>
                <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider mt-1">1946 – 2021 • In Loving Memory</span>
                <span className="text-xs text-gray-500 mt-1">Umuodu Mbieri, Imo State, Nigeria</span>
              </div>

              <div className="lg:col-span-7 space-y-5 text-left text-gray-600 text-sm sm:text-base leading-relaxed">
                <div className="p-5 rounded-2xl bg-[#558b1a]/5 border-l-4 border-[#558b1a] italic text-gray-800 font-serif">
                  &ldquo;Empowering individuals. Strengthening families. Building futures.&rdquo;
                </div>
                <p>
                  The Veronica Onyeneke Foundation was founded by Rev. Fr. Charles Onyeneke in honor of his late mother, <strong>Mrs. Veronica Ulumma Chinenyenwa Onyeneke</strong>, whose life was marked by deep Catholic faith, generosity, and genuine concern for vulnerable people.
                </p>
                <p>
                  Throughout her life in Imo State, Mrs. Veronica was renowned for opening her home to young mothers with nowhere else to turn, financing school fees for children whose parents struggled, and providing nourishment and warm counsel to anyone experiencing hardship.
                </p>
                <p>
                  Her life reflected a simple but transformative truth: <em>true service is not merely about giving handouts; it is about recognizing an individual&apos;s inherent worth and equipping them with the strength and opportunity to stand on their own feet.</em>
                </p>
                <p>
                  What began as a son&apos;s expression of love and remembrance has blossomed into an international nonprofit institution dedicated to carrying her compassion forward across generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE FOUNDER SECTION (REV. CHARLES ONYENEKE) */}
      <section id="founder" className="w-full bg-white py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Visionary Leadership</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Meet the Founder
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              Pastoral dedication, theological scholarship, and a heart for transformative global charity.
            </p>
          </div>

          <div className="bg-[#fafbfa] rounded-3xl border border-gray-200/70 p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Founder Image & Credentials Card */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-full max-w-sm h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6">
                  <Image
                    src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg"
                    alt="Rev. Charles Onyeneke - Founder and Chairman"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8ac43e] block">Founder & Chairman</span>
                    <h3 className="font-serif text-xl font-bold">Rev. Charles Onyeneke</h3>
                    <span className="text-xs text-gray-200">Diocese of Albany, New York</span>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-2.5 text-left text-xs bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-semibold text-gray-800">
                    <span>Ordination</span>
                    <span className="text-[#558b1a]">2020 • Diocese of Albany, NY</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-semibold text-gray-800">
                    <span>Current Pastorates</span>
                    <span className="text-gray-600 text-right">Mater Christi & All Saints, Albany</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1 font-semibold text-gray-800">
                    <span>Academic Qualifications:</span>
                    <span className="text-gray-500 font-normal">
                      • Licentiate in Sacred Theology (S.T.L.) — St. Mary&apos;s Seminary, Baltimore, MD<br />
                      • Master of Arts (M.A.) — Saint Leo University, FL<br />
                      • B.A. Philosophy & Theology — Pontifical Urban University, Rome & Imo State Univ.
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Biography */}
              <div className="lg:col-span-7 space-y-5 text-left text-gray-600 text-sm sm:text-base leading-relaxed">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-1">Rev. Charles Onyeneke</h3>
                  <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider">Founder & Chairman of the Board</span>
                </div>

                <p>
                  Rev. Charles Onyeneke is the Founder of the Veronica Onyeneke Foundation. Born and raised in a devout Catholic family in Umuodu Mbieri, Imo State, Nigeria, Charles witnessed firsthand the powerful example of faith, generosity, and service lived by his mother, Veronica, and his father. This upbringing inspired his lifelong devotion to the Church and his calling to the priesthood.
                </p>

                <p>
                  After completing extensive philosophical and theological formation at Seat of Wisdom Seminary, Imo State University, and the Pontifical Urban University in Rome, Charles continued advanced graduate studies in the United States. He earned a Master&apos;s degree from Saint Leo University, Florida, and a prestigious Licentiate in Sacred Theology (S.T.L.) from St. Mary&apos;s Seminary and University in Baltimore, Maryland.
                </p>

                <p>
                  Ordained as a Roman Catholic priest for the Diocese of Albany, New York, in 2020, Rev. Charles now serves as the Pastor of Mater Christi Church and School, as well as the Pastor of All Saints Church in Albany. His deep pastoral commitment to service extends beyond parish walls—he works tirelessly to sponsor educational scholarships for students in Nigeria and Rwanda, uplift low-income households, and equip young adults through vocational mastery.
                </p>

                <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-[#558b1a] uppercase tracking-wider block">Founder&apos;s Message</span>
                  <p className="font-serif italic text-gray-900 text-base leading-relaxed">
                    &ldquo;VOF was established from a desire to create meaningful opportunities for people whose potential can sometimes be limited by circumstances beyond their control. Every child who learns a trade, every young mother restored to dignity, and every student whose tuition is provided represents a future permanently transformed.&rdquo;
                  </p>
                  <span className="block text-xs font-bold text-gray-500 not-italic pt-1">— Rev. Charles Onyeneke</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR LEADERSHIP & BOARD OF TRUSTEES (THE TEAM) */}
      <section id="leadership" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Governance & Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Our Leadership Team & Trustees
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              VOF is guided by experienced leaders, trustees, coordinators, and humanitarian professionals committed to institutional integrity and community impact.
            </p>
          </div>

          {/* Nigeria Team & Board */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200/60">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#558b1a]/10 text-[#558b1a] border border-[#558b1a]/20 mb-2">
                <span>🇳🇬</span> Nigeria & Board of Trustees
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Nigeria Leadership & Trustees
              </h3>
            </div>
            <p className="text-xs text-gray-500 max-w-md">
              Overseeing strategic governance, institutional compliance, and daily operations at our headquarters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member) => (
              <button
                type="button"
                key={member.name}
                onClick={() => setSelectedMember(member)}
                className="cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#8ac43e] hover:shadow-xl transition-all duration-300 text-left flex flex-col group focus:outline-hidden focus:ring-2 focus:ring-[#558b1a] focus:ring-offset-2"
              >
                <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                  <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                    <IconMapPin className="w-3 h-3 text-[#8ac43e]" />
                    {member.location}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between gap-4 w-full">
                  <div>
                    <h4 className="font-serif text-base font-bold text-gray-900 leading-snug group-hover:text-[#558b1a] transition-colors">
                      {member.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#558b1a] block mt-1">
                      {member.role}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-[#558b1a] transition-colors">
                    <span>View Profile & Details</span>
                    <IconArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* VOF RWANDA TEAM */}
          <div className="mt-20 pt-16 border-t border-gray-200/80">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200/60">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20 mb-2">
                  <span>🇷🇼</span> International Branch • Kigali, Rwanda
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                  VOF Rwanda Team
                </h3>
              </div>
              <p className="text-xs text-gray-500 max-w-md">
                Operating from Kigali, driving educational sponsorships, school supplies distribution, and community empowerment across Rwanda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl">
              {rwandaTeam.map((member) => (
                <button
                  type="button"
                  key={member.name}
                  onClick={() => setSelectedMember(member)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#8ac43e] hover:shadow-xl transition-all duration-300 text-left flex flex-col group focus:outline-hidden focus:ring-2 focus:ring-[#558b1a] focus:ring-offset-2"
                >
                  <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                      <IconMapPin className="w-3 h-3 text-[#8ac43e]" />
                      {member.location}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4 w-full">
                    <div>
                      <h4 className="font-serif text-base font-bold text-gray-900 leading-snug group-hover:text-[#558b1a] transition-colors">
                        {member.name}
                      </h4>
                      <span className="text-xs font-semibold text-[#558b1a] block mt-1">
                        {member.role}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-[#558b1a] transition-colors">
                      <span>View Profile & Details</span>
                      <IconArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE VALUES SECTION */}
      <section id="values" className="w-full bg-white py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Guiding Pillars</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              The Principles That Guide Our Work
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4">
              Everything we do is anchored in transparency, empathy, and sustainable community empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
            {coreValues.map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#fafbfa] border border-gray-100 hover:border-[#8ac43e] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center font-bold text-sm mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1a05] to-[#1c400d] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#8ac43e] uppercase tracking-wider block mb-2">Commitment</span>
                <h3 className="font-serif text-lg font-bold mb-2">100% Transparency</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  We maintain strict audit compliance and annual filings across all global branches.
                </p>
              </div>
              <Link
                href="/financial-reports"
                className="mt-4 text-xs font-bold text-[#8ac43e] hover:underline flex items-center gap-1"
              >
                <span>View Audit Reports</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GLOBAL REACH SECTION */}
      <section id="global" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Physical Hubs</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Three Locations, One United Mission
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Operating across Nigeria, the United States, and Rwanda to deliver impactful grassroots transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Nigeria Hub */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇳🇬</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1 rounded-full">Global HQ</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Nigeria (Global Head Office)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                Home of the flagship <strong>Veronica Onyeneke Institute of Entrepreneurship (VOIE)</strong>, youth vocational trades, JAMB coaching cohorts, and community relief.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>+234 903 373 6826</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>info@vonf.org</span>
                </div>
              </div>
            </div>

            {/* United States Hub */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇺🇸</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full">501(c)(3) Nonprofit</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">United States (VOF Corp.)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                <strong>VOF Corp.</strong> is a registered U.S. 501(c)(3) nonprofit organization providing an international donor platform. Donations are tax-deductible under U.S. law.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>4196 S Himalaya Way, Aurora, CO 80013, United States.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>+1 (720) 675-4211</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>vofcorp@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Rwanda Hub */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇷🇼</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-3 py-1 rounded-full">Rwanda NGO</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Rwanda (VOF Rwanda)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                Registered under the Rwanda Governance Board, directing localized educational partnerships, student materials, and community assistance.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>Kn82 Kiyovu Nyarurembo, Kigali, Rwanda.</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>+250 793 156 562</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                  <span>admin.rwanda@vonf.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative w-full text-white overflow-hidden py-20 px-6 lg:px-16 isolate bg-[#091503]">
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="text-xs text-[#8ac43e] font-semibold">
                &ldquo;Empowering individuals. Strengthening families.&rdquo;
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-xs">
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
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">🇳🇬 Nigeria HQ</h4>
              <p>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State.</p>
              <p>+234 903 373 6826 • info@vonf.org</p>
            </div>

            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">🇺🇸 USA & 🇷🇼 Rwanda</h4>
              <p><strong>USA (501c3):</strong> 4196 S Himalaya Way, Aurora, CO 80013 • +1 (720) 675-4211</p>
              <p><strong>Rwanda:</strong> Kn82 Kiyovu Nyarurembo, Kigali • +250 793 156 562</p>
            </div>

            {/* Col 4: Direct Giving & Online Donate Buttons */}
            <FooterDirectGiving onDonateClick={(m, freq) => openDonate(m, freq)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center border-t border-white/10 pt-6 text-xs text-gray-400 font-medium w-full">
            <div className="text-center md:text-left mb-3 md:mb-0">
              © {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.
            </div>
            <div className="text-center mb-3 md:mb-0 text-gray-300">
              Empowering Lives. Restoring Hope. Creating Opportunities.
            </div>
            <div className="text-center md:text-right text-[11px] text-gray-400">
              VOF Corp. is a U.S. 501(c)(3) registered nonprofit.
            </div>
          </div>
        </div>
      </footer>

      {/* TEAM MEMBER DETAIL MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4 sm:p-6"
          >
            <div
              className="absolute inset-0"
              onClick={() => setSelectedMember(null)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              className="relative bg-white text-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-10 border border-gray-100"
            >
              {/* Modal Top Header */}
              <div className="relative bg-gradient-to-br from-stone-50 via-lime-50/40 to-stone-50 px-6 pt-6 pb-5 border-b border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-gray-100 border border-gray-200 shadow-xs flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <IconX className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pr-8">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md ring-4 ring-white shrink-0 bg-gray-100">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover object-top"
                      sizes="112px"
                    />
                  </div>

                  <div className="text-center sm:text-left space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#558b1a]/10 text-[#558b1a] border border-[#558b1a]/20">
                        {selectedMember.role}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 shadow-2xs">
                        <IconMapPin className="w-3 h-3 text-[#558b1a]" />
                        {selectedMember.location}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                      {selectedMember.name}
                    </h3>

                    {(selectedMember.email || selectedMember.phone) && (
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-0.5 text-xs text-gray-600">
                        {selectedMember.email && (
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="inline-flex items-center gap-1 text-gray-600 hover:text-[#558b1a] transition-colors"
                          >
                            <IconMail className="w-3.5 h-3.5 text-[#558b1a]" />
                            <span>{selectedMember.email}</span>
                          </a>
                        )}
                        {selectedMember.phone && (
                          <a
                            href={`tel:${selectedMember.phone}`}
                            className="inline-flex items-center gap-1 text-gray-600 hover:text-[#558b1a] transition-colors"
                          >
                            <IconPhone className="w-3.5 h-3.5 text-[#558b1a]" />
                            <span>{selectedMember.phone}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-6 flex-grow">
                {/* Biography */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#558b1a]">
                    Biography & Background
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                    {selectedMember.bio.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Key Roles, Credentials & Qualifications */}
                {selectedMember.highlights && selectedMember.highlights.length > 0 && (
                  <div className="bg-[#fbfdf9] border border-[#e5f0d8] rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#558b1a]" />
                      Key Responsibilities & Qualifications
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedMember.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#558b1a]/15 text-[#558b1a] flex items-center justify-center mt-0.5">
                            <IconCheck className="w-3.5 h-3.5" />
                          </span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-stone-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMember(null);
                    setIsDonateOpen(true);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <IconHeart className="w-4 h-4 fill-white" />
                  <span>Support Our Mission</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UNIFIED DONATION MODAL (PAYSTACK, PAYPAL, STRIPE, ZELLE, RECURRING) */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialMethod={donateMethod}
        initialFrequency={donateFrequency}
      />
    </div>
  );
}
