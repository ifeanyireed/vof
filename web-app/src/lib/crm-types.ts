export type CrmTabId =
  | 'overview'
  | 'leads'
  | 'pipeline'
  | 'contacts'
  | 'calls'
  | 'lists'
  | 'blasts'
  | 'settings';

export type DealStage =
  | 'DISCOVERY'
  | 'QUALIFIED'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export type LeadStatus =
  | 'CURIOUS'
  | 'CONTACTED'
  | 'PROPOSAL'
  | 'AWAITING RESPONSE'
  | 'MEETING BOOKED'
  | 'QUALIFIED'
  | 'NOT READY'
  | 'CONVERTED'
  | 'ARCHIVED';

export type AccountStatus = 'DONOR' | 'SPONSOR' | 'PARTNER' | 'PROSPECT';

export type CallOutcome =
  | 'CONNECTED_INTERESTED'
  | 'CONNECTED_NEGOTIATING'
  | 'CONNECTED_WON'
  | 'CONNECTED_FOLLOWUP'
  | 'NOT_INTERESTED'
  | 'VOICEMAIL'
  | 'NO_ANSWER'
  | 'BUSY'
  | 'WRONG_NUMBER';

export interface CrmLead {
  id: string;
  organizationName: string;
  website?: string;
  category: string;
  location?: string;
  contactName: string;
  contactTitle?: string;
  contactEmail: string;
  contactPhone?: string;
  linkedinUrl?: string;
  fitScore: number;
  engagementSignals: string[];
  status: LeadStatus | string;
  assignedRep?: string;
  source?: string;
  notes?: string;
  convertedDealId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CrmDeal {
  id: string;
  title: string;
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  valueDisplay: string;
  valueAmount: number;
  currency: string;
  stage: DealStage;
  owner: string;
  probability: number;
  expectedClose: string;
  campaignType: string;
  notes?: string;
  leadId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CrmAccount {
  id: string;
  organization: string;
  category: string;
  location: string;
  totalContributed: string;
  status: AccountStatus;
  keyContact: string;
  email: string;
  phone: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CallScoreBreakdown {
  callerName?: boolean; // 3 pts
  rfp?: boolean; // 1 pt
  differentContact?: boolean; // 2 pts
  rescheduleFollowup?: boolean; // 2 pts
  referral?: boolean; // 4 pts
  alternateContact?: string;
  referralDetails?: string;
}

export interface CrmCall {
  id: string;
  leadId?: string | null;
  contactName: string;
  organization: string;
  phoneNumber: string;
  repName: string;
  repEmail?: string;
  direction: 'OUTBOUND' | 'INBOUND';
  outcome: CallOutcome;
  durationSeconds: number;
  score: number;
  scoreBreakdown: CallScoreBreakdown;
  notes: string;
  followupDate?: string;
  calledAt: string;
  createdAt: string;
}

export interface CrmCallStats {
  totalCalls: number;
  connectedCalls: number;
  connectRate: number;
  positiveCount: number;
  wonCount: number;
  avgDurationSec: number;
  todayCalls: number;
  highScoreCount: number;
}

export interface CrmEmailList {
  id: string;
  name: string;
  description: string;
  tags: string[];
  subscriberCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  createdAt: string;
}

export interface CrmEmailSubscriber {
  id: string;
  listId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  organization: string;
  phone: string;
  linkedinUrl: string;
  source: string;
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'BOUNCED';
  bouncedAt?: string | null;
  bounceReason?: string | null;
  createdAt: string;
}

export interface CrmSenderProfile {
  id: string;
  profileName: string;
  provider: string;
  host: string;
  port: number;
  encryption: 'tls' | 'ssl' | 'none';
  username: string;
  hasPassword: boolean;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CrmEmailBlast {
  id: string;
  listId?: string | null;
  listName: string;
  title: string;
  subject: string;
  previewText?: string;
  contentHtml: string;
  senderName: string;
  senderEmail: string;
  senderProfileId?: string | null;
  recipientIds: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  scheduledAt?: string | null;
  sentAt?: string | null;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  createdAt: string;
}

export interface CrmBlastLog {
  id: string;
  blastId: string;
  subscriberId?: string | null;
  email: string;
  recipientName: string;
  organization: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'BOUNCED';
  errorMessage?: string;
  openedAt?: string | null;
  openCount: number;
  clickedAt?: string | null;
  clickCount: number;
  sentAt?: string | null;
  createdAt: string;
}

export const CALL_SCORE_CRITERIA = [
  {
    key: 'callerName' as const,
    label: "Contact's Name Verified",
    points: 3,
    description: 'Confirmed decision maker or donor full name and role',
  },
  {
    key: 'rfp' as const,
    label: 'Requested Proposal / Impact Brief',
    points: 1,
    description: 'Asked for sponsorship deck, grant proposal, or budget brief',
  },
  {
    key: 'differentContact' as const,
    label: 'Acquired Direct Email / Phone',
    points: 2,
    description: 'Obtained direct mobile number, extension, or personal email',
  },
  {
    key: 'rescheduleFollowup' as const,
    label: 'Scheduled Follow-Up Call',
    points: 2,
    description: 'Agreed on a concrete callback or meeting date & time',
  },
  {
    key: 'referral' as const,
    label: 'Received Warm Referral (Name & Phone)',
    points: 4,
    description: 'Referred to another sponsor, donor, or partner decision maker',
  },
] as const;

export function computeCallScore(breakdown?: Partial<CallScoreBreakdown> | null): number {
  if (!breakdown) return 0;
  let score = 0;
  if (breakdown.callerName) score += 3;
  if (breakdown.rfp) score += 1;
  if (breakdown.differentContact) score += 2;
  if (breakdown.rescheduleFollowup) score += 2;
  if (breakdown.referral) score += 4;
  return Math.min(12, Math.max(0, score));
}

export function getCallScoreMeta(score: number): {
  label: string;
  className: string;
} {
  if (score >= 9) {
    return {
      label: 'Hot Champion',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }
  if (score >= 5) {
    return {
      label: 'Warm Engagement',
      className: 'bg-amber-100 text-amber-800 border-amber-200',
    };
  }
  if (score >= 1) {
    return {
      label: 'Initial Contact',
      className: 'bg-sky-100 text-sky-800 border-sky-200',
    };
  }
  return {
    label: 'Unscored',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  };
}

export const DEAL_STAGES: {
  key: DealStage;
  label: string;
  subtitle: string;
  accent: string;
  badge: string;
  defaultProbability: number;
}[] = [
  {
    key: 'DISCOVERY',
    label: 'Discovery',
    subtitle: 'Initial donor / sponsor outreach',
    accent: 'border-t-slate-400',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    defaultProbability: 20,
  },
  {
    key: 'QUALIFIED',
    label: 'Qualified',
    subtitle: 'Mission alignment confirmed',
    accent: 'border-t-sky-500',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    defaultProbability: 45,
  },
  {
    key: 'PROPOSAL',
    label: 'Proposal Sent',
    subtitle: 'Grant / sponsorship deck shared',
    accent: 'border-t-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    defaultProbability: 65,
  },
  {
    key: 'NEGOTIATION',
    label: 'Pledge Review',
    subtitle: 'Due diligence & MoU sign-off',
    accent: 'border-t-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    defaultProbability: 85,
  },
  {
    key: 'WON',
    label: 'Funded / Won',
    subtitle: 'Pledge or grant secured',
    accent: 'border-t-[#558b1a]',
    badge: 'bg-[#f4faec] text-[#558b1a] border-[#d6f0b0]',
    defaultProbability: 100,
  },
];

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'CURIOUS',
  'CONTACTED',
  'PROPOSAL',
  'AWAITING RESPONSE',
  'MEETING BOOKED',
  'QUALIFIED',
  'NOT READY',
  'CONVERTED',
  'ARCHIVED',
];

export const OUTCOME_CONFIG: Record<
  CallOutcome,
  { label: string; pill: string; group: 'connected' | 'unreached' | 'negative' }
> = {
  CONNECTED_INTERESTED: {
    label: 'Interested & Aligned',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    group: 'connected',
  },
  CONNECTED_NEGOTIATING: {
    label: 'Proposal / Pledge Review',
    pill: 'bg-purple-50 text-purple-700 border-purple-200',
    group: 'connected',
  },
  CONNECTED_WON: {
    label: 'Commitment Secured',
    pill: 'bg-[#f4faec] text-[#558b1a] border-[#d6f0b0]',
    group: 'connected',
  },
  CONNECTED_FOLLOWUP: {
    label: 'Callback Scheduled',
    pill: 'bg-sky-50 text-sky-700 border-sky-200',
    group: 'connected',
  },
  NOT_INTERESTED: {
    label: 'Not Interested',
    pill: 'bg-red-50 text-red-700 border-red-200',
    group: 'negative',
  },
  VOICEMAIL: {
    label: 'Left Voicemail',
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    group: 'unreached',
  },
  NO_ANSWER: {
    label: 'No Answer / Ringing',
    pill: 'bg-gray-100 text-gray-600 border-gray-200',
    group: 'unreached',
  },
  BUSY: {
    label: 'Line Busy',
    pill: 'bg-gray-100 text-gray-600 border-gray-200',
    group: 'unreached',
  },
  WRONG_NUMBER: {
    label: 'Wrong Number',
    pill: 'bg-red-50 text-red-700 border-red-200',
    group: 'negative',
  },
};

export interface ParsedBulkContact {
  email: string;
  organization: string;
  name: string;
  phone: string;
  linkedinUrl: string;
}

function isLikelyPhone(str: string): boolean {
  const cleaned = str.replace(/[\s\-\(\)\.]/g, '');
  return /^(\+?[0-9]{7,15})$/.test(cleaned);
}

function isLikelyUrl(str: string): boolean {
  return /^https?:\/\/[^\s]+$/i.test(str) || /^www\.[^\s]+$/i.test(str) || /linkedin\.com/i.test(str);
}

function hasOrgIndicator(str: string): boolean {
  return /\b(foundation|charity|ngo|trust|church|ministry|school|college|university|ltd|limited|group|holdings|plc|corp|corporation|inc|llc|enterprises|services|technologies|solutions|bank|agency|global|international|association|network)\b/i.test(
    str
  );
}

export function parseBulkContacts(text: string, defaultOrg = ''): ParsedBulkContact[] {
  if (!text.trim()) return [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const results: ParsedBulkContact[] = [];
  const seenEmails = new Set<string>();

  for (const rawLine of lines) {
    if (/^(email|name|full\s*name|organization|company)[,\t|;]/i.test(rawLine)) {
      continue;
    }

    const atMatches = rawLine.match(/@/g) || [];
    if (atMatches.length > 1 && !rawLine.includes('http')) {
      for (const piece of rawLine.split(',').map((p) => p.trim())) {
        if (piece.includes('@')) {
          const email = piece.toLowerCase();
          if (!seenEmails.has(email)) {
            seenEmails.add(email);
            results.push({ email, organization: defaultOrg.trim(), name: '', phone: '', linkedinUrl: '' });
          }
        }
      }
      continue;
    }

    let line = rawLine;
    let extractedName = '';
    const angleMatch = line.match(/^(.*?)[<]([^>]+@[^>]+)[>](.*)$/);
    if (angleMatch) {
      extractedName = angleMatch[1].trim().replace(/^["']|["']$/g, '');
      const em = angleMatch[2].trim().toLowerCase();
      const rest = angleMatch[3].trim().replace(/^[,;\t]+/, '').trim();
      line = `${rest ? `${rest}, ` : ''}${em}`;
    }

    const parts = line
      .split(/[,\t|;]+/)
      .map((p) => p.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);

    let linkedinUrl = '';
    const urlIdx = parts.findIndex((p) => isLikelyUrl(p));
    if (urlIdx !== -1) {
      linkedinUrl = parts[urlIdx];
      parts.splice(urlIdx, 1);
    }

    let email = '';
    const emailIdx = parts.findIndex((p) => p.includes('@') && !p.startsWith('http'));
    if (emailIdx !== -1) {
      email = parts[emailIdx].toLowerCase();
      parts.splice(emailIdx, 1);
      if (seenEmails.has(email)) continue;
      seenEmails.add(email);
    }

    let phone = '';
    const phoneIdx = parts.findIndex((p) => isLikelyPhone(p));
    if (phoneIdx !== -1) {
      phone = parts[phoneIdx];
      parts.splice(phoneIdx, 1);
    }

    if (!email && !phone) continue;

    let organization = defaultOrg.trim();
    let name = extractedName;

    if (parts.length === 1) {
      if (hasOrgIndicator(parts[0])) {
        organization = parts[0];
      } else {
        name = name || parts[0];
      }
    } else if (parts.length >= 2) {
      const [p0, p1] = parts;
      if (hasOrgIndicator(p0) && !hasOrgIndicator(p1)) {
        organization = p0;
        name = name || p1;
      } else if (hasOrgIndicator(p1) && !hasOrgIndicator(p0)) {
        organization = p1;
        name = name || p0;
      } else {
        name = name || p0;
        organization = organization || p1;
      }
    }

    results.push({ email, organization, name, phone, linkedinUrl });
  }

  return results;
}

export function parseNumericValue(valueStr: string): number {
  const cleaned = String(valueStr || '').replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatCurrencyAmount(amount: number, currency = 'NGN'): string {
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '₦';
  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}
