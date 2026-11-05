import { NextResponse } from "next/server";

export async function GET() {
  const venmoUrl = process.env.NEXT_PUBLIC_VENMO_URL || process.env.VENMO_URL;
  if (!venmoUrl) {
    return new NextResponse("Venmo URL not configured", { status: 404 });
  }

  const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    venmoUrl
  )}&format=svg`;

  try {
    const res = await fetch(qrServiceUrl, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.redirect(qrServiceUrl);
    }
    const svgData = await res.text();
    return new NextResponse(svgData, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.redirect(qrServiceUrl);
  }
}
