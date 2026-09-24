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
  ChevronDown,
  Camera,
  Eye,
  Copy,
  Grid,
  List,
  Image as ImageIcon
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
  PartnerItem,
  GalleryMediaItem,
} from '@/lib/api';

type TabType =
  | 'overview'
  | 'blogs'
  | 'donations'
  | 'volunteers'
  | 'partners'
  | 'projects'
  | 'applications'
  | 'financials'
  | 'gallery';

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
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [projects, setProjects] = useState<CharityProjectItem[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [skills, setSkills] = useState<SkillAppItem[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccountItem[]>([]);
  const [transactions, setTransactions] = useState<FinancialTxItem[]>([]);
  const [finSummary, setFinSummary] = useState<FinancialSummary | null>(null);
  const [galleryMedia, setGalleryMedia] = useState<GalleryMediaItem[]>([]);

  // Gallery Manager states
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');
  const [galleryYearFilter, setGalleryYearFilter] = useState<string>('all');
  const [galleryRegionFilter, setGalleryRegionFilter] = useState<string>('all');
  const [galleryViewMode, setGalleryViewMode] = useState<'grid' | 'table'>('grid');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [editingMedia, setEditingMedia] = useState<GalleryMediaItem | null>(null);
  const [previewingMedia, setPreviewingMedia] = useState<GalleryMediaItem | null>(null);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState<boolean>(false);
  const [isSavingMedia, setIsSavingMedia] = useState<boolean>(false);
  const [mediaFormData, setMediaFormData] = useState<{
    title: string;
    category: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    eventDate: string;
    year: number;
    region: 'Global' | 'Nigeria' | 'Rwanda' | 'USA';
    location: string;
    albumTitle: string;
    featured: boolean;
    status: 'published' | 'draft' | 'archived';
  }>({
    title: '',
    category: 'Vocational Skills',
    mediaUrl: '',
    mediaType: 'image',
    caption: '',
    eventDate: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear(),
    region: 'Nigeria',
    location: '',
    albumTitle: '',
    featured: false,
    status: 'published',
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blogFilter, setBlogFilter] = useState<string>('all');
  const [appTab, setAppTab] = useState<'scholarship' | 'skills'>('scholarship');

  // Country / Hub Filters for Tables
  const [volunteerHubFilter, setVolunteerHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');
  const [partnerHubFilter, setPartnerHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<string>('all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('all');
  const [scholarshipHubFilter, setScholarshipHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');
  const [skillsHubFilter, setSkillsHubFilter] = useState<'all' | 'Nigeria' | 'Rwanda' | 'USA'>('all');

  // Partner Modal & Review State
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);
  const [isUpdatingPartner, setIsUpdatingPartner] = useState<boolean>(false);
  const [partnerStatusUpdate, setPartnerStatusUpdate] = useState<string>('new');
  const [partnerNotesUpdate, setPartnerNotesUpdate] = useState<string>('');

  const getRecordCountry = (item: { country?: string; location?: string; address?: string; stateOfOrigin?: string }): 'Nigeria' | 'Rwanda' | 'USA' => {
    if (item.country === 'Nigeria' || item.country === 'Rwanda' || item.country === 'USA') return item.country;
    const str = `${item.location || ''} ${item.address || ''} ${item.stateOfOrigin || ''}`.toLowerCase();
    if (str.includes('rwanda') || str.includes('kigali')) return 'Rwanda';
    if (str.includes('usa') || str.includes('united states') || str.includes('houston') || str.includes('texas')) return 'USA';
    return 'Nigeria';
  };

  const renderCountryBadge = (c: 'Nigeria' | 'Rwanda' | 'USA') => {
    if (c === 'Rwanda') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
          🇷🇼 Rwanda
        </span>
      );
    }
    if (c === 'USA') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
          🇺🇸 USA
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
        🇳🇬 Nigeria
      </span>
    );
  };

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
    authorAvatar: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg',
    readTime: '4 min read',
    dateDisplay: 'September 2026',
    day: '20',
    month: 'SEP',
    likes: 120,
    status: 'published',
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
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
    imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
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
        partnersData,
        projectsData,
        scholarshipsData,
        skillsData,
        accountsData,
        txsData,
        finSumData,
        galleryData,
      ] = await Promise.allSettled([
        api.getDashboardOverview(),
        api.getBlogs(),
        api.getDonations(),
        api.getVolunteers(),
        api.getPartners(),
        api.getProjects(),
        api.getScholarships(),
        api.getSkills(),
        api.getAccounts(),
        api.getTransactions(),
        api.getFinancialSummary(),
        api.getGalleryMedia(),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (blogsData.status === 'fulfilled') setBlogs(blogsData.value);
      if (donationsData.status === 'fulfilled') setDonations(donationsData.value);
      if (volunteersData.status === 'fulfilled') setVolunteers(volunteersData.value);
      if (partnersData.status === 'fulfilled') setPartners(partnersData.value);
      if (projectsData.status === 'fulfilled') setProjects(projectsData.value);
      if (scholarshipsData.status === 'fulfilled') setScholarships(scholarshipsData.value);
      if (skillsData.status === 'fulfilled') setSkills(skillsData.value);
      if (accountsData.status === 'fulfilled') setAccounts(accountsData.value);
      if (txsData.status === 'fulfilled') setTransactions(txsData.value);
      if (finSumData.status === 'fulfilled') setFinSummary(finSumData.value);
      if (galleryData.status === 'fulfilled') setGalleryMedia(galleryData.value);
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

  const handleUpdatePartnerStatus = async (id: number, newStatus: string, notes?: string) => {
    try {
      setIsUpdatingPartner(true);
      await api.updatePartnerStatus(id, newStatus, notes);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus as any, notes: notes !== undefined ? notes : p.notes } : p))
      );
      if (selectedPartner && selectedPartner.id === id) {
        setSelectedPartner((prev) => (prev ? { ...prev, status: newStatus as any, notes: notes !== undefined ? notes : prev.notes } : null));
      }
      showNotification('success', `Partner status updated to ${newStatus.replace('_', ' ')}`);
    } catch {
      showNotification('error', 'Failed to update partner status');
    } finally {
      setIsUpdatingPartner(false);
    }
  };

  const handleDeletePartner = async (id: number) => {
    if (!confirm('Are you sure you want to remove this partner record?')) return;
    try {
      await api.deletePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      if (selectedPartner && selectedPartner.id === id) setSelectedPartner(null);
      showNotification('success', 'Partner record removed successfully');
    } catch {
      showNotification('error', 'Failed to remove partner record');
    }
  };

  // Gallery Management Handlers
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFormData.title.trim() || !mediaFormData.mediaUrl.trim()) {
      showNotification('error', 'Please provide a title and media URL/upload');
      return;
    }
    try {
      setIsSavingMedia(true);
      let calculatedYear = mediaFormData.year;
      if (mediaFormData.eventDate) {
        const parsedYear = parseInt(mediaFormData.eventDate.split('-')[0]);
        if (!isNaN(parsedYear)) calculatedYear = parsedYear;
      }
      const payload = {
        ...mediaFormData,
        year: calculatedYear,
      };

      if (editingMedia && editingMedia.id) {
        const updated = await api.updateGalleryMedia(editingMedia.id, payload);
        setGalleryMedia((prev) => prev.map((m) => (m.id === editingMedia.id ? { ...m, ...updated } : m)));
        showNotification('success', 'Media asset updated successfully!');
      } else {
        const created = await api.createGalleryMedia(payload);
        setGalleryMedia((prev) => [created, ...prev]);
        showNotification('success', 'New media asset added to gallery successfully!');
      }
      setIsMediaModalOpen(false);
      setEditingMedia(null);
    } catch (err: any) {
      showNotification('error', 'Failed to save media: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSavingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media asset from the gallery?')) return;
    try {
      await api.deleteGalleryMedia(id);
      setGalleryMedia((prev) => prev.filter((m) => m.id !== id));
      if (previewingMedia && previewingMedia.id === id) setPreviewingMedia(null);
      showNotification('success', 'Media asset removed from gallery');
    } catch {
      showNotification('error', 'Failed to delete media asset');
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingGalleryImage(true);
      const url = await api.uploadFile(file, 'vof_gallery');
      setMediaFormData((prev) => ({
        ...prev,
        mediaUrl: url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      showNotification('success', 'Media image uploaded successfully!');
    } catch (err: any) {
      showNotification('error', 'Upload failed: ' + err.message);
    } finally {
      setUploadingGalleryImage(false);
    }
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
              onClick={() => setActiveTab('partners')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'partners'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4" />
                <span>Partners Directory</span>
              </div>
              <span className="text-xs bg-lime-500/20 text-lime-300 border border-lime-500/30 px-2 py-0.5 rounded-full font-semibold">
                {partners.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'gallery'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4" />
                <span>Gallery Media</span>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                {galleryMedia.length}
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
              {activeTab === 'partners' && 'Strategic Partners & Institutional Alliances'}
              {activeTab === 'gallery' && 'Gallery Media & Visual Asset Catalog'}
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
                          authorAvatar: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg',
                          readTime: '4 min read',
                          dateDisplay: 'September 2026',
                          day: '20',
                          month: 'SEP',
                          likes: 50,
                          status: 'published',
                          imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
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
                      authorAvatar: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg',
                      readTime: '4 min read',
                      dateDisplay: 'September 2026',
                      day: '20',
                      month: 'SEP',
                      likes: 240,
                      status: 'published',
                      imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
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
                                  src={blog.imageUrl || 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg'}
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
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search volunteer by name or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-60 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>

                  {/* Country / Hub Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        volunteerHubFilter === 'all'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      All Hubs ({volunteers.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('Nigeria')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        volunteerHubFilter === 'Nigeria'
                          ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇳🇬 Nigeria</span>
                      <span className="text-[10px] text-gray-400">
                        ({volunteers.filter((v) => getRecordCountry(v) === 'Nigeria').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('Rwanda')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        volunteerHubFilter === 'Rwanda'
                          ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇷🇼 Rwanda</span>
                      <span className="text-[10px] text-gray-400">
                        ({volunteers.filter((v) => getRecordCountry(v) === 'Rwanda').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVolunteerHubFilter('USA')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        volunteerHubFilter === 'USA'
                          ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇺🇸 USA</span>
                      <span className="text-[10px] text-gray-400">
                        ({volunteers.filter((v) => getRecordCountry(v) === 'USA').length})
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVolunteerModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0"
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
                      <th className="p-4">Hub / Country</th>
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
                        volunteerHubFilter === 'all' ? true : getRecordCountry(v) === volunteerHubFilter
                      )
                      .filter((v) =>
                        searchQuery
                          ? v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.skillsExperience.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.location.toLowerCase().includes(searchQuery.toLowerCase())
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
                            {vol.resumeUrl && (
                              <a
                                href={vol.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-[#558b1a] hover:underline font-bold mt-1"
                              >
                                <FileText className="w-3 h-3" /> View Resume / CV
                              </a>
                            )}
                          </td>
                          <td className="p-4">
                            {renderCountryBadge(getRecordCountry(vol))}
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
          {/* 4b. STRATEGIC PARTNERS DIRECTORY */}
          {/* ============================================================ */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              {/* Partner Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Inquiries</span>
                  <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{partners.length}</p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Corporate, schools & individuals</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Active Alliances</span>
                  <p className="font-serif text-2xl font-bold text-emerald-700 mt-1">
                    {partners.filter((p) => p.status === 'active').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Approved & executing programs</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">Corporate Entities</span>
                  <p className="font-serif text-2xl font-bold text-amber-700 mt-1">
                    {partners.filter((p) => p.partnerType === 'Corporate' || p.partnerType === 'Private Company').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Companies & CSR sponsors</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Academic & Schools</span>
                  <p className="font-serif text-2xl font-bold text-blue-700 mt-1">
                    {partners.filter((p) => p.partnerType === 'School' || p.partnerType === 'Academic').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Secondary & tertiary schools</span>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search organization, contact, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                  </div>

                  {/* Country Hub Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        partnerHubFilter === 'all'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      All Hubs ({partners.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('Nigeria')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        partnerHubFilter === 'Nigeria'
                          ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇳🇬 Nigeria</span>
                      <span className="text-[10px] text-gray-400">
                        ({partners.filter((p) => getRecordCountry(p) === 'Nigeria').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('Rwanda')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        partnerHubFilter === 'Rwanda'
                          ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇷🇼 Rwanda</span>
                      <span className="text-[10px] text-gray-400">
                        ({partners.filter((p) => getRecordCountry(p) === 'Rwanda').length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerHubFilter('USA')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        partnerHubFilter === 'USA'
                          ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>🇺🇸 USA</span>
                      <span className="text-[10px] text-gray-400">
                        ({partners.filter((p) => getRecordCountry(p) === 'USA').length})
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={partnerTypeFilter}
                    onChange={(e) => setPartnerTypeFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                  >
                    <option value="all">All Partner Types</option>
                    <option value="Corporate">Corporate Entities</option>
                    <option value="School">Schools & Academies</option>
                    <option value="Private Company">Private Companies</option>
                    <option value="NGO">NGOs / Nonprofits</option>
                    <option value="Individual">Individuals / Donors</option>
                  </select>

                  <select
                    value={partnerStatusFilter}
                    onChange={(e) => setPartnerStatusFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                  >
                    <option value="all">All Review Statuses</option>
                    <option value="new">New Inquiries</option>
                    <option value="under_review">Under Review</option>
                    <option value="contacted">Contacted</option>
                    <option value="active">Active Alliances</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              {/* Partners Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                      <th className="p-4">Organization & Type</th>
                      <th className="p-4">Hub / Country</th>
                      <th className="p-4">Contact Person</th>
                      <th className="p-4">Partnership Interest</th>
                      <th className="p-4">Proposal / Message</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {partners
                      .filter((p) => (partnerHubFilter === 'all' ? true : getRecordCountry(p) === partnerHubFilter))
                      .filter((p) => (partnerTypeFilter === 'all' ? true : p.partnerType.toLowerCase() === partnerTypeFilter.toLowerCase()))
                      .filter((p) => (partnerStatusFilter === 'all' ? true : p.status === partnerStatusFilter))
                      .filter((p) => {
                        if (!searchQuery.trim()) return true;
                        const q = searchQuery.toLowerCase();
                        return (
                          p.organizationName.toLowerCase().includes(q) ||
                          p.contactPerson.toLowerCase().includes(q) ||
                          p.email.toLowerCase().includes(q) ||
                          (p.city && p.city.toLowerCase().includes(q)) ||
                          (p.partnershipInterest && p.partnershipInterest.toLowerCase().includes(q))
                        );
                      })
                      .map((partner) => (
                        <tr key={partner.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-gray-900 text-sm leading-snug">{partner.organizationName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-gray-700 text-[10px] font-bold border border-gray-200">
                                {partner.partnerType}
                              </span>
                              {partner.website && (
                                <a
                                  href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-0.5 text-[10px] text-[#558b1a] hover:underline font-semibold"
                                >
                                  <span>Site</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {renderCountryBadge(getRecordCountry(partner))}
                            {partner.city && (
                              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{partner.city}</span>
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-gray-900">{partner.contactPerson}</p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <a href={`mailto:${partner.email}`} className="hover:text-[#558b1a] hover:underline">
                                {partner.email}
                              </a>
                            </p>
                            <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <a href={`tel:${partner.phone}`} className="hover:text-[#558b1a]">
                                {partner.phone}
                              </a>
                            </p>
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                              {partner.partnershipInterest || 'General Collaboration'}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-gray-600 line-clamp-2 leading-relaxed">
                              {partner.message || 'No proposal message provided.'}
                            </p>
                            {partner.message && partner.message.length > 70 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPartner(partner);
                                  setPartnerStatusUpdate(partner.status);
                                  setPartnerNotesUpdate(partner.notes || '');
                                }}
                                className="text-[10px] font-bold text-[#558b1a] hover:underline mt-1 cursor-pointer"
                              >
                                Read Full Proposal →
                              </button>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] inline-block ${
                                partner.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : partner.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : partner.status === 'under_review'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : partner.status === 'declined'
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {partner.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={partner.status}
                                onChange={(e) => handleUpdatePartnerStatus(partner.id!, e.target.value)}
                                className="text-[11px] py-1 px-2 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium focus:outline-none cursor-pointer"
                              >
                                <option value="new">New</option>
                                <option value="under_review">Under Review</option>
                                <option value="contacted">Contacted</option>
                                <option value="active">Active</option>
                                <option value="declined">Declined</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPartner(partner);
                                  setPartnerStatusUpdate(partner.status);
                                  setPartnerNotesUpdate(partner.notes || '');
                                }}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                title="View Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePartner(partner.id!)}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Delete Partner"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {partners.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No partner inquiries found.
                        </td>
                      </tr>
                    )}
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
                      imageUrl: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233539/vof/blog/appreciation-aifue.jpg',
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
                <div className="space-y-4">
                  {/* Country Hub Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country Hub:</span>
                      <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            scholarshipHubFilter === 'all'
                              ? 'bg-white text-gray-900 shadow-xs'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          All Hubs ({scholarships.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('Nigeria')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            scholarshipHubFilter === 'Nigeria'
                              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇳🇬 Nigeria</span>
                          <span className="text-[10px] text-gray-400">
                            ({scholarships.filter((s) => getRecordCountry(s) === 'Nigeria').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('Rwanda')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            scholarshipHubFilter === 'Rwanda'
                              ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇷🇼 Rwanda</span>
                          <span className="text-[10px] text-gray-400">
                            ({scholarships.filter((s) => getRecordCountry(s) === 'Rwanda').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setScholarshipHubFilter('USA')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            scholarshipHubFilter === 'USA'
                              ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇺🇸 USA</span>
                          <span className="text-[10px] text-gray-400">
                            ({scholarships.filter((s) => getRecordCountry(s) === 'USA').length})
                          </span>
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Showing <strong>{scholarships.filter((s) => scholarshipHubFilter === 'all' ? true : getRecordCountry(s) === scholarshipHubFilter).length}</strong> of {scholarships.length} applications
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Student Applicant</th>
                          <th className="p-4">Hub / Country</th>
                          <th className="p-4">Institution & Course</th>
                          <th className="p-4">Academic Level & CGPA</th>
                          <th className="p-4">Grant Requested</th>
                          <th className="p-4">Reason for Aid</th>
                          <th className="p-4">Status & Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {scholarships
                          .filter((s) =>
                            scholarshipHubFilter === 'all' ? true : getRecordCountry(s) === scholarshipHubFilter
                          )
                          .map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50/70 transition">
                              <td className="p-4">
                                <p className="font-bold text-gray-900">{s.applicantName}</p>
                                <p className="text-[11px] text-gray-500">{s.email}</p>
                                <p className="text-[11px] text-gray-400">{s.phone} • {s.stateOfOrigin} State</p>
                                {s.documentUrl && (
                                  <a
                                    href={s.documentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-[#558b1a] hover:underline font-bold mt-1"
                                  >
                                    <FileText className="w-3 h-3" /> View Transcript / ID
                                  </a>
                                )}
                              </td>
                              <td className="p-4">
                                {renderCountryBadge(getRecordCountry(s))}
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
                                  {formatMoney(s.amountRequested, getRecordCountry(s) === 'USA' ? 'USD' : 'NGN')}
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
                </div>
              )}

              {/* Sub-tab 2: Skill Acquisition */}
              {appTab === 'skills' && (
                <div className="space-y-4">
                  {/* Country Hub Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country Hub:</span>
                      <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            skillsHubFilter === 'all'
                              ? 'bg-white text-gray-900 shadow-xs'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          All Hubs ({skills.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('Nigeria')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            skillsHubFilter === 'Nigeria'
                              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇳🇬 Nigeria</span>
                          <span className="text-[10px] text-gray-400">
                            ({skills.filter((k) => getRecordCountry(k) === 'Nigeria').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('Rwanda')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            skillsHubFilter === 'Rwanda'
                              ? 'bg-white text-amber-800 shadow-xs ring-1 ring-amber-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇷🇼 Rwanda</span>
                          <span className="text-[10px] text-gray-400">
                            ({skills.filter((k) => getRecordCountry(k) === 'Rwanda').length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSkillsHubFilter('USA')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            skillsHubFilter === 'USA'
                              ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-300'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>🇺🇸 USA</span>
                          <span className="text-[10px] text-gray-400">
                            ({skills.filter((k) => getRecordCountry(k) === 'USA').length})
                          </span>
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Showing <strong>{skills.filter((k) => skillsHubFilter === 'all' ? true : getRecordCountry(k) === skillsHubFilter).length}</strong> of {skills.length} trainees
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Candidate</th>
                          <th className="p-4">Hub / Country</th>
                          <th className="p-4">Selected Trade</th>
                          <th className="p-4">Education & Status</th>
                          <th className="p-4">Statement of Purpose</th>
                          <th className="p-4">Batch</th>
                          <th className="p-4">Enrollment Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {skills
                          .filter((k) =>
                            skillsHubFilter === 'all' ? true : getRecordCountry(k) === skillsHubFilter
                          )
                          .map((k) => (
                            <tr key={k.id} className="hover:bg-gray-50/70 transition">
                              <td className="p-4">
                                <p className="font-bold text-gray-900">{k.applicantName}</p>
                                <p className="text-[11px] text-gray-500">{k.email}</p>
                                <p className="text-[11px] text-gray-400">{k.phone} • {k.address}</p>
                                {k.documentUrl && (
                                  <a
                                    href={k.documentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-[#558b1a] hover:underline font-bold mt-1"
                                  >
                                    <FileText className="w-3 h-3" /> View ID / Document
                                  </a>
                                )}
                              </td>
                              <td className="p-4">
                                {renderCountryBadge(getRecordCountry(k))}
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

          {/* ============================================================ */}
          {/* 8. GALLERY MEDIA MANAGER */}
          {/* ============================================================ */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Header and Add Action */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      Visual Impact Assets
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs font-semibold">{galleryMedia.length} Media Assets</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Gallery & Media Manager</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Upload, organize, and categorize foundation photography and video by program category and event date.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setGalleryViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                        galleryViewMode === 'grid'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                      title="Grid Cards View"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                        galleryViewMode === 'table'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                      title="Table List View"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMedia(null);
                      setMediaFormData({
                        title: '',
                        category: 'Vocational Skills',
                        mediaUrl: '',
                        mediaType: 'image',
                        caption: '',
                        eventDate: new Date().toISOString().split('T')[0],
                        year: new Date().getFullYear(),
                        region: 'Nigeria',
                        location: '',
                        albumTitle: '',
                        featured: false,
                        status: 'published',
                      });
                      setIsMediaModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Media Asset</span>
                  </button>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Total Assets
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-gray-900">{galleryMedia.length}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#558b1a] flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Categories
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-purple-600">
                      {new Set(galleryMedia.map((m) => m.category)).size || 6}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Published Assets
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-600">
                      {galleryMedia.filter((m) => m.status === 'published').length}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Hubs Covered
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-cyan-600">
                      {new Set(galleryMedia.map((m) => m.region)).size || 3}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Bar: Category, Date/Year, Country Hub, Search */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search media by title, caption, location, album..."
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none"
                  />
                  {gallerySearch && (
                    <button
                      onClick={() => setGallerySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={galleryCategoryFilter}
                    onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="Vocational Skills">Vocational Skills</option>
                    <option value="Maternal Dignity">Maternal Dignity</option>
                    <option value="Academic Scholarships">Academic Scholarships</option>
                    <option value="Rwanda Mission">Rwanda Mission</option>
                    <option value="Community Relief">Community Relief</option>
                    <option value="Annual Milestones">Annual Milestones</option>
                  </select>

                  {/* Year / Date Filter */}
                  <select
                    value={galleryYearFilter}
                    onChange={(e) => setGalleryYearFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>

                  {/* Hub / Region Filter */}
                  <select
                    value={galleryRegionFilter}
                    onChange={(e) => setGalleryRegionFilter(e.target.value)}
                    className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Hubs</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Rwanda">🇷🇼 Rwanda</option>
                    <option value="USA">🇺🇸 USA</option>
                    <option value="Global">🌐 Global</option>
                  </select>
                </div>
              </div>

              {/* Media Listing (Grid or Table) */}
              {(() => {
                const filtered = galleryMedia
                  .filter((m) => (galleryCategoryFilter === 'all' ? true : m.category === galleryCategoryFilter))
                  .filter((m) => (galleryYearFilter === 'all' ? true : m.year.toString() === galleryYearFilter))
                  .filter((m) => (galleryRegionFilter === 'all' ? true : m.region === galleryRegionFilter || (galleryRegionFilter === 'Global' && m.region === 'Global')))
                  .filter((m) => {
                    if (!gallerySearch.trim()) return true;
                    const s = gallerySearch.toLowerCase();
                    return (
                      m.title.toLowerCase().includes(s) ||
                      (m.caption && m.caption.toLowerCase().includes(s)) ||
                      (m.location && m.location.toLowerCase().includes(s)) ||
                      (m.albumTitle && m.albumTitle.toLowerCase().includes(s))
                    );
                  });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center bg-white rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-base">No media assets found</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        No photography matches the current filters. Adjust your search or add a new media asset by category and date.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryCategoryFilter('all');
                          setGalleryYearFilter('all');
                          setGalleryRegionFilter('all');
                          setGallerySearch('');
                        }}
                        className="px-4 py-2 text-xs font-bold text-[#558b1a] hover:underline cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  );
                }

                if (galleryViewMode === 'grid') {
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filtered.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
                        >
                          <div>
                            {/* Thumbnail with overlay badges */}
                            <div
                              onClick={() => setPreviewingMedia(item)}
                              className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden cursor-pointer"
                            >
                              <img
                                src={item.mediaUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Category Badge */}
                              <div className="absolute top-2.5 left-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                                    item.category === 'Maternal Dignity'
                                      ? 'bg-pink-600'
                                      : item.category === 'Vocational Skills'
                                      ? 'bg-purple-600'
                                      : item.category === 'Academic Scholarships'
                                      ? 'bg-emerald-600'
                                      : item.category === 'Rwanda Mission'
                                      ? 'bg-cyan-600'
                                      : item.category === 'Community Relief'
                                      ? 'bg-amber-600'
                                      : 'bg-gray-800'
                                  }`}
                                >
                                  {item.category}
                                </span>
                              </div>

                              {/* Country Badge */}
                              <div className="absolute top-2.5 right-2.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                                  {item.region === 'Nigeria' ? '🇳🇬 NG' : item.region === 'Rwanda' ? '🇷🇼 RW' : item.region === 'USA' ? '🇺🇸 USA' : '🌐 Global'}
                                </span>
                              </div>

                              {/* Event Date Overlay */}
                              <div className="absolute bottom-2 left-2.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/65 text-white backdrop-blur-xs">
                                  <Calendar className="w-3 h-3 text-lime-400" />
                                  <span>{item.eventDate || item.year}</span>
                                </span>
                              </div>

                              {/* Hover Quick Zoom */}
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-2 rounded-full bg-white/90 text-gray-900 shadow-md">
                                  <Eye className="w-4 h-4" />
                                </span>
                              </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 space-y-1.5">
                              <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1" title={item.title}>
                                {item.title}
                              </h4>

                              {item.albumTitle && (
                                <p className="text-[10px] font-semibold text-purple-700 truncate">
                                  📁 {item.albumTitle}
                                </p>
                              )}

                              {item.location && (
                                <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span>{item.location}</span>
                                </p>
                              )}

                              {item.caption && (
                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1">
                                  {item.caption}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="p-3 bg-stone-50 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {item.status}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.mediaUrl);
                                  showNotification('success', 'Media link copied to clipboard!');
                                }}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition cursor-pointer"
                                title="Copy Media URL"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMedia(item);
                                  setMediaFormData({
                                    title: item.title,
                                    category: item.category,
                                    mediaUrl: item.mediaUrl,
                                    mediaType: item.mediaType || 'image',
                                    caption: item.caption || '',
                                    eventDate: item.eventDate || new Date().toISOString().split('T')[0],
                                    year: item.year || new Date().getFullYear(),
                                    region: item.region || 'Nigeria',
                                    location: item.location || '',
                                    albumTitle: item.albumTitle || '',
                                    featured: !!item.featured,
                                    status: item.status || 'published',
                                  });
                                  setIsMediaModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-[#558b1a] hover:bg-white transition cursor-pointer"
                                title="Edit Media Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteMedia(item.id!)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-white transition cursor-pointer"
                                title="Delete Media Asset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                // Table View
                return (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-3.5">Media Thumbnail</th>
                          <th className="p-3.5">Title & Album</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Event Date</th>
                          <th className="p-3.5">Hub / Location</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filtered.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/70 transition">
                            <td className="p-3.5 w-20">
                              <div
                                onClick={() => setPreviewingMedia(item)}
                                className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer relative group"
                              >
                                <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <Eye className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 max-w-xs">
                              <p className="font-bold text-gray-900 text-sm leading-snug">{item.title}</p>
                              {item.albumTitle && (
                                <p className="text-[11px] text-purple-700 font-semibold mt-0.5 truncate">
                                  📁 {item.albumTitle}
                                </p>
                              )}
                              {item.caption && (
                                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{item.caption}</p>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-gray-800 border border-gray-200">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                                <span>{item.eventDate || item.year}</span>
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-gray-800">{item.region}</span>
                              {item.location && <p className="text-[11px] text-gray-500 truncate">{item.location}</p>}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPreviewingMedia(item)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                                  title="View Lightbox"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMedia(item);
                                    setMediaFormData({
                                      title: item.title,
                                      category: item.category,
                                      mediaUrl: item.mediaUrl,
                                      mediaType: item.mediaType || 'image',
                                      caption: item.caption || '',
                                      eventDate: item.eventDate || new Date().toISOString().split('T')[0],
                                      year: item.year || new Date().getFullYear(),
                                      region: item.region || 'Nigeria',
                                      location: item.location || '',
                                      albumTitle: item.albumTitle || '',
                                      featured: !!item.featured,
                                      status: item.status || 'published',
                                    });
                                    setIsMediaModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-[#558b1a] hover:bg-gray-100 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMedia(item.id!)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-gray-100 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Country Hub *</label>
                  <select
                    value={newVolunteer.country || 'Nigeria'}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Nigeria">🇳🇬 Nigeria Hub</option>
                    <option value="Rwanda">🇷🇼 Rwanda Hub</option>
                    <option value="USA">🇺🇸 USA Hub</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location (City, State)</label>
                  <input
                    type="text"
                    value={newVolunteer.location || ''}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, location: e.target.value })}
                    placeholder="e.g. Owerri, Imo State / Kigali / Houston"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
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

      {/* PARTNER DETAIL & REVIEW MODAL */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#558b1a]/10 text-[#558b1a] text-xs font-bold border border-[#558b1a]/20">
                    {selectedPartner.partnerType} Partner
                  </span>
                  {renderCountryBadge(getRecordCountry(selectedPartner))}
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">{selectedPartner.organizationName}</h3>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-5 text-xs text-gray-700">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-gray-200/70">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Primary Contact</span>
                  <p className="text-sm font-bold text-gray-900">{selectedPartner.contactPerson}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Location</span>
                  <p className="text-sm font-semibold text-gray-800">{selectedPartner.city ? `${selectedPartner.city}, ` : ''}{selectedPartner.country || 'Nigeria'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Email Address</span>
                  <a href={`mailto:${selectedPartner.email}`} className="text-xs font-semibold text-[#558b1a] hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedPartner.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Phone / WhatsApp</span>
                  <a href={`tel:${selectedPartner.phone}`} className="text-xs font-semibold text-gray-800 hover:text-[#558b1a] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selectedPartner.phone}
                  </a>
                </div>
                {selectedPartner.website && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Official Website</span>
                    <a
                      href={selectedPartner.website.startsWith('http') ? selectedPartner.website : `https://${selectedPartner.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#558b1a] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {selectedPartner.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Partnership Interest & Proposal */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Collaboration Focus</span>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {selectedPartner.partnershipInterest || 'General Strategic Partnership'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Proposal / Collaboration Message</span>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
                  {selectedPartner.message || 'No written message attached.'}
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="p-4 rounded-2xl bg-[#fbfdf9] border border-[#d6f0b0]/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-900 block">Review & Engagement Status</label>
                    <span className="text-[11px] text-gray-500">Update current phase of partnership evaluation</span>
                  </div>
                  <select
                    value={partnerStatusUpdate}
                    onChange={(e) => setPartnerStatusUpdate(e.target.value)}
                    className="text-xs font-bold py-2 px-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none cursor-pointer"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="under_review">Under Review</option>
                    <option value="contacted">Contacted & Discussing</option>
                    <option value="active">Active Collaboration</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-900 block mb-1">Internal Notes & Action Items</label>
                  <textarea
                    rows={3}
                    value={partnerNotesUpdate}
                    onChange={(e) => setPartnerNotesUpdate(e.target.value)}
                    placeholder="e.g. Met on Zoom 24th Sep; scheduled follow-up for MoU review with legal lead..."
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#558b1a] focus:outline-none bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isUpdatingPartner}
                    onClick={() => handleUpdatePartnerStatus(selectedPartner.id!, partnerStatusUpdate, partnerNotesUpdate)}
                    className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingPartner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Review & Notes
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleDeletePartner(selectedPartner.id!)}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Partner
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedPartner.email}?subject=Veronica Onyeneke Foundation Partnership - ${encodeURIComponent(selectedPartner.organizationName)}`}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-800 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-600" />
                    Email Partner
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(null)}
                    className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT GALLERY MEDIA */}
      {/* ============================================================ */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#558b1a]">Visual Impact Repository</span>
                <h3 className="font-bold text-lg text-gray-900 mt-0.5">
                  {editingMedia ? 'Edit Media Asset' : 'Add New Media Asset'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsMediaModalOpen(false);
                  setEditingMedia(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              {/* Media File Upload or Direct URL */}
              <div>
                <label className="font-bold text-gray-700 block mb-1.5 uppercase tracking-wide text-[11px]">
                  Media File (Upload File or Paste Image URL) *
                </label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    required
                    value={mediaFormData.mediaUrl}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, mediaUrl: e.target.value })}
                    placeholder="https://... or upload local file"
                    className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-stone-50/50"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white font-bold flex items-center gap-1.5 shrink-0 transition text-xs shadow-xs">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingGalleryImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleGalleryImageUpload}
                      disabled={uploadingGalleryImage}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail Box */}
                {mediaFormData.mediaUrl && (
                  <div className="mt-3 p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-black overflow-hidden relative shrink-0">
                      <img
                        src={mediaFormData.mediaUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src = 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp';
                        }}
                      />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{mediaFormData.title || 'Media Preview'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{mediaFormData.mediaUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Media Asset Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={mediaFormData.title}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                    placeholder="e.g. Modern Garment Tailoring Workshop"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Category *
                  </label>
                  <select
                    value={mediaFormData.category}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#558b1a] cursor-pointer"
                  >
                    <option value="Vocational Skills">Vocational Skills</option>
                    <option value="Maternal Dignity">Maternal Dignity</option>
                    <option value="Academic Scholarships">Academic Scholarships</option>
                    <option value="Rwanda Mission">Rwanda Mission</option>
                    <option value="Community Relief">Community Relief</option>
                    <option value="Annual Milestones">Annual Milestones</option>
                    <option value="General Outreach">General Outreach</option>
                  </select>
                </div>
              </div>

              {/* Event Date, Year & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={mediaFormData.eventDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const newYear = newDate ? parseInt(newDate.split('-')[0]) : mediaFormData.year;
                      setMediaFormData({
                        ...mediaFormData,
                        eventDate: newDate,
                        year: isNaN(newYear) ? mediaFormData.year : newYear,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-white cursor-pointer"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Year
                  </label>
                  <input
                    type="number"
                    value={mediaFormData.year}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, year: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Hub / Region
                  </label>
                  <select
                    value={mediaFormData.region}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, region: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#558b1a] cursor-pointer"
                  >
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                    <option value="Rwanda">🇷🇼 Rwanda</option>
                    <option value="USA">🇺🇸 USA</option>
                    <option value="Global">🌐 Global</option>
                  </select>
                </div>
              </div>

              {/* Location & Album Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Specific Location / Center
                  </label>
                  <input
                    type="text"
                    value={mediaFormData.location}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, location: e.target.value })}
                    placeholder="e.g. VOIE Center, Owerri, Imo State"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Album / Collection Title
                  </label>
                  <input
                    type="text"
                    value={mediaFormData.albumTitle}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, albumTitle: e.target.value })}
                    placeholder="e.g. VOIE Vocational Trades & Fashion Cohort"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
              </div>

              {/* Caption / Story */}
              <div>
                <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                  Photo Caption & Impact Context
                </label>
                <textarea
                  rows={3}
                  value={mediaFormData.caption}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, caption: e.target.value })}
                  placeholder="Provide context on the students, mothers, or community beneficiaries featured in this photo..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a] resize-y"
                />
              </div>

              {/* Status & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-center">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wide text-[11px]">
                    Publication Status
                  </label>
                  <select
                    value={mediaFormData.status}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#558b1a] cursor-pointer"
                  >
                    <option value="published">Published (Visible on Public Gallery)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 sm:mt-5 p-2 rounded-xl bg-stone-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={mediaFormData.featured}
                    onChange={(e) => setMediaFormData({ ...mediaFormData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#558b1a] focus:ring-[#558b1a] cursor-pointer"
                  />
                  <label htmlFor="featuredToggle" className="font-bold text-gray-800 text-xs cursor-pointer">
                    Feature on Gallery Spotlight / Cover
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaModalOpen(false);
                    setEditingMedia(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMedia || uploadingGalleryImage}
                  className="px-6 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSavingMedia ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Asset...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingMedia ? 'Update Media Asset' : 'Add Media to Gallery'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: GALLERY LIGHTBOX PREVIEW */}
      {/* ============================================================ */}
      {previewingMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
            {/* Header bar */}
            <div className="p-4 px-6 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="px-2 py-0.5 rounded-full bg-[#558b1a] text-white text-[10px] font-bold">
                  {previewingMedia.category}
                </span>
                <span className="text-xs font-semibold truncate text-gray-200">{previewingMedia.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingMedia(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image Preview */}
            <div className="relative max-h-[58vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={previewingMedia.mediaUrl}
                alt={previewingMedia.title}
                className="max-h-[58vh] w-auto object-contain mx-auto"
              />
            </div>

            {/* Info and Actions */}
            <div className="p-6 bg-white space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-semibold text-gray-900">
                    <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                    <span>{previewingMedia.eventDate || previewingMedia.year}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{previewingMedia.location || previewingMedia.region}</span>
                  </span>
                  {previewingMedia.albumTitle && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="font-semibold text-purple-700">📁 {previewingMedia.albumTitle}</span>
                    </>
                  )}
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    previewingMedia.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {previewingMedia.status}
                </span>
              </div>

              {previewingMedia.caption && (
                <p className="text-sm text-gray-700 leading-relaxed italic bg-stone-50 p-3 rounded-xl border border-gray-100">
                  &ldquo;{previewingMedia.caption}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewingMedia.mediaUrl);
                    showNotification('success', 'Media URL copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-800 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Asset Link</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={previewingMedia.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold transition flex items-center gap-1.5 text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Raw File</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const item = previewingMedia;
                      setPreviewingMedia(null);
                      setEditingMedia(item);
                      setMediaFormData({
                        title: item.title,
                        category: item.category,
                        mediaUrl: item.mediaUrl,
                        mediaType: item.mediaType || 'image',
                        caption: item.caption || '',
                        eventDate: item.eventDate || new Date().toISOString().split('T')[0],
                        year: item.year || new Date().getFullYear(),
                        region: item.region || 'Nigeria',
                        location: item.location || '',
                        albumTitle: item.albumTitle || '',
                        featured: !!item.featured,
                        status: item.status || 'published',
                      });
                      setIsMediaModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white font-bold transition flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
