import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vof-gamma.vercel.app/api';
    const baseUrl = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`;
    const uploadUrl = `${baseUrl}/upload`;

    const upstreamRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      return NextResponse.json({ error: `Upload failed: ${errText}` }, { status: upstreamRes.status });
    }

    const data = await upstreamRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Upload proxy error:', error);
    return NextResponse.json({ error: error.message || 'Upload proxy failed' }, { status: 500 });
  }
}
