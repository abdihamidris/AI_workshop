/**
 * myAfya-AI — Medication Calendar Page
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Calendar, Clock,
  CheckCircle2, XCircle, AlertCircle, Pill
} from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, isSameDay, addMonths, subMonths,
  startOfWeek, endOfWeek, parseISO
} from 'date-fns';
import { cn, formatTime, getMedicineFormIcon } from '@/lib/utils';

interface DayReminders {
  [date: string]: Array<{
    id: string;
    medicine: { name: string; dosage: string; unit: string; color?: string; form: string };
    scheduledAt: string;
    status: string;
  }>;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState<DayReminders>({});
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  useEffect(() => {
    fetchMonthReminders();
  }, [currentDate]);

  const fetchMonthReminders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        month: format(currentDate, 'yyyy-MM'),
      });
      const res = await fetch(`/api/reminders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders || {});
      }
    } catch {
      // Use mock data for demo
      setReminders(generateMockReminders());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockReminders = (): DayReminders => {
    const result: DayReminders = {};
    const medicines = [
      { name: 'Metformin', dosage: '500', unit: 'mg', color: '#3B82F6', form: 'TABLET' },
      { name: 'Lisinopril', dosage: '10', unit: 'mg', color: '#10B981', form: 'TABLET' },
      { name: 'Atorvastatin', dosage: '20', unit: 'mg', color: '#8B5CF6', form: 'TABLET' },
    ];
    const statuses = ['TAKEN', 'TAKEN', 'TAKEN', 'MISSED', 'SKIPPED'];

    eachDayOfInterval({ start: calStart, end: calEnd }).forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      result[dateKey] = medicines.map((med, i) => ({
        id: `${dateKey}-${i}`,
        medicine: med,
        scheduledAt: `${dateKey}T${['08:00', '12:00', '21:00'][i]}:00Z`,
        status: isToday(day) && i === 2 ? 'PENDING' : statuses[Math.floor(Math.random() * statuses.length)],
      }));
    });

    return result;
  };

  const getDayReminders = (day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    return reminders[key] || [];
  };

  const getDayAdherence = (day: Date) => {
    const dayReminders = getDayReminders(day);
    if (dayReminders.length === 0) return null;
    const taken = dayReminders.filter((r) => r.status === 'TAKEN').length;
    return Math.round((taken / dayReminders.length) * 100);
  };

  const selectedDayReminders = getDayReminders(selectedDay);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card p-5">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[var(--text-muted)] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day) => {
              const adherence = getDayAdherence(day);
              const dayRems = getDayReminders(day);
              const isSelected = isSameDay(day, selectedDay);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative flex flex-col items-center p-1.5 rounded-xl transition-all duration-200 min-h-[60px]',
                    isSelected
                      ? 'bg-primary-500 text-white shadow-neon'
                      : isCurrentDay
                      ? 'bg-primary-500/15 text-primary-400'
                      : isCurrentMonth
                      ? 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]/50'
                  )}
                >
                  <span className={cn(
                    'text-sm font-semibold',
                    isSelected ? 'text-white' : isCurrentDay ? 'text-primary-400' : ''
                  )}>
                    {format(day, 'd')}
                  </span>

                  {/* Adherence indicator */}
                  {adherence !== null && isCurrentMonth && (
                    <div className="mt-1 w-full flex justify-center">
                      {dayRems.length > 0 && (
                        <div
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            adherence === 100
                              ? 'bg-emerald-400'
                              : adherence >= 75
                              ? 'bg-yellow-400'
                              : 'bg-red-400'
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Medicine dots */}
                  {isCurrentMonth && dayRems.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-[40px]">
                      {dayRems.slice(0, 3).map((r, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full opacity-70"
                          style={{ background: r.medicine.color || '#0ea5e9' }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--border-color)]">
            {[
              { color: 'bg-emerald-400', label: '100% taken' },
              { color: 'bg-yellow-400', label: '75%+ taken' },
              { color: 'bg-red-400', label: '<75% taken' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-[var(--text-muted)]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day Detail Panel */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary-400" />
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">
                {isToday(selectedDay) ? 'Today' : format(selectedDay, 'EEEE')}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {format(selectedDay, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {selectedDayReminders.length === 0 ? (
            <div className="text-center py-8">
              <Pill className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm text-[var(--text-muted)]">No medications scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayReminders.map((reminder) => {
                const statusConfig: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
                  TAKEN: {
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    className: 'text-emerald-400',
                    label: 'Taken',
                  },
                  MISSED: {
                    icon: <XCircle className="w-4 h-4" />,
                    className: 'text-red-400',
                    label: 'Missed',
                  },
                  SKIPPED: {
                    icon: <AlertCircle className="w-4 h-4" />,
                    className: 'text-yellow-400',
                    label: 'Skipped',
                  },
                  PENDING: {
                    icon: <Clock className="w-4 h-4" />,
                    className: 'text-blue-400',
                    label: 'Pending',
                  },
                };

                const status = statusConfig[reminder.status] || statusConfig.PENDING;
                const time = reminder.scheduledAt
                  ? formatTime(reminder.scheduledAt)
                  : '—';

                return (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: `${reminder.medicine.color || '#0ea5e9'}20` }}
                    >
                      {getMedicineFormIcon(reminder.medicine.form)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {reminder.medicine.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {reminder.medicine.dosage}{reminder.medicine.unit} · {time}
                      </p>
                    </div>
                    <div className={cn('flex items-center gap-1 text-xs font-medium', status.className)}>
                      {status.icon}
                      <span className="hidden sm:inline">{status.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Day stats */}
          {selectedDayReminders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Adherence</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {getDayAdherence(selectedDay)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-gradient-to-r from-primary-500 to-secondary-500"
                  style={{ width: `${getDayAdherence(selectedDay) || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
