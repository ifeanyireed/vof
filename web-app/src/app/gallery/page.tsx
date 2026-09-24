"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { galleryAlbums, GalleryAlbum, GalleryPhoto } from "@/data/gallery";
import {
  IconLayoutGrid,
  IconList,
  IconChevronDown,
  IconChevronRight,
  IconChevronLeft,
  IconX,
  IconWorld,
  IconPhoto,
  IconEye,
  IconSearch,
  IconCalendar,
  IconMapPin,
  IconArrowRight,
  IconSparkles,
  IconMenu2,
  IconCopy,
  IconCheck,
  IconShare,
  IconHeart
} from "@tabler/icons-react";
import DonateModal, { DonationMethod, DonationFrequency } from "@/components/DonateModal";
import FooterDirectGiving from "@/components/FooterDirectGiving";

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState<boolean>(false);

  // Lightbox state
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Navigation & Donate Modal states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const categories = [
    "All",
    "Vocational Skills",
    "Maternal Dignity",
    "Academic Scholarships",
    "Rwanda Mission",
    "Community Relief",
    "Annual Milestones"
  ];

  const regions = ["Global", "Nigeria", "Rwanda", "USA"];
  const years = ["All", "2024", "2023"];

  // Filtered albums
  const filteredAlbums = useMemo(() => {
    return galleryAlbums.filter((album) => {
      const matchesRegion =
        selectedRegion === "Global" || album.region === selectedRegion || album.region === "Global";
      const matchesCategory =
        selectedCategory === "All" || album.category === selectedCategory;
      const matchesYear =
        selectedYear === "All" || album.year.toString() === selectedYear;
      const matchesSearch =
        !searchQuery.trim() ||
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRegion && matchesCategory && matchesYear && matchesSearch;
    });
  }, [selectedRegion, selectedCategory, selectedYear, searchQuery]);

  // Open album in lightbox
  const openLightbox = (album: GalleryAlbum, initialIndex: number = 0) => {
    setActiveAlbum(album);
    setActivePhotoIndex(initialIndex);
  };

  const closeLightbox = () => {
    setActiveAlbum(null);
    setActivePhotoIndex(0);
  };

  const nextPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((prev) => (prev + 1) % activeAlbum.photos.length);
  };

  const prevPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((prev) =>
      prev === 0 ? activeAlbum.photos.length - 1 : prev - 1
    );
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeAlbum) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAlbum]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery", active: true },
    { label: "News & Stories", href: "/blog" },
    { label: "Financial Reports", href: "/financial-reports" }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* 1. TOP ANNOUNCEMENT BANNER (Styling inspired by banner in reference) */}
      <div className="w-full bg-gradient-to-r from-[#3e6812] via-[#558b1a] to-[#71a627] text-white py-2 px-4 sm:px-6 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-xs">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-[11px]">
          🌱
        </span>
        <span>
          Partner with us to empower young mothers and sponsor youth vocational training at VOIE.
        </span>
        <button
          onClick={() => setIsDonateOpen(true)}
          className="ml-2 font-bold underline hover:text-[#d6f0b0] cursor-pointer inline-flex items-center gap-1 transition-colors"
        >
          Support Our Mission
          <IconChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs transition-all">
        <div className="w-full px-6 lg:px-16 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.webp"
              alt="Veronica Onyeneke Foundation Logo"
              width={180}
              height={52}
              className="object-contain h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-semibold transition-colors duration-200 text-sm whitespace-nowrap ${
                  item.active
                    ? "text-[#558b1a] font-bold"
                    : "text-gray-700 hover:text-[#558b1a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
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

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-md"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-semibold py-1.5 ${
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

      {/* 3. MAIN GALLERY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb (Exact styling matching reference: Home > Gallery) */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-[#558b1a] font-semibold">Gallery</span>
        </nav>

        {/* Title and Subtitle Header Section */}
        <div className="mb-8 md:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b2124] tracking-tight leading-tight mb-3"
          >
            A Year-by-Year Journey Through Our Impact Galleries
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed"
          >
            Immerse yourself in the timeless beauty and inspiring moments of hope as we take you on a captivating visual journey through our program and outreach galleries.
          </motion.p>
        </div>

        {/* 4. CONTROLS BAR: FILTER DROPDOWN & VIEW SWITCHER (Exact matching of gallery.webp controls) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
          {/* Left Controls: Global Dropdown & Category Pills */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Region Dropdown (e.g. 🌐 Global ∨) */}
            <div className="relative">
              <button
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:border-[#558b1a] hover:text-[#558b1a] transition-all shadow-2xs cursor-pointer"
              >
                <IconWorld className="w-4 h-4 text-[#558b1a]" />
                <span>{selectedRegion}</span>
                <IconChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isRegionDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Region Dropdown Menu */}
              <AnimatePresence>
                {isRegionDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30"
                  >
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          setIsRegionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          selectedRegion === region
                            ? "bg-[#f4faec] text-[#558b1a] font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span>{region}</span>
                        {selectedRegion === region && <IconCheck className="w-3.5 h-3.5 text-[#558b1a]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#558b1a] text-white shadow-xs"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls: Year Filter, Search & View Switcher Icons */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200/80 text-xs">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    selectedYear === year
                      ? "bg-gray-900 text-white font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="relative hidden lg:block">
              <IconSearch className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search galleries..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#558b1a] w-40 transition-all text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IconX className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Switchers (Grid Icon & List Icon styled exactly like gallery.webp) */}
            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              {/* Grid View Toggle */}
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "border-2 border-[#558b1a] text-[#558b1a] bg-[#f4faec]"
                    : "text-gray-400 hover:text-gray-700 bg-white border border-gray-200"
                }`}
                title="Grid View"
              >
                <IconLayoutGrid className="w-4 h-4" />
              </button>

              {/* List View Toggle */}
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "border-2 border-[#558b1a] text-[#558b1a] bg-[#f4faec]"
                    : "text-gray-400 hover:text-gray-700 bg-white border border-gray-200"
                }`}
                title="List View"
              >
                <IconList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5. GALLERY ITEMS: GRID VIEW (Matching gallery.webp 3-image collage format) */}
        {filteredAlbums.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xs">
            <IconPhoto className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700 mb-1">No galleries found</h3>
            <p className="text-xs text-gray-400 mb-4">Try adjusting your category, year, or search criteria.</p>
            <button
              onClick={() => {
                setSelectedRegion("Global");
                setSelectedCategory("All");
                setSelectedYear("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#558b1a] text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-9">
            {filteredAlbums.map((album, idx) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => openLightbox(album, 0)}
                className="group cursor-pointer select-none"
              >
                {/* 3-IMAGE COLLAGE CONTAINER (Exact visual replication of gallery.webp) */}
                <div className="w-full h-52 sm:h-56 lg:h-48 xl:h-52 flex gap-1.5 md:gap-2">
                  {/* Left Column: 2 Stacked Images */}
                  <div className="w-[42%] flex flex-col gap-1.5 md:gap-2 h-full">
                    {/* Top Left Image */}
                    <div className="flex-1 w-full rounded-xl md:rounded-2xl overflow-hidden relative bg-gray-100 shadow-2xs">
                      <img
                        src={album.coverImages[0]}
                        alt={`${album.title} preview 1`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>
                    {/* Bottom Left Image */}
                    <div className="flex-1 w-full rounded-xl md:rounded-2xl overflow-hidden relative bg-gray-100 shadow-2xs">
                      <img
                        src={album.coverImages[1]}
                        alt={`${album.title} preview 2`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Right Column: 1 Tall Full-Height Image */}
                  <div className="w-[58%] h-full rounded-xl md:rounded-2xl overflow-hidden relative bg-gray-100 shadow-2xs group/right">
                    <img
                      src={album.coverImages[2]}
                      alt={`${album.title} preview tall`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    {/* Hover Overlay with Eye / Gallery Indicator */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/90 text-gray-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                        <IconEye className="w-4 h-4 text-[#558b1a]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Title & Photo Count (Matching gallery.webp styling) */}
                <div className="mt-3">
                  <h3 className="font-bold text-[#1b2124] text-[15px] leading-snug group-hover:text-[#558b1a] transition-colors line-clamp-1">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-400 font-normal">
                    <span>{album.photoCount} Photos</span>
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                      {album.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* LIST VIEW MODE */
          <div className="space-y-6">
            {filteredAlbums.map((album, idx) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => openLightbox(album, 0)}
                className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#558b1a]/40 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6 group"
              >
                {/* 3-Image Collage on Left */}
                <div className="w-full md:w-64 lg:w-72 h-44 shrink-0 flex gap-2">
                  <div className="w-[42%] flex flex-col gap-2 h-full">
                    <div className="flex-1 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={album.coverImages[0]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={album.coverImages[1]}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="w-[58%] h-full rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={album.coverImages[2]}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Right Details */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0]">
                        {album.category}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {album.year}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <IconMapPin className="w-3 h-3 text-gray-400" />
                        {album.location}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-[#558b1a] transition-colors mb-2">
                      {album.title}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
                      {album.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <IconPhoto className="w-4 h-4 text-[#558b1a]" />
                      <span>{album.photoCount} High-Resolution Photographs</span>
                    </div>

                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#558b1a] text-white text-xs font-bold hover:bg-[#467315] transition-colors shadow-2xs">
                      <span>View Gallery</span>
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* 6. LIGHTBOX MODAL VIEWER */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Top Bar of Lightbox */}
            <div className="w-full px-4 sm:px-8 py-4 flex items-center justify-between text-white border-b border-white/10 z-10 bg-black/40">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#558b1a] text-white text-xs font-bold uppercase tracking-wider">
                  {activeAlbum.category}
                </span>
                <div className="hidden sm:block">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{activeAlbum.title}</h4>
                  <p className="text-[11px] text-gray-400">
                    {activeAlbum.location} • {activeAlbum.year}
                  </p>
                </div>
              </div>

              {/* Photo Counter and Close Button */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-300">
                  {activePhotoIndex + 1} / {activeAlbum.photos.length}
                </span>

                <button
                  onClick={closeLightbox}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close lightbox"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Middle Main Photo View with Left/Right Arrows */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 sm:left-8 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer shadow-lg hover:scale-105"
                aria-label="Previous photo"
              >
                <IconChevronLeft className="w-6 h-6" />
              </button>

              {/* Active Image */}
              <motion.div
                key={activeAlbum.photos[activePhotoIndex].id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-5xl max-h-[70vh] flex flex-col items-center justify-center"
              >
                <img
                  src={activeAlbum.photos[activePhotoIndex].url}
                  alt={activeAlbum.photos[activePhotoIndex].caption}
                  className="max-h-[64vh] max-w-full object-contain rounded-xl shadow-2xl"
                />

                {/* Caption below photo */}
                <div className="text-center mt-3 max-w-2xl px-4">
                  <p className="text-white text-xs sm:text-sm font-medium">
                    {activeAlbum.photos[activePhotoIndex].caption}
                  </p>
                  {activeAlbum.photos[activePhotoIndex].date && (
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      {activeAlbum.photos[activePhotoIndex].date}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 sm:right-8 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer shadow-lg hover:scale-105"
                aria-label="Next photo"
              >
                <IconChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="w-full px-4 py-3 bg-black/60 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto scrollbar-none">
              {activeAlbum.photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                    activePhotoIndex === idx
                      ? "border-[#558b1a] scale-105 shadow-md"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. FOOTER */}
      <footer className="relative w-full text-white overflow-hidden py-16 md:py-20 px-6 lg:px-16 isolate bg-[#091503] mt-20">
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-left mb-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">About VOF</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Veronica Onyeneke Foundation is a registered nonprofit committed to youth vocational empowerment, academic sponsorships, and compassionate care for young pregnant women.
              </p>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-xs">
                <Link href="/about" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>About Us & Founder Story</span>
                </Link>
                <Link href="/programs" className="text-gray-300 hover:text-[#8ac43e] transition-colors flex items-center gap-1.5">
                  <IconArrowRight className="w-3 h-3 text-[#8ac43e]" />
                  <span>Our Five Core Programs</span>
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
