export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'finance_officer'
  | 'content_editor'
  | 'programs_coordinator';

export type TabType =
  | 'overview'
  | 'blogs'
  | 'donations'
  | 'volunteers'
  | 'partners'
  | 'projects'
  | 'applications'
  | 'financials'
  | 'gallery'
  | 'outreach'
  | 'forms'
  | 'support'
  | 'team';

export type AdminRoutePath =
  | '/admin'
  | '/admin/overview'
  | '/admin/blogs'
  | '/admin/blog'
  | '/admin/donations'
  | '/admin/volunteers'
  | '/admin/partners'
  | '/admin/projects'
  | '/admin/applications'
  | '/admin/application'
  | '/admin/financials'
  | '/admin/gallery'
  | '/admin/outreach'
  | '/admin/outreach-reports'
  | '/admin/forms'
  | '/admin/support'
  | '/admin/team';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleConfig {
  label: string;
  description: string;
  badge: {
    bg: string;
    text: string;
    border: string;
    glow: string;
  };
  allowedTabs: TabType[];
  allowedRoutes: string[];
}

export const TAB_TO_ROUTE: Record<TabType, string> = {
  overview: '/admin',
  blogs: '/admin/blogs',
  donations: '/admin/donations',
  volunteers: '/admin/volunteers',
  partners: '/admin/partners',
  gallery: '/admin/gallery',
  outreach: '/admin/outreach',
  projects: '/admin/projects',
  applications: '/admin/applications',
  financials: '/admin/financials',
  forms: '/admin/forms',
  support: '/admin/support',
  team: '/admin/team',
};

export const ROUTE_TO_TAB: Record<string, TabType> = {
  '/admin': 'overview',
  '/admin/overview': 'overview',
  '/admin/blogs': 'blogs',
  '/admin/blog': 'blogs',
  '/admin/donations': 'donations',
  '/admin/volunteers': 'volunteers',
  '/admin/partners': 'partners',
  '/admin/gallery': 'gallery',
  '/admin/outreach': 'outreach',
  '/admin/outreach-reports': 'outreach',
  '/admin/projects': 'projects',
  '/admin/applications': 'applications',
  '/admin/application': 'applications',
  '/admin/financials': 'financials',
  '/admin/forms': 'forms',
  '/admin/support': 'support',
  '/admin/team': 'team',
};

export const ROLE_CONFIGS: Record<AdminRole, RoleConfig> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full root access to all data, treasury accounts, system configurations, and staff accounts.',
    badge: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    },
    allowedTabs: [
      'overview',
      'blogs',
      'donations',
      'volunteers',
      'partners',
      'gallery',
      'outreach',
      'projects',
      'applications',
      'financials',
      'forms',
      'support',
      'team',
    ],
    allowedRoutes: [
      '/admin',
      '/admin/overview',
      '/admin/blogs',
      '/admin/blog',
      '/admin/donations',
      '/admin/volunteers',
      '/admin/partners',
      '/admin/gallery',
      '/admin/outreach',
      '/admin/outreach-reports',
      '/admin/projects',
      '/admin/applications',
      '/admin/application',
      '/admin/financials',
      '/admin/forms',
      '/admin/support',
      '/admin/team',
    ],
  },
  admin: {
    label: 'Administrator',
    description: 'Broad operations management across content, programs, applications, and campaigns.',
    badge: {
      bg: 'bg-green-500/20',
      text: 'text-green-300',
      border: 'border-green-500/40',
      glow: 'shadow-[0_0_12px_rgba(34,197,94,0.25)]',
    },
    allowedTabs: [
      'overview',
      'blogs',
      'donations',
      'volunteers',
      'partners',
      'gallery',
      'outreach',
      'projects',
      'applications',
      'forms',
      'support',
    ],
    allowedRoutes: [
      '/admin',
      '/admin/overview',
      '/admin/blogs',
      '/admin/blog',
      '/admin/donations',
      '/admin/volunteers',
      '/admin/partners',
      '/admin/gallery',
      '/admin/outreach',
      '/admin/outreach-reports',
      '/admin/projects',
      '/admin/applications',
      '/admin/application',
      '/admin/forms',
      '/admin/support',
    ],
  },
  finance_officer: {
    label: 'Finance Officer',
    description: 'Audit ledgers, treasury accounts, bank accounts, and donation inflow reconciliations.',
    badge: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    },
    allowedTabs: ['overview', 'donations', 'financials'],
    allowedRoutes: [
      '/admin',
      '/admin/overview',
      '/admin/donations',
      '/admin/financials',
    ],
  },
  content_editor: {
    label: 'Content Editor',
    description: 'Publication of blog articles, media gallery catalog, charity projects, applications review, and landing notifications.',
    badge: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    },
    allowedTabs: ['overview', 'blogs', 'gallery', 'outreach', 'projects', 'applications', 'forms'],
    allowedRoutes: [
      '/admin',
      '/admin/overview',
      '/admin/blogs',
      '/admin/blog',
      '/admin/gallery',
      '/admin/outreach',
      '/admin/outreach-reports',
      '/admin/projects',
      '/admin/applications',
      '/admin/application',
      '/admin/forms',
    ],
  },
  programs_coordinator: {
    label: 'Programs Coordinator',
    description: 'Community volunteers roster, academic scholarships, VOIE skills intake, and live support desk.',
    badge: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.25)]',
    },
    allowedTabs: ['overview', 'volunteers', 'partners', 'outreach', 'applications', 'support'],
    allowedRoutes: [
      '/admin',
      '/admin/overview',
      '/admin/volunteers',
      '/admin/partners',
      '/admin/outreach',
      '/admin/outreach-reports',
      '/admin/applications',
      '/admin/application',
      '/admin/support',
    ],
  },
};

export function canAccessTab(role: AdminRole | string, tab: TabType): boolean {
  const config = ROLE_CONFIGS[role as AdminRole];
  if (!config) return false;
  return config.allowedTabs.includes(tab);
}

export function canAccessRoute(role: AdminRole | string, routePath: string): boolean {
  const config = ROLE_CONFIGS[role as AdminRole];
  if (!config) return false;
  const normalized = routePath.replace(/\/$/, '') || '/admin';
  if (config.allowedRoutes.includes(normalized)) return true;
  const tab = ROUTE_TO_TAB[normalized];
  if (tab && config.allowedTabs.includes(tab)) return true;
  return false;
}

export function getAllowedTabs(role: AdminRole | string): TabType[] {
  const config = ROLE_CONFIGS[role as AdminRole];
  return config ? config.allowedTabs : ['overview'];
}

export function getAllowedRoutes(role: AdminRole | string): string[] {
  const config = ROLE_CONFIGS[role as AdminRole];
  return config ? config.allowedRoutes : ['/admin'];
}

export function getRoleLabel(role: AdminRole | string): string {
  const config = ROLE_CONFIGS[role as AdminRole];
  return config ? config.label : 'Staff Member';
}

export function getRoleBadge(role: AdminRole | string) {
  const config = ROLE_CONFIGS[role as AdminRole];
  return (
    config?.badge || {
      bg: 'bg-gray-500/20',
      text: 'text-gray-300',
      border: 'border-gray-500/40',
      glow: '',
    }
  );
}

export const AUTH_STORAGE_KEY = 'vof_admin_auth_user';
export const AUTH_TOKEN_KEY = 'vof_admin_auth_token';
