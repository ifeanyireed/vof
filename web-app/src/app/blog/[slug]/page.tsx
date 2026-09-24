import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogs";
import { IconArrowLeft, IconCalendar, IconUser, IconShare } from "@tabler/icons-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog Post Not Found | VOF" };
  return {
    title: `${post.title} | Veronica Onyeneke Foundation`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Format paragraphs
  const paragraphs = post.content
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7ccd2d]/30 selection:text-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full px-6 lg:px-16 py-4 flex items-center justify-between border-b border-gray-100 shadow-xs transition-all">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
            alt="Veronica Onyeneke Foundation Logo"
            width={180}
            height={50}
            className="object-contain h-12 w-auto"
            priority
          />
        </Link>

        {/* Clean Desktop Navigation (External Pages Only) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            About Us
          </Link>
          <Link href="/programs" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Programs
          </Link>
          <Link href="/gallery" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Gallery
          </Link>
          <Link href="/blog" className="text-[#558b1a] font-bold text-sm transition-colors">
            News & Stories
          </Link>
          <Link href="/financial-reports" className="text-gray-700 hover:text-[#558b1a] font-semibold text-sm transition-colors">
            Financial Reports
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#558b1a] transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
          <Link
            href="/#donate"
            className="px-5 py-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-950 font-bold rounded-full hover:opacity-95 text-xs shadow-xs"
          >
            Donate
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumb & Category */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/blog" className="text-xs font-bold text-[#558b1a] hover:underline">
            VOF News
          </Link>
          <span className="text-gray-300">•</span>
          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1b2124] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 mb-10 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <IconCalendar className="w-4 h-4 text-[#558b1a]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <IconUser className="w-4 h-4 text-gray-400" />
              {post.author}
            </span>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-[#558b1a] hover:underline flex items-center gap-1"
          >
            <IconShare className="w-3.5 h-3.5" />
            Share Article
          </Link>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-md bg-gray-50">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-sans space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base sm:text-[17px] leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
        </div>

        {/* Support Callout Box */}
        <div className="mt-16 p-8 rounded-3xl bg-[#f7f9f4] border border-[#dce6ce] text-left">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Support the Mission of Veronica Onyeneke Foundation
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Whether funding vocational toolkits, sponsoring a student&apos;s higher education, or assisting a young mother, your support creates tangible generational opportunities.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#donate"
              className="px-7 py-2.5 bg-[#558b1a] text-white font-bold rounded-full hover:bg-[#477516] transition-colors text-xs"
            >
              Support This Program
            </Link>
            <Link
              href="/blog"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors text-xs"
            >
              Browse More Stories
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-20 py-12 px-6 border-t border-gray-100 bg-[#fbfdf9] text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Veronica Onyeneke Foundation (VOF). All Rights Reserved.</p>
        <p className="mt-1">Empowering Lives. Restoring Hope. Creating Opportunities.</p>
      </footer>
    </div>
  );
}
