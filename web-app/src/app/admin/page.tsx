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
  Image as ImageIcon,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Layers,
  Headphones,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCheck,
  Tag,
  FolderPlus,
  Folder,
} from 'lucide-react';
import {
  api,
  DashboardStats,
  BlogItem,
  BlogCategory,
  BlogTag,
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
  PopupSettings,
} from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import FormattedChatMessage from '@/components/FormattedChatMessage';

type TabType =
  | 'overview'
  | 'blogs'
  | 'donations'
  | 'volunteers'
  | 'partners'
  | 'projects'
  | 'applications'
  | 'financials'
  | 'gallery'
  | 'forms'
  | 'support';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [blogTags, setBlogTags] = useState<BlogTag[]>([]);
  const [blogSubTab, setBlogSubTab] = useState<'articles' | 'categories' | 'tags'>('articles');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<BlogCategory>>({
    name: '',
    slug: '',
    description: '',
    color: '#558b1a',
  });
  const [newTagName, setNewTagName] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
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
  const [popupSettings, setPopupSettings] = useState<PopupSettings>({
    id: 1,
    isEnabled: true,
    delaySeconds: 5,
    headline: 'Active Campaign',
    subheadline: 'Support Ongoing Community Initiatives',
    ctaText: 'Donate Now',
    showOnMobile: true,
    selectedProjectIds: [],
  });
  const [isSavingPopup, setIsSavingPopup] = useState<boolean>(false);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState<boolean>(false);
  const [previewProjectIndex, setPreviewProjectIndex] = useState<number>(0);

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

  // Donation Filter States (Purpose, Payment Channel, Status)
  const [donationPurposeFilter, setDonationPurposeFilter] = useState<string>('all');
  const [donationMethodFilter, setDonationMethodFilter] = useState<string>('all');
  const [donationStatusFilter, setDonationStatusFilter] = useState<string>('all');

  // Forms Controller States (Visibility & Intake Status on Admin Dashboard)
  const [formVisibility, setFormVisibility] = useState<{
    skills: boolean;
    scholarship: boolean;
    volunteer: boolean;
    partner: boolean;
    donation: boolean;
  }>({
    skills: true,
    scholarship: true,
    volunteer: true,
    partner: true,
    donation: true,
  });

  const [formStatuses, setFormStatuses] = useState<{
    skills: 'open' | 'paused';
    scholarship: 'open' | 'paused';
    volunteer: 'open' | 'paused';
    partner: 'open' | 'paused';
    donation: 'open' | 'paused';
  }>({
    skills: 'open',
    scholarship: 'open',
    volunteer: 'open',
    partner: 'open',
    donation: 'open',
  });

  // ============================================================
  // LIVE SUPPORT DESK STATES & AUDIO PING
  // ============================================================
  const [supportStaffOnline, setSupportStaffOnline] = useState<boolean>(true);
  const [supportConversations, setSupportConversations] = useState<any[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [staffReplyText, setStaffReplyText] = useState<string>('');
  const [sendingStaffReply, setSendingStaffReply] = useState<boolean>(false);
  const [supportFilter, setSupportFilter] = useState<'all' | 'waiting_staff' | 'staff_active' | 'ai_active' | 'closed'>('all');
  const [supportSearch, setSupportSearch] = useState<string>('');
  const [totalSupportUnread, setTotalSupportUnread] = useState<number>(0);
  const [audioPingEnabled, setAudioPingEnabled] = useState<boolean>(true);
  const staffAudioCtxRef = React.useRef<AudioContext | null>(null);
  const prevUnreadRef = React.useRef<number>(0);

  const playStaffPing = () => {
    if (!audioPingEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!staffAudioCtxRef.current) {
        staffAudioCtxRef.current = new AudioCtx();
      }
      const ctx = staffAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.12);
      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  };

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/chat/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isOnline: supportStaffOnline, staffName: 'Foundation Support' }),
        });
      } catch (err) {
        console.warn('Presence heartbeat failed:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [supportStaffOnline]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/chat/conversations', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.conversations && Array.isArray(data.conversations)) {
          setSupportConversations(data.conversations);
          const newUnread = Number(data.totalUnread || 0);
          if (newUnread > prevUnreadRef.current) {
            playStaffPing();
          }
          prevUnreadRef.current = newUnread;
          setTotalSupportUnread(newUnread);

          if (!selectedConvId && data.conversations.length > 0) {
            setSelectedConvId(data.conversations[0].id);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch chat conversations:', e);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, [selectedConvId, audioPingEnabled]);

  useEffect(() => {
    if (!selectedConvId) {
      setSupportMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${selectedConvId}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setSupportMessages(data.messages);
        }
      } catch (e) {
        console.warn('Failed to load conversation messages:', e);
      }
    };

    fetchMessages();
    fetch('/api/chat/conversations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: selectedConvId, resetAdminUnread: true }),
    }).catch(() => {});

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedConvId]);

  const handleSendStaffReply = async (customText?: string) => {
    const textToSend = (customText || staffReplyText).trim();
    if (!textToSend || !selectedConvId || sendingStaffReply) return;

    setStaffReplyText('');
    setSendingStaffReply(true);

    const tempMsg = {
      id: Date.now(),
      conversation_id: selectedConvId,
      sender_type: 'staff',
      sender_name: 'Support Staff',
      content: textToSend,
      is_read: true,
      created_at: new Date().toISOString(),
    };
    setSupportMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvId,
          senderType: 'staff',
          senderName: 'Support Staff',
          content: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setSupportMessages((prev) => [...prev.filter((m) => m.id !== tempMsg.id), data.message]);
        }
        setSupportConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConvId
              ? { ...c, status: 'staff_active', last_message: textToSend, last_message_at: new Date().toISOString(), unread_admin: 0 }
              : c
          )
        );
      }
    } catch (e) {
      console.error('Failed to send staff reply:', e);
    } finally {
      setSendingStaffReply(false);
    }
  };

  const handleUpdateConversationStatus = async (convId: number, newStatus: string) => {
    try {
      await fetch('/api/chat/conversations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: convId, status: newStatus }),
      });
      setSupportConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, status: newStatus } : c))
      );
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

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
        blogCatsData,
        blogTagsData,
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
        popupData,
      ] = await Promise.allSettled([
        api.getDashboardOverview(),
        api.getBlogs(),
        api.getBlogCategories(),
        api.getBlogTags(),
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
        api.getPopupSettings(),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (blogsData.status === 'fulfilled') setBlogs(blogsData.value);
      if (blogCatsData.status === 'fulfilled') setBlogCategories(blogCatsData.value);
      if (blogTagsData.status === 'fulfilled') setBlogTags(blogTagsData.value);
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
      if (popupData.status === 'fulfilled' && popupData.value) setPopupSettings(popupData.value);
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

  const handleSavePopupSettings = async () => {
    try {
      setIsSavingPopup(true);
      const updated = await api.updatePopupSettings(popupSettings);
      setPopupSettings(updated);
      showNotification('success', 'Landing Donate Pop-up settings saved successfully!');
    } catch (err: any) {
      showNotification('error', 'Failed to save popup settings: ' + err.message);
    } finally {
      setIsSavingPopup(false);
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

  // Category Handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory && editingCategory.id) {
        await api.updateBlogCategory(editingCategory.id, categoryFormData);
        showNotification('success', 'Category updated successfully!');
      } else {
        await api.createBlogCategory(categoryFormData);
        showNotification('success', 'New category created successfully!');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryFormData({ name: '', slug: '', description: '', color: '#558b1a' });
      const cats = await api.getBlogCategories();
      setBlogCategories(cats);
    } catch (err: any) {
      showNotification('error', 'Failed to save category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Associated articles will have their category unlinked.')) return;
    try {
      await api.deleteBlogCategory(id);
      showNotification('success', 'Category deleted');
      const cats = await api.getBlogCategories();
      setBlogCategories(cats);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to delete category: ' + err.message);
    }
  };

  // Tag Handlers
  const handleCreateTag = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tagName = newTagName.trim();
    if (!tagName) return;
    try {
      await api.createBlogTag({ name: tagName });
      showNotification('success', `Tag "${tagName}" created!`);
      setNewTagName('');
      const tags = await api.getBlogTags();
      setBlogTags(tags);
    } catch (err: any) {
      showNotification('error', 'Failed to create tag: ' + err.message);
    }
  };

  const handleDeleteTag = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove the tag "${name}"?`)) return;
    try {
      await api.deleteBlogTag(id);
      showNotification('success', `Tag "${name}" removed`);
      const tags = await api.getBlogTags();
      setBlogTags(tags);
    } catch (err: any) {
      showNotification('error', 'Failed to delete tag: ' + err.message);
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

            <button
              onClick={() => setActiveTab('forms')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'forms'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Forms Controller</span>
              </div>
              <span className="text-xs bg-lime-500/20 text-lime-300 border border-lime-500/30 px-2 py-0.5 rounded-full font-semibold">
                {Object.values(formVisibility).filter(Boolean).length} Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === 'support'
                  ? 'bg-[#558b1a] text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#152a0d] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Headphones className="w-4 h-4" />
                <span>Support Desk</span>
              </div>
              {totalSupportUnread > 0 ? (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {totalSupportUnread}
                </span>
              ) : (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  supportStaffOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-gray-700 text-gray-400'
                }`}>
                  {supportStaffOnline ? 'Live' : 'Away'}
                </span>
              )}
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
              {activeTab === 'forms' && 'Forms Visibility & Public Intake Controller'}
              {activeTab === 'support' && 'Live Visitor Support & AI Chatbot Desk'}
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
              {/* Sub-tab Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBlogSubTab('articles')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      blogSubTab === 'articles'
                        ? 'bg-[#558b1a] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Articles</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
                      {blogs.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlogSubTab('categories')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      blogSubTab === 'categories'
                        ? 'bg-[#558b1a] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Categories</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
                      {blogCategories.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlogSubTab('tags')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      blogSubTab === 'tags'
                        ? 'bg-[#558b1a] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
                      {blogTags.length}
                    </span>
                  </button>
                </div>

                {blogSubTab === 'articles' && (
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setBlogFormData({
                        title: '',
                        slug: '',
                        category: blogCategories[0]?.name || 'Education Support',
                        categoryId: blogCategories[0]?.id,
                        tags: [],
                        region: 'IMO STATE, NIGERIA',
                        excerpt: '',
                        content: '',
                        authorName: 'Rev. Fr. Charles Onyeneke',
                        authorRole: 'Founder / President',
                        authorAvatar: 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233560/vof/team/charles-onyeneke.jpg',
                        readTime: '4 min read',
                        dateDisplay: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        day: String(new Date().getDate()),
                        month: new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
                        likes: 0,
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
                )}

                {blogSubTab === 'categories' && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryFormData({ name: '', slug: '', description: '', color: '#558b1a' });
                      setIsCategoryModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                )}
              </div>

              {/* 1. ARTICLES TAB CONTENT */}
              {blogSubTab === 'articles' && (
                <div className="space-y-4">
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
                  </div>

                  {/* Blogs Table */}
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Article</th>
                          <th className="p-4">Category & Tags</th>
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
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                                  {blog.category}
                                </span>
                                {blog.tags && blog.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5 max-w-[200px]">
                                    {blog.tags.map((t) => (
                                      <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                )}
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
                                      setBlogFormData({
                                        ...blog,
                                        tags: blog.tags || [],
                                      });
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

              {/* 2. CATEGORIES MANAGER TAB */}
              {blogSubTab === 'categories' && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                        <th className="p-4">Category Name</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-center">Color Badge</th>
                        <th className="p-4 text-center">Articles Count</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogCategories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400">
                            No categories created yet. Click "Add Category" above.
                          </td>
                        </tr>
                      ) : (
                        blogCategories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-gray-50/70 transition">
                            <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color || '#558b1a' }}
                              />
                              <span>{cat.name}</span>
                            </td>
                            <td className="p-4 text-gray-500 font-mono text-[11px]">
                              {cat.slug}
                            </td>
                            <td className="p-4 text-gray-600 max-w-sm">
                              {cat.description || '—'}
                            </td>
                            <td className="p-4 text-center">
                              <span
                                className="px-2.5 py-1 rounded-full text-white text-[10px] font-bold"
                                style={{ backgroundColor: cat.color || '#558b1a' }}
                              >
                                {cat.color || '#558b1a'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold">
                                {cat.postCount || 0}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingCategory(cat);
                                    setCategoryFormData(cat);
                                    setIsCategoryModalOpen(true);
                                  }}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                                  title="Edit Category"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. TAGS MANAGER TAB */}
              {blogSubTab === 'tags' && (
                <div className="space-y-6">
                  {/* Quick Add Tag Bar */}
                  <form
                    onSubmit={handleCreateTag}
                    className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200"
                  >
                    <div className="relative flex-1 w-full">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter new tag name (e.g. Health Outreach, Bursary, Imo State)..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newTagName.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tag
                    </button>
                  </form>

                  {/* Tags Cloud / Badges List */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                      Active Blog Tags ({blogTags.length})
                    </h4>
                    {blogTags.length === 0 ? (
                      <p className="text-gray-400 text-xs text-center py-8">
                        No tags found. Create tags above to classify your stories.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {blogTags.map((tag) => (
                          <div
                            key={tag.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800 transition"
                          >
                            <span className="font-semibold">#{tag.name}</span>
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                              {tag.postCount || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTag(tag.id, tag.name)}
                              className="text-gray-400 hover:text-red-600 ml-1 transition"
                              title="Delete Tag"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. DONATION FUNDS MANAGEMENT */}
          {/* ============================================================ */}
          {/* ============================================================ */}
          {/* 3. DONATION FUNDS MANAGEMENT & FILTERABLE PURPOSE LIST */}
          {/* ============================================================ */}
          {activeTab === 'donations' && (() => {
            const pregnantDonations = donations.filter(
              (d) =>
                (d.campaign && d.campaign.toLowerCase().includes('pregnant')) ||
                (d.notes && d.notes.toLowerCase().includes('pregnant'))
            );
            const youthDonations = donations.filter(
              (d) =>
                d.campaign &&
                (d.campaign.toLowerCase().includes('youth') ||
                  d.campaign.toLowerCase().includes('voie') ||
                  d.campaign.toLowerCase().includes('vocational') ||
                  d.campaign.toLowerCase().includes('skills'))
            );
            const educationDonations = donations.filter(
              (d) =>
                d.campaign &&
                (d.campaign.toLowerCase().includes('education') ||
                  d.campaign.toLowerCase().includes('scholarship'))
            );

            const filteredDonations = donations.filter((d) => {
              // Search Filter
              const matchesSearch = searchQuery
                ? d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (d.reference && d.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (d.donorEmail && d.donorEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (d.notes && d.notes.toLowerCase().includes(searchQuery.toLowerCase()))
                : true;

              // Purpose Filter
              let matchesPurpose = true;
              if (donationPurposeFilter === 'Pregnant Women Support') {
                matchesPurpose = Boolean(
                  (d.campaign && d.campaign.toLowerCase().includes('pregnant')) ||
                  (d.notes && d.notes.toLowerCase().includes('pregnant'))
                );
              } else if (donationPurposeFilter === 'Youth Empowerment') {
                matchesPurpose = Boolean(
                  d.campaign &&
                  (d.campaign.toLowerCase().includes('youth') ||
                    d.campaign.toLowerCase().includes('voie') ||
                    d.campaign.toLowerCase().includes('vocational') ||
                    d.campaign.toLowerCase().includes('skills'))
                );
              } else if (donationPurposeFilter === 'Education Sponsorship') {
                matchesPurpose = Boolean(
                  d.campaign &&
                  (d.campaign.toLowerCase().includes('education') ||
                    d.campaign.toLowerCase().includes('scholarship'))
                );
              } else if (donationPurposeFilter === 'other') {
                const isMainThree = Boolean(
                  d.campaign &&
                  (d.campaign.toLowerCase().includes('pregnant') ||
                    d.campaign.toLowerCase().includes('youth') ||
                    d.campaign.toLowerCase().includes('voie') ||
                    d.campaign.toLowerCase().includes('vocational') ||
                    d.campaign.toLowerCase().includes('education') ||
                    d.campaign.toLowerCase().includes('scholarship'))
                );
                matchesPurpose = !isMainThree;
              }

              // Method Filter
              let matchesMethod = true;
              if (donationMethodFilter !== 'all') {
                matchesMethod = d.paymentMethod.toLowerCase().includes(donationMethodFilter.toLowerCase());
              }

              // Status Filter
              let matchesStatus = true;
              if (donationStatusFilter !== 'all') {
                matchesStatus = d.status.toLowerCase() === donationStatusFilter.toLowerCase();
              }

              return matchesSearch && matchesPurpose && matchesMethod && matchesStatus;
            });

            return (
              <div className="space-y-6">
                {/* 3a. Purpose Summary Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* All Donations */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Donations</span>
                    <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{donations.length}</p>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">Logged across all channels</span>
                  </div>

                  {/* Pregnant Women Support */}
                  <div
                    onClick={() => setDonationPurposeFilter(donationPurposeFilter === 'Pregnant Women Support' ? 'all' : 'Pregnant Women Support')}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      donationPurposeFilter === 'Pregnant Women Support'
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:border-rose-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block flex items-center justify-between">
                      <span>Pregnant Women</span>
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    </span>
                    <p className="font-serif text-2xl font-bold text-rose-900 mt-1">{pregnantDonations.length}</p>
                    <span className="text-[10px] text-rose-600 mt-0.5 block">Maternal care & baby packs</span>
                  </div>

                  {/* Youth Empowerment */}
                  <div
                    onClick={() => setDonationPurposeFilter(donationPurposeFilter === 'Youth Empowerment' ? 'all' : 'Youth Empowerment')}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      donationPurposeFilter === 'Youth Empowerment'
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block flex items-center justify-between">
                      <span>Youth Empowerment</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    </span>
                    <p className="font-serif text-2xl font-bold text-amber-900 mt-1">{youthDonations.length}</p>
                    <span className="text-[10px] text-amber-600 mt-0.5 block">VOIE technical trades & tools</span>
                  </div>

                  {/* Education Sponsorship */}
                  <div
                    onClick={() => setDonationPurposeFilter(donationPurposeFilter === 'Education Sponsorship' ? 'all' : 'Education Sponsorship')}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      donationPurposeFilter === 'Education Sponsorship'
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400 shadow-xs'
                        : 'bg-white border-gray-200/80 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block flex items-center justify-between">
                      <span>Education Aid</span>
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    </span>
                    <p className="font-serif text-2xl font-bold text-blue-900 mt-1">{educationDonations.length}</p>
                    <span className="text-[10px] text-blue-600 mt-0.5 block">JAMB, school fees & grants</span>
                  </div>
                </div>

                {/* 3b. Filterable Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search donor, reference, note..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs w-60 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                    </div>

                    {/* Purpose Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          donationPurposeFilter === 'all'
                            ? 'bg-white text-gray-900 shadow-xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        All Causes ({donations.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('Pregnant Women Support')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          donationPurposeFilter === 'Pregnant Women Support'
                            ? 'bg-rose-50 text-rose-900 shadow-xs ring-1 ring-rose-300'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Pregnant Women</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('Youth Empowerment')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          donationPurposeFilter === 'Youth Empowerment'
                            ? 'bg-amber-50 text-amber-900 shadow-xs ring-1 ring-amber-300'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Youth Empowerment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationPurposeFilter('Education Sponsorship')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          donationPurposeFilter === 'Education Sponsorship'
                            ? 'bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-300'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Education Aid</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Payment Method Filter */}
                    <select
                      value={donationMethodFilter}
                      onChange={(e) => setDonationMethodFilter(e.target.value)}
                      className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                    >
                      <option value="all">All Channels</option>
                      <option value="Paystack">Paystack Online</option>
                      <option value="Zenith">Zenith Bank Transfer</option>
                      <option value="GTBank">GTBank Transfer</option>
                      <option value="Kigali">Bank of Kigali (RWF)</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Zelle">Zelle 501(c)(3)</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={donationStatusFilter}
                      onChange={(e) => setDonationStatusFilter(e.target.value)}
                      className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="pledged">Pledged</option>
                    </select>

                    <button
                      onClick={() => setIsDonationModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Donation</span>
                    </button>
                  </div>
                </div>

                {/* 3c. Filterable Donations Table */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  {filteredDonations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <HeartHandshake className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">No donations match your filter</p>
                      <p className="text-xs text-gray-400 mt-1">Try resetting the purpose or channel filter</p>
                      <button
                        onClick={() => {
                          setDonationPurposeFilter('all');
                          setDonationMethodFilter('all');
                          setDonationStatusFilter('all');
                          setSearchQuery('');
                        }}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold text-[11px]">
                          <th className="p-4">Donor Name & Contact</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Designated Purpose</th>
                          <th className="p-4">Payment Channel & Ref</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredDonations.map((d) => {
                          const isPregnant =
                            (d.campaign && d.campaign.toLowerCase().includes('pregnant')) ||
                            (d.notes && d.notes.toLowerCase().includes('pregnant'));
                          const isYouth =
                            d.campaign &&
                            (d.campaign.toLowerCase().includes('youth') ||
                              d.campaign.toLowerCase().includes('voie') ||
                              d.campaign.toLowerCase().includes('vocational') ||
                              d.campaign.toLowerCase().includes('skills'));
                          const isEducation =
                            d.campaign &&
                            (d.campaign.toLowerCase().includes('education') ||
                              d.campaign.toLowerCase().includes('scholarship'));

                          return (
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
                                {isPregnant ? (
                                  <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    Pregnant Women Support
                                  </span>
                                ) : isYouth ? (
                                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Youth Empowerment
                                  </span>
                                ) : isEducation ? (
                                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Education Sponsorship
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 border border-stone-200 rounded-full font-medium text-[10px]">
                                    {d.campaign || 'General Foundation Fund'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="font-medium text-gray-700">{d.paymentMethod}</p>
                                {d.reference && <p className="text-[10px] text-gray-400 font-mono">Ref: {d.reference}</p>}
                              </td>
                              <td className="p-4 text-gray-600">
                                {new Date(d.donatedAt).toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                                    d.status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })()}

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

              {/* LANDING DONATE POP-UP MODAL CONFIGURATION PANEL */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#558b1a] flex items-center justify-center shrink-0">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900">
                          Landing Donate Pop-up Modal
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            popupSettings.isEnabled
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {popupSettings.isEnabled ? 'Active on Homepage' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Automatic campaign showcase pop-up that appears after landing on the homepage (guarded by visitor session storage).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsPreviewPopupOpen(true)}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>Preview Modal</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSavingPopup}
                      onClick={handleSavePopupSettings}
                      className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSavingPopup ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Toggle 1: Enabled / Disabled */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Modal Status</span>
                      <button
                        type="button"
                        onClick={() => setPopupSettings((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
                        className="cursor-pointer text-gray-700 focus:outline-none"
                      >
                        {popupSettings.isEnabled ? (
                          <ToggleRight className="w-8 h-8 text-[#558b1a]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {popupSettings.isEnabled
                        ? 'Pop-up triggers automatically when visitors land on the homepage.'
                        : 'Pop-up is disabled and will not show to visitors.'}
                    </p>
                  </div>

                  {/* Setting 2: Delay in Seconds */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">
                      Trigger Delay (Seconds)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={popupSettings.delaySeconds}
                        onChange={(e) =>
                          setPopupSettings((prev) => ({
                            ...prev,
                            delaySeconds: Math.max(1, parseInt(e.target.value) || 5),
                          }))
                        }
                        className="w-24 px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                      <span className="text-xs text-gray-500 font-medium">sec after landing</span>
                    </div>
                    <p className="text-[10px] text-gray-400">Recommended: 4 to 8 seconds</p>
                  </div>

                  {/* Setting 3: Modal Headline */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">
                      Pill Headline Tag
                    </label>
                    <input
                      type="text"
                      value={popupSettings.headline}
                      onChange={(e) => setPopupSettings((prev) => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g. Active Campaign"
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                    <p className="text-[10px] text-gray-400">Displays above campaign title</p>
                  </div>

                  {/* Setting 4: CTA Button Text & Mobile */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <label className="text-xs font-bold text-gray-900 block">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={popupSettings.ctaText}
                      onChange={(e) => setPopupSettings((prev) => ({ ...prev, ctaText: e.target.value }))}
                      placeholder="e.g. Donate Now"
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-gray-600 font-medium">Show on mobile</span>
                      <button
                        type="button"
                        onClick={() => setPopupSettings((prev) => ({ ...prev, showOnMobile: !prev.showOnMobile }))}
                        className="cursor-pointer focus:outline-none"
                      >
                        {popupSettings.showOnMobile ? (
                          <ToggleRight className="w-6 h-6 text-[#558b1a]" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Smart Session Guard Enabled:</strong> When visitors click &ldquo;Later&rdquo; or close the modal, it stays dismissed for the remainder of their browser session (`vof_campaign_popup_seen`) so navigation remains pleasant.
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                    {popupSettings.updatedAt ? `Last saved: ${new Date(popupSettings.updatedAt).toLocaleTimeString()}` : ''}
                  </span>
                </div>
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

          {/* ============================================================ */}
          {/* 10. FORMS CONTROLLER & PUBLIC INTAKE MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'forms' && (
            <div className="space-y-8">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#0c1a05] via-[#162f0d] to-[#091503] text-white p-6 sm:p-8 rounded-3xl border border-[#2b5219] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ac43e]/20 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-2">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Intake & Forms Control Board</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">Forms Visibility & Status Controller</h2>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    Toggle which forms are visible on the dashboard below. Inspect interactive form views, test public submission pipelines, and manage program enrollment availability.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setFormVisibility({
                        skills: true,
                        scholarship: true,
                        volunteer: true,
                        partner: true,
                        donation: true,
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Show All Forms (5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormVisibility({
                        skills: false,
                        scholarship: false,
                        volunteer: false,
                        partner: false,
                        donation: false,
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hide All</span>
                  </button>
                </div>
              </div>

              {/* Toggle Switchboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 1. Skills Acquisition Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.skills
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVisibility((prev) => ({ ...prev, skills: !prev.skills }))
                      }
                      className="cursor-pointer transition-colors"
                      title={formVisibility.skills ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.skills ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Skills Acquisition (VOIE)</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Vocational technical cohorts & workshop starter toolkits.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-purple-700">🇳🇬 & 🇷🇼 Hubs Only</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.skills ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.skills ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 2. Scholarship Aid Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.scholarship
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVisibility((prev) => ({ ...prev, scholarship: !prev.scholarship }))
                      }
                      className="cursor-pointer transition-colors"
                      title={formVisibility.scholarship ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.scholarship ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Scholarship Aid Form</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    JAMB fees, secondary school tuition & university grants.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-700">🇳🇬 & 🇷🇼 Hubs Only</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.scholarship ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.scholarship ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 3. Volunteer Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.volunteer
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVisibility((prev) => ({ ...prev, volunteer: !prev.volunteer }))
                      }
                      className="cursor-pointer transition-colors"
                      title={formVisibility.volunteer ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.volunteer ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Volunteer Registration</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Mentorship, community outreach, and logistics volunteers.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-blue-700">🇳🇬, 🇷🇼 & 🇺🇸 Hubs</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.volunteer ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.volunteer ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 4. Strategic Partner Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.partner
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVisibility((prev) => ({ ...prev, partner: !prev.partner }))
                      }
                      className="cursor-pointer transition-colors"
                      title={formVisibility.partner ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.partner ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Partnership Proposal</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Corporate CSR alliances, academic institutions & foundations.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-700">Corporate & NGOs</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.partner ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.partner ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* 5. Direct Donation Form */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    formVisibility.donation
                      ? 'bg-white border-[#558b1a] ring-2 ring-[#558b1a]/20 shadow-sm'
                      : 'bg-stone-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      5
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormVisibility((prev) => ({ ...prev, donation: !prev.donation }))
                      }
                      className="cursor-pointer transition-colors"
                      title={formVisibility.donation ? 'Hide Form' : 'Show Form'}
                    >
                      {formVisibility.donation ? (
                        <ToggleRight className="w-7 h-7 text-[#558b1a]" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Donation & Giving Form</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                    Pregnant Women, Youth, Education + SWIFT Wire channels.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-rose-700">3 Purposes + SWIFT</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        formVisibility.donation ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {formVisibility.donation ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RENDERED FORMS CONTAINER */}
              <div className="space-y-8 pt-4">
                {/* 1. Skills Acquisition Form View */}
                {formVisibility.skills && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-purple-50/70 border-b border-purple-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-200 text-purple-900">
                            VOIE Vocational Program
                          </span>
                          <span className="text-[11px] text-purple-800 font-semibold">
                            Application Intake (Nigeria & Rwanda)
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Skills Acquisition Application Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/apply/skills"
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white text-purple-900 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Public Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setFormVisibility((prev) => ({ ...prev, skills: false }))}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-gray-500 mb-4">
                        Note: The Skills Acquisition program operates strictly in <strong>Nigeria</strong> and <strong>Rwanda</strong>. The USA hub is intentionally excluded.
                      </p>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testSkillName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testSkillEmail') as HTMLInputElement)?.value;
                          const phone = (target.elements.namedItem('testSkillPhone') as HTMLInputElement)?.value;
                          const program = (target.elements.namedItem('testSkillProgram') as HTMLSelectElement)?.value;
                          const hub = (target.elements.namedItem('testSkillHub') as HTMLSelectElement)?.value;
                          try {
                            await api.createSkill({
                              applicantName: name || 'Test Applicant',
                              fullName: name || 'Test Applicant',
                              email: email || 'applicant@example.com',
                              phone: phone || '+234 801 234 5678',
                              tradeSelected: program || 'Fashion Design & Tailoring',
                              chosenProgram: program || 'Fashion Design & Tailoring',
                              centerLocation: hub === 'Rwanda' ? 'Kigali Training Center' : 'VOIE Mbieri, Imo State',
                              country: hub as 'Nigeria' | 'Rwanda',
                              status: 'pending',
                            });
                            showNotification('success', `Test Skills application submitted for ${name}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Country Hub (2 Hubs)</label>
                          <select
                            name="testSkillHub"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Nigeria">🇳🇬 Nigeria (VOIE HQ, Imo State)</option>
                            <option value="Rwanda">🇷🇼 Rwanda (Kigali Training Center)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Applicant Full Name *</label>
                          <input
                            name="testSkillName"
                            required
                            placeholder="e.g. Grace Amarachi"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                          <input
                            name="testSkillPhone"
                            required
                            placeholder="+234 800 000 0000"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                          <input
                            name="testSkillEmail"
                            type="email"
                            placeholder="grace@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Vocational Trade Chosen</label>
                          <select
                            name="testSkillProgram"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Fashion Design & Tailoring">Fashion Design & Tailoring</option>
                            <option value="Solar Installation & Electrical">Solar Installation & Electrical</option>
                            <option value="ICT & Digital Skills">ICT & Digital Skills</option>
                            <option value="Cosmetology & Hairdressing">Cosmetology & Hairdressing</option>
                            <option value="Footwear & Leatherwork">Footwear & Leatherwork</option>
                            <option value="Plumbing & Pipefitting">Plumbing & Pipefitting</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submit Direct Entry (VOIE)</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 2. Scholarship Aid Form View */}
                {formVisibility.scholarship && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900">
                            Academic Sponsorship
                          </span>
                          <span className="text-[11px] text-emerald-800 font-semibold">
                            JAMB, Secondary & Tertiary Scholarships (Nigeria & Rwanda)
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Scholarship Application Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/apply/scholarship"
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Public Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setFormVisibility((prev) => ({ ...prev, scholarship: false }))}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-gray-500 mb-4">
                        Note: Scholarships are available strictly across <strong>Nigeria</strong> and <strong>Rwanda</strong>. The USA hub is intentionally excluded.
                      </p>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testScholName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testScholEmail') as HTMLInputElement)?.value;
                          const phone = (target.elements.namedItem('testScholPhone') as HTMLInputElement)?.value;
                          const level = (target.elements.namedItem('testScholLevel') as HTMLSelectElement)?.value;
                          const inst = (target.elements.namedItem('testScholInst') as HTMLInputElement)?.value;
                          const hub = (target.elements.namedItem('testScholHub') as HTMLSelectElement)?.value;
                          try {
                            await api.createScholarship({
                              applicantName: name || 'Test Student',
                              fullName: name || 'Test Student',
                              email: email || 'student@example.com',
                              phone: phone || '+234 800 111 2222',
                              scholarshipType: level || 'JAMB / UTME Registration Fee Grant',
                              institutionName: inst || 'Alvan Ikoku Federal Univ. of Education',
                              country: hub as 'Nigeria' | 'Rwanda',
                              status: 'pending',
                            });
                            showNotification('success', `Scholarship entry logged for ${name}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Country Hub (2 Hubs)</label>
                          <select
                            name="testScholHub"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Nigeria">🇳🇬 Nigeria (Global HQ & Schools)</option>
                            <option value="Rwanda">🇷🇼 Rwanda (Kigali Education Partnerships)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Student Full Name *</label>
                          <input
                            name="testScholName"
                            required
                            placeholder="e.g. Uchechukwu Obi"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Phone Number *</label>
                          <input
                            name="testScholPhone"
                            required
                            placeholder="+234 ..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                          <input
                            name="testScholEmail"
                            type="email"
                            placeholder="uche@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Scholarship Milestone</label>
                          <select
                            name="testScholLevel"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="JAMB / UTME Registration Fee Grant">JAMB / UTME Examination Grant</option>
                            <option value="Secondary School Tuition Sponsorship">Secondary School Sponsorship</option>
                            <option value="University Degree Scholarship (Beyond the Degree)">University Grant (&quot;Beyond the Degree&quot;)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Institution Name</label>
                          <input
                            name="testScholInst"
                            placeholder="e.g. Saint Paul's Secondary / AIFUE"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                          <button
                            type="submit"
                            className="py-2.5 px-6 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Submit Direct Scholarship Entry</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 3. Volunteer Registration Form View */}
                {formVisibility.volunteer && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-200 text-blue-900">
                            Volunteer Service
                          </span>
                          <span className="text-[11px] text-blue-800 font-semibold">
                            Nigeria, Rwanda & USA Hubs
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Volunteer Registration Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/volunteer"
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white text-blue-900 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Public Page</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setFormVisibility((prev) => ({ ...prev, volunteer: false }))}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testVolName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testVolEmail') as HTMLInputElement)?.value;
                          const phone = (target.elements.namedItem('testVolPhone') as HTMLInputElement)?.value;
                          const area = (target.elements.namedItem('testVolArea') as HTMLSelectElement)?.value;
                          const hub = (target.elements.namedItem('testVolHub') as HTMLSelectElement)?.value;
                          try {
                            await api.createVolunteer({
                              fullName: name || 'Test Volunteer',
                              email: email || 'volunteer@example.com',
                              phone: phone || '+234 ...',
                              location: hub,
                              interestArea: area || 'VOIE Skills Mentorship',
                              availability: 'Weekends',
                              status: 'new',
                            });
                            showNotification('success', `Volunteer registered: ${name}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Country Hub (3 Hubs)</label>
                          <select
                            name="testVolHub"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Nigeria">🇳🇬 Nigeria Hub (Imo State)</option>
                            <option value="Rwanda">🇷🇼 Rwanda Hub (Kigali)</option>
                            <option value="USA">🇺🇸 United States (501c3 Diaspora)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Volunteer Full Name *</label>
                          <input
                            name="testVolName"
                            required
                            placeholder="e.g. David Nnamdi"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                          <input
                            name="testVolEmail"
                            required
                            type="email"
                            placeholder="david@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                          <input
                            name="testVolPhone"
                            placeholder="+234 ... / +1 ..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Area of Contribution</label>
                          <select
                            name="testVolArea"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="VOIE Skills Mentorship">VOIE Skills Mentorship & Technical Coaching</option>
                            <option value="Maternal Care & Young Mothers">Maternal Care & Young Mothers Counseling</option>
                            <option value="Field Outreach Logistics">Field Outreach & Food Distribution</option>
                            <option value="Digital Media & Photography">Digital Media, Design & Communications</option>
                            <option value="Academic Tutoring">Academic Tutoring & JAMB Coaching</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Register Volunteer</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 4. Strategic Partner Proposal Form View */}
                {formVisibility.partner && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                            Strategic Alliances
                          </span>
                          <span className="text-[11px] text-amber-800 font-semibold">
                            Corporate CSR, University & Healthcare Proposals
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Partner Proposal Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormVisibility((prev) => ({ ...prev, partner: false }))}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const org = (target.elements.namedItem('testPartOrg') as HTMLInputElement)?.value;
                          const contact = (target.elements.namedItem('testPartContact') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testPartEmail') as HTMLInputElement)?.value;
                          const type = (target.elements.namedItem('testPartType') as HTMLSelectElement)?.value;
                          const focus = (target.elements.namedItem('testPartFocus') as HTMLInputElement)?.value;
                          try {
                            await api.createPartner({
                              organizationName: org || 'Acme Group',
                              contactPerson: contact || 'Director of CSR',
                              email: email || 'csr@acme.com',
                              phone: '+1 555 019 2834',
                              partnerType: type || 'Corporate',
                              focusArea: focus || 'Youth Skills Cohort Sponsorship',
                              status: 'new',
                            });
                            showNotification('success', `Partner inquiry recorded: ${org}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Organization Name *</label>
                          <input
                            name="testPartOrg"
                            required
                            placeholder="e.g. Zenith Bank CSR / MTN Foundation"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Contact Person *</label>
                          <input
                            name="testPartContact"
                            required
                            placeholder="e.g. Dr. Ngozi Balogun"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Official Email *</label>
                          <input
                            name="testPartEmail"
                            required
                            type="email"
                            placeholder="ngozi@organization.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Organization Category</label>
                          <select
                            name="testPartType"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Corporate">Corporate / Private Business</option>
                            <option value="School">School / Academic University</option>
                            <option value="NGO">International NGO / Foundation</option>
                            <option value="Healthcare">Hospital / Healthcare Facility</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Focus Area</label>
                          <input
                            name="testPartFocus"
                            placeholder="e.g. Solar toolkits & Maternal care kits"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Log Partner Proposal</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5. Direct Donation & Giving Form View */}
                {formVisibility.donation && (
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-rose-50/70 border-b border-rose-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-900">
                            Donation Intake
                          </span>
                          <span className="text-[11px] text-rose-800 font-semibold">
                            3 Purposes: Pregnant Women, Youth & Education + SWIFT Wire
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900 mt-1">
                          Direct Donation & Purpose Routing Form Preview
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormVisibility((prev) => ({ ...prev, donation: false }))}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                          title="Hide form from view"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* SWIFT Codes Box */}
                      <div className="mb-5 p-4 rounded-2xl bg-stone-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div>
                          <span className="font-bold text-gray-900 block">GTBank (NGN)</span>
                          <span className="font-mono text-gray-700">0923058866</span> • <span className="font-bold text-[#558b1a]">SWIFT: GTBINGLA</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">Zenith Bank (NGN)</span>
                          <span className="font-mono text-gray-700">1310650942</span> • <span className="font-bold text-[#558b1a]">SWIFT: ZEIBNGLA</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">Bank of Kigali (RWF)</span>
                          <span className="font-mono text-gray-700">100267865048</span> • <span className="font-bold text-blue-700">IBAN: RW34...8646</span>
                        </div>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const target = e.target as HTMLFormElement;
                          const name = (target.elements.namedItem('testDonName') as HTMLInputElement)?.value;
                          const email = (target.elements.namedItem('testDonEmail') as HTMLInputElement)?.value;
                          const amount = parseFloat((target.elements.namedItem('testDonAmount') as HTMLInputElement)?.value || '50000');
                          const curr = (target.elements.namedItem('testDonCurr') as HTMLSelectElement)?.value || 'NGN';
                          const purposeVal = (target.elements.namedItem('testDonPurpose') as HTMLSelectElement)?.value;
                          const methodVal = (target.elements.namedItem('testDonMethod') as HTMLSelectElement)?.value;
                          try {
                            await api.createDonation({
                              donorName: name || 'Anonymous Donor',
                              donorEmail: email || 'donor@example.com',
                              amount: amount,
                              currency: curr,
                              campaign: purposeVal || 'Pregnant Women Support',
                              paymentMethod: methodVal || 'Zenith Bank Transfer',
                              reference: `ADM-${Date.now().toString().slice(-6)}`,
                              status: 'completed',
                              notes: `Direct administrative entry via Forms Controller (${purposeVal})`,
                            });
                            showNotification('success', `Donation recorded under ${purposeVal}!`);
                            loadAllData();
                            target.reset();
                          } catch (err: any) {
                            showNotification('error', 'Submission error: ' + err.message);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">
                            Designated Purpose * (Routes to Filterable List)
                          </label>
                          <select
                            name="testDonPurpose"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-semibold text-rose-900"
                          >
                            <option value="Pregnant Women Support">Pregnant Women Support</option>
                            <option value="Youth Empowerment">Youth Empowerment</option>
                            <option value="Education Sponsorship">Education Sponsorship</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Donor Name *</label>
                          <input
                            name="testDonName"
                            required
                            placeholder="e.g. Chief Raymond Nkem"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-600"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Donor Email / Phone</label>
                          <input
                            name="testDonEmail"
                            placeholder="raymond@example.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Donation Amount</label>
                          <input
                            name="testDonAmount"
                            type="number"
                            defaultValue={50000}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none font-bold text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Currency</label>
                          <select
                            name="testDonCurr"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="NGN">NGN (₦ Nigerian Naira)</option>
                            <option value="USD">USD ($ US Dollar)</option>
                            <option value="RWF">RWF (Rwanda Francs)</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Payment Channel</label>
                          <select
                            name="testDonMethod"
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                          >
                            <option value="Paystack">Paystack Online</option>
                            <option value="Zenith Bank Transfer">Zenith Bank Transfer (SWIFT: ZEIBNGLA)</option>
                            <option value="GTBank Transfer">GTBank Transfer (SWIFT: GTBINGLA)</option>
                            <option value="Bank of Kigali">Bank of Kigali Transfer (RWF)</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Stripe">Stripe</option>
                            <option value="Zelle">Zelle (vofcorp@gmail.com)</option>
                          </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                          <button
                            type="submit"
                            className="py-2.5 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Log Donation & Route to Filterable List</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 11. LIVE SUPPORT DESK & AI CHATBOT ROUTING */}
          {/* ============================================================ */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#0c1a05] via-[#162f0d] to-[#091503] text-white p-6 sm:p-8 rounded-3xl border border-[#2b5219] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ac43e]/20 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-2">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Real-Time Support Desk</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">Live Visitor Inquiries & Chatbot Routing</h2>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    When you are online, visitor messages route directly to this console and chime with a sound alert.
                    When you step away or toggle offline, the Gemini AI Assistant (Amina) answers foundation questions automatically.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* Presence Status Toggle */}
                  <button
                    type="button"
                    onClick={() => setSupportStaffOnline(!supportStaffOnline)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm border ${
                      supportStaffOnline
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        supportStaffOnline ? 'bg-emerald-300 animate-ping' : 'bg-gray-500'
                      }`}
                    />
                    <span>{supportStaffOnline ? 'You Are Online (Live Desk)' : 'You Are Offline (AI Auto-Pilot)'}</span>
                  </button>

                  {/* Audio Ping Chime Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setAudioPingEnabled(!audioPingEnabled);
                      if (!audioPingEnabled) {
                        playStaffPing();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10 cursor-pointer"
                    title={audioPingEnabled ? 'Sound alerts enabled (Click to mute)' : 'Sound alerts muted (Click to enable)'}
                  >
                    {audioPingEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                  </button>

                  {/* Test Ping Sound */}
                  <button
                    type="button"
                    onClick={playStaffPing}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-semibold transition border border-white/10"
                  >
                    Test Ping
                  </button>
                </div>
              </div>

              {/* Main Workspace (Two Columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
                {/* LEFT COLUMN: Conversation Threads List (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  {/* Search & Filter Header */}
                  <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={supportSearch}
                        onChange={(e) => setSupportSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-medium text-gray-600">
                      {(['all', 'waiting_staff', 'staff_active', 'ai_active', 'closed'] as const).map((filterKey) => (
                        <button
                          key={filterKey}
                          onClick={() => setSupportFilter(filterKey)}
                          className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition cursor-pointer ${
                            supportFilter === filterKey
                              ? 'bg-[#558b1a] text-white font-bold'
                              : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {filterKey === 'waiting_staff'
                            ? 'Waiting'
                            : filterKey === 'staff_active'
                            ? 'Staff'
                            : filterKey === 'ai_active'
                            ? 'AI Bot'
                            : filterKey}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conversation List Scroll Area */}
                  <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {(() => {
                      let filtered = supportConversations;
                      if (supportFilter !== 'all') {
                        filtered = filtered.filter((c) => c.status === supportFilter);
                      }
                      if (supportSearch.trim()) {
                        const q = supportSearch.toLowerCase();
                        filtered = filtered.filter(
                          (c) =>
                            (c.visitor_name && c.visitor_name.toLowerCase().includes(q)) ||
                            (c.last_message && c.last_message.toLowerCase().includes(q)) ||
                            (c.session_id && c.session_id.toLowerCase().includes(q))
                        );
                      }

                      if (filtered.length === 0) {
                        return (
                          <div className="p-8 text-center text-gray-400">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-semibold">No visitor threads found</p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              When visitors send messages on public pages, they will appear here.
                            </p>
                          </div>
                        );
                      }

                      return filtered.map((conv) => {
                        const isSelected = selectedConvId === conv.id;
                        const isWaiting = conv.status === 'waiting_staff';
                        const isAi = conv.status === 'ai_active';
                        const isStaff = conv.status === 'staff_active';

                        return (
                          <div
                            key={conv.id}
                            onClick={() => setSelectedConvId(conv.id)}
                            className={`p-3.5 transition cursor-pointer hover:bg-emerald-50/50 ${
                              isSelected ? 'bg-emerald-50/80 border-l-4 border-l-[#558b1a]' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                                  {conv.visitor_name?.charAt(0) || 'V'}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-xs text-gray-900 truncate">
                                    {conv.visitor_name || 'Website Visitor'}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 truncate block">
                                    {conv.session_id.slice(0, 16)}...
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-[10px] text-gray-400">
                                  {conv.last_message_at
                                    ? new Date(conv.last_message_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : ''}
                                </span>
                                {conv.unread_admin > 0 && (
                                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                                    {conv.unread_admin}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-1 mt-1.5 pl-10">
                              {conv.last_message || '(No messages yet)'}
                            </p>

                            <div className="flex items-center gap-1.5 mt-2 pl-10">
                              {isWaiting && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                  Waiting for Staff
                                </span>
                              )}
                              {isAi && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  AI Managed
                                </span>
                              )}
                              {isStaff && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Staff Connected
                                </span>
                              )}
                              {conv.status === 'closed' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-600">
                                  Closed
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* RIGHT COLUMN: Active Chat Transcript & Actions (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  {selectedConvId ? (
                    (() => {
                      const curConv = supportConversations.find((c) => c.id === selectedConvId);
                      return (
                        <>
                          {/* Chat Window Top Bar */}
                          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/70">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#558b1a] text-white flex items-center justify-center font-bold text-sm">
                                {curConv?.visitor_name?.charAt(0) || 'V'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-sm text-gray-900">
                                    {curConv?.visitor_name || 'Website Visitor'}
                                  </h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      curConv?.status === 'waiting_staff'
                                        ? 'bg-amber-100 text-amber-800'
                                        : curConv?.status === 'staff_active'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : curConv?.status === 'ai_active'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {curConv?.status === 'waiting_staff'
                                      ? 'Needs Your Response'
                                      : curConv?.status === 'staff_active'
                                      ? 'Staff Responding'
                                      : curConv?.status === 'ai_active'
                                      ? 'AI Answering'
                                      : 'Closed'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Session: {curConv?.session_id} • Started{' '}
                                  {curConv?.created_at
                                    ? new Date(curConv.created_at).toLocaleDateString()
                                    : 'Today'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {curConv?.status !== 'staff_active' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateConversationStatus(curConv.id, 'staff_active')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Headphones className="w-3.5 h-3.5" />
                                  <span>Take Over from AI</span>
                                </button>
                              )}
                              {curConv?.status !== 'ai_active' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateConversationStatus(curConv.id, 'ai_active')}
                                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Hand to AI</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateConversationStatus(
                                    curConv.id,
                                    curConv.status === 'closed' ? 'waiting_staff' : 'closed'
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition cursor-pointer"
                              >
                                {curConv?.status === 'closed' ? 'Reopen' : 'Mark Resolved'}
                              </button>
                            </div>
                          </div>

                          {/* Chat Transcript Area */}
                          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                            {supportMessages.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <MessageSquare className="w-10 h-10 opacity-30 mb-2" />
                                <p className="text-xs">No messages in this conversation yet</p>
                              </div>
                            ) : (
                              supportMessages.map((msg) => {
                                const isStaff = msg.sender_type === 'staff';
                                const isAi = msg.sender_type === 'ai';
                                const isUser = msg.sender_type === 'user';

                                return (
                                  <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${isStaff ? 'flex-row-reverse' : ''}`}
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                        isStaff
                                          ? 'bg-emerald-700 text-white'
                                          : isAi
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-stone-700 text-white'
                                      }`}
                                    >
                                      {isStaff ? 'ST' : isAi ? <Sparkles className="w-3.5 h-3.5" /> : 'U'}
                                    </div>

                                    <div
                                      className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                        isStaff
                                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                                          : isAi
                                          ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tl-xs'
                                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-xs'
                                      }`}
                                    >
                                      <div
                                        className={`flex items-center gap-2 mb-1.5 text-[10px] font-bold ${
                                          isStaff ? 'text-emerald-100' : 'text-gray-400'
                                        }`}
                                      >
                                        <span>{msg.sender_name}</span>
                                        {isAi && (
                                          <span className="bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded font-normal">
                                            Amina AI
                                          </span>
                                        )}
                                        {isStaff && (
                                          <span className="bg-white/20 text-white px-1.5 py-0.2 rounded font-normal">
                                            Support Desk
                                          </span>
                                        )}
                                      </div>
                                      <FormattedChatMessage content={msg.content} isUser={isStaff} />
                                      <div
                                        className={`text-[10px] mt-2 flex items-center justify-end ${
                                          isStaff ? 'text-emerald-200' : 'text-gray-400'
                                        }`}
                                      >
                                        <span>
                                          {new Date(msg.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Quick Canned Response Chips */}
                          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5">
                            {[
                              'Hello! How can our support team assist you today?',
                              'Our VOIE Center offers vocational skills in fashion, catering & IT.',
                              'Scholarships cover full tuition and exam fees. Visit /apply.',
                              'Donations can be made to Access Bank: 1851214066 or online.',
                            ].map((canned, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSendStaffReply(canned)}
                                className="text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 transition cursor-pointer"
                              >
                                {canned}
                              </button>
                            ))}
                          </div>

                          {/* Staff Reply Box */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSendStaffReply();
                            }}
                            className="p-4 bg-white border-t border-gray-200 flex items-center gap-3"
                          >
                            <input
                              type="text"
                              placeholder="Type your response to the visitor as Support Staff..."
                              value={staffReplyText}
                              onChange={(e) => setStaffReplyText(e.target.value)}
                              disabled={sendingStaffReply}
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:bg-white transition"
                            />
                            <button
                              type="submit"
                              disabled={!staffReplyText.trim() || sendingStaffReply}
                              className="px-5 py-3 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                              <Send className="w-4 h-4" />
                              <span>{sendingStaffReply ? 'Sending...' : 'Reply'}</span>
                            </button>
                          </form>
                        </>
                      );
                    })()
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                        <Headphones className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">Select a Conversation</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm">
                        Choose a visitor inquiry thread from the left column to read messages and reply live.
                      </p>
                    </div>
                  )}
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
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {editingBlog ? 'Edit Blog Story' : 'Publish New Blog Post'}
                </h3>
                <p className="text-xs text-gray-500">
                  WYSIWYG rich content formatting, tags management, and Cloudinary media upload.
                </p>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
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
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a] text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700 block">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setCategoryFormData({ name: '', slug: '', description: '', color: '#558b1a' });
                        setIsCategoryModalOpen(true);
                      }}
                      className="text-[11px] text-[#558b1a] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      New Category
                    </button>
                  </div>
                  <select
                    value={blogFormData.category || ''}
                    onChange={(e) => {
                      const selected = blogCategories.find((c) => c.name === e.target.value);
                      setBlogFormData({
                        ...blogFormData,
                        category: e.target.value,
                        categoryId: selected ? selected.id : undefined,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  >
                    {blogCategories.length === 0 ? (
                      <option value="Education Support">Education Support</option>
                    ) : (
                      blogCategories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
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

              {/* Tags Multi-Select & Creator */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Article Tags (Categorization & SEO)
                </label>
                <div className="p-3 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-2.5">
                  {/* Selected Tags Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                    {(blogFormData.tags || []).length === 0 ? (
                      <span className="text-[11px] text-gray-400 italic">No tags attached yet. Pick or add tags below.</span>
                    ) : (
                      (blogFormData.tags || []).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (blogFormData.tags || []).filter((item) => item !== t);
                              setBlogFormData({ ...blogFormData, tags: updated });
                            }}
                            className="hover:text-red-700 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add Tag Input & Preset Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/60">
                    <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Type tag name and click Add..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = tagInput.trim();
                            if (val && !(blogFormData.tags || []).includes(val)) {
                              setBlogFormData({
                                ...blogFormData,
                                tags: [...(blogFormData.tags || []), val],
                              });
                              setTagInput('');
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#558b1a]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = tagInput.trim();
                          if (val && !(blogFormData.tags || []).includes(val)) {
                            setBlogFormData({
                              ...blogFormData,
                              tags: [...(blogFormData.tags || []), val],
                            });
                            setTagInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 text-xs"
                      >
                        Add Tag
                      </button>
                    </div>

                    {/* Quick Suggestions from existing tags */}
                    {blogTags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-medium">Suggestions:</span>
                        {blogTags
                          .filter((bt) => !(blogFormData.tags || []).includes(bt.name))
                          .slice(0, 5)
                          .map((bt) => (
                            <button
                              key={bt.id}
                              type="button"
                              onClick={() => {
                                setBlogFormData({
                                  ...blogFormData,
                                  tags: [...(blogFormData.tags || []), bt.name],
                                });
                              }}
                              className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 text-[11px] font-medium"
                            >
                              +{bt.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
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
                <label className="font-bold text-gray-700 block mb-1">Short Excerpt (Card Summary) *</label>
                <textarea
                  rows={2}
                  required
                  value={blogFormData.excerpt || ''}
                  onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                  placeholder="Brief 1-2 sentence preview for blog listing cards..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              {/* WYSIWYG RICH TEXT EDITOR */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Full Article Body (WYSIWYG Rich Editor) *
                </label>
                <RichTextEditor
                  value={blogFormData.content || ''}
                  onChange={(html) => setBlogFormData({ ...blogFormData, content: html })}
                  placeholder="Compose your story, format headings, blockquotes, bullet lists, and insert Cloudinary images..."
                  minHeight="320px"
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
                  className="px-6 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  {editingBlog ? 'Update Post' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CATEGORY MANAGER (CREATE / EDIT) */}
      {/* ============================================================ */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name || ''}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="e.g. Healthcare Outreach"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryFormData.description || ''}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Brief summary of what articles belong here..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Color Badge Theme</label>
                <div className="flex items-center gap-2">
                  {['#558b1a', '#3b82f6', '#10b981', '#ec4899', '#f59e0b', '#6366f1', '#8b5cf6', '#ef4444'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategoryFormData({ ...categoryFormData, color: c })}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        categoryFormData.color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white font-bold transition"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
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

      {/* ADMIN POP-UP PREVIEW MODAL */}
      {isPreviewPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setIsPreviewPopupOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPreviewPopupOpen(false)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-950 flex items-center justify-center shadow-md transition cursor-pointer border border-gray-200/60"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Preview Left Image */}
            <div className="relative w-full md:w-5/12 h-48 md:h-auto min-h-[220px] bg-stone-900 shrink-0 overflow-hidden">
              <img
                src={projects[previewProjectIndex]?.imageUrl || 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233536/vof/IMG01.jpg'}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#558b1a] text-white shadow-sm">
                  {projects[previewProjectIndex]?.category || 'Vocational Education'}
                </span>
                <span className="text-[10px] text-white/90 font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  {projects.length > 0 ? `${previewProjectIndex + 1} of ${projects.length}` : 'Preview'}
                </span>
              </div>
            </div>

            {/* Preview Right Info */}
            <div className="w-full md:w-7/12 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#558b1a] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#558b1a]">
                    {popupSettings.headline || 'Active Campaign'}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {projects[previewProjectIndex]?.title || 'Sponsor Youth Vocational Training at VOIE'}
                </h3>

                <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
                  {projects[previewProjectIndex]?.description || 'Equip a young person with tuition, hands-on workshop tools, and starter kits.'}
                </p>
              </div>

              <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Raised</span>
                    <span className="font-bold text-[#558b1a] text-sm">
                      ₦{projects[previewProjectIndex]?.raisedAmount?.toLocaleString() || '4,800,000'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Target Goal</span>
                    <span className="font-bold text-gray-800 text-sm">
                      ₦{projects[previewProjectIndex]?.targetAmount?.toLocaleString() || '10,000,000'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#558b1a] to-[#8ac43e] h-full rounded-full w-2/3" />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      alert('This is a preview of the CTA button: ' + (popupSettings.ctaText || 'Donate Now'));
                      setIsPreviewPopupOpen(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold text-xs sm:text-sm hover:opacity-95 shadow-sm cursor-pointer"
                  >
                    {popupSettings.ctaText || 'Donate Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewPopupOpen(false)}
                    className="py-2.5 px-4 rounded-full border border-gray-200 text-gray-600 font-bold text-xs cursor-pointer hover:bg-gray-50"
                  >
                    Later
                  </button>
                </div>

                {projects.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {projects.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPreviewProjectIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === previewProjectIndex ? 'w-6 bg-[#558b1a]' : 'w-1.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
