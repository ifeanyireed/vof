"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogs";
import { IconArrowLeft, IconArrowRight, IconCalendar, IconUser, IconSparkles } from "@tabler/icons-react";

export default function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full px-6 lg:px-16 py-4 flex items-center justify-between border-b border-gray-100 shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.webp"
            alt="Veronica Onyeneke Foundation Logo"
            width={180}
            height={50}
            className="object-contain h-12 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#558b1a] transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/financial-reports"
            className="hidden sm:inline-flex text-xs font-bold text-gray-700 hover:text-[#558b1a] transition-colors"
          >
            Financial Reports
          </Link>
          <Link
            href="/#donate"
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs"
          >
            Donate
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4faec] border border-[#d6f0b0] text-[#4d7f16] text-xs font-bold uppercase tracking-wider mb-4">
            <IconSparkles className="w-3.5 h-3.5" />
            <span>Official Announcements & Impact Stories</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1b2124] leading-tight mb-4">
            VOF News & <span className="text-[#558b1a]">Stories</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Read updates from our vocational training cohorts, academic scholarships, community outreaches, and institutional governance reports.
          </p>
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
              className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-4 left-4 bg-[#558b1a] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-7 flex flex-col flex-grow text-left">
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-semibold mb-3">
                  <span className="flex items-center gap-1">
                    <IconCalendar className="w-3.5 h-3.5 text-[#558b1a]" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconUser className="w-3.5 h-3.5 text-gray-400" />
                    {post.author}
                  </span>
                </div>

                <h2 className="font-serif text-xl font-bold text-gray-900 leading-snug mb-3 hover:text-[#558b1a] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#558b1a] hover:underline"
                  >
                    <span>Read Full Story</span>
                    <IconArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 px-6 border-t border-gray-100 bg-[#fbfdf9] text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.</p>
        <p className="mt-1">Empowering Lives. Restoring Hope. Creating Opportunities.</p>
      </footer>
    </div>
  );
}
