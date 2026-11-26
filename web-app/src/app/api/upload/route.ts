import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
};

function resolveMimeType(file: File | Blob): string {
  const rawType = (file.type || '').trim().toLowerCase();
  if (rawType && rawType !== 'application/octet-stream') {
    return rawType;
  }
  const name = ((file as File).name || '').toLowerCase();
  const ext = name.includes('.') ? name.split('.').pop() || '' : '';
  return EXT_TO_MIME[ext] || 'image/jpeg';
}

function getCloudinaryCredentials(): { cloudName: string; apiKey: string; apiSecret: string } | null {
  const url = process.env.CLOUDINARY_URL;
  if (url && url.startsWith('cloudinary://')) {
    try {
      const parsed = new URL(url);
      if (parsed.username && parsed.password && parsed.hostname) {
        return {
          apiKey: decodeURIComponent(parsed.username),
          apiSecret: decodeURIComponent(parsed.password),
          cloudName: parsed.hostname,
        };
      }
    } catch {
      // fall through to individual env vars
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'vof_uploads').trim() || 'vof_uploads';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBlob = file as File;
    const bytes = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = resolveMimeType(fileBlob);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    const originalName = fileBlob.name || `upload_${Date.now()}`;

    // 1. Direct Cloudinary upload when credentials are available in environment
    const cld = getCloudinaryCredentials();
    if (cld) {
      try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}${cld.apiSecret}`;
        const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

        const cldForm = new FormData();
        cldForm.append('file', dataUrl);
        cldForm.append('api_key', cld.apiKey);
        cldForm.append('timestamp', timestamp);
        cldForm.append('folder', folder);
        cldForm.append('signature', signature);

        const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${cld.cloudName}/auto/upload`, {
          method: 'POST',
          body: cldForm,
        });

        if (cldRes.ok) {
          const cldData = await cldRes.json();
          if (cldData?.secure_url) {
            return NextResponse.json({
              success: true,
              url: cldData.secure_url,
              format: cldData.format || mimeType,
              bytes: cldData.bytes || buffer.length,
              filename: originalName,
              provider: 'cloudinary',
            });
          }
        } else {
          const errText = await cldRes.text().catch(() => '');
          console.warn('Direct Cloudinary upload returned non-OK:', cldRes.status, errText.slice(0, 200));
        }
      } catch (cldErr) {
        console.warn('Direct Cloudinary upload error, trying fallback:', cldErr);
      }
    }

    // 2. Optional upstream proxy (only when explicitly configured AND not pointing back to this same host)
    const remoteBackend = process.env.UPSTREAM_API_URL;
    if (remoteBackend && remoteBackend.startsWith('http')) {
      const uploadUrl = `${remoteBackend.replace(/\/+$/, '')}/upload`;
      let isSameHost = false;
      try {
        isSameHost = new URL(uploadUrl).host === new URL(req.url).host;
      } catch {
        isSameHost = false;
      }

      if (!isSameHost) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);

          const proxyForm = new FormData();
          proxyForm.append('file', new Blob([buffer], { type: mimeType }), originalName);
          proxyForm.append('folder', folder);

          const upstreamRes = await fetch(uploadUrl, {
            method: 'POST',
            body: proxyForm,
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
          console.warn('Upstream upload proxy failed, falling back to Data URL:', upstreamErr);
        }
      }
    }

    // 3. Resilient fallback: Clean Data URL with verified MIME type
    return NextResponse.json({
      success: true,
      url: dataUrl,
      format: mimeType,
      bytes: buffer.length,
      filename: originalName,
      fallback: true,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
