import { NextRequest, NextResponse } from 'next/server';
import { sendFormCompletedNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, category, hub, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const notificationResult = await sendFormCompletedNotification({
      formType: 'support',
      formTitle: 'General Support & Secretariat Inquiry',
      submitterName: name,
      submitterEmail: email,
      submitterPhone: phone || undefined,
      country: hub || 'Nigeria HQ',
      details: {
        'Category / Topic': category || 'General Support',
        'Regional Hub': hub || 'Nigeria HQ',
        'Message': message,
      },
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Support inquiry logged and notification sent to ADMIN_EMAIL',
      notification: notificationResult,
    });
  } catch (error: any) {
    console.error('Error handling support inquiry:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
