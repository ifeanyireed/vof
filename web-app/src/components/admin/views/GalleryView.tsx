'use client';

import React, { useState, useMemo } from 'react';
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
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { galleryAlbums } from '@/data/gallery';
import { GalleryMediaItem } from '@/lib/api';

export interface AdminAlbumCardItem {
  id: string;
  dbId?: number;
  title: string;
  slug: string;
  category: string;
  region: 'Global' | 'Nigeria' | 'Rwanda' | 'USA';
  year: number;
  location: string;
  photoCount: number;
  description: string;
  coverImages: [string, string, string]; // [topLeft, bottomLeft, rightTall]
  photos: {
    id: string;
    url: string;
    caption?: string;
    title?: string;
    date?: string;
  }[];
  status: 'published' | 'draft' | 'archived';
  eventDate?: string;
  featured?: boolean;
  isBaseline?: boolean;
  rawMediaItem?: GalleryMediaItem;
}

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

  // Color helper for program categories
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Maternal Dignity':
        return 'bg-pink-600';
      case 'Vocational Skills':
        return 'bg-purple-600';
      case 'Academic Scholarships':
        return 'bg-emerald-600';
      case 'Rwanda Mission':
        return 'bg-cyan-600';
      case 'Community Relief':
        return 'bg-amber-600';
      case 'Annual Milestones':
        return 'bg-blue-600';
      default:
        return 'bg-gray-800';
    }
  };

  // Hidden baseline albums from localStorage
  const [hiddenAlbumIds, setHiddenAlbumIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('vof_hidden_baseline_albums');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Consolidate baseline gallery seed albums + dynamic database records into Album cards
  const aggregatedAlbums = useMemo<AdminAlbumCardItem[]>(() => {
    const baseAlbums: AdminAlbumCardItem[] = galleryAlbums
      .filter((a) => !hiddenAlbumIds.includes(a.id) && !hiddenAlbumIds.includes(a.slug))
      .map((a) => ({
      id: a.id,
      dbId: undefined,
      title: a.title,
      slug: a.slug,
      category: a.category,
      region: a.region,
      year: a.year,
      location: a.location,
      photoCount: a.photos.length,
      description: a.description,
      coverImages: [...a.coverImages] as [string, string, string],
      photos: a.photos.map((p, idx) => ({
        id: p.id || `base-${idx}`,
        url: p.url,
        title: p.caption ? p.caption.slice(0, 45) : a.title,
        caption: p.caption,
        date: p.date || `${a.year}`,
      })),
      status: 'published',
      eventDate: `${a.year}`,
      featured: false,
      isBaseline: true,
      rawMediaItem: undefined,
    }));

    if (!galleryMedia || galleryMedia.length === 0) return baseAlbums;

    const customAlbumsMap = new Map<string, AdminAlbumCardItem>();

    galleryMedia.forEach((media, mIdx) => {
      const albumTitle = media.albumTitle?.trim() || media.title?.trim() || `${media.category} Highlights`;
      const existingBase = baseAlbums.find(
        (b) => b.title.toLowerCase() === albumTitle.toLowerCase() || b.id === albumTitle
      );

      const mediaPhotos = media.photos && media.photos.length > 0
        ? media.photos
        : [{ url: media.mediaUrl, caption: media.caption, title: media.title }];

      mediaPhotos.forEach((photo, pIdx) => {
        if (!photo.url) return;
        if (existingBase) {
          const alreadyExists = existingBase.photos.some((p) => p.url === photo.url);
          if (!alreadyExists) {
            existingBase.photos.unshift({
              id: `dyn-${media.id || mIdx}-${pIdx}`,
              url: photo.url,
              title: photo.title || media.title || existingBase.title,
              caption: photo.caption || media.caption || existingBase.description,
              date: media.eventDate || `${media.year}`,
            });
            existingBase.photoCount = existingBase.photos.length;
            if (existingBase.photos.length >= 3) {
              existingBase.coverImages = [
                existingBase.photos[0].url,
                existingBase.photos[1].url,
                existingBase.photos[2].url,
              ];
            } else if (existingBase.photos.length === 2) {
              existingBase.coverImages = [
                existingBase.photos[0].url,
                existingBase.photos[1].url,
                existingBase.photos[0].url,
              ];
            }
          }
          if (media.id && !existingBase.dbId) {
            existingBase.dbId = media.id;
            existingBase.rawMediaItem = media;
          }
        } else {
          if (!customAlbumsMap.has(albumTitle)) {
            const slug = albumTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const initialCover: [string, string, string] = [photo.url, photo.url, photo.url];
            customAlbumsMap.set(albumTitle, {
              id: `album-${media.id || mIdx}`,
              dbId: media.id,
              title: albumTitle,
              slug,
              category: media.category || 'Vocational Skills',
              region: (media.region as any) || 'Nigeria',
              year: media.year || new Date().getFullYear(),
              location: media.location || 'Foundation Hub',
              photoCount: 1,
              description: media.caption || media.title || '',
              coverImages: initialCover,
              photos: [
                {
                  id: `dyn-${media.id || mIdx}-${pIdx}`,
                  url: photo.url,
                  title: photo.title || media.title || albumTitle,
                  caption: photo.caption || media.caption || '',
                  date: media.eventDate || `${media.year}`,
                },
              ],
              status: media.status || 'published',
              eventDate: media.eventDate || `${media.year}`,
              featured: !!media.featured,
              isBaseline: false,
              rawMediaItem: media,
            });
          } else {
            const alb = customAlbumsMap.get(albumTitle)!;
            const alreadyExists = alb.photos.some((p) => p.url === photo.url);
            if (!alreadyExists) {
              alb.photos.push({
                id: `dyn-${media.id || mIdx}-${pIdx}`,
                url: photo.url,
                title: photo.title || media.title || albumTitle,
                caption: photo.caption || media.caption || '',
                date: media.eventDate || `${media.year}`,
              });
              alb.photoCount = alb.photos.length;
              if (alb.photos.length >= 3) {
                alb.coverImages = [alb.photos[0].url, alb.photos[1].url, alb.photos[2].url];
              } else if (alb.photos.length === 2) {
                alb.coverImages = [alb.photos[0].url, alb.photos[1].url, alb.photos[0].url];
              }
            }
            if (media.id && !alb.dbId) {
              alb.dbId = media.id;
              alb.rawMediaItem = media;
            }
          }
        }
      });
    });

    return [...Array.from(customAlbumsMap.values()), ...baseAlbums];
  }, [galleryMedia, hiddenAlbumIds]);

  // Handler to delete/hide any album (whether dynamically in DB or baseline)
  const handleDeleteAlbum = async (album: AdminAlbumCardItem) => {
    if (album.dbId) {
      await handleDeleteMedia(album.dbId, album.title);
    }
    if (album.isBaseline) {
      if (!album.dbId) {
        if (!confirm(`Are you sure you want to remove the album "${album.title}" from the gallery?`)) return;
      }
      setHiddenAlbumIds((prev) => {
        const updated = [...prev, album.id, album.slug];
        try {
          localStorage.setItem('vof_hidden_baseline_albums', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      showNotification('success', `Album "${album.title}" removed from gallery`);
    }
  };

  // Filtered albums based on search, category, year, region
  const filteredAlbums = useMemo(() => {
    return aggregatedAlbums
      .filter((a) => (galleryCategoryFilter === 'all' ? true : a.category === galleryCategoryFilter))
      .filter((a) => (galleryYearFilter === 'all' ? true : a.year.toString() === galleryYearFilter))
      .filter((a) =>
        galleryRegionFilter === 'all'
          ? true
          : a.region === galleryRegionFilter || (galleryRegionFilter === 'Global' && a.region === 'Global')
      )
      .filter((a) => {
        if (!gallerySearch.trim()) return true;
        const s = gallerySearch.toLowerCase();
        return (
          a.title.toLowerCase().includes(s) ||
          a.description.toLowerCase().includes(s) ||
          a.location.toLowerCase().includes(s) ||
          a.photos.some((p) => (p.title && p.title.toLowerCase().includes(s)) || (p.caption && p.caption.toLowerCase().includes(s)))
        );
      });
  }, [aggregatedAlbums, galleryCategoryFilter, galleryYearFilter, galleryRegionFilter, gallerySearch]);

  // Open Preview Lightbox with full album photo pack
  const handleOpenAlbumLightbox = (album: AdminAlbumCardItem) => {
    setPreviewingMedia({
      ...album.rawMediaItem,
      id: album.dbId || 0,
      title: album.title,
      category: album.category,
      mediaUrl: album.coverImages[2] || album.coverImages[0],
      caption: album.description,
      eventDate: album.eventDate || `${album.year}`,
      year: album.year,
      region: album.region,
      location: album.location,
      albumTitle: album.title,
      status: album.status,
      photos: album.photos.map((p) => ({ url: p.url, caption: p.caption, title: p.title })),
    });
  };

  // Open Edit Modal with this album's data
  const handleEditAlbum = (album: AdminAlbumCardItem) => {
    if (album.rawMediaItem) {
      setEditingMedia(album.rawMediaItem);
      setMediaFormData({
        title: album.rawMediaItem.title,
        category: album.rawMediaItem.category,
        mediaUrl: album.rawMediaItem.mediaUrl || album.coverImages[0],
        mediaType: album.rawMediaItem.mediaType || 'image',
        caption: album.rawMediaItem.caption || album.description,
        eventDate: album.rawMediaItem.eventDate || new Date().toISOString().split('T')[0],
        year: album.rawMediaItem.year || album.year,
        region: album.rawMediaItem.region || album.region,
        location: album.rawMediaItem.location || album.location,
        albumTitle: album.rawMediaItem.albumTitle || album.title,
        featured: !!album.rawMediaItem.featured,
        status: album.rawMediaItem.status || album.status,
        photos:
          album.rawMediaItem.photos && album.rawMediaItem.photos.length > 0
            ? album.rawMediaItem.photos
            : album.photos.map((p) => ({ url: p.url, title: p.title || '', caption: p.caption || '' })),
      });
    } else {
      // Baseline album - prepare new DB album entity targeting this program
      setEditingMedia(null);
      setMediaFormData({
        title: album.title,
        category: album.category,
        mediaUrl: album.coverImages[0],
        mediaType: 'image',
        caption: album.description,
        eventDate: `${album.year}-01-01`,
        year: album.year,
        region: album.region,
        location: album.location,
        albumTitle: album.title,
        featured: false,
        status: 'published',
        photos: album.photos.map((p) => ({ url: p.url, title: p.title || '', caption: p.caption || '' })),
      });
    }
    setIsMediaModalOpen(true);
  };

  const totalPhotosCount = useMemo(() => {
    return aggregatedAlbums.reduce((acc, curr) => acc + curr.photoCount, 0);
  }, [aggregatedAlbums]);

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Program Mini-Albums
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 text-xs font-semibold">{aggregatedAlbums.length} Albums</span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-[#558b1a] text-xs font-bold">{totalPhotosCount} Total Photographs</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Gallery & Album Manager</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize photo packs into stacked 3-image collage mini-albums covering programs, graduations, and outreach events.
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
              title="3-Image Collage Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Collage Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setGalleryViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                galleryViewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Table View"
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
                photos: [],
              });
              setIsMediaModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#558b1a] hover:bg-[#68a424] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Album</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Total Program Albums
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-gray-900">{aggregatedAlbums.length}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#558b1a] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Total Photos Cataloged
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-600">{totalPhotosCount}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Programs Represented
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600">
              {new Set(aggregatedAlbums.map((a) => a.category)).size}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Published Albums
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-cyan-600">
              {aggregatedAlbums.filter((a) => a.status === 'published').length}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
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
            value={gallerySearch}
            onChange={(e) => setGallerySearch(e.target.value)}
            placeholder="Search albums, program topics, locations..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#558b1a] bg-stone-50/50"
          />
          {gallerySearch && (
            <button
              onClick={() => setGallerySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
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
            <option value="all">All Programs</option>
            <option value="Vocational Skills">Vocational Skills</option>
            <option value="Maternal Dignity">Maternal Dignity</option>
            <option value="Academic Scholarships">Academic Scholarships</option>
            <option value="Rwanda Mission">Rwanda Mission</option>
            <option value="Community Relief">Community Relief</option>
            <option value="Annual Milestones">Annual Milestones</option>
            <option value="General Outreach">General Outreach</option>
          </select>

          {/* Year Filter */}
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

      {/* Album Cards Listing */}
      {filteredAlbums.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-gray-900 text-base">No albums found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No program albums match the current filter criteria. Adjust your search or create a new album.
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
      ) : galleryViewMode === 'grid' ? (
        /* 3-IMAGE COLLAGE GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* 3-IMAGE COLLAGE CONTAINER (Exact replication of public gallery) */}
                <div
                  onClick={() => handleOpenAlbumLightbox(album)}
                  className="relative w-full h-48 sm:h-52 flex gap-1.5 p-2 bg-stone-50 cursor-pointer group/collage"
                  title="Click to view album photos pack"
                >
                  {/* Left Column: 2 Stacked Images */}
                  <div className="w-[42%] flex flex-col gap-1.5 h-full">
                    {/* Top Left Image */}
                    <div className="flex-1 w-full rounded-xl overflow-hidden relative bg-gray-200 shadow-2xs">
                      <img
                        src={album.coverImages[0]}
                        alt={`${album.title} preview 1`}
                        className="w-full h-full object-cover group-hover/collage:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as any).src =
                            'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp';
                        }}
                      />
                    </div>
                    {/* Bottom Left Image */}
                    <div className="flex-1 w-full rounded-xl overflow-hidden relative bg-gray-200 shadow-2xs">
                      <img
                        src={album.coverImages[1]}
                        alt={`${album.title} preview 2`}
                        className="w-full h-full object-cover group-hover/collage:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as any).src =
                            'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp';
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column: 1 Tall Full-Height Image */}
                  <div className="w-[58%] h-full rounded-xl overflow-hidden relative bg-gray-200 shadow-2xs">
                    <img
                      src={album.coverImages[2]}
                      alt={`${album.title} preview tall`}
                      className="w-full h-full object-cover group-hover/collage:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as any).src =
                          'https://res.cloudinary.com/kmflnrxu/image/upload/v1790233488/vof/logo.webp';
                      }}
                    />
                    {/* Hover Overlay with Eye Indicator */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/collage:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/95 text-gray-900 shadow-md transform scale-90 group-hover/collage:scale-100 transition-transform">
                        <Eye className="w-4 h-4 text-[#558b1a]" />
                      </span>
                    </div>
                  </div>

                  {/* Category Badge overlay on top-left */}
                  <div className="absolute top-3.5 left-3.5 pointer-events-none z-10">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs backdrop-blur-xs ${getCategoryBadgeColor(
                        album.category
                      )}`}
                    >
                      {album.category}
                    </span>
                  </div>

                  {/* Country Hub Badge overlay on top-right */}
                  <div className="absolute top-3.5 right-3.5 pointer-events-none z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/65 text-white backdrop-blur-xs shadow-xs">
                      {album.region === 'Nigeria'
                        ? '🇳🇬 NG'
                        : album.region === 'Rwanda'
                        ? '🇷🇼 RW'
                        : album.region === 'USA'
                        ? '🇺🇸 USA'
                        : '🌐 Global'}
                    </span>
                  </div>

                  {/* Photos Count overlay on bottom-right */}
                  <div className="absolute bottom-3.5 right-3.5 pointer-events-none z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs shadow-xs">
                      <Camera className="w-3 h-3 text-[#7ccd2d]" />
                      <span>{album.photoCount} Photos</span>
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1 font-semibold text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                      <span>{album.eventDate || album.year}</span>
                    </span>
                    {album.location && (
                      <span
                        className="flex items-center gap-1 text-[11px] text-gray-500 truncate max-w-[140px]"
                        title={album.location}
                      >
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{album.location}</span>
                      </span>
                    )}
                  </div>

                  <h4
                    className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-[#558b1a] transition-colors"
                    title={album.title}
                  >
                    {album.title}
                  </h4>

                  {album.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pt-0.5">
                      {album.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-stone-50 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      album.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {album.status}
                  </span>
                  {album.isBaseline && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                      Core Album
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenAlbumLightbox(album)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition cursor-pointer"
                    title="View Photos Lightbox"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/gallery?search=${encodeURIComponent(album.title)}`
                      );
                      showNotification('success', 'Public album gallery link copied to clipboard!');
                    }}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition cursor-pointer"
                    title="Copy Public Album Link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditAlbum(album)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#558b1a] hover:bg-white transition cursor-pointer"
                    title="Edit Album & Photos"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAlbum(album)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-white transition cursor-pointer"
                    title="Delete Album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 w-24">Collage Cover</th>
                  <th className="p-3.5">Album Title & Scope</th>
                  <th className="p-3.5">Program Category</th>
                  <th className="p-3.5">Year & Date</th>
                  <th className="p-3.5">Hub / Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAlbums.map((album) => (
                  <tr key={album.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-3.5 w-24">
                      {/* Mini 3-Image Collage Thumbnail */}
                      <div
                        onClick={() => handleOpenAlbumLightbox(album)}
                        className="w-20 h-14 rounded-lg overflow-hidden bg-stone-100 border border-gray-200 cursor-pointer relative group flex gap-0.5 p-0.5"
                        title="View photo pack"
                      >
                        <div className="w-[42%] flex flex-col gap-0.5 h-full">
                          <img
                            src={album.coverImages[0]}
                            alt=""
                            className="w-full h-1/2 object-cover rounded-xs"
                          />
                          <img
                            src={album.coverImages[1]}
                            alt=""
                            className="w-full h-1/2 object-cover rounded-xs"
                          />
                        </div>
                        <div className="w-[58%] h-full">
                          <img
                            src={album.coverImages[2]}
                            alt=""
                            className="w-full h-full object-cover rounded-xs"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <p className="font-bold text-gray-900 text-sm leading-snug">{album.title}</p>
                      <p className="text-[10px] font-bold text-[#558b1a] mt-0.5 flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>{album.photoCount} High-Res Photographs</span>
                      </p>
                      {album.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{album.description}</p>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-2xs ${getCategoryBadgeColor(
                          album.category
                        )}`}
                      >
                        {album.category}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#558b1a]" />
                        <span>{album.eventDate || album.year}</span>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-gray-800">{album.region}</span>
                      {album.location && <p className="text-[11px] text-gray-500 truncate">{album.location}</p>}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          album.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {album.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAlbumLightbox(album)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                          title="View Lightbox"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditAlbum(album)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#558b1a] hover:bg-gray-100 cursor-pointer"
                          title="Edit Album"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAlbum(album)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-gray-100 cursor-pointer"
                          title="Delete Album"
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
        </div>
      )}
    </div>
  );
}
