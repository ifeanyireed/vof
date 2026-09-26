'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  School,
  Sparkles,
  UploadCloud,
  Check
} from 'lucide-react';
import { api, ScholarshipItem } from '@/lib/api';
import DonateModal from '@/components/DonateModal';
import Footer from '@/components/Footer';

const COUNTRY_HUBS = [
  { id: 'Nigeria', label: 'Nigeria Hub', flag: '🇳🇬', defaultPhone: '+234 ', currency: '₦ (NGN)', defaultAmount: 150000, hub: 'Universities & Polytechnics Across Nigeria' },
  { id: 'Rwanda', label: 'Rwanda Hub', flag: '🇷🇼', defaultPhone: '+250 ', currency: 'RWF', defaultAmount: 250000, hub: 'Kigali & East African Tertiary Institutions' },
] as const;

export default function ScholarshipApplicationPage() {
  const [country, setCountry] = useState<'Nigeria' | 'Rwanda'>('Nigeria');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Female');
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [lga, setLga] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [courseOfStudy, setCourseOfStudy] = useState('');
  const [currentLevel, setCurrentLevel] = useState('200 Level');
  const [cgpa, setCgpa] = useState('');
  const [amountRequested, setAmountRequested] = useState<number>(150000);
  const [reasonForAid, setReasonForAid] = useState('');
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
    if (hub) {
      if (!phone || phone.trim() === '+234' || phone.trim() === '+250' || phone.trim() === '+1') {
        setPhone(hub.defaultPhone);
      }
      setAmountRequested(hub.defaultAmount);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingFile(true);
      setDocumentName(file.name);
      const url = await api.uploadFile(file, 'vof_scholarships');
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
    if (!applicantName.trim()) errs.applicantName = 'Student legal name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid institutional or personal email is required';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    if (!institutionName.trim()) errs.institutionName = 'Educational institution name is required';
    if (!courseOfStudy.trim()) errs.courseOfStudy = 'Course of study is required';
    if (!cgpa.trim()) errs.cgpa = 'CGPA / Grade is required';
    if (!amountRequested || amountRequested <= 0) errs.amountRequested = 'Grant amount is required';
    if (!reasonForAid.trim() || reasonForAid.trim().length < 35) {
      errs.reasonForAid = 'Please detail your financial constraints and motivation (at least 35 characters)';
    }
    if (!agreed) errs.agreed = 'Please certify that all submitted information is genuine';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const scholarshipData: Partial<ScholarshipItem> = {
        applicantName: applicantName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country,
        dateOfBirth,
        gender,
        stateOfOrigin: stateOfOrigin.trim() || country,
        lga: lga.trim(),
        institutionName: institutionName.trim(),
        courseOfStudy: courseOfStudy.trim(),
        currentLevel,
        cgpa: cgpa.trim(),
        amountRequested: Number(amountRequested),
        reasonForAid: reasonForAid.trim(),
        documentUrl,
        status: 'pending',
      };

      const result = await api.createScholarship(scholarshipData);
      setSubmittedId(`VOF-SCH-${result.id || Math.floor(1000 + Math.random() * 9000)}`);
    } catch (err: any) {
      setErrors({ form: err.message || 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setApplicantName('');
    setEmail('');
    setInstitutionName('');
    setCourseOfStudy('');
    setCgpa('');
    setReasonForAid('');
    setDocumentUrl('');
    setDocumentName('');
    setAgreed(false);
    setErrors({});
    setSubmittedId(null);
  };

  const currentHub = COUNTRY_HUBS.find((h) => h.id === country) || COUNTRY_HUBS[0];

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
          <Link href="/apply/scholarship" className="text-[#558b1a] font-bold text-sm transition-colors">
            Scholarships
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
      <section className="bg-gradient-to-b from-[#0c1a05] via-[#1c3813] to-[#0c1a05] text-white py-20 px-6 lg:px-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Veronica Onyeneke Academic Scholarship Fund</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Empowering Minds. <br />
            <span className="text-[#8ac43e]">Financing Higher Education.</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            No brilliant, hardworking student should be forced to drop out due to unpaid tuition. VOF awards direct financial bursaries, exam levies, and textbook support to indigent scholars.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-[#8ac43e] block">350+ Scholars</span>
              <span className="text-xs text-gray-300">Undergraduate & technical students funded</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-[#fbbf24] block">Tuition Grants</span>
              <span className="text-xs text-gray-300">Direct university & polytechnic fee coverage</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-[#38bdf8] block">JAMB & WAEC</span>
              <span className="text-xs text-gray-300">Annual candidate registration sponsorship</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xl font-bold text-emerald-400 block">Direct Relief</span>
              <span className="text-xs text-gray-300">Transparent disbursements with receipts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Application Form */}
      <main className="max-w-4xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          {submittedId ? (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold mb-3">
                Tracking Code: {submittedId}
              </span>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                Scholarship Application Submitted!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                Thank you, <strong>{applicantName}</strong>! Your application for <strong>{courseOfStudy}</strong> at <strong>{institutionName}</strong> ({country} Hub) has been logged with the VOF Scholarship Review Committee. Shortlisted candidates will be contacted via email regarding academic credential verification.
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
                  Higher Education Aid Application
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in your academic profile and attach proof of enrollment or recent transcript for verification.
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
                  1. Country / Educational Hub <span className="text-red-500">*</span>
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

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  2. Student Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Student Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Chidiebube Emmanuel Okon"
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
                      placeholder="chidiebube.o@gmail.com"
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
                      placeholder="+234 810 449 2011"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Gender
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State / District of Origin
                    </label>
                    <input
                      type="text"
                      value={stateOfOrigin}
                      onChange={(e) => setStateOfOrigin(e.target.value)}
                      placeholder={country === 'Nigeria' ? 'e.g. Imo State' : country === 'Rwanda' ? 'e.g. Kigali / Eastern' : 'e.g. Texas'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Local Govt Area (LGA) / Town
                    </label>
                    <input
                      type="text"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Mbaitoli / Owerri West"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Records */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  3. Academic Credentials & Aid Request
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Name of Educational Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Federal University of Technology Owerri (FUTO)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
                    />
                    {errors.institutionName && <p className="text-[10px] text-red-500 mt-1">{errors.institutionName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Course of Study / Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={courseOfStudy}
                      onChange={(e) => setCourseOfStudy(e.target.value)}
                      placeholder="e.g. Electrical & Electronics Engineering"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
                    />
                    {errors.courseOfStudy && <p className="text-[10px] text-red-500 mt-1">{errors.courseOfStudy}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current Academic Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
                    >
                      <option value="100 Level">100 Level (Freshman)</option>
                      <option value="200 Level">200 Level (Sophomore)</option>
                      <option value="300 Level">300 Level (Junior)</option>
                      <option value="400 Level">400 Level (Senior)</option>
                      <option value="500 Level">500 Level (Final Year)</option>
                      <option value="ND I / ND II">ND I / ND II (Polytechnic)</option>
                      <option value="HND I / HND II">HND I / HND II</option>
                      <option value="Secondary / JAMB Candidate">Secondary / JAMB Candidate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current CGPA / Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 4.45 / 5.0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.cgpa && <p className="text-[10px] text-red-500 mt-1">{errors.cgpa}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Grant Amount Requested <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                        {country === 'Nigeria' ? '₦' : country === 'Rwanda' ? 'RWF' : '$'}
                      </span>
                      <input
                        type="number"
                        value={amountRequested}
                        onChange={(e) => setAmountRequested(Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                      />
                    </div>
                    {errors.amountRequested && <p className="text-[10px] text-red-500 mt-1">{errors.amountRequested}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Reason for Financial Aid & Academic Aspirations <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={reasonForAid}
                    onChange={(e) => setReasonForAid(e.target.value)}
                    placeholder="Describe your household financial constraints, family background, and how this scholarship will enable you to focus on your studies and graduate..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.reasonForAid && <p className="text-[10px] text-red-500 mt-1">{errors.reasonForAid}</p>}
                </div>

                {/* Upload Academic Credentials */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Admission Letter / Recent Transcript / Student ID (PDF, JPG or PNG up to 10MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />

                  {documentUrl ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-emerald-800 font-semibold truncate">
                        <FileText className="w-5 h-5 shrink-0 text-emerald-600" />
                        <span className="truncate">{documentName || 'Academic_Credentials.pdf'}</span>
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
                          <Loader2 className="w-4 h-4 animate-spin text-[#558b1a]" />
                          <span>Uploading credentials...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-500 group-hover:text-[#558b1a]">
                          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#558b1a]" />
                          <span className="text-xs font-bold">Click to upload Transcript, Student ID or Admission Letter</span>
                          <span className="text-[10px] text-gray-400">PDF, Word, or High-Resolution Image</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.document && <p className="text-[10px] text-red-500 mt-1">{errors.document}</p>}
                </div>
              </div>

              {/* Certification Checkbox */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#558b1a] focus:ring-[#558b1a]"
                  />
                  <span>
                    I solemnly attest that all information provided in this application is accurate and genuine. I authorize the Veronica Onyeneke Foundation to verify my academic credentials with my school or registrar.
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
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Scholarship Application</span>
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
