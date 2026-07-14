"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IconBriefcase, IconSchool, IconHeart, IconToolsKitchen2, IconRocket, IconMapPin, IconPhone, IconMail } from "@tabler/icons-react";

// Logo using the /logo.webp image served from public folder
const Logo = () => (
  <div className="flex items-center">
    <Image 
      src="/logo.webp" 
      alt="Zikuji Logo" 
      width={196} 
      height={56} 
      className="object-contain h-14 w-auto"
      priority
    />
  </div>
);

// Dry-brush highlight background effect for the word "Change" using stroke.png
const BrushStroke = () => (
  <span className="relative inline-block px-3 py-1 isolate">
    <span className="relative z-10 text-gray-900 font-bold">Change</span>
    <img 
      src="/stroke.png"
      alt="Brush Stroke highlight"
      className="absolute inset-0 w-full h-[115%] -z-10 scale-x-105 -translate-y-1 select-none pointer-events-none"
    />
  </span>
);

// Medical & Blood Icon (Hands holding a heart with a cross)
const MedicalIcon = () => (
  <svg className="w-16 h-16 flex-shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Heart */}
    <path d="M32 38C32 38 20 28 20 21C20 16.5 23.5 13 28 13C30.5 13 32 15 32 15C32 15 33.5 13 36 13C40.5 13 44 16.5 44 21C44 28 32 38 32 38Z" stroke="#1b2124" strokeWidth="2.2" strokeLinejoin="round" fill="#fff" />
    {/* Gold Cross */}
    <path d="M32 18V26M28 22H36" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
    {/* Hands */}
    <path d="M16 28C14 26 10 28 8 31C6 34 8 38 12 42C16 46 22 48 26 48H38C42 48 48 46 52 42C56 38 58 34 56 31C54 28 50 26 48 28" stroke="#1b2124" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 28C18 31 22 34 26 34M48 28C46 31 42 34 38 34" stroke="#1b2124" strokeWidth="2.2" strokeLinecap="round" />
    {/* Gold wrist cuffs */}
    <rect x="18" y="48" width="6" height="5" fill="#fbbf24" stroke="#1b2124" strokeWidth="2" />
    <rect x="40" y="48" width="6" height="5" fill="#fbbf24" stroke="#1b2124" strokeWidth="2" />
    {/* Arms */}
    <path d="M21 53V58M43 53V58" stroke="#1b2124" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// Food Donation Icon (Plate, fork, knife)
const FoodIcon = () => (
  <svg className="w-16 h-16 flex-shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Plate */}
    <circle cx="32" cy="32" r="14" stroke="#1b2124" strokeWidth="2.2" fill="#fff" />
    <circle cx="32" cy="32" r="10" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Fork (Left) */}
    <path d="M18 16V28C18 30 20 32 22 32M22 16V32M26 16V28C26 30 24 32 22 32M22 32V48" stroke="#1b2124" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Fork handle gold highlight */}
    <path d="M22 36V44" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
    {/* Knife (Right) */}
    <path d="M46 16V32H42V48" stroke="#1b2124" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Knife blade edge */}
    <path d="M46 16C46 16 42 18 42 24V32H46V16Z" fill="#fff" stroke="#1b2124" strokeWidth="2.2" />
    {/* Knife handle gold highlight */}
    <path d="M42 36V44" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Give Education Icon (Mortarboard / Graduation cap)
