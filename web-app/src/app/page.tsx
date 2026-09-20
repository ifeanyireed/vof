"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBriefcase,
  IconSchool,
  IconHeart,
  IconRocket,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCheck,
  IconWorld,
  IconSparkles,
  IconShieldCheck,
  IconUsers,
  IconArrowRight,
  IconBulb,
  IconHeartHandshake,
  IconCopy,
  IconChevronDown,
  IconChevronUp,
  IconBuildingBank,
  IconCreditCard,
  IconBrandPaypal
} from "@tabler/icons-react";

// Logo using the /logo.webp image served from public folder
const Logo = () => (
  <a href="#" className="flex items-center gap-2 group">
    <Image
      src="/logo.webp"
      alt="Veronica Onyeneke Foundation Logo"
      width={196}
      height={56}
      className="object-contain h-14 w-auto"
      priority
    />
  </a>
);

// Dry-brush highlight background effect using stroke.png
const BrushStroke = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block px-3 py-1 isolate">
    <span className="relative z-10 text-gray-900 font-bold">{children}</span>
    <img
      src="/stroke.png"
      alt="Brush Stroke highlight"
      className="absolute inset-0 w-full h-[115%] -z-10 scale-x-105 -translate-y-1 select-none pointer-events-none"
    />
  </span>
);

