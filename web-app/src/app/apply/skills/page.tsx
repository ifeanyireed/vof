'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Scissors,
  Laptop,
  Cake,
  Footprints,
  Brush,
  Zap,
  UploadCloud,
  Check
} from 'lucide-react';
import { api, SkillAppItem } from '@/lib/api';
import DonateModal from '@/components/DonateModal';
import Footer from '@/components/Footer';

const COUNTRY_HUBS = [
  { id: 'Nigeria', label: 'Nigeria Hub', flag: '🇳🇬', defaultPhone: '+234 ', hub: 'VOIE Permanent Campus (Mbieri, Imo State)' },
  { id: 'Rwanda', label: 'Rwanda Hub', flag: '🇷🇼', defaultPhone: '+250 ', hub: 'Kigali Vocational Training Hub' },
] as const;

const TRADES = [
  { id: 'Fashion Design & Advanced Tailoring', name: 'Fashion Design & Tailoring', icon: Scissors, desc: 'Pattern drafting, industrial sewing machine operation, and garment construction.' },
  { id: 'ICT, Digital Skills & Web Development', name: 'ICT & Digital Skills', icon: Laptop, desc: 'Computer literacy, web design, graphic design, and digital freelancing.' },
  { id: 'Baking & Confectionery Arts', name: 'Baking & Confectionery', icon: Cake, desc: 'Commercial pastry making, artisan bread, cake decorating, and catering management.' },
  { id: 'Shoe Making & Handcrafted Leather Works', name: 'Shoe & Leather Craft', icon: Footprints, desc: 'Handcrafted leather shoes, sandals, belts, bags, and footwear manufacturing.' },
  { id: 'Cosmetology, Hair Styling & Makeup', name: 'Cosmetology & Styling', icon: Brush, desc: 'Bridal makeover, wig making, dreadlocks, natural hair care, and skincare.' },
  { id: 'Electrical Installation & Solar Technology', name: 'Electrical & Solar Tech', icon: Zap, desc: 'Domestic wiring, solar inverter installation, maintenance, and battery tech.' },
];

