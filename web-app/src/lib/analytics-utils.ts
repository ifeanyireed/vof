// Helper utilities for traffic analytics: User-Agent parsing, IP masking, Geolocation helpers

export const COUNTRY_NAMES: Record<string, string> = {
  NG: 'Nigeria',
  US: 'United States',
  GB: 'United Kingdom',
  RW: 'Rwanda',
  CA: 'Canada',
  GH: 'Ghana',
  ZA: 'South Africa',
  KE: 'Kenya',
  DE: 'Germany',
  FR: 'France',
  AE: 'United Arab Emirates',
  IE: 'Ireland',
  AU: 'Australia',
  IN: 'India',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  BR: 'Brazil',
  CN: 'China',
  JP: 'Japan',
  SG: 'Singapore',
  EG: 'Egypt',
  UG: 'Uganda',
  TZ: 'Tanzania',
  CM: 'Cameroon',
  CI: "Côte d'Ivoire",
  SN: 'Senegal',
  BJ: 'Benin',
  TG: 'Togo',
  LR: 'Liberia',
  SL: 'Sierra Leone',
  GM: 'Gambia',
};

export const COUNTRY_FLAGS: Record<string, string> = {
  NG: '🇳🇬',
  US: '🇺🇸',
  GB: '🇬🇧',
  RW: '🇷🇼',
  CA: '🇨🇦',
  GH: '🇬🇭',
  ZA: '🇿🇦',
  KE: '🇰🇪',
  DE: '🇩🇪',
  FR: '🇫🇷',
  AE: '🇦🇪',
  IE: '🇮🇪',
  AU: '🇦🇺',
  IN: '🇮🇳',
  NL: '🇳🇱',
  IT: '🇮🇹',
  ES: '🇪🇸',
  BR: '🇧🇷',
  CN: '🇨🇳',
  JP: '🇯🇵',
  SG: '🇸🇬',
  EG: '🇪🇬',
  UG: '🇺🇬',
  TZ: '🇹🇿',
  CM: '🇨🇲',
  CI: '🇨🇮',
  SN: '🇸🇳',
  BJ: '🇧🇯',
  TG: '🇹🇬',
  LR: '🇱🇷',
  SL: '🇸🇱',
  GM: '🇬🇲',
};

export function getCountryFlag(code?: string | null): string {
  if (!code) return '🌐';
  const upper = code.toUpperCase();
  return COUNTRY_FLAGS[upper] || '🌐';
}

export function getCountryName(code?: string | null): string {
  if (!code) return 'Global / Unknown';
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] || upper;
}

export function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const botRegex =
    /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebookexternalhit|whatsapp|telegrambot|twitterbot|slackbot|applebot|semrush|ahrefs|mj12bot|dotbot|petalbot|headlesschrome|phantomjs|lighthouse/i;
  return botRegex.test(userAgent);
}

export function maskIp(ip?: string | null): string {
  if (!ip) return '127.0.0.1';
  // Check for IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
  }
  // Check for IPv6
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:****`;
  }
  return '***.***.***.***';
}

export function parseDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (!ua) return 'desktop';
  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function parseOS(ua: string): string {
  if (!ua) return 'Unknown OS';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows phone/i.test(ua)) return 'Windows Phone';
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac os|macintosh/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/cros/i.test(ua)) return 'Chrome OS';
  return 'Other OS';
}

export function parseBrowser(ua: string): string {
  if (!ua) return 'Unknown Browser';
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/samsungbrowser/i.test(ua)) return 'Samsung Internet';
  if (/chrome\/|crios\//i.test(ua) && !/edg\//i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua) && !/chrome\/|crios\//i.test(ua)) return 'Safari';
  if (/firefox\/|fxios\//i.test(ua)) return 'Firefox';
  return 'Other';
}

export function extractDomain(url?: string | null): string {
  if (!url) return 'Direct';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host.includes('google')) return 'Google Search';
    if (host.includes('bing')) return 'Bing Search';
    if (host.includes('yahoo')) return 'Yahoo Search';
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) return 'X / Twitter';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('whatsapp')) return 'WhatsApp';
    if (host.includes('youtube')) return 'YouTube';
    if (host.includes('tiktok')) return 'TikTok';
    return host;
  } catch {
    return 'Referral';
  }
}
