/**
 * myAfya-AI — Reports API
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { subDays, format, startOfDay } from 'date-fns';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') || '30');
  const startDate = subDays(new Date(), days);

  try {
    const [logs, medicines, reminders] = await Promise.all([
      db.adherenceLog.findMany({
        where: { userId: session.user.id, date: { gte: startDate } },
        include: { medicine: { select: { name: true, color: true } } },
        orderBy: { date: 'asc' },
      }),
      db.medicine.findMany({
        where: { userId: session.user.id, isActive: true },
        select: { id: true, name: true, color: true },
      }),
      db.reminder.findMany({
        where: {
          userId: session.user.id,
          scheduledAt: { gte: startDate },
        },
        select: { status: true, scheduledAt: true, medicineId: true },
      }),
    ]);

    // Daily adherence
    const dailyData: Record<string, { date: string; taken: number; missed: number; skipped: number; rate: number }> = {};

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
      dailyData[date] = { date, taken: 0, missed: 0, skipped: 0, rate: 0 };
    }

    for (const log of logs) {
      const dateKey = format(log.date, 'yyyy-MM-dd');
      if (dailyData[dateKey]) {
        dailyData[dateKey][log.status.toLowerCase() as 'taken' | 'missed' | 'skipped']++;
      }
    }

    for (const day of Object.values(dailyData)) {
      const total = day.taken + day.missed + day.skipped;
      day.rate = total > 0 ? Math.round((day.taken / total) * 100) : 0;
    }

    // Per-medicine stats
    const medicineStats = medicines.map((med) => {
      const medLogs = logs.filter((l) => l.medicine.name === med.name);
      const taken = medLogs.filter((l) => l.status === 'TAKEN').length;
      const total = medLogs.length;
      return {
        ...med,
        taken,
        missed: medLogs.filter((l) => l.status === 'MISSED').length,
        skipped: medLogs.filter((l) => l.status === 'SKIPPED').length,
        adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
      };
    });

    // Overall stats
    const totalTaken = logs.filter((l) => l.status === 'TAKEN').length;
    const totalMissed = logs.filter((l) => l.status === 'MISSED').length;
    const totalSkipped = logs.filter((l) => l.status === 'SKIPPED').length;
    const total = totalTaken + totalMissed + totalSkipped;

    return NextResponse.json({
      success: true,
      data: {
        daily: Object.values(dailyData),
        medicines: medicineStats,
        summary: {
          totalTaken,
          totalMissed,
          totalSkipped,
          overallRate: total > 0 ? Math.round((totalTaken / total) * 100) : 0,
          period: days,
        },
      },
    });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate report' }, { status: 500 });
  }
}
