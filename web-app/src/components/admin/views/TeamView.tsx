'use client';

import React from 'react';
import {
  ShieldCheck,
  Shield,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  Key,
  UserX,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { useAdmin } from '../AdminContext';
import { getRoleBadge, getRoleLabel, ROLE_CONFIGS, AdminRole } from '@/lib/auth';

export default function TeamView() {
  const {
    currentUser,
    adminUsers,
    isLoadingAdminUsers,
    fetchAdminUsers,
    adminUserSearch,
    setAdminUserSearch,
    adminRoleFilter,
    setAdminRoleFilter,
    setIsAddUserModalOpen,
    setEditingUser,
    setIsEditRoleModalOpen,
    handleToggleUserStatus,
    handleResetUserPassword,
    handleDeleteUser,
  } = useAdmin();

  return (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#0c1a05] via-[#162f0d] to-[#091503] text-white p-6 sm:p-8 rounded-3xl border border-[#2b5219] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ac43e]/20 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Access Governance & Staff Administration
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Admin Team & Role-Based Access Control
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    Manage foundation staff accounts, allocate granular role permissions, and control access to sensitive financial ledgers and beneficiary records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#558b1a] to-[#8ac43e] text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer transition shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Staff Member</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs text-gray-500 font-medium">Total Staff Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{adminUsers.length}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Authorized personnel</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs text-gray-500 font-medium">Active Accounts</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {adminUsers.filter((u) => u.isActive).length}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">Currently enabled</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs text-gray-500 font-medium">Super Administrators</p>
                  <p className="text-2xl font-bold text-[#558b1a] mt-1">
                    {adminUsers.filter((u) => u.role === 'super_admin').length}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">Full root privileges</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs text-gray-500 font-medium">Operational Roles</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {adminUsers.filter((u) => u.role !== 'super_admin').length}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">Specialized scope</p>
                </div>
              </div>

              {/* RBAC Role Matrix Reference */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    Role Permission Matrix & Scope
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Overview of accessible dashboard sections by role assignment
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {(Object.keys(ROLE_CONFIGS) as AdminRole[]).map((roleKey) => {
                    const cfg = ROLE_CONFIGS[roleKey];
                    return (
                      <div
                        key={roleKey}
                        className={`p-3.5 rounded-2xl border ${cfg.badge.border} ${cfg.badge.bg} flex flex-col justify-between`}
                      >
                        <div>
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${cfg.badge.text}`}>
                            {cfg.label}
                          </span>
                          <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">
                            {cfg.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-gray-500">
                          <span>{cfg.allowedTabs.length} Modules Allowed</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Staff Roster Table */}
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Authorized Staff Directory</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Active staff members with access to VOF Admin Portal
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={adminUserSearch}
                        onChange={(e) => setAdminUserSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#558b1a]"
                      />
                    </div>

                    <select
                      value={adminRoleFilter}
                      onChange={(e) => setAdminRoleFilter(e.target.value)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#558b1a]"
                    >
                      <option value="all">All Roles</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Administrator</option>
                      <option value="finance_officer">Finance Officer</option>
                      <option value="content_editor">Content Editor</option>
                      <option value="programs_coordinator">Programs Coordinator</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Staff Member</th>
                        <th className="py-3.5 px-4">Role Assignment</th>
                        <th className="py-3.5 px-4">Account Status</th>
                        <th className="py-3.5 px-4">Last Login</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {adminUsers
                        .filter((u) => {
                          if (adminRoleFilter !== 'all' && u.role !== adminRoleFilter) return false;
                          if (adminUserSearch) {
                            const q = adminUserSearch.toLowerCase();
                            return (
                              u.fullName.toLowerCase().includes(q) ||
                              u.email.toLowerCase().includes(q) ||
                              u.role.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((u) => {
                          const roleBadge = getRoleBadge(u.role);
                          const isSelf = currentUser?.id === u.id;
                          return (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  {u.avatarUrl ? (
                                    <img
                                      src={u.avatarUrl}
                                      alt={u.fullName}
                                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#558b1a] to-[#8ac43e] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                      {u.fullName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                                      <span>{u.fullName}</span>
                                      {isSelf && (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-gray-500 text-[11px]">{u.email}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${roleBadge.bg} ${roleBadge.text} border ${roleBadge.border}`}
                                >
                                  <Shield className="w-3 h-3" />
                                  {getRoleLabel(u.role)}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                {u.isActive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                                    <AlertCircle className="w-3 h-3" />
                                    Deactivated
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-gray-500">
                                {u.lastLogin
                                  ? new Date(u.lastLogin).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Never logged in'}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingUser(u);
                                      setIsEditRoleModalOpen(true);
                                    }}
                                    className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-[11px] font-medium transition cursor-pointer"
                                    title="Change Role"
                                  >
                                    Change Role
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleResetUserPassword(u)}
                                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs transition cursor-pointer"
                                    title="Reset Password"
                                  >
                                    <Key className="w-3.5 h-3.5" />
                                  </button>

                                  {!isSelf && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleUserStatus(u)}
                                      className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                                        u.isActive
                                          ? 'border-amber-200 hover:bg-amber-50 text-amber-600'
                                          : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'
                                      }`}
                                      title={u.isActive ? 'Deactivate User' : 'Activate User'}
                                    >
                                      {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                    </button>
                                  )}

                                  {!isSelf && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteUser(u)}
                                      className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs transition cursor-pointer"
                                      title="Delete Account"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
}
