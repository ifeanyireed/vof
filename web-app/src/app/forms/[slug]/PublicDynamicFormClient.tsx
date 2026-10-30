'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Printer,
  ChevronRight,
  RefreshCw,
  Home
} from 'lucide-react';
import { CustomForm, FormField } from '@/types/forms';
import { api } from '@/lib/api';
import Footer from '@/components/Footer';

interface PublicDynamicFormClientProps {
  initialForm: CustomForm;
}

export default function PublicDynamicFormClient({
  initialForm,
}: PublicDynamicFormClientProps) {
  const form = initialForm;
  const isClosed = form.status === 'closed';

  // Form Field Values
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<
    { fieldId: string; name: string; url: string; size?: number; type?: string }[]
  >([]);
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    message: string;
    redirectUrl?: string;
  } | null>(null);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleCheckboxToggle = (fieldId: string, option: string) => {
    const current = Array.isArray(formData[fieldId]) ? [...formData[fieldId]] : [];
    const idx = current.indexOf(option);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(option);
    }
    handleInputChange(fieldId, current);
  };

  const handleFileUpload = async (field: FormField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds the 15MB limit.');
      return;
    }

    setUploadingFieldId(field.id);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const fileUrl = data.url || data.secure_url || '';

      setUploadedFiles((prev) => [
        ...prev.filter((f) => f.fieldId !== field.id),
        {
          fieldId: field.id,
          name: file.name,
          url: fileUrl,
          size: file.size,
          type: file.type,
        },
      ]);
      handleInputChange(field.id, fileUrl);
    } catch (err: any) {
      alert(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploadingFieldId(null);
    }
  };

  const removeUploadedFile = (fieldId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.fieldId !== fieldId));
    handleInputChange(fieldId, '');
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    form.fields.forEach((field) => {
      if (field.type === 'section') return;

      const val = formData[field.id];
      const hasUploadedFile = uploadedFiles.some((f) => f.fieldId === field.id);

      if (field.required) {
        if (field.type === 'file') {
          if (!hasUploadedFile && !val) {
            errors[field.id] = `${field.label} is required`;
          }
        } else if (
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0)
        ) {
          errors[field.id] = `${field.label} is required`;
        }
      }

      // Email format check
      if (field.type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val).trim())) {
          errors[field.id] = 'Please enter a valid email address';
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      setFormError('Please resolve the highlighted fields before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.submitPublicForm(form.slug, {
        data: formData,
        files: uploadedFiles,
      });

      setSubmissionResult({
        referenceId: res.referenceId,
        message: res.message,
        redirectUrl: res.redirectUrl,
      });

      if (res.redirectUrl) {
        setTimeout(() => {
          window.location.href = res.redirectUrl!;
        }, 3000);
      }
    } catch (err: any) {
      setFormError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 flex flex-col justify-between">
      {/* 0. STATUTORY REGISTRATION BANNER */}
      <div>
        <div className="w-full bg-[#1b380a] text-white py-1.5 px-4 text-center text-xs font-medium border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-block w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
            <span>The Trustees of Veronica Onyeneke Foundation</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-200">Registered in Nigeria (CAC/IT Reg. No: 8101466, Inc. Nov 27, 2024)</span>
            <span className="text-gray-300">•</span>
            <Link href="/about#legal-entities" className="text-[#a3e635] hover:underline font-semibold ml-1">
              View Statutory Registration & Entity Details &rarr;
            </Link>
          </div>
        </div>

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md w-full border-b border-gray-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
                alt="Veronica Onyeneke Foundation Logo"
                width={180}
                height={50}
                className="object-contain h-11 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/programs"
                className="text-xs font-bold text-gray-700 hover:text-[#558b1a] transition"
              >
                All Programs
              </Link>
              <Link
                href="/contact"
                className="text-xs font-bold text-gray-700 hover:text-[#558b1a] transition"
              >
                Contact
              </Link>
              <Link
                href="/donate"
                className="px-4 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs"
              >
                Donate
              </Link>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {submissionResult ? (
            /* Success Screen */
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-200 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Submission Verified
                </span>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mt-4">
                  {form.settings?.successTitle || 'Response Submitted Successfully'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
                  {submissionResult.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-gray-200 max-w-md mx-auto text-left space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Reference Code:</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">
                    {submissionResult.referenceId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Form Name:</span>
                  <span className="font-semibold text-gray-900">{form.title}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Organization:</span>
                  <span className="font-semibold text-gray-900">VOF Secretariat</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-gray-500" />
                  <span>Print Receipt</span>
                </button>
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Home className="w-4 h-4" />
                  <span>Back to Homepage</span>
                </Link>
              </div>
            </div>
          ) : isClosed ? (
            /* Closed State */
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Applications Closed
                </span>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mt-4">
                  {form.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
                  Submissions for this program are currently closed. For inquiries regarding upcoming enrollment cycles or special requests, please contact our secretariat.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-2.5 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white text-xs font-bold transition"
                >
                  Contact Secretariat
                </Link>
                <Link
                  href="/programs"
                  className="px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
                >
                  Explore Other Programs
                </Link>
              </div>
            </div>
          ) : (
            /* Active Form Card */
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Hero Header */}
              <div className="bg-gradient-to-r from-[#0c1a05] via-[#162f0d] to-[#091503] text-white p-8 sm:p-10 border-b border-[#2b5219]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#8ac43e]/20 text-[#8ac43e] border border-[#8ac43e]/30">
                    {form.category || 'Official Intake'}
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8ac43e]" />
                    <span>Verified Official VOF Application</span>
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  {form.title}
                </h1>

                {form.description && (
                  <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed max-w-2xl">
                    {form.description}
                  </p>
                )}
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
                {formError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {form.fields.map((field) => {
                    const isHalf = field.width === 'half' && field.type !== 'section';
                    const err = fieldErrors[field.id];

                    return (
                      <div
                        key={field.id}
                        className={isHalf ? 'col-span-1' : 'col-span-1 sm:col-span-2'}
                      >
                        {field.type === 'section' ? (
                          <div className="pt-6 pb-2 border-t border-gray-200">
                            <h3 className="font-serif text-xl font-bold text-gray-900">
                              {field.label}
                            </h3>
                            {field.helperText && (
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {field.helperText}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs font-bold text-gray-800 block mb-1.5">
                              {field.label}
                              {field.required && (
                                <span className="text-rose-500 ml-1 font-bold">*</span>
                              )}
                            </label>

                            {field.type === 'textarea' ? (
                              <textarea
                                rows={4}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                                  err
                                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                                    : 'border-gray-300 focus:border-[#558b1a]'
                                }`}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                value={formData[field.id] || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white focus:outline-none transition ${
                                  err
                                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                                    : 'border-gray-300 focus:border-[#558b1a]'
                                }`}
                              >
                                <option value="">Select an option...</option>
                                {(field.options || []).map((opt, i) => (
                                  <option key={i} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'radio' ? (
                              <div className="space-y-2 pt-1">
                                {(field.options || []).map((opt, i) => (
                                  <label
                                    key={i}
                                    className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-800"
                                  >
                                    <input
                                      type="radio"
                                      name={field.id}
                                      value={opt}
                                      checked={formData[field.id] === opt}
                                      onChange={() => handleInputChange(field.id, opt)}
                                      className="text-[#558b1a] focus:ring-[#558b1a]"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : field.type === 'checkbox' ? (
                              <div className="space-y-2 pt-1">
                                {(field.options || []).map((opt, i) => {
                                  const checked =
                                    Array.isArray(formData[field.id]) &&
                                    formData[field.id].includes(opt);
                                  return (
                                    <label
                                      key={i}
                                      className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-800"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleCheckboxToggle(field.id, opt)}
                                        className="rounded text-[#558b1a] focus:ring-[#558b1a]"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : field.type === 'file' ? (
                              <div>
                                {uploadedFiles.some((f) => f.fieldId === field.id) ? (
                                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2 truncate">
                                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                      <span className="text-xs font-bold text-emerald-900 truncate">
                                        {uploadedFiles.find((f) => f.fieldId === field.id)?.name}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeUploadedFile(field.id)}
                                      className="text-rose-500 hover:text-rose-700 p-1"
                                      title="Remove file"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label
                                    className={`w-full p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                                      uploadingFieldId === field.id
                                        ? 'bg-gray-100 border-gray-400'
                                        : err
                                        ? 'border-rose-400 bg-rose-50/20'
                                        : 'border-gray-300 hover:border-[#558b1a] bg-stone-50/50'
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleFileUpload(field, e)}
                                      disabled={uploadingFieldId === field.id}
                                    />
                                    {uploadingFieldId === field.id ? (
                                      <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="w-4 h-4 border-2 border-[#558b1a]/30 border-t-[#558b1a] rounded-full animate-spin" />
                                        <span>Uploading file to secure cloud...</span>
                                      </div>
                                    ) : (
                                      <>
                                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                        <span className="text-xs font-bold text-gray-700">
                                          Click to browse or upload file
                                        </span>
                                        <span className="text-[10px] text-gray-400 mt-0.5">
                                          PDF, DOC, DOCX, JPG, PNG (Max 15MB)
                                        </span>
                                      </>
                                    )}
                                  </label>
                                )}
                              </div>
                            ) : (
                              <input
                                type={field.type}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition ${
                                  err
                                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                                    : 'border-gray-300 focus:border-[#558b1a]'
                                }`}
                              />
                            )}

                            {err ? (
                              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                                {err}
                              </p>
                            ) : field.helperText ? (
                              <p className="text-[11px] text-gray-500 mt-1">
                                {field.helperText}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Privacy & Stewardship Disclaimer */}
                <div className="pt-4 border-t border-gray-100 flex items-start gap-2.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-[#558b1a] shrink-0 mt-0.5" />
                  <p>
                    By submitting this application, you acknowledge that all provided information is true and verifiable. Personal details are securely stewarded under the Foundation&apos;s{' '}
                    <Link href="/privacy" className="text-[#558b1a] underline font-semibold">
                      Privacy Policy
                    </Link>{' '}
                    and will only be used for official evaluation.
                  </p>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-[#558b1a] hover:bg-[#477516] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Response...</span>
                    </>
                  ) : (
                    <>
                      <span>{form.settings?.submitButtonText || 'Submit Application'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
