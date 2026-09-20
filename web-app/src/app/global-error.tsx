"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="p-8 font-sans bg-gray-50 text-gray-900">
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-4">{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[#558b1a] text-white font-medium rounded-xl hover:bg-[#68a424] transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
