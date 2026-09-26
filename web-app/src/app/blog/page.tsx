"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts } from "@/data/blogs";
import { IconArrowLeft, IconArrowRight, IconCalendar, IconUser, IconSparkles, IconMenu2, IconX } from "@tabler/icons-react";
import Footer from "@/components/Footer";

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === selectedCategory);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog", active: true },
    { label: "Support & FAQs", href: "/support" }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-3.5 flex items-center justify-between border-b border-gray-100 shadow-xs transition-all">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
            alt="Veronica Onyeneke Foundation Logo"
            width={180}
            height={50}
            className="object-contain h-12 w-auto"
            priority
          />
        </Link>

        {/* Clean Desktop Navigation (External Pages Only) */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-semibold transition-colors duration-200 text-xs xl:text-[13px] 2xl:text-sm whitespace-nowrap ${
                item.active
                  ? "text-[#558b1a] font-bold"
                  : "text-gray-700 hover:text-[#558b1a]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#donate"
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs"
          >
            Donate
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#558b1a] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-3 shadow-sm sticky top-[73px] z-40"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#4d7f16] text-xs font-bold uppercase tracking-wider mb-4"
          >
            <IconSparkles className="w-3.5 h-3.5" />
            <span>Official Announcements & Impact Stories</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1b2124] leading-tight mb-4"
          >
            VOF News & <span className="text-[#558b1a]">Stories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
          >
            Read updates from our vocational training cohorts, academic scholarships, community outreaches, and institutional governance reports.
          </motion.p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#558b1a] text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image with Green Date Badge */}
              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Top-Left Green Date Badge */}
                <div className="absolute top-3 left-3 bg-[#65a324] text-white px-3 py-2 flex flex-col items-center justify-center font-bold shadow-md z-10">
                  <span className="text-base font-extrabold leading-tight">{post.day || "30"}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{post.month || "OCT"}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between text-left">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2.5 block">
                    {post.region || post.category}
                  </span>

                  <h2 className="font-bold text-gray-900 text-lg sm:text-xl leading-snug mb-4 hover:text-[#558b1a] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Bottom Author & Likes Row */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200">
                      <Image
                        src={post.authorAvatar || "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg"}
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
            </motion.div>
          ))}
        </div>
      </main>

      {/* SHARED FOOTER */}
      <Footer />
    </div>
  );
}
