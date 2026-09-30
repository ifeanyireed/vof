"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api, BlogItem } from "@/lib/api";
import {
  IconSparkles,
  IconMenu2,
  IconX,
  IconTag,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react";
import Footer from "@/components/Footer";

const POSTS_PER_PAGE = 9;

export default function BlogListingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([
    { name: "All", count: 0 },
  ]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [liveBlogs] = await Promise.allSettled([
          api.getBlogs('published'),
        ]);

        let loadedBlogs: any[] = [];
        if (liveBlogs.status === 'fulfilled' && Array.isArray(liveBlogs.value)) {
          loadedBlogs = liveBlogs.value;
        }

        if (loadedBlogs.length > 0) {
          const normalized = loadedBlogs.map((b: BlogItem) => {
            let img = (b.imageUrl || "").trim();
            if (!img || img.includes("vonf.org")) {
              img = "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg";
            }
            let avatar = (b.authorAvatar || "").trim();
            if (!avatar || avatar.includes("vonf.org")) {
              avatar = "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg";
            }
            return {
              id: b.id,
              slug: b.slug,
              title: b.title,
              excerpt: b.excerpt,
              content: b.content,
              category: b.category,
              region: b.region,
              image: img,
              author: b.authorName || "VOF Team",
              authorAvatar: avatar,
              readTime: b.readTime || "4 min read",
              date: b.dateDisplay || `${b.day || "28"} ${b.month || "SEP"}`,
              day: b.day || "28",
              month: b.month || "SEP",
              likes:
                b.likes > 999
                  ? `${(b.likes / 1000).toFixed(1)} k`
                  : String(b.likes || 0),
              tags: Array.isArray(b.tags) ? b.tags : [],
            };
          });
          setPosts(normalized);

          // Build categories list STRICTLY for categories that have content (>0 posts)
          const catCountMap = new Map<string, number>();
          normalized.forEach((b) => {
            const cat = (b.category || '').trim();
            if (cat) {
              catCountMap.set(cat, (catCountMap.get(cat) || 0) + 1);
            }
          });

          const activeCategories = Array.from(catCountMap.entries())
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]) // highest count first
            .map(([name, count]) => ({ name, count }));

          setCategories([{ name: "All", count: normalized.length }, ...activeCategories]);

          // Extract ONLY tags that have at least 1 actual article (remove empty tag filters)
          const tagCountMap = new Map<string, number>();
          normalized.forEach((b) => {
            (b.tags || []).forEach((t: string) => {
              const clean = (t || '').trim();
              if (clean) {
                tagCountMap.set(clean, (tagCountMap.get(clean) || 0) + 1);
              }
            });
          });

          const activeTags = Array.from(tagCountMap.entries())
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]) // highest count first
            .map(([name, count]) => ({ name, count }));

          setTags(activeTags);
        } else {
          setPosts([]);
          setCategories([{ name: "All", count: 0 }]);
          setTags([]);
        }
      } catch (err) {
        console.warn("Could not fetch live blogs:", err);
        setPosts([]);
        setCategories([{ name: "All", count: 0 }]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Reset pagination to page 1 whenever category, tag or search filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, searchQuery]);

  // Filtered posts based on user selection
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (post.category && post.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesTag =
        selectedTag === "All" ||
        (Array.isArray(post.tags) &&
          post.tags.some((t: string) => t.toLowerCase() === selectedTag.toLowerCase()));
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      const articlesSection = document.getElementById("blog-grid-anchor");
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    }
  };

  // Generate page numbers for pagination with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Outreach Reports", href: "/outreach-reports" },
    { label: "Financial Reports", href: "/financial-reports" },
    { label: "Gallery", href: "/gallery" },
    { label: "News & Stories", href: "/blog", active: true },
    { label: "Support & FAQs", href: "/support" },
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

        {/* Desktop Navigation */}
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
        <div className="text-center max-w-3xl mx-auto mb-10">
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

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <IconSearch className="absolute left-4 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories by keyword, event, or town..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                aria-label="Clear search"
              >
                <IconX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls: Categories and Valid Tags */}
        <div className="space-y-4 mb-10">
          {/* Category Pills Filter - STRICTLY WITH CONTENT (>0 posts) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.name
                    ? "bg-[#558b1a] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{cat.name}</span>
                {cat.count > 0 && cat.name !== "All" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.name
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tags Pills Filter - STRICTLY WITH CONTENT (>0 posts) */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
                <IconTag className="w-3.5 h-3.5" /> Filter by Topic:
              </span>
              <button
                onClick={() => setSelectedTag("All")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  selectedTag === "All"
                    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                All Topics
              </button>
              {tags.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTag(selectedTag === t.name ? "All" : t.name)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                    selectedTag === t.name
                      ? "bg-[#558b1a] text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/70"
                  }`}
                >
                  <span>#{t.name}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full ${
                      selectedTag === t.name
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Anchor for scroll navigation on page change */}
        <div id="blog-grid-anchor" className="scroll-mt-24" />

        {/* Results Counter and Active Filter Tags */}
        {!loading && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 text-xs text-gray-500">
            <div>
              {filteredPosts.length > 0 ? (
                <span>
                  Showing{" "}
                  <strong className="text-gray-900">
                    {(currentPage - 1) * POSTS_PER_PAGE + 1}
                  </strong>
                  -
                  <strong className="text-gray-900">
                    {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)}
                  </strong>{" "}
                  of <strong className="text-gray-900">{filteredPosts.length}</strong> articles
                </span>
              ) : (
                <span>No articles found</span>
              )}
              {selectedCategory !== "All" && (
                <span className="ml-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="hover:text-emerald-950 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTag !== "All" && (
                <span className="ml-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  Tag: #{selectedTag}
                  <button
                    onClick={() => setSelectedTag("All")}
                    className="hover:text-emerald-950 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <span className="font-semibold text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        )}

        {/* Loading Skeletons (NO hardcoded blogs appear while loading) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-24 h-4 bg-gray-200 rounded-full" />
                    <div className="w-full h-6 bg-gray-200 rounded-md" />
                    <div className="w-3/4 h-6 bg-gray-200 rounded-md" />
                    <div className="space-y-2 pt-2">
                      <div className="w-full h-3.5 bg-gray-100 rounded" />
                      <div className="w-5/6 h-3.5 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200" />
                      <div className="w-20 h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-lg mx-auto">
            <p className="text-gray-700 font-semibold text-sm">No articles match your filter criteria.</p>
            <p className="text-gray-400 text-xs mt-1">Try resetting the category, tag, or search filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedTag("All");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2 bg-[#558b1a] text-white text-xs font-bold rounded-xl hover:bg-[#467315] transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Blog Posts Grid - Paginated */}
        {!loading && paginatedPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {paginatedPosts.map((post) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl border border-gray-100"
              >
                {/* Image with Green Date Badge */}
                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={
                      imageErrors[post.slug] || !post.image || post.image.includes("vonf.org")
                        ? "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg"
                        : post.image
                    }
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={() => {
                      setImageErrors((prev) => ({ ...prev, [post.slug]: true }));
                    }}
                  />
                  {/* Top-Left Green Date Badge */}
                  <div className="absolute top-3 left-3 bg-[#65a324] text-white px-3 py-2 flex flex-col items-center justify-center font-bold shadow-md z-10 rounded-lg">
                    <span className="text-base font-extrabold leading-tight">{post.day || "28"}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                      {post.month || "SEP"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                        {post.category || "General"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">
                        {post.region || "Nigeria"}
                      </span>
                    </div>

                    <h2 className="font-bold text-gray-900 text-lg sm:text-xl leading-snug mb-3 hover:text-[#558b1a] transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags Pills */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((t: string) => (
                          <span
                            key={t}
                            className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Author & Likes Row */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200">
                        <Image
                          src={
                            post.authorAvatar ||
                            "https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg"
                          }
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
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{post.likes || "0"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLLER */}
        {!loading && totalPages > 1 && (
          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 font-medium">
              Showing page <strong className="text-gray-900">{currentPage}</strong> of{" "}
              <strong className="text-gray-900">{totalPages}</strong> ({filteredPosts.length} total stories)
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#558b1a]"
                }`}
                aria-label="Previous page"
              >
                <IconChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((page, i) =>
                  typeof page === "number" ? (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                        currentPage === page
                          ? "bg-[#558b1a] text-white shadow-xs"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ) : (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-8 text-center text-xs text-gray-400 select-none"
                    >
                      …
                    </span>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#558b1a]"
                }`}
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* SHARED FOOTER */}
      <Footer />
    </div>
  );
}
