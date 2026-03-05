/**
 * myAfya-AI — Reports & Analytics Page
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Download, Share2, Calendar, Pill,
  CheckCircle2, XCircle, AlertCircle, BarChart3,
  FileText, Printer, Clock, Target
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis
} from 'recharts';
import { format, subDays, subMonths, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Generate realistic demo data
const generateAdherenceData = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const taken = Math.floor(Math.random() * 3) + 2;
    const total = 4;
    return {
      date: format(date, days <= 14 ? 'EEE d' : 'MMM d'),
      taken,
      missed: Math.floor(Math.random() * (total - taken)),
      skipped: total - taken - Math.floor(Math.random() * (total - taken)),
      rate: Math.floor((taken / total) * 100),
    };
  });

const weeklyData = generateAdherenceData(7);
const monthlyData = generateAdherenceData(30);
const threeMonthData = generateAdherenceData(90);

const medicineAdherence = [
  { name: 'Metformin', adherence: 94, taken: 56, missed: 2, skipped: 2, color: '#3B82F6' },
  { name: 'Lisinopril', adherence: 98, taken: 59, missed: 1, skipped: 0, color: '#10B981' },
  { name: 'Atorvastatin', adherence: 87, taken: 52, missed: 5, skipped: 3, color: '#8B5CF6' },
  { name: 'Aspirin', adherence: 100, taken: 60, missed: 0, skipped: 0, color: '#F472B6' },
  { name: 'Vitamin D3', adherence: 92, taken: 55, missed: 3, skipped: 2, color: '#FCD34D' },
];

const pieData = [
  { name: 'Taken', value: 281, color: '#10b981' },
  { name: 'Missed', value: 11, color: '#ef4444' },
  { name: 'Skipped', value: 8, color: '#f59e0b' },
];

const radarData = [
  { subject: 'Morning', adherence: 92 },
  { subject: 'Midday', adherence: 78 },
  { subject: 'Evening', adherence: 88 },
  { subject: 'Night', adherence: 95 },
  { subject: 'Weekday', adherence: 91 },
  { subject: 'Weekend', adherence: 83 },
];

const RANGES = [
  { label: '7 days', data: weeklyData },
  { label: '30 days', data: monthlyData },
  { label: '90 days', data: threeMonthData },
];

export default function ReportsPage() {
  const [activeRange, setActiveRange] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const chartData = RANGES[activeRange].data;

  const totalTaken = pieData[0].value;
  const totalMissed = pieData[1].value;
  const totalSkipped = pieData[2].value;
  const totalDoses = totalTaken + totalMissed + totalSkipped;
  const overallRate = Math.round((totalTaken / totalDoses) * 100);

  const handleExport = async (type: 'pdf' | 'csv') => {
    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.success(`Report exported as ${type.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const res = await fetch('/api/reports/share', { method: 'POST' });
      if (res.ok) {
        const { shareUrl } = await res.json();
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch {
      toast.error('Failed to generate share link');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Adherence Reports</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            Comprehensive medication tracking analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="btn-secondary text-sm py-2 px-4"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button onClick={handleShare} className="btn-secondary text-sm py-2 px-4">
            <Share2 className="w-4 h-4" />
            Share with Doctor
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Target,
            label: 'Overall Adherence',
            value: `${overallRate}%`,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            desc: 'Last 30 days',
          },
          {
            icon: CheckCircle2,
            label: 'Doses Taken',
            value: totalTaken.toString(),
            color: 'text-primary-400',
            bg: 'bg-primary-500/10',
            desc: 'On time',
          },
          {
            icon: XCircle,
            label: 'Doses Missed',
            value: totalMissed.toString(),
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            desc: 'Not taken',
          },
          {
            icon: AlertCircle,
            label: 'Doses Skipped',
            value: totalSkipped.toString(),
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            desc: 'Intentional',
          },
        ].map(({ icon: Icon, label, value, color, bg, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-4 sm:p-5"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <p className={cn('text-2xl font-black', color)}>{value}</p>
            <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">{label}</p>
            <p className="text-xs text-[var(--text-muted)]">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Adherence Chart */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              Adherence Timeline
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Daily medication status breakdown</p>
          </div>
          <div className="flex gap-2">
            {RANGES.map(({ label }, i) => (
              <button
                key={label}
                onClick={() => setActiveRange(i)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeRange === i
                    ? 'bg-primary-500 text-white'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData.slice(-30)} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
            <defs>
              <linearGradient id="takenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={activeRange === 2 ? 13 : 'preserveStartEnd'} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              name="Adherence %"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#rateGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Per-medicine adherence */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-secondary-400" />
            Per-Medication Adherence
          </h3>
          <div className="space-y-4">
            {medicineAdherence.map((med) => (
              <div key={med.name} className="flex items-center gap-4">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: med.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">{med.name}</span>
                    <span className={cn(
                      'text-sm font-bold ml-2',
                      med.adherence >= 90 ? 'text-emerald-400' : med.adherence >= 75 ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {med.adherence}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${med.adherence}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="progress-fill"
                      style={{ background: med.color }}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-emerald-400">{med.taken} taken</span>
                    {med.missed > 0 && <span className="text-xs text-red-400">{med.missed} missed</span>}
                    {med.skipped > 0 && <span className="text-xs text-amber-400">{med.skipped} skipped</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {pieData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-[var(--text-secondary)]">{name}</span>
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {value} ({Math.round((value / totalDoses) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time of day radar */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-accent-400" />
          Adherence Patterns
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-around">
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar
                name="Adherence"
                dataKey="adherence"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.15}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(v: number) => [`${v}%`, 'Adherence']}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="space-y-3 sm:w-48 mt-4 sm:mt-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Key Insights</p>
            {[
              { insight: 'Best adherence at night (95%)', color: 'text-emerald-400' },
              { insight: 'Midday doses need improvement', color: 'text-amber-400' },
              { insight: 'Weekend adherence lower by 8%', color: 'text-orange-400' },
              { insight: 'Overall trend improving', color: 'text-primary-400' },
            ].map(({ insight, color }) => (
              <div key={insight} className="flex items-start gap-2">
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', color.replace('text-', 'bg-'))} />
                <p className="text-xs text-[var(--text-secondary)]">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export options */}
      <div className="glass-card p-5 border border-primary-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Doctor Report</h3>
            <p className="text-xs text-[var(--text-secondary)]">Generate a shareable medical report for your healthcare provider</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleExport('pdf')} className="btn-primary text-sm">
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
          <button onClick={() => handleExport('csv')} className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Export CSV Data
          </button>
          <button onClick={handleShare} className="btn-secondary text-sm">
            <Share2 className="w-4 h-4" />
            Share with Doctor
          </button>
          <button onClick={() => window.print()} className="btn-secondary text-sm">
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}
