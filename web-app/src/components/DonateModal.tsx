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
import { PaystackIcon, ZelleIcon, VenmoIcon } from "./PaymentIcons";
import { api } from "@/lib/api";

export type DonationMethod = "paystack" | "paypal" | "venmo" | "stripe" | "zelle" | "bank";
export type DonationFrequency = "once" | "monthly";

export const DONATION_PURPOSES = [
  { id: "pregnant_women", label: "Pregnant Women Support", full: "Pregnant Women Support", desc: "Maternal healthcare, nutrition, dignity kits & young mother mentorship" },
  { id: "youth_empowerment", label: "Youth Empowerment", full: "Youth Empowerment", desc: "Vocational skills at VOIE, technical trade tools & micro-starter kits" },
  { id: "education_sponsorship", label: "Education Sponsorship", full: "Education Sponsorship", desc: "Tertiary tuition grants, secondary school scholarships & WAEC/JAMB exam fees" },
] as const;

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

const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "vofcorp@gmail.com";
const PAYPAL_BUTTON_ID = process.env.NEXT_PUBLIC_PAYPAL_BUTTON_ID || "4EQ884ALV9XXN";
const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "BAALx1cFZ0dxGfpAwGksKYL4QjK4uQRxPrEHLlkhxTBQrZFBI0k1gJEie_k3tgXTWBqZWyKoYZnweWQ8Gg";
const PAYPAL_SDK_URL = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&enable-funding=venmo&currency=USD`;
const PAYPAL_DONATE_URL =
  process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL ||
  `https://www.paypal.com/ncp/payment/${PAYPAL_BUTTON_ID}`;
const STRIPE_EMAIL = process.env.NEXT_PUBLIC_STRIPE_EMAIL || "vofcorp@gmail.com";
const ZELLE_EMAIL = "vofcorp@gmail.com";
const VENMO_DONATE_URL = process.env.NEXT_PUBLIC_VENMO_URL || "";

