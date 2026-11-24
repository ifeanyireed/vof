'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, MailX, ArrowLeft } from 'lucide-react';

function UnsubscribeInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing unsubscribe token. Please use the link from your email.');
      return;
    }

    fetch('/api/crm/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not process unsubscribe request');
        setEmail(data.email || '');
        setMessage(data.message || 'You have been unsubscribed.');
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired unsubscribe link.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f8faf6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-[#f4faec] text-[#558b1a] border border-[#d6f0b0]">
          {status === 'loading' ? (
            <MailX className="w-7 h-7 animate-pulse" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          ) : (
            <AlertCircle className="w-7 h-7 text-red-500" />
          )}
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#558b1a]">
            Veronica Onyeneke Foundation
          </p>
          <h1 className="font-serif text-2xl font-bold text-gray-900 mt-1">
            {status === 'loading'
              ? 'Updating Preferences...'
              : status === 'success'
              ? 'Unsubscribed Successfully'
              : 'Unsubscribe Link Issue'}
          </h1>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {status === 'loading' ? 'Please wait while we update your email subscription.' : message}
        </p>

        {email && (
          <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
            {email}
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Foundation Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CrmUnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8faf6] flex items-center justify-center text-sm text-gray-500">
          Loading...
        </div>
      }
    >
      <UnsubscribeInner />
    </Suspense>
  );
}
