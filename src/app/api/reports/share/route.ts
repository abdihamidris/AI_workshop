/**
 * myAfya-AI — Doctor Share API
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { addDays } from 'date-fns';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const share = await db.doctorShare.create({
      data: {
        userId: session.user.id,
        doctorName: body.doctorName,
        doctorEmail: body.doctorEmail,
        expiresAt: addDays(new Date(), body.expiryDays || 30),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${appUrl}/shared/${share.shareToken}`;

    return NextResponse.json({ success: true, shareUrl, share });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create share link' }, { status: 500 });
  }
}