interface GreenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const GreenButton = ({ children, className = "", ...props }: GreenButtonProps) => (
  <button
    className={`px-8 py-2.5 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 hover:shadow-lg transition-all duration-200 text-sm cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Core Programs Data matching documents and subdomains
const programsData = [
  {
    id: 1,
    title: "Youth Skills Acquisition & Entrepreneurship (VOIE)",
    badge: "Flagship Platform",
    description: "At the centre of our mission is the Veronica Onyeneke Institute of Entrepreneurship (VOIE), equipping youth with practical vocational trades, business coaching, and startup tools for sustainable livelihoods.",
    skills: ["Fashion Design & Tailoring", "Footwear Making", "Hairdressing & Cosmetology", "Electrical & Solar Installation", "ICT & Digital Skills", "Plumbing & Piping"],
    color: "#a855f7",
    textColor: "text-purple-600",
    icon: <IconBriefcase className="w-12 h-12" stroke={1.2} />
  },
  {
    id: 2,
    title: "Standing with Young Pregnant Women",
    badge: "Maternal Dignity",
    description: "Providing compassionate care, mentorship, practical assistance, healthcare referrals, and livelihood starter kits for young pregnant women in vulnerable circumstances.",
    skills: ["Compassionate Mentorship", "Maternal Healthcare Referrals", "Vocational Starter Packs", "Dignity & Emotional Care", "Pathways to Independence"],
    color: "#ec4899",
    textColor: "text-pink-600",
    icon: <IconHeart className="w-12 h-12" stroke={1.2} />
  },
  {
    id: 3,
    title: "The Academic Sponsorship Triad",
    badge: "Education & Scholarships",
    description: "Structured educational funding supporting students at three pivotal milestones to ensure financial barriers never interrupt academic ambitions.",
    skills: ["JAMB Exam Sponsorship", "Secondary School Sponsorship", "University Scholarships ('Beyond the Degree')", "Textbooks & Uniforms"],
    color: "#22c55e",
    textColor: "text-green-600",
    icon: <IconSchool className="w-12 h-12" stroke={1.2} />
  },
  {
    id: 4,
    title: "VOF Rwanda School & Maternal Outreach",
    badge: "International Branch",
    description: "Operating on the ground in Kigali and surrounding communities to support vulnerable school children through educational partnerships while standing with young expectant mothers.",
    skills: ["Primary School Sponsorship", "Classroom Partnerships", "Maternal Assistance", "Community Resilience"],
    color: "#06b6d4",
    textColor: "text-cyan-600",
    icon: <IconWorld className="w-12 h-12" stroke={1.2} />
  },
  {
    id: 5,
    title: "Community Empowerment & Relief Outreach",
    badge: "Community Welfare",
    description: "Transforming passion into purpose through leadership development, financial literacy, rural food relief distributions, and community-led initiatives that strengthen families.",
    skills: ["Financial Literacy", "Rural Food Outreaches", "Family Support", "Micro-Enterprise Incubation"],
    color: "#f59e0b",
    textColor: "text-amber-600",
    icon: <IconRocket className="w-12 h-12" stroke={1.2} />
  }
];

// Board of Trustees & Executive Team from former site teams.vonf.org
const leadershipTeam = [
  { name: "Rev. Charles Onyeneke", role: "Founder & Chairman", location: "Albany, NY / Imo State" },
  { name: "Mrs. Glory Ozor", role: "Trustee / VOFC President", location: "United States" },
  { name: "Mr. Elvis Onyeneke", role: "Trustee", location: "Nigeria" },
  { name: "Mr. Sixtus Igbokwe", role: "Trustee", location: "Nigeria" },
  { name: "Dr. Chioma Okwudinma", role: "Trustee", location: "Nigeria" },
  { name: "Onyinyechi Emmanuela Eze", role: "Trustee", location: "Nigeria" },
  { name: "Patrick Chikaodinaka Ibekwe", role: "Board Secretary", location: "Nigeria" },
  { name: "Nora Chinwe Nwokorie", role: "Administrator", location: "Nigeria HQ" },
  { name: "Uba Frances Ogochukwu", role: "Accounts Manager", location: "Nigeria HQ" },
  { name: "Rev. Fr. Oguledo Achilleus Chidiebere", role: "Imo State Coordinator", location: "Imo State" },
  { name: "Joselyne Umuhoza", role: "VOF Rwanda Legal Representative", location: "Kigali, Rwanda" },
  { name: "Paula Husuna Umuneza", role: "VOF Rwanda Secretary", location: "Kigali, Rwanda" }
];

// Authentic Beneficiary Testimonials from former site
const authenticTestimonials = [
  {
    id: 1,
    quote: "The story of my life would be incomplete without acknowledging the woman who cared for me when I was nobody. The foundation's generosity and genuine concern gave me the strength to stand tall.",
    author: "Mr. Chinedum Chinonso Kizito",
    role: "Community Beneficiary & mentee"
  },
  {
    id: 2,
    quote: "I am truly speechless. I don't know how to thank you, Uncle Charles, for your kindness, generosity, and all the advice you've given me to pursue my higher education without fear.",
    author: "Chiamaka Faustina Mmereole",
    role: "University Scholarship Beneficiary"
  },
  {
    id: 3,
    quote: "On behalf of the student community, I extend our deepest appreciation to the Veronica Onyeneke Foundation and its Board of Trustees. Your funding of the 'Beyond the Degree' program is a profound investment in students' futures.",
    author: "Office of the SUG Vice President",
    role: "Alvan Ikoku Federal University of Education (AIFUE)"
  }
];

// FAQ items from former site
const faqItems = [
  {
    q: "Are donations to Veronica Onyeneke Foundation tax-deductible?",
    a: "Yes. Donations made through Veronica Onyeneke Foundation Corp. (our U.S. branch) are fully tax-deductible as it is a registered 501(c)(3) nonprofit organization. U.S. donors receive an official tax receipt for IRS records."
  },
  {
    q: "What is the relationship between VOF Nigeria, VOF Corp (USA), and VOF Rwanda?",
    a: "All three entities operate under the shared vision of Rev. Charles Onyeneke. VOF Nigeria serves as the global head office and vocational training hub (VOIE); VOF Corp. in the USA provides an international 501(c)(3) donor and partnership platform; and VOF Rwanda directs local school partnerships and maternal assistance in Rwanda."
  },
  {
    q: "How are donated funds allocated and accounted for?",
    a: "VOF adheres to strict financial governance and annual audit readiness. Contributions directly fund student tuition/JAMB fees, vocational toolkits at the Institute, prenatal supplies for young expectant mothers, and community outreach. No administrative overhead dilutes dedicated project funds."
  },
  {
    q: "How can students apply for JAMB or University Scholarships?",
    a: "Eligible students from disadvantaged backgrounds can submit applications through our periodic cohort calls announced on our website and through local school partners. Beneficiaries are selected based on academic promise and verified financial need."
  },
  {
    q: "How can I volunteer or partner with VOF?",
    a: "We welcome professionals, instructors, and volunteers across Nigeria, Rwanda, and the United States. You can support skills training, mentorship, communications, or outreach logistics. Reach out through our Contact section to connect with our team."
  }
];

// Active VOF Campaigns for Modals and Cards
const modalProjects = [
  {
    id: 1,
    title: "Sponsor Youth Vocational Training at VOIE",
    description: "Equip a young person with tuition, hands-on workshop tools, and starter kits in Fashion Design, Solar Technology, ICT, Hairdressing, or Plumbing.",
    image: "/IMG01.jpeg",
    category: "Vocational Skills",
    raised: "$4,800",
    goal: "$10,000",
    percentage: 48,
    daysLeft: 22
  },
  {
    id: 2,
    title: "Support Vulnerable Young Pregnant Women & Mothers",
    description: "Provide compassionate care, prenatal guidance, life mentorship, and micro-business starter kits to protect maternal dignity and child wellbeing.",
    image: "/IMG05.jpeg",
    category: "Maternal Care",
    raised: "$6,500",
    goal: "$10,000",
    percentage: 65,
    daysLeft: 14
  },
  {
    id: 3,
    title: "Education & School Supplies for Vulnerable Children",
    description: "Fund scholarships, textbooks, school uniforms, and educational partnerships for underprivileged primary and secondary students across Nigeria and Rwanda.",
    image: "/IMG04.jpeg",
    category: "Education Support",
    raised: "$8,200",
    goal: "$10,000",
    percentage: 82,
    daysLeft: 9
  }
];

// Core Values from Document
const coreValues = [
  { name: "Compassion", desc: "We treat every person with empathy, dignity, kindness, and respect." },
  { name: "Empowerment", desc: "We equip individuals with knowledge, skills, confidence, and opportunities to improve their lives." },
  { name: "Integrity", desc: "We embrace transparency, accountability, honesty, and responsible stewardship." },
  { name: "Dignity", desc: "We recognize and respect the inherent worth of every person." },
  { name: "Innovation", desc: "We encourage creativity, entrepreneurship, and practical approaches to community challenges." },
  { name: "Inclusion", desc: "We create opportunities that welcome and uplift people from diverse backgrounds." },
  { name: "Sustainability", desc: "We prioritize initiatives that produce lasting improvements in people's lives." }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donationCurrency, setDonationCurrency] = useState<"NGN" | "USD">("NGN");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isProjectsPopupOpen, setIsProjectsPopupOpen] = useState(false);
  const [popupProjectIndex, setPopupProjectIndex] = useState(0);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    if (!isDonateOpen) return;
    const interval = setInterval(() => {
      setModalIndex((prev) => (prev + 1) % modalProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isDonateOpen]);

  useEffect(() => {
    if (!isProjectsPopupOpen || isPopupHovered) return;
    const interval = setInterval(() => {
      setPopupProjectIndex((prev) => (prev + 1) % modalProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isProjectsPopupOpen, isPopupHovered]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(3);
      } else if (window.innerWidth >= 768) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = programsData.length - visibleItems;
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [visibleItems]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const navLinks = [
    { label: "About Us", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Founder", href: "#founder" },
    { label: "Leadership", href: "#leadership" },
    { label: "Global Reach", href: "#global" },
    { label: "Our Impact", href: "#impact" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 overflow-x-hidden">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full px-6 lg:px-16 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>

        {/* Center Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((item, idx) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="text-gray-700 hover:text-[#558b1a] font-semibold transition-colors duration-200 text-[13px] whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Action Buttons */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href="#get-involved"
            className="hidden sm:inline-flex px-4 py-2 border border-gray-300 hover:border-[#558b1a] text-gray-800 hover:text-[#558b1a] font-bold rounded-full transition-all duration-200 text-xs tracking-wide"
          >
            Get Involved
          </a>
          <button
            onClick={() => setIsDonateOpen(true)}
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-xs cursor-pointer shadow-sm"
          >
            Donate Now
          </button>
        </motion.div>
      </header>

      {/* HERO SECTION */}
      <main className="w-full max-w-full px-6 lg:px-16 pt-12 md:pt-20 pb-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#4d7f16] text-xs font-bold uppercase tracking-wider mb-6"
        >
          <IconSparkles className="w-3.5 h-3.5" />
          <span>Veronica Onyeneke Foundation (VOF)</span>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1b2124] leading-[1.1] max-w-5xl tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Empowering Lives, <br />
          <BrushStroke>Building Futures</BrushStroke>
        </motion.h1>

        <motion.p
          className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Welcome to the Veronica Onyeneke Foundation (VOF), where we empower young people through practical skills acquisition and education, and stand with young pregnant women in vulnerable circumstances.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="#programs">
            <GreenButton className="px-9 py-3 text-base tracking-wide min-w-[190px]">
              Explore Programs
            </GreenButton>
          </a>
          <button
            onClick={() => setIsDonateOpen(true)}
            className="px-9 py-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-xl transition-all duration-250 text-base tracking-wide min-w-[190px] cursor-pointer"
          >
            Donate Now
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="w-full max-w-7xl px-4 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full aspect-[4/3] max-h-[580px] flex justify-center items-center">
            <Image
              src="/hero.jpeg"
              alt="Veronica Onyeneke Foundation - Empowering Youth & Supporting Young Mothers"
              fill
              className="object-contain select-none"
              priority
              sizes="100vw"
            />
          </div>
        </motion.div>
      </main>

      {/* CORE PILLARS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Foundation Pillars</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1b2124]">
            Compassion into Action, Opportunity into Hope
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <div className="flex flex-col bg-stone-50/70 p-8 rounded-2xl border border-stone-200/60 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center mb-6">
              <IconBriefcase className="w-8 h-8" stroke={1.5} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] mb-3">
              Practical Skills & Entrepreneurship
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-grow">
              Through the Veronica Onyeneke Institute of Entrepreneurship (VOIE), we equip youth with high-demand vocational trades, digital skills, and business mentorship to unlock sustainable self-reliance.
            </p>
            <div className="pt-4 border-t border-stone-200/60 flex items-center text-xs font-bold text-[#558b1a]">
              <span>VOIE Vocational Center</span>
            </div>
          </div>

          <div className="relative flex flex-col bg-stone-50/70 p-8 rounded-2xl border border-stone-200/60 shadow-xs hover:shadow-md transition-all duration-300 isolate">
            <div className="absolute inset-0 -z-10 flex justify-center items-center opacity-[0.06] pointer-events-none select-none">
              <img
                src="/stroke.png"
                alt="Paint blot decoration"
                className="w-[200px] h-[200px] object-contain rotate-12 scale-150"
              />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-6">
              <IconHeart className="w-8 h-8" stroke={1.5} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] mb-3">
              Standing with Young Pregnant Women
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-grow">
              Upholding the dignity of young expectant mothers facing vulnerable circumstances through compassionate emotional support, prenatal care navigation, life mentorship, and skills development.
            </p>
            <div className="pt-4 border-t border-stone-200/60 flex items-center text-xs font-bold text-pink-600">
              <span>Maternal Care & Guidance</span>
            </div>
          </div>

          <div className="flex flex-col bg-stone-50/70 p-8 rounded-2xl border border-stone-200/60 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#fbbf24]/20 text-amber-700 flex items-center justify-center mb-6">
              <IconSchool className="w-8 h-8" stroke={1.5} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] mb-3">
              Education & Academic Scholarships
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-grow">
              Ensuring economic barriers never extinguish a student&apos;s ambition. We sponsor JAMB registrations, secondary school fees, and university scholarships in Nigeria and Rwanda.
            </p>
            <div className="pt-4 border-t border-stone-200/60 flex items-center text-xs font-bold text-amber-700">
              <span>JAMB • Secondary • University</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US & THE STORY BEHIND VOF SECTION */}
      <section id="about" className="w-full max-w-7xl mx-auto px-6 py-24 bg-white border-t border-gray-100 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col text-left">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest mb-3">About Veronica Onyeneke Foundation</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-tight mb-6">
              Transforming Lives Through <br />
              <BrushStroke>Compassionate Service</BrushStroke>
            </h2>

            <p className="text-gray-700 text-base sm:text-[17px] leading-relaxed mb-5 font-normal">
              The <strong>Veronica Onyeneke Foundation (VOF)</strong> is a nonprofit organization committed to transforming lives through empowerment, opportunity, education, entrepreneurship, and compassionate community support.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
              We recognize that many young people have tremendous potential but lack access to training, mentorship, and economic opportunities. We also recognize that some young pregnant women experience circumstances that can leave them economically vulnerable or socially isolated. <strong>VOF exists to stand in these gaps.</strong>
            </p>

            {/* Mother's Legacy Box with Authentic Motto & Grassroots Initiative */}
            <div className="p-6 rounded-2xl bg-[#f7f9f4] border border-[#e4ebd9] relative my-3">
              <h4 className="font-serif text-lg font-bold text-[#1b2124] mb-2 flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-[#558b1a]" />
                The Story Behind the Foundation
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                The Foundation was established by <strong>Rev. Fr. Charles Onyeneke</strong> in honour of his late mother, <strong>Mrs. Veronica Ulumma Chinenyenwa Onyeneke</strong> (1948–2023), whose life in Mbieri, Imo State, was marked by deep faith, generosity, and founding community welfare initiatives like <em>Otu Dikwadoro</em> to feed and support struggling families.
              </p>
              <div className="p-3.5 rounded-xl bg-white border border-[#d6e2c8] text-sm text-gray-800 font-medium italic border-l-4 border-[#558b1a]">
                &ldquo;A good life is one spent in the service of others.&rdquo;
                <span className="block text-xs font-bold text-gray-500 not-italic mt-1">— Mrs. Veronica Onyeneke&apos;s Guiding Motto</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c1a05] to-[#1a380c] text-white shadow-lg relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-[#8ac43e]">
                <IconRocket className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-white">Our Mission</h3>
              <p className="text-gray-200 text-sm sm:text-[15px] leading-relaxed">
                To empower young people with practical skills, entrepreneurial opportunities, mentorship, and resources while providing compassionate support to young pregnant women in vulnerable circumstances, enabling them to build independent, productive, and hopeful futures.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#fdfbf6] border border-amber-200/70 shadow-sm text-gray-900">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-700">
                <IconBulb className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-gray-950">Our Vision</h3>
              <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed">
                A world where young people are empowered to realize their full potential, build sustainable livelihoods, and contribute meaningfully to their communities, and where young pregnant women facing vulnerable circumstances are treated with dignity, compassion, and hope.
              </p>
            </div>
          </div>
        </div>

        {/* 7 Core Values Grid */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <div className="text-center mb-10">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-1">Guiding Principles</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Our Core Values</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {coreValues.map((val) => (
              <div key={val.name} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#8ac43e] transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <IconCheck className="w-4 h-4 text-[#558b1a]" />
                  <h4 className="font-bold text-gray-900 text-base">{val.name}</h4>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
            <div className="p-5 rounded-2xl bg-[#558b1a]/5 border border-[#558b1a]/20 flex flex-col justify-center text-center">
              <span className="text-[#558b1a] font-bold text-sm">Empowering Lives</span>
              <span className="text-gray-500 text-xs mt-1">Strengthening Families</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE HAVE DONE SECTION (IMAGE GALLERY) */}
      <section id="gallery" className="w-full max-w-[960px] mx-auto px-6 py-24 bg-white border-t border-gray-100 scroll-mt-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-square overflow-hidden shadow-md group">
              <Image
                src="/IMG01.jpeg"
                alt="Veronica Onyeneke Institute of Entrepreneurship practical training cohort"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div className="relative w-full aspect-square overflow-hidden shadow-md group">
              <Image
                src="/IMG02.jpeg"
                alt="Community classroom learning and skills development"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 text-left">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tight w-full pb-2">
              What We Have Done With <BrushStroke>Your Help</BrushStroke>
            </h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <div className="flex flex-col gap-3">
                <div className="relative w-full aspect-square overflow-hidden shadow-md group">
                  <Image
                    src="/IMG03.jpeg"
                    alt="Volunteers and community outreach operations"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="relative w-full aspect-square overflow-hidden shadow-md group">
                  <Image
                    src="/IMG04.jpeg"
                    alt="Students around a globe in school classroom"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed w-full">
                  Behind every program is a person with dreams, challenges, courage, and potential. Your support provides hands-on vocational training, maternal guidance, and educational resources that build sustainable futures.
                </p>

                <div className="relative w-full aspect-square overflow-hidden shadow-md group mt-1">
                  <Image
                    src="/IMG05.jpeg"
                    alt="Healthcare clinic and maternal support outreach"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>

                <div className="w-full flex justify-center pt-2">
                  <GreenButton onClick={() => setIsDonateOpen(true)} className="px-8 py-2.5 min-w-[170px]">
                    Donate Now
                  </GreenButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROGRAMS SECTION (WITH 6 VOIE VOCATIONAL TRACKS & ACADEMIC TRIAD) */}
      <section id="programs" className="w-full max-w-7xl mx-auto px-6 py-24 bg-white border-t border-gray-100 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Structured Pathways to Self-Reliance</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tight">
            Our Core <BrushStroke>Programs</BrushStroke>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
            Our programs are designed not only to respond to immediate needs, but to create sustainable pathways toward independence, dignity, and long-term community stability.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-12 group">
          <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : programsData.length - visibleItems))}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:border-[#558b1a] hover:text-[#558b1a] transition-all duration-200 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out -mx-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              }}
            >
              {programsData.map((program) => (
                <div
                  key={program.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4 flex flex-col"
                >
                  <div className="flex flex-col h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${program.textColor} bg-gray-50`}>
                        {program.icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {program.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] leading-tight mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-700 block mb-2">Program Focus Areas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {program.skills.map((skill) => (
                          <span key={skill} className="text-[11px] bg-[#f4f7ee] text-[#426a17] font-semibold px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev < (programsData.length - visibleItems) ? prev + 1 : 0))}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:border-[#558b1a] hover:text-[#558b1a] transition-all duration-200 cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-12">
          {Array.from({ length: programsData.length - visibleItems + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "bg-[#558b1a] w-6"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FOUNDER & LEADERSHIP SECTION */}
      <section id="founder" className="w-full bg-[#0a1604] text-white py-20 px-6 lg:px-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#8ac43e] text-xs font-bold uppercase tracking-widest block mb-2">Leadership & Vision</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Meet Our Founder & Chairman
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mt-3">
              Guided by deep faith, academic scholarship, and a lifelong calling to compassionate service and human dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card: Founder Biographical Profile */}
            <div className="lg:col-span-5 bg-[#122807] border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#558b1a] to-[#8ac43e] flex items-center justify-center text-white text-2xl font-serif font-bold shadow-md">
                    CO
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white leading-snug">Rev. Charles Onyeneke</h3>
                    <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-wider block mt-0.5">
                      Founder & Chairman
                    </span>
                    <span className="text-gray-400 text-xs block mt-0.5">
                      Pastor, Diocese of Albany, New York
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
                  Born and raised in a devout Catholic family in <strong>Umuodu Mbieri, Imo State, Nigeria</strong>, Rev. Charles witnessed the powerful example of faith, generosity, and service lived by his parents—inspiring his deep devotion to the Church and vocation to the priesthood.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-bold text-[#8ac43e] block mb-1">Current Pastoral Leadership (USA)</span>
                    <span className="text-gray-300">Pastor of Mater Christi Church & School and Pastor of All Saints Church in Albany, New York (Ordained 2020).</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-bold text-[#8ac43e] block mb-1">Academic & Theological Formation</span>
                    <ul className="text-gray-300 space-y-1 list-disc list-inside">
                      <li>Licentiate in Sacred Theology (S.T.L.) — St. Mary’s Seminary & University, Baltimore, MD</li>
                      <li>Master&apos;s Degree — Saint Leo University, Florida</li>
                      <li>Philosophy & Theology — Seat of Wisdom Seminary, Imo State University & Pontifical Urban University, Rome</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-gray-400">
                <span>Continuing the legacy of his late mother, Mrs. Veronica Ulumma Chinenyenwa Onyeneke.</span>
              </div>
            </div>

            {/* Right Card: Message & Vision from the Founder */}
            <div className="lg:col-span-7 bg-[#558421] rounded-3xl p-8 lg:p-12 flex flex-col justify-between shadow-xl text-left">
              <div>
                <svg className="w-12 h-8 text-[#fbbf24] mb-6 opacity-90" viewBox="0 0 54 36" fill="currentColor">
                  <path d="M16 0C7 0 0 7 0 16c0 11 9 20 20 20v-8c-6 0-10-4-10-10 0-1 0-2 1-3 2 1 4 2 6 2 6 0 11-5 11-11S23 0 16 0Zm30 0C37 0 30 7 30 16c0 11 9 20 20 20v-8c-6 0-10-4-10-10 0-1 0-2 1-3 2 1 4 2 6 2 6 0 11-5 11-11S53 0 46 0Z" />
                </svg>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
                  A Message From Our Founder
                </h3>

                <blockquote className="text-white/95 text-base sm:text-lg leading-relaxed mb-6 font-serif italic">
                  &ldquo;Welcome to the Veronica Onyeneke Foundation. VOF was established from a desire to create meaningful opportunities for people whose potential can sometimes be limited by circumstances beyond their control.
                  <br /><br />
                  We believe young people should have opportunities to learn, develop practical skills, discover their abilities, and build sustainable futures. We also believe young pregnant women facing vulnerable circumstances deserve compassion, dignity, encouragement, and meaningful opportunities to rebuild and move forward.
                  <br /><br />
                  Our vision is bigger than providing temporary assistance. We want to empower. We want to educate. We want to create opportunities. We want to restore hope. And we want the lives touched through our programs to become sources of positive change within their families and communities.
                  <br /><br />
                  Together, we can create opportunities that change lives for generations.&rdquo;
                </blockquote>
              </div>

              <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-serif text-xl font-bold text-white block">Rev. Charles Onyeneke</span>
                  <span className="text-yellow-200 text-xs font-bold uppercase tracking-wider">Founder / Chairman</span>
                </div>
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs tracking-wide cursor-pointer self-start sm:self-auto shadow-md"
                >
                  Join Rev. Charles&apos;s Mission
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOARD OF TRUSTEES & LEADERSHIP ROSTER (NEW SECTION FROM TEAMS.VONF.ORG) */}
      <section id="leadership" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Governance & Oversight</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-tight">
              Our Leadership & <BrushStroke>Trustees</BrushStroke>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
              VOF is powered by passionate leaders, trustees, coordinators, and humanitarian professionals dedicated to institutional integrity and community transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-[#8ac43e] hover:shadow-md transition-all text-left">
                <div className="w-10 h-10 rounded-full bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center font-bold text-sm mb-4">
                  {member.name.split(" ").slice(-1)[0][0]}
                </div>
                <h4 className="font-serif text-base font-bold text-gray-900 leading-snug">{member.name}</h4>
                <span className="text-xs font-semibold text-[#558b1a] block mt-1">{member.role}</span>
                <span className="text-[11px] text-gray-400 block mt-2">{member.location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE WE ARE / GLOBAL REACH SECTION (WITH PRECISE OFFICE ADDRESSES) */}
      <section id="global" className="w-full bg-white py-20 border-t border-gray-100 scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Global Presence</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1b2124]">
              Where We Are: Three Locations, One Mission
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Although our presence extends across different countries, our purpose remains one: to empower lives, create opportunities, restore hope, and build futures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nigeria Hub */}
            <div className="p-8 rounded-3xl bg-[#fafbfa] border border-gray-100 shadow-sm flex flex-col text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇳🇬</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1 rounded-full">Headquarters</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Nigeria (Head Office)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                Home of the flagship <strong>Veronica Onyeneke Institute of Entrepreneurship</strong>, youth vocational trades, JAMB coaching, and community outreach.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-[#558b1a] flex-shrink-0 mt-0.5" />
                  <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof’s Avenue, Orji, Owerri North, Imo State, Nigeria.</span>
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
            <div className="p-8 rounded-3xl bg-[#fafbfa] border border-gray-100 shadow-sm flex flex-col text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇺🇸</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full">501(c)(3) Entity</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">United States (VOF Corp.)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                <strong>VOF Corp.</strong> is a registered U.S. 501(c)(3) nonprofit organization providing an international platform to advance VOF&apos;s charitable mission. Donations are tax-deductible under U.S. law.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>4196 S Himalaya Way, Aurora, CO 80013, Colorado, United States</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>+1 (720) 675-4211</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>vofcorp@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Rwanda Hub */}
            <div className="p-8 rounded-3xl bg-[#fafbfa] border border-gray-100 shadow-sm flex flex-col text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇷🇼</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-3 py-1 rounded-full">Country Branch</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Rwanda (VOF Rwanda)</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 flex-grow">
                Shares VOF&apos;s mission with focus on two interconnected areas: supporting vulnerable children through school partnerships, and standing with young pregnant women facing difficult circumstances.
              </p>
              <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Kn82 Kiyovu Nyarurembo, Nyarugenge, Kigali, Rwanda</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>+250 793 156 562</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>admin.rwanda@vonf.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR IMPACT & FINANCIAL TRANSPARENCY SECTION */}
      <section id="impact" className="w-full max-w-7xl mx-auto px-6 py-20 bg-white border-t border-gray-100 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Impact & Transparency</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b2124]">
            Creating Change That Lasts
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed">
            At VOF, impact is about more than numbers. It is about the young person who develops a marketable skill, the aspiring entrepreneur who transforms an idea into an income, and the young mother who discovers that difficult circumstances do not have to determine her future.
          </p>
        </div>

        {/* 5 Core Impact Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center mb-14">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-2xl font-serif font-bold text-[#558b1a] block mb-1">Youth</span>
            <span className="text-xs font-bold text-gray-900 block mb-1">Empowered & Mentored</span>
            <span className="text-[11px] text-gray-500">Skills & career development</span>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-2xl font-serif font-bold text-[#558b1a] block mb-1">Vocational</span>
            <span className="text-xs font-bold text-gray-900 block mb-1">Practical Skills Trained</span>
            <span className="text-[11px] text-gray-500">6 high-demand trades at VOIE</span>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-2xl font-serif font-bold text-[#558b1a] block mb-1">Entrepreneurs</span>
            <span className="text-xs font-bold text-gray-900 block mb-1">Supported & Incubated</span>
            <span className="text-[11px] text-gray-500">Turning ideas into income</span>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70">
            <span className="text-2xl font-serif font-bold text-[#558b1a] block mb-1">Mothers</span>
            <span className="text-xs font-bold text-gray-900 block mb-1">Assisted & Restored</span>
            <span className="text-[11px] text-gray-500">Dignity, guidance & tools</span>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 col-span-2 md:col-span-1">
            <span className="text-2xl font-serif font-bold text-[#558b1a] block mb-1">Scholarships</span>
            <span className="text-xs font-bold text-gray-900 block mb-1">Educational Access</span>
            <span className="text-[11px] text-gray-500">JAMB, Secondary & Tertiary</span>
          </div>
        </div>

        {/* Annual Audit & Tax Compliance Guarantee */}
        <div className="p-8 rounded-3xl bg-[#f6f9f2] border border-[#d9e5cf] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#558b1a] text-white flex items-center justify-center flex-shrink-0 mt-1">
              <IconShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#558b1a] block mb-1">Governance & Audit Readiness</span>
              <h3 className="font-serif text-xl font-bold text-gray-950 mb-1">
                Annual Audit & Tax Documentation Policy
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                The Veronica Onyeneke Foundation maintains a formalized audit profile and strict accounting procedures across all program lines (educational sponsorships, maternal care, vocational trades, and humanitarian food relief). Donations to VOF Corp. are tax-deductible under U.S. 501(c)(3) law.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDonateOpen(true)}
            className="px-6 py-3 bg-[#558b1a] text-white font-bold rounded-full hover:bg-[#477516] transition-colors text-xs whitespace-nowrap cursor-pointer shadow-sm"
          >
            Support With Confidence
          </button>
        </div>
      </section>

      {/* AUTHENTIC BENEFICIARY TESTIMONIALS (NEW SECTION FROM FORMER SITE) */}
      <section id="testimonials" className="w-full bg-[#0a1604] text-white py-20 px-6 lg:px-16 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#8ac43e] text-xs font-bold uppercase tracking-widest block mb-2">Voices of Impact</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Stories of Restored Hope
            </h2>
            <p className="text-gray-300 text-sm mt-3">
              Authentic messages from our students, scholarship beneficiaries, and community partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {authenticTestimonials.map((item) => (
              <div key={item.id} className="bg-[#122807] border border-white/10 p-8 rounded-3xl flex flex-col justify-between shadow-lg">
                <div>
                  <svg className="w-8 h-6 text-[#fbbf24] mb-4 opacity-80" viewBox="0 0 54 36" fill="currentColor">
                    <path d="M16 0C7 0 0 7 0 16c0 11 9 20 20 20v-8c-6 0-10-4-10-10 0-1 0-2 1-3 2 1 4 2 6 2 6 0 11-5 11-11S23 0 16 0Zm30 0C37 0 30 7 30 16c0 11 9 20 20 20v-8c-6 0-10-4-10-10 0-1 0-2 1-3 2 1 4 2 6 2 6 0 11-5 11-11S53 0 46 0Z" />
                  </svg>
                  <p className="text-gray-200 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="font-serif text-base font-bold text-white block">{item.author}</span>
                  <span className="text-xs text-[#8ac43e] block mt-0.5">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION (NEW INTERACTIVE ACCORDION FROM FORMER SITE) */}
      <section id="faq" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Common Questions</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-tight">
              Frequently Asked <BrushStroke>Questions</BrushStroke>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3">
              Clear answers regarding our legal registration, tax deductibility, and programs.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-gray-200/70 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-serif font-bold text-base sm:text-lg text-gray-900 hover:text-[#558b1a] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  {activeFaq === idx ? (
                    <IconChevronUp className="w-5 h-5 text-[#558b1a] flex-shrink-0 ml-4" />
                  ) : (
                    <IconChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET INVOLVED & WORK WITH US SECTION */}
      <section id="get-involved" className="w-full bg-white py-24 border-t border-gray-100 scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Join Our Mission</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tight">
              Be Part of the <BrushStroke>Transformation</BrushStroke>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
              Creating sustainable change requires people who are willing to act. There are many ways you can become part of the VOF mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-stone-50/70 p-8 rounded-3xl border border-stone-200/60 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center mb-6">
                <IconUsers className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Volunteer</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                Share your time, experience, professional expertise, or practical skills. Volunteers support mentorship, vocational workshops, community outreach, and communications.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#558b1a] hover:underline"
              >
                <span>Volunteer with VOF</span>
                <IconArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-stone-50/70 p-8 rounded-3xl border border-stone-200/60 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-6">
                <IconHeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Become a Partner</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                We welcome partnerships with corporations, universities, schools, healthcare groups, foundations, and faith-based institutions seeking lasting community impact.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline"
              >
                <span>Explore Partnerships</span>
                <IconArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-stone-50/70 p-8 rounded-3xl border border-stone-200/60 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-6">
                <IconBriefcase className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Sponsor a Program</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                Individuals and organizations can directly fund vocational training cohorts at VOIE, student scholarships (JAMB/Secondary/University), or maternal dignity kits.
              </p>
              <button
                onClick={() => setIsDonateOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
              >
                <span>Sponsor a Cohort</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION (WITH EXACT PHYSICAL DETAILS FOR NIGERIA, USA & RWANDA) */}
      <footer id="contact" className="relative w-full text-white overflow-hidden py-24 px-6 lg:px-16 isolate scroll-mt-20">
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <Image
            src="/footer.jpeg"
            alt="Veronica Onyeneke Foundation Community Support Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091503]/95 via-[#112708]/85 to-[#1c3f0c]/70 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between min-h-[480px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            {/* Col 1: Mission */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="text-xs text-[#8ac43e] font-semibold mt-2">
                &ldquo;Empowering individuals. Strengthening families.&rdquo;
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

            {/* Col 4: Bank Details Quick Access */}
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Direct Giving Accounts</h4>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                <span className="font-bold text-[#8ac43e] block">GTBank (NGN):</span>
                <span>3000273596 • Veronica Onyeneke Foundation</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                <span className="font-bold text-[#8ac43e] block">Zenith Bank (NGN):</span>
                <span>1228980969 • Veronica Onyeneke Foundation</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                <span className="font-bold text-[#fbbf24] block">Zelle (USD):</span>
                <span>vofcorp@gmail.com</span>
              </div>
            </div>
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
            <div className="text-center md:text-right text-[11px] text-gray-400">
              VOF Corp. is a U.S. 501(c)(3) registered nonprofit.
            </div>
          </div>
        </div>
      </footer>

      {/* UPGRADED DONATION MODAL WITH LIVE BANK ACCOUNTS & INTERNATIONAL GIVING */}
      <AnimatePresence>
        {isDonateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 backdrop-blur-md p-4 md:p-8"
          >
            <div className="absolute inset-0" onClick={() => setIsDonateOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white text-gray-900 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[92vh] md:max-h-[85vh] z-10"
            >
              <button
                onClick={() => setIsDonateOpen(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Side: Live Donation Gateways */}
              <div className="w-full md:w-[48%] bg-gradient-to-br from-[#0c1a05] to-[#16300a] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-y-auto">
                <div>
                  <span className="text-xs font-bold text-[#8ac43e] uppercase tracking-wider block mb-1">Direct Contribution Channels</span>
                  <h3 className="font-serif text-2xl font-bold leading-tight mb-2">
                    Support VOF Programs
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed mb-5">
                    Your gift directly equips youth with vocational skills, supports young pregnant women, and funds academic scholarships.
                  </p>

                  {/* Currency Switcher */}
                  <div className="flex rounded-xl bg-white/10 p-1 mb-5">
                    <button
                      onClick={() => setDonationCurrency("NGN")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        donationCurrency === "NGN" ? "bg-[#558b1a] text-white shadow-xs" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      🇳🇬 Nigeria (NGN Transfer)
                    </button>
                    <button
                      onClick={() => setDonationCurrency("USD")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        donationCurrency === "USD" ? "bg-[#558b1a] text-white shadow-xs" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      🇺🇸 International / USD
                    </button>
                  </div>

                  {/* NGN Accounts View */}
                  {donationCurrency === "NGN" && (
                    <div className="space-y-3">
                      {/* GTBank Card */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#8ac43e]">Guaranty Trust Bank (GTBank)</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">NGN</span>
                        </div>
                        <div className="text-sm font-mono font-bold text-white tracking-wider my-1">
                          3000273596
                        </div>
                        <div className="text-[11px] text-gray-300">
                          Veronica Onyeneke Foundation
                        </div>
                        <button
                          onClick={() => copyToClipboard("3000273596", "gtbank")}
                          className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-200 transition-colors cursor-pointer"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>{copiedAccount === "gtbank" ? "Account Copied!" : "Copy GTBank Account"}</span>
                        </button>
                      </div>

                      {/* Zenith Bank Card */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#8ac43e]">Zenith Bank</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">NGN</span>
                        </div>
                        <div className="text-sm font-mono font-bold text-white tracking-wider my-1">
                          1228980969
                        </div>
                        <div className="text-[11px] text-gray-300">
                          Veronica Onyeneke Foundation
                        </div>
                        <button
                          onClick={() => copyToClipboard("1228980969", "zenith")}
                          className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-200 transition-colors cursor-pointer"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>{copiedAccount === "zenith" ? "Account Copied!" : "Copy Zenith Account"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* USD / International Giving View */}
                  {donationCurrency === "USD" && (
                    <div className="space-y-3">
                      {/* Zelle Card */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#fbbf24]">Zelle (USA Direct)</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">501(c)(3)</span>
                        </div>
                        <div className="text-sm font-mono font-bold text-white tracking-wide my-1">
                          vofcorp@gmail.com
                        </div>
                        <div className="text-[11px] text-gray-300">
                          Veronica Onyeneke Foundation Corp.
                        </div>
                        <button
                          onClick={() => copyToClipboard("vofcorp@gmail.com", "zelle")}
                          className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-200 transition-colors cursor-pointer"
                        >
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>{copiedAccount === "zelle" ? "Zelle Email Copied!" : "Copy Zelle Address"}</span>
                        </button>
                      </div>

                      {/* Tax Exempt Note */}
                      <div className="p-3 rounded-xl bg-[#558b1a]/15 border border-[#558b1a]/30 text-xs text-gray-200">
                        <span className="font-bold text-[#8ac43e] block mb-0.5">U.S. Tax Exemption</span>
                        Donations to VOF Corp. are tax-deductible to the fullest extent permitted by U.S. law.
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-gray-400">
                  <span>Send payment confirmations to <strong>info@vonf.org</strong> or WhatsApp <strong>+234 903 373 6826</strong> for formal acknowledgement.</span>
                </div>
              </div>

              {/* Right Side: Active Initiatives Showcase */}
              <div className="w-full md:w-[52%] bg-gray-50 flex flex-col justify-between relative overflow-hidden h-[380px] md:h-auto">
                <div
                  className="flex h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${modalIndex * 100}%)` }}
                >
                  {modalProjects.map((project) => (
                    <div key={project.id} className="w-full flex-shrink-0 flex flex-col h-full">
                      <div className="relative w-full h-44 md:h-56 overflow-hidden flex-shrink-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 bg-[#558b1a] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>

                      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow text-left">
                        <div>
                          <h4 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-2 leading-snug">
                            {project.title}
                          </h4>
                          <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4">
                            {project.description}
                          </p>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className="text-gray-500">Raised: <strong className="text-gray-900">{project.raised}</strong></span>
                            <span className="text-[#558b1a]">{project.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#558b1a] to-[#8ac43e] rounded-full transition-all duration-500"
                              style={{ width: `${project.percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Goal: {project.goal}</span>
                            <span>{project.daysLeft} days active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setModalIndex((prev) => (prev > 0 ? prev - 1 : modalProjects.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-md transition-colors cursor-pointer"
                  aria-label="Previous project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setModalIndex((prev) => (prev < modalProjects.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-md transition-colors cursor-pointer"
                  aria-label="Next project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {modalProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setModalIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        modalIndex === idx ? "bg-[#558b1a] w-3.5" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to project ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
