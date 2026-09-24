"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconCopy,
  IconCheck,
  IconHeart,
  IconRepeat,
  IconCreditCard,
  IconBrandPaypal,
  IconBrandStripe,
  IconBuildingBank,
  IconExternalLink,
  IconShieldCheck,
  IconAlertCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { PaystackIcon, ZelleIcon } from "./PaymentIcons";

export type DonationMethod = "paystack" | "paypal" | "stripe" | "zelle" | "bank";
export type DonationFrequency = "once" | "monthly";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMethod?: DonationMethod;
  initialFrequency?: DonationFrequency;
}

// Client-side Paystack script loader (SSR-safe)
const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    // @ts-expect-error PaystackPop attached to window
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const existing = document.getElementById("paystack-inline-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PAYPAL_EMAIL = "veronicaonyenekefoundation@gmail.com";
const STRIPE_EMAIL = "veronicaonyenekefoundation@gmail.com";
const ZELLE_EMAIL = "vofcorp@gmail.com";

const NGN_PRESETS = ["5,000", "10,000", "25,000", "50,000", "100,000"];
const USD_PRESETS = ["25", "50", "100", "250", "500"];

function DonateModalContent({
  isOpen = true,
  onClose,
  initialMethod = "paystack",
  initialFrequency = "once",
}: DonateModalProps) {
  const isUsdDefault = ["paypal", "stripe", "zelle"].includes(initialMethod);
  const [method, setMethod] = useState<DonationMethod>(initialMethod);
  const [frequency, setFrequency] = useState<DonationFrequency>(initialFrequency);
  const [currency, setCurrency] = useState<"NGN" | "USD">(isUsdDefault ? "USD" : "NGN");
  const [amount, setAmount] = useState<string>(isUsdDefault ? "50" : "25,000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingPaystack, setIsLoadingPaystack] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle currency change
  const handleCurrencyChange = (newCurr: "NGN" | "USD") => {
    setCurrency(newCurr);
    setAmount(newCurr === "USD" ? "50" : "25,000");
    setCustomAmount("");
    if (newCurr === "USD" && method === "bank") {
      setMethod("zelle");
    } else if (newCurr === "NGN" && ["paypal", "stripe", "zelle"].includes(method)) {
      setMethod("paystack");
    }
  };

  const handleMethodChange = (newMethod: DonationMethod) => {
    setMethod(newMethod);
    setErrorMessage(null);
    if (["paypal", "stripe", "zelle"].includes(newMethod)) {
      if (currency !== "USD") {
        setCurrency("USD");
        setAmount("50");
      }
    } else if (newMethod === "bank") {
      if (currency !== "NGN") {
        setCurrency("NGN");
        setAmount("25,000");
      }
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const activeAmount = customAmount.trim() ? customAmount.replace(/,/g, "") : amount.replace(/,/g, "");
  const isRecurring = frequency === "monthly";

  // Trigger Paystack Payment
  const handlePaystackPayment = async () => {
    setErrorMessage(null);

    if (!donorEmail || !donorEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address for your official receipt.");
      return;
    }

    const numericAmount = parseFloat(activeAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Please select or enter a valid donation amount.");
      return;
    }

    const paystackKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_API ||
      "pk_live_3d3b003ff0ed56bc07a5cd8c89935ad69584ea28";

    setIsLoadingPaystack(true);
    const scriptLoaded = await loadPaystackScript();
    setIsLoadingPaystack(false);

    if (!scriptLoaded) {
      setErrorMessage("Unable to connect to Paystack payment gateway. Please check your internet connection.");
      return;
    }

    try {
      const amountInKobo = Math.round(numericAmount * 100);
      const monthlyPlan = process.env.NEXT_PUBLIC_PAYSTACK_MONTHLY_PLAN_CODE;

      // @ts-expect-error PaystackPop is global
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: donorEmail.trim(),
        amount: amountInKobo,
        currency: currency === "USD" ? "USD" : "NGN",
        ...(isRecurring && monthlyPlan ? { plan: monthlyPlan } : {}),
        metadata: {
          custom_fields: [
            {
              display_name: "Donor Name",
              variable_name: "donor_name",
              value: donorName.trim() || "Anonymous Supporter",
            },
            {
              display_name: "Donation Frequency",
              variable_name: "donation_frequency",
              value: isRecurring ? "Monthly Recurring" : "One-Time Donation",
            },
            {
              display_name: "Cause",
              variable_name: "cause",
              value: "Veronica Onyeneke Foundation Community Support",
            },
          ],
        },
        callback: (response: { reference: string }) => {
          setSuccessReference(response.reference);
        },
        onClose: () => {
          // Donor dismissed the modal without payment
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack checkout error:", err);
      setErrorMessage("Failed to initiate Paystack checkout. Please try again or use direct bank transfer.");
    }
  };

  // Trigger PayPal Payment
  const handlePayPalPayment = () => {
    const numericAmount = parseFloat(activeAmount) || 50;
    const recurringParam = isRecurring ? "&recurring=1" : "";
    const paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(
      PAYPAL_EMAIL
    )}&currency_code=USD&amount=${encodeURIComponent(numericAmount.toString())}${recurringParam}`;
    window.open(paypalUrl, "_blank", "noopener,noreferrer");
  };

  // Trigger Stripe Payment
  const handleStripePayment = () => {
    const directLink = isRecurring
      ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_LINK || process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK
      : process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

    if (directLink) {
      window.open(directLink, "_blank", "noopener,noreferrer");
      return;
    }

    // Pre-fill email invoice or card payment request
    const subject = encodeURIComponent(
      `VOF Donation via Stripe (${isRecurring ? "Monthly Recurring" : "One-Time"})`
    );
    const body = encodeURIComponent(
      `Hello Veronica Onyeneke Foundation team,\n\nI would like to make a ${
        isRecurring ? "monthly recurring" : "one-time"
      } donation of $${activeAmount} via Stripe.\n\nDonor Name: ${donorName || "Supporter"}\nDonor Email: ${
        donorEmail || "Not specified"
      }\n\nPlease share the direct Stripe checkout link or invoice.\n\nThank you!`
    );
    window.location.href = `mailto:${STRIPE_EMAIL}?subject=${subject}&body=${body}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-3 sm:p-4 md:p-6"
      >
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white text-gray-900 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl z-10 border border-gray-100"
        >
          {/* Top Bar Header */}
          <div className="relative bg-gradient-to-r from-[#0c1a05] via-[#16300a] to-[#254b12] text-white px-6 py-5 shrink-0 flex items-start justify-between">
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#8ac43e] bg-white/10 px-2.5 py-0.5 rounded-full">
                  <IconHeart className="w-3 h-3 text-[#8ac43e] fill-current" />
                  Make an Impact
                </span>
                {isRecurring && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    <IconRepeat className="w-3 h-3 animate-spin-slow" />
                    Monthly Recurring
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Support Veronica Onyeneke Foundation
              </h3>
              <p className="text-gray-300 text-xs mt-1">
                Your contribution equips youth with vocational skills, sponsors students, and protects vulnerable young mothers.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-200 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto px-6 py-5 space-y-5 flex-grow">
            {/* Success View */}
            {successReference ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <IconCheck className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold text-gray-900">Thank You for Your Generosity!</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Your contribution directly touches lives in our community. An official receipt has been generated.
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 text-xs font-mono text-gray-700">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Transaction Reference:</span>
                  <strong>{successReference}</strong>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#558b1a] text-white font-bold rounded-xl text-xs hover:bg-[#457214] transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* 1. FREQUENCY SELECTOR: ONE-TIME VS RECURRING */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    Donation Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFrequency("once")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        frequency === "once"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <IconHeart className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>One-Time Gift</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        frequency === "monthly"
                          ? "bg-[#558b1a] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <IconRepeat className="w-3.5 h-3.5" />
                      <span>Monthly Recurring</span>
                    </button>
                  </div>
                  {isRecurring && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-xl text-[11px] text-emerald-800">
                      <IconSparkles className="w-3.5 h-3.5 text-[#558b1a] shrink-0" />
                      <span>
                        <strong>Monthly Partner:</strong> Provides reliable recurring support to sustain students and young mothers each month. Cancel anytime.
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. CURRENCY & AMOUNT SELECTION */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Select Amount ({currency})
                    </label>
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange("NGN")}
                        className={`px-2 py-1 rounded-md transition-colors ${
                          currency === "NGN" ? "bg-white text-[#558b1a] shadow-xs font-bold" : "text-gray-600"
                        }`}
                      >
                        ₦ NGN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange("USD")}
                        className={`px-2 py-1 rounded-md transition-colors ${
                          currency === "USD" ? "bg-white text-[#558b1a] shadow-xs font-bold" : "text-gray-600"
                        }`}
                      >
                        $ USD
                      </button>
                    </div>
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2.5">
                    {(currency === "NGN" ? NGN_PRESETS : USD_PRESETS).map((preset) => {
                      const isSelected = amount === preset && !customAmount;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmount(preset);
                            setCustomAmount("");
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#558b1a] text-white border-[#558b1a] shadow-xs"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-stone-50"
                          }`}
                        >
                          {currency === "NGN" ? `₦${preset}` : `$${preset}`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">
                      {currency === "NGN" ? "₦ Custom:" : "$ Custom:"}
                    </span>
                    <input
                      type="number"
                      placeholder="Enter custom amount..."
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-24 pr-4 py-2.5 bg-stone-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:bg-white"
                    />
                  </div>
                </div>

                {/* 3. PAYMENT GATEWAY TABS */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {/* Paystack */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("paystack")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        method === "paystack"
                          ? "bg-[#00c3f7]/10 border-[#00c3f7] text-[#057a9c] ring-1 ring-[#00c3f7]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <PaystackIcon className="w-5 h-5 text-[#00c3f7] mb-1" />
                      <span>Paystack</span>
                      <span className="text-[9px] text-gray-400 font-normal">Card / NGN</span>
                    </button>

                    {/* PayPal */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("paypal")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        method === "paypal"
                          ? "bg-[#0070ba]/10 border-[#0070ba] text-[#004b7d] ring-1 ring-[#0070ba]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <IconBrandPaypal className="w-5 h-5 text-[#0070ba] mb-1" />
                      <span>PayPal</span>
                      <span className="text-[9px] text-gray-400 font-normal">USD / Global</span>
                    </button>

                    {/* Stripe */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("stripe")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        method === "stripe"
                          ? "bg-[#635bff]/10 border-[#635bff] text-[#4d44db] ring-1 ring-[#635bff]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <IconBrandStripe className="w-5 h-5 text-[#635bff] mb-1" />
                      <span>Stripe</span>
                      <span className="text-[9px] text-gray-400 font-normal">Debit / Credit</span>
                    </button>

                    {/* Zelle */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("zelle")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        method === "zelle"
                          ? "bg-[#7414ca]/10 border-[#7414ca] text-[#550c99] ring-1 ring-[#7414ca]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <ZelleIcon className="w-5 h-5 text-[#7414ca] mb-1" />
                      <span>Zelle</span>
                      <span className="text-[9px] text-gray-400 font-normal">USA Direct</span>
                    </button>

                    {/* Bank Transfer */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("bank")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                        method === "bank"
                          ? "bg-[#558b1a]/10 border-[#558b1a] text-[#457214] ring-1 ring-[#558b1a]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <IconBuildingBank className="w-5 h-5 text-[#558b1a] mb-1" />
                      <span>Bank Wire</span>
                      <span className="text-[9px] text-gray-400 font-normal">GTBank/Zenith</span>
                    </button>
                  </div>
                </div>

                {/* 4. METHOD DETAILS & ACTION SECTION */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-gray-200/80 space-y-4">
                  {/* PAYSTACK METHOD VIEW */}
                  {method === "paystack" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PaystackIcon className="w-4 h-4 text-[#00c3f7]" />
                          <span className="text-xs font-bold text-gray-900">
                            Paystack Secure Checkout {isRecurring ? "(Monthly Subscription)" : ""}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#00c3f7]/15 text-[#0383a8] px-2 py-0.5 rounded-full">
                          Cards • Bank • USSD • Apple Pay
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Your Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00c3f7]"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Full Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Veronica Okeke"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00c3f7]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePaystackPayment}
                        disabled={isLoadingPaystack}
                        className="w-full py-3 px-4 rounded-xl bg-[#00c3f7] hover:bg-[#00aedd] text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isLoadingPaystack ? (
                          <span>Connecting to Paystack...</span>
                        ) : (
                          <>
                            <IconCreditCard className="w-4 h-4" />
                            <span>
                              {isRecurring
                                ? `Give ₦${activeAmount} Monthly via Paystack`
                                : `Give ₦${activeAmount} Once via Paystack`}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* PAYPAL METHOD VIEW */}
                  {method === "paypal" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconBrandPaypal className="w-4 h-4 text-[#0070ba]" />
                          <span className="text-xs font-bold text-gray-900">
                            PayPal Donation {isRecurring ? "(Monthly)" : ""}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#0070ba]/10 text-[#0070ba] px-2 py-0.5 rounded-full">
                          Official Account
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                            Recipient PayPal Email:
                          </span>
                          <span className="text-xs font-mono font-bold text-gray-900">{PAYPAL_EMAIL}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(PAYPAL_EMAIL, "paypal")}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === "paypal" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handlePayPalPayment}
                        className="w-full py-3 px-4 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                      >
                        <IconBrandPaypal className="w-4 h-4" />
                        <span>
                          {isRecurring
                            ? `Donate $${activeAmount} Monthly with PayPal`
                            : `Donate $${activeAmount} Once with PayPal`}
                        </span>
                        <IconExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* STRIPE METHOD VIEW */}
                  {method === "stripe" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconBrandStripe className="w-4 h-4 text-[#635bff]" />
                          <span className="text-xs font-bold text-gray-900">
                            Stripe Direct Giving {isRecurring ? "(Monthly)" : ""}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#635bff]/10 text-[#635bff] px-2 py-0.5 rounded-full">
                          Cards & Apple Pay
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                            Stripe Organization Email:
                          </span>
                          <span className="text-xs font-mono font-bold text-gray-900">{STRIPE_EMAIL}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(STRIPE_EMAIL, "stripe")}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === "stripe" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleStripePayment}
                        className="w-full py-3 px-4 rounded-xl bg-[#635bff] hover:bg-[#534ac9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                      >
                        <IconBrandStripe className="w-4 h-4" />
                        <span>
                          {isRecurring
                            ? `Proceed with $${activeAmount} Monthly via Stripe`
                            : `Proceed with $${activeAmount} Once via Stripe`}
                        </span>
                        <IconExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* ZELLE METHOD VIEW */}
                  {method === "zelle" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ZelleIcon className="w-4 h-4 text-[#7414ca]" />
                          <span className="text-xs font-bold text-gray-900">
                            Zelle (U.S. 501(c)(3) Direct Transfer)
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#7414ca]/10 text-[#7414ca] px-2 py-0.5 rounded-full">
                          Tax Deductible
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Zelle Identifier:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(ZELLE_EMAIL, "zelle")}
                            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-md text-[11px] font-semibold text-purple-700 flex items-center gap-1 transition-colors"
                          >
                            {copiedKey === "zelle" ? (
                              <>
                                <IconCheck className="w-3 h-3 text-green-600" />
                                <span className="text-green-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <IconCopy className="w-3 h-3" />
                                <span>Copy Zelle Address</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-sm font-mono font-bold text-gray-900">{ZELLE_EMAIL}</div>
                        <div className="text-xs text-gray-600">
                          Recipient: <strong>Veronica Onyeneke Foundation Corp.</strong>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950 space-y-1">
                        <span className="font-bold block text-purple-900">
                          {isRecurring ? "Setting Up Monthly Recurring in Zelle:" : "How to send via Zelle:"}
                        </span>
                        <p className="text-[11px] leading-relaxed text-purple-900">
                          {isRecurring
                            ? "Open your mobile banking app (Chase, BoA, Wells Fargo, etc.), select Zelle > Send Money to vofcorp@gmail.com, and enable 'Repeat this payment' / 'Monthly auto-pay'."
                            : "Open your mobile banking app, select Zelle, and send your gift to vofcorp@gmail.com. Zero transaction fees."}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href="https://enroll.zellepay.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#7414ca] hover:bg-[#600ea8] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                        >
                          <span>Open Zelle Info / Enroll</span>
                          <IconExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ZELLE_EMAIL, "zelle-action")}
                          className="py-2.5 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors"
                        >
                          {copiedKey === "zelle-action" ? "Copied!" : "Copy Address"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DIRECT BANK TRANSFER VIEW */}
                  {method === "bank" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconBuildingBank className="w-4 h-4 text-[#558b1a]" />
                          <span className="text-xs font-bold text-gray-900">Direct Nigerian Bank Accounts</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#558b1a]/10 text-[#558b1a] px-2 py-0.5 rounded-full">
                          NGN Wire / App Transfer
                        </span>
                      </div>

                      {/* GTBank Card */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#558b1a] block">Guaranty Trust Bank (GTBank)</span>
                          <div className="text-sm font-mono font-bold text-gray-900">3000273596</div>
                          <div className="text-[11px] text-gray-500">Veronica Onyeneke Foundation</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("3000273596", "gtb")}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === "gtb" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Zenith Bank Card */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#558b1a] block">Zenith Bank</span>
                          <div className="text-sm font-mono font-bold text-gray-900">1228980969</div>
                          <div className="text-[11px] text-gray-500">Veronica Onyeneke Foundation</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("1228980969", "zenith")}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === "zenith" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isRecurring && (
                        <p className="text-[11px] text-gray-500 leading-relaxed italic">
                          💡 Tip: To make this a monthly recurring donation, you can set up a scheduled recurring standing order directly in your GTBank or Zenith Bank mobile banking app.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <IconAlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Trust Footer Note */}
                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <IconShieldCheck className="w-4 h-4 text-[#558b1a]" />
                    <span>256-bit SSL encrypted • 501(c)(3) verified nonprofit</span>
                  </div>
                  <span>Send receipt confirmations to <strong>info@vonf.org</strong></span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function DonateModal(props: DonateModalProps) {
  if (!props.isOpen) return null;
  return (
    <DonateModalContent
      key={`${props.initialMethod || "paystack"}-${props.initialFrequency || "once"}`}
      {...props}
    />
  );
}
