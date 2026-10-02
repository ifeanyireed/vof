import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set({
    name: 'vof_admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function GET(_req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set({
    name: 'vof_admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
