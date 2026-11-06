import { NextResponse } from "next/server";

export async function GET() {
  const venmoUrl =
    process.env.NEXT_PUBLIC_VENMO_URL ||
    process.env.VENMO_URL ||
    "https://venmo.com/code?user_id=4722579893912988961&created=1793745430.825995&printed=1";

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
