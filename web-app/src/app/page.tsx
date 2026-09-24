"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "@/data/blogs";
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
  IconBrandPaypal,
  IconCalendar,
  IconFileText,
  IconMenu2,
  IconX,
  IconPhoto,
  IconLoader2,
  IconBuilding
} from "@tabler/icons-react";
import DonateModal, { DonationMethod, DonationFrequency } from "@/components/DonateModal";
import FooterDirectGiving from "@/components/FooterDirectGiving";
import { api } from "@/lib/api";

// Logo using the /logo.webp image served from public folder
const Logo = () => (
  <Link
    href="/"
    onClick={(e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="flex items-center gap-2 group"
  >
    <Image
      src="/logo.webp"
      alt="Veronica Onyeneke Foundation Logo"
      width={196}
      height={56}
      className="object-contain h-14 w-auto"
      priority
    />
  </Link>
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
    title: "Supporting Young Vulnerable Pregnant Women",
    badge: "Maternal Dignity",
    description: "VOF provides compassionate support, guidance, mentorship, and skills development to help young mothers navigate difficult circumstances, build sustainable futures, and create better opportunities for themselves and their children.",
    skills: ["Compassionate Mentorship", "Maternal Healthcare Referrals", "Vocational Starter Packs", "Dignity & Emotional Care", "Pathways to Independence"],
    color: "#ec4899",
    textColor: "text-pink-600",
    icon: <IconHeart className="w-12 h-12" stroke={1.2} />
  },
  {
    id: 2,
    title: "Youth Skills Acquisition & Entrepreneurship (VOIE)",
    badge: "Flagship Platform",
    description: "Through the Veronica Onyeneke Institute of Entrepreneurship (VOIE), we empower young people through practical skills training, entrepreneurship education, digital skills, and mentorship, equipping them for self-reliance and a brighter future.",
    skills: ["Fashion Design & Tailoring", "Footwear Making", "Hairdressing & Cosmetology", "Electrical & Solar Installation", "ICT & Digital Skills", "Plumbing & Piping"],
    color: "#a855f7",
    textColor: "text-purple-600",
    icon: <IconBriefcase className="w-12 h-12" stroke={1.2} />
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

// FAQ items updated from FAQ VOF.docx and foundation records
const faqItems: { q: string; a: string | string[] }[] = [
  {
    q: "How does VOF assist young pregnant women?",
    a: "VOF supports young pregnant women by helping them return to education where possible or providing opportunities to acquire practical skills through the Veronica Onyeneke Institute of Entrepreneurship. These opportunities are designed to help them become self-reliant, provide for their children, and build a more secure future."
  },
  {
    q: "How does VOF support the children of young mothers?",
    a: [
      "VOF first seeks to work with the young mother and her family, particularly the grandparents, to encourage them to accept and support the child within the family.",
      "Where the family is unable or unwilling to take the child home, and with the informed consent of the young mother and the involvement of the Foundation's Legal Representative, VOF may arrange temporary care and protection for the child through an appropriate and legally recognised child-care institution.",
      "This is not abandonment or permanent separation. The arrangement is intended to provide the child with proper care, protection, and support while the mother is being helped to regain stability and prepare to take responsibility for her child. VOF remains concerned about the child's welfare throughout the period of temporary care and will support the mother towards safe and appropriate reunification when she is ready and able to care for her child."
    ]
  },
  {
    q: "Does the Veronica Onyeneke Institute of Entrepreneurship provide free education?",
    a: "The Veronica Onyeneke Institute of Entrepreneurship does not operate as a free educational institution. However, the Veronica Onyeneke Foundation provides scholarships to vulnerable young people who may otherwise be unable to afford the cost of training. Scholarship support is provided based on need and available resources."
  },
  {
    q: "How can I apply for the Skills Acquisition Programme? Is the programme open throughout the year?",
    a: [
      "Applications for the Skills Acquisition Programme are submitted through the Foundation's official website. The programme does not operate on a year-round application basis. Applications open once a year, typically from the second week to the third week of January, after which shortlisted applicants are invited for an interview.",
      "Applicants are encouraged to monitor the Foundation's website and official communication channels for application dates, requirements, and other relevant information."
    ]
  },
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
];

// Official Partners extracted from former site & institutional alliances
const partners = [
  {
    name: "Saint Paul's Secondary School",
    role: "Official Education Partner",
    location: "Umuezu Nvosi, Abia State",
    logo: "/partners/saint-pauls.jpg",
    description: "10 students under full academic sponsorship"
  },
  {
    name: "Evette Institute",
    role: "Vocational Skills Partner",
    location: "Umuguma, Owerri, Imo State",
    logo: "/partners/evette-institute.jpg",
    description: "1-year professional fashion design & catering training"
  },
  {
    name: "Alvan Ikoku Federal University",
    role: "Higher Education Outreach",
    location: "Owerri, Imo State",
    logo: "/partners/aifue.svg",
    description: "Beyond the Degree student empowerment partnership"
  },
  {
    name: "All Saints Catholic Academy",
    role: "Educational Ally • USA",
    location: "Albany, New York",
    logo: "/partners/all-saints.svg",
    description: "Cross-border educational support & pastoral ally"
  },
  {
    name: "Rwanda Governance Board",
    role: "Statutory Accreditation",
    location: "Kigali, Rwanda",
    logo: "/partners/rgb-rwanda.svg",
    description: "Accredited international nonprofit partner"
  },
  {
    name: "Cloveebiz Limited",
    role: "Technology Partner",
    location: "Enterprise IT & Security",
    logo: "/partners/cloveebiz.svg",
    description: "Digital infrastructure & cybersecurity support"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateMethod, setDonateMethod] = useState<DonationMethod>("paystack");
  const [donateFrequency, setDonateFrequency] = useState<DonationFrequency>("once");

  const openDonate = (method: DonationMethod = "paystack", frequency: DonationFrequency = "once") => {
    setDonateMethod(method);
    setDonateFrequency(frequency);
    setIsDonateOpen(true);
  };
  const [donationCurrency, setDonationCurrency] = useState<"NGN" | "USD">("NGN");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [isProjectsPopupOpen, setIsProjectsPopupOpen] = useState(false);
  const [popupProjectIndex, setPopupProjectIndex] = useState(0);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Become a Partner Form State
  const [partnerForm, setPartnerForm] = useState({
    organizationName: "",
    partnerType: "Corporate",
    contactPerson: "",
    email: "",
    phone: "",
    country: "Nigeria",
    city: "",
    website: "",
    partnershipInterest: "Vocational Training & Starter Kits (VOIE)",
    message: "",
  });
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerError, setPartnerError] = useState("");

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.organizationName.trim() || !partnerForm.contactPerson.trim() || !partnerForm.email.trim()) {
      setPartnerError("Please provide your organization name, contact person, and email address.");
      return;
    }
    setPartnerSubmitting(true);
    setPartnerError("");
    try {
      await api.createPartner({
        organizationName: partnerForm.organizationName.trim(),
        partnerType: partnerForm.partnerType,
        contactPerson: partnerForm.contactPerson.trim(),
        email: partnerForm.email.trim(),
        phone: partnerForm.phone.trim(),
        country: partnerForm.country,
        city: partnerForm.city.trim(),
        website: partnerForm.website.trim(),
        partnershipInterest: partnerForm.partnershipInterest,
        message: partnerForm.message.trim(),
        status: "new",
      });
      setPartnerSuccess(true);
      setPartnerForm({
        organizationName: "",
        partnerType: "Corporate",
        contactPerson: "",
        email: "",
        phone: "",
        country: "Nigeria",
        city: "",
        website: "",
        partnershipInterest: "Vocational Training & Starter Kits (VOIE)",
        message: "",
      });
    } catch (err: any) {
      console.error("Partner submission error:", err);
      setPartnerError("There was an error submitting your proposal. Please try again or reach out to us at info@vonf.org.");
    } finally {
      setPartnerSubmitting(false);
    }
  };

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
    { label: "Home", href: "/", active: true },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog" },
    { label: "Financial Reports", href: "/financial-reports" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 overflow-x-clip">
      {/* TOP HEADER (CLEAN STANDALONE PAGE LINKS) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs transition-all">
        <div className="w-full px-6 lg:px-16 py-3.5 flex items-center justify-between">
          <Logo />

          {/* Center Navigation (Only External Standalone Pages) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`font-semibold transition-colors duration-200 text-sm whitespace-nowrap ${
                  item.active ? "text-[#558b1a] font-bold" : "text-gray-700 hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDonateOpen(true)}
              className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-xs cursor-pointer shadow-sm"
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
                    if (item.href === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`block py-2 text-sm font-semibold ${
                    item.active ? "text-[#558b1a] font-bold" : "text-gray-700 hover:text-[#558b1a]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[1.15] font-bold text-[#1b2124] max-w-4xl tracking-tight mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Standing with vulnerable young women. <br />
          <BrushStroke>Empowering youths.</BrushStroke>
        </motion.h1>

        <motion.p
          className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The Veronica Onyeneke Foundation (VOF) supports young pregnant women in vulnerable circumstances and empowers young people through practical skills acquisition and education.
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

      {/* PARTNERS & INSTITUTIONAL ALLIANCES STRIP */}
      <section className="w-full border-y border-gray-100 bg-[#fbfdf9] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-10">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">
              Official Alliances & Collaborations
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Our Educational & Institutional Partners
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              Partnering with accredited schools, vocational institutes, and community organizations to expand educational access and technical mastery.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-stretch">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-[#8ac43e] hover:shadow-lg transition-all duration-300 justify-between"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-4 bg-gray-50/80 border border-gray-100 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <div className="space-y-1.5 w-full">
                  <h4 className="font-serif text-xs font-bold text-gray-900 leading-snug group-hover:text-[#558b1a] transition-colors">
                    {partner.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-[#558b1a] block">
                    {partner.role}
                  </span>
                  <span className="text-[10px] text-gray-400 block">
                    {partner.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE PILLARS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">Our Foundation Pillars</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1b2124]">
            Compassion into Action, Opportunity into Empowerment
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
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
              Supporting Young Vulnerable Pregnant Women
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-grow">
              VOF provides compassionate support, guidance, mentorship, and skills development to help young mothers navigate difficult circumstances, build sustainable futures, and create better opportunities for themselves and their children.
            </p>
            <div className="pt-4 border-t border-stone-200/60 flex items-center text-xs font-bold text-pink-600">
              <span>Maternal Care & Guidance</span>
            </div>
          </div>

          <div className="flex flex-col bg-stone-50/70 p-8 rounded-2xl border border-stone-200/60 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center mb-6">
              <IconBriefcase className="w-8 h-8" stroke={1.5} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] mb-3">
              Practical Skills & Entrepreneurship
            </h3>
            <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 flex-grow">
              Through the Veronica Onyeneke Institute of Entrepreneurship (VOIE), we empower young people through practical skills training, entrepreneurship education, digital skills, and mentorship, equipping them for self-reliance and a brighter future.
            </p>
            <div className="pt-4 border-t border-stone-200/60 flex items-center text-xs font-bold text-[#558b1a]">
              <span>VOIE Vocational Center</span>
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
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#8ac43e]/40 shadow-sm flex-shrink-0">
                  <Image
                    src="/veronica.png"
                    alt="Mrs. Veronica Ulumma Chinenyenwa Onyeneke"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-serif text-lg font-bold text-[#1b2124] mb-2 flex items-center gap-2">
                    <IconSparkles className="w-5 h-5 text-[#558b1a]" />
                    The Story Behind the Foundation
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    The Foundation was established by <strong>Rev. Fr. Charles Onyeneke</strong> in honour of his late mother, <strong>Mrs. Veronica Ulumma Chinenyenwa Onyeneke</strong> (1948–2023), whose life in Mbieri, Imo State, was marked by deep faith, generosity, and founding community welfare initiatives like <em>Otu Dikwadoro</em> to feed and support struggling families.
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-[#d6e2c8] text-sm text-gray-800 font-medium italic border-l-4 border-[#558b1a]">
                    &ldquo;A good life is one spent in the service of others.&rdquo;
                    <span className="block text-xs font-bold text-gray-500 not-italic mt-1">— Mrs. Veronica Onyeneke&apos;s Guiding Motto</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white font-bold text-xs transition-all shadow-xs"
              >
                <span>Read Our Full Story, Inspiration & Founder</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>
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
            <Link href="/gallery" className="relative w-full aspect-square overflow-hidden shadow-md group block cursor-pointer">
              <Image
                src="/IMG01.jpeg"
                alt="Veronica Onyeneke Institute of Entrepreneurship practical training cohort"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <IconPhoto className="w-3.5 h-3.5 text-[#558b1a]" />
                  <span>View Gallery</span>
                </span>
              </div>
            </Link>
            <Link href="/gallery" className="relative w-full aspect-square overflow-hidden shadow-md group block cursor-pointer">
              <Image
                src="/IMG02.jpeg"
                alt="Community classroom learning and skills development"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <IconPhoto className="w-3.5 h-3.5 text-[#558b1a]" />
                  <span>View Gallery</span>
                </span>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 w-full">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tight">
                What We Have Done With <BrushStroke>Your Help</BrushStroke>
              </h2>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#558b1a] hover:bg-[#558b1a] hover:text-white font-bold text-xs transition-all shrink-0 self-start sm:self-auto group shadow-2xs"
              >
                <IconPhoto className="w-3.5 h-3.5" />
                <span>Visit Gallery</span>
                <IconArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <div className="flex flex-col gap-3">
                <Link href="/gallery" className="relative w-full aspect-square overflow-hidden shadow-md group block cursor-pointer">
                  <Image
                    src="/IMG03.jpeg"
                    alt="Volunteers and community outreach operations"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                      <IconPhoto className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>View Gallery</span>
                    </span>
                  </div>
                </Link>
                <Link href="/gallery" className="relative w-full aspect-square overflow-hidden shadow-md group block cursor-pointer">
                  <Image
                    src="/IMG04.jpeg"
                    alt="Students around a globe in school classroom"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                      <IconPhoto className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>View Gallery</span>
                    </span>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed w-full">
                  Behind every program is a person with dreams, challenges, courage, and potential. Your support provides hands-on vocational training, maternal guidance, and educational resources that build sustainable futures.
                </p>

                <Link href="/gallery" className="relative w-full aspect-square overflow-hidden shadow-md group mt-1 block cursor-pointer">
                  <Image
                    src="/IMG05.jpeg"
                    alt="Healthcare clinic and maternal support outreach"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5">
                      <IconPhoto className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>View Gallery</span>
                    </span>
                  </div>
                </Link>

                <div className="w-full flex flex-col gap-2.5 pt-3">
                  <GreenButton
                    onClick={() => setIsDonateOpen(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-gray-950 font-bold hover:text-black shadow-xs hover:shadow-md justify-center"
                  >
                    Donate More
                  </GreenButton>

                  <Link
                    href="/gallery"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 hover:shadow-lg transition-all duration-200 text-sm cursor-pointer shadow-xs group"
                  >
                    <IconPhoto className="w-4 h-4" />
                    <span>View Gallery</span>
                    <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
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
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-100 hover:bg-[#558b1a] text-gray-800 hover:text-white font-bold text-xs transition-all shadow-xs"
            >
              <span>Explore All Programs & Full Curriculum</span>
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
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

      {/* ABOUT & LEADERSHIP CALLOUT BRIDGE */}
      <section className="w-full bg-[#fbfdf9] py-16 px-6 lg:px-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#0c1a05] to-[#1a380c] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8ac43e] block mb-2">Our Roots & Leadership</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 leading-tight">
              The Inspiration & Vision Behind VOF
            </h3>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
              Discover the profound legacy of Mrs. Veronica Onyeneke, the theological and pastoral vision of our founder Rev. Charles Onyeneke, and meet our global Board of Trustees.
            </p>
          </div>
          <Link
            href="/about"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-gray-950 font-bold text-xs flex-shrink-0 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Meet Our Leadership & Trustees</span>
            <IconArrowRight className="w-4 h-4 text-[#558b1a]" />
          </Link>
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

      {/* LATEST NEWS & STORIES SECTION */}
      <section id="news" className="w-full bg-white py-24 border-t border-gray-100 scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl text-left">
              <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">From Our Field & Desks</span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-tight">
                Latest News & <BrushStroke>Stories</BrushStroke>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-4 leading-relaxed">
                Discover firsthand reports from our student programs, community outreaches, women empowerment initiatives, and institutional publications.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-[#558b1a] text-gray-800 hover:text-white font-bold text-xs transition-all shadow-xs"
              >
                <span>All Articles ({blogPosts.length})</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/financial-reports"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-all shadow-xs"
              >
                <IconFileText className="w-4 h-4 text-emerald-600" />
                <span>Financial Reports</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image with Green Date Badge */}
                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Top-Left Green Date Badge */}
                  <div className="absolute top-3 left-3 bg-[#65a324] text-white px-3 py-2 flex flex-col items-center justify-center font-bold shadow-md z-10">
                    <span className="text-base font-extrabold leading-tight">{post.day || "30"}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{post.month || "OCT"}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Region / Category in Gray Uppercase */}
                    <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2.5 block">
                      {post.region || post.category}
                    </span>

                    {/* Bold Title */}
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-snug mb-6 group-hover:text-[#558b1a] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {/* Bottom Author & Likes Row */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200">
                        <Image
                          src={post.authorAvatar || "/team/charles-onyeneke.jpg"}
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium truncate max-w-[150px]">
                        Written by {post.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium flex-shrink-0">
                      <svg className="w-4 h-4 text-[#ef4444] fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span>{post.likes || "3.2 k"}</span>
                    </div>
                  </div>
                </div>
              </Link>
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
                  <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 space-y-3">
                    {Array.isArray(item.a) ? (
                      item.a.map((para, pIdx) => <p key={pIdx}>{para}</p>)
                    ) : (
                      <p>{item.a}</p>
                    )}
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
                href="#become-a-partner"
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

      {/* BECOME A PARTNER TODAY SECTION & FORM */}
      <section id="become-a-partner" className="w-full bg-[#fbfdf9] py-24 border-t border-gray-100 scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#558b1a] text-xs font-bold uppercase tracking-widest block mb-2">
              Collaborate For Greater Impact
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tight">
              Become a <BrushStroke>Partner Today</BrushStroke>
            </h2>
            <p className="text-gray-700 text-base sm:text-lg mt-4 leading-relaxed font-serif italic max-w-2xl mx-auto">
              &ldquo;We are open to partnerships with corporate organisations, schools, private companies, and individuals who are committed to helping vulnerable young women and empowering youth.&rdquo;
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
              Whether you are an enterprise seeking purposeful CSR, an educational institution offering scholarships, or a passionate supporter, let us co-create enduring pathways to self-reliance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Columns: Partnership Pillars */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#558b1a]/10 text-[#558b1a] flex items-center justify-center text-sm">
                    <IconHeartHandshake className="w-4 h-4" />
                  </span>
                  <span>How We Can Partner</span>
                </h3>

                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#558b1a] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                      <IconBriefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Corporate & CSR Initiatives</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Sponsor vocational cohorts at VOIE, donate industrial equipment, or fund student graduation starter kits with transparent impact metrics and tax-deductible receipts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#558b1a] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                      <IconSchool className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Schools & Universities</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Facilitate student admissions, collaborate on academic scholarships (JAMB & tertiary level), and co-host youth leadership and digital literacy clinics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#558b1a] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                      <IconHeart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Maternal Health & Women Support</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Join hands with clinics, maternity advocates, and care groups to provide young expectant mothers with healthcare access, mentorship, and life rehabilitation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#558b1a] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                      <IconWorld className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Cross-Border & Institutional Allies</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Engage through VOF Corp. in the USA (501(c)(3) status), VOF Nigeria (CAC registered), or VOF Rwanda (accredited RGB nonprofit) for matched grants and international alliances.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-gray-100 bg-[#f8fbf5] -mx-8 -mb-8 p-6 rounded-b-3xl">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">Prefer direct liaison?</span>
                    <a
                      href="mailto:info@vonf.org?subject=Partnership%20Inquiry%20-%20VOF"
                      className="text-[#558b1a] font-bold hover:underline"
                    >
                      info@vonf.org
                    </a>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Call our partnership team directly: +234 903 373 6826 (NG) • +1 (720) 675-4211 (USA) • +250 793 156 562 (RW)
                  </p>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Interactive Partnership Application Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-md text-left">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#558b1a]">Partner Inquiry Form</span>
                  <h3 className="font-serif text-2xl font-bold text-gray-950 mt-1">Submit Your Partnership Details</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Fill in your organization details below. Our executive desk will review your proposal promptly.
                  </p>
                </div>

                {partnerSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-[#f4f9ed] border border-[#cbe1b7] text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#558b1a] text-white flex items-center justify-center mx-auto shadow-sm">
                      <IconCheck className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-gray-900">Partnership Proposal Received!</h4>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Thank you for offering to collaborate with the Veronica Onyeneke Foundation. Your proposal has been securely recorded and dispatched to our partnership team. We will review your submission and contact you within 24–48 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setPartnerSuccess(false)}
                      className="px-6 py-2.5 bg-[#558b1a] text-white font-bold text-xs rounded-full hover:bg-[#477516] transition-all cursor-pointer shadow-xs"
                    >
                      Submit Another Proposal
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePartnerSubmit} className="space-y-4">
                    {partnerError && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {partnerError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Organization Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Organization / Company / School Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.organizationName}
                          onChange={(e) => setPartnerForm({ ...partnerForm, organizationName: e.target.value })}
                          placeholder="e.g. First Bank Ltd, Hope Academy, or Jane Doe"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                        />
                      </div>

                      {/* Partner Type */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Partner Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={partnerForm.partnerType}
                          onChange={(e) => setPartnerForm({ ...partnerForm, partnerType: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-white text-gray-800"
                        >
                          <option value="Corporate">Corporate / Enterprise</option>
                          <option value="School">School / Educational Institution</option>
                          <option value="Private Company">Private Company / SME</option>
                          <option value="NGO">NGO / Non-Profit Organisation</option>
                          <option value="Faith-Based">Faith-Based Group / Church</option>
                          <option value="Individual">Individual / Philanthropist</option>
                          <option value="Healthcare">Healthcare / Clinic</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Contact Person */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Contact Person Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.contactPerson}
                          onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                          placeholder="e.g. Dr. Ngozi Eze / Michael Brown"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={partnerForm.email}
                          onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                          placeholder="partner@organization.org"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={partnerForm.phone}
                          onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                          placeholder="+234 800 000 0000"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Country Hub
                        </label>
                        <select
                          value={partnerForm.country}
                          onChange={(e) => setPartnerForm({ ...partnerForm, country: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-white text-gray-800"
                        >
                          <option value="Nigeria">Nigeria</option>
                          <option value="Rwanda">Rwanda</option>
                          <option value="USA">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Other">Other Country</option>
                        </select>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          City / State
                        </label>
                        <input
                          type="text"
                          value={partnerForm.city}
                          onChange={(e) => setPartnerForm({ ...partnerForm, city: e.target.value })}
                          placeholder="e.g. Owerri, Kigali, Denver"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Website */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Website / Organization URL
                        </label>
                        <input
                          type="url"
                          value={partnerForm.website}
                          onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                        />
                      </div>

                      {/* Partnership Interest */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                          Primary Area of Interest
                        </label>
                        <select
                          value={partnerForm.partnershipInterest}
                          onChange={(e) => setPartnerForm({ ...partnerForm, partnershipInterest: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-white text-gray-800"
                        >
                          <option value="Vocational Training & Starter Kits (VOIE)">Vocational Training & Starter Kits (VOIE)</option>
                          <option value="Maternal Dignity & Young Mothers Support">Maternal Dignity & Young Mothers Support</option>
                          <option value="Academic Scholarships (JAMB / Secondary / Tertiary)">Academic Scholarships (JAMB / Secondary / Tertiary)</option>
                          <option value="Corporate CSR & Program Sponsorship">Corporate CSR & Program Sponsorship</option>
                          <option value="Facility, Tools & In-Kind Equipment">Facility, Tools & In-Kind Equipment</option>
                          <option value="Technology & Cybersecurity Support">Technology & Cybersecurity Support</option>
                          <option value="Other Collaborative Initiative">Other Collaborative Initiative</option>
                        </select>
                      </div>
                    </div>

                    {/* Proposal / Collaboration Message */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Collaboration Proposal / Message
                      </label>
                      <textarea
                        rows={3}
                        value={partnerForm.message}
                        onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                        placeholder="Tell us about your organization and how you envision partnering with VOF to empower vulnerable women and youths..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50 resize-y"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <IconShieldCheck className="w-4 h-4 text-[#558b1a] flex-shrink-0" />
                        <span>All proposals are kept strictly confidential and reviewed by VOF leadership.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={partnerSubmitting}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {partnerSubmitting ? (
                          <>
                            <IconLoader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Proposal...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Partnership Proposal</span>
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
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
                <a href="#become-a-partner" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Become a Partner Today</span>
                </a>
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
            <FooterDirectGiving onDonateClick={(m, freq) => openDonate(m, freq)} />
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
