const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vof-gamma.vercel.app/api';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`;

export interface DashboardStats {
  totalFundsRaisedNGN: number;
  totalFundsRaisedUSD: number;
  totalDonationsCount: number;
  activeProjectsCount: number;
  totalVolunteersCount: number;
  pendingScholarships: number;
  pendingSkillApps: number;
  publishedBlogsCount: number;
  totalAccountBalanceNGN: number;
  totalAccountBalanceUSD: number;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount?: number;
  createdAt?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
  createdAt?: string;
}

export interface BlogItem {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId?: number;
  tags?: string[];
  region: string;
  imageUrl: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  dateDisplay: string;
  day?: string;
  month?: string;
  likes: number;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface DonationItem {
  id?: number;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  campaign: string;
  paymentMethod: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
  anonymous: boolean;
  notes?: string;
  donatedAt: string;
}

export interface VolunteerItem {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  location: string;
  interestArea: string;
  availability: string;
  skillsExperience: string;
  resumeUrl?: string;
  status: 'new' | 'contacted' | 'approved' | 'active' | 'inactive';
  notes?: string;
  createdAt?: string;
}

export interface PartnerItem {
  id?: number;
  organizationName: string;
  partnerType: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  website?: string;
  partnershipInterest?: string;
  focusArea?: string;
  message?: string;
  status: 'new' | 'under_review' | 'contacted' | 'active' | 'declined';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryMediaItem {
  id?: number;
  title: string;
  category: string; // 'Vocational Skills' | 'Maternal Dignity' | 'Academic Scholarships' | 'Rwanda Mission' | 'Community Relief' | 'Annual Milestones'
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  caption?: string;
  eventDate: string; // e.g. "2024-08-15" or "August 2024"
  year: number;
  region: 'Global' | 'Nigeria' | 'Rwanda' | 'USA';
  location?: string;
  albumTitle?: string;
  featured?: boolean;
  orderIndex?: number;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface CharityProjectItem {
  id?: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  location: string;
  beneficiariesCount: number;
  imageUrl: string;
  status: 'active' | 'completed' | 'upcoming' | 'paused';
  startDate?: string;
  endDate?: string;
}

export interface ScholarshipItem {
  id?: number;
  applicantName: string;
  fullName?: string;
  scholarshipType?: string;
  email: string;
  phone: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  stateOfOrigin?: string;
  lga?: string;
  institutionName: string;
  courseOfStudy: string;
  currentLevel: string;
  cgpa: string;
  amountRequested: number;
  reasonForAid: string;
  documentUrl?: string;
  status: 'pending' | 'under_review' | 'approved' | 'disbursed' | 'rejected';
  reviewerNotes?: string;
  createdAt?: string;
}

export interface SkillAppItem {
  id?: number;
  applicantName: string;
  fullName?: string;
  email: string;
  phone: string;
  country?: string;
  gender?: string;
  address?: string;
  tradeSelected: string;
  chosenProgram?: string;
  centerLocation?: string;
  educationLevel?: string;
  employmentStatus?: string;
  statementOfPurpose?: string;
  documentUrl?: string;
  status: 'pending' | 'interview_scheduled' | 'enrolled' | 'graduated' | 'rejected';
  intakeBatch?: string;
  notes?: string;
  createdAt?: string;
}

export interface FinancialAccountItem {
  id?: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  balance: number;
  type: string;
  status: string;
}

export interface FinancialTxItem {
  id?: number;
  accountId?: number;
  accountName?: string;
  transactionType: 'inflow' | 'outflow';
  category: string;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  relatedProjectId?: number;
  transactionDate: string;
  receiptUrl?: string;
}

export interface FinancialSummary {
  totalNGNBalance: number;
  totalUSDBalance: number;
  totalNGNInflow: number;
  totalNGNOutflow: number;
  totalUSDInflow: number;
  totalUSDOutflow: number;
}

export interface PopupSettings {
  id?: number;
  isEnabled: boolean;
  delaySeconds: number;
  headline: string;
  subheadline: string;
  ctaText: string;
  showOnMobile: boolean;
  selectedProjectIds?: number[];
  projects?: CharityProjectItem[];
  updatedAt?: string;
}

export interface FormSettingItem {
  id: number;
  formKey: string;
  formName: string;
  isVisible: boolean;
  intakeStatus: 'open' | 'paused';
  pauseNoticeTitle?: string;
  pauseNoticeMessage?: string;
  updatedBy?: number;
  updatedAt?: string;
}

// Safe fetch wrapper with timeout
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${await res.text()}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Overview
  async getDashboardOverview(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>('/dashboard/overview');
  },

  // Blogs
  async getBlogs(filters?: { status?: string; category?: string; tag?: string; search?: string } | string): Promise<BlogItem[]> {
    const params = new URLSearchParams();
    if (typeof filters === 'string') {
      if (filters) params.append('status', filters);
    } else if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.search) params.append('search', filters.search);
    }
    const query = params.toString() ? `?${params.toString()}` : '';

