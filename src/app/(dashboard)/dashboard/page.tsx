/**
 * myAfya-AI — Main Dashboard Page
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from 'date-fns';

async function getDashboardData(userId: string) {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const [
    medicines,
    todayReminders,
    recentLogs,
    refillAlerts,
    weeklyLogs,
    user,
  ] = await Promise.all([
    // Active medicines
    db.medicine.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),

    // Today's reminders
    db.reminder.findMany({
      where: {
        userId,
        scheduledAt: { gte: todayStart, lte: todayEnd },
      },
      include: { medicine: true },
      orderBy: { scheduledAt: 'asc' },
    }),

    // Last 30 days adherence
    db.adherenceLog.findMany({
      where: {
        userId,
        date: { gte: subDays(today, 30) },
      },
      orderBy: { date: 'desc' },
    }),

    // Unread refill alerts
    db.refillAlert.findMany({
      where: { userId, isRead: false, isDismissed: false },
      include: { medicine: true },
      take: 5,
    }),

    // Weekly adherence for chart (last 7 days)
    db.adherenceLog.groupBy({
      by: ['date', 'status'],
      where: {
        userId,
        date: { gte: subDays(today, 6) },
      },
      _count: { status: true },
    }),

    // User info
    db.user.findUnique({
      where: { id: userId },
      select: { name: true, allergies: true, conditions: true },
    }),
  ]);

  // Calculate stats
  const totalDoses = todayReminders.length;
  const takenToday = todayReminders.filter((r) => r.status === 'TAKEN').length;
  const takenLogs = recentLogs.filter((l) => l.status === 'TAKEN').length;
  const totalLogs = recentLogs.length;
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;

  // Calculate streak
  let streak = 0;
  let checkDate = subDays(today, 1);
  while (streak < 30) {
    const dayLogs = recentLogs.filter(
      (l) => l.date.toDateString() === checkDate.toDateString()
    );
    if (dayLogs.length === 0 || dayLogs.some((l) => l.status === 'MISSED')) break;
    const dayTaken = dayLogs.every((l) => l.status === 'TAKEN');
    if (!dayTaken) break;
    streak++;
    checkDate = subDays(checkDate, 1);
  }

  return {
    medicines: medicines.map(m => ({
      ...m,
      startDate: m.startDate.toISOString(),
      endDate: m.endDate?.toISOString(),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    })),
    todayReminders: todayReminders.map(r => ({
      ...r,
      scheduledAt: r.scheduledAt.toISOString(),
      takenAt: r.takenAt?.toISOString(),
      skippedAt: r.skippedAt?.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      medicine: {
        ...r.medicine,
        startDate: r.medicine.startDate.toISOString(),
        endDate: r.medicine.endDate?.toISOString(),
        createdAt: r.medicine.createdAt.toISOString(),
        updatedAt: r.medicine.updatedAt.toISOString(),
      }
    })),
    stats: {
      totalMedicines: medicines.length,
      todayDoses: totalDoses,
      takenToday,
      adherenceRate,
      streak,
      upcomingRefills: refillAlerts.length,
    },
    refillAlerts: refillAlerts.map(a => ({
      ...a,
      alertAt: a.alertAt.toISOString(),
      refillAt: a.refillAt?.toISOString(),
      createdAt: a.createdAt.toISOString(),
      medicine: {
        ...a.medicine,
        startDate: a.medicine.startDate.toISOString(),
        endDate: a.medicine.endDate?.toISOString(),
        createdAt: a.medicine.createdAt.toISOString(),
        updatedAt: a.medicine.updatedAt.toISOString(),
      }
    })),
    weeklyLogs,
    user: user || { name: 'User', allergies: [], conditions: [] },
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const data = await getDashboardData(session.user.id);

  return <DashboardClient data={data} userName={session.user.name || 'User'} />;
}
