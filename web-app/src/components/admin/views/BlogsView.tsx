'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  FolderPlus,
  Tag,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  X,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function BlogsView() {
  const [blogSubTab, setBlogSubTab] = useState<'articles' | 'categories' | 'tags'>('articles');
  const [blogFilter, setBlogFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    blogs,
    blogCategories,
    blogTags,
    setIsBlogModalOpen,
    setEditingBlog,
    setBlogFormData,
    handleDeleteBlog,
    setIsCategoryModalOpen,
    setEditingCategory,
    setCategoryFormData,
    handleDeleteCategory,
    newTagName,
    setNewTagName,
    handleCreateTag,
    handleDeleteTag,
  } = useAdmin();

  return (
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
  );
}
