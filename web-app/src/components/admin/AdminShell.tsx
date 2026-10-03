'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  HeartHandshake,
  Users,
  Building2,
  Camera,
  Target,
  GraduationCap,
  Wallet,
  SlidersHorizontal,
  Headphones,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from './AdminContext';
import AdminModals from './AdminModals';
import AdminLoginForm from '@/components/AdminLoginForm';
import {
  canAccessRoute,
  getAllowedRoutes,
  getRoleLabel,
  getRoleBadge,
  TabType,
} from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/admin', tab: 'overview' as TabType, label: 'Dashboard Overview', icon: LayoutDashboard },
  { href: '/admin/blogs', tab: 'blogs' as TabType, label: 'Blog CMS', icon: BookOpen },
  { href: '/admin/donations', tab: 'donations' as TabType, label: 'Donation Funds', icon: HeartHandshake },
  {
    href: '/admin/volunteers',
    tab: 'volunteers' as TabType,
    label: 'Volunteers Directory',
    icon: Users,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
  {
    href: '/admin/partners',
    tab: 'partners' as TabType,
    label: 'Partners Directory',
    icon: Building2,
    badgeClass: 'bg-lime-500/20 text-lime-300 border border-lime-500/30',
  },
  {
    href: '/admin/gallery',
    tab: 'gallery' as TabType,
    label: 'Gallery Media',
    icon: Camera,
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  },
  { href: '/admin/projects', tab: 'projects' as TabType, label: 'Charity Projects', icon: Target },
  {
    href: '/admin/applications',
    tab: 'applications' as TabType,
    label: 'Applications Review',
    icon: GraduationCap,
    badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  { href: '/admin/financials', tab: 'financials' as TabType, label: 'Financial Accounts', icon: Wallet },
  {
    href: '/admin/forms',
    tab: 'forms' as TabType,
    label: 'Forms Controller',
    icon: SlidersHorizontal,
    badgeClass: 'bg-lime-500/20 text-lime-300 border border-lime-500/30',
  },
  { href: '/admin/support', tab: 'support' as TabType, label: 'Support Desk', icon: Headphones },
  {
    href: '/admin/team',
    tab: 'team' as TabType,
    label: 'Team & RBAC Roles',
    icon: ShieldCheck,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
];

const ROUTE_HEADERS: Record<string, { title: string; tabName: string }> = {
  '/admin': { title: 'Executive Foundation Dashboard', tabName: 'Overview' },
  '/admin/overview': { title: 'Executive Foundation Dashboard', tabName: 'Overview' },
  '/admin/blogs': { title: 'Blog & Stories Content Management', tabName: 'Blogs' },
  '/admin/blog': { title: 'Blog & Stories Content Management', tabName: 'Blogs' },
  '/admin/donations': { title: 'Donation Inflows & Philanthropy Records', tabName: 'Donations' },
  '/admin/donation': { title: 'Donation Inflows & Philanthropy Records', tabName: 'Donations' },
  '/admin/volunteers': { title: 'Volunteer Network & Field Operations', tabName: 'Volunteers' },
  '/admin/volunteer': { title: 'Volunteer Network & Field Operations', tabName: 'Volunteers' },
  '/admin/partners': { title: 'Strategic Partners & Institutional Alliances', tabName: 'Partners' },
  '/admin/partner': { title: 'Strategic Partners & Institutional Alliances', tabName: 'Partners' },
  '/admin/gallery': { title: 'Gallery Media & Visual Asset Catalog', tabName: 'Gallery' },
  '/admin/projects': { title: 'Community Projects & Capital Campaigns', tabName: 'Projects' },
  '/admin/project': { title: 'Community Projects & Capital Campaigns', tabName: 'Projects' },
  '/admin/applications': { title: 'Empowerment & Aid Applications', tabName: 'Applications' },
  '/admin/application': { title: 'Empowerment & Aid Applications', tabName: 'Applications' },
  '/admin/financials': { title: 'Treasury Accounts & Audit Ledger', tabName: 'Financials' },
  '/admin/financial': { title: 'Treasury Accounts & Audit Ledger', tabName: 'Financials' },
  '/admin/forms': { title: 'Forms Visibility & Public Intake Controller', tabName: 'Forms' },
  '/admin/form': { title: 'Forms Visibility & Public Intake Controller', tabName: 'Forms' },
  '/admin/support': { title: 'Live Visitor Support & AI Chatbot Desk', tabName: 'Support' },
  '/admin/team': { title: 'Admin Staff Roster & RBAC Roles', tabName: 'Team' },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currentUser,
    setCurrentUser,
    authChecking,
    handleLogout,
    message,
    setMessage,
    loading,
    refreshing,
    loadAllData,
    fetchAdminUsers,
    blogs,
    donations,
    volunteers,
    partners,
    galleryMedia,
    projects,
    scholarships,
    skills,
    accounts,
    formVisibility,
    totalSupportUnread,
    supportStaffOnline,
    adminUsers,
  } = useAdmin();

  if (authChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0c1a05]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[#558b1a]/30 border-t-[#a1e25e] rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-white font-bold text-base tracking-wide">Veronica Onyeneke Foundation</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#a1e25e] mt-1">
              Verifying Portal Credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLoginForm
        redirectUrl={pathname}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadAllData();
          if (user.role === 'super_admin') {
            fetchAdminUsers();
          }
        }}
      />
    );
  }

  // Normalize path without trailing slash
  const normalizedPath = pathname.replace(/\/$/, '') || '/admin';

  // Check RBAC permission for current route
  const isAuthorized = canAccessRoute(currentUser.role, normalizedPath);

  const routeMeta = ROUTE_HEADERS[normalizedPath] || {
    title: 'Admin Central Portal',
    tabName: normalizedPath.replace('/admin/', '').replace('/admin', 'Overview') || 'Dashboard',
  };

  const getNavCount = (tab: TabType) => {
    switch (tab) {
      case 'blogs':
        return blogs.length;
      case 'donations':
        return donations.length;
      case 'volunteers':
        return volunteers.length;
      case 'partners':
        return partners.length;
      case 'gallery':
        return galleryMedia.length;
      case 'projects':
        return projects.length;
      case 'applications':
        return scholarships.length + skills.length;
      case 'financials':
        return accounts.length;
      case 'forms':
        return `${Object.values(formVisibility).filter(Boolean).length} Active`;
      case 'support':
        return totalSupportUnread > 0 ? totalSupportUnread : supportStaffOnline ? 'Live' : 'Away';
      case 'team':
        return adminUsers.length;
      default:
        return undefined;
    }
  };

  const getNavBadgeClass = (tab: TabType, defaultClass?: string) => {
    if (tab === 'support') {
      return totalSupportUnread > 0
        ? 'bg-red-500 text-white font-bold animate-pulse'
        : supportStaffOnline
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        : 'bg-gray-700 text-gray-400';
    }
    return defaultClass || 'bg-white/10';
  };

  const isNavActive = (href: string) => {
    if (href === '/admin') {
      return normalizedPath === '/admin' || normalizedPath === '/admin/overview';
    }
    return normalizedPath.startsWith(href);
  };

  const allowedRoutes = getAllowedRoutes(currentUser.role);
  const fallbackRoute = allowedRoutes[0] || '/admin';

  return (
    <div className="min-h-screen bg-[#f8faf6] text-gray-900 flex flex-col lg:flex-row antialiased">
      {/* Toast message */}
      {message && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border text-sm font-medium transition-all ${
            message.type === 'success'
              ? 'bg-[#0f2e10] text-emerald-100 border-emerald-500/40'
              : 'bg-red-900 text-red-100 border-red-500/40'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#0c1a05] text-white flex flex-col justify-between shrink-0 border-r border-[#1a3310] lg:sticky lg:top-0 lg:h-screen z-30">
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Logo & Branding */}
          <div className="p-5 border-b border-[#1c3311]">
            <Link href="/admin" className="flex items-center gap-3.5 group">
              <Image
                src="https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp"
                alt="Veronica Onyeneke Foundation"
                width={52}
                height={52}
                className="h-11 w-auto object-contain shrink-0"
                priority
              />
              <div className="min-w-0">
                <h1 className="font-bold text-sm tracking-wide text-white group-hover:text-[#a1e25e] transition leading-tight">
                  Veronica Onyeneke Foundation
                </h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                  Admin Central Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation links with RBAC filtering */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.filter((item) => canAccessRoute(currentUser.role, item.href)).map((item) => {
              const Icon = item.icon;
              const isCurrent = isNavActive(item.href);
              const count = getNavCount(item.tab);
              const badgeClass = getNavBadgeClass(item.tab, item.badgeClass);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isCurrent
                      ? 'bg-[#558b1a] text-white shadow-md'
                      : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {count !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeClass}`}>
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick Link */}
        <div className="p-4 border-t border-[#1c3311] shrink-0 bg-[#0c1a05]">
          <div className="p-3 bg-[#12230a] rounded-2xl mb-3 border border-white/5">
            <div className="flex items-center gap-3">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-[#558b1a]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#558b1a] to-[#8ac43e] flex items-center justify-center font-bold text-white text-xs shadow-inner">
                  {currentUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-semibold text-white truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  getRoleBadge(currentUser.role).bg
                } ${getRoleBadge(currentUser.role).text} border ${
                  getRoleBadge(currentUser.role).border
                }`}
              >
                {getRoleLabel(currentUser.role)}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[10px] text-red-400 hover:text-red-300 font-medium flex items-center gap-1 cursor-pointer transition hover:underline"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5">
              <Link href="/admin" className="hover:text-gray-900 transition">VOF Portal</Link>
              <span>/</span>
              <span className="capitalize font-semibold text-gray-900">{routeMeta.tabName}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {routeMeta.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-700 font-semibold">{currentUser.fullName}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  getRoleBadge(currentUser.role).bg
                } ${getRoleBadge(currentUser.role).text} border ${
                  getRoleBadge(currentUser.role).border
                }`}
              >
                {getRoleLabel(currentUser.role)}
              </span>
            </div>

            <button
              onClick={() => loadAllData()}
              disabled={refreshing}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#558b1a]' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {!isAuthorized ? (
            /* RBAC Route-Level Access Denied Guard */
            <div className="p-8 sm:p-12 bg-white rounded-3xl border border-red-200 shadow-sm text-center max-w-2xl mx-auto my-12">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                Access Restricted
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-4 mb-2">
                Unauthorized Route
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                Your staff account role (<strong>{getRoleLabel(currentUser.role)}</strong>) does not have permission to access the dedicated route <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-gray-800">{normalizedPath}</code>.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={fallbackRoute}
                  className="px-5 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white text-xs font-bold shadow-md transition"
                >
                  Return to Authorized Dashboard
                </Link>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-[#558b1a] animate-spin" />
                <p className="text-xs text-gray-500 font-medium">Loading portal records...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Admin Modals */}
      <AdminModals />
    </div>
  );
}