// Client-side PayPal Hosted Buttons script loader (SSR-safe)
const loadPayPalScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    // @ts-expect-error window.paypal
    if (window.paypal && window.paypal.HostedButtons) {
      resolve(true);
      return;
    }
    const existing = document.getElementById("paypal-hosted-buttons-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-hosted-buttons-js";
    script.src = PAYPAL_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const NGN_PRESETS = ["5,000", "10,000", "25,000", "50,000", "100,000"];
const USD_PRESETS = ["25", "50", "100", "250", "500"];

function DonateModalContent({
  isOpen = true,
  onClose,
  initialMethod = "paystack",
  initialFrequency = "once",
}: DonateModalProps) {
  const isUsdDefault = ["paypal", "venmo", "stripe", "zelle"].includes(initialMethod);
  const [method, setMethod] = useState<DonationMethod>(initialMethod);
  const [frequency, setFrequency] = useState<DonationFrequency>(initialFrequency);
  const [currency, setCurrency] = useState<"NGN" | "USD">(isUsdDefault ? "USD" : "NGN");
  const [amount, setAmount] = useState<string>(isUsdDefault ? "50" : "25,000");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("Pregnant Women Support");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingPaystack, setIsLoadingPaystack] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  const activeAmount = customAmount.trim() ? customAmount.replace(/,/g, "") : amount.replace(/,/g, "");
  const isRecurring = frequency === "monthly";

  // Direct Bank Transfer Notification State
  const [showTransferForm, setShowTransferForm] = useState<boolean>(false);
  const [transferSenderName, setTransferSenderName] = useState<string>("");
  const [transferSenderEmail, setTransferSenderEmail] = useState<string>("");
  const [transferNotes, setTransferNotes] = useState<string>("");
  const [transferBank, setTransferBank] = useState<string>("Guaranty Trust Bank");
  const [isLoggingTransfer, setIsLoggingTransfer] = useState<boolean>(false);

  // Venmo Notification State
  const [showVenmoForm, setShowVenmoForm] = useState<boolean>(false);
  const [venmoSenderName, setVenmoSenderName] = useState<string>("");
  const [venmoSenderEmail, setVenmoSenderEmail] = useState<string>("");
  const [venmoNotes, setVenmoNotes] = useState<string>("");
  const [isLoggingVenmo, setIsLoggingVenmo] = useState<boolean>(false);

  // PayPal Hosted Buttons SDK state
  const [isPayPalLoading, setIsPayPalLoading] = useState<boolean>(false);
  const [payPalRendered, setPayPalRendered] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Dynamically load and render PayPal HostedButtons when PayPal tab is active
  useEffect(() => {
    if (!isOpen || method !== "paypal") return;

    let isMounted = true;
    setIsPayPalLoading(true);

    loadPayPalScript().then((loaded) => {
      if (!isMounted) return;
      if (!loaded) {
        setIsPayPalLoading(false);
        return;
      }
      // @ts-expect-error window.paypal
      if (typeof window !== "undefined" && window.paypal && window.paypal.HostedButtons) {
        const containerId = `#paypal-container-${PAYPAL_BUTTON_ID}`;
        const container = document.querySelector(containerId);
        if (container) {
          container.innerHTML = "";
          try {
            // @ts-expect-error HostedButtons
            window.paypal
              .HostedButtons({
                hostedButtonId: PAYPAL_BUTTON_ID,
              })
              .render(containerId)
              .then(() => {
                if (isMounted) {
                  setPayPalRendered(true);
                  setIsPayPalLoading(false);

                  // Strip any image elements, spacers, and empty header wrappers above "Thank you"
                  const cleanImageGap = () => {
                    const el = document.querySelector(containerId);
                    if (!el) return;

                    // Remove images and pictures
                    el.querySelectorAll("img, picture, svg:not([class*='icon'])").forEach((node) => node.remove());

                    // Find innermost element containing "thank you"
                    const allNodes = Array.from(el.querySelectorAll<HTMLElement>("*"));
                    let thankYouEl: HTMLElement | null = null;
                    for (const node of allNodes) {
                      if (node.textContent && node.textContent.toLowerCase().includes("thank you")) {
                        const hasChildWithIt = Array.from(node.children).some((c) =>
                          c.textContent?.toLowerCase().includes("thank you")
                        );
                        if (!hasChildWithIt) {
                          thankYouEl = node;
                          break;
                        }
                      }
                    }

                    if (thankYouEl) {
                      // Remove any element that appears before thankYouEl in DOM order
                      for (const node of allNodes) {
                        if (node === thankYouEl || node.contains(thankYouEl) || thankYouEl.contains(node)) {
                          continue;
                        }
                        if (node.querySelector("iframe, button") || node.tagName === "IFRAME" || node.tagName === "BUTTON") {
                          continue;
                        }
                        if (node.compareDocumentPosition(thankYouEl) & Node.DOCUMENT_POSITION_FOLLOWING) {
                          node.remove();
                        }
                      }

                      // Reset spacing on thankYouEl and make label clear
                      thankYouEl.textContent = "Donation Amount (USD):";
                      thankYouEl.style.setProperty("display", "block", "important");
                      thankYouEl.style.setProperty("font-size", "12px", "important");
                      thankYouEl.style.setProperty("font-weight", "700", "important");
                      thankYouEl.style.setProperty("color", "#1f2937", "important");
                      thankYouEl.style.setProperty("margin-top", "0px", "important");
                      thankYouEl.style.setProperty("margin-bottom", "6px", "important");
                      thankYouEl.style.setProperty("padding-top", "0px", "important");
                      thankYouEl.style.setProperty("text-transform", "uppercase", "important");
                      thankYouEl.style.setProperty("letter-spacing", "0.025em", "important");

                      // Reset spacing on ancestors up to el
                      let curr: HTMLElement | null = thankYouEl.parentElement;
                      while (curr && curr !== el) {
                        curr.style.setProperty("margin-top", "0px", "important");
                        curr.style.setProperty("padding-top", "0px", "important");
                        curr.style.setProperty("min-height", "0px", "important");
                        curr.style.setProperty("height", "auto", "important");
                        curr = curr.parentElement;
                      }
                    }

                    // Style the amount input field with a prominent, visible border on mobile & desktop
                    const amountInput = el.querySelector<HTMLInputElement>(
                      'input#amount, input[type="number"], .amount-container input'
                    );
                    if (amountInput) {
                      amountInput.setAttribute("placeholder", "e.g. 50");
                      amountInput.style.setProperty("border", "2px solid #0070ba", "important");
                      amountInput.style.setProperty("border-radius", "12px", "important");
                      amountInput.style.setProperty("background-color", "#ffffff", "important");
                      amountInput.style.setProperty("box-shadow", "0 0 0 1px #0070ba, 0 1px 3px rgba(0,0,0,0.1)", "important");
                      amountInput.style.setProperty("-webkit-appearance", "none", "important");
                      amountInput.style.setProperty("font-size", "16px", "important");
                      amountInput.style.setProperty("font-weight", "700", "important");
                      amountInput.style.setProperty("color", "#111827", "important");
                      amountInput.style.setProperty("min-height", "50px", "important");

                      // Auto-sync selected amount if input is currently empty
                      const rawAmt = (activeAmount || "50").replace(/,/g, "").trim();
                      if (!amountInput.value && rawAmt) {
                        amountInput.value = rawAmt;
                        amountInput.dispatchEvent(new Event("input", { bubbles: true }));
                        amountInput.dispatchEvent(new Event("change", { bubbles: true }));
                      }
                    }

                    // Remove any remaining empty elements
                    el.querySelectorAll<HTMLElement>("div, span, section, header").forEach((node) => {
                      if (node.tagName !== "IFRAME" && node.tagName !== "BUTTON") {
                        if (!node.querySelector("iframe, button") && !node.textContent?.trim()) {
                          node.remove();
                        }
                      }
                    });
                  };

                  cleanImageGap();
                  setTimeout(cleanImageGap, 100);
                  setTimeout(cleanImageGap, 300);
                  setTimeout(cleanImageGap, 800);
                  setTimeout(cleanImageGap, 1500);

                  // Observe DOM mutations to clean any deferred PayPal inserts
                  const observer = new MutationObserver(() => cleanImageGap());
                  const targetEl = document.querySelector(containerId);
                  if (targetEl) {
                    observer.observe(targetEl, { childList: true, subtree: true });
                    setTimeout(() => observer.disconnect(), 4000);
                  }
                }
              })
              .catch((err: any) => {
                console.warn("PayPal button render error:", err);
                if (isMounted) setIsPayPalLoading(false);
              });
          } catch (err) {
            console.warn("PayPal HostedButtons error:", err);
            if (isMounted) setIsPayPalLoading(false);
          }
        } else {
          setIsPayPalLoading(false);
        }
      } else {
        setIsPayPalLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, method]);

  // Auto-sync selected activeAmount to the PayPal Hosted Buttons amount input
  useEffect(() => {
    if (!isOpen || method !== "paypal") return;
    const containerId = `#paypal-container-${PAYPAL_BUTTON_ID}`;
    const el = document.querySelector(containerId);
    if (!el) return;
    const amountInput = el.querySelector<HTMLInputElement>(
      'input#amount, input[type="number"], .amount-container input'
    );
    if (amountInput) {
      const rawAmt = (activeAmount || "50").replace(/,/g, "").trim();
      if (rawAmt && amountInput.value !== rawAmt) {
        amountInput.value = rawAmt;
        amountInput.dispatchEvent(new Event("input", { bubbles: true }));
        amountInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }, [isOpen, method, activeAmount]);

  // Handle currency change
  const handleCurrencyChange = (newCurr: "NGN" | "USD") => {
    setCurrency(newCurr);
    setAmount(newCurr === "USD" ? "50" : "25,000");
    setCustomAmount("");
    if (newCurr === "USD" && (method === "bank" || method === "paystack")) {
      setMethod("paypal");
    } else if (newCurr === "NGN" && ["paypal", "venmo", "stripe", "zelle"].includes(method)) {
      setMethod("paystack");
    }
  };

  const handleMethodChange = (newMethod: DonationMethod) => {
    setMethod(newMethod);
    setErrorMessage(null);
    if (["paypal", "venmo", "stripe", "zelle"].includes(newMethod)) {
      if (currency !== "USD") {
        setCurrency("USD");
        setAmount("50");
        setCustomAmount("");
      }
    } else if (newMethod === "bank" || newMethod === "paystack") {
      if (currency !== "NGN") {
        setCurrency("NGN");
        setAmount("25,000");
        setCustomAmount("");
      }
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

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
              display_name: "Designated Purpose",
              variable_name: "cause",
              value: purpose,
            },
          ],
        },
        callback: async (response: { reference: string }) => {
          try {
            await api.createDonation({
              donorName: donorName.trim() || "Anonymous Supporter",
              donorEmail: donorEmail.trim(),
              amount: numericAmount,
              currency: currency === "USD" ? "USD" : "NGN",
              campaign: purpose,
              paymentMethod: "Paystack",
              reference: response.reference,
              status: "completed",
              notes: isRecurring ? "Monthly recurring via Paystack" : "One-time via Paystack",
            });
          } catch (e) {
            console.error("Failed to record Paystack donation in DB:", e);
          }
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

  // Direct Bank Transfer Notification Submission
  const handleLogBankTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(activeAmount) || (currency === 'NGN' ? 25000 : 50);
    if (!transferSenderName.trim()) {
      setErrorMessage("Please enter your name so we can identify your transfer.");
      return;
    }
    try {
      setIsLoggingTransfer(true);
      setErrorMessage(null);
      const ref = `BT-${Date.now().toString().slice(-6)}`;
      await api.createDonation({
        donorName: transferSenderName.trim(),
        donorEmail: transferSenderEmail.trim() || undefined,
        amount: numericAmount,
        currency: currency,
        campaign: purpose,
        paymentMethod: `${transferBank} Transfer`,
        reference: ref,
        status: "pending",
        notes: transferNotes.trim() ? `Direct Transfer: ${transferNotes.trim()}` : `Direct ${transferBank} transfer notification`,
      });
      setSuccessReference(ref);
    } catch (err: any) {
      setErrorMessage("Failed to record transfer notification: " + (err.message || "Please try again"));
    } finally {
      setIsLoggingTransfer(false);
    }
  };

  // Trigger PayPal Payment
  const handlePayPalPayment = () => {
    window.open(PAYPAL_DONATE_URL, "_blank", "noopener,noreferrer");
  };

  // Trigger Venmo Payment
  const handleVenmoPayment = () => {
    if (VENMO_DONATE_URL) {
      window.open(VENMO_DONATE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setErrorMessage(
      "Direct Venmo Donation Link is currently being connected. Please use PayPal, Zelle, or Paystack in the meantime."
    );
  };

  // Venmo Donation Notification Submission
  const handleLogVenmoDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(activeAmount) || 50;
    if (!venmoSenderName.trim()) {
      setErrorMessage("Please enter your name so we can record your donation receipt.");
      return;
    }
    try {
      setIsLoggingVenmo(true);
      setErrorMessage(null);
      const ref = `VENMO-${Date.now().toString().slice(-6)}`;
      await api.createDonation({
        donorName: venmoSenderName.trim(),
        donorEmail: venmoSenderEmail.trim() || undefined,
        amount: numericAmount,
        currency: "USD",
        campaign: purpose,
        paymentMethod: "Venmo",
        reference: ref,
        status: "completed",
        notes: venmoNotes.trim() ? `Venmo: ${venmoNotes.trim()}` : "Venmo direct contribution",
      });
      setSuccessReference(ref);
    } catch (err: any) {
      setErrorMessage("Failed to record Venmo contribution: " + (err.message || "Please try again"));
    } finally {
      setIsLoggingVenmo(false);
    }
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

    setErrorMessage(
      "Direct Stripe Payment Link is currently being connected. Please use Paystack (for instant cards & Apple Pay) or Zelle in the meantime."
    );
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
          <div className="relative bg-gradient-to-r from-[#0c1a05] via-[#16300a] to-[#254b12] text-white px-5 sm:px-6 py-4 sm:py-5 shrink-0 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#8ac43e] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  <IconHeart className="w-3 h-3 text-[#8ac43e] fill-current" />
                  <span>Make an Impact</span>
                </span>
                {isRecurring && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    <IconRepeat className="w-3 h-3 animate-spin-slow" />
                    <span>Monthly Recurring</span>
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white truncate">
                Support Veronica Onyeneke Foundation
              </h3>
              <p className="text-gray-300 text-xs mt-0.5 line-clamp-1 sm:line-clamp-none">
                Your contribution equips youth with vocational skills, sponsors students, and protects vulnerable young mothers.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-200 hover:text-white transition-colors cursor-pointer shrink-0"
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
                {/* 1. DONATION PURPOSE DROPDOWN */}
                <div className="p-3.5 bg-[#f4faec] border border-[#d6f0b0] rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#3e6812] uppercase tracking-wider">
                    <span>Donation Purpose</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#d6f0b0] text-[#558b1a] font-semibold">
                      Designate Cause
                    </span>
                  </div>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c4e897] rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] cursor-pointer shadow-2xs"
                  >
                    {DONATION_PURPOSES.map((p) => (
                      <option key={p.id} value={p.full}>
                        {p.label} — {p.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. FREQUENCY SELECTOR: ONE-TIME VS RECURRING */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    Donation Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-gray-200/60">
                    <button
                      type="button"
                      onClick={() => setFrequency("once")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        frequency === "once"
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200/80"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <IconHeart className={`w-3.5 h-3.5 ${frequency === "once" ? "text-[#558b1a] fill-[#558b1a]" : "text-gray-400"}`} />
                      <span>One-Time Gift</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        frequency === "monthly"
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200/80"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <IconRepeat className={`w-3.5 h-3.5 ${frequency === "monthly" ? "text-[#558b1a]" : "text-gray-400"}`} />
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

                {/* 3. CURRENCY & AMOUNT SELECTION */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Select Amount ({currency})
                    </label>
                    <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl text-xs font-semibold border border-gray-200/60">
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange("NGN")}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          currency === "NGN" ? "bg-white text-[#1b3f0c] shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        ₦ NGN
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange("USD")}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          currency === "USD" ? "bg-white text-[#1b3f0c] shadow-xs font-bold" : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        $ USD
                      </button>
                    </div>
                  </div>

                  {/* Symmetrical 6-slot Grid (5 Presets + Custom Button) */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
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
                          className={`h-10 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                            isSelected
                              ? "bg-[#558b1a] text-white border-[#558b1a] shadow-xs"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-stone-50"
                          }`}
                        >
                          {currency === "NGN" ? `₦${preset}` : `$${preset}`}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        if (!customAmount) setCustomAmount(currency === "NGN" ? "15000" : "75");
                      }}
                      className={`h-10 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center text-center ${
                        customAmount
                          ? "bg-[#558b1a] text-white border-[#558b1a] shadow-xs"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-stone-50"
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Amount Input when active */}
                  {customAmount !== "" && (
                    <div className="relative mt-2 animate-in fade-in duration-150">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">
                        {currency === "NGN" ? "₦ Enter Amount:" : "$ Enter Amount:"}
                      </span>
                      <input
                        type="number"
                        placeholder={currency === "NGN" ? "e.g. 15000" : "e.g. 75"}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-32 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* 3. PAYMENT GATEWAY TABS */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {/* Paystack */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("paystack")}
                      className={`h-[74px] sm:h-[76px] w-full min-w-0 flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        method === "paystack"
                          ? "bg-[#00c3f7]/10 border-[#00c3f7] text-[#057a9c] ring-1 ring-[#00c3f7]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <PaystackIcon className="w-5 h-5 text-[#00c3f7] mb-1 shrink-0" />
                      <span className="truncate w-full leading-tight">Paystack</span>
                      <span className="text-[9px] text-gray-400 font-normal leading-tight block truncate w-full mt-0.5">Card • NGN</span>
                    </button>

                    {/* PayPal */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("paypal")}
                      className={`h-[74px] sm:h-[76px] w-full min-w-0 flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        method === "paypal"
                          ? "bg-[#0070ba]/10 border-[#0070ba] text-[#004b7d] ring-1 ring-[#0070ba]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <IconBrandPaypal className="w-5 h-5 text-[#0070ba] mb-1 shrink-0" />
                      <span className="truncate w-full leading-tight">PayPal</span>
                      <span className="text-[9px] text-gray-400 font-normal leading-tight block truncate w-full mt-0.5">USD • Global</span>
                    </button>

                    {/* Venmo */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("venmo")}
                      className={`h-[74px] sm:h-[76px] w-full min-w-0 flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        method === "venmo"
                          ? "bg-[#008cff]/10 border-[#008cff] text-[#0074de] ring-1 ring-[#008cff]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <VenmoIcon className="w-5 h-5 text-[#008cff] mb-1 shrink-0" />
                      <span className="truncate w-full leading-tight">Venmo</span>
                      <span className="text-[9px] text-gray-400 font-normal leading-tight block truncate w-full mt-0.5">App • QR</span>
                    </button>

                    {/* Stripe */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("stripe")}
                      className={`h-[74px] sm:h-[76px] w-full min-w-0 flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        method === "stripe"
                          ? "bg-[#635bff]/10 border-[#635bff] text-[#4d44db] ring-1 ring-[#635bff]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <IconBrandStripe className="w-5 h-5 text-[#635bff] mb-1 shrink-0" />
                      <span className="truncate w-full leading-tight">Stripe</span>
                      <span className="text-[9px] text-gray-400 font-normal leading-tight block truncate w-full mt-0.5">Card • Global</span>
                    </button>

                    {/* Zelle */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("zelle")}
                      className={`h-[74px] sm:h-[76px] w-full min-w-0 flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        method === "zelle"
                          ? "bg-[#7414ca]/10 border-[#7414ca] text-[#550c99] ring-1 ring-[#7414ca]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <ZelleIcon className="w-5 h-5 text-[#7414ca] mb-1 shrink-0" />
                      <span className="truncate w-full leading-tight">Zelle</span>
                      <span className="text-[9px] text-gray-400 font-normal leading-tight block truncate w-full mt-0.5">USA Direct</span>
                    </button>

                    {/* Bank Transfer */}
                    <button
                      type="button"
                      onClick={() => handleMethodChange("bank")}
                      className={`h-[74px] sm:h-[76px] w-full min-w-0 flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        method === "bank"
                          ? "bg-[#558b1a]/10 border-[#558b1a] text-[#457214] ring-1 ring-[#558b1a]"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                      }`}
                    >
                      <IconBuildingBank className="w-5 h-5 text-[#558b1a] mb-1 shrink-0" />
                      <span className="truncate w-full leading-tight">Bank Wire</span>
                      <span className="text-[9px] text-gray-400 font-normal leading-tight block truncate w-full mt-0.5">Transfer • Wire</span>
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
                            PayPal & Card Checkout {isRecurring ? "(Monthly)" : ""}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#0070ba]/10 text-[#0070ba] px-2 py-0.5 rounded-full">
                          Official Account • 501(c)(3)
                        </span>
                      </div>

                      {/* Payment Methods Accepted */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-800">
                            Accepted Payment Options:
                          </span>
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            Zero Donor Fee
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-gray-600">
                          <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-[#0070ba] font-bold">PayPal</span>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-[#008cff] font-semibold">Venmo</span>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-800 font-semibold">Apple Pay</span>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-700 font-semibold">Debit &amp; Credit Cards</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                            Recipient PayPal Email:
                          </span>
                          <span className="text-xs font-mono font-bold text-gray-900">{PAYPAL_EMAIL}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Veronica Onyeneke Foundation Corp.</span>
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

                      {/* Embedded PayPal Smart Buttons Container */}
                      <div className="w-full py-0">
                        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-gray-700">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800">
                            <span className="w-2 h-2 rounded-full bg-[#0070ba]" />
                            <span>Donation Amount ($ USD)</span>
                          </span>
                          <span className="text-[10px] text-gray-500 font-normal">
                            Pre-filled with your selection
                          </span>
                        </div>

                        <div
                          id={`paypal-container-${PAYPAL_BUTTON_ID}`}
                          className="w-full block min-w-full text-center m-0 p-0 [&>*]:w-full [&>*]:max-w-full [&_iframe]:w-full [&_img]:hidden! [&_picture]:hidden!"
                          style={{ display: "block", width: "100%", minWidth: "100%", margin: 0, padding: 0 }}
                        />

                        {isPayPalLoading && (
                          <div className="py-3 text-center text-xs text-gray-500 flex items-center justify-center gap-2 bg-stone-50 rounded-xl border border-dashed border-gray-200">
                            <span className="w-3.5 h-3.5 border-2 border-[#0070ba] border-t-transparent rounded-full animate-spin" />
                            <span>Loading secure PayPal smart buttons...</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handlePayPalPayment}
                        className="w-full py-3 px-4 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                      >
                        <IconBrandPaypal className="w-4 h-4" />
                        <span>
                          {isRecurring
                            ? `Proceed with $${activeAmount} Monthly via PayPal`
                            : `Proceed with $${activeAmount} Once via PayPal`}
                        </span>
                        <IconExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* VENMO METHOD VIEW */}
                  {method === "venmo" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <VenmoIcon className="w-4 h-4 text-[#008cff]" />
                          <span className="text-xs font-bold text-gray-900">
                            Venmo Mobile &amp; QR Giving
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#008cff]/10 text-[#008cff] px-2 py-0.5 rounded-full">
                          U.S. 501(c)(3) Tax-Deductible
                        </span>
                      </div>

                      {/* Visual QR Code & Info Banner */}
                      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row items-center gap-4">
                        {/* Dynamic QR Code Container */}
                        <div className="relative shrink-0 flex flex-col items-center">
                          <div className="p-2.5 bg-sky-50/70 border border-sky-200/80 rounded-2xl shadow-inner flex items-center justify-center">
                            <img
                              src="/api/donations/venmo-qr"
                              alt="Scan to Donate via Venmo"
                              className="w-32 h-32 object-contain rounded-lg"
                              width={128}
                              height={128}
                            />
                          </div>
                          <span className="mt-1.5 text-[10px] font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-full">
                            Scan with Phone Camera
                          </span>
                        </div>

                        {/* Venmo Beneficiary Info */}
                        <div className="space-y-2 text-left flex-1">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                              Official Venmo Beneficiary:
                            </span>
                            <div className="text-sm font-bold text-gray-900">
                              Veronica Onyeneke Foundation Corp.
                            </div>
                            <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                              Directly funds secondary/tertiary scholarships, youth vocational toolkits, and young mother care.
                            </p>
                          </div>

                          <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 text-[11px] text-sky-950 space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-sky-900">
                              <span>💡 How to Give via Venmo:</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-sky-900/90">
                              • <strong>Mobile:</strong> Tap &ldquo;Give via Venmo&rdquo; to launch your Venmo app.<br />
                              • <strong>Desktop:</strong> Scan the QR code above with your phone camera or Venmo.<br />
                              • <strong>Tax Deductible:</strong> 100% charitable gift under IRC Section 501(c)(3).
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleVenmoPayment}
                          className="w-full py-3 px-4 rounded-xl bg-[#008cff] hover:bg-[#0074de] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                        >
                          <VenmoIcon className="w-4 h-4 text-white" />
                          <span>Give ${activeAmount} via Venmo</span>
                          <IconExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(VENMO_DONATE_URL, "venmo-link")}
                          disabled={!VENMO_DONATE_URL}
                          className="w-full py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0074de] font-bold text-xs flex items-center justify-center gap-2 border border-sky-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {copiedKey === "venmo-link" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Venmo Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy Venmo Donate Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Venmo Donation Notification Form for 501(c)(3) Receipt */}
                      <div className="pt-2 border-t border-gray-100">
                        {!showVenmoForm ? (
                          <button
                            type="button"
                            onClick={() => setShowVenmoForm(true)}
                            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#008cff] hover:text-white text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <span>I Have Donated via Venmo (Receive 501(c)(3) Receipt)</span>
                          </button>
                        ) : (
                          <form onSubmit={handleLogVenmoDonation} className="p-3.5 bg-stone-50 rounded-2xl border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900">Notify VOF of Venmo Contribution</span>
                              <button
                                type="button"
                                onClick={() => setShowVenmoForm(false)}
                                className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                  Your Name / Donor Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={venmoSenderName}
                                  onChange={(e) => setVenmoSenderName(e.target.value)}
                                  placeholder="e.g. John Doe"
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#008cff]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                  Email (for IRS Tax Receipt) *
                                </label>
                                <input
                                  type="email"
                                  required
                                  value={venmoSenderEmail}
                                  onChange={(e) => setVenmoSenderEmail(e.target.value)}
                                  placeholder="john@example.com"
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#008cff]"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                Venmo Handle / Note (Optional)
                              </label>
                              <input
                                type="text"
                                value={venmoNotes}
                                onChange={(e) => setVenmoNotes(e.target.value)}
                                placeholder="e.g. @johndoe - for Youth Empowerment"
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none text-xs"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isLoggingVenmo}
                              className="w-full py-2.5 rounded-xl bg-[#008cff] hover:bg-[#0074de] text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>{isLoggingVenmo ? "Submitting Notification..." : "Log Venmo Gift for Official Receipt"}</span>
                            </button>
                          </form>
                        )}
                      </div>
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

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                        <p className="font-semibold text-gray-900 mb-1">
                          Secure Card Checkout via Stripe
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Supports Visa, Mastercard, American Express, Apple Pay, and Google Pay.
                        </p>
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
                          <span className="text-xs font-bold text-gray-900">Direct Institutional Bank Accounts</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#558b1a]/10 text-[#558b1a] px-2 py-0.5 rounded-full">
                          NGN & RWF Bank Transfer
                        </span>
                      </div>

                      {/* GTBank Card */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-[#558b1a] block">Guaranty Trust Bank (GTBank)</span>
                          <div className="text-sm font-mono font-bold text-gray-900">3000273596</div>
                          <div className="text-[11px] text-gray-500">Veronica Onyeneke Foundation</div>
                          <div className="text-[10px] text-gray-700 font-mono mt-1 pt-1 border-t border-gray-100 flex flex-wrap items-center gap-2">
                            <span className="text-gray-400 font-sans uppercase text-[9px] shrink-0">Bank Swift Code:</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("GTBINGLA", "gtb-swift")}
                              className="font-bold text-gray-900 hover:text-[#558b1a] flex items-center gap-1 cursor-pointer"
                              title="Copy GTBank SWIFT Code"
                            >
                              <span>GTBINGLA</span>
                              {copiedKey === "gtb-swift" ? <IconCheck className="w-2.5 h-2.5 text-green-600 shrink-0" /> : <IconCopy className="w-2.5 h-2.5 opacity-50 shrink-0" />}
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("3000273596", "gtb")}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1 transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                        >
                          {copiedKey === "gtb" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy Account</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Zenith Bank Card */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-[#558b1a] block">Zenith Bank</span>
                          <div className="text-sm font-mono font-bold text-gray-900">1228980969</div>
                          <div className="text-[11px] text-gray-500">Veronica Onyeneke Foundation</div>
                          <div className="text-[10px] text-gray-700 font-mono mt-1 pt-1 border-t border-gray-100 flex flex-wrap items-center gap-2">
                            <span className="text-gray-400 font-sans uppercase text-[9px] shrink-0">Swift Code:</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("ZEIBNGLA", "zenith-swift")}
                              className="font-bold text-gray-900 hover:text-[#558b1a] flex items-center gap-1 cursor-pointer"
                              title="Copy Zenith Bank SWIFT Code"
                            >
                              <span>ZEIBNGLA</span>
                              {copiedKey === "zenith-swift" ? <IconCheck className="w-2.5 h-2.5 text-green-600 shrink-0" /> : <IconCopy className="w-2.5 h-2.5 opacity-50 shrink-0" />}
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("1228980969", "zenith")}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1 transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                        >
                          {copiedKey === "zenith" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy Account</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Bank of Kigali Card (RWF) */}
                      <div className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#558b1a] block">Bank of Kigali (Rwanda Hub)</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">RWF</span>
                          </div>
                          <div className="text-sm font-mono font-bold text-gray-900">100267865048</div>
                          <div className="text-[11px] text-gray-500">Veronica Onyeneke Foundation</div>
                          <div className="text-[10px] text-gray-700 font-mono mt-1 pt-1 border-t border-gray-100 flex flex-wrap items-center gap-2">
                            <span className="text-gray-400 font-sans uppercase text-[9px] shrink-0">IBAN (RWF):</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("RW34040100267865048646", "bok-iban")}
                              className="font-bold text-gray-900 hover:text-[#558b1a] flex items-center gap-1 cursor-pointer break-all text-left"
                              title="Copy Bank of Kigali IBAN"
                            >
                              <span>RW34040100267865048646</span>
                              {copiedKey === "bok-iban" ? <IconCheck className="w-2.5 h-2.5 text-green-600 shrink-0" /> : <IconCopy className="w-2.5 h-2.5 opacity-50 shrink-0" />}
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("100267865048", "bok")}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1 transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                        >
                          {copiedKey === "bok" ? (
                            <>
                              <IconCheck className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <IconCopy className="w-3.5 h-3.5" />
                              <span>Copy Account</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Transfer Notification Form to Route into Admin Dashboard */}
                      <div className="pt-2 border-t border-gray-100">
                        {!showTransferForm ? (
                          <button
                            type="button"
                            onClick={() => setShowTransferForm(true)}
                            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-[#558b1a] hover:text-white text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <span>I Have Made a Transfer (Notify VOF & Receive Receipt)</span>
                          </button>
                        ) : (
                          <form onSubmit={handleLogBankTransfer} className="p-3.5 bg-stone-50 rounded-2xl border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900">Notify VOF of Bank Transfer</span>
                              <button
                                type="button"
                                onClick={() => setShowTransferForm(false)}
                                className="text-[11px] text-gray-400 hover:text-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                  Your Name / Account Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={transferSenderName}
                                  onChange={(e) => setTransferSenderName(e.target.value)}
                                  placeholder="e.g. Chief Emeka Okoro"
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#558b1a]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                  Email (for Receipt)
                                </label>
                                <input
                                  type="email"
                                  value={transferSenderEmail}
                                  onChange={(e) => setTransferSenderEmail(e.target.value)}
                                  placeholder="emeka@example.com"
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#558b1a]"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                  Bank Transferred To
                                </label>
                                <select
                                  value={transferBank}
                                  onChange={(e) => setTransferBank(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none cursor-pointer"
                                >
                                  <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTB)</option>
                                  <option value="Zenith Bank">Zenith Bank</option>
                                  <option value="Bank of Kigali">Bank of Kigali (RWF)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                  Amount (₦ NGN)
                                </label>
                                <input
                                  type="text"
                                  value={activeAmount}
                                  readOnly
                                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-bold"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                Transfer Reference / Notes (Optional)
                              </label>
                              <input
                                type="text"
                                value={transferNotes}
                                onChange={(e) => setTransferNotes(e.target.value)}
                                placeholder="e.g. Session ref, mobile app transfer note..."
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none text-xs"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isLoggingTransfer}
                              className="w-full py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#457214] text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>{isLoggingTransfer ? "Submitting Notification..." : "Log Transfer to VOF"}</span>
                            </button>
                          </form>
                        )}
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
