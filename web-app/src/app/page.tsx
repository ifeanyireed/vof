"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Custom SVG Icons to avoid dependency version conflicts
const TreeIcon = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L4 10h5v4H4l8 7 8-7h-5v-4h5z" />
  </svg>
);

const ArrowUpRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

import { IconLeaf, IconFileText, IconCalendar } from "@tabler/icons-react";

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function VofPage() {
  const [activeTab, setActiveTab] = useState("Home");
  const navItems = ["Home", "Easements", "Grants", "Reserves", "About Us"];

  const [activePreserve, setActivePreserve] = useState(0);
  const preserves = [
    {
      title: "Bull Run Mountains",
      location: "Fauquier & Prince William Counties",
      description: "A 2,500-acre natural area preserve featuring unique quartzite cliffs, mature hardwood forests, and over 15 miles of public hiking trails.",
      acres: "2,500+ Acres",
      videoSrc: "/IMG_4057.MP4"
    },
    {
      title: "Cove Mountain",
      location: "Roanoke County",
      description: "Safeguards crucial wildlife corridors and forested ridges along the Appalachian Trail, protecting regional water quality and scenic views.",
      acres: "1,200+ Acres",
      videoSrc: "/IMG_4057.MP4"
    },
    {
      title: "Crow's Nest",
      location: "Stafford County",
      description: "A pristine wilderness of hardwood forest and tidal marshes along the Potomac River, supporting nesting bald eagles.",
      acres: "3,000+ Acres",
      videoSrc: "/IMG_4057.MP4"
    },
    {
      title: "Shenandoah River",
      location: "Warren County",
      description: "Protects scenic riverfront property, floodplain forests, and vital habitat along the legendary Shenandoah River.",
      acres: "950+ Acres",
      videoSrc: "/IMG_4057.MP4"
    },
    {
      title: "Wildcat Mountain",
      location: "Fauquier County",
      description: "A rugged, forested ridge offering high-quality wildlife habitat, clean water resources, and spectacular Piedmont views.",
      acres: "800+ Acres",
      videoSrc: "/IMG_4057.MP4"
    }
  ];

  return (
    <div className="min-h-screen bg-[#001f19] text-white font-sans antialiased overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: "url('/hero.jpeg')",
            backgroundPosition: "center 35%"
          }}
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f19]/40 via-[#001f19]/20 to-[#001f19] z-0" />
        <div className="absolute inset-0 bg-[#001f19]/15 z-0" />

        {/* HEADER */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center">
              <TreeIcon />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">VOF</span>
          </div>
          
          {/* Glassmorphic Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-black/15 backdrop-blur-xl border border-white/10 rounded-full p-1.5">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  activeTab === item 
                    ? "bg-white text-black shadow-sm" 
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          
          {/* CTA Button */}
          <button className="bg-white text-black font-semibold text-xs px-5 py-3 rounded-full flex items-center gap-1.5 shadow-md hover:bg-white/90 active:scale-95 transition-all duration-300">
            Donate
            <ArrowUpRightIcon className="w-3 h-3" />
          </button>
        </header>

        {/* MAIN HERO CONTENT */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-16 flex-1 flex flex-col justify-between relative z-10">
          
          {/* Top text block */}
          <div className="max-w-4xl">
            {/* Cultivating badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-black/35 backdrop-blur-md border border-white/10 text-white/90 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff89]"></span>
              Celebrating 60 years . 1966 - 2026
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-[80px] font-medium text-white tracking-tight leading-[1.02] max-w-4xl"
            >
              Protecting Virginia's <br />
              Open Spaces
            </motion.h1>
          </div>

          {/* Lower layout row (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mt-16 md:mt-24">
            
            {/* Left side Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-1 md:col-span-4 lg:col-span-3"
            >
              <div className="bg-black/25 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-white/20 hover:bg-black/30 transition-all duration-500">
                <div className="overflow-hidden rounded-xl aspect-[4/3] relative">
                  <img 
                    src="/hero-sub-image.jpeg" 
                    alt="Virginia landscapes" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-white text-sm font-medium mt-3.5 mb-2 tracking-tight">
                  Over 934,000 Acres Protected
                </h3>
                <div className="w-full h-[0.5px] bg-white/10 my-2.5" />
                <div className="flex justify-between items-center text-xs text-white/70">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">107</span>
                    <span className="text-white/40 font-normal">Counties & Cities</span>
                  </div>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 text-white/80" />
                </div>
              </div>
            </motion.div>

            {/* Empty center spacing */}
            <div className="hidden md:block md:col-span-3 lg:col-span-5" />

            {/* Right side Text, Button, and Funding Alert */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-1 md:col-span-5 lg:col-span-4 flex flex-col items-start md:items-end text-left md:text-right"
            >
              {/* Funding Alert Card */}
              <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] mb-6">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#00ff89]/15 flex items-center justify-center text-[#00ff89] flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-1">Funding Available</h4>
                    <p className="text-white/70 text-[11px] leading-relaxed mb-2.5">
                      Grants are available to help protect Virginia’s most important lands and resources.
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-[#00ff89]/10 text-[#00ff89] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Due July 29, 2026
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-sm font-normal leading-relaxed mb-6 max-w-sm md:max-w-md">
                We safeguard the natural beauty, history, and ecological integrity of the Commonwealth. Together, we preserve forests, working farms, waterways, and cultural sites in perpetuity.
              </p>
              <button className="bg-white text-black font-semibold text-xs px-6 py-3.5 rounded-full flex items-center gap-2 shadow-lg hover:bg-white/95 hover:shadow-xl active:scale-95 transition-all duration-300">
                Explore Grants
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
            
          </div>

          {/* HERO STATS SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 border-t border-white/10 pt-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              
              {/* Stat 1 */}
              <div className="text-left">
                <p className="text-4xl md:text-5xl font-semibold text-white tracking-tight">934,000</p>
                <p className="text-white/45 text-[11px] mt-2 font-medium uppercase tracking-wider leading-relaxed">
                  Acres in Virginia protected
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-left">
                <p className="text-4xl md:text-5xl font-semibold text-white tracking-tight">4,000</p>
                <p className="text-white/45 text-[11px] mt-2 font-medium uppercase tracking-wider leading-relaxed">
                  Miles of rivers and streams
                </p>
              </div>

              {/* Stat 3 */}
              <div className="text-left">
                <p className="text-4xl md:text-5xl font-semibold text-white tracking-tight">150</p>
                <p className="text-white/45 text-[11px] mt-2 font-medium uppercase tracking-wider leading-relaxed">
                  Miles of hiking & biking trails
                </p>
              </div>

              {/* Stat 4 */}
              <div className="text-left">
                <p className="text-4xl md:text-5xl font-semibold text-white tracking-tight">2</p>
                <p className="text-white/45 text-[11px] mt-2 font-medium uppercase tracking-wider leading-relaxed">
                  Acres conserved every hour since 1966
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* CONTINUATION SECTION */}
      <section className="bg-[#001f19] text-white py-36 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] md:leading-[1.1]"
          >
            <span className="text-white">Preserving the Commonwealth's natural legacy </span>
            <span className="text-white/30">to foster thriving ecosystems, working lands, and community spaces for generations to come.</span>
          </motion.h2>
        </div>

        {/* QUICK ACTIONS (WIREFRAME) */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Protect Your Land */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <a 
                href="#" 
                className="group block h-full relative bg-[#001712]/30 backdrop-blur-xl border border-white/5 rounded-[28px] p-8 md:p-10 text-center hover:border-[#00ff89]/20 hover:bg-[#001712]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"
              >
                <div className="absolute top-6 right-6 text-white/30 group-hover:text-[#00ff89] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowUpRightIcon className="w-4.5 h-4.5" />
                </div>
                <div className="w-16 h-16 rounded-full border border-[#5b7045]/45 bg-[#5b7045]/10 flex items-center justify-center text-[#a4c68e] mb-6 mx-auto group-hover:scale-110 group-hover:bg-[#5b7045]/20 group-hover:border-[#5b7045]/70 transition-all duration-300 shadow-[0_0_15px_rgba(91,112,69,0.1)]">
                  <IconLeaf className="w-7 h-7" stroke={1.8} />
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-3.5 tracking-tight group-hover:text-[#00ff89] transition-colors">
                  Protect Your Land
                </h3>
                <p className="text-white/60 text-[13px] leading-relaxed max-w-xs mx-auto group-hover:text-white/80 transition-colors">
                  Start here if you have open space you would like to protect.
                </p>
              </a>
            </motion.div>

            {/* Card 2: Grant Portal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <a 
                href="#" 
                className="group block h-full relative bg-[#001712]/30 backdrop-blur-xl border border-white/5 rounded-[28px] p-8 md:p-10 text-center hover:border-[#00ff89]/20 hover:bg-[#001712]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"
              >
                <div className="absolute top-6 right-6 text-white/30 group-hover:text-[#00ff89] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowUpRightIcon className="w-4.5 h-4.5" />
                </div>
                <div className="w-16 h-16 rounded-full border border-[#5b7045]/45 bg-[#5b7045]/10 flex items-center justify-center text-[#a4c68e] mb-6 mx-auto group-hover:scale-110 group-hover:bg-[#5b7045]/20 group-hover:border-[#5b7045]/70 transition-all duration-300 shadow-[0_0_15px_rgba(91,112,69,0.1)]">
                  <IconFileText className="w-7 h-7" stroke={1.8} />
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-3.5 tracking-tight group-hover:text-[#00ff89] transition-colors">
                  Grant Portal
                </h3>
                <p className="text-white/60 text-[13px] leading-relaxed max-w-xs mx-auto group-hover:text-white/80 transition-colors">
                  Start a new grant application or check the status of an existing one.
                </p>
              </a>
            </motion.div>

            {/* Card 3: Board Meetings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <a 
                href="#" 
                className="group block h-full relative bg-[#001712]/30 backdrop-blur-xl border border-white/5 rounded-[28px] p-8 md:p-10 text-center hover:border-[#00ff89]/20 hover:bg-[#001712]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]"
              >
                <div className="absolute top-6 right-6 text-white/30 group-hover:text-[#00ff89] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowUpRightIcon className="w-4.5 h-4.5" />
                </div>
                <div className="w-16 h-16 rounded-full border border-[#5b7045]/45 bg-[#5b7045]/10 flex items-center justify-center text-[#a4c68e] mb-6 mx-auto group-hover:scale-110 group-hover:bg-[#5b7045]/20 group-hover:border-[#5b7045]/70 transition-all duration-300 shadow-[0_0_15px_rgba(91,112,69,0.1)]">
                  <IconCalendar className="w-7 h-7" stroke={1.8} />
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-3.5 tracking-tight group-hover:text-[#00ff89] transition-colors">
                  Board Meetings
                </h3>
                <p className="text-white/60 text-[13px] leading-relaxed max-w-xs mx-auto group-hover:text-white/80 transition-colors">
                  See the dates and locations of upcoming Board meetings.
                </p>
              </a>
            </motion.div>

          </div>
        </div>

        {/* CARDS CONTAINER */}
        <div className="max-w-5xl mx-auto mt-28 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch text-left">
          
          {/* Left Card - Video Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-7 bg-[#001712]/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-5 flex flex-col justify-between min-h-[340px] relative group"
          >
            <div className="flex flex-col sm:flex-row gap-5 h-full">
              {/* Video column */}
              <div className="w-full sm:w-[65%] flex flex-col gap-4">
                <div className="relative aspect-[4/3] sm:flex-1 rounded-2xl overflow-hidden bg-black/45">
                  <video 
                    src="/IMG_4057.MP4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-4 h-4 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Bottom left plus */}
                <div className="text-white/40 text-lg font-light mt-1 pl-1 select-none">
                  ＋
                </div>
              </div>
              
              {/* Info column */}
              <div className="flex-1 flex flex-col justify-between sm:text-right text-left">
                <div className="flex justify-end">
                  <ArrowUpRightIcon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </div>
                <div className="mt-auto sm:pb-8">
                  <p className="text-white text-sm font-semibold tracking-tight">Joe Villari</p>
                  <p className="text-white/40 text-[11px] mt-0.5">Preserve Manager, Bull Run Mountains</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Card - Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-1 md:col-span-5 bg-[#001712]/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 flex flex-col justify-between min-h-[340px]"
          >
            {/* Stars */}
            <div className="flex gap-0.5 text-[#F59E0B]">
              <StarIcon className="w-3.5 h-3.5 fill-current" />
              <StarIcon className="w-3.5 h-3.5 fill-current" />
              <StarIcon className="w-3.5 h-3.5 fill-current" />
              <StarIcon className="w-3.5 h-3.5 fill-current" />
              <StarIcon className="w-3.5 h-3.5 fill-current" />
            </div>

            {/* Quote */}
            <p className="text-white/90 text-sm md:text-base font-normal leading-relaxed my-6">
              "Returning to the river and protecting our ancestral lands creates a legacy of stewardship for generations to come. VOF is a vital partner in this journey."
            </p>

            {/* Profile Row */}
            <div className="bg-white/5 border border-white/5 rounded-[20px] p-2 flex items-center gap-3 mt-auto">
              <img src="/esther-howard.png" alt="Chief Anne Richardson" className="w-14 h-14 rounded-md object-cover" />
              <div>
                <p className="text-white text-sm font-semibold tracking-tight">Chief Anne Richardson</p>
                <p className="text-white/40 text-[11px] mt-0.5">Rappahannock Tribe of Virginia</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* NEWS SUBSECTION */}
        <div className="max-w-5xl mx-auto mt-32 border-t border-white/5 pt-32">
          
          <span className="text-[#00ff89] text-[11px] font-semibold tracking-wider uppercase mb-3 block text-center">Updates & Stories</span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-16 text-center">
            News
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Blog Post 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#" className="group block h-full bg-[#001712]/30 backdrop-blur-xl border border-white/5 rounded-[28px] overflow-hidden hover:border-[#00ff89]/20 hover:bg-[#001712]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                  <img 
                    src="/farm1.jpeg" 
                    alt="Albemarle County Forests" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 text-left">
                  <div>
                    <span className="text-[#00ff89] text-[10px] font-bold tracking-wider uppercase">
                      Conservation • July 10, 2026
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold text-white mt-3 mb-2.5 leading-snug group-hover:text-[#00ff89] transition-colors">
                      Albemarle County Forests Protected in Perpetuity
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      A newly signed 420-acre easement safeguards vital mountain watersheds, mature hardwood forests, and regional scenic views.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/80 group-hover:text-[#00ff89] transition-colors mt-6">
                    Read Article
                    <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Blog Post 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#" className="group block h-full bg-[#001712]/30 backdrop-blur-xl border border-white/5 rounded-[28px] overflow-hidden hover:border-[#00ff89]/20 hover:bg-[#001712]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                  <img 
                    src="/farm2.jpeg" 
                    alt="GO Fund Green Spaces" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 text-left">
                  <div>
                    <span className="text-[#00ff89] text-[10px] font-bold tracking-wider uppercase">
                      Community • June 28, 2026
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold text-white mt-3 mb-2.5 leading-snug group-hover:text-[#00ff89] transition-colors">
                      GO Fund Backs Six New Urban Green Spaces
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Grants will support municipal parks, community gardens, and educational trails in historically underserved urban neighborhoods.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/80 group-hover:text-[#00ff89] transition-colors mt-6">
                    Read Article
                    <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            </motion.div>

            {/* Blog Post 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#" className="group block h-full bg-[#001712]/30 backdrop-blur-xl border border-white/5 rounded-[28px] overflow-hidden hover:border-[#00ff89]/20 hover:bg-[#001712]/50 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                  <img 
                    src="/farm3.jpeg" 
                    alt="Ecological Research Permits" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 text-left">
                  <div>
                    <span className="text-[#00ff89] text-[10px] font-bold tracking-wider uppercase">
                      Science • June 15, 2026
                    </span>
                    <h3 className="text-lg md:text-xl font-semibold text-white mt-3 mb-2.5 leading-snug group-hover:text-[#00ff89] transition-colors">
                      Ecological Research Permits Now Available
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Applications are open for researchers wishing to conduct environmental studies at our Bull Run Mountains state preserve.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/80 group-hover:text-[#00ff89] transition-colors mt-6">
                    Read Article
                    <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-[#001f19] py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Row 1 Left: Image 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] overflow-hidden h-[360px] bg-black/30"
            >
              <img src="/farm4.jpeg" alt="Open-Space Easements" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Row 1 Right: Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#001b15]/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-12 flex flex-col justify-between min-h-[360px] relative overflow-hidden group text-center"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.2),transparent)]" />
              
              <div className="my-auto">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
                  Open-Space <br /> Easements
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                  We work with private landowners to place permanent open-space easements on their properties, protecting farms, forests, and historic sites from development in perpetuity.
                </p>
              </div>

              <button className="bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 mx-auto group-hover:bg-white group-hover:text-black transition-all duration-300">
                Learn about easements
                <ArrowUpRightIcon className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Row 2 Left: Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#001b15]/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-12 flex flex-col justify-between min-h-[360px] relative overflow-hidden group text-center md:order-none order-2"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.2),transparent)]" />

              <div className="my-auto">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
                  Preservation <br /> Trust Fund
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                  Providing critical grant funding for land acquisitions, easements, and public access projects that protect farming, forestry, wildlife habitat, and water quality.
                </p>
              </div>

              <button className="bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 mx-auto group-hover:bg-white group-hover:text-black transition-all duration-300">
                Apply for funding
                <ArrowUpRightIcon className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Row 2 Right: Image 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] overflow-hidden h-[360px] bg-black/30 md:order-none order-1"
            >
              <img src="/farm5.jpeg" alt="Preservation Trust Fund" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Row 3 Left: Image 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] overflow-hidden h-[360px] bg-black/30"
            >
              <img src="/farm6.jpeg" alt="Get Outdoors Fund" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Row 3 Right: Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#001b15]/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 md:p-12 flex flex-col justify-between min-h-[360px] relative overflow-hidden group text-center"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.2),transparent)]" />

              <div className="my-auto">
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
                  Get Outdoors <br /> (GO) Fund
                </h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                  Supporting community projects that increase safe access to open space, funding trails, parks, community gardens, and nature-based education in underserved areas.
                </p>
              </div>

              <button className="bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-1.5 mx-auto group-hover:bg-white group-hover:text-black transition-all duration-300">
                View GO projects
                <ArrowUpRightIcon className="w-3 h-3" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* VIDEO CAROUSEL SECTION */}
      <section className="bg-[#001f19] py-36 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#00ff89] text-[11px] font-semibold tracking-wider uppercase mb-3 block text-center">Virtual Tours</span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-16 text-center">
            Explore Our Preserves
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Video Player (7 cols) */}
            <div className="col-span-1 lg:col-span-7 flex flex-col justify-between">
              <div className="relative rounded-[28px] overflow-hidden bg-black/45 border border-white/10 aspect-[16/9] shadow-2xl flex-1 flex items-center justify-center">
                <video 
                  key={activePreserve} // reload video on index change
                  src={preserves[activePreserve].videoSrc}
                  controls
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Carousel navigation controls below video */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActivePreserve((prev) => (prev === 0 ? preserves.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full bg-[#001712] border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:border-[#00ff89]/40 transition-all active:scale-95 shadow-md"
                    aria-label="Previous Preserve"
                  >
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  </button>
                  <button 
                    onClick={() => setActivePreserve((prev) => (prev === preserves.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-full bg-[#001712] border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:border-[#00ff89]/40 transition-all active:scale-95 shadow-md"
                    aria-label="Next Preserve"
                  >
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                </div>

                {/* Info status indicator text */}
                <span className="text-white/40 text-xs font-medium">
                  Preserve {activePreserve + 1} of {preserves.length}
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Selector List of 5 Preserves (5 cols) */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-3 justify-center">
              {preserves.map((preserve, index) => (
                <button
                  key={index}
                  onClick={() => setActivePreserve(index)}
                  className={`w-full text-left p-5 rounded-[22px] border transition-all duration-300 flex flex-col ${
                    activePreserve === index
                      ? "bg-[#001712] border-[#00ff89]/30 text-white shadow-[0_4px_20px_rgba(0,255,137,0.08)]"
                      : "bg-[#001712]/10 border-white/5 text-white/50 hover:text-white/80 hover:bg-[#001712]/30 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${activePreserve === index ? "text-[#00ff89]" : "text-white/30"}`}>
                      {preserve.acres}
                    </span>
                    {activePreserve === index && (
                      <span className="text-[#00ff89] text-[10px] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff89] animate-pulse" />
                        Viewing
                      </span>
                    )}
                  </div>
                  <h4 className={`text-base font-semibold mt-1 tracking-tight ${activePreserve === index ? "text-white" : "text-white/80"}`}>
                    {preserve.title}
                  </h4>
                  {activePreserve === index && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/60 text-xs mt-2.5 leading-relaxed">
                        {preserve.description}
                      </p>
                      <span className="text-[#00ff89] text-[10px] font-semibold mt-3.5 inline-flex items-center gap-1">
                        Watch video tour 
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-[#001f19] text-white pt-24 pb-0 relative z-10 border-t border-white/5">
        
        {/* Top Part: Newsletter & Contact info */}
        <div className="max-w-5xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-start">
            
            {/* Left side: Heading and Newsletter */}
            <div className="col-span-1 lg:col-span-6 flex flex-col justify-between h-full">
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.15] text-white mb-8 text-left">
                Preserving Virginia's <br />
                Heritage Together
              </h2>
              
              {/* Newsletter form */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1.5 max-w-md w-full">
                <div className="flex items-center gap-2 pl-3 flex-1">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input 
                    type="email" 
                    placeholder="Your Email Address" 
                    className="bg-transparent text-white text-xs focus:outline-none w-full placeholder-white/30"
                  />
                </div>
                <button className="bg-white text-black text-xs font-semibold px-6 py-3 rounded-full hover:bg-white/90 active:scale-95 transition-all">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Right side: Contact Details */}
            <div className="col-span-1 lg:col-span-6 lg:pl-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 text-left">
                <div>
                  <span className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-wider">Location</span>
                  <p className="text-white/80 text-[13px] leading-relaxed">
                    Virginia Outdoors Foundation<br />
                    39 Garrett St., Suite 200<br />
                    Warrenton, VA 20186
                  </p>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-wider">Call Us</span>
                  <p className="text-white/80 text-[13px] leading-relaxed">
                    844-863-9800
                  </p>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-wider">Email</span>
                  <p className="text-white/80 text-[13px] leading-relaxed">
                    info@vof.org
                  </p>
                </div>
                <div>
                  <span className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-wider">Office Hours</span>
                  <p className="text-white/80 text-[13px] leading-relaxed">
                    09:00 AM - 05:00 PM (Mon-Fri)
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LOWER FOOTER BANNER (Full width background image) */}
        <div className="relative min-h-[880px] w-full border-t border-white/10 flex flex-col justify-between mt-12 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: "url('/footer.jpeg')" }}
          />
          {/* Overlay for smooth transition from solid green top section into image transparency */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#001f19] via-[#001f19]/15 to-[#000a08]/95 z-0" />
          
          {/* Content wrapper full-width */}
          <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 py-20 flex flex-col justify-between flex-1">
            {/* Navigation columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              {/* Programs */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-5">Programs</h4>
                <ul className="space-y-3 text-[13px] text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Easements</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Preservation Trust Fund</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Get Outdoors Fund</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Land Stewardship</a></li>
                </ul>
              </div>
              
              {/* Reserves */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-5">Reserves</h4>
                <ul className="space-y-3 text-[13px] text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Bull Run Mountains</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Owned Lands</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Research Permits</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Public Access</a></li>
                </ul>
              </div>

              {/* Spacer for layout */}
              <div className="hidden md:block" />

              {/* Resources */}
              <div>
                <h4 className="text-white font-semibold text-sm mb-5">Resources</h4>
                <ul className="space-y-3 text-[13px] text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">News & Stories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Document Library</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Staff Directory</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Area (Socials, Giant Text, Copyright) */}
            <div className="mt-auto pt-16 flex flex-col gap-6 text-left">
              
              {/* Social Media Column */}
              <div className="flex flex-col gap-3.5 items-start">
                <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">Social Media</span>
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 text-white/80 hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 text-white/80 hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 text-white/80 hover:text-white transition-all duration-300">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 text-white/80 hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.022-1.074-1.824-2.096-2.096C19.558 3.5 12 3.5 12 3.5s-7.558 0-9.402.567C1.576 4.339.774 5.141.502 6.163.003 8.007 0 12 0 12s.003 3.993.502 5.837c.272 1.022 1.074 1.824 2.096 2.096C4.442 20.5 12 20.5 12 20.5s7.558 0 9.402-.567c1.022-.272 1.824-1.074 2.096-2.096.5-1.844.502-5.837.502-5.837s-.002-3.993-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
              </div>

              {/* Giant VOF text outline */}
              <div className="w-full text-center pointer-events-none select-none my-2">
                <span className="text-[13vw] font-bold text-white/[0.04] tracking-widest leading-normal block mt-4 select-none">
                  VOF
                </span>
              </div>

              {/* Divider & Copyright base */}
              <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-white/40 gap-4">
                <p>© 2026 Virginia Outdoors Foundation. All Rights Reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
