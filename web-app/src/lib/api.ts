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

export interface BlogItem {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
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
  email: string;
  phone: string;
  country?: string;
  gender?: string;
  address?: string;
  tradeSelected: string;
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
  async getBlogs(status?: string): Promise<BlogItem[]> {
    const query = status ? `?status=${status}` : '';
    return apiFetch<BlogItem[]>(`/blogs${query}`);
  },
  async createBlog(data: Partial<BlogItem>): Promise<BlogItem> {
    return apiFetch<BlogItem>('/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async updateBlog(id: number, data: Partial<BlogItem>): Promise<any> {
    return apiFetch(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async deleteBlog(id: number): Promise<any> {
    return apiFetch(`/blogs/${id}`, { method: 'DELETE' });
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

  // Local Storage Helpers for Offline / Demo Resilience
  getLocalItems<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveLocalItem<T extends { id?: number }>(key: string, item: T): T {
    if (typeof window === 'undefined') return item;
    try {
      const items = this.getLocalItems<T>(key);
      const updated = [item, ...items.filter((i) => i.id !== item.id)];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    return item;
  },

  // Volunteers
  async getVolunteers(status?: string, interest?: string): Promise<VolunteerItem[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (interest) params.append('interest', interest);
    const query = params.toString() ? `?${params.toString()}` : '';
    let remote: VolunteerItem[] = [];
    try {
      remote = await apiFetch<VolunteerItem[]>(`/volunteers${query}`);
    } catch (err) {
      console.warn('Could not fetch remote volunteers, using local fallback:', err);
    }
    const local = this.getLocalItems<VolunteerItem>('vof_local_volunteers');
    const existingIds = new Set(remote.map((r) => r.id));
    const merged = [...local.filter((l) => !existingIds.has(l.id)), ...remote];
    return merged;
  },
  async createVolunteer(data: Partial<VolunteerItem>): Promise<VolunteerItem> {
    try {
      const created = await apiFetch<VolunteerItem>('/volunteers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return this.saveLocalItem('vof_local_volunteers', created);
    } catch (err) {
      console.warn('Remote volunteer creation failed, caching locally:', err);
      const fallbackItem: VolunteerItem = {
        id: Date.now(),
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        country: data.country || 'Nigeria',
        location: data.location || 'Nigeria',
        interestArea: data.interestArea || 'General Volunteer',
        availability: data.availability || 'Weekends',
        skillsExperience: data.skillsExperience || '',
        resumeUrl: data.resumeUrl || '',
        status: (data.status as any) || 'new',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      return this.saveLocalItem('vof_local_volunteers', fallbackItem);
    }
  },
  async updateVolunteerStatus(id: number, status: string, notes?: string): Promise<any> {
    try {
      return await apiFetch(`/volunteers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      // update local
      const local = this.getLocalItems<VolunteerItem>('vof_local_volunteers');
      const updated = local.map((v) => (v.id === id ? { ...v, status: status as any, notes: notes || v.notes } : v));
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_volunteers', JSON.stringify(updated));
      return { success: true, id, status };
    }
  },
  async deleteVolunteer(id: number): Promise<any> {
    try {
      return await apiFetch(`/volunteers/${id}`, { method: 'DELETE' });
    } catch {
      const local = this.getLocalItems<VolunteerItem>('vof_local_volunteers');
      const updated = local.filter((v) => v.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_volunteers', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Charity Projects
  async getProjects(status?: string): Promise<CharityProjectItem[]> {
    const query = status ? `?status=${status}` : '';
    return apiFetch<CharityProjectItem[]>(`/projects${query}`);
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
    let remote: ScholarshipItem[] = [];
    try {
      remote = await apiFetch<ScholarshipItem[]>(`/applications/scholarships${query}`);
    } catch (err) {
      console.warn('Could not fetch remote scholarships, using local fallback:', err);
    }
    const local = this.getLocalItems<ScholarshipItem>('vof_local_scholarships');
    const existingIds = new Set(remote.map((r) => r.id));
    const merged = [...local.filter((l) => !existingIds.has(l.id)), ...remote];
    return merged;
  },
  async createScholarship(data: Partial<ScholarshipItem>): Promise<ScholarshipItem> {
    try {
      const created = await apiFetch<ScholarshipItem>('/applications/scholarships', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return this.saveLocalItem('vof_local_scholarships', created);
    } catch (err) {
      console.warn('Remote scholarship creation failed, caching locally:', err);
      const fallbackItem: ScholarshipItem = {
        id: Date.now(),
        applicantName: data.applicantName || '',
        email: data.email || '',
        phone: data.phone || '',
        country: data.country || 'Nigeria',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'Not specified',
        stateOfOrigin: data.stateOfOrigin || '',
        lga: data.lga || '',
        institutionName: data.institutionName || '',
        courseOfStudy: data.courseOfStudy || '',
        currentLevel: data.currentLevel || '',
        cgpa: data.cgpa || '',
        amountRequested: Number(data.amountRequested) || 0,
        reasonForAid: data.reasonForAid || '',
        documentUrl: data.documentUrl || '',
        status: (data.status as any) || 'pending',
        reviewerNotes: data.reviewerNotes || '',
        createdAt: new Date().toISOString(),
      };
      return this.saveLocalItem('vof_local_scholarships', fallbackItem);
    }
  },
  async updateScholarshipStatus(id: number, status: string, reviewerNotes?: string): Promise<any> {
    try {
      return await apiFetch(`/applications/scholarships/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reviewerNotes }),
      });
    } catch {
      const local = this.getLocalItems<ScholarshipItem>('vof_local_scholarships');
      const updated = local.map((s) => (s.id === id ? { ...s, status: status as any, reviewerNotes: reviewerNotes || s.reviewerNotes } : s));
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_scholarships', JSON.stringify(updated));
      return { success: true, id, status };
    }
  },

  // Applications - Skills
  async getSkills(status?: string, trade?: string): Promise<SkillAppItem[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (trade) params.append('trade', trade);
    const query = params.toString() ? `?${params.toString()}` : '';
    let remote: SkillAppItem[] = [];
    try {
      remote = await apiFetch<SkillAppItem[]>(`/applications/skills${query}`);
    } catch (err) {
      console.warn('Could not fetch remote skills, using local fallback:', err);
    }
    const local = this.getLocalItems<SkillAppItem>('vof_local_skills');
    const existingIds = new Set(remote.map((r) => r.id));
    const merged = [...local.filter((l) => !existingIds.has(l.id)), ...remote];
    return merged;
  },
  async createSkill(data: Partial<SkillAppItem>): Promise<SkillAppItem> {
    try {
      const created = await apiFetch<SkillAppItem>('/applications/skills', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return this.saveLocalItem('vof_local_skills', created);
    } catch (err) {
      console.warn('Remote skill creation failed, caching locally:', err);
      const fallbackItem: SkillAppItem = {
        id: Date.now(),
        applicantName: data.applicantName || '',
        email: data.email || '',
        phone: data.phone || '',
        country: data.country || 'Nigeria',
        gender: data.gender || '',
        address: data.address || '',
        tradeSelected: data.tradeSelected || '',
        educationLevel: data.educationLevel || '',
        employmentStatus: data.employmentStatus || '',
        statementOfPurpose: data.statementOfPurpose || '',
        documentUrl: data.documentUrl || '',
        status: (data.status as any) || 'pending',
        intakeBatch: data.intakeBatch || 'Batch 2026-A',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      return this.saveLocalItem('vof_local_skills', fallbackItem);
    }
  },
  async updateSkillStatus(id: number, status: string, notes?: string): Promise<any> {
    try {
      return await apiFetch(`/applications/skills/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      const local = this.getLocalItems<SkillAppItem>('vof_local_skills');
      const updated = local.map((k) => (k.id === id ? { ...k, status: status as any, notes: notes || k.notes } : k));
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_skills', JSON.stringify(updated));
      return { success: true, id, status };
    }
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

  // Resilient File Upload (Cloudinary + Data URL Fallback)
  async uploadFile(file: File, folder: string = 'vof_uploads'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (err) {
      console.warn('Server upload unavailable, converting to local data URI:', err);
    }

    // Fallback: Read as Data URL so preview & links always work
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
