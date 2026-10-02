import crypto from 'crypto';
import { sql } from '@/lib/db';
import { AdminRole, AdminUser } from './auth';

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'vof-secret-super-key-2026-veronica-onyeneke-foundation-jwt-secure';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, key] = stored.split(':');
    if (!salt || !key) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'));
  } catch {
    return false;
  }
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: AdminRole;
  exp: number; // Unix timestamp
}

function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function signToken(payload: Omit<TokenPayload, 'exp'>, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload: TokenPayload = { ...payload, exp };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(dataToSign)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(base64urlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAuthUserFromRequest(req: Request): Promise<AdminUser | null> {
  let token: string | null = null;

  // 1. Check Authorization Header
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check Cookie Header
  if (!token) {
    const cookieHeader = req.headers.get('cookie') || req.headers.get('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/vof_admin_token=([^;]+)/);
      if (match && match[1]) {
        token = decodeURIComponent(match[1].trim());
      }
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  try {
    const rows = await sql`
      SELECT id, email, full_name, role, avatar_url, is_active, last_login, created_at, updated_at
      FROM admin_users
      WHERE id = ${payload.userId} AND is_active = true
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) return null;

    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: row.role as AdminRole,
      avatarUrl: row.avatar_url || '',
      isActive: Boolean(row.is_active),
      lastLogin: row.last_login ? new Date(row.last_login).toISOString() : undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    };
  } catch (err) {
    console.error('Error fetching admin user by token:', err);
    return null;
  }
}
