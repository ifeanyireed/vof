'use client';

import React from 'react';
import {
  X,
  Plus,
  Trash2,
  UploadCloud,
  Camera,
  ExternalLink,
  Edit3,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  RefreshCw,
} from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import { useAdmin } from './AdminContext';
import { ROLE_CONFIGS, getRoleBadge, AdminRole } from '@/lib/auth';

export default function AdminModals() {
  const {
    showNotification,
    isBlogModalOpen,
    setIsBlogModalOpen,
    editingBlog,
    setEditingBlog,
    blogFormData,
    setBlogFormData,
    uploadingImage,
    handleImageUpload,
    handleSaveBlog,
    blogCategories,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    categoryFormData,
    setCategoryFormData,
    handleSaveCategory,
    tagInput,
    setTagInput,
    blogTags,
    newTagName,
    setNewTagName,
    handleCreateTag,
    isDonationModalOpen,
    setIsDonationModalOpen,
    donationFormData,
    setDonationFormData,
    handleSaveDonation,
    projects,
    isProjectModalOpen,
    setIsProjectModalOpen,
    editingProject,
    setEditingProject,
    projectFormData,
    setProjectFormData,
    handleSaveProject,
    isTxModalOpen,
    setIsTxModalOpen,
    txFormData,
    setTxFormData,
    accounts,
    handleSaveTransaction,
    isVolunteerModalOpen,
    setIsVolunteerModalOpen,
    newVolunteer,
    setNewVolunteer,
    handleSaveVolunteer,
    selectedPartner,
    setSelectedPartner,
    isUpdatingPartner,
    handleUpdatePartnerStatus,
    partnerStatusUpdate,
    setPartnerStatusUpdate,
    partnerNotesUpdate,
    setPartnerNotesUpdate,
    handleDeletePartner,
    getRecordCountry,
    renderCountryBadge,
    isMediaModalOpen,
    setIsMediaModalOpen,
    editingMedia,
    setEditingMedia,
    mediaFormData,
    setMediaFormData,
    uploadingGalleryImage,
    handleGalleryImageUpload,
    isSavingMedia,
    handleSaveMedia,
    previewingMedia,
    setPreviewingMedia,
    handleDeleteMedia,
    isPreviewPopupOpen,
    setIsPreviewPopupOpen,
    previewProjectIndex,
    setPreviewProjectIndex,
    popupSettings,
    setPopupSettings,
    isSavingPopup,
    handleSavePopupSettings,
    isAddUserModalOpen,
    setIsAddUserModalOpen,
    newUserData,
    setNewUserData,
    savingUser,
    handleCreateAdminUser,
    isEditRoleModalOpen,
    setIsEditRoleModalOpen,
    editingUser,
    setEditingUser,
    handleUpdateUserRole,
    formatMoney,
  } = useAdmin();

  return (
    <>
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

              {/* Cover Image Upload & Direct URL */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Project Cover Image (Cloudinary or URL)</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="text"
                    value={projectFormData.imageUrl || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, imageUrl: e.target.value })}
                    placeholder="https://... or upload local file"
                    className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-stone-50/50"
                  />
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#558b1a] hover:bg-[#467415] text-white font-bold flex items-center gap-1.5 shrink-0 transition text-xs shadow-xs">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'project')}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail Box */}
                {projectFormData.imageUrl && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-black/10 overflow-hidden relative shrink-0">
                      <img
                        src={projectFormData.imageUrl}
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src = 'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233536/vof/IMG01.jpg';
                        }}
                      />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-[11px] font-bold text-gray-800 truncate">
                        {projectFormData.title || 'Project Image Preview'}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{projectFormData.imageUrl}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjectFormData({ ...projectFormData, imageUrl: '' })}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-200 transition"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={projectFormData.category || 'Vocational Education'}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="Vocational Education">Vocational Education</option>
                    <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
                    <option value="Healthcare Aid">Healthcare Aid</option>
                    <option value="Community Welfare">Community Welfare</option>
                    <option value="Youth Empowerment">Youth Empowerment</option>
                    <option value="Elderly Relief">Elderly Relief</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status</label>
                  <select
                    value={projectFormData.status || 'active'}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        status: e.target.value as 'active' | 'completed' | 'upcoming' | 'paused',
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={projectFormData.startDate || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={projectFormData.endDate || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
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

      {/* ============================================================ */}
      {/* MODAL: ADD STAFF MEMBER */}
      {/* ============================================================ */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Add New Staff Member</h3>
                <p className="text-xs text-gray-500">Create an authorized administrative or operational account</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                  placeholder="e.g. Sister Mary Nwankwo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#558b1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="e.g. outreach@vonf.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#558b1a]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const randomPass = 'VOF@' + Math.random().toString(36).substring(2, 8).toUpperCase() + '!';
                      setNewUserData({ ...newUserData, password: randomPass });
                    }}
                    className="text-[10px] text-[#558b1a] hover:underline font-semibold cursor-pointer"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="Secure password (min 6 characters)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#558b1a] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Assign Role & Access Level
                </label>
                <div className="space-y-2">
                  {(Object.keys(ROLE_CONFIGS) as AdminRole[]).map((r) => {
                    const cfg = ROLE_CONFIGS[r];
                    const isSelected = newUserData.role === r;
                    return (
                      <div
                        key={r}
                        onClick={() => setNewUserData({ ...newUserData, role: r })}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-[#558b1a] bg-emerald-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-gray-900">{cfg.label}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge.bg} ${cfg.badge.text}`}>
                            {cfg.allowedTabs.length} modules
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{cfg.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingUser ? 'Creating...' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT STAFF ROLE */}
      {/* ============================================================ */}
      {isEditRoleModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Change Staff Role</h3>
                <p className="text-xs text-gray-500">Update permissions for {editingUser.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditRoleModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(Object.keys(ROLE_CONFIGS) as AdminRole[]).map((r) => {
                const cfg = ROLE_CONFIGS[r];
                const isSelected = editingUser.role === r;
                return (
                  <div
                    key={r}
                    onClick={() => handleUpdateUserRole(editingUser.id, r)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#558b1a] bg-emerald-50/50 shadow-xs ring-1 ring-[#558b1a]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">{cfg.label}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{cfg.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditRoleModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
