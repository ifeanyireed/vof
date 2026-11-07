'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  School,
  Search,
  Plus,
  Edit3,
  Trash2,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  Upload,
  AlertCircle,
  Filter,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api, BeneficiaryItem } from '@/lib/api';
import { useAdmin } from '../AdminContext';

const DEFAULT_CATEGORIES = ['Primary', 'Secondary', 'Tertiary', 'Skills', 'Vocational / Exam Aid', 'Other'] as const;

export default function BeneficiariesView() {
  const { setBeneficiaries: setGlobalBeneficiaries } = useAdmin();
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<BeneficiaryItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Partial<BeneficiaryItem>>({
    fullName: '',
    category: 'Secondary',
    institution: '',
    classLevel: '',
    yearAwarded: new Date().getFullYear().toString(),
    awardStatus: 'Active',
    bioStory: '',
    imageUrl: '',
    location: 'Imo State, Nigeria',
    gender: 'Female',
    featured: false,
    sortOrder: 0,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadBeneficiaries = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBeneficiaries();
      setBeneficiaries(data);
      if (setGlobalBeneficiaries) setGlobalBeneficiaries(data);
    } catch (err: any) {
      console.error('Failed to load beneficiaries:', err);
      showNotification('error', 'Failed to load beneficiaries: ' + (err.message || 'Server error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBeneficiary(null);
    setFormData({
      fullName: '',
      category: 'Secondary',
      institution: '',
      classLevel: '',
      yearAwarded: new Date().getFullYear().toString(),
      awardStatus: 'Active',
      bioStory: '',
      imageUrl: '',
      location: 'Imo State, Nigeria',
      gender: 'Female',
      featured: false,
      sortOrder: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: BeneficiaryItem) => {
    setEditingBeneficiary(b);
    setFormData({
      fullName: b.fullName,
      category: b.category,
      institution: b.institution,
      classLevel: b.classLevel,
      yearAwarded: b.yearAwarded,
      awardStatus: b.awardStatus,
      bioStory: b.bioStory || '',
      imageUrl: b.imageUrl || '',
      location: b.location || 'Imo State, Nigeria',
      gender: b.gender || 'Female',
      featured: b.featured || false,
      sortOrder: b.sortOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await api.uploadFile(file, 'scholarships');
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
        showNotification('success', 'Student portrait uploaded successfully');
      }
    } catch (err: any) {
      console.warn('api.uploadFile fallback to client reader:', err);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
          showNotification('success', 'Student portrait loaded successfully');
        };
        reader.readAsDataURL(file);
      } catch (clientErr: any) {
        showNotification('error', 'Upload error: ' + (clientErr.message || 'Please try another image'));
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim() || !formData.institution?.trim() || !formData.classLevel?.trim()) {
      showNotification('error', 'Please fill in student name, institution, and class level.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingBeneficiary?.id) {
        await api.updateBeneficiary(editingBeneficiary.id, formData);
        showNotification('success', `Updated beneficiary "${formData.fullName}"`);
      } else {
        await api.createBeneficiary(formData);
        showNotification('success', `Enrolled new beneficiary "${formData.fullName}"`);
      }
      setIsModalOpen(false);
      await loadBeneficiaries();
    } catch (err: any) {
      showNotification('error', 'Failed to save beneficiary: ' + (err.message || 'Server error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (b: BeneficiaryItem) => {
    if (!b.id) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${b.fullName}" from the scholarship beneficiaries record?`);
    if (!confirmed) return;

    try {
      await api.deleteBeneficiary(b.id);
      showNotification('success', `Removed "${b.fullName}" from scholarship beneficiaries`);
      setBeneficiaries((prev) => {
        const next = prev.filter((item) => item.id !== b.id);
        if (setGlobalBeneficiaries) setGlobalBeneficiaries(next);
        return next;
      });
    } catch (err: any) {
      showNotification('error', 'Failed to delete beneficiary: ' + err.message);
    }
  };

  const handleToggleFeatured = async (b: BeneficiaryItem) => {
    if (!b.id) return;
    try {
      const updated = !b.featured;
      await api.updateBeneficiary(b.id, { featured: updated });
      setBeneficiaries((prev) => {
        const next = prev.map((item) => (item.id === b.id ? { ...item, featured: updated } : item));
        if (setGlobalBeneficiaries) setGlobalBeneficiaries(next);
        return next;
      });
      showNotification('success', `Marked "${b.fullName}" as ${updated ? 'featured' : 'standard'}`);
    } catch (err: any) {
      showNotification('error', 'Failed to toggle featured flag');
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = beneficiaries.length;
    const primary = beneficiaries.filter((b) => b.category.toLowerCase().includes('primary')).length;
    const secondary = beneficiaries.filter((b) => b.category.toLowerCase().includes('secondary')).length;
    const tertiary = beneficiaries.filter((b) => b.category.toLowerCase().includes('tertiary')).length;
    const skills = beneficiaries.filter((b) => b.category.toLowerCase().includes('skill')).length;
    const active = beneficiaries.filter((b) => b.awardStatus.toLowerCase() === 'active' || b.awardStatus.toLowerCase() === 'ongoing').length;
    return { total, primary, secondary, tertiary, skills, active };
  }, [beneficiaries]);

  // Filtered List
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      const matchesSearch =
        searchQuery === '' ||
        b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.classLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.location && b.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'All' || b.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesStatus =
        statusFilter === 'All' || b.awardStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [beneficiaries, searchQuery, categoryFilter, statusFilter]);

  const getCategoryColor = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('primary')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (lower.includes('secondary')) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (lower.includes('tertiary')) return 'bg-purple-50 text-purple-800 border-purple-200';
    if (lower.includes('skill')) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-stone-50 text-stone-800 border-stone-200';
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2 text-xs font-bold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Scholars</span>
          <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{metrics.total}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">All verified cohorts</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Primary Education</span>
          <p className="font-serif text-2xl font-bold text-emerald-800 mt-1">{metrics.primary}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">Basic & uniform support</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Secondary Scholars</span>
          <p className="font-serif text-2xl font-bold text-blue-800 mt-1">{metrics.secondary}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">Tuition, WAEC & JAMB</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Tertiary / Uni</span>
          <p className="font-serif text-2xl font-bold text-purple-800 mt-1">{metrics.tertiary}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">Undergraduate grants</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Skills (VOIE)</span>
          <p className="font-serif text-2xl font-bold text-amber-800 mt-1">{metrics.skills}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">Trades & toolkits</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Active Grants</span>
          <p className="font-serif text-2xl font-bold text-teal-800 mt-1">{metrics.active}</p>
          <span className="text-[10px] text-gray-400 mt-0.5 block">Ongoing enrollments</span>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, school, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:bg-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-gray-200">
            {['All', 'Primary', 'Secondary', 'Tertiary', 'Skills'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-gray-200 rounded-xl bg-white text-gray-700 font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <a
            href="/beneficiaries"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition"
            title="View live public beneficiaries page"
          >
            <span>Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Beneficiary</span>
          </button>
        </div>
      </div>

      {/* Beneficiaries Content */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200">
          <div className="w-8 h-8 border-3 border-[#558b1a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-semibold">Loading scholarship beneficiaries roster...</p>
        </div>
      ) : filteredBeneficiaries.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
          <School className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="font-bold text-gray-800 text-sm">No beneficiaries match this filter</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting the category or status filter, or enroll a new student beneficiary into the foundation records.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-gray-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeneficiaries.map((b) => {
            const initials = b.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                        b.category
                      )}`}
                    >
                      {b.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {b.featured && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          b.awardStatus.toLowerCase() === 'active' || b.awardStatus.toLowerCase() === 'ongoing'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {b.awardStatus}
                      </span>
                    </div>
                  </div>

                  {/* Student Header */}
                  <div className="flex items-start gap-3">
                    {b.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                        <img
                          src={b.imageUrl}
                          alt={b.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1b3f0c] to-[#558b1a] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {initials}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{b.fullName}</h4>
                      <p className="text-xs text-[#558b1a] font-semibold truncate flex items-center gap-1 mt-0.5">
                        <School className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{b.institution}</span>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{b.classLevel}</p>
                    </div>
                  </div>

                  {/* Story excerpt */}
                  {b.bioStory && (
                    <p className="text-[11px] text-gray-600 mt-3 line-clamp-3 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-gray-100">
                      &ldquo;{b.bioStory}&rdquo;
                    </p>
                  )}

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>Year: <strong>{b.yearAwarded}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{b.location || 'Nigeria'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(b)}
                    className={`text-[10px] font-semibold flex items-center gap-1 p-1 rounded-md transition-colors cursor-pointer ${
                      b.featured ? 'text-amber-600 hover:text-amber-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={b.featured ? 'Unfeature this scholar' : 'Feature this scholar on public showcase'}
                  >
                    <Star className={`w-3.5 h-3.5 ${b.featured ? 'fill-current' : ''}`} />
                    <span>{b.featured ? 'Featured' : 'Make Featured'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(b)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#558b1a] hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit beneficiary details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(b)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete beneficiary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Beneficiary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b pb-3.5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#558b1a] flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    {editingBeneficiary ? 'Edit Scholarship Beneficiary' : 'Enroll New Beneficiary'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Configures the verified student profile displayed on the public beneficiaries page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs overflow-y-auto pr-1 flex-grow">
              {/* Full Name & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Chidinma Okeke"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Education Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category || 'Secondary'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white font-bold text-gray-900 focus:outline-none"
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Award Status</label>
                  <select
                    value={formData.awardStatus || 'Active'}
                    onChange={(e) => setFormData({ ...formData, awardStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Active">Active Scholar</option>
                    <option value="Ongoing">Ongoing Program</option>
                    <option value="Graduated">Graduated / Alumnus</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* School / Institution & Class Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    School / Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution || ''}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Saint Paul's Secondary School, Owerri"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Class / Academic Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.classLevel || ''}
                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                    placeholder="e.g. Primary 5 / SS 3 (WAEC) / 300L Engineering"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
              </div>

              {/* Award Year & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Year Awarded / Session</label>
                  <input
                    type="text"
                    required
                    value={formData.yearAwarded || ''}
                    onChange={(e) => setFormData({ ...formData, yearAwarded: e.target.value })}
                    placeholder="e.g. 2024 / 2024-2025"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location / Hub</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Imo State, Nigeria / Kigali, Rwanda"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                  />
                </div>
              </div>

              {/* Student Portrait Upload / Image URL */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Student Photo / Portrait</label>
                <div className="flex items-center gap-3">
                  {formData.imageUrl ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Paste image URL or upload photo below..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-gray-700 rounded-lg text-[11px] font-bold cursor-pointer transition">
                        <Upload className="w-3 h-3" />
                        <span>{uploadingImage ? 'Uploading image...' : 'Upload Student Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingImage}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                          className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Story / Summary */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Impact Story / Scholarship Summary</label>
                <textarea
                  rows={3}
                  value={formData.bioStory || ''}
                  onChange={(e) => setFormData({ ...formData, bioStory: e.target.value })}
                  placeholder="Detail the scholarship package (e.g. tuition fees, WAEC registration, textbooks) and student's progress..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a] text-xs"
                />
              </div>

              {/* Toggles: Featured & Sort Order */}
              <div className="p-3 bg-stone-50 rounded-xl border border-gray-200/80 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#558b1a] focus:ring-[#558b1a]"
                  />
                  <div>
                    <span className="font-bold text-gray-800 block text-xs">Featured Scholar</span>
                    <span className="text-[10px] text-gray-500">Showcase this scholar with a star badge on public pages</span>
                  </div>
                </label>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-500 font-semibold text-[11px]">Sort:</span>
                  <input
                    type="number"
                    value={formData.sortOrder || 0}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingBeneficiary ? 'Update Beneficiary' : 'Save Beneficiary'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
