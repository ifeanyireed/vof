import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/server-auth';
import { AdminRole, AdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Query admin user
    const rows = await sql`
      SELECT id, email, password_hash, full_name, role, avatar_url, is_active, last_login, created_at, updated_at
      FROM admin_users
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const userRow = rows[0];

    if (!userRow.is_active) {
      return NextResponse.json(
        { error: 'This account has been deactivated. Please contact your Super Administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isMatch = verifyPassword(password, userRow.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    // Update last_login
    await sql`
      UPDATE admin_users
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = ${userRow.id};
    `;

    const user: AdminUser = {
      id: userRow.id,
      email: userRow.email,
      fullName: userRow.full_name,
      role: userRow.role as AdminRole,
      avatarUrl: userRow.avatar_url || '',
      isActive: Boolean(userRow.is_active),
      lastLogin: new Date().toISOString(),
      createdAt: userRow.created_at ? new Date(userRow.created_at).toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'vof_admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred: ' + (error.message || error) },
      { status: 500 }
    );
  }
}
