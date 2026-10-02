'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm';
import { AUTH_STORAGE_KEY } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Quick check if already logged in
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            router.replace('/admin');
            return;
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0c1a05]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#558b1a]/30 border-t-[#a1e25e] rounded-full animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#a1e25e]">
            Verifying Authentication...
          </p>
        </div>
      </div>
    );
  }

  return <AdminLoginForm redirectUrl="/admin" />;
}
