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
  location: string;
  interestArea: string;
  availability: string;
  skillsExperience: string;
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
  gender?: string;
  address?: string;
  tradeSelected: string;
  educationLevel?: string;
  employmentStatus?: string;
  statementOfPurpose?: string;
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

  // Volunteers
  async getVolunteers(status?: string, interest?: string): Promise<VolunteerItem[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (interest) params.append('interest', interest);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<VolunteerItem[]>(`/volunteers${query}`);
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
    return apiFetch<ScholarshipItem[]>(`/applications/scholarships${query}`);
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
    return apiFetch<SkillAppItem[]>(`/applications/skills${query}`);
  },
  async createSkill(data: Partial<SkillAppItem>): Promise<SkillAppItem> {
    return apiFetch<SkillAppItem>('/applications/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
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

  // Cloudinary Upload
  async uploadFile(file: File, folder: string = 'vof_uploads'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Upload failed: ${await res.text()}`);
    }
    const data = await res.json();
    return data.url;
  },
};
