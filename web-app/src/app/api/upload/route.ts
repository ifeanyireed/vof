import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBlob = file as Blob;

    // 1. If an upstream remote endpoint is explicitly specified (e.g. Vercel backend with Cloudinary credentials)
    const remoteBackend = process.env.UPSTREAM_API_URL || 'https://vof-gamma.vercel.app/api';
    if (remoteBackend && remoteBackend.startsWith('http')) {
      const uploadUrl = `${remoteBackend.replace(/\/+$/, '')}/upload`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const upstreamRes = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (upstreamRes.ok) {
          const data = await upstreamRes.json();
          if (data && data.url) {
            return NextResponse.json(data);
          }
        }
      } catch (upstreamErr) {
        console.warn('Upstream upload proxy notice, generating resilient Data URL:', upstreamErr);
      }
    }

    // 2. Resilient fallback: Convert file buffer into clean Data URL
    const bytes = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = (file as any).type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      format: mimeType,
      bytes: buffer.length,
      fallback: true,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
