import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20 text-center flex-grow flex flex-col justify-center items-center">
        <span className="px-3 py-1 rounded-full bg-[#558b1a]/10 text-[#558b1a] text-xs font-bold uppercase tracking-wider mb-4">
          404 • Page Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Looking for Hope?
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
          The page or resource you requested may have moved or is temporarily unavailable. Explore our core charitable programs, educational scholarships, or humanitarian initiatives below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-[#558b1a] hover:bg-[#477516] text-white font-bold rounded-full text-xs shadow-xs transition"
          >
            Return to Homepage
          </Link>
          <Link
            href="/programs"
            className="px-6 py-3 bg-white border border-gray-200 hover:border-[#558b1a] text-gray-800 font-bold rounded-full text-xs transition"
          >
            Explore Programs
          </Link>
          <Link
            href="/donate"
            className="px-6 py-3 bg-[#fbbf24] hover:bg-[#f59e0b] text-gray-950 font-bold rounded-full text-xs transition shadow-xs"
          >
            Support VOF
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-gray-800 font-bold rounded-full text-xs transition"
          >
            Contact Secretariat
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
