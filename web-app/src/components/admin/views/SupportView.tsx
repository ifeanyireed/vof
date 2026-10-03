'use client';

import React from 'react';
import {
  Headphones,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  MessageSquare,
} from 'lucide-react';
import FormattedChatMessage from '@/components/FormattedChatMessage';
import { useAdmin } from '../AdminContext';

export default function SupportView() {
  const {
    supportStaffOnline,
    setSupportStaffOnline,
    audioPingEnabled,
    setAudioPingEnabled,
    supportFilter,
    setSupportFilter,
    supportSearch,
    setSupportSearch,
    supportConversations,
    selectedConvId,
    setSelectedConvId,
    supportMessages,
    staffReplyText,
    setStaffReplyText,
    sendingStaffReply,
    playStaffPing,
    handleSendStaffReply,
    handleUpdateConversationStatus,
  } = useAdmin();

  return (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-[#0c1a05] via-[#162f0d] to-[#091503] text-white p-6 sm:p-8 rounded-3xl border border-[#2b5219] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8ac43e]/20 text-[#8ac43e] text-xs font-bold uppercase tracking-wider mb-2">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Real-Time Support Desk</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">Live Visitor Inquiries & Chatbot Routing</h2>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    When you are online, visitor messages route directly to this console and chime with a sound alert.
                    When you step away or toggle offline, the Gemini AI Assistant (Stephanie) answers foundation questions automatically.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* Presence Status Toggle */}
                  <button
                    type="button"
                    onClick={() => setSupportStaffOnline(!supportStaffOnline)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm border ${
                      supportStaffOnline
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        supportStaffOnline ? 'bg-emerald-300 animate-ping' : 'bg-gray-500'
                      }`}
                    />
                    <span>{supportStaffOnline ? 'You Are Online (Live Desk)' : 'You Are Offline (AI Auto-Pilot)'}</span>
                  </button>

                  {/* Audio Ping Chime Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setAudioPingEnabled(!audioPingEnabled);
                      if (!audioPingEnabled) {
                        playStaffPing();
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10 cursor-pointer"
                    title={audioPingEnabled ? 'Sound alerts enabled (Click to mute)' : 'Sound alerts muted (Click to enable)'}
                  >
                    {audioPingEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                  </button>

                  {/* Test Ping Sound */}
                  <button
                    type="button"
                    onClick={playStaffPing}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 text-xs font-semibold transition border border-white/10"
                  >
                    Test Ping
                  </button>
                </div>
              </div>

              {/* Main Workspace (Two Columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
                {/* LEFT COLUMN: Conversation Threads List (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  {/* Search & Filter Header */}
                  <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        value={supportSearch}
                        onChange={(e) => setSupportSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558b1a]"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] font-medium text-gray-600">
                      {(['all', 'waiting_staff', 'staff_active', 'ai_active', 'closed'] as const).map((filterKey) => (
                        <button
                          key={filterKey}
                          onClick={() => setSupportFilter(filterKey)}
                          className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition cursor-pointer ${
                            supportFilter === filterKey
                              ? 'bg-[#558b1a] text-white font-bold'
                              : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {filterKey === 'waiting_staff'
                            ? 'Waiting'
                            : filterKey === 'staff_active'
                            ? 'Staff'
                            : filterKey === 'ai_active'
                            ? 'AI Bot'
                            : filterKey}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Conversation List Scroll Area */}
                  <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {(() => {
                      let filtered = supportConversations;
                      if (supportFilter !== 'all') {
                        filtered = filtered.filter((c) => c.status === supportFilter);
                      }
                      if (supportSearch.trim()) {
                        const q = supportSearch.toLowerCase();
                        filtered = filtered.filter(
                          (c) =>
                            (c.visitor_name && c.visitor_name.toLowerCase().includes(q)) ||
                            (c.last_message && c.last_message.toLowerCase().includes(q)) ||
                            (c.session_id && c.session_id.toLowerCase().includes(q))
                        );
                      }

                      if (filtered.length === 0) {
                        return (
                          <div className="p-8 text-center text-gray-400">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-semibold">No visitor threads found</p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              When visitors send messages on public pages, they will appear here.
                            </p>
                          </div>
                        );
                      }

                      return filtered.map((conv) => {
                        const isSelected = selectedConvId === conv.id;
                        const isWaiting = conv.status === 'waiting_staff';
                        const isAi = conv.status === 'ai_active';
                        const isStaff = conv.status === 'staff_active';

                        return (
                          <div
                            key={conv.id}
                            onClick={() => setSelectedConvId(conv.id)}
                            className={`p-3.5 transition cursor-pointer hover:bg-emerald-50/50 ${
                              isSelected ? 'bg-emerald-50/80 border-l-4 border-l-[#558b1a]' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                                  {conv.visitor_name?.charAt(0) || 'V'}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-xs text-gray-900 truncate">
                                    {conv.visitor_name || 'Website Visitor'}
                                  </h4>
                                  <span className="text-[10px] text-gray-400 truncate block">
                                    {conv.session_id.slice(0, 16)}...
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="text-[10px] text-gray-400">
                                  {conv.last_message_at
                                    ? new Date(conv.last_message_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : ''}
                                </span>
                                {conv.unread_admin > 0 && (
                                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                                    {conv.unread_admin}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-1 mt-1.5 pl-10">
                              {conv.last_message || '(No messages yet)'}
                            </p>

                            <div className="flex items-center gap-1.5 mt-2 pl-10">
                              {isWaiting && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                  Waiting for Staff
                                </span>
                              )}
                              {isAi && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  AI Managed
                                </span>
                              )}
                              {isStaff && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Staff Connected
                                </span>
                              )}
                              {conv.status === 'closed' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-600">
                                  Closed
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* RIGHT COLUMN: Active Chat Transcript & Actions (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  {selectedConvId ? (
                    (() => {
                      const curConv = supportConversations.find((c) => c.id === selectedConvId);
                      return (
                        <>
                          {/* Chat Window Top Bar */}
                          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/70">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#558b1a] text-white flex items-center justify-center font-bold text-sm">
                                {curConv?.visitor_name?.charAt(0) || 'V'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-sm text-gray-900">
                                    {curConv?.visitor_name || 'Website Visitor'}
                                  </h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      curConv?.status === 'waiting_staff'
                                        ? 'bg-amber-100 text-amber-800'
                                        : curConv?.status === 'staff_active'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : curConv?.status === 'ai_active'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {curConv?.status === 'waiting_staff'
                                      ? 'Needs Your Response'
                                      : curConv?.status === 'staff_active'
                                      ? 'Staff Responding'
                                      : curConv?.status === 'ai_active'
                                      ? 'AI Answering'
                                      : 'Closed'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Session: {curConv?.session_id} • Started{' '}
                                  {curConv?.created_at
                                    ? new Date(curConv.created_at).toLocaleDateString()
                                    : 'Today'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {curConv?.status !== 'staff_active' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateConversationStatus(curConv.id, 'staff_active')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Headphones className="w-3.5 h-3.5" />
                                  <span>Take Over from AI</span>
                                </button>
                              )}
                              {curConv?.status !== 'ai_active' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateConversationStatus(curConv.id, 'ai_active')}
                                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Hand to AI</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateConversationStatus(
                                    curConv.id,
                                    curConv.status === 'closed' ? 'waiting_staff' : 'closed'
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition cursor-pointer"
                              >
                                {curConv?.status === 'closed' ? 'Reopen' : 'Mark Resolved'}
                              </button>
                            </div>
                          </div>

                          {/* Chat Transcript Area */}
                          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                            {supportMessages.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <MessageSquare className="w-10 h-10 opacity-30 mb-2" />
                                <p className="text-xs">No messages in this conversation yet</p>
                              </div>
                            ) : (
                              supportMessages.map((msg) => {
                                const isStaff = msg.sender_type === 'staff';
                                const isAi = msg.sender_type === 'ai';
                                const isUser = msg.sender_type === 'user';

                                return (
                                  <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${isStaff ? 'flex-row-reverse' : ''}`}
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                        isStaff
                                          ? 'bg-emerald-700 text-white'
                                          : isAi
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-stone-700 text-white'
                                      }`}
                                    >
                                      {isStaff ? 'ST' : isAi ? <Sparkles className="w-3.5 h-3.5" /> : 'U'}
                                    </div>

                                    <div
                                      className={`max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                        isStaff
                                          ? 'bg-emerald-700 text-white rounded-tr-xs'
                                          : isAi
                                          ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tl-xs'
                                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-xs'
                                      }`}
                                    >
                                      <div
                                        className={`flex items-center gap-2 mb-1.5 text-[10px] font-bold ${
                                          isStaff ? 'text-emerald-100' : 'text-gray-400'
                                        }`}
                                      >
                                        <span>{msg.sender_name}</span>
                                        {isAi && (
                                          <span className="bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded font-normal">
                                            Stephanie AI
                                          </span>
                                        )}
                                        {isStaff && (
                                          <span className="bg-white/20 text-white px-1.5 py-0.2 rounded font-normal">
                                            Support Desk
                                          </span>
                                        )}
                                      </div>
                                      <FormattedChatMessage content={msg.content} isUser={isStaff} />
                                      <div
                                        className={`text-[10px] mt-2 flex items-center justify-end ${
                                          isStaff ? 'text-emerald-200' : 'text-gray-400'
                                        }`}
                                      >
                                        <span>
                                          {new Date(msg.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Quick Canned Response Chips */}
                          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5">
                            {[
                              'Hello! How can our support team assist you today?',
                              'Our VOIE Center offers vocational skills in fashion, catering & IT.',
                              'Scholarships cover full tuition and exam fees. Visit /apply.',
                              'Donations can be made to Access Bank: 1851214066 or online.',
                            ].map((canned, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleSendStaffReply(canned)}
                                className="text-[11px] bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 transition cursor-pointer"
                              >
                                {canned}
                              </button>
                            ))}
                          </div>

                          {/* Staff Reply Box */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSendStaffReply();
                            }}
                            className="p-4 bg-white border-t border-gray-200 flex items-center gap-3"
                          >
                            <input
                              type="text"
                              placeholder="Type your response to the visitor as Support Staff..."
                              value={staffReplyText}
                              onChange={(e) => setStaffReplyText(e.target.value)}
                              disabled={sendingStaffReply}
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558b1a] focus:bg-white transition"
                            />
                            <button
                              type="submit"
                              disabled={!staffReplyText.trim() || sendingStaffReply}
                              className="px-5 py-3 rounded-xl bg-[#558b1a] hover:bg-[#467315] text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                              <Send className="w-4 h-4" />
                              <span>{sendingStaffReply ? 'Sending...' : 'Reply'}</span>
                            </button>
                          </form>
                        </>
                      );
                    })()
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                        <Headphones className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm">Select a Conversation</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm">
                        Choose a visitor inquiry thread from the left column to read messages and reply live.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
  );
}
