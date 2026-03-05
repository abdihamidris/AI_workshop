/**
 * myAfya-AI — Dashboard Client Component
 * Green health theme · Doctor avatar · Pill visuals · Lively UI
 */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Activity, Pill, CheckCircle2, TrendingUp, Flame,
  AlertTriangle, Clock, ChevronRight, Brain, Plus,
  Calendar, Target, Heart, ArrowRight, Stethoscope,
  Star, Award, Zap, Shield, ThumbsUp
} from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, AreaChart, Area
} from 'recharts';
import { format, subDays } from 'date-fns';
import { cn, formatTime, getMedicineFormIcon, getAdherenceLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DashboardClientProps {
  data: {
    medicines: unknown[];
    todayReminders: unknown[];
    stats: {
      totalMedicines: number;
      todayDoses: number;
      takenToday: number;
      adherenceRate: number;
      streak: number;
      upcomingRefills: number;
    };
    refillAlerts: unknown[];
    weeklyLogs: unknown[];
    user: { name: string; allergies: string[]; conditions: string[] };
  };
  userName: string;
}

// Pill shape SVG component
function PillIcon({ color = '#22c55e', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 40 20" fill="none">
      <rect x="0" y="2" width="40" height="16" rx="8" fill={color} opacity="0.15" />
      <rect x="0" y="2" width="20" height="16" rx="8" ry="8" fill={color} opacity="0.4" />
      <rect x="20" y="2" width="20" height="16" rx="8" ry="8" fill={color} opacity="0.7" />
      <line x1="20" y1="2" x2="20" y2="18" stroke="white" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

// Doctor card data
const doctors = [
  { name: 'Dr. James Carter', specialty: 'General Physician', initials: 'JC', color: 'from-green-500 to-emerald-600', medicines: ['Metformin', 'Lisinopril', 'Aspirin'] },
  { name: 'Dr. Lisa Wong', specialty: 'Endocrinologist', initials: 'LW', color: 'from-teal-500 to-green-600', medicines: ['Atorvastatin', 'Vitamin D3'] },
];

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

// Medicine colors palette
const PILL_COLORS = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#15803d'];

export function DashboardClient({ data, userName: initialName }: DashboardClientProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || initialName;
  const { stats, todayReminders, refillAlerts } = data;
  const [reminders, setReminders] = useState<any[]>(todayReminders as any[]);
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { fetchInsight(); }, []);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetch('/api/ai-chat/insight');
      if (res.ok) { const d = await res.json(); setAiInsight(d.insight); }
    } catch {
      setAiInsight("Stay consistent with your medications today for the best health outcomes. You're doing great!");
    } finally { setLoadingInsight(false); }
  };

  const handleMarkTaken = async (reminderId: string) => {
    try {
      const res = await fetch(`/api/reminders/${reminderId}/take`, { method: 'POST' });
      if (res.ok) {
        setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, status: 'TAKEN', takenAt: new Date().toISOString() } : r));
        toast.success('💊 Dose taken! Great job keeping up!');
      }
    } catch { toast.error('Failed to update status'); }
  };

  const handleMarkSkipped = async (reminderId: string) => {
    try {
      const res = await fetch(`/api/reminders/${reminderId}/skip`, { method: 'POST' });
      if (res.ok) {
        setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, status: 'SKIPPED' } : r));
        toast('Skipped for now. Try not to miss too many!', { icon: '⏭️' });
      }
    } catch { toast.error('Failed to update status'); }
  };

  // Weekly chart data
  const weeklyChartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      day: format(date, 'EEE'),
      taken: Math.floor(Math.random() * 2) + 3,
      missed: Math.floor(Math.random() * 2),
      rate: Math.floor(Math.random() * 20) + 78,
    };
  });

  const upcomingReminders = reminders.filter((r: any) => r.status === 'PENDING')
    .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 4);

  const pastReminders = reminders.filter((r: any) => r.status !== 'PENDING')
    .sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 4);

  const greeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return '🌅 Good morning';
    if (h < 17) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  const adherenceEmoji = stats.adherenceRate >= 90 ? '🏆' : stats.adherenceRate >= 75 ? '👍' : '💪';

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* ─── Welcome Banner ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600" />
        <div className="absolute inset-0 bg-dots opacity-20" />
        {/* Floating pills decoration */}
        <div className="absolute right-8 top-4 opacity-20 rotate-12 hidden sm:block">
          <PillIcon color="white" size={60} />
        </div>
        <div className="absolute right-32 bottom-4 opacity-15 -rotate-6 hidden sm:block">
          <PillIcon color="white" size={40} />
        </div>
        <div className="absolute right-16 top-1/2 opacity-10 rotate-45 hidden lg:block">
          <PillIcon color="white" size={35} />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {format(currentTime, 'EEEE, MMMM d · h:mm a')}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                {greeting()}, {userName.split(' ')[0]}! 👋
              </h2>
              <p className="text-green-100 text-sm max-w-md">
                {stats.takenToday === stats.todayDoses && stats.todayDoses > 0
                  ? "🎉 Amazing! You've taken all your medications today!"
                  : `You have ${stats.todayDoses - stats.takenToday} medication${stats.todayDoses - stats.takenToday !== 1 ? 's' : ''} remaining. Stay on track!`
                }
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/medicines/add" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/25 transition-all border border-white/20">
                <Plus className="w-4 h-4" /> Add Medicine
              </Link>
              <Link href="/ai-assistant" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-green-700 text-sm font-bold hover:bg-green-50 transition-all shadow-lg">
                <Brain className="w-4 h-4" /> Ask AI
              </Link>
            </div>
          </div>

          {/* Progress */}
          {stats.todayDoses > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-green-100 mb-2">
                <span className="flex items-center gap-1.5"><Pill className="w-3.5 h-3.5" /> Today's progress</span>
                <span className="font-bold">{stats.takenToday} of {stats.todayDoses} doses taken {adherenceEmoji}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.todayDoses > 0 ? (stats.takenToday / stats.todayDoses) * 100 : 0}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full shadow-inner"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Pill,
            label: "Today's Doses",
            value: `${stats.takenToday}/${stats.todayDoses}`,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            desc: `${stats.todayDoses - stats.takenToday} remaining`,
            pill: true,
          },
          {
            icon: Target,
            label: '30-Day Adherence',
            value: `${stats.adherenceRate}%`,
            color: stats.adherenceRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            desc: getAdherenceLabel(stats.adherenceRate),
          },
          {
            icon: Flame,
            label: 'Current Streak',
            value: `${stats.streak} days`,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            desc: stats.streak > 0 ? 'Keep going! 🔥' : 'Start today!',
          },
          {
            icon: Heart,
            label: 'Active Medicines',
            value: String(stats.totalMedicines),
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            desc: stats.upcomingRefills > 0 ? `${stats.upcomingRefills} refill due ⚠️` : 'All stocked ✅',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate="visible"
              className={cn('glass-card p-4 sm:p-5 border group hover:scale-[1.02] transition-transform cursor-default', card.border)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.bg)}>
                  <Icon className={cn('w-5 h-5', card.color)} />
                </div>
                {card.pill && (
                  <div className="opacity-40 group-hover:opacity-70 transition-opacity">
                    <PillIcon color="#22c55e" size={32} />
                  </div>
                )}
              </div>
              <p className={cn('text-2xl font-black', card.color)}>{card.value}</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{card.label}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Today's Schedule */}
        <motion.div custom={4} variants={CARD_VARIANTS} initial="hidden" animate="visible" className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-500" />
                </div>
                Today's Schedule
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 ml-10">
                {format(currentTime, 'h:mm a')} · {reminders.length} scheduled
              </p>
            </div>
            <Link href="/calendar" className="text-xs text-green-500 hover:text-green-600 flex items-center gap-1 font-medium transition-colors">
              Full calendar <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Upcoming */}
          {upcomingReminders.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Upcoming</p>
              </div>
              <div className="space-y-2">
                {upcomingReminders.map((reminder: any) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onTaken={() => handleMarkTaken(reminder.id)} onSkipped={() => handleMarkSkipped(reminder.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastReminders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Completed</p>
              </div>
              <div className="space-y-2">
                {pastReminders.map((reminder: any) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onTaken={() => handleMarkTaken(reminder.id)} onSkipped={() => handleMarkSkipped(reminder.id)} past />
                ))}
              </div>
            </div>
          )}

          {reminders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Pill className="w-10 h-10 text-green-400 opacity-50" />
              </div>
              <p className="font-semibold text-[var(--text-secondary)]">No medications today</p>
              <Link href="/medicines/add" className="btn-primary mt-4 inline-flex text-sm px-4 py-2">
                <Plus className="w-4 h-4" /> Add Medicine
              </Link>
            </div>
          )}
        </motion.div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* AI Insight */}
          <motion.div custom={5} variants={CARD_VARIANTS} initial="hidden" animate="visible"
            className="glass-card p-5 border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-green-500/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <Brain className="w-4.5 h-4.5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">AI Daily Insight</p>
                <p className="text-xs text-purple-400 font-medium">Powered by Claude ✨</p>
              </div>
            </div>
            {loadingInsight ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="shimmer h-3 rounded" style={{width: `${[100,80,60][i-1]}%`}} />)}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{aiInsight}</p>
            )}
            <Link href="/ai-assistant" className="mt-4 flex items-center gap-1.5 text-xs text-purple-500 hover:text-purple-600 font-semibold transition-colors">
              Ask a health question <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Refill Alerts */}
          {(refillAlerts as any[]).length > 0 && (
            <motion.div custom={6} variants={CARD_VARIANTS} initial="hidden" animate="visible"
              className="glass-card p-5 border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Refill Needed Soon</p>
              </div>
              <div className="space-y-3">
                {(refillAlerts as any[]).slice(0, 3).map((alert: any) => (
                  <div key={alert.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10">
                    <PillIcon color="#f59e0b" size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{alert.medicine?.name}</p>
                      <p className="text-xs text-amber-500 font-medium">{alert.pillsLeft} pills left</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-600">Low</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Adherence mini chart */}
          <motion.div custom={7} variants={CARD_VARIANTS} initial="hidden" animate="visible" className="glass-card p-5">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Weekly Overview
            </h3>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={weeklyChartData} margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(v: number) => [`${v}%`, 'Adherence']}
                />
                <Area type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: '#22c55e', r: 3 }} activeDot={{ r: 5, fill: '#16a34a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>

      {/* ─── Doctor Cards ───────────────────────────────────────────────────── */}
      <motion.div custom={8} variants={CARD_VARIANTS} initial="hidden" animate="visible" className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-green-500" />
            </div>
            Your Healthcare Team
          </h3>
          <Link href="/reports" className="text-xs text-green-500 hover:text-green-600 font-medium flex items-center gap-1 transition-colors">
            Share reports <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-2xl border border-green-500/15 bg-green-500/5 hover:bg-green-500/10 transition-all group"
            >
              {/* Doctor Avatar */}
              <div className="relative flex-shrink-0">
                <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-lg font-black shadow-lg', doc.color)}>
                  {doc.initials}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-[var(--bg-secondary)] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--text-primary)] text-sm">{doc.name}</p>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5">
                  <Stethoscope className="w-3 h-3" /> {doc.specialty}
                </p>
                {/* Prescribed medicines */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {doc.medicines.map((med, j) => (
                    <span key={med} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: PILL_COLORS[j % PILL_COLORS.length] }} />
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toast.success(`Sharing report with ${doc.name}`)}
                className="flex-shrink-0 p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Share report"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Weekly Adherence Chart ───────────────────────────────────────────── */}
      <motion.div custom={9} variants={CARD_VARIANTS} initial="hidden" animate="visible" className="glass-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Medication Adherence
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Last 7 days · taken vs missed</p>
          </div>
          <Link href="/reports" className="text-xs text-green-500 hover:text-green-600 font-medium flex items-center gap-1 transition-colors">
            Full report <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyChartData} barSize={32} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.08)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12px' }}
              cursor={{ fill: 'rgba(34,197,94,0.05)' }}
            />
            <Bar dataKey="taken" name="Taken" fill="#22c55e" radius={[6, 6, 0, 0]} stackId="a" />
            <Bar dataKey="missed" name="Missed" fill="#f87171" radius={[6, 6, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-2">
          {[
            { color: 'bg-green-500', label: 'Taken' },
            { color: 'bg-red-400', label: 'Missed' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${color}`} />
              <span className="text-xs text-[var(--text-secondary)] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Medicine Pill Visual ─────────────────────────────────────────────── */}
      <motion.div custom={10} variants={CARD_VARIANTS} initial="hidden" animate="visible" className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Pill className="w-5 h-5 text-green-500" />
            My Medicine Cabinet
          </h3>
          <Link href="/medicines" className="text-xs text-green-500 hover:text-green-600 font-medium flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: 'Metformin', dose: '500mg', color: '#22c55e', times: 2, form: '💊' },
            { name: 'Lisinopril', dose: '10mg', color: '#16a34a', times: 1, form: '💊' },
            { name: 'Atorvastatin', dose: '20mg', color: '#4ade80', times: 1, form: '💊' },
            { name: 'Aspirin', dose: '81mg', color: '#86efac', times: 1, form: '💊' },
            { name: 'Vitamin D3', dose: '2000IU', color: '#15803d', times: 1, form: '💊' },
          ].map((med, i) => (
            <motion.div
              key={med.name}
              whileHover={{ scale: 1.05, y: -3 }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-green-500/15 bg-green-500/5 cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-shadow"
                style={{ background: `${med.color}20` }}>
                {med.form}
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] truncate w-full">{med.name}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: med.color }}>{med.dose}</p>
                <p className="text-xs text-[var(--text-secondary)]">{med.times}x daily</p>
              </div>
              <PillIcon color={med.color} size={36} />
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

// ─── Reminder Card ────────────────────────────────────────────────────────────

function ReminderCard({ reminder, onTaken, onSkipped, past = false }: {
  reminder: any; onTaken: () => void; onSkipped: () => void; past?: boolean;
}) {
  const time = formatTime(reminder.scheduledAt);
  const color = reminder.medicine?.color || '#22c55e';
  const icon = getMedicineFormIcon(reminder.medicine?.form || 'TABLET');

  const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
    TAKEN:   { label: 'Taken ✓', className: 'badge-taken', icon: '✅' },
    SKIPPED: { label: 'Skipped', className: 'badge-skipped', icon: '⏭️' },
    MISSED:  { label: 'Missed', className: 'badge-missed', icon: '❌' },
    PENDING: { label: 'Pending', className: 'badge-pending', icon: '⏰' },
  };
  const statusInfo = statusConfig[reminder.status] || statusConfig.PENDING;

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 border',
      past
        ? 'bg-[var(--bg-tertiary)]/40 border-transparent opacity-70'
        : 'bg-[var(--bg-tertiary)] border-green-500/15 hover:border-green-500/40 hover:shadow-sm'
    )}>
      {/* Pill icon */}
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
        style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}>
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--text-primary)] truncate">{reminder.medicine?.name}</p>
        <p className="text-xs text-[var(--text-secondary)]">
          {reminder.medicine?.dosage}{reminder.medicine?.unit?.toLowerCase()} · {time}
        </p>
      </div>

      {/* Actions */}
      {reminder.status === 'PENDING' ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onSkipped} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-amber-500 hover:bg-amber-500/10 transition-all">
            Skip
          </button>
          <button onClick={onTaken} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-all shadow-sm hover:shadow-md active:scale-95">
            ✓ Take
          </button>
        </div>
      ) : (
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0', statusInfo.className)}>
          {statusInfo.icon} {statusInfo.label}
        </span>
      )}
    </div>
  );
}
