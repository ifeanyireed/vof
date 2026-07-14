"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Custom SVG Logo to match the screenshot precisely
const Logo = () => (
  <div className="flex items-center gap-2">
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left green bar */}
      <path d="M6 6H12V26H6V6Z" fill="#7ccd2d" />
      {/* Right black outline */}
      <path d="M12 6H26V26H12V23H23V9H12V6Z" fill="#1b2124" />
    </svg>
    <span className="text-2xl font-bold text-[#1b2124] tracking-tight">Zikuji</span>
  </div>
);

// Dry-brush highlight background effect for the word "Change"
const BrushStroke = () => (
  <span className="relative inline-block px-4 py-1">
    <span className="relative z-10 text-gray-900">Change</span>
    <svg 
      className="absolute inset-0 w-full h-full -z-10 scale-y-125 scale-x-110 translate-y-1"
      viewBox="0 0 160 45" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path 
        d="M6 24C35 18 85 14 154 20C142 27 92 31 16 28C10 27 7 25 6 24Z" 
        fill="#fbbf24" 
      />
      <path 
        d="M12 20C50 16.5 95 15 150 18.5C135 24 88 26.5 24 23.5C16 23 13 21.5 12 20Z" 
        fill="#f59e0b" 
      />
      <path 
        d="M20 26C60 23.5 100 22 140 24.5" 
        stroke="#d97706" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeDasharray="4 8"
      />
    </svg>
  </span>
);

export default function Home() {
  const navItems = ["About", "Project", "Event", "Pages", "Contact"];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 overflow-x-hidden">
      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-gray-50">
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
              href={`#${item.toLowerCase()}`} 
              className="text-gray-600 hover:text-[#7ccd2d] font-semibold transition-colors duration-200 text-[15px]"
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
          <button className="px-7 py-2.5 bg-[#7ccd2d] text-white font-bold rounded-full hover:bg-[#6cb226] hover:shadow-lg transition-all duration-200 text-sm cursor-pointer">
            Sign Up
          </button>
          <button className="px-7 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-lg transition-all duration-200 text-sm cursor-pointer">
            Log In
          </button>
        </motion.div>
      </header>

      {/* HERO SECTION */}
      <main className="w-full max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 flex flex-col items-center text-center">
        {/* Main Headline */}
        <motion.h1 
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1b2124] leading-tight max-w-4xl tracking-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Need Small Help For <BrushStroke /> <br className="hidden sm:inline" /> The World
        </motion.h1>

        {/* Primary CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button className="px-9 py-4.5 bg-[#7ccd2d] text-white font-bold rounded-full hover:bg-[#6cb226] hover:shadow-xl transition-all duration-250 text-base tracking-wide min-w-[180px] cursor-pointer">
            All Project
          </button>
          <button className="px-9 py-4.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 hover:shadow-xl transition-all duration-250 text-base tracking-wide min-w-[180px] cursor-pointer">
            Donate Now
          </button>
        </motion.div>

        {/* Hero Image (World Map Mask) */}
        <motion.div 
          className="w-full max-w-5xl px-4 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-full aspect-[4/3] max-h-[550px] flex justify-center items-center">
            <Image
              src="/hero.jpeg"
              alt="World Map mask showing a child and a woman crafting pottery"
              fill
              className="object-contain select-none"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
