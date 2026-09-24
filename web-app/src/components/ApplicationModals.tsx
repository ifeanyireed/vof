'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
  GraduationCap,
  Users,
  Target,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Check,
  Building2,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { api, VolunteerItem, ScholarshipItem, SkillAppItem } from '@/lib/api';

export type ApplicationModalType = 'volunteer' | 'skills' | 'scholarship' | null;

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCountry?: 'Nigeria' | 'Rwanda' | 'USA';
}

const COUNTRY_HUBS = [
  { id: 'Nigeria', label: 'Nigeria', flag: '🇳🇬', defaultPhone: '+234 ', hub: 'Mbieri & Owerri HQ' },
  { id: 'Rwanda', label: 'Rwanda', flag: '🇷🇼', defaultPhone: '+250 ', hub: 'Kigali Country Hub' },
  { id: 'USA', label: 'USA', flag: '🇺🇸', defaultPhone: '+1 ', hub: 'US 501(c)(3) Diaspora' },
] as const;

// =========================================================================
// 1. VOLUNTEER REGISTRATION MODAL
// =========================================================================
export function VolunteerModal({ isOpen, onClose, defaultCountry = 'Nigeria' }: BaseModalProps) {
  const [country, setCountry] = useState<'Nigeria' | 'Rwanda' | 'USA'>(defaultCountry);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string>(
    COUNTRY_HUBS.find((c) => c.id === defaultCountry)?.defaultPhone || '+234 '
  );
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
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    if (!location.trim()) errs.location = 'City / State is required';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0c1a05] to-[#1d3d10] p-6 text-white relative">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-[#558b1a]/40 text-[#8ac43e]">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#8ac43e]">
                VOF Global Volunteer Network
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Join Our Mission</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-lg">
              Lend your skills and compassion to empower vulnerable families, train youths, and support outreach in Nigeria, Rwanda, and the USA.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {submittedId ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold mb-2">
                  Reference: {submittedId}
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Welcome to the VOF Family!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Thank you, <strong>{fullName}</strong>. Your volunteer profile has been sent to our community operations lead for <strong>{country}</strong>. We will review your background and reach out within 48–72 hours.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.form && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Country / Hub Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Select Your Country Hub <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {COUNTRY_HUBS.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleCountryChange(h.id as any)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                          country === h.id
                            ? 'border-[#558b1a] bg-[#f4faec] ring-2 ring-[#558b1a]/30'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{h.flag}</span>
                          <span className="font-bold text-xs text-gray-900">{h.label}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{h.hub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amara Jennifer Eze"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (WhatsApp preferred) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City & State / Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={country === 'Nigeria' ? 'e.g. Owerri, Imo State' : country === 'Rwanda' ? 'e.g. Kigali' : 'e.g. Houston, Texas'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.location && <p className="text-[10px] text-red-500 mt-1">{errors.location}</p>}
                  </div>
                </div>

                {/* Role Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Primary Area of Interest <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={interestArea}
                      onChange={(e) => setInterestArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="VOIE Skills Mentorship">VOIE Vocational Skills Mentorship</option>
                      <option value="Medical Outreach">Medical & Rural Healthcare Outreach</option>
                      <option value="Youth Education & Scholarships">Youth Education & Scholarships</option>
                      <option value="Food Relief & Logistics">Food Relief & Community Logistics</option>
                      <option value="Media & Photography">Media, Storytelling & Content</option>
                      <option value="Fundraising & Grants">Fundraising & Grant Writing</option>
                      <option value="Administrative Support">Administrative & IT Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Availability <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="Weekends">Weekends Only</option>
                      <option value="Flexible">Flexible / On Call</option>
                      <option value="Part-time">Part-time (Weekdays)</option>
                      <option value="Full-time">Full-time Volunteer</option>
                      <option value="Remote">Remote / Virtual Only</option>
                    </select>
                  </div>
                </div>

                {/* Experience Bio */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Skills, Background & Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={skillsExperience}
                    onChange={(e) => setSkillsExperience(e.target.value)}
                    placeholder="Tell us about your professional background, past volunteering experience, and how you would love to help..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.skillsExperience && <p className="text-[10px] text-red-500 mt-1">{errors.skillsExperience}</p>}
                </div>

                {/* File Upload (Resume / Bio) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Resume, CV or Bio (Optional, PDF / DOC / Images up to 10MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                  />

                  {resumeUrl ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold truncate">
                        <FileText className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{resumeName || 'Resume_Uploaded.pdf'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResumeUrl('');
                          setResumeName('');
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-[#558b1a] rounded-2xl p-4 text-center cursor-pointer transition-colors group bg-stone-50/50 hover:bg-[#f4faec]/40"
                    >
                      {uploadingFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin text-[#558b1a]" />
                          <span>Uploading file...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-[#558b1a]">
                          <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#558b1a]" />
                          <span className="text-xs font-semibold">Click to upload CV / Resume</span>
                          <span className="text-[10px] text-gray-400">PDF, Word, or Image</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.resume && <p className="text-[10px] text-red-500 mt-1">{errors.resume}</p>}
                </div>

                {/* Additional notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Any Additional Motivation or Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. I have a car and can assist with transportation in Imo State"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                </div>

                {/* Code of Conduct Checkbox */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-[#558b1a] focus:ring-[#558b1a]"
                    />
                    <span>
                      I agree to uphold the Veronica Onyeneke Foundation Volunteer Code of Conduct, respect community dignity, and maintain ethical integrity in all activities.
                    </span>
                  </label>
                  {errors.agreed && <p className="text-[10px] text-red-500 mt-1">{errors.agreed}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingFile}
                    className="px-7 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Volunteer Application</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// =========================================================================
// 2. SKILL ACQUISITION INSTITUTE (VOIE) APPLICATION MODAL
// =========================================================================
export function SkillApplyModal({ isOpen, onClose, defaultCountry = 'Nigeria' }: BaseModalProps) {
  const [country, setCountry] = useState<'Nigeria' | 'Rwanda' | 'USA'>(defaultCountry);
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string>(
    COUNTRY_HUBS.find((c) => c.id === defaultCountry)?.defaultPhone || '+234 '
  );
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
    if (!agreed) errs.agreed = 'Please confirm your commitment to attend training';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0c1a05] to-[#1e3e15] p-6 text-white relative">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-[#558b1a]/40 text-[#8ac43e]">
                <Target className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#8ac43e]">
                VOIE Vocational Training Institute
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Apply for Skills Acquisition</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-lg">
              Gain market-ready vocational skills, free starter toolkits, and micro-business mentorship at the Veronica Onyeneke Institute of Entrepreneurship.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {submittedId ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-bold mb-2">
                  Application ID: {submittedId}
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Thank you, <strong>{applicantName}</strong>. Your application for <strong>{tradeSelected}</strong> ({intakeBatch}) has been received. Our VOIE admissions team will contact you regarding the orientation and verification interview.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.form && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Country / Hub Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Training Location / Country Hub <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {COUNTRY_HUBS.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleCountryChange(h.id as any)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                          country === h.id
                            ? 'border-[#558b1a] bg-[#f4faec] ring-2 ring-[#558b1a]/30'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{h.flag}</span>
                          <span className="font-bold text-xs text-gray-900">{h.label}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{h.hub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="Batch 2026-A">Batch 2026-A (Immediate)</option>
                      <option value="Batch 2026-B">Batch 2026-B (Autumn)</option>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
                </div>

                {/* Course Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Select Vocational Trade <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={tradeSelected}
                      onChange={(e) => setTradeSelected(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
                    >
                      <option value="Fashion Design & Advanced Tailoring">Fashion Design & Advanced Tailoring</option>
                      <option value="ICT, Digital Skills & Web Development">ICT, Digital Skills & Web Development</option>
                      <option value="Baking & Confectionery Arts">Baking & Confectionery Arts</option>
                      <option value="Shoe Making & Handcrafted Leather Works">Shoe Making & Handcrafted Leather Works</option>
                      <option value="Cosmetology, Hair Styling & Makeup">Cosmetology, Hair Styling & Makeup</option>
                      <option value="Electrical Installation & Solar Technology">Electrical Installation & Solar Technology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Highest Education Level
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    >
                      <option value="SSCE / WAEC">SSCE / WAEC / NECO</option>
                      <option value="OND / NCE">OND / NCE</option>
                      <option value="HND / BSc">HND / Bachelor's Degree</option>
                      <option value="Primary">Primary School Leaving</option>
                      <option value="Informal / Other">Informal / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Current Employment Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Unemployed', 'Self-employed', 'Student', 'Apprentice'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEmploymentStatus(st)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          employmentStatus === st
                            ? 'border-[#558b1a] bg-[#f4faec] text-[#4d7f16]'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Statement of Purpose */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Statement of Purpose: Why do you want to learn this skill? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={statementOfPurpose}
                    onChange={(e) => setStatementOfPurpose(e.target.value)}
                    placeholder="Describe how learning this skill will empower you to earn a sustainable livelihood and support your family..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.statementOfPurpose && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.statementOfPurpose}</p>
                  )}
                </div>

                {/* Passport / ID Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Passport Photograph or ID (Optional, JPG / PNG / PDF up to 10MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                  />

                  {documentUrl ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-blue-800 font-semibold truncate">
                        <FileText className="w-4 h-4 shrink-0 text-blue-600" />
                        <span className="truncate">{documentName || 'Passport_Photo.jpg'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentUrl('');
                          setDocumentName('');
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-[#558b1a] rounded-2xl p-4 text-center cursor-pointer transition-colors group bg-stone-50/50 hover:bg-[#f4faec]/40"
                    >
                      {uploadingFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin text-[#558b1a]" />
                          <span>Uploading image...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-[#558b1a]">
                          <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#558b1a]" />
                          <span className="text-xs font-semibold">Click to upload Passport Photo or ID</span>
                          <span className="text-[10px] text-gray-400">JPG, PNG or PDF</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.document && <p className="text-[10px] text-red-500 mt-1">{errors.document}</p>}
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-[#558b1a] focus:ring-[#558b1a]"
                    />
                    <span>
                      I commit to punctually attending all practical workshop sessions at VOIE and completing the course curriculum.
                    </span>
                  </label>
                  {errors.agreed && <p className="text-[10px] text-red-500 mt-1">{errors.agreed}</p>}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingFile}
                    className="px-7 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Enrollment Application</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// =========================================================================
// 3. SCHOLARSHIP AID APPLICATION MODAL
// =========================================================================
export function ScholarshipApplyModal({ isOpen, onClose, defaultCountry = 'Nigeria' }: BaseModalProps) {
  const [country, setCountry] = useState<'Nigeria' | 'Rwanda' | 'USA'>(defaultCountry);
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string>(
    COUNTRY_HUBS.find((c) => c.id === defaultCountry)?.defaultPhone || '+234 '
  );
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCountryChange = (c: 'Nigeria' | 'Rwanda' | 'USA') => {
    setCountry(c);
    const hub = COUNTRY_HUBS.find((h) => h.id === c);
    if (hub && (!phone || phone.trim() === '+234' || phone.trim() === '+250' || phone.trim() === '+1')) {
      setPhone(hub.defaultPhone);
    }
    if (c === 'Nigeria') setAmountRequested(150000);
    else if (c === 'Rwanda') setAmountRequested(250000);
    else setAmountRequested(1500);
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
    if (!applicantName.trim()) errs.applicantName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim() || phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    if (!institutionName.trim()) errs.institutionName = 'Institution name is required';
    if (!courseOfStudy.trim()) errs.courseOfStudy = 'Course of study is required';
    if (!cgpa.trim()) errs.cgpa = 'CGPA / Grade is required';
    if (!amountRequested || amountRequested <= 0) errs.amountRequested = 'Grant amount is required';
    if (!reasonForAid.trim() || reasonForAid.trim().length < 35) {
      errs.reasonForAid = 'Please detail your financial need (at least 35 characters)';
    }
    if (!agreed) errs.agreed = 'Please certify the accuracy of your academic details';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0c1a05] to-[#254b17] p-6 text-white relative">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-[#558b1a]/40 text-[#8ac43e]">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#8ac43e]">
                VOF Academic Scholarship Fund
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Apply for Educational Aid</h2>
            <p className="text-xs text-gray-300 mt-1 max-w-lg">
              Tuition grants, exam registration fee waivers, and academic bursaries for brilliant indigent students across tertiary institutions.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {submittedId ? (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold mb-2">
                  Tracking ID: {submittedId}
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Scholarship Application Logged!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Thank you, <strong>{applicantName}</strong>. Your academic grant application has been submitted to the VOF Scholarship Review Committee for <strong>{country}</strong>. Our academic liaisons will verify your documents and contact your institution.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.form && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Country / Hub Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Select Your Country Hub <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {COUNTRY_HUBS.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleCountryChange(h.id as any)}
                        className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                          country === h.id
                            ? 'border-[#558b1a] bg-[#f4faec] ring-2 ring-[#558b1a]/30'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{h.flag}</span>
                          <span className="font-bold text-xs text-gray-900">{h.label}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{h.hub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Chidiebube Emmanuel Okon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      placeholder="student@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      placeholder="e.g. Mbaitoli / Owerri Municipal"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Educational Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Federal University of Technology Owerri (FUTO)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none font-medium"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
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
                      CGPA / Current Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 4.45 / 5.0"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                    />
                    {errors.cgpa && <p className="text-[10px] text-red-500 mt-1">{errors.cgpa}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Grant Amount Requested <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                        {country === 'Nigeria' ? '₦' : country === 'Rwanda' ? 'RWF' : '$'}
                      </span>
                      <input
                        type="number"
                        value={amountRequested}
                        onChange={(e) => setAmountRequested(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                      />
                    </div>
                    {errors.amountRequested && <p className="text-[10px] text-red-500 mt-1">{errors.amountRequested}</p>}
                  </div>
                </div>

                {/* Reason for Aid */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Reason for Financial Aid & Academic Motivation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={reasonForAid}
                    onChange={(e) => setReasonForAid(e.target.value)}
                    placeholder="Detail your household financial circumstances, academic goals, and how this scholarship will prevent dropout or fund tuition/exam levies..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {errors.reasonForAid && <p className="text-[10px] text-red-500 mt-1">{errors.reasonForAid}</p>}
                </div>

                {/* File Upload: Transcript / Admission Letter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Upload Academic Transcript / Admission Letter / Student ID (PDF, JPG, PNG up to 10MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />

                  {documentUrl ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold truncate">
                        <FileText className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{documentName || 'Academic_Credentials.pdf'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentUrl('');
                          setDocumentName('');
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-[#558b1a] rounded-2xl p-4 text-center cursor-pointer transition-colors group bg-stone-50/50 hover:bg-[#f4faec]/40"
                    >
                      {uploadingFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin text-[#558b1a]" />
                          <span>Uploading credentials...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-[#558b1a]">
                          <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#558b1a]" />
                          <span className="text-xs font-semibold">Click to upload Transcript, ID or Admission Letter</span>
                          <span className="text-[10px] text-gray-400">PDF or Clear Image</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.document && <p className="text-[10px] text-red-500 mt-1">{errors.document}</p>}
                </div>

                {/* Attestation Checkbox */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-[#558b1a] focus:ring-[#558b1a]"
                    />
                    <span>
                      I hereby certify that all information submitted is true and complete. I authorize VOF to verify my academic standing with my institution.
                    </span>
                  </label>
                  {errors.agreed && <p className="text-[10px] text-red-500 mt-1">{errors.agreed}</p>}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploadingFile}
                    className="px-7 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Scholarship Application</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