    try {
      return await apiFetch<BlogItem[]>(`/blogs${query}`);
    } catch {
      try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXTAUTH_URL || 'http://localhost:3000') : '';
        const res = await fetch(`${baseUrl}/api/blogs${query}`, { cache: 'no-store' });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Fallback to /api/blogs failed:', err);
      }
      return [];
    }
  },
  async getBlogBySlug(idOrSlug: string): Promise<BlogItem> {
    try {
      return await apiFetch<BlogItem>(`/blogs/${encodeURIComponent(idOrSlug)}`);
    } catch {
      try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXTAUTH_URL || 'http://localhost:3000') : '';
        const res = await fetch(`${baseUrl}/api/blogs/${encodeURIComponent(idOrSlug)}`, { cache: 'no-store' });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(`Fallback to /api/blogs/${idOrSlug} failed:`, err);
      }
      throw new Error(`Blog post not found: ${idOrSlug}`);
    }
  },
  async createBlog(data: Partial<BlogItem>): Promise<BlogItem> {
    try {
      return await apiFetch<BlogItem>('/blogs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    }
  },
  async updateBlog(id: number, data: Partial<BlogItem>): Promise<any> {
    try {
      return await apiFetch(`/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    }
  },
  async deleteBlog(id: number): Promise<any> {
    try {
      return await apiFetch(`/blogs/${id}`, { method: 'DELETE' });
    } catch {
      return await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    }
  },
  async likeBlog(id: number): Promise<{ success: boolean; likes: number }> {
    return apiFetch<{ success: boolean; likes: number }>(`/blogs/${id}/like`, { method: 'POST' });
  },

  // Blog Categories
  async getBlogCategories(): Promise<BlogCategory[]> {
    try {
      return await apiFetch<BlogCategory[]>('/blogs/categories');
    } catch {
      try {
        const res = await fetch('/api/blogs/categories', { cache: 'no-store' });
        if (res.ok) return await res.json();
      } catch {}
      return [];
    }
  },
  async createBlogCategory(data: Partial<BlogCategory>): Promise<BlogCategory> {
    try {
      return await apiFetch<BlogCategory>('/blogs/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const res = await fetch('/api/blogs/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    }
  },
  async updateBlogCategory(id: number, data: Partial<BlogCategory>): Promise<BlogCategory> {
    try {
      return await apiFetch<BlogCategory>(`/blogs/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const res = await fetch('/api/blogs/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      return await res.json();
    }
  },
  async deleteBlogCategory(id: number): Promise<any> {
    try {
      return await apiFetch(`/blogs/categories/${id}`, { method: 'DELETE' });
    } catch {
      return await fetch(`/api/blogs/categories?id=${id}`, { method: 'DELETE' });
    }
  },

  // Blog Tags
  async getBlogTags(): Promise<BlogTag[]> {
    try {
      return await apiFetch<BlogTag[]>('/blogs/tags');
    } catch {
      try {
        const res = await fetch('/api/blogs/tags', { cache: 'no-store' });
        if (res.ok) return await res.json();
      } catch {}
      return [];
    }
  },
  async createBlogTag(data: { name: string; slug?: string }): Promise<BlogTag> {
    try {
      return await apiFetch<BlogTag>('/blogs/tags', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const res = await fetch('/api/blogs/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    }
  },
  async deleteBlogTag(id: number): Promise<any> {
    try {
      return await apiFetch(`/blogs/tags/${id}`, { method: 'DELETE' });
    } catch {
      return await fetch(`/api/blogs/tags?id=${id}`, { method: 'DELETE' });
    }
  },

  // Donations
  async getDonations(currency?: string, campaign?: string): Promise<DonationItem[]> {
    const params = new URLSearchParams();
    if (currency) params.append('currency', currency);
    if (campaign) params.append('campaign', campaign);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<DonationItem[]>(`/donations${query}`);
  },
  async createDonation(data: Partial<DonationItem>): Promise<DonationItem> {
    return apiFetch<DonationItem>('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async deleteDonation(id: number): Promise<any> {
    return apiFetch(`/donations/${id}`, { method: 'DELETE' });
  },
  async getDonationStats(): Promise<any> {
    return apiFetch('/donations/stats');
  },

  // Volunteers
  async getVolunteers(status?: string, interest?: string): Promise<VolunteerItem[]> {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (interest && interest !== 'All') params.append('interest', interest);
    const query = params.toString() ? `?${params.toString()}` : '';
    try {
      return await apiFetch<VolunteerItem[]>(`/volunteers${query}`);
    } catch (err) {
      console.warn('Could not fetch remote volunteers:', err);
      return [];
    }
  },
  async createVolunteer(data: Partial<VolunteerItem>): Promise<VolunteerItem> {
    return apiFetch<VolunteerItem>('/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateVolunteerStatus(id: number, status: string, notes?: string): Promise<any> {
    return apiFetch(`/volunteers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },
  async deleteVolunteer(id: number): Promise<any> {
    return apiFetch(`/volunteers/${id}`, { method: 'DELETE' });
  },

  // Partners Management
  async getPartners(status?: string, country?: string, type?: string): Promise<PartnerItem[]> {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (country && country !== 'All') params.append('country', country);
    if (type && type !== 'All') params.append('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    try {
      return await apiFetch<PartnerItem[]>(`/partners${query}`);
    } catch (err) {
      console.warn('Could not fetch remote partners:', err);
      return [];
    }
  },
  async createPartner(data: Omit<PartnerItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartnerItem> {
    return apiFetch<PartnerItem>('/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updatePartnerStatus(id: number, status: string, notes?: string): Promise<any> {
    return apiFetch(`/partners/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },
  async deletePartner(id: number): Promise<any> {
    return apiFetch(`/partners/${id}`, { method: 'DELETE' });
  },

  // Gallery Media Management
  async getGalleryMedia(category?: string, year?: string, region?: string, search?: string): Promise<GalleryMediaItem[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (year && year !== 'All') params.append('year', year);
    if (region && region !== 'All') params.append('region', region);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    try {
      return await apiFetch<GalleryMediaItem[]>(`/gallery${query}`);
    } catch (err) {
      console.warn('Could not fetch remote gallery media:', err);
      return [];
    }
  },
  async createGalleryMedia(data: Omit<GalleryMediaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryMediaItem> {
    return apiFetch<GalleryMediaItem>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateGalleryMedia(id: number, data: Partial<GalleryMediaItem>): Promise<GalleryMediaItem> {
    return apiFetch<GalleryMediaItem>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteGalleryMedia(id: number): Promise<any> {
    return apiFetch(`/gallery/${id}`, { method: 'DELETE' });
  },

  // Charity Projects
  async getProjects(status?: string): Promise<CharityProjectItem[]> {
    const query = status ? `?status=${status}` : '';
    try {
      return await apiFetch<CharityProjectItem[]>(`/projects${query}`);
    } catch (err) {
      console.warn('Could not fetch remote projects:', err);
      return [];
    }
  },
  async createProject(data: Partial<CharityProjectItem>): Promise<CharityProjectItem> {
    return apiFetch<CharityProjectItem>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateProject(id: number, data: Partial<CharityProjectItem>): Promise<any> {
    return apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteProject(id: number): Promise<any> {
    return apiFetch(`/projects/${id}`, { method: 'DELETE' });
  },

  // Applications - Scholarships
  async getScholarships(status?: string): Promise<ScholarshipItem[]> {
    const query = status ? `?status=${status}` : '';
    try {
      return await apiFetch<ScholarshipItem[]>(`/applications/scholarships${query}`);
    } catch (err) {
      console.warn('Could not fetch remote scholarships:', err);
      return [];
    }
  },
  async createScholarship(data: Partial<ScholarshipItem>): Promise<ScholarshipItem> {
    return apiFetch<ScholarshipItem>('/applications/scholarships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateScholarshipStatus(id: number, status: string, reviewerNotes?: string): Promise<any> {
    return apiFetch(`/applications/scholarships/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewerNotes }),
    });
  },

  // Applications - Skills
  async getSkills(status?: string, trade?: string): Promise<SkillAppItem[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (trade) params.append('trade', trade);
    const query = params.toString() ? `?${params.toString()}` : '';
    try {
      return await apiFetch<SkillAppItem[]>(`/applications/skills${query}`);
    } catch (err) {
      console.warn('Could not fetch remote skills:', err);
      return [];
    }
  },
  async createSkill(data: Partial<SkillAppItem>): Promise<SkillAppItem> {
    return apiFetch<SkillAppItem>('/applications/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async createSkillApp(data: Partial<SkillAppItem>): Promise<SkillAppItem> {
    return this.createSkill(data);
  },
  async updateSkillStatus(id: number, status: string, notes?: string): Promise<any> {
    return apiFetch(`/applications/skills/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Financials
  async getAccounts(): Promise<FinancialAccountItem[]> {
    return apiFetch<FinancialAccountItem[]>('/financials/accounts');
  },
  async createAccount(data: Partial<FinancialAccountItem>): Promise<FinancialAccountItem> {
    return apiFetch<FinancialAccountItem>('/financials/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getTransactions(type?: string, accountId?: number): Promise<FinancialTxItem[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (accountId) params.append('accountId', accountId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<FinancialTxItem[]>(`/financials/transactions${query}`);
  },
  async createTransaction(data: Partial<FinancialTxItem>): Promise<FinancialTxItem> {
    return apiFetch<FinancialTxItem>('/financials/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getFinancialSummary(): Promise<FinancialSummary> {
    return apiFetch<FinancialSummary>('/financials/summary');
  },

  // Landing Donate Pop-up Settings
  async getPopupSettings(): Promise<PopupSettings> {
    try {
      return await apiFetch<PopupSettings>('/popup/settings');
    } catch {
      return {
        id: 1,
        isEnabled: true,
        delaySeconds: 5,
        headline: 'Active Campaign',
        subheadline: 'Support Ongoing Community Initiatives',
        ctaText: 'Donate Now',
        showOnMobile: true,
        selectedProjectIds: [],
        projects: [],
      };
    }
  },
  async updatePopupSettings(data: Partial<PopupSettings>): Promise<PopupSettings> {
    return apiFetch<PopupSettings>('/popup/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Forms Controller & Visibility Settings
  async getFormSettings(): Promise<FormSettingItem[]> {
    try {
      const res = await fetch('/api/forms/settings', { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch form settings from /api/forms/settings:', e);
    }
    return [
      { id: 1, formKey: 'skills', formName: 'VOIE Vocational Skills Acquisition', isVisible: true, intakeStatus: 'open' },
      { id: 2, formKey: 'scholarship', formName: 'Academic Scholarship Aid', isVisible: true, intakeStatus: 'open' },
      { id: 3, formKey: 'volunteer', formName: 'Volunteer Sign-up & Network', isVisible: true, intakeStatus: 'open' },
      { id: 4, formKey: 'partner', formName: 'Strategic Partner Inquiries', isVisible: true, intakeStatus: 'open' },
      { id: 5, formKey: 'donation', formName: 'Direct Giving & Bank Channels', isVisible: true, intakeStatus: 'open' },
    ];
  },

  async updateFormSetting(formKey: string, updates: Partial<FormSettingItem>): Promise<FormSettingItem> {
    const res = await fetch('/api/forms/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formKey, ...updates }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update form setting');
    return data.setting;
  },

  // Resilient File Upload (Cloudinary via Next.js proxy with direct fallback)
  async uploadFile(file: File, folder: string = 'vof_uploads'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // 1. Try local Next.js proxy route /api/upload
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (e) {
      console.warn('Next.js /api/upload proxy failed, trying direct API URL:', e);
    }

    // 2. Try direct API_URL/upload
    try {
      const directRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (directRes.ok) {
        const data = await directRes.json();
        if (data.url) return data.url;
      }
    } catch (err) {
      console.warn('Direct upload failed:', err);
    }

    // 3. Fallback: Read as Data URL so preview & links always work
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        // Fallback placeholder
        resolve(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    });
  },
};
