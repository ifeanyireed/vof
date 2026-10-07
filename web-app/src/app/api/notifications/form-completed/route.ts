import { NextRequest, NextResponse } from 'next/server';
import { sendFormCompletedNotification, FormNotificationPayload } from '@/lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FormNotificationPayload;

    if (!body || !body.formType || !body.submitterName || !body.submitterEmail) {
      return NextResponse.json(
        { error: 'formType, submitterName, and submitterEmail are required fields' },
        { status: 400 }
      );
    }

    const result = await sendFormCompletedNotification(body);

    return NextResponse.json({
      success: true,
      message: `Notification dispatched for ${body.formTitle || body.formType}`,
      result,
    });
  } catch (error: any) {
    console.error('Error handling form completion notification:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal notification dispatch error' },
      { status: 500 }
    );
  }
}
