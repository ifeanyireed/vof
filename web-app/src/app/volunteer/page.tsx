'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Heart,
  Globe2,
  Clock,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import { api, VolunteerItem } from '@/lib/api';
import DonateModal from '@/components/DonateModal';
import Footer from '@/components/Footer';

const COUNTRY_HUBS = [
  { id: 'Nigeria', label: 'Nigeria Hub', flag: '🇳🇬', defaultPhone: '+234 ', hub: 'Mbieri & Owerri HQ (Imo State)' },
  { id: 'Rwanda', label: 'Rwanda Hub', flag: '🇷🇼', defaultPhone: '+250 ', hub: 'Kigali Country Office' },
  { id: 'USA', label: 'United States', flag: '🇺🇸', defaultPhone: '+1 ', hub: 'US 501(c)(3) Diaspora Operations' },
] as const;

export default function VolunteerPage() {
  const [country, setCountry] = useState<'Nigeria' | 'Rwanda' | 'USA'>('Nigeria');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [location, setLocation] = useState('');
  const [interestArea, setInterestArea] = useState('VOIE Skills Mentorship');
  const [availability, setAvailability] = useState('Weekends');
  const [skillsExperience, setSkillsExperience] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCountryChange = (c: 'Nigeria' | 'Rwanda' | 'USA') => {
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
      setResumeName(file.name);
      const url = await api.uploadFile(file, 'vof_volunteers');
      setResumeUrl(url);
      setErrors((prev) => ({ ...prev, resume: '' }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, resume: 'Upload failed: ' + (err.message || 'Please try again') }));
    } finally {
      setUploadingFile(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    if (!location.trim()) errs.location = 'City & State/Province is required';
    if (!skillsExperience.trim() || skillsExperience.trim().length < 15) {
      errs.skillsExperience = 'Please describe your skills (at least 15 characters)';
    }
    if (!agreed) errs.agreed = 'Please agree to the VOF volunteer code of conduct';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const volunteerData: Partial<VolunteerItem> = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country,
        location: `${country} — ${location.trim()}`,
        interestArea,
        availability,
        skillsExperience: skillsExperience.trim(),
        resumeUrl,
        notes: notes.trim() ? `[Motivation/Notes]: ${notes.trim()}` : undefined,
        status: 'new',
      };

      const result = await api.createVolunteer(volunteerData);
      setSubmittedId(`VOF-VOL-${result.id || Math.floor(1000 + Math.random() * 9000)}`);
    } catch (err: any) {
      setErrors({ form: err.message || 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setLocation('');
    setSkillsExperience('');
    setNotes('');
    setResumeUrl('');
    setResumeName('');
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

        <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-6">
          <Link href="/" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            About Us
          </Link>
          <Link href="/programs" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            Programs
          </Link>
          <Link href="/outreach-reports" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            Outreach Reports
          </Link>
          <Link href="/volunteer" className="text-[#558b1a] font-bold text-xs xl:text-sm transition-colors">
            Volunteer
          </Link>
          <Link href="/gallery" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            Gallery
          </Link>
          <Link href="/financial-reports" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            Financial Reports
          </Link>
          <Link href="/support" className="text-gray-700 hover:text-[#558b1a] font-semibold text-xs xl:text-sm transition-colors">
            Support & FAQs
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
      <section className="bg-gradient-to-b from-[#0c1a05] via-[#162e0c] to-[#0c1a05] text-white py-20 px-6 lg:px-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-6">
            <Users className="w-4 h-4" />
            <span>Join 500+ Community Volunteers Worldwide</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Lend Your Hands. <br />
            <span className="text-[#8ac43e]">Transform Communities.</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Whether you are in Nigeria, Rwanda, or the USA diaspora, your time and professional skills can bring hope, quality healthcare, and vocational livelihoods to underserved youth and mothers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Globe2 className="w-5 h-5 text-[#8ac43e] mb-2" />
              <h4 className="font-bold text-sm text-white">3 Active Hubs</h4>
              <p className="text-xs text-gray-400 mt-1">Nigeria HQ, Rwanda Mission, and USA 501(c)(3) diaspora outreach.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Heart className="w-5 h-5 text-[#fbbf24] mb-2" />
              <h4 className="font-bold text-sm text-white">Direct Grassroots Impact</h4>
              <p className="text-xs text-gray-400 mt-1">Medical camps, food relief distributions, and vocational mentoring.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-[#38bdf8] mb-2" />
              <h4 className="font-bold text-sm text-white">Flexible Commitments</h4>
              <p className="text-xs text-gray-400 mt-1">Weekend outreaches, remote skills coaching, or full event planning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
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
                Volunteer Registration Received!
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                Thank you, <strong>{fullName}</strong>! Your application to volunteer at the <strong>{country}</strong> hub has been securely recorded. Our volunteer operations coordinator will reach out to you within 48–72 hours via email or WhatsApp.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Submit Another Profile
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
                  Volunteer Application Form
                </h3>
                <p className="text-xs text-gray-500">
                  Please fill in your details accurately. All information is kept confidential and used solely for VOF humanitarian activities.
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
                  1. Select Your Operating Country / Regional Hub <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  2. Personal & Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Obinna Michael Madu"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="obinna.madu@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (WhatsApp Preferred) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 809 112 3901"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current City & State / Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={country === 'Nigeria' ? 'e.g. Owerri, Imo State' : country === 'Rwanda' ? 'e.g. Kigali' : 'e.g. Houston, Texas'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.location && <p className="text-[10px] text-red-500 mt-1">{errors.location}</p>}
                  </div>
                </div>
              </div>

              {/* Focus Area & Availability */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  3. Volunteer Focus & Availability
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Primary Interest Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={interestArea}
                      onChange={(e) => setInterestArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
                    >
                      <option value="VOIE Skills Mentorship">VOIE Vocational Skills Mentorship</option>
                      <option value="Medical Outreach">Medical & Rural Healthcare Outreach</option>
                      <option value="Youth Education & Scholarships">Youth Education & Scholarships</option>
                      <option value="Food Relief & Logistics">Food Relief & Community Logistics</option>
                      <option value="Media & Photography">Media, Storytelling & Content Creation</option>
                      <option value="Fundraising & Grants">Fundraising & Grant Writing</option>
                      <option value="Administrative Support">Administrative & IT Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Availability Schedule <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
                    >
                      <option value="Weekends">Weekends Only</option>
                      <option value="Flexible">Flexible / On Call for Outreaches</option>
                      <option value="Part-time">Part-time (Selected Weekdays)</option>
                      <option value="Full-time">Full-time Volunteer</option>
                      <option value="Remote">Remote / Virtual Support Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Describe Your Skills, Background & Prior Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={skillsExperience}
                    onChange={(e) => setSkillsExperience(e.target.value)}
                    placeholder="Tell us about your educational or vocational background, professional capabilities, and how you would like to contribute..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.skillsExperience && <p className="text-[10px] text-red-500 mt-1">{errors.skillsExperience}</p>}
                </div>
              </div>

              {/* Resume / Profile Upload */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">
                  4. Resume or Profile Document (Optional)
                </h4>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  {resumeUrl ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-emerald-800 font-semibold truncate">
                        <FileText className="w-5 h-5 shrink-0 text-emerald-600" />
                        <span className="truncate">{resumeName || 'CV_Document.pdf'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResumeUrl('');
                          setResumeName('');
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
                          <span>Uploading document...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-500 group-hover:text-[#558b1a]">
                          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#558b1a]" />
                          <span className="text-xs font-bold">Click or drag & drop to upload CV or Bio</span>
                          <span className="text-[10px] text-gray-400">PDF, Word, or Image files up to 10MB</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.resume && <p className="text-[10px] text-red-500 mt-1">{errors.resume}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Personal Motivation or Additional Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. I am passionate about healthcare access in rural Mbieri"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Code of Conduct Checkbox */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#558b1a] focus:ring-[#558b1a]"
                  />
                  <span>
                    I confirm that I am volunteering voluntarily to advance VOF humanitarian causes. I agree to uphold dignity, respect community privacy, and follow the guidelines established by the Board of Trustees.
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
                      <span>Submitting Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Volunteer Application</span>
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
