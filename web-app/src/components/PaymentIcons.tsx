import React from "react";

export function PaystackIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v1.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 6.3V4.5zm0 5.8A1.5 1.5 0 0 1 4.5 8.8h10a1.5 1.5 0 0 1 1.5 1.5v1.8a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 12.1v-1.8zm0 5.8a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v1.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.9v-1.8z" />
    </svg>
  );
}

export function ZelleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2.5 4.8l-5.6 7.4H17v1.8H7.5v-2l5.6-7.4H7.5V5.8h9v1.8z" />
    </svg>
  );
}
