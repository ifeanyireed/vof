'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  AdminRole,
  AdminUser,
  TabType,
  TAB_TO_ROUTE,
  ROLE_CONFIGS,
  canAccessTab,
  canAccessRoute,
  getAllowedTabs,
  getRoleLabel,
  getRoleBadge,
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_KEY,
} from '@/lib/auth';

export interface AdminContextType {
  currentUser: AdminUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  authChecking: boolean;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  isLoadingAdminUsers: boolean;
  fetchAdminUsers: () => Promise<void>;
  loading: boolean;
  refreshing: boolean;
  loadAllData: () => Promise<void>;
  message: { type: 'success' | 'error'; text: string } | null;
  setMessage: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; text: string } | null>>;
  showNotification: (type: 'success' | 'error', text: string) => void;
  handleLogout: () => Promise<void>;
  navigateToTab: (tab: TabType) => void;

  // Data states
  stats: DashboardStats | null;
  setStats: React.Dispatch<React.SetStateAction<DashboardStats | null>>;
  blogs: BlogItem[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogItem[]>>;
  blogCategories: BlogCategory[];
  setBlogCategories: React.Dispatch<React.SetStateAction<BlogCategory[]>>;
  blogTags: BlogTag[];
  setBlogTags: React.Dispatch<React.SetStateAction<BlogTag[]>>;
  donations: DonationItem[];
  setDonations: React.Dispatch<React.SetStateAction<DonationItem[]>>;
  volunteers: VolunteerItem[];
  setVolunteers: React.Dispatch<React.SetStateAction<VolunteerItem[]>>;
  partners: PartnerItem[];
  setPartners: React.Dispatch<React.SetStateAction<PartnerItem[]>>;
  projects: CharityProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<CharityProjectItem[]>>;
  scholarships: ScholarshipItem[];
  setScholarships: React.Dispatch<React.SetStateAction<ScholarshipItem[]>>;
  skills: SkillAppItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillAppItem[]>>;
  accounts: FinancialAccountItem[];
  setAccounts: React.Dispatch<React.SetStateAction<FinancialAccountItem[]>>;
  transactions: FinancialTxItem[];
  setTransactions: React.Dispatch<React.SetStateAction<FinancialTxItem[]>>;
  finSummary: FinancialSummary | null;
  setFinSummary: React.Dispatch<React.SetStateAction<FinancialSummary | null>>;
  galleryMedia: GalleryMediaItem[];
  setGalleryMedia: React.Dispatch<React.SetStateAction<GalleryMediaItem[]>>;
  popupSettings: PopupSettings;
  setPopupSettings: React.Dispatch<React.SetStateAction<PopupSettings>>;

  // Support Desk state
  supportStaffOnline: boolean;
  setSupportStaffOnline: React.Dispatch<React.SetStateAction<boolean>>;
  supportConversations: any[];
  setSupportConversations: React.Dispatch<React.SetStateAction<any[]>>;
  selectedConvId: number | null;
  setSelectedConvId: React.Dispatch<React.SetStateAction<number | null>>;
  supportMessages: any[];
  setSupportMessages: React.Dispatch<React.SetStateAction<any[]>>;
  staffReplyText: string;
  setStaffReplyText: React.Dispatch<React.SetStateAction<string>>;
  sendingStaffReply: boolean;
  setSendingStaffReply: React.Dispatch<React.SetStateAction<boolean>>;
  supportFilter: 'all' | 'waiting_staff' | 'staff_active' | 'ai_active' | 'closed';
  setSupportFilter: React.Dispatch<React.SetStateAction<'all' | 'waiting_staff' | 'staff_active' | 'ai_active' | 'closed'>>;
  supportSearch: string;
  setSupportSearch: React.Dispatch<React.SetStateAction<string>>;
  totalSupportUnread: number;
  setTotalSupportUnread: React.Dispatch<React.SetStateAction<number>>;
  audioPingEnabled: boolean;
  setAudioPingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  playStaffPing: () => void;
  handleSendStaffReply: (customText?: string) => Promise<void>;
  handleUpdateConversationStatus: (convId: number, newStatus: string) => Promise<void>;

  // Forms controller state
  formVisibility: {
    skills: boolean;
    scholarship: boolean;
    volunteer: boolean;
    partner: boolean;
    donation: boolean;
  };
  setFormVisibility: React.Dispatch<React.SetStateAction<{
    skills: boolean;
    scholarship: boolean;
    volunteer: boolean;
    partner: boolean;
    donation: boolean;
  }>>;
  formStatuses: {
    skills: 'open' | 'paused';
    scholarship: 'open' | 'paused';
    volunteer: 'open' | 'paused';
    partner: 'open' | 'paused';
    donation: 'open' | 'paused';
  };
  setFormStatuses: React.Dispatch<React.SetStateAction<{
    skills: 'open' | 'paused';
    scholarship: 'open' | 'paused';
    volunteer: 'open' | 'paused';
    partner: 'open' | 'paused';
    donation: 'open' | 'paused';
  }>>;

  // Partner Modal & Review state
  selectedPartner: PartnerItem | null;
  setSelectedPartner: React.Dispatch<React.SetStateAction<PartnerItem | null>>;
  isUpdatingPartner: boolean;
  setIsUpdatingPartner: React.Dispatch<React.SetStateAction<boolean>>;
  partnerStatusUpdate: string;
  setPartnerStatusUpdate: React.Dispatch<React.SetStateAction<string>>;
  partnerNotesUpdate: string;
  setPartnerNotesUpdate: React.Dispatch<React.SetStateAction<string>>;
  handleUpdatePartnerStatus: (id: number, newStatus: string, notes?: string) => Promise<void>;
  handleDeletePartner: (id: number) => Promise<void>;

  // Gallery state
  gallerySearch: string;
  setGallerySearch: React.Dispatch<React.SetStateAction<string>>;
  galleryCategoryFilter: string;
  setGalleryCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  galleryYearFilter: string;
  setGalleryYearFilter: React.Dispatch<React.SetStateAction<string>>;
  galleryRegionFilter: string;
  setGalleryRegionFilter: React.Dispatch<React.SetStateAction<string>>;
  galleryViewMode: 'grid' | 'table';
  setGalleryViewMode: React.Dispatch<React.SetStateAction<'grid' | 'table'>>;
  isMediaModalOpen: boolean;
  setIsMediaModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingMedia: GalleryMediaItem | null;
  setEditingMedia: React.Dispatch<React.SetStateAction<GalleryMediaItem | null>>;
  previewingMedia: GalleryMediaItem | null;
  setPreviewingMedia: React.Dispatch<React.SetStateAction<GalleryMediaItem | null>>;
  uploadingGalleryImage: boolean;
  setUploadingGalleryImage: React.Dispatch<React.SetStateAction<boolean>>;
  isSavingMedia: boolean;
  setIsSavingMedia: React.Dispatch<React.SetStateAction<boolean>>;
  mediaFormData: {
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
  };
  setMediaFormData: React.Dispatch<React.SetStateAction<{
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
  }>>;
  handleSaveMedia: (e: React.FormEvent) => Promise<void>;
  handleDeleteMedia: (id: number) => Promise<void>;
  handleGalleryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;

  // Modals & Handlers
  isBlogModalOpen: boolean;
  setIsBlogModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingBlog: BlogItem | null;
  setEditingBlog: React.Dispatch<React.SetStateAction<BlogItem | null>>;
  blogFormData: Partial<BlogItem>;
  setBlogFormData: React.Dispatch<React.SetStateAction<Partial<BlogItem>>>;
  uploadingImage: boolean;
  setUploadingImage: React.Dispatch<React.SetStateAction<boolean>>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, targetField: 'blog' | 'project') => Promise<void>;
  handleSaveBlog: (e: React.FormEvent) => Promise<void>;
  handleDeleteBlog: (id: number) => Promise<void>;

  // Categories & Tags
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingCategory: BlogCategory | null;
  setEditingCategory: React.Dispatch<React.SetStateAction<BlogCategory | null>>;
  categoryFormData: Partial<BlogCategory>;
  setCategoryFormData: React.Dispatch<React.SetStateAction<Partial<BlogCategory>>>;
  newTagName: string;
  setNewTagName: React.Dispatch<React.SetStateAction<string>>;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
  handleSaveCategory: (e: React.FormEvent) => Promise<void>;
  handleDeleteCategory: (id: number) => Promise<void>;
  handleCreateTag: (e?: React.FormEvent) => Promise<void>;
  handleDeleteTag: (id: number, name: string) => Promise<void>;

  // Donations
  isDonationModalOpen: boolean;
  setIsDonationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  donationFormData: Partial<DonationItem>;
  setDonationFormData: React.Dispatch<React.SetStateAction<Partial<DonationItem>>>;
  handleSaveDonation: (e: React.FormEvent) => Promise<void>;

  // Volunteers
  isVolunteerModalOpen: boolean;
  setIsVolunteerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newVolunteer: Partial<VolunteerItem>;
  setNewVolunteer: React.Dispatch<React.SetStateAction<Partial<VolunteerItem>>>;
  handleSaveVolunteer: (e: React.FormEvent) => Promise<void>;
  handleUpdateVolunteerStatus: (id: number, status: string) => Promise<void>;

  // Projects
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingProject: CharityProjectItem | null;
  setEditingProject: React.Dispatch<React.SetStateAction<CharityProjectItem | null>>;
  projectFormData: Partial<CharityProjectItem>;
  setProjectFormData: React.Dispatch<React.SetStateAction<Partial<CharityProjectItem>>>;
  handleSaveProject: (e: React.FormEvent) => Promise<void>;
  handleDeleteProject: (id: number) => Promise<void>;

  // Applications
  handleUpdateScholarshipStatus: (id: number, status: string) => Promise<void>;
  handleUpdateSkillStatus: (id: number, status: string) => Promise<void>;

  // Financials
  isTxModalOpen: boolean;
  setIsTxModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  txFormData: Partial<FinancialTxItem>;
  setTxFormData: React.Dispatch<React.SetStateAction<Partial<FinancialTxItem>>>;
  handleSaveTransaction: (e: React.FormEvent) => Promise<void>;

  // Popup
  isSavingPopup: boolean;
  setIsSavingPopup: React.Dispatch<React.SetStateAction<boolean>>;
  isPreviewPopupOpen: boolean;
  setIsPreviewPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previewProjectIndex: number;
  setPreviewProjectIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSavePopupSettings: () => Promise<void>;

  // Team & RBAC
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingUser: AdminUser | null;
  setEditingUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  isEditRoleModalOpen: boolean;
  setIsEditRoleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newUserData: { email: string; fullName: string; password: string; role: AdminRole };
  setNewUserData: React.Dispatch<React.SetStateAction<{ email: string; fullName: string; password: string; role: AdminRole }>>;
  savingUser: boolean;
  setSavingUser: React.Dispatch<React.SetStateAction<boolean>>;
  adminUserSearch: string;
  setAdminUserSearch: React.Dispatch<React.SetStateAction<string>>;
  adminRoleFilter: string;
  setAdminRoleFilter: React.Dispatch<React.SetStateAction<string>>;
  handleCreateAdminUser: (e: React.FormEvent) => Promise<void>;
  handleUpdateUserRole: (userId: number, newRole: AdminRole) => Promise<void>;
  handleToggleUserStatus: (user: AdminUser) => Promise<void>;
  handleDeleteUser: (user: AdminUser) => Promise<void>;
  handleResetUserPassword: (user: AdminUser) => Promise<void>;

  // Utility helpers
  formatMoney: (amount: number, currency?: string) => string;
  getRecordCountry: (item: { country?: string; location?: string; address?: string; stateOfOrigin?: string }) => 'Nigeria' | 'Rwanda' | 'USA';
  renderCountryBadge: (c: 'Nigeria' | 'Rwanda' | 'USA') => React.ReactNode;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoadingAdminUsers, setIsLoadingAdminUsers] = useState<boolean>(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState<boolean>(false);
  const [newUserData, setNewUserData] = useState<{
    email: string;
    fullName: string;
    password: string;
    role: AdminRole;
  }>({
    email: '',
    fullName: '',
    password: '',
    role: 'admin',
  });
  const [adminUserSearch, setAdminUserSearch] = useState<string>('');
  const [adminRoleFilter, setAdminRoleFilter] = useState<string>('all');
  const [savingUser, setSavingUser] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [blogTags, setBlogTags] = useState<BlogTag[]>([]);
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

  // Forms Controller States
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

  // Support Desk States
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
  const staffAudioCtxRef = useRef<AudioContext | null>(null);
  const prevUnreadRef = useRef<number>(0);

  // Partner Modal & Review State
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);
  const [isUpdatingPartner, setIsUpdatingPartner] = useState<boolean>(false);
  const [partnerStatusUpdate, setPartnerStatusUpdate] = useState<string>('new');
  const [partnerNotesUpdate, setPartnerNotesUpdate] = useState<string>('');

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

  const showNotification = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

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

  const fetchAdminUsers = async () => {
    try {
      setIsLoadingAdminUsers(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      }
    } catch (e) {
      console.warn('Failed to fetch admin users:', e);
    } finally {
      setIsLoadingAdminUsers(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setCurrentUser(null);
  };

  const navigateToTab = (tab: TabType) => {
    const route = TAB_TO_ROUTE[tab] || '/admin';
    router.push(route);
  };

  // Auth initialization
  useEffect(() => {
    const checkAuthAndInit = async () => {
      try {
        setAuthChecking(true);
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
            await loadAllData();
            if (data.user.role === 'super_admin') {
              fetchAdminUsers();
            }
            return;
          }
        }
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(AUTH_STORAGE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed && parsed.email && parsed.role) {
                setCurrentUser(parsed);
                await loadAllData();
                return;
              }
            } catch {}
          }
        }
        setCurrentUser(null);
      } catch (err) {
        console.warn('Authentication check failed:', err);
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuthAndInit();
  }, []);

  // Support Presence Heartbeat
  useEffect(() => {
    if (!currentUser || !canAccessTab(currentUser.role, 'support')) return;

    const sendHeartbeat = async () => {
      try {
        await fetch('/api/chat/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isOnline: supportStaffOnline, staffName: currentUser?.fullName || 'Foundation Support' }),
        });
      } catch (err) {
        console.warn('Presence heartbeat failed:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [supportStaffOnline, currentUser]);

  // Support Conversations polling
  useEffect(() => {
    if (!currentUser || !canAccessTab(currentUser.role, 'support')) return;

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
  }, [selectedConvId, audioPingEnabled, currentUser]);

  // Support Messages polling
  useEffect(() => {
    if (!currentUser || !canAccessTab(currentUser.role, 'support')) return;
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
  }, [selectedConvId, currentUser]);

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

  const handleUpdateVolunteerStatus = async (id: number, status: string) => {
    try {
      await api.updateVolunteerStatus(id, status);
      showNotification('success', `Status updated to ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to update volunteer status');
    }
  };

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

  const handleUpdateScholarshipStatus = async (id: number, status: string) => {
    try {
      await api.updateScholarshipStatus(id, status);
      showNotification('success', `Application status changed to ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to update application');
    }
  };

  const handleUpdateSkillStatus = async (id: number, status: string) => {
    try {
      await api.updateSkillStatus(id, status);
      showNotification('success', `Candidate status updated to ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification('error', 'Failed to update skill application');
    }
  };

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

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingUser(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin user');
      setAdminUsers((prev) => [...prev, data]);
      setIsAddUserModalOpen(false);
      setNewUserData({ email: '', fullName: '', password: '', role: 'admin' });
      showNotification('success', `Created staff account for ${data.fullName}`);
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSavingUser(false);
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: AdminRole) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');
      setAdminUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(data);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
      }
      setIsEditRoleModalOpen(false);
      setEditingUser(null);
      showNotification('success', `Updated role for ${data.fullName} to ${getRoleLabel(newRole)}`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    const newStatus = !user.isActive;
    if (!confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} account ${user.email}?`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user status');
      setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? data : u)));
      showNotification('success', `Account ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own account.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete staff account ${user.email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setAdminUsers((prev) => prev.filter((u) => u.id !== user.id));
      showNotification('success', 'Staff account deleted');
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleResetUserPassword = async (user: AdminUser) => {
    const newPass = prompt(`Enter new password for ${user.fullName} (${user.email}):`);
    if (!newPass) return;
    if (newPass.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      showNotification('success', `Password successfully reset for ${user.fullName}`);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const formatMoney = (amount: number, currency: string = 'NGN') => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

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

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authChecking,
        adminUsers,
        setAdminUsers,
        isLoadingAdminUsers,
        fetchAdminUsers,
        loading,
        refreshing,
        loadAllData,
        message,
        setMessage,
        showNotification,
        handleLogout,
        navigateToTab,

        stats,
        setStats,
        blogs,
        setBlogs,
        blogCategories,
        setBlogCategories,
        blogTags,
        setBlogTags,
        donations,
        setDonations,
        volunteers,
        setVolunteers,
        partners,
        setPartners,
        projects,
        setProjects,
        scholarships,
        setScholarships,
        skills,
        setSkills,
        accounts,
        setAccounts,
        transactions,
        setTransactions,
        finSummary,
        setFinSummary,
        galleryMedia,
        setGalleryMedia,
        popupSettings,
        setPopupSettings,

        supportStaffOnline,
        setSupportStaffOnline,
        supportConversations,
        setSupportConversations,
        selectedConvId,
        setSelectedConvId,
        supportMessages,
        setSupportMessages,
        staffReplyText,
        setStaffReplyText,
        sendingStaffReply,
        setSendingStaffReply,
        supportFilter,
        setSupportFilter,
        supportSearch,
        setSupportSearch,
        totalSupportUnread,
        setTotalSupportUnread,
        audioPingEnabled,
        setAudioPingEnabled,
        playStaffPing,
        handleSendStaffReply,
        handleUpdateConversationStatus,

        formVisibility,
        setFormVisibility,
        formStatuses,
        setFormStatuses,

        selectedPartner,
        setSelectedPartner,
        isUpdatingPartner,
        setIsUpdatingPartner,
        partnerStatusUpdate,
        setPartnerStatusUpdate,
        partnerNotesUpdate,
        setPartnerNotesUpdate,
        handleUpdatePartnerStatus,
        handleDeletePartner,

        gallerySearch,
        setGallerySearch,
        galleryCategoryFilter,
        setGalleryCategoryFilter,
        galleryYearFilter,
        setGalleryYearFilter,
        galleryRegionFilter,
        setGalleryRegionFilter,
        galleryViewMode,
        setGalleryViewMode,
        isMediaModalOpen,
        setIsMediaModalOpen,
        editingMedia,
        setEditingMedia,
        previewingMedia,
        setPreviewingMedia,
        uploadingGalleryImage,
        setUploadingGalleryImage,
        isSavingMedia,
        setIsSavingMedia,
        mediaFormData,
        setMediaFormData,
        handleSaveMedia,
        handleDeleteMedia,
        handleGalleryImageUpload,

        isBlogModalOpen,
        setIsBlogModalOpen,
        editingBlog,
        setEditingBlog,
        blogFormData,
        setBlogFormData,
        uploadingImage,
        setUploadingImage,
        handleImageUpload,
        handleSaveBlog,
        handleDeleteBlog,

        isCategoryModalOpen,
        setIsCategoryModalOpen,
        editingCategory,
        setEditingCategory,
        categoryFormData,
        setCategoryFormData,
        newTagName,
        setNewTagName,
        tagInput,
        setTagInput,
        handleSaveCategory,
        handleDeleteCategory,
        handleCreateTag,
        handleDeleteTag,

        isDonationModalOpen,
        setIsDonationModalOpen,
        donationFormData,
        setDonationFormData,
        handleSaveDonation,

        isVolunteerModalOpen,
        setIsVolunteerModalOpen,
        newVolunteer,
        setNewVolunteer,
        handleSaveVolunteer,
        handleUpdateVolunteerStatus,

        isProjectModalOpen,
        setIsProjectModalOpen,
        editingProject,
        setEditingProject,
        projectFormData,
        setProjectFormData,
        handleSaveProject,
        handleDeleteProject,

        handleUpdateScholarshipStatus,
        handleUpdateSkillStatus,

        isTxModalOpen,
        setIsTxModalOpen,
        txFormData,
        setTxFormData,
        handleSaveTransaction,

        isSavingPopup,
        setIsSavingPopup,
        isPreviewPopupOpen,
        setIsPreviewPopupOpen,
        previewProjectIndex,
        setPreviewProjectIndex,
        handleSavePopupSettings,

        isAddUserModalOpen,
        setIsAddUserModalOpen,
        editingUser,
        setEditingUser,
        isEditRoleModalOpen,
        setIsEditRoleModalOpen,
        newUserData,
        setNewUserData,
        savingUser,
        setSavingUser,
        adminUserSearch,
        setAdminUserSearch,
        adminRoleFilter,
        setAdminRoleFilter,
        handleCreateAdminUser,
        handleUpdateUserRole,
        handleToggleUserStatus,
        handleDeleteUser,
        handleResetUserPassword,

        formatMoney,
        getRecordCountry,
        renderCountryBadge,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
