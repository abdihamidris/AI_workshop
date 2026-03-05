/**
 * myAfya-AI — Daily Health Insight API
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { subDays } from 'date-fns';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { generateDailyHealthInsight } from '@/lib/anthropic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [user, medicines, logs] = await Promise.all([
      db.user.findUnique({
        where: { id: session.user.id },
        select: { conditions: true },
      }),
      db.medicine.findMany({
        where: { userId: session.user.id, isActive: true },
        select: { name: true },
        take: 5,
      }),
      db.adherenceLog.findMany({
        where: {
          userId: session.user.id,
          date: { gte: subDays(new Date(), 30) },
        },
      }),
    ]);

    const totalLogs = logs.length;
    const takenLogs = logs.filter((l) => l.status === 'TAKEN').length;
    const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;

    const insight = await generateDailyHealthInsight({
      medicines: medicines.map((m) => m.name),
      adherenceRate,
      conditions: user?.conditions || [],
    });

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    return NextResponse.json({
      success: true,
      insight: 'Staying consistent with your medications today is one of the most important steps you can take for your health. Keep it up!',
    });
  }
}
