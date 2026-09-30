"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";

interface BlogLikeButtonProps {
  blogId?: number;
  initialLikes?: number | string;
}

export default function BlogLikeButton({ blogId, initialLikes = 0 }: BlogLikeButtonProps) {
  const parseCount = (v: number | string) => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.includes("k")) {
      return Math.round(parseFloat(v) * 1000);
    }
    return parseInt(v, 10) || 0;
  };

  const [likes, setLikes] = useState<number>(parseCount(initialLikes));
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLike = async () => {
    if (liked || loading || !blogId) return;

    try {
      setLoading(true);
      setLikes((prev) => prev + 1);
      setLiked(true);
      const res = await api.likeBlog(blogId);
      if (res?.likes) {
        setLikes(res.likes);
      }
    } catch (err) {
      console.warn("Could not record like:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatLikes = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} k`;
    }
    return String(num);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        liked
          ? "bg-rose-50 text-rose-600 border border-rose-200"
          : "bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 border border-gray-200 cursor-pointer"
      }`}
      title={liked ? "You liked this post" : "Like this post"}
    >
      <svg
        className={`w-4 h-4 transition-transform ${liked ? "scale-110 fill-rose-500 text-rose-500" : "fill-none stroke-current"}`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
      <span>{formatLikes(likes)}</span>
    </button>
  );
}
