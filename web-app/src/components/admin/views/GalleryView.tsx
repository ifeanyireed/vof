'use client';

import React from 'react';
import {
  Camera,
  Plus,
  Search,
  Grid,
  List,
  Calendar,
  MapPin,
  CheckCircle2,
  Eye,
  Edit3,
  Trash2,
  Copy,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function GalleryView() {
  const {
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
    galleryMedia,
    setIsMediaModalOpen,
    setEditingMedia,
    setMediaFormData,
    setPreviewingMedia,
    handleDeleteMedia,
    showNotification,
  } = useAdmin();

  return (
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
                              
                              {item.photos && item.photos.length > 0 && (
                                <p className="text-[10px] font-bold text-[#558b1a]">
                                  {item.photos.length} photo{item.photos.length !== 1 ? 's' : ''} in album
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
                                    photos: item.photos || [],
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
                              {item.photos && item.photos.length > 0 && (
                                <p className="text-[10px] font-bold text-[#558b1a] mt-0.5">
                                  {item.photos.length} photo{item.photos.length !== 1 ? 's' : ''}
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
                                      photos: item.photos || [],
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
  );
}
