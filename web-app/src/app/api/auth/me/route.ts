import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
