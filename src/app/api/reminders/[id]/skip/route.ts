/**
 * myAfya-AI — Mark Reminder as Skipped
 * Next.js 16: params is a Promise
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { startOfDay } from 'date-fns';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const reason = body.reason as string | undefined;

    const reminder = await db.reminder.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!reminder) {
      return NextResponse.json({ success: false, error: 'Reminder not found' }, { status: 404 });
    }

    const updated = await db.reminder.update({
      where: { id },
      data: {
        status: 'SKIPPED',
        skippedAt: new Date(),
        skipReason: reason,
      },
    });

    // Log adherence
    await db.adherenceLog.upsert({
      where: {
        userId_medicineId_date: {
          userId: session.user.id,
          medicineId: reminder.medicineId,
          date: startOfDay(reminder.scheduledAt),
        },
      },
      create: {
        userId: session.user.id,
        medicineId: reminder.medicineId,
        date: startOfDay(reminder.scheduledAt),
        status: 'SKIPPED',
      },
      update: { status: 'SKIPPED' },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update reminder' }, { status: 500 });
  }
}
