'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/components/admin/AdminContext';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login route, render children directly without AdminShell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
