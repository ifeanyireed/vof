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

export interface PartnerItem {
  id?: number;
  organizationName: string;
  partnerType: string;
  contactPerson: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  website?: string;
  partnershipInterest?: string;
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

  // Partners Management
  async getPartners(status?: string, country?: string, type?: string): Promise<PartnerItem[]> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (country && country !== 'All') params.append('country', country);
      if (type && type !== 'All') params.append('type', type);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiFetch<PartnerItem[]>(`/partners${query}`);
    } catch {
      const local = this.getLocalItems<PartnerItem>('vof_local_partners');
      const seedPartners: PartnerItem[] = [
        {
          id: 1,
          organizationName: "Saint Paul's Secondary School",
          partnerType: "School",
          contactPerson: "Principal Fr. Augustine",
          email: "contact@saintpaulsnvosi.edu.ng",
          phone: "+234 803 555 1201",
          country: "Nigeria",
          city: "Isiala Ngwa South, Abia",
          website: "https://saintpaulsnvosi.edu.ng",
          partnershipInterest: "Secondary School Scholarships",
          message: "Strategic partnership placing 10 vulnerable students on full academic sponsorship from SS1 through SS3.",
          status: "active",
          notes: "Official Educational Partner. Termly academic reports submitted.",
          createdAt: "2026-06-15T09:00:00Z"
        },
        {
          id: 2,
          organizationName: "Evette Institute of Catering & Fashion Design",
          partnerType: "School",
          contactPerson: "Mrs. Evelyn Nwachukwu",
          email: "info@evetteinstitute.org",
          phone: "+234 802 443 9081",
          country: "Nigeria",
          city: "Umuguma, Owerri",
          website: "https://evetteinstitute.org",
          partnershipInterest: "Vocational Training & Apprenticeships",
          message: "Partnering to deliver 1-year professional fashion design and catering apprenticeships for vulnerable young women.",
          status: "active",
          notes: "Vocational Skills Training Hub. Cohort 2026 ongoing.",
          createdAt: "2026-06-20T11:30:00Z"
        },
        {
          id: 3,
          organizationName: "Cloveebiz Limited",
          partnerType: "Corporate",
          contactPerson: "Engr. Elvis Onyeneke",
          email: "contact@cloveebiz.com",
          phone: "+234 809 112 3456",
          country: "Nigeria",
          city: "Lagos / International",
          website: "https://cloveebiz.com",
          partnershipInterest: "Technology & Cybersecurity Support",
          message: "Enterprise IT architecture, cybersecurity systems, and equipment for youth digital learning.",
          status: "active",
          notes: "Technology Infrastructure Partner. Annual hardware endowment renewed.",
          createdAt: "2026-07-02T14:15:00Z"
        },
        {
          id: 4,
          organizationName: "All Saints Catholic Academy",
          partnerType: "School",
          contactPerson: "Academic Dean",
          email: "info@allsaintsalbany.org",
          phone: "+1 (518) 438-0066",
          country: "USA",
          city: "Albany, NY",
          website: "https://allsaintsalbany.org",
          partnershipInterest: "Educational & Cultural Exchange",
          message: "Cross-border educational support, scholastic book drives, and academic collaboration.",
          status: "active",
          notes: "USA Educational Ally.",
          createdAt: "2026-07-10T16:00:00Z"
        },
        {
          id: 5,
          organizationName: "Kigali Youth Empowerment Initiative",
          partnerType: "NGO",
          contactPerson: "Shekinah Umuringa",
          email: "partnerships.rw@vonf.org",
          phone: "+250 789 066 186",
          country: "Rwanda",
          city: "Kigali",
          website: "https://rwanda.vonf.org",
          partnershipInterest: "Maternal Care & Youth Outreach",
          message: "Field coordinator for educational aid distribution and young mothers support across Kigali.",
          status: "active",
          notes: "In-country partner for VOF Rwanda operations.",
          createdAt: "2026-08-01T10:00:00Z"
        }
      ];
      let combined = [...local, ...seedPartners];
      if (status && status !== 'All') combined = combined.filter(p => p.status === status);
      if (country && country !== 'All') combined = combined.filter(p => p.country === country);
      if (type && type !== 'All') combined = combined.filter(p => p.partnerType === type);
      return combined;
    }
  },
  async createPartner(data: Omit<PartnerItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartnerItem> {
    try {
      return await apiFetch<PartnerItem>('/partners', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const fallbackItem: PartnerItem = {
        ...data,
        id: Date.now(),
        status: data.status || 'new',
        createdAt: new Date().toISOString(),
      };
      return this.saveLocalItem('vof_local_partners', fallbackItem);
    }
  },
  async updatePartnerStatus(id: number, status: string, notes?: string): Promise<any> {
    try {
      return await apiFetch(`/partners/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      const local = this.getLocalItems<PartnerItem>('vof_local_partners');
      const updated = local.map((k) => (k.id === id ? { ...k, status: status as any, notes: notes || k.notes } : k));
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_partners', JSON.stringify(updated));
      return { success: true, id, status };
    }
  },
  async deletePartner(id: number): Promise<any> {
    try {
      return await apiFetch(`/partners/${id}`, { method: 'DELETE' });
    } catch {
      const local = this.getLocalItems<PartnerItem>('vof_local_partners');
      const updated = local.filter((k) => k.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_partners', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Gallery Media Management
  async getGalleryMedia(category?: string, year?: string, region?: string, search?: string): Promise<GalleryMediaItem[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (year && year !== 'All') params.append('year', year);
      if (region && region !== 'All') params.append('region', region);
      if (search) params.append('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await apiFetch<GalleryMediaItem[]>(`/gallery${query}`);
    } catch {
      const local = this.getLocalItems<GalleryMediaItem>('vof_local_gallery_media');
      const seedMedia: GalleryMediaItem[] = [
        {
          id: 1,
          title: "Garment Construction Masterclass",
          category: "Vocational Skills",
          mediaUrl: "/IMG01.jpeg",
          mediaType: "image",
          caption: "Students engaged in modern garment construction and tailoring at VOIE Center.",
          eventDate: "2024-08-15",
          year: 2024,
          region: "Nigeria",
          location: "VOIE Center, Owerri, Imo State",
          albumTitle: "VOIE Vocational Trades & Fashion Cohort",
          featured: true,
          status: "published",
          createdAt: "2024-08-15T10:00:00Z"
        },
        {
          id: 2,
          title: "Precision Fabric Measuring & Pattern Drafting",
          category: "Vocational Skills",
          mediaUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
          mediaType: "image",
          caption: "Measuring and drafting precision tailoring patterns on durable fabrics.",
          eventDate: "2024-08-10",
          year: 2024,
          region: "Nigeria",
          location: "VOIE Center, Owerri, Imo State",
          albumTitle: "VOIE Vocational Trades & Fashion Cohort",
          featured: false,
          status: "published",
          createdAt: "2024-08-10T12:00:00Z"
        },
        {
          id: 3,
          title: "Sewing Starter Packs Presentation",
          category: "Vocational Skills",
          mediaUrl: "/IMG05.jpeg",
          mediaType: "image",
          caption: "Graduation ceremony and presentation of sewing starter kits to certified alumni.",
          eventDate: "2024-09-02",
          year: 2024,
          region: "Nigeria",
          location: "VOIE Center, Owerri, Imo State",
          albumTitle: "VOIE Vocational Trades & Fashion Cohort",
          featured: true,
          status: "published",
          createdAt: "2024-09-02T14:30:00Z"
        },
        {
          id: 4,
          title: "Prenatal Wellness & Maternal Dignity Outreach",
          category: "Maternal Dignity",
          mediaUrl: "/IMG03.jpeg",
          mediaType: "image",
          caption: "Prenatal health guidance and distribution of maternal dignity care packages.",
          eventDate: "2024-06-18",
          year: 2024,
          region: "Nigeria",
          location: "Owerri & Surrounding Communities",
          albumTitle: "Vulnerable Young Mothers Care Outreach",
          featured: true,
          status: "published",
          createdAt: "2024-06-18T09:00:00Z"
        },
        {
          id: 5,
          title: "Mother & Child Nutritional Counseling",
          category: "Maternal Dignity",
          mediaUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1200&q=80",
          mediaType: "image",
          caption: "Compassionate counseling and mother-child nutritional wellness orientation.",
          eventDate: "2024-06-20",
          year: 2024,
          region: "Nigeria",
          location: "Owerri, Imo State",
          albumTitle: "Vulnerable Young Mothers Care Outreach",
          featured: false,
          status: "published",
          createdAt: "2024-06-20T11:00:00Z"
        },
        {
          id: 6,
          title: "Secondary School Sponsorship Cohort",
          category: "Academic Scholarships",
          mediaUrl: "/IMG04.jpeg",
          mediaType: "image",
          caption: "Full tuition, uniforms, and textbooks awarded to 10 vulnerable students at Saint Paul's Secondary School.",
          eventDate: "2024-01-22",
          year: 2024,
          region: "Nigeria",
          location: "Saint Paul's Secondary School, Abia State",
          albumTitle: "The Academic Triad Scholarship Awards",
          featured: true,
          status: "published",
          createdAt: "2024-01-22T08:30:00Z"
        },
        {
          id: 7,
          title: "JAMB National Exam Coaching & Registration",
          category: "Academic Scholarships",
          mediaUrl: "/stats.jpeg",
          mediaType: "image",
          caption: "Free JAMB registration and intensive computer-based test orientation for underprivileged youths.",
          eventDate: "2024-02-14",
          year: 2024,
          region: "Nigeria",
          location: "Owerri CBT Center, Imo State",
          albumTitle: "The Academic Triad Scholarship Awards",
          featured: false,
          status: "published",
          createdAt: "2024-02-14T10:15:00Z"
        },
        {
          id: 8,
          title: "Kigali Community Primary School Support",
          category: "Rwanda Mission",
          mediaUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
          mediaType: "image",
          caption: "Handing over scholastic materials, notebooks, and learning packages in Kigali schools.",
          eventDate: "2024-04-12",
          year: 2024,
          region: "Rwanda",
          location: "Kigali, Rwanda",
          albumTitle: "VOF Rwanda School & Community Mission",
          featured: true,
          status: "published",
          createdAt: "2024-04-12T13:00:00Z"
        },
        {
          id: 9,
          title: "Rural Food & Welfare Package Distribution",
          category: "Community Relief",
          mediaUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
          mediaType: "image",
          caption: "Providing food staples, vegetable oil, and essential supplies to elderly women and struggling families.",
          eventDate: "2023-12-18",
          year: 2023,
          region: "Nigeria",
          location: "Rural Imo & Abia Communities",
          albumTitle: "Rural Family Relief & Nutrition Drive",
          featured: true,
          status: "published",
          createdAt: "2023-12-18T15:00:00Z"
        }
      ];
      let combined = [...local, ...seedMedia];
      if (category && category !== 'All') combined = combined.filter((m) => m.category === category);
      if (year && year !== 'All') combined = combined.filter((m) => m.year.toString() === year);
      if (region && region !== 'All') combined = combined.filter((m) => m.region === region || m.region === 'Global');
      if (search) {
        const s = search.toLowerCase();
        combined = combined.filter((m) => 
          m.title.toLowerCase().includes(s) || 
          (m.caption && m.caption.toLowerCase().includes(s)) ||
          (m.location && m.location.toLowerCase().includes(s))
        );
      }
      return combined;
    }
  },
  async createGalleryMedia(data: Omit<GalleryMediaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryMediaItem> {
    try {
      return await apiFetch<GalleryMediaItem>('/gallery', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const fallbackItem: GalleryMediaItem = {
        ...data,
        id: Date.now(),
        status: data.status || 'published',
        createdAt: new Date().toISOString(),
      };
      return this.saveLocalItem('vof_local_gallery_media', fallbackItem);
    }
  },
  async updateGalleryMedia(id: number, data: Partial<GalleryMediaItem>): Promise<GalleryMediaItem> {
    try {
      return await apiFetch<GalleryMediaItem>(`/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const local = this.getLocalItems<GalleryMediaItem>('vof_local_gallery_media');
      const updated = local.map((m) => (m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m));
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_gallery_media', JSON.stringify(updated));
      const found = updated.find((m) => m.id === id);
      return found || (data as GalleryMediaItem);
    }
  },
  async deleteGalleryMedia(id: number): Promise<any> {
    try {
      return await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
    } catch {
      const local = this.getLocalItems<GalleryMediaItem>('vof_local_gallery_media');
      const updated = local.filter((m) => m.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem('vof_local_gallery_media', JSON.stringify(updated));
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