export default function SkillsApplicationPage() {
  const [country, setCountry] = useState<'Nigeria' | 'Rwanda'>('Nigeria');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [gender, setGender] = useState('Female');
  const [address, setAddress] = useState('');
  const [tradeSelected, setTradeSelected] = useState('Fashion Design & Advanced Tailoring');
  const [educationLevel, setEducationLevel] = useState('SSCE / WAEC');
  const [employmentStatus, setEmploymentStatus] = useState('Unemployed');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [intakeBatch, setIntakeBatch] = useState('Batch 2026-A');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCountryChange = (c: 'Nigeria' | 'Rwanda') => {
    setCountry(c);
    const hub = COUNTRY_HUBS.find((h) => h.id === c);
    if (hub && (!phone || phone.trim() === '+234' || phone.trim() === '+250' || phone.trim() === '+1')) {
      setPhone(hub.defaultPhone);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingFile(true);
      setDocumentName(file.name);
      const url = await api.uploadFile(file, 'vof_skills_applications');
      setDocumentUrl(url);
      setErrors((prev) => ({ ...prev, document: '' }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, document: 'Upload failed: ' + (err.message || 'Please try again') }));
    } finally {
      setUploadingFile(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!applicantName.trim()) errs.applicantName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    if (!address.trim()) errs.address = 'Residential address is required';
    if (!statementOfPurpose.trim() || statementOfPurpose.trim().length < 25) {
      errs.statementOfPurpose = 'Please provide a statement of purpose (at least 25 characters)';
    }
    if (!agreed) errs.agreed = 'Please confirm your commitment to attend classes';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const skillData: Partial<SkillAppItem> = {
        applicantName: applicantName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country,
        gender,
        address: `${country} — ${address.trim()}`,
        tradeSelected,
        educationLevel,
        employmentStatus,
        statementOfPurpose: statementOfPurpose.trim(),
        intakeBatch,
        documentUrl,
        status: 'pending',
      };

      const result = await api.createSkill(skillData);
      setSubmittedId(`VOIE-${result.id || Math.floor(1000 + Math.random() * 9000)}`);
    } catch (err: any) {
      setErrors({ form: err.message || 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setApplicantName('');
    setEmail('');
    setAddress('');
    setStatementOfPurpose('');
    setDocumentUrl('');
    setDocumentName('');
    setAgreed(false);
    setErrors({});
    setSubmittedId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full px-6 lg:px-16 py-4 flex items-center justify-between border-b border-gray-100 shadow-xs">
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

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            About Us
          </Link>
          <Link href="/programs" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Programs
          </Link>
          <Link href="/apply/skills" className="text-[#558b1a] font-bold text-sm transition-colors">
            VOIE Skills
          </Link>
          <Link href="/outreach-reports" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Outreach Reports
          </Link>
          <Link href="/financial-reports" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Financial Reports
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsDonateOpen(true)}
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs cursor-pointer"
          >
            Donate
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0c1a05] via-[#1a3811] to-[#0c1a05] text-white py-20 px-6 lg:px-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-6">
            <Target className="w-4 h-4" />
            <span>Veronica Onyeneke Institute of Entrepreneurship (VOIE)</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Master a Practical Craft. <br />
            <span className="text-[#8ac43e]">Launch Your Future.</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            VOIE provides free vocational training, modern industrial equipment, starter toolkits, and micro-business mentorship to empower unemployed youths and indigent mothers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-[#8ac43e] block">100% Free</span>
              <span className="text-xs text-gray-300">Tuition-free training sponsored by VOF donors</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-[#fbbf24] block">Toolkits</span>
              <span className="text-xs text-gray-300">Graduates receive starter machines & tool sets</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-[#38bdf8] block">6 Trades</span>
              <span className="text-xs text-gray-300">High-demand crafts with immediate market value</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-emerald-400 block">600+ Trained</span>
              <span className="text-xs text-gray-300">Alumni operating thriving workshops & shops</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application Form */}
      <main className="max-w-4xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          {submittedId ? (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-bold mb-3">
                Enrollment Code: {submittedId}
              </span>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                VOIE Application Successfully Received!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                Congratulations, <strong>{applicantName}</strong>! Your application for <strong>{tradeSelected}</strong> ({intakeBatch}) at the <strong>{country}</strong> hub has been submitted. Our admissions coordinator will contact you via WhatsApp and phone regarding aptitude screening and orientation dates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Submit Another Application
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition cursor-pointer"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                  VOIE Trainee Enrollment Form
                </h3>
                <p className="text-xs text-gray-500">
                  Please select your preferred vocational trade and fill in all applicant details accurately.
                </p>
              </div>

              {errors.form && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Country Hub Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                  1. Select Training Campus / Country Hub <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COUNTRY_HUBS.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleCountryChange(h.id as any)}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1.5 cursor-pointer ${
                        country === h.id
                          ? 'border-[#558b1a] bg-[#f4faec] ring-2 ring-[#558b1a]/30'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{h.flag}</span>
                        <span className="font-bold text-sm text-gray-900">{h.label}</span>
                      </div>
                      <span className="text-xs text-gray-500">{h.hub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trade Selection Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                  2. Choose Your Vocational Trade <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRADES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = tradeSelected === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTradeSelected(t.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-[#558b1a] bg-[#f4faec] ring-2 ring-[#558b1a]/30'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-[#558b1a] text-white' : 'bg-stone-100 text-gray-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 flex items-center justify-between">
                            {t.name}
                            {isSelected && <Check className="w-4 h-4 text-[#558b1a]" />}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{t.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  3. Applicant Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Applicant Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Precious Ifeoma Uzoma"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.applicantName && <p className="text-[10px] text-red-500 mt-1">{errors.applicantName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="precious.uzoma@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 119 5544"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Intake Cohort
                    </label>
                    <select
                      value={intakeBatch}
                      onChange={(e) => setIntakeBatch(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="Batch 2026-A">Batch 2026-A (Next Cohort)</option>
                      <option value="Batch 2026-B">Batch 2026-B (Autumn Cohort)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Residential Address / Town / LGA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Mbieri, Mbaitoli LGA, Imo State"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Highest Education Attained
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="SSCE / WAEC">SSCE / WAEC / NECO</option>
                      <option value="OND / NCE">OND / NCE</option>
                      <option value="HND / BSc">HND / Bachelor's Degree</option>
                      <option value="Primary">Primary School Leaving</option>
                      <option value="Informal / Other">No Formal Education / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current Employment Status
                    </label>
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="Unemployed">Unemployed</option>
                      <option value="Self-employed">Self-employed / Petty trader</option>
                      <option value="Student">Student</option>
                      <option value="Apprentice">Apprentice</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Statement of Purpose */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  4. Motivation & Household Background
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Why do you wish to learn this craft, and how will it change your situation? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={statementOfPurpose}
                    onChange={(e) => setStatementOfPurpose(e.target.value)}
                    placeholder="Tell us about your dreams, family responsibilities, and how acquiring this skill will enable you to generate income or start a business..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.statementOfPurpose && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.statementOfPurpose}</p>
                  )}
                </div>

                {/* Passport Photo / ID Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Passport Photograph or ID (Optional, JPG, PNG or PDF up to 10MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                  />

                  {documentUrl ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-blue-800 font-semibold truncate">
                        <FileText className="w-5 h-5 shrink-0 text-blue-600" />
                        <span className="truncate">{documentName || 'ID_Photo.jpg'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentUrl('');
                          setDocumentName('');
                        }}
                        className="text-gray-400 hover:text-red-500 p-1.5 cursor-pointer transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-[#558b1a] rounded-2xl p-6 text-center cursor-pointer transition-colors group bg-stone-50/50 hover:bg-[#f4faec]/40"
                    >
                      {uploadingFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                          <Loader2 className="w-5 h-5 animate-spin text-[#558b1a]" />
                          <span>Uploading image...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-500 group-hover:text-[#558b1a]">
                          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#558b1a]" />
                          <span className="text-xs font-bold">Click to upload Passport Photo or ID Card</span>
                          <span className="text-[10px] text-gray-400">JPG, PNG or PDF</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.document && <p className="text-[10px] text-red-500 mt-1">{errors.document}</p>}
                </div>
              </div>

              {/* Commitment Agreement */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#558b1a] focus:ring-[#558b1a]"
                  />
                  <span>
                    I commit to completing the entire training course at VOIE, arriving punctually for practical sessions, and using the acquired tools solely for self-empowerment and legitimate enterprise.
                  </span>
                </label>
                {errors.agreed && <p className="text-[10px] text-red-500 mt-1">{errors.agreed}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingFile}
                  className="px-8 py-3.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enrollment...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit VOIE Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* SHARED FOOTER */}
      <Footer onDonateClick={() => setIsDonateOpen(true)} />

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        initialMethod="paystack"
        initialFrequency="once"
      />
    </div>
  );
}
