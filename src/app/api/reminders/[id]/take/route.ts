/**
 * myAfya-AI — Mark Reminder as Taken
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
    const reminder = await db.reminder.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!reminder) {
      return NextResponse.json({ success: false, error: 'Reminder not found' }, { status: 404 });
    }

    const now = new Date();

    const updated = await db.reminder.update({
      where: { id },
      data: { status: 'TAKEN', takenAt: now },
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
        status: 'TAKEN',
      },
      update: { status: 'TAKEN' },
    });

    // Decrement pill count
    await db.medicine.updateMany({
      where: {
        id: reminder.medicineId,
        pillCount: { not: null, gt: 0 },
      },
      data: { pillCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Mark taken error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update reminder' }, { status: 500 });
  }
}
