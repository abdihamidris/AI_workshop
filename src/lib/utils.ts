/**
 * myAfya-AI — Utility Functions
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns';

// ─── CSS Class Utilities ──────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
  if (isTomorrow(d)) return `Tomorrow at ${format(d, 'h:mm a')}`;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatTimeSlot(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// ─── Medicine Utilities ───────────────────────────────────────────────────────

export function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    DAILY: 'Once daily',
    TWICE_DAILY: 'Twice daily',
    THREE_TIMES_DAILY: '3 times daily',
    FOUR_TIMES_DAILY: '4 times daily',
    EVERY_OTHER_DAY: 'Every other day',
    WEEKLY: 'Once weekly',
    AS_NEEDED: 'As needed',
    CUSTOM: 'Custom schedule',
  };
  return labels[frequency] || frequency;
}

export function getMedicineFormLabel(form: string): string {
  const labels: Record<string, string> = {
    TABLET: 'Tablet',
    CAPSULE: 'Capsule',
    LIQUID: 'Liquid',
    INJECTION: 'Injection',
    PATCH: 'Patch',
    CREAM: 'Cream/Ointment',
    DROPS: 'Drops',
    INHALER: 'Inhaler',
    SUPPOSITORY: 'Suppository',
    OTHER: 'Other',
  };
  return labels[form] || form;
}

export function getMedicineFormIcon(form: string): string {
  const icons: Record<string, string> = {
    TABLET: '💊',
    CAPSULE: '💊',
    LIQUID: '🧴',
    INJECTION: '💉',
    PATCH: '🩹',
    CREAM: '🧴',
    DROPS: '💧',
    INHALER: '🫧',
    SUPPOSITORY: '💊',
    OTHER: '💊',
  };
  return icons[form] || '💊';
}

// ─── Adherence Utilities ──────────────────────────────────────────────────────

export function calculateAdherenceRate(taken: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((taken / total) * 100);
}

export function getAdherenceColor(rate: number): string {
  if (rate >= 90) return 'text-emerald-500';
  if (rate >= 75) return 'text-yellow-500';
  if (rate >= 50) return 'text-orange-500';
  return 'text-red-500';
}

export function getAdherenceBg(rate: number): string {
  if (rate >= 90) return 'bg-emerald-500';
  if (rate >= 75) return 'bg-yellow-500';
  if (rate >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getAdherenceLabel(rate: number): string {
  if (rate >= 90) return 'Excellent';
  if (rate >= 75) return 'Good';
  if (rate >= 50) return 'Fair';
  return 'Needs Improvement';
}

// ─── Status Utilities ─────────────────────────────────────────────────────────

export function getReminderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'text-blue-400 bg-blue-400/10',
    TAKEN: 'text-emerald-400 bg-emerald-400/10',
    SKIPPED: 'text-yellow-400 bg-yellow-400/10',
    MISSED: 'text-red-400 bg-red-400/10',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10';
}

export function getReminderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    TAKEN: 'Taken',
    SKIPPED: 'Skipped',
    MISSED: 'Missed',
  };
  return labels[status] || status;
}

// ─── String Utilities ─────────────────────────────────────────────────────────

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Number Utilities ─────────────────────────────────────────────────────────

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

export const MEDICINE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
];

export function getRandomMedicineColor(): string {
  return MEDICINE_COLORS[Math.floor(Math.random() * MEDICINE_COLORS.length)];
}

// ─── Validation Utilities ─────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidTime(time: string): boolean {
  return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);
}
