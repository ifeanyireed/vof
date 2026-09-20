'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  HeartHandshake,
  Users,
  Target,
  GraduationCap,
  Wallet,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit3,
  ExternalLink,
  UploadCloud,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  X,
  ChevronRight,
  Check,
  FileText,
  BadgeAlert,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import {
  api,
  DashboardStats,
  BlogItem,
  DonationItem,
  VolunteerItem,
  CharityProjectItem,
  ScholarshipItem,
  SkillAppItem,
  FinancialAccountItem,
  FinancialTxItem,
  FinancialSummary,
} from '@/lib/api';

type TabType =
  | 'overview'
  | 'blogs'
  | 'donations'
  | 'volunteers'
  | 'projects'
  | 'applications'
  | 'financials';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [projects, setProjects] = useState<CharityProjectItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [skills, setSkills] = useState<SkillAppItem[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccountItem[]>([]);
  const [transactions, setTransactions] = useState<FinancialTxItem[]>([]);
  const [finSummary, setFinSummary] = useState<FinancialSummary | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blogFilter, setBlogFilter] = useState<string>('all');
  const [appTab, setAppTab] = useState<'scholarship' | 'skills'>('scholarship');

  // Modals state
  const [isBlogModalOpen, setIsBlogModalOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogItem>>({
    title: '',
    slug: '',
    category: 'Education Support',
    region: 'NIGERIA',
    excerpt: '',
    content: '',
    authorName: 'Rev. Fr. Charles Onyeneke',
    authorRole: 'Founder / President',
    authorAvatar: '/team/charles-onyeneke.jpg',
    readTime: '4 min read',
    dateDisplay: 'September 2026',
    day: '20',
    month: 'SEP',
    likes: 120,
    status: 'published',
    imageUrl: '/blog/appreciation-aifue.jpg',
  });

  const [isDonationModalOpen, setIsDonationModalOpen] = useState<boolean>(false);
  const [donationFormData, setDonationFormData] = useState<Partial<DonationItem>>({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: 100000,
    currency: 'NGN',
    campaign: 'VOIE Vocational Training',
    paymentMethod: 'Zenith Bank Transfer',
    reference: '',
    notes: '',
    status: 'completed',
    anonymous: false,
  });

  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<CharityProjectItem | null>(null);
  const [projectFormData, setProjectFormData] = useState<Partial<CharityProjectItem>>({
    title: '',
    slug: '',
    category: 'Vocational Education',
    description: '',
    targetAmount: 25000000,
    raisedAmount: 0,
    currency: 'NGN',
    location: 'Mbieri, Imo State, Nigeria',
    beneficiariesCount: 500,
    status: 'active',
    imageUrl: '/blog/appreciation-aifue.jpg',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  });

  const [isTxModalOpen, setIsTxModalOpen] = useState<boolean>(false);
  const [txFormData, setTxFormData] = useState<Partial<FinancialTxItem>>({
    accountId: 1,
    transactionType: 'inflow',
    category: 'Public Donation',
    amount: 500000,
    currency: 'NGN',
    description: '',
    reference: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState<boolean>(false);
  const [newVolunteer, setNewVolunteer] = useState<Partial<VolunteerItem>>({
    fullName: '',
    email: '',
    phone: '',
    location: 'Owerri, Imo State',
    interestArea: 'VOIE Skills Mentorship',
    availability: 'Weekends',
    skillsExperience: '',
    status: 'new',
  });

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Load all data
  const loadAllData = async () => {
    try {
      setRefreshing(true);
      const [
        statsData,
        blogsData,
        donationsData,
        volunteersData,
        projectsData,
        scholarshipsData,
        skillsData,
        accountsData,
        txsData,
        finSumData,
      ] = await Promise.allSettled([
        api.getDashboardOverview(),
        api.getBlogs(),
        api.getDonations(),
        api.getVolunteers(),
        api.getProjects(),
        api.getScholarships(),
        api.getSkills(),
        api.getAccounts(),
        api.getTransactions(),
        api.getFinancialSummary(),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (blogsData.status === 'fulfilled') setBlogs(blogsData.value);
      if (donationsData.status === 'fulfilled') setDonations(donationsData.value);
      if (volunteersData.status === 'fulfilled') setVolunteers(volunteersData.value);
      if (projectsData.status === 'fulfilled') setProjects(projectsData.value);
      if (scholarshipsData.status === 'fulfilled') setScholarships(scholarshipsData.value);
      if (skillsData.status === 'fulfilled') setSkills(skillsData.value);
      if (accountsData.status === 'fulfilled') setAccounts(accountsData.value);
      if (txsData.status === 'fulfilled') setTransactions(txsData.value);
      if (finSumData.status === 'fulfilled') setFinSummary(finSumData.value);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Image upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'blog' | 'project') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingImage(true);
      const url = await api.uploadFile(file);
      if (targetField === 'blog') {
        setBlogFormData((prev) => ({ ...prev, imageUrl: url }));
      } else {
        setProjectFormData((prev) => ({ ...prev, imageUrl: url }));
      }
      showNotification('success', 'Image uploaded to Cloudinary successfully!');
    } catch (err: any) {
      showNotification('error', 'Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Blog
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog && editingBlog.id) {
        await api.updateBlog(editingBlog.id, blogFormData);
        showNotification('success', 'Blog updated successfully!');
      } else {
        await api.createBlog(blogFormData);
        showNotification('success', 'New blog post published successfully!');
      }
      setIsBlogModalOpen(false);
      setEditingBlog(null);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to save blog: ' + err.message);
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.deleteBlog(id);
      showNotification('success', 'Blog post removed');
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to delete blog');
    }
  };

  // Save Donation
  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDonation(donationFormData);
      showNotification('success', 'Donation logged successfully!');
      setIsDonationModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to log donation: ' + err.message);
    }
  };

  // Save Volunteer
  const handleSaveVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createVolunteer(newVolunteer);
      showNotification('success', 'Volunteer registered successfully!');
      setIsVolunteerModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to save volunteer: ' + err.message);
    }
  };

  // Update Volunteer Status
  const handleUpdateVolunteerStatus = async (id: number, status: string) => {
    try {
      await api.updateVolunteerStatus(id, status);
      showNotification('success', `Status updated to ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to update volunteer status');
    }
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject && editingProject.id) {
        await api.updateProject(editingProject.id, projectFormData);
        showNotification('success', 'Project updated successfully!');
      } else {
        await api.createProject(projectFormData);
        showNotification('success', 'Charity project launched successfully!');
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to save project: ' + err.message);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      showNotification('success', 'Project deleted');
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to delete project');
    }
  };

  // Update Scholarship Status
  const handleUpdateScholarshipStatus = async (id: number, status: string) => {
    try {
      await api.updateScholarshipStatus(id, status);
      showNotification('success', `Application status changed to ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to update application');
    }
  };

  // Update Skill App Status
  const handleUpdateSkillStatus = async (id: number, status: string) => {
    try {
      await api.updateSkillStatus(id, status);
      showNotification('success', `Candidate status updated to ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to update skill application');
    }
  };

  // Save Transaction
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTransaction(txFormData);
      showNotification('success', 'Financial transaction logged and account balance updated!');
      setIsTxModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to record transaction: ' + err.message);
    }
  };

  // Format currency
  const formatMoney = (amount: number, currency: string = 'NGN') => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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
      <aside className="w-full lg:w-72 bg-[#0c1a05] text-white flex flex-col justify-between shrink-0 border-r border-[#1a3310]">
        <div>
          {/* Logo & Branding */}
          <div className="p-6 border-b border-[#1c3311]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#558b1a] to-[#7cb342] flex items-center justify-center font-bold text-white shadow-lg shadow-green-950">
                VOF
              </div>
              <div>
                <h1 className="font-bold text-base tracking-wide text-white group-hover:text-[#a1e25e] transition">
                  Veronica Onyeneke
                </h1>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                  Admin Central Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'blogs'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Blog CMS</span>
              </div>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                {blogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'donations'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-4 h-4" />
                <span>Donation Funds</span>
              </div>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                {donations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('volunteers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'volunteers'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Volunteers Directory</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                {volunteers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'projects'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4" />
                <span>Charity Projects</span>
              </div>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'applications'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4" />
                <span>Applications Review</span>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                {scholarships.length + skills.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'financials'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4" />
                <span>Financial Accounts</span>
              </div>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                {accounts.length}
              </span>
            </button>
          </nav>
        </div>

        {/* User Info & Quick Link */}
        <div className="p-4 border-t border-[#1c3311]">
          <div className="flex items-center gap-3 p-2 bg-[#12230a] rounded-xl mb-3">
            <div className="w-9 h-9 rounded-full bg-[#558b1a] flex items-center justify-center font-bold text-white text-xs">
              FCO
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Rev. Fr. Charles Onyeneke</p>
              <p className="text-[10px] text-[#a1e25e] uppercase tracking-wider font-medium">Founder / Super Admin</p>
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
              <span>VOF Portal</span>
              <span>/</span>
              <span className="capitalize font-semibold text-gray-900">{activeTab}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {activeTab === 'overview' && 'Executive Foundation Dashboard'}
              {activeTab === 'blogs' && 'Blog & Stories Content Management'}
              {activeTab === 'donations' && 'Donation Inflows & Philanthropy Records'}
              {activeTab === 'volunteers' && 'Volunteer Network & Field Operations'}
              {activeTab === 'projects' && 'Community Projects & Capital Campaigns'}
              {activeTab === 'applications' && 'Empowerment & Aid Applications'}
              {activeTab === 'financials' && 'Treasury Accounts & Audit Ledger'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Neon Postgres Active
            </div>

            <button
              onClick={loadAllData}
              disabled={refreshing}
              className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition flex items-center gap-1.5 text-xs font-medium"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </header>

        {/* Main Tab Content */}
        <div className="p-6 space-y-6">
          {/* ============================================================ */}
          {/* 1. OVERVIEW SCREEN */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Raised (NGN)</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {formatMoney(stats?.totalFundsRaisedNGN || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-emerald-600 font-semibold">{stats?.totalDonationsCount || 0}</span> confirmed contributions
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">USD / Diaspora Gifts</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {formatMoney(stats?.totalFundsRaisedUSD || 0, 'USD')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Zelle & International wire transfers
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {stats?.activeProjectsCount || projects.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    VOIE center, health & food relief
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Applications</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900">
                    {(stats?.pendingScholarships || 0) + (stats?.pendingSkillApps || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Needs review & interview scheduling
                  </p>
                </div>
              </div>

              {/* Bank Balances & Projects Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bank Balances Widget */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#558b1a]" />
                      Verified Treasury Accounts
                    </h3>
                    <button
                      onClick={() => setActiveTab('financials')}
                      className="text-xs text-[#558b1a] hover:underline font-semibold"
                    >
                      View Ledger
                    </button>
                  </div>

                  <div className="space-y-3">
                    {accounts.map((acc) => (
                      <div key={acc.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{acc.accountName}</p>
                          <p className="text-[11px] text-gray-500">{acc.bankName} • {acc.accountNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-gray-900">{formatMoney(acc.balance, acc.currency)}</p>
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold uppercase">
                            {acc.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t flex justify-between items-center text-xs text-gray-600">
                    <span>Total Liquid Capital (NGN):</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatMoney(stats?.totalAccountBalanceNGN || 0, 'NGN')}
                    </span>
                  </div>
                </div>

                {/* Live Charity Projects Progress */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#558b1a]" />
                      Key Projects Funding Progress
                    </h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs text-[#558b1a] hover:underline font-semibold"
                    >
                      Manage Projects
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projects.map((proj) => {
                      const pct = Math.min(100, Math.round((proj.raisedAmount / proj.targetAmount) * 100)) || 0;
                      return (
                        <div key={proj.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{proj.title}</h4>
                              <p className="text-xs text-gray-500">{proj.category} • {proj.location}</p>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {pct}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#558b1a] to-[#7cb342] h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Raised: <strong className="text-gray-900">{formatMoney(proj.raisedAmount, proj.currency)}</strong></span>
                            <span>Target: <strong className="text-gray-900">{formatMoney(proj.targetAmount, proj.currency)}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Donations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#0c1a05] to-[#152a0d] text-white p-6 rounded-2xl shadow-md space-y-4">
                  <h3 className="font-bold text-base text-[#a1e25e]">Administrative Quick Actions</h3>
                  <p className="text-xs text-gray-300">
                    Directly trigger high-priority foundation actions, log donations, or add new stories.
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogFormData({
                          title: '',
                          slug: '',
                          category: 'Education Support',
                          region: 'NIGERIA',
                          excerpt: '',
                          content: '',
                          authorName: 'Rev. Fr. Charles Onyeneke',
                          authorRole: 'Founder / President',
                          authorAvatar: '/team/charles-onyeneke.jpg',
                          readTime: '4 min read',
                          dateDisplay: 'September 2026',
                          day: '20',
                          month: 'SEP',
                          likes: 50,
                          status: 'published',
                          imageUrl: '/blog/appreciation-aifue.jpg',
                        });
                        setIsBlogModalOpen(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Publish New Blog Story
                    </button>

                    <button
                      onClick={() => setIsDonationModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <HeartHandshake className="w-4 h-4 text-emerald-400" />
                      Record Direct Transfer / Donation
                    </button>

                    <button
                      onClick={() => setIsTxModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-4 h-4 text-amber-400" />
                      Log Financial Inflow / Outflow
                    </button>
                  </div>
                </div>

                {/* Recent Donations Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-rose-500" />
                      Recent Donations Log
                    </h3>
                    <button
                      onClick={() => setActiveTab('donations')}
                      className="text-xs text-[#558b1a] hover:underline font-semibold"
                    >
                      View All ({donations.length})
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {donations.slice(0, 4).map((d) => (
                      <div key={d.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{d.donorName}</p>
                          <p className="text-xs text-gray-500">{d.campaign} • {d.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-emerald-700">{formatMoney(d.amount, d.currency)}</p>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(d.donatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. BLOG CMS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search articles by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>

                  <select
                    value={blogFilter}
                    onChange={(e) => setBlogFilter(e.target.value)}
                    className="py-2 px-3 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogFormData({
                      title: '',
                      slug: '',
                      category: 'Education Support',
                      region: 'IMO STATE, NIGERIA',
                      excerpt: '',
                      content: '',
                      authorName: 'Rev. Fr. Charles Onyeneke',
                      authorRole: 'Founder / President',
                      authorAvatar: '/team/charles-onyeneke.jpg',
                      readTime: '4 min read',
                      dateDisplay: 'September 2026',
                      day: '20',
                      month: 'SEP',
                      likes: 240,
                      status: 'published',
                      imageUrl: '/blog/appreciation-aifue.jpg',
                    });
                    setIsBlogModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Create New Article
                </button>
              </div>

              {/* Blogs Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                      <th className="p-4">Article</th>
                      <th className="p-4">Category & Region</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Date & Likes</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {blogs
                      .filter((b) =>
                        searchQuery ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
                      )
                      .filter((b) => (blogFilter === 'all' ? true : b.status === blogFilter))
                      .map((blog) => (
                        <tr key={blog.id || blog.slug} className="hover:bg-gray-50/70 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0">
                                <img
                                  src={blog.imageUrl || '/blog/appreciation-aifue.jpg'}
                                  alt={blog.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="max-w-xs">
                                <p className="font-bold text-gray-900 line-clamp-1">{blog.title}</p>
                                <p className="text-[11px] text-gray-500 line-clamp-1">{blog.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                              {blog.category}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase">{blog.region}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{blog.authorName}</p>
                            <p className="text-[11px] text-gray-500">{blog.authorRole || 'Contributor'}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-700">{blog.dateDisplay || `${blog.day} ${blog.month}`}</p>
                            <p className="text-[11px] text-rose-500 font-semibold">{blog.likes} likes</p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                                blog.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {blog.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                                title="View Public Post"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => {
                                  setEditingBlog(blog);
                                  setBlogFormData(blog);
                                  setIsBlogModalOpen(true);
                                }}
                                className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                title="Edit Post"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {blog.id && (
                                <button
                                  onClick={() => handleDeleteBlog(blog.id!)}
                                  className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. DONATION FUNDS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search donor, reference..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsDonationModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Log Manual Donation
                </button>
              </div>

              {/* Donations Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Amount & Currency</th>
                      <th className="p-4">Campaign Target</th>
                      <th className="p-4">Payment Channel</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {donations
                      .filter((d) =>
                        searchQuery
                          ? d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (d.reference && d.reference.toLowerCase().includes(searchQuery.toLowerCase()))
                          : true
                      )
                      .map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50/70 transition">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{d.donorName}</p>
                            <p className="text-[11px] text-gray-500">{d.donorEmail || d.donorPhone || 'Direct Transfer'}</p>
                            {d.notes && <p className="text-[10px] text-gray-400 italic mt-0.5">&ldquo;{d.notes}&rdquo;</p>}
                          </td>
                          <td className="p-4">
                            <p className="font-black text-emerald-800 text-sm">
                              {formatMoney(d.amount, d.currency)}
                            </p>
                            <span className="text-[10px] text-gray-500 font-mono uppercase">{d.currency}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-medium">
                              {d.campaign}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-700">{d.paymentMethod}</p>
                            {d.reference && <p className="text-[10px] text-gray-400 font-mono">Ref: {d.reference}</p>}
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(d.donatedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. VOLUNTEER SIGNUP & LIST */}
          {/* ============================================================ */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search volunteer by name or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVolunteerModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Volunteer
                  </button>
                </div>
              </div>

              {/* Volunteers Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                      <th className="p-4">Volunteer</th>
                      <th className="p-4">Interest Area</th>
                      <th className="p-4">Availability & Location</th>
                      <th className="p-4">Experience / Bio</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {volunteers
                      .filter((v) =>
                        searchQuery
                          ? v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.skillsExperience.toLowerCase().includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((vol) => (
                        <tr key={vol.id} className="hover:bg-gray-50/70 transition">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{vol.fullName}</p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {vol.email}
                            </p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {vol.phone}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                              {vol.interestArea}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-800">{vol.availability}</p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {vol.location}
                            </p>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-gray-600 line-clamp-2">{vol.skillsExperience}</p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                                vol.status === 'approved' || vol.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : vol.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {vol.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={vol.status}
                              onChange={(e) => handleUpdateVolunteerStatus(vol.id!, e.target.value)}
                              className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="approved">Approved</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. CHARITY PROJECTS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-600">
                  Managing <strong>{projects.length}</strong> active & planned charity initiatives.
                </p>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectFormData({
                      title: '',
                      slug: '',
                      category: 'Vocational Education',
                      description: '',
                      targetAmount: 10000000,
                      raisedAmount: 0,
                      currency: 'NGN',
                      location: 'Mbieri, Imo State, Nigeria',
                      beneficiariesCount: 400,
                      status: 'active',
                      imageUrl: '/blog/appreciation-aifue.jpg',
                      startDate: '2026-02-01',
                      endDate: '2026-12-31',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Launch New Project
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => {
                  const pct = Math.min(100, Math.round((p.raisedAmount / p.targetAmount) * 100)) || 0;
                  return (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                              {p.category}
                            </span>
                            <h3 className="text-base font-bold text-gray-900 mt-2">{p.title}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5" /> {p.location}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                              p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Progress */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-900">{formatMoney(p.raisedAmount, p.currency)}</span>
                            <span className="text-gray-500 font-medium">Target: {formatMoney(p.targetAmount, p.currency)}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#558b1a] to-[#7cb342] h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                            <span>{pct}% funded</span>
                            <span><strong>{p.beneficiariesCount}</strong> beneficiaries targeted</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
                        <span className="text-gray-500 text-[11px]">Duration: {p.startDate} - {p.endDate}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setProjectFormData(p);
                              setIsProjectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-semibold"
                          >
                            Edit
                          </button>
                          {p.id && (
                            <button
                              onClick={() => handleDeleteProject(p.id!)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 6. SCHOLARSHIP & SKILL APPLICATIONS */}
          {/* ============================================================ */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Switcher Tab */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setAppTab('scholarship')}
                  className={`pb-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    appTab === 'scholarship'
                      ? 'border-[#558b1a] text-[#558b1a]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Scholarship Applications ({scholarships.length})
                </button>
                <button
                  onClick={() => setAppTab('skills')}
                  className={`pb-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                    appTab === 'skills'
                      ? 'border-[#558b1a] text-[#558b1a]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  VOIE Skill Acquisition Institute ({skills.length})
                </button>
              </div>

              {/* Sub-tab 1: Scholarships */}
              {appTab === 'scholarship' && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                        <th className="p-4">Student Applicant</th>
                        <th className="p-4">Institution & Course</th>
                        <th className="p-4">Academic Level & CGPA</th>
                        <th className="p-4">Grant Requested</th>
                        <th className="p-4">Reason for Aid</th>
                        <th className="p-4">Status & Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {scholarships.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/70 transition">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{s.applicantName}</p>
                            <p className="text-[11px] text-gray-500">{s.email}</p>
                            <p className="text-[11px] text-gray-400">{s.phone} • {s.stateOfOrigin} State</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{s.institutionName}</p>
                            <p className="text-[11px] text-gray-500">{s.courseOfStudy}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-gray-800">{s.currentLevel}</p>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                              CGPA: {s.cgpa}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900 text-sm">
                              {formatMoney(s.amountRequested, 'NGN')}
                            </p>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-gray-600 line-clamp-2 text-[11px]">{s.reasonForAid}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={s.status}
                              onChange={(e) => handleUpdateScholarshipStatus(s.id!, e.target.value)}
                              className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white font-medium focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="under_review">Under Review</option>
                              <option value="approved">Approved</option>
                              <option value="disbursed">Disbursed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-tab 2: Skill Acquisition */}
              {appTab === 'skills' && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                        <th className="p-4">Candidate</th>
                        <th className="p-4">Selected Trade</th>
                        <th className="p-4">Education & Status</th>
                        <th className="p-4">Statement of Purpose</th>
                        <th className="p-4">Batch</th>
                        <th className="p-4">Enrollment Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {skills.map((k) => (
                        <tr key={k.id} className="hover:bg-gray-50/70 transition">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{k.applicantName}</p>
                            <p className="text-[11px] text-gray-500">{k.email}</p>
                            <p className="text-[11px] text-gray-400">{k.phone} • {k.address}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px]">
                              {k.tradeSelected}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-900">{k.educationLevel}</p>
                            <p className="text-[11px] text-gray-500">{k.employmentStatus}</p>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-gray-600 line-clamp-2 text-[11px]">{k.statementOfPurpose}</p>
                          </td>
                          <td className="p-4 text-gray-600 font-mono text-[11px]">
                            {k.intakeBatch}
                          </td>
                          <td className="p-4">
                            <select
                              value={k.status}
                              onChange={(e) => handleUpdateSkillStatus(k.id!, e.target.value)}
                              className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white font-medium focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="interview_scheduled">Interview Scheduled</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="graduated">Graduated</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 7. FINANCIAL ACCOUNTS & TRANSACTIONS DASHBOARD */}
          {/* ============================================================ */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Top Financial Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NGN Balance</p>
                  <p className="text-2xl font-black text-emerald-800 mt-1">
                    {formatMoney(finSummary?.totalNGNBalance || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Domestic Operations & VOIE</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">USD Balance</p>
                  <p className="text-2xl font-black text-blue-800 mt-1">
                    {formatMoney(finSummary?.totalUSDBalance || 0, 'USD')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Chase International Domiciliary</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Inflow (NGN)</p>
                  <p className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                    {formatMoney(finSummary?.totalNGNInflow || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Donations & corporate grants</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Outflow (NGN)</p>
                  <p className="text-2xl font-black text-gray-900 mt-1 flex items-center gap-1">
                    <ArrowDownRight className="w-5 h-5 text-rose-600" />
                    {formatMoney(finSummary?.totalNGNOutflow || 0, 'NGN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Projects, equipment & relief</p>
                </div>
              </div>

              {/* Bank Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {accounts.map((acc) => (
                  <div key={acc.id} className="bg-gradient-to-br from-[#0c1a05] to-[#1a3310] text-white p-5 rounded-2xl shadow relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#a1e25e]">
                        {acc.bankName}
                      </span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono uppercase">
                        {acc.currency}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mt-2 truncate">{acc.accountName}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">Acc: {acc.accountNumber}</p>
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-baseline">
                      <span className="text-[11px] text-gray-300">Balance:</span>
                      <span className="text-lg font-black text-white">{formatMoney(acc.balance, acc.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions Ledger */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm space-y-4 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Financial Audit & Transactions Ledger</h3>
                    <p className="text-xs text-gray-500">Every inflow & disbursement logged directly in Neon Postgres.</p>
                  </div>
                  <button
                    onClick={() => setIsTxModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Record Transaction
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                        <th className="p-3">Date</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Account</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Reference</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50/70 transition">
                          <td className="p-3 font-mono text-gray-600">{tx.transactionDate}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] inline-flex items-center gap-1 ${
                                tx.transactionType === 'inflow'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {tx.transactionType === 'inflow' ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              {tx.transactionType}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-gray-900">{tx.accountName}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium text-[11px]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="p-3 max-w-sm">
                            <p className="text-gray-900 font-medium">{tx.description}</p>
                          </td>
                          <td className="p-3 font-mono text-gray-500 text-[11px]">{tx.reference || '-'}</td>
                          <td className="p-3 text-right font-black text-sm">
                            <span
                              className={
                                tx.transactionType === 'inflow' ? 'text-emerald-700' : 'text-rose-700'
                              }
                            >
                              {tx.transactionType === 'inflow' ? '+' : '-'}
                              {formatMoney(tx.amount, tx.currency)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT BLOG */}
      {/* ============================================================ */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {editingBlog ? 'Edit Blog Story' : 'Publish New Blog Post'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogFormData.title || ''}
                  onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                  placeholder="e.g. Beyond the Degree: Empowering Youth in Mbieri"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={blogFormData.category || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    placeholder="Education Support / Outreach / Healthcare"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Region Tag</label>
                  <input
                    type="text"
                    value={blogFormData.region || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, region: e.target.value })}
                    placeholder="IMO STATE, NIGERIA / GLOBAL"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={blogFormData.authorName || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Day & Month</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="10"
                      value={blogFormData.day || ''}
                      onChange={(e) => setBlogFormData({ ...blogFormData, day: e.target.value })}
                      className="w-1/2 px-2.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="MAY"
                      value={blogFormData.month || ''}
                      onChange={(e) => setBlogFormData({ ...blogFormData, month: e.target.value })}
                      className="w-1/2 px-2.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status</label>
                  <select
                    value={blogFormData.status || 'published'}
                    onChange={(e) =>
                      setBlogFormData({ ...blogFormData, status: e.target.value as 'published' | 'draft' })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cloudinary Image Upload */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Cover Image (Cloudinary or URL)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={blogFormData.imageUrl || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, imageUrl: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                  <label className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-1.5 shrink-0 transition">
                    <UploadCloud className="w-4 h-4 text-emerald-600" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'blog')}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={blogFormData.excerpt || ''}
                  onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                  placeholder="Brief 1-2 sentence preview for cards..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Article Body *</label>
                <textarea
                  rows={6}
                  required
                  value={blogFormData.content || ''}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  placeholder="Write the full news story or announcement here..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition"
                >
                  {editingBlog ? 'Update Post' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: LOG DONATION */}
      {/* ============================================================ */}
      {isDonationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">Record Direct Donation</h3>
              <button
                onClick={() => setIsDonationModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDonation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  value={donationFormData.donorName || ''}
                  onChange={(e) => setDonationFormData({ ...donationFormData, donorName: e.target.value })}
                  placeholder="e.g. Dr. Ngozi Adeleke / Anonymous"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Amount *</label>
                  <input
                    type="number"
                    required
                    value={donationFormData.amount || ''}
                    onChange={(e) =>
                      setDonationFormData({ ...donationFormData, amount: parseFloat(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Currency</label>
                  <select
                    value={donationFormData.currency || 'NGN'}
                    onChange={(e) => setDonationFormData({ ...donationFormData, currency: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Campaign</label>
                <select
                  value={donationFormData.campaign || 'General Donation'}
                  onChange={(e) => setDonationFormData({ ...donationFormData, campaign: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="VOIE Vocational Training">VOIE Vocational Training</option>
                  <option value="Maternal Healthcare Outreach">Maternal Healthcare Outreach</option>
                  <option value="Rural Education & Scholarships">Rural Education & Scholarships</option>
                  <option value="General Donation">General Donation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Payment Method</label>
                  <select
                    value={donationFormData.paymentMethod || 'Zenith Bank Transfer'}
                    onChange={(e) => setDonationFormData({ ...donationFormData, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Zenith Bank Transfer">Zenith Bank Transfer</option>
                    <option value="GTBank Transfer">GTBank Transfer</option>
                    <option value="Zelle">Zelle (US)</option>
                    <option value="Online Card">Online Card</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Reference / Note</label>
                  <input
                    type="text"
                    value={donationFormData.reference || ''}
                    onChange={(e) => setDonationFormData({ ...donationFormData, reference: e.target.value })}
                    placeholder="TRF-90281"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDonationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition"
                >
                  Save Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT PROJECT */}
      {/* ============================================================ */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {editingProject ? 'Edit Charity Project' : 'Launch New Charity Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.title || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  placeholder="e.g. Clean Water Borehole & Sanitation Outreach"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Amount (NGN) *</label>
                  <input
                    type="number"
                    required
                    value={projectFormData.targetAmount || ''}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, targetAmount: parseFloat(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Currently Raised</label>
                  <input
                    type="number"
                    value={projectFormData.raisedAmount || 0}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, raisedAmount: parseFloat(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={projectFormData.location || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                    placeholder="Mbieri, Imo State"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Beneficiaries</label>
                  <input
                    type="number"
                    value={projectFormData.beneficiariesCount || 0}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, beneficiariesCount: parseInt(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Project Description *</label>
                <textarea
                  rows={3}
                  required
                  value={projectFormData.description || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Describe the scope, objectives, and impact..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition"
                >
                  {editingProject ? 'Update Project' : 'Launch Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: LOG TRANSACTION */}
      {/* ============================================================ */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">Record Financial Transaction</h3>
              <button
                onClick={() => setIsTxModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Account *</label>
                <select
                  value={txFormData.accountId || 1}
                  onChange={(e) => setTxFormData({ ...txFormData, accountId: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} ({a.bankName} - {a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Transaction Type</label>
                  <select
                    value={txFormData.transactionType || 'inflow'}
                    onChange={(e) =>
                      setTxFormData({ ...txFormData, transactionType: e.target.value as 'inflow' | 'outflow' })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="inflow">Inflow (+ Income/Donation)</option>
                    <option value="outflow">Outflow (- Disbursement)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Amount *</label>
                  <input
                    type="number"
                    required
                    value={txFormData.amount || ''}
                    onChange={(e) => setTxFormData({ ...txFormData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Category</label>
                <select
                  value={txFormData.category || 'Project Disbursement'}
                  onChange={(e) => setTxFormData({ ...txFormData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="Public Donation">Public Donation</option>
                  <option value="Corporate Grant">Corporate Grant</option>
                  <option value="Project Disbursement">Project Disbursement</option>
                  <option value="Administrative & Utilities">Administrative & Utilities</option>
                  <option value="Logistics & Welfare">Logistics & Welfare</option>
                  <option value="Staff & Instructors Honorarium">Staff & Instructors Honorarium</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={txFormData.description || ''}
                  onChange={(e) => setTxFormData({ ...txFormData, description: e.target.value })}
                  placeholder="e.g. Purchase of sewing machine needles and fabrics"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Reference</label>
                  <input
                    type="text"
                    value={txFormData.reference || ''}
                    onChange={(e) => setTxFormData({ ...txFormData, reference: e.target.value })}
                    placeholder="INV-2026-081"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={txFormData.transactionDate || ''}
                    onChange={(e) => setTxFormData({ ...txFormData, transactionDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition"
                >
                  Record & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD VOLUNTEER */}
      {/* ============================================================ */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">Add Volunteer Entry</h3>
              <button
                onClick={() => setIsVolunteerModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVolunteer} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newVolunteer.fullName || ''}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, fullName: e.target.value })}
                  placeholder="e.g. Jennifer Nkechi"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newVolunteer.email || ''}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                    placeholder="jennifer@example.com"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newVolunteer.phone || ''}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Interest Area</label>
                  <select
                    value={newVolunteer.interestArea || 'VOIE Skills Mentorship'}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, interestArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="VOIE Skills Mentorship">VOIE Skills Mentorship</option>
                    <option value="Medical Outreach">Medical Outreach</option>
                    <option value="Event Planning & Logistics">Event Planning & Logistics</option>
                    <option value="Fundraising & Grants">Fundraising & Grants</option>
                    <option value="Media & Content">Media & Content</option>
                    <option value="General Volunteer">General Volunteer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Availability</label>
                  <select
                    value={newVolunteer.availability || 'Weekends'}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Weekends">Weekends</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Location (City, State)</label>
                <input
                  type="text"
                  value={newVolunteer.location || ''}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, location: e.target.value })}
                  placeholder="Owerri, Imo State"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Skills & Relevant Experience</label>
                <textarea
                  rows={2}
                  value={newVolunteer.skillsExperience || ''}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, skillsExperience: e.target.value })}
                  placeholder="Brief summary of skills or motivation..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsVolunteerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition"
                >
                  Register Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