const EducationIcon = () => (
  <svg className="w-16 h-16 flex-shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mortarboard Diamond Top */}
    <path d="M32 14L54 22L32 30L10 22L32 14Z" stroke="#1b2124" strokeWidth="2.2" fill="#fff" strokeLinejoin="round" />
    {/* Bottom Cap part */}
    <path d="M18 25V33C18 37.5 24 41 32 41C40 41 46 37.5 46 33V25" stroke="#1b2124" strokeWidth="2.2" strokeLinejoin="round" fill="#fff" />
    {/* Gold tassel */}
    <path d="M32 22L12 28V42" stroke="#1b2124" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="42" r="2.5" fill="#fbbf24" stroke="#1b2124" strokeWidth="1.5" />
    {/* Gold highlight line on the diamond edge */}
    <path d="M28 28.5L32 30L54 22" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
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

const programsData = [
  {
    id: 1,
    title: "Skills Acquisition",
    description: "Through the Veronica Onyeneke Institute of Entrepreneurship (VOIE), we empower young people with practical skills and business training. Our programs help them start small enterprises, gain employable skills, and build sustainable livelihoods. We believe in transforming passion into purpose and ideas into impact.",
    color: "#a855f7",
    textColor: "text-purple-600",
    icon: <IconBriefcase className="w-14 h-14" stroke={0.8} />
  },
  {
    id: 2,
    title: "Educational Support",
    description: "We provide scholarships, mentorship, and learning resources to bright students from low-income families ensuring that financial hardship never stands in the way of education and opportunity.",
    color: "#22c55e",
    textColor: "text-green-600",
    icon: <IconSchool className="w-14 h-14" stroke={0.8} />
  },
  {
    id: 3,
    title: "Healthcare Support",
    description: "We promote access to basic healthcare through medical aid, awareness campaigns, and partnerships with health providers because good health is the foundation of a meaningful life.",
    color: "#06b6d4",
    textColor: "text-cyan-600",
    icon: <IconHeart className="w-14 h-14" stroke={0.8} />
  },
  {
    id: 4,
    title: "Food Security",
    description: "Through our food outreach and nutrition initiatives, we support families facing hunger and malnutrition, ensuring no one is left behind in the fight for dignity and wellbeing.",
    color: "#f43f5e",
    textColor: "text-red-500",
    icon: <IconToolsKitchen2 className="w-14 h-14" stroke={0.8} />
  },
  {
    id: 5,
    title: "Youth Empowerment",
    description: "We create opportunities for young people to lead, innovate, and grow through mentorship, leadership training, and creative development programs helping them shape a better future for themselves and their communities.",
    color: "#ec4899",
    textColor: "text-pink-600",
    icon: <IconRocket className="w-14 h-14" stroke={0.8} />
  }
];

const modalProjects = [
  {
    id: 1,
    title: "Sponsor Education for Rural Children",
    description: "Provide books, school uniforms, and learning resources for children in underprivileged communities.",
    image: "/IMG04.jpeg",
    category: "Education",
    raised: "$6,500",
    goal: "$10,000",
    percentage: 65,
    daysLeft: 12
  },
  {
    id: 2,
    title: "Clean Drinking Water Systems",
    description: "Building sustainable water filtration units for schools, local families, and healthcare clinics.",
    image: "/IMG03.jpeg",
    category: "Water Aid",
    raised: "$4,800",
    goal: "$10,000",
    percentage: 48,
    daysLeft: 24
  },
  {
    id: 3,
    title: "Medical Care & Aid for Orphanages",
    description: "Regular health checkups, vaccines, medicine supplies, and emergency support for orphan child centres.",
    image: "/IMG05.jpeg",
    category: "Healthcare",
    raised: "$8,200",
    goal: "$10,000",
    percentage: 82,
    daysLeft: 8
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleItems, setVisibleItems] = React.useState(3);
  const [isDonateOpen, setIsDonateOpen] = React.useState(false);
  const [modalIndex, setModalIndex] = React.useState(0);
  const [isProjectsPopupOpen, setIsProjectsPopupOpen] = React.useState(false);
  const [popupProjectIndex, setPopupProjectIndex] = React.useState(0);
  const [isPopupHovered, setIsPopupHovered] = React.useState(false);

  React.useEffect(() => {
    if (!isDonateOpen) return;
    const interval = setInterval(() => {
      setModalIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isDonateOpen]);

  React.useEffect(() => {
    if (!isProjectsPopupOpen || isPopupHovered) return;
    const interval = setInterval(() => {
      setPopupProjectIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isProjectsPopupOpen, isPopupHovered]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsProjectsPopupOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  const navItems = ["About", "Project", "Event", "Pages", "Contact"];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 overflow-x-hidden">
      {/* HEADER - FULL WIDTH */}
      <header className="w-full max-w-full px-8 lg:px-16 py-5 flex items-center justify-between border-b border-gray-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <motion.a 
              key={item} 
              href={item === "Project" ? undefined : `#${item.toLowerCase()}`}
              onClick={item === "Project" ? () => setIsProjectsPopupOpen(true) : undefined}
              className="text-gray-600 hover:text-[#7ccd2d] font-semibold transition-colors duration-200 text-[15px] cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              {item}
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
          <GreenButton className="px-7 py-2.5">
            Sign Up
          </GreenButton>
          <button className="px-7 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-lg transition-all duration-200 text-sm cursor-pointer">
            Log In
          </button>
        </motion.div>
      </header>

      {/* HERO SECTION - FULL WIDTH */}
      <main className="w-full max-w-full px-8 lg:px-16 pt-16 md:pt-24 pb-20 flex flex-col items-center text-center">
        {/* Main Headline - Increased width (max-w-7xl) & reduced line-height (leading-[1.08]) */}
        <motion.h1 
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1b2124] leading-[1.08] max-w-7xl tracking-tighter mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Small Help to <BrushStroke /> <br className="hidden sm:inline" /> the World
        </motion.h1>

        {/* Welcome Tagline Subtitle */}
        <motion.p
          className="text-gray-500 text-lg sm:text-xl leading-relaxed max-w-3xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Welcome to the Veronica Onyeneke Foundation (VOF), a nonprofit organization dedicated to transforming lives through education, healthcare, feeding programs, and community empowerment.
        </motion.p>

        {/* Primary CTA Buttons - Reduced height (py-2.5 instead of py-4.5) */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GreenButton 
            onClick={() => setIsProjectsPopupOpen(true)}
            className="px-9 py-2.5 text-base tracking-wide min-w-[180px]"
          >
            All Project
          </GreenButton>
          <button 
            onClick={() => setIsDonateOpen(true)}
            className="px-9 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-xl transition-all duration-250 text-base tracking-wide min-w-[180px] cursor-pointer"
          >
            Donate Now
          </button>
        </motion.div>

        {/* Hero Image (World Map Mask) - Set to use hero.jpeg and expanded width */}
        <motion.div 
          className="w-full max-w-7xl px-4 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full aspect-[4/3] max-h-[600px] flex justify-center items-center">
            <Image
              src="/hero.jpeg"
              alt="World Map mask showing a child and a woman crafting pottery"
              fill
              className="object-contain select-none"
              priority
              sizes="100vw"
            />
          </div>
        </motion.div>
      </main>

      {/* FEATURES/BENEFITS GRID SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 bg-white">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Medical & Blood Card */}
          <div className="flex flex-col gap-4 text-left max-w-sm mx-auto w-full">
            <div className="flex items-center gap-4">
              <MedicalIcon />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] leading-tight">
                Medical & <br /> Blood
              </h3>
            </div>
            <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
              It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
          </div>

          {/* Food Donation Card (With Paint Blot Background) */}
          <div className="relative flex flex-col gap-4 text-left max-w-sm mx-auto w-full isolate">
            {/* Paint blot background decoration */}
            <div className="absolute inset-0 -z-10 flex justify-center items-center opacity-[0.06] pointer-events-none select-none">
              <img 
                src="/stroke.png" 
                alt="Paint blot decoration" 
                className="w-[200px] h-[200px] object-contain rotate-12 scale-150"
              />
            </div>

            <div className="flex items-center gap-4">
              <FoodIcon />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] leading-tight">
                Food <br /> Donation
              </h3>
            </div>
            <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
              It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
          </div>

          {/* Give Education Card */}
          <div className="flex flex-col gap-4 text-left max-w-sm mx-auto w-full">
            <div className="flex items-center gap-4">
              <EducationIcon />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] leading-tight">
                Give <br /> Education
              </h3>
            </div>
            <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
              It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE HAVE DONE SECTION */}
      <section className="w-full max-w-[900px] mx-auto px-6 py-24 bg-white border-t border-gray-100 mt-16">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 items-start">
          {/* Column 1 (Left Image Gallery - Starts at y=0) */}
          <div className="flex flex-col gap-2">
            {/* Image 1 (Top Left) */}
            <div className="relative w-full aspect-square rounded-none overflow-hidden shadow-md">
              <Image 
                src="/IMG01.jpeg" 
                alt="Veronica Onyeneke Institute of Entrepreneurship group photo" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            {/* Image 2 (Bottom Left) */}
            <div className="relative w-full aspect-square rounded-none overflow-hidden shadow-md">
              <Image 
                src="/IMG02.jpeg" 
                alt="Community classroom learning" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Right 2/3 Area (Spans Columns 2 & 3) */}
          <div className="lg:col-span-2 flex flex-col gap-2 text-left">
            {/* Heading - Spans through the centre and right columns */}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tighter w-full pb-2">
              What We Have Done With <span className="relative inline-block px-3 py-1 isolate">
                <span className="relative z-10 text-gray-900 font-bold">Your Help</span>
                <img 
                  src="/stroke.png"
                  alt="Brush Stroke highlight"
                  className="absolute inset-0 w-full h-[115%] -z-10 scale-x-105 -translate-y-1 select-none pointer-events-none"
                />
              </span>
            </h2>

            {/* Sub-grid for Center and Right content */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
              {/* Center Column (Middle Image Gallery) */}
              <div className="flex flex-col gap-2">
                {/* Image 3 (Top Center) */}
                <div className="relative w-full aspect-square rounded-none overflow-hidden shadow-md">
                  <Image 
                    src="/IMG03.jpeg" 
                    alt="Volunteers loading relief materials" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                {/* Image 4 (Bottom Center) */}
                <div className="relative w-full aspect-square rounded-none overflow-hidden shadow-md">
                  <Image 
                    src="/IMG04.jpeg" 
                    alt="Students around a globe in a classroom" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Right Column (Description + Image 5 + Button) */}
              <div className="flex flex-col gap-2">
                {/* Description */}
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed w-full">
                  Take a look at our donation projects. People are striving to develop themselves, and you can feel proud to help them build a better future.
                </p>

                {/* Image 5 (Bottom Right) */}
                <div className="relative w-full aspect-square rounded-none overflow-hidden shadow-md mt-1">
                  <Image 
                    src="/IMG05.jpeg" 
                    alt="Nurses and patients in medical clinic" 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>

                {/* Button */}
                <div className="w-full flex justify-center pt-2">
                  <GreenButton onClick={() => setIsDonateOpen(true)} className="px-8 py-2.5 min-w-[160px]">
                    Donate Now
                  </GreenButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DONATION CARDS SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 bg-white border-t border-gray-100 overflow-hidden">
        {/* Background paint strokes */}
        <img 
          src="/stroke.png" 
          alt="Green paint stroke decoration" 
          className="absolute top-12 left-4 w-40 h-20 object-contain opacity-70 -rotate-12 pointer-events-none select-none"
          style={{ filter: 'hue-rotate(75deg) saturate(1.8)' }}
        />
        <img 
          src="/stroke.png" 
          alt="Yellow paint stroke decoration" 
          className="absolute bottom-12 right-4 w-40 h-20 object-contain opacity-70 rotate-12 pointer-events-none select-none"
        />

        {/* Section Heading */}
        <h2 className="relative z-10 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tighter text-center mb-16">
          Donate For People To <br className="sm:hidden" />
          <span className="relative inline-block px-3 py-1 isolate">
            <span className="relative z-10 text-gray-900 font-bold">Change</span>
            <img 
              src="/stroke.png"
              alt="Brush Stroke highlight"
              className="absolute inset-0 w-full h-[115%] -z-10 scale-x-105 -translate-y-1 select-none pointer-events-none"
            />
          </span> This World
        </h2>

        {/* Cards Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Education */}
          <div className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Image (Stretched to top and sides) */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image 
                src="/IMG04.jpeg" 
                alt="Students in classroom" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Card Content with Inner Padding */}
            <div className="flex flex-col flex-grow p-5 pb-6">
              {/* Action Row */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setIsDonateOpen(true)} className="px-4 py-1.5 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-[13px] cursor-pointer">
                  Donate Now
                </button>
                <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">
                  {/* Clock icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  40 days left
                </span>
              </div>
              {/* Title */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b2124] leading-snug mb-6 flex-grow">
                Donations for underprivileged children's education centers
              </h3>
              {/* Progress Section */}
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-gray-500">Raised: <strong className="text-gray-900">$3400</strong></span>
                  <span className="text-gray-900">40.5%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full" style={{ width: "40.5%" }} />
                </div>
                {/* Footer row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold">
                  <span className="text-gray-500">Goals: <strong className="text-gray-900">$10,000</strong></span>
                  <div className="h-4 w-[1px] bg-gray-200" />
                  <span className="text-gray-500">To go: <strong className="text-gray-900">$10,000</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Healthcare */}
          <div className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Image (Stretched to top and sides) */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image 
                src="/IMG05.jpeg" 
                alt="Clinic medical care" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Card Content with Inner Padding */}
            <div className="flex flex-col flex-grow p-5 pb-6">
              {/* Action Row */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setIsDonateOpen(true)} className="px-4 py-1.5 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-[13px] cursor-pointer">
                  Donate Now
                </button>
                <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  78 days left
                </span>
              </div>
              {/* Title */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b2124] leading-snug mb-6 flex-grow">
                Donations for senior and orphanage healthcare
              </h3>
              {/* Progress Section */}
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-gray-500">Raised: <strong className="text-gray-900">$3400</strong></span>
                  <span className="text-gray-900">40.5%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full" style={{ width: "40.5%" }} />
                </div>
                {/* Footer row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold">
                  <span className="text-gray-500">Goals: <strong className="text-gray-900">$10,000</strong></span>
                  <div className="h-4 w-[1px] bg-gray-200" />
                  <span className="text-gray-500">To go: <strong className="text-gray-900">$10,000</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Daily Meal */}
          <div className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Image (Stretched to top and sides) */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image 
                src="/IMG03.jpeg" 
                alt="Food supplies loading" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Card Content with Inner Padding */}
            <div className="flex flex-col flex-grow p-5 pb-6">
              {/* Action Row */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setIsDonateOpen(true)} className="px-4 py-1.5 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 hover:shadow-md transition-all duration-200 text-[13px] cursor-pointer">
                  Donate Now
                </button>
                <span className="flex items-center gap-1.5 text-gray-500 text-[13px]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  98 days left
                </span>
              </div>
              {/* Title */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b2124] leading-snug mb-6 flex-grow">
                Donations for daily meals for homeless people
              </h3>
              {/* Progress Section */}
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-gray-500">Raised: <strong className="text-gray-900">$3400</strong></span>
                  <span className="text-gray-900">50.6%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full" style={{ width: "50.6%" }} />
                </div>
                {/* Footer row */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold">
                  <span className="text-gray-500">Goals: <strong className="text-gray-900">$10,000</strong></span>
                  <div className="h-4 w-[1px] bg-gray-200" />
                  <span className="text-gray-500">To go: <strong className="text-gray-900">$10,000</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-white border-t border-gray-100">
        <div className="relative w-full aspect-[16/9] max-w-[960px] mx-auto overflow-hidden">
          {/* Background image containing all graphics */}
          <Image 
            src="/stats.jpeg" 
            alt="Statistics map and icons" 
            fill 
            className="object-contain select-none pointer-events-none"
            priority
          />

          {/* Stat 1: Poor people */}
          <div className="absolute left-[22%] top-[31%] flex flex-col text-left">
            <span className="font-serif text-[2.2vw] md:text-3xl lg:text-4xl font-bold text-[#1b2124] leading-tight">
              984k
            </span>
            <span className="text-gray-500 text-[1vw] md:text-sm font-semibold mt-0.5">
              People supported
            </span>
          </div>

          {/* Stat 2: Fund raised */}
          <div className="absolute left-[47%] top-[31%] flex flex-col text-left">
            <span className="font-serif text-[2.2vw] md:text-3xl lg:text-4xl font-bold text-[#1b2124] leading-tight">
              710M
            </span>
            <span className="text-gray-500 text-[1vw] md:text-sm font-semibold mt-0.5">
              Funds raised
            </span>
          </div>

          {/* Stat 3: Active donar */}
          <div className="absolute left-[22%] top-[61%] flex flex-col text-left">
            <span className="font-serif text-[2.2vw] md:text-3xl lg:text-4xl font-bold text-[#1b2124] leading-tight">
              456+
            </span>
            <span className="text-gray-500 text-[1vw] md:text-sm font-semibold mt-0.5">
              Active donors
            </span>
          </div>

          {/* Stat 4: Volunteer */}
          <div className="absolute left-[47%] top-[61%] flex flex-col text-left">
            <span className="font-serif text-[2.2vw] md:text-3xl lg:text-4xl font-bold text-[#1b2124] leading-tight">
              345k
            </span>
            <span className="text-gray-500 text-[1vw] md:text-sm font-semibold mt-0.5">
              Volunteers
            </span>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="w-full bg-[#0f2105] text-white">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
          {/* Left Block (What Say People) */}
          <div className="lg:col-span-5 bg-[#558421] p-12 lg:p-20 flex items-center justify-center lg:justify-end text-left">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.15] text-white max-w-md lg:pr-10">
              What People Say <br /> About Us
            </h2>
          </div>

          {/* Middle Block (Quote and Author) */}
          <div className="lg:col-span-5 bg-[#0f2105] p-12 lg:p-20 flex flex-col justify-center text-left lg:pl-16">
            {/* Double Quote Icon SVG */}
            <svg className="w-14 h-10 text-[#fbbf24] mb-6" viewBox="0 0 54 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7 0 0 7 0 16c0 11 9 20 20 20v-8c-6 0-10-4-10-10 0-1 0-2 1-3 2 1 4 2 6 2 6 0 11-5 11-11S23 0 16 0Zm30 0C37 0 30 7 30 16c0 11 9 20 20 20v-8c-6 0-10-4-10-10 0-1 0-2 1-3 2 1 4 2 6 2 6 0 11-5 11-11S53 0 46 0Z" />
            </svg>
            <p className="text-gray-200 text-[17px] sm:text-[19px] leading-relaxed mb-8 max-w-xl">
              "Take a look at our donation projects. People are striving to develop themselves, and we can feel proud to help them build a sustainable future."
            </p>
            <div className="flex flex-col text-left">
              <span className="font-serif text-xl font-bold text-white">Charlie Geidt</span>
              <span className="text-[#fbbf24] text-[13px] font-semibold mt-1 tracking-wider uppercase">CEO of Biddanando Foundation</span>
            </div>
          </div>

          {/* Right Block (Lighter green container with prev/next buttons) */}
          <div className="lg:col-span-2 bg-[#1b340c] p-8 flex items-center justify-center">
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full border border-yellow-500/50 flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-[#0f2105] transition-all duration-200 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full border border-yellow-500/50 flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-[#0f2105] transition-all duration-200 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="w-full bg-[#f8f9fa] py-24 border-t border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-6">
          {/* Section Heading */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tighter text-center mb-16">
            Latest <span className="relative inline-block px-3 py-1 isolate">
              <span className="relative z-10 text-gray-900 font-bold">News</span>
              <img 
                src="/stroke.png"
                alt="Brush Stroke highlight"
                className="absolute inset-0 w-full h-[115%] -z-10 scale-x-105 -translate-y-1 select-none pointer-events-none"
              />
            </span> From VOF's Blog
          </h2>

          {/* Cards Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: India */}
            <div className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              {/* Date Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-[#6ea124] text-white flex flex-col items-center justify-center w-12 h-12 font-bold select-none">
                <span className="text-[17px] leading-none pt-1">30</span>
                <span className="text-[9px] uppercase tracking-wider leading-none pb-1">Oct</span>
              </div>
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src="/IMG02.jpeg" 
                  alt="Old homeless people in India" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* Card Body */}
              <div className="flex flex-col flex-grow p-6 text-left">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Pakistan
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b2124] leading-snug mb-6 flex-grow hover:text-[#558b1a] transition-colors duration-200 cursor-pointer">
                  Support for India's elderly homeless
                </h3>
                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src="/IMG01.jpeg" 
                        alt="Author avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-500 text-xs font-medium">Written by Cristofer Bator</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                    <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>3.2 k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Pakistan */}
            <div className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              {/* Date Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-[#6ea124] text-white flex flex-col items-center justify-center w-12 h-12 font-bold select-none">
                <span className="text-[17px] leading-none pt-1">30</span>
                <span className="text-[9px] uppercase tracking-wider leading-none pb-1">Oct</span>
              </div>
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src="/IMG01.jpeg" 
                  alt="Early marriage of girl in Pakistan" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* Card Body */}
              <div className="flex flex-col flex-grow p-6 text-left">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Pakistan
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b2124] leading-snug mb-6 flex-grow hover:text-[#558b1a] transition-colors duration-200 cursor-pointer">
                  Annual rate of early marriage of girls in Pakistan
                </h3>
                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src="/IMG01.jpeg" 
                        alt="Author avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-500 text-xs font-medium">Written by Cristofer Bator</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                    <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>3.2 k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Kenia */}
            <div className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              {/* Date Badge Overlay */}
              <div className="absolute top-4 left-4 z-20 bg-[#6ea124] text-white flex flex-col items-center justify-center w-12 h-12 font-bold select-none">
                <span className="text-[17px] leading-none pt-1">30</span>
                <span className="text-[9px] uppercase tracking-wider leading-none pb-1">Oct</span>
              </div>
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src="/IMG03.jpeg" 
                  alt="Need to donation for drink water" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {/* Card Body */}
              <div className="flex flex-col flex-grow p-6 text-left">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Kenya
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1b2124] leading-snug mb-6 flex-grow hover:text-[#558b1a] transition-colors duration-200 cursor-pointer">
                  Donations needed for clean drinking water
                </h3>
                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src="/IMG01.jpeg" 
                        alt="Author avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-500 text-xs font-medium">Written by Cristofer Bator</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                    <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>3.2 k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROGRAMS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 bg-white border-t border-gray-100">
        {/* Section Heading */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2124] leading-[1.1] tracking-tighter text-center mb-20">
          Our <span className="relative inline-block px-3 py-1 isolate">
            <span className="relative z-10 text-gray-900 font-bold">Programs</span>
            <img 
              src="/stroke.png"
              alt="Brush Stroke highlight"
              className="absolute inset-0 w-full h-[115%] -z-10 scale-x-105 -translate-y-1 select-none pointer-events-none"
            />
          </span>
        </h2>

        {/* Carousel Wrapper */}
        <div className="relative w-full max-w-6xl mx-auto px-12 group">
          {/* Left Arrow Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : programsData.length - visibleItems))}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:border-[#7ccd2d] hover:text-[#7ccd2d] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider Viewport */}
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
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4 flex flex-col items-center text-center"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center mb-6 isolate">
                    {/* Paint blot background */}
                    <div className="absolute inset-0 -z-10 opacity-15 scale-125 select-none pointer-events-none">
                      <svg viewBox="0 0 100 100" fill={program.color} xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 15 C 65 10, 85 20, 90 40 C 95 60, 85 80, 70 85 C 50 90, 30 85, 20 70 C 10 50, 15 25, 30 15 C 40 10, 45 15, 50 15 Z" />
                      </svg>
                    </div>
                    <div className={program.textColor}>
                      {program.icon}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1b2124] leading-tight mb-4 min-h-[56px] flex items-center justify-center">
                    {program.title}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-sm">
                    {program.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev < (programsData.length - visibleItems) ? prev + 1 : 0))}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-600 hover:border-[#7ccd2d] hover:text-[#7ccd2d] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {Array.from({ length: programsData.length - visibleItems + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? "bg-[#7ccd2d] w-6" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="relative w-full text-white overflow-hidden py-24 px-8 lg:px-16 isolate">
        {/* Background Image & Green Multiply Overlay */}
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <Image 
            src="/footer.jpeg" 
            alt="Child reading on water buffalo background" 
            fill 
            className="object-cover object-center"
            priority
          />
          {/* Multiply gradient color overlay using site's dark green theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a05]/92 via-[#16300a]/75 to-[#224810]/60 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between min-h-[460px]">
          {/* Top Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            {/* Column 1: Company */}
            <div className="flex flex-col gap-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company</h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-300">
                <li><a href="#about" className="hover:text-[#7ccd2d] transition-colors duration-200">About Us</a></li>
                <li><a href="#mission" className="hover:text-[#7ccd2d] transition-colors duration-200">Our Mission</a></li>
                <li><a href="#stories" className="hover:text-[#7ccd2d] transition-colors duration-200">Success Stories</a></li>
                <li><a href="#careers" className="hover:text-[#7ccd2d] transition-colors duration-200">Careers</a></li>
              </ul>
            </div>

            {/* Column 2: Get Involved */}
            <div className="flex flex-col gap-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Get Involved</h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-300">
                <li><a href="#volunteer" className="hover:text-[#7ccd2d] transition-colors duration-200">Volunteer</a></li>
                <li><a href="#donate" onClick={(e) => { e.preventDefault(); setIsDonateOpen(true); }} className="hover:text-[#7ccd2d] transition-colors duration-200 cursor-pointer">Donate Now</a></li>
                <li><a href="#partner" className="hover:text-[#7ccd2d] transition-colors duration-200">Partner With Us</a></li>
                <li><a href="#reports" className="hover:text-[#7ccd2d] transition-colors duration-200">Annual Reports</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="flex flex-col gap-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Resources</h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-300">
                <li><a href="#blog" className="hover:text-[#7ccd2d] transition-colors duration-200">Blog</a></li>
                <li><a href="#cases" className="hover:text-[#7ccd2d] transition-colors duration-200">Case Studies</a></li>
                <li><a href="#knowledge" className="hover:text-[#7ccd2d] transition-colors duration-200">Knowledge Center</a></li>
                <li><a href="#contact" className="hover:text-[#7ccd2d] transition-colors duration-200">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div id="contact" className="flex flex-col gap-5 scroll-mt-20">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact Us</h4>
              <ul className="flex flex-col gap-3.5 text-sm text-gray-300">
                <li className="flex items-start gap-2.5">
                  <IconMapPin className="w-5 h-5 text-[#8ac43e] flex-shrink-0 mt-0.5" stroke={0.8} />
                  <span>Spring Plaza, Spibat Road (Off Orji Flyover) Opposite Prof's Avenue, Orji Owerri North Imo State, Nigeria.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <IconPhone className="w-5 h-5 text-[#8ac43e] flex-shrink-0" stroke={0.8} />
                  <a href="tel:+2349033736826" className="hover:text-[#7ccd2d] transition-colors duration-200">+234 903 373 6826</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <IconMail className="w-5 h-5 text-[#8ac43e] flex-shrink-0" stroke={0.8} />
                  <a href="mailto:info@vonf.org" className="hover:text-[#7ccd2d] transition-colors duration-200">info@vonf.org</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Link Row */}
          <div className="flex flex-col items-start text-left mb-16 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Social Media</span>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* X */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Huge watermark "VOF" */}
          <div className="w-full text-center select-none pointer-events-none -mb-8 mt-auto overflow-hidden">
            <span className="font-serif text-[18vw] font-bold text-[#8ac43e]/[0.15] leading-none tracking-tight block">
              VOF
            </span>
          </div>

          {/* Bottom Footer Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center border-t border-white/10 pt-6 text-xs text-gray-400 font-medium w-full">
            <div className="text-center md:text-left mb-3 md:mb-0">
              ©2026 VOF. All Rights Reserved
            </div>
            <div className="text-center mb-3 md:mb-0">
              <a href="#terms" className="hover:text-[#7ccd2d] transition-colors duration-200">Terms & Conditions</a>
            </div>
            <div className="text-center md:text-right">
              <a href="#privacy" className="hover:text-[#7ccd2d] transition-colors duration-200">Privacy & Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Screen-Wide Donation Popup */}
      <AnimatePresence>
        {isDonateOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 backdrop-blur-md p-4 md:p-8"
          >
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsDonateOpen(false)} />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white text-gray-900 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh] md:max-h-[85vh] z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsDonateOpen(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Side: Donation Form (40%) */}
              <div className="w-full md:w-[40%] bg-gradient-to-br from-[#0c1a05] to-[#16300a] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative paint strokes */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <img src="/stroke.png" alt="" className="w-full h-full object-cover scale-150 rotate-45" />
                </div>

                <div className="relative z-10">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-4">
                    Make a <br />
                    <span className="text-[#8ac43e]">Difference</span> Today
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Your contribution directly impacts lives. Select an amount or enter your custom gift below.
                  </p>

                  {/* Amount Selector */}
                  <div className="grid grid-cols-3 gap-2.5 mb-6">
                    {["$10", "$25", "$50", "$100", "$250"].map((amount) => (
                      <button 
                        key={amount}
                        onClick={() => alert(`Selected donation amount: ${amount}`)}
                        className="py-2 rounded-xl border border-white/20 hover:border-[#8ac43e] hover:text-[#8ac43e] transition-colors text-sm font-bold bg-white/5 cursor-pointer"
                      >
                        {amount}
                      </button>
                    ))}
                    <button 
                      onClick={() => {
                        const custom = prompt("Enter custom amount ($):");
                        if (custom && !isNaN(Number(custom))) {
                          alert(`Selected custom donation amount: $${custom}`);
                        }
                      }}
                      className="py-2 rounded-xl border border-white/20 text-sm font-bold bg-white/5 hover:border-white/40 cursor-pointer"
                    >
                      Custom
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#8ac43e] transition-colors text-white"
                    />
                  </div>
                </div>

                {/* Confirm Donation Button */}
                <button 
                  onClick={() => {
                    alert("Thank you for your generous donation! This is a demo transaction.");
                    setIsDonateOpen(false);
                  }}
                  className="relative z-10 w-full py-3 mt-6 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] hover:shadow-lg rounded-full font-bold text-sm tracking-wide transition-all uppercase cursor-pointer"
                >
                  Confirm Donation
                </button>
              </div>

              {/* Right Side: Auto-sliding Projects (60%) */}
              <div className="w-full md:w-[60%] bg-gray-50 flex flex-col justify-between relative overflow-hidden h-[400px] md:h-auto">
                <div 
                  className="flex h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${modalIndex * 100}%)` }}
                >
                  {modalProjects.map((project) => (
                    <div key={project.id} className="w-full flex-shrink-0 flex flex-col h-full">
                      {/* Project Image */}
                      <div className="relative w-full h-44 md:h-56 overflow-hidden flex-shrink-0">
                        <Image 
                          src={project.image} 
                          alt={project.title} 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 bg-[#7ccd2d] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>

                      {/* Project Details */}
                      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                        <div>
                          <h4 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-2 leading-snug">
                            {project.title}
                          </h4>
                          <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4">
                            {project.description}
                          </p>
                        </div>

                        {/* Progress Section */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className="text-gray-500">Raised: <strong className="text-gray-900">{project.raised}</strong></span>
                            <span className="text-[#7ccd2d]">{project.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#558b1a] to-[#8ac43e] rounded-full transition-all duration-500" 
                              style={{ width: `${project.percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Goal: {project.goal}</span>
                            <span>{project.daysLeft} days left</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left/Right Buttons */}
                <button 
                  onClick={() => setModalIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-md transition-colors cursor-pointer"
                  aria-label="Previous project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setModalIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-md transition-colors cursor-pointer"
                  aria-label="Next project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {modalProjects.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setModalIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        modalIndex === idx ? "bg-[#7ccd2d] w-3.5" : "bg-gray-300 hover:bg-gray-400"
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

      {/* Screen-Wide Projects Showcase Popup */}
      <AnimatePresence>
        {isProjectsPopupOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#081103]/85 backdrop-blur-md p-4 md:p-8"
          >
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsProjectsPopupOpen(false)} />

            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white text-gray-900 rounded-3xl w-full max-w-5xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(124,205,45,0.35)] flex flex-col md:flex-row h-auto max-h-[90vh] md:max-h-[80vh] z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsProjectsPopupOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Sliding Carousel (100% width, split inside each slide) */}
              <div 
                onMouseEnter={() => setIsPopupHovered(true)}
                onMouseLeave={() => setIsPopupHovered(false)}
                className="w-full relative overflow-hidden h-[500px] md:h-[550px]"
              >
                <div 
                  className="flex h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${popupProjectIndex * 100}%)` }}
                >
                  {modalProjects.map((project) => (
                    <div key={project.id} className="w-full flex-shrink-0 flex flex-col md:flex-row h-full">
                      {/* Left: Image (55%) */}
                      <div className="relative w-full md:w-[55%] h-[45%] md:h-full overflow-hidden">
                        <Image 
                          src={project.image} 
                          alt={project.title} 
                          fill 
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-950/40 to-transparent" />
                        <span className="absolute top-6 left-6 bg-[#7ccd2d] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                          {project.category}
                        </span>
                      </div>

                      {/* Right: Project details & call-to-action (45%) */}
                      <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-between h-[55%] md:h-full bg-gray-50 text-left border-l border-gray-100">
                        <div>
                          <span className="text-[#7ccd2d] text-xs font-bold uppercase tracking-widest block mb-2">Active Campaign</span>
                          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                            {project.title}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            {project.description}
                          </p>
                        </div>

                        {/* Progress and Actions */}
                        <div>
                          {/* Progress Tracker */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between text-xs font-semibold mb-2">
                              <span className="text-gray-500">Raised: <strong className="text-gray-950">{project.raised}</strong></span>
                              <span className="text-[#7ccd2d]">{project.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#558b1a] to-[#8ac43e] rounded-full transition-all duration-500" 
                                style={{ width: `${project.percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Goal: {project.goal}</span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {project.daysLeft} days left
                              </span>
                            </div>
                          </div>

                          {/* Action Button Row */}
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => {
                                setIsProjectsPopupOpen(false);
                                setIsDonateOpen(true);
                              }}
                              className="px-8 py-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-lg transition-all duration-200 text-sm tracking-wide cursor-pointer"
                            >
                              Donate Now
                            </button>
                            <button 
                              onClick={() => setIsProjectsPopupOpen(false)}
                              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors text-sm font-semibold cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left/Right arrow navigation */}
                <button 
                  onClick={() => setPopupProjectIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                  className="absolute left-4 top-[22.5%] md:top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-gray-700 shadow-lg hover:text-[#7ccd2d] transition-all cursor-pointer z-20"
                  aria-label="Previous project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setPopupProjectIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="absolute right-4 top-[22.5%] md:top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-gray-700 shadow-lg hover:text-[#7ccd2d] transition-all cursor-pointer z-20"
                  aria-label="Next project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Carousel dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {modalProjects.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setPopupProjectIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        popupProjectIndex === idx ? "bg-[#7ccd2d] w-5" : "bg-white/50 hover:bg-white/80"
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
