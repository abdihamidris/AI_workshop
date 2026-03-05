/**
 * myAfya-AI — Reminders API
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO, format } from 'date-fns';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const monthParam = searchParams.get('month');

    let dateFilter: { gte: Date; lte: Date };

    if (monthParam) {
      const date = parseISO(`${monthParam}-01`);
      dateFilter = { gte: startOfMonth(date), lte: endOfMonth(date) };
    } else if (dateParam) {
      const date = parseISO(dateParam);
      dateFilter = { gte: startOfDay(date), lte: endOfDay(date) };
    } else {
      const today = new Date();
      dateFilter = { gte: startOfDay(today), lte: endOfDay(today) };
    }

    const reminders = await db.reminder.findMany({
      where: {
        userId: session.user.id,
        scheduledAt: dateFilter,
      },
      include: {
        medicine: {
          select: {
            id: true, name: true, dosage: true, unit: true,
            color: true, form: true, instructions: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // If fetching monthly, group by date
    if (monthParam) {
      const grouped: Record<string, typeof reminders> = {};
      for (const reminder of reminders) {
        const dateKey = format(reminder.scheduledAt, 'yyyy-MM-dd');
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(reminder);
      }
      return NextResponse.json({
        success: true,
        reminders: grouped,
      });
    }

    return NextResponse.json({
      success: true,
      data: reminders.map((r) => ({
        ...r,
        scheduledAt: r.scheduledAt.toISOString(),
        takenAt: r.takenAt?.toISOString(),
        skippedAt: r.skippedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reminders' }, { status: 500 });
  }
}
