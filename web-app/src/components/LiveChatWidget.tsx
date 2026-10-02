'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Headphones,
  Check,
  CheckCheck,
  Maximize2,
  Minimize2,
  RefreshCw,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ChatMessage {
  id: number;
  sender_type: 'user' | 'staff' | 'ai' | 'system';
  sender_name: string;
  content: string;
  created_at: string;
}

function formatInline(text: string, isUser: boolean): React.ReactNode[] {
  // Regex to match markdown tokens: bold **...**, code `...`, italics *...*, links [label](url), emails
  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\*[^*\n]+?\*|\[.*?\]\(.*?\)|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
          {boldText}
        </strong>
      );
    }

    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const codeText = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] select-all ${
            isUser ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#477415] border border-stone-200/80 font-bold'
          }`}
        >
          {codeText}
        </code>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const italicText = part.slice(1, -1);
      return (
        <em key={index} className="italic">
          {italicText}
        </em>
      );
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target={url.startsWith('http') ? '_blank' : '_self'}
          rel={url.startsWith('http') ? 'noreferrer noopener' : undefined}
          className={`underline font-semibold hover:opacity-80 transition ${
            isUser ? 'text-white underline-offset-2' : 'text-[#558b1a] underline-offset-2'
          }`}
        >
          {label}
        </a>
      );
    }

    // Email address
    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          className={`underline hover:opacity-80 transition font-medium ${
            isUser ? 'text-white' : 'text-[#558b1a]'
          }`}
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

function FormattedChatMessage({ content, isUser }: { content: string; isUser: boolean }) {
  if (!content) return null;
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const rawLines = para.split('\n').filter((l) => l.trim().length > 0);

        // Check if paragraph is entirely a bullet list
        const isBulletList = rawLines.length > 0 && rawLines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
        const isNumberedList = rawLines.length > 0 && rawLines.every((l) => /^\d+\.\s/.test(l.trim()));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1.5 my-1 pl-1">
              {rawLines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[-*]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-1.5 text-xs leading-relaxed">
                    <span className={`text-[10px] mt-0.5 select-none shrink-0 ${isUser ? 'text-emerald-300' : 'text-[#558b1a]'}`}>•</span>
                    <div>{formatInline(itemText, isUser)}</div>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={pIdx} className="space-y-1.5 my-1 pl-1">
              {rawLines.map((line, lIdx) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const itemText = match ? match[2] : line;
                return (
                  <li key={lIdx} className="flex items-start gap-1.5 text-xs leading-relaxed">
                    <span className={`text-[10px] font-bold mt-0.5 select-none shrink-0 ${isUser ? 'text-emerald-300' : 'text-[#558b1a]'}`}>{num}.</span>
                    <div>{formatInline(itemText, isUser)}</div>
                  </li>
                );
              })}
            </ol>
          );
        }

        const lines = para.split('\n');
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {formatInline(line, isUser)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function LiveChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStaffOnline, setIsStaffOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthesized notification sound
  const playNotificationPing = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // High-pitched pleasant bell chime (E6 -> B6)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1318.51, now); // E6
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1975.53, now + 0.1); // B6
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.55);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  // Initialize persistent session ID from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let sId = localStorage.getItem('vof_chat_session_id');
    if (!sId) {
      sId = 'vof_sess_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('vof_chat_session_id', sId);
    }
    setSessionId(sId);
  }, []);

  // Poll for messages and presence
  const fetchMessages = async (currentSessId: string, isInitial = false) => {
    if (!currentSessId) return;
    try {
      if (isInitial) setLoading(true);
      const res = await fetch(`/api/chat/messages?sessionId=${encodeURIComponent(currentSessId)}`, {
        cache: 'no-store',
      });
      if (!res.ok) return;
      const data = await res.json();
      setIsStaffOnline(Boolean(data.isStaffOnline));

      if (data.messages && Array.isArray(data.messages)) {
        setMessages((prev) => {
          if (data.messages.length > prev.length && !isInitial) {
            // New message arrived!
            const latest = data.messages[data.messages.length - 1];
            if (latest.sender_type !== 'user') {
              playNotificationPing();
              if (!isOpen) {
                setUnreadCount((c) => c + (data.messages.length - prev.length));
              }
            }
          }
          return data.messages;
        });
      }
    } catch (err) {
      console.warn('Chat poll error:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // Initial load & recurring poll
  useEffect(() => {
    if (!sessionId) return;
    fetchMessages(sessionId, true);

    const interval = setInterval(() => {
      fetchMessages(sessionId, false);
    }, 4000);

    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  // Hide widget completely on Admin dashboard
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || !sessionId || isSending) return;

    setInputText('');
    setIsSending(true);

    // Optimistic UI push
    const tempMsg: ChatMessage = {
      id: Date.now(),
      sender_type: 'user',
      sender_name: 'You',
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          senderType: 'user',
          content: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update presence and if AI replied
        if (data.isStaffOnline !== undefined) {
          setIsStaffOnline(data.isStaffOnline);
        }
        if (data.aiMessage) {
          setMessages((prev) => [...prev.filter((m) => m.id !== tempMsg.id), data.message, data.aiMessage]);
          playNotificationPing();
        } else if (data.message) {
          setMessages((prev) => [...prev.filter((m) => m.id !== tempMsg.id), data.message]);
        }
      } else {
        // Fallback so the visitor is never left without an answer
        const fallbackMsg: ChatMessage = {
          id: Date.now() + 1,
          sender_type: 'ai',
          sender_name: 'Stephanie (VOF AI Assistant)',
          content: "Thank you for reaching out! We received your message. For immediate assistance with donations, scholarships, or vocational training, you can also reach our team directly at contact@vonf.org or +234 803 555 1201.",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        playNotificationPing();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const fallbackMsg: ChatMessage = {
        id: Date.now() + 1,
        sender_type: 'ai',
        sender_name: 'Stephanie (VOF AI Assistant)',
        content: "Thank you for reaching out! We received your message. For immediate assistance with donations, scholarships, or vocational training, you can also reach our team directly at contact@vonf.org or +234 803 555 1201.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      playNotificationPing();
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'How do I donate to VOF?',
    'Tell me about Academic Scholarships',
    'Vocational Training at VOIE Center',
    'How can I become a volunteer?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 w-[380px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-emerald-300">
                  {isStaffOnline ? <Headphones className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
                </div>
                {/* Status Dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                    isStaffOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                  title={isStaffOnline ? 'Support Staff Online' : 'AI Assistant Active'}
                />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-semibold text-sm leading-tight text-white">VOF Support</h3>
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isStaffOnline ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <p className="text-xs text-slate-300">
                    {isStaffOnline ? 'Staff Online (Live Support)' : 'Stephanie (AI Assistant Active)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                type="button"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Close Chat"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Availability Alert Sub-banner */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-3.5 py-1.5 text-xs flex items-center justify-between text-slate-600">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {isStaffOnline
                  ? 'Connected directly with Foundation Desk'
                  : 'Automated 24/7 AI with human support follow-up'}
              </span>
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {/* Welcome Greeting */}
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                {isStaffOnline ? 'V' : 'AI'}
              </div>
              <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm text-xs leading-relaxed text-slate-800">
                <p className="font-semibold text-emerald-800 mb-1">
                  {isStaffOnline ? 'Veronica Onyeneke Support Desk' : 'Stephanie • VOF Virtual Assistant'}
                </p>
                {isStaffOnline ? (
                  <p>Hello! Welcome to Veronica Onyeneke Foundation. How can our support team assist you today?</p>
                ) : (
                  <p>
                    Welcome! Our support staff is currently attending to field tasks, so I am here to help answer questions
                    about our scholarships, vocational trades, or donations in real time!
                  </p>
                )}
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.map((msg) => {
              const isUser = msg.sender_type === 'user';
              const isAi = msg.sender_type === 'ai';
              const isStaff = msg.sender_type === 'staff';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {!isUser && (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isStaff ? 'bg-emerald-800 text-white' : 'bg-amber-600 text-white'
                      }`}
                    >
                      {isStaff ? 'ST' : <Sparkles className="w-3.5 h-3.5" />}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-sm'
                        : isStaff
                        ? 'bg-emerald-50 text-slate-900 border border-emerald-200/80 rounded-tl-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center space-x-1.5 mb-1 text-[11px] font-semibold opacity-75">
                        <span>{msg.sender_name}</span>
                        {isStaff && (
                          <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded font-normal">
                            Staff
                          </span>
                        )}
                        {isAi && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-normal">
                            AI
                          </span>
                        )}
                      </div>
                    )}
                    <FormattedChatMessage content={msg.content} isUser={isUser} />
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end space-x-1 ${
                        isUser ? 'text-emerald-100/80' : 'text-slate-400'
                      }`}
                    >
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isUser && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Sending Indicator */}
            {isSending && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 italic pl-9">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>{isStaffOnline ? 'Sending message...' : 'Stephanie is typing a response...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (Only show if few messages) */}
          {messages.length < 3 && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isSending}
                  className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-full px-2.5 py-1 text-slate-700 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isStaffOnline ? 'Type your message to staff...' : 'Ask Stephanie anything about VOF...'}
              className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-600 transition-all placeholder:text-slate-400"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl disabled:opacity-40 disabled:hover:bg-emerald-700 transition-colors shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-600/30"
        aria-label="Open Live Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            {/* Status indicator dot */}
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                isStaffOnline ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                isStaffOnline ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </div>
        )}

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
