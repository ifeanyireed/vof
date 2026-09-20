"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-600 mb-6">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-[#558b1a] text-white font-semibold rounded-xl hover:bg-[#68a424] transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
