"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconCheck,
  IconHeartHandshake,
  IconShieldCheck,
  IconLoader2,
  IconArrowRight,
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconBriefcase
} from "@tabler/icons-react";
import { api, PartnerItem } from "@/lib/api";

export interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
  initialInterest?: string;
}

export default function PartnerModal({
  isOpen,
  onClose,
  initialType = "Corporate",
  initialInterest = "Vocational Training & Starter Kits (VOIE)"
}: PartnerModalProps) {
  const [formData, setFormData] = useState({
    organizationName: "",
    partnerType: initialType,
    contactPerson: "",
    email: "",
    phone: "",
    country: "Nigeria",
    city: "",
    website: "",
    partnershipInterest: initialInterest,
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedPartner, setSubmittedPartner] = useState<PartnerItem | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const resetForm = () => {
    setFormData({
      organizationName: "",
      partnerType: initialType,
      contactPerson: "",
      email: "",
      phone: "",
      country: "Nigeria",
      city: "",
      website: "",
      partnershipInterest: initialInterest,
      message: ""
    });
    setSuccess(false);
    setSubmittedPartner(null);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationName.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
      setErrorMessage("Please provide your organization name, contact person, and a valid email address.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const created = await api.createPartner({
        organizationName: formData.organizationName.trim(),
        partnerType: formData.partnerType,
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country,
        city: formData.city.trim(),
        website: formData.website.trim(),
        partnershipInterest: formData.partnershipInterest,
        message: formData.message.trim(),
        status: "new"
      });

      setSubmittedPartner(created);
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit proposal. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-40"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white text-gray-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl z-50 border border-gray-100 my-auto"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#0c1a05] via-[#16300a] to-[#254b12] text-white px-6 sm:px-8 py-5 sm:py-6 shrink-0 flex items-start justify-between">
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1.5 rounded-lg bg-[#558b1a]/40 text-[#8ac43e] inline-flex items-center justify-center">
                  <IconHeartHandshake className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8ac43e]">
                  VOF Institutional & Corporate Partnerships
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Become a Partner
              </h2>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                Collaborate with the Veronica Onyeneke Foundation to expand educational access, fund vocational cohorts, and support vulnerable young mothers.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(92vh-120px)] space-y-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 px-4 sm:px-8 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#558b1a] flex items-center justify-center mx-auto shadow-sm">
                  <IconCheck className="w-8 h-8" />
                </div>

                {submittedPartner?.id && (
                  <span className="inline-block px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-[#477516] rounded-full text-xs font-bold font-mono">
                    Ref ID: #PRT-{submittedPartner.id}
                  </span>
                )}

                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">
                    Partnership Proposal Received!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-lg mx-auto mt-2 leading-relaxed">
                    Thank you for proposing to partner with the Veronica Onyeneke Foundation. Your proposal has been securely dispatched to our partnership team. We will review your details and reach out within 24–48 hours.
                  </p>
                </div>

                <div className="p-4 bg-[#fbfdf9] border border-[#d6f0b0] rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Organization:</span>
                    <span className="font-bold text-gray-900">{formData.organizationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact:</span>
                    <span className="font-semibold text-gray-800">{formData.contactPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primary Focus:</span>
                    <span className="font-semibold text-[#558b1a]">{formData.partnershipInterest}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                    className="w-full sm:w-auto px-7 py-2.5 bg-[#558b1a] text-white font-bold text-xs rounded-full hover:bg-[#477516] transition-all cursor-pointer shadow-sm"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 text-gray-700 font-semibold text-xs rounded-full hover:bg-stone-200 transition-all cursor-pointer"
                  >
                    Submit Another Proposal
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Organization Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Organization / Company / School Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="e.g. Zenith Corp, Horizon High School"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Partner Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.partnerType}
                      onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-white text-gray-800"
                    >
                      <option value="Corporate">Corporate / Enterprise</option>
                      <option value="School">School / Educational Institution</option>
                      <option value="Private Company">Private Company / SME</option>
                      <option value="NGO">NGO / Non-Profit Organisation</option>
                      <option value="Faith-Based">Faith-Based Group / Church</option>
                      <option value="Individual">Individual / Philanthropist</option>
                      <option value="Healthcare">Healthcare / Clinic</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Contact Person Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Dr. Ngozi Eze / Michael Brown"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partner@organization.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Location and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Country Hub
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-white text-gray-800"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="USA">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Other">Other Country</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Owerri, Kigali, Denver"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Website & Primary Focus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Website / Organization URL
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Primary Area of Interest
                    </label>
                    <select
                      value={formData.partnershipInterest}
                      onChange={(e) => setFormData({ ...formData, partnershipInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-white text-gray-800"
                    >
                      <option value="Vocational Training & Starter Kits (VOIE)">Vocational Training & Starter Kits (VOIE)</option>
                      <option value="Maternal Dignity & Young Mothers Support">Maternal Dignity & Young Mothers Support</option>
                      <option value="Academic Scholarships (JAMB / Secondary / Tertiary)">Academic Scholarships (JAMB / Secondary / Tertiary)</option>
                      <option value="Corporate CSR & Program Sponsorship">Corporate CSR & Program Sponsorship</option>
                      <option value="Facility, Tools & In-Kind Equipment">Facility, Tools & In-Kind Equipment</option>
                      <option value="Technology & Cybersecurity Support">Technology & Cybersecurity Support</option>
                      <option value="Other Collaborative Initiative">Other Collaborative Initiative</option>
                    </select>
                  </div>
                </div>

                {/* Collaboration Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Collaboration Proposal / Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your organization and how you envision partnering with VOF to empower vulnerable women and youths..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#558b1a]/30 focus:border-[#558b1a] bg-stone-50/50 resize-y"
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <IconShieldCheck className="w-4 h-4 text-[#558b1a] shrink-0" />
                    <span>All proposals are kept strictly confidential and reviewed by VOF leadership.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-1/2 sm:w-auto px-7 py-2.5 bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold rounded-full hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <IconLoader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Proposal</span>
                          <IconArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
