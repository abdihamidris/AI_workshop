/**
 * myAfya-AI — Global TypeScript Types
 */

// ─── User Types ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  createdAt: string;
}

export interface FamilyProfile {
  id: string;
  userId: string;
  name: string;
  relationship: 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'GRANDPARENT' | 'OTHER';
  dateOfBirth?: string;
  avatar?: string;
  allergies: string[];
  conditions: string[];
  notes?: string;
}

// ─── Medicine Types ───────────────────────────────────────────────────────────

export type DosageUnit = 'MG' | 'MCG' | 'G' | 'ML' | 'IU' | 'PERCENT' | 'OTHER';
export type MedicineForm = 'TABLET' | 'CAPSULE' | 'LIQUID' | 'INJECTION' | 'PATCH' | 'CREAM' | 'DROPS' | 'INHALER' | 'SUPPOSITORY' | 'OTHER';
export type FrequencyType = 'DAILY' | 'TWICE_DAILY' | 'THREE_TIMES_DAILY' | 'FOUR_TIMES_DAILY' | 'EVERY_OTHER_DAY' | 'WEEKLY' | 'AS_NEEDED' | 'CUSTOM';

export interface Medicine {
  id: string;
  userId: string;
  profileId?: string;
  name: string;
  genericName?: string;
  dosage: string;
  unit: DosageUnit;
  form: MedicineForm;
  frequency: FrequencyType;
  timesPerDay: number;
  specificTimes: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  color?: string;
  prescribedBy?: string;
  pillCount?: number;
  pillsPerDose: number;
  refillAt?: number;
  isActive: boolean;
  imageUrl?: string;
  sideEffects: string[];
  createdAt: string;
  profile?: FamilyProfile;
}

export interface MedicineFormData {
  name: string;
  genericName?: string;
  dosage: string;
  unit: DosageUnit;
  form: MedicineForm;
  frequency: FrequencyType;
  timesPerDay: number;
  specificTimes: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  color?: string;
  prescribedBy?: string;
  pillCount?: number;
  pillsPerDose: number;
  refillAt?: number;
  profileId?: string;
}

// ─── Reminder Types ───────────────────────────────────────────────────────────

export type ReminderStatus = 'PENDING' | 'TAKEN' | 'SKIPPED' | 'MISSED';

export interface Reminder {
  id: string;
  userId: string;
  medicineId: string;
  scheduledAt: string;
  status: ReminderStatus;
  takenAt?: string;
  skippedAt?: string;
  skipReason?: string;
  notes?: string;
  medicine: Medicine;
}

// ─── Adherence Types ──────────────────────────────────────────────────────────

export type LogStatus = 'TAKEN' | 'SKIPPED' | 'MISSED';

export interface AdherenceLog {
  id: string;
  userId: string;
  medicineId: string;
  date: string;
  status: LogStatus;
  notes?: string;
  medicine?: Medicine;
}

export interface AdherenceStats {
  totalDoses: number;
  takenDoses: number;
  skippedDoses: number;
  missedDoses: number;
  adherenceRate: number;
  streak: number;
}

// ─── AI Chat Types ────────────────────────────────────────────────────────────

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface AiMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface AiChat {
  id: string;
  userId: string;
  title?: string;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalMedicines: number;
  todayDoses: number;
  takenToday: number;
  adherenceRate: number;
  streak: number;
  upcomingRefills: number;
}

export interface WeeklyAdherence {
  date: string;
  taken: number;
  missed: number;
  skipped: number;
  rate: number;
}

export interface TodayScheduleItem {
  time: string;
  reminders: Reminder[];
}

// ─── Prescription Types ───────────────────────────────────────────────────────

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  rawText?: string;
  parsedData?: ParsedPrescription;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVIEW';
  doctorName?: string;
  clinicName?: string;
  createdAt: string;
}

export interface ParsedPrescription {
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
  }>;
  doctorName?: string;
  clinicName?: string;
  patientName?: string;
  issuedDate?: string;
}

// ─── Refill Types ─────────────────────────────────────────────────────────────

export interface RefillAlert {
  id: string;
  userId: string;
  medicineId: string;
  alertAt: string;
  refillAt?: string;
  pillsLeft: number;
  isRead: boolean;
  isDismissed: boolean;
  medicine?: Medicine;
}

// ─── Doctor Share Types ───────────────────────────────────────────────────────

export interface DoctorShare {
  id: string;
  userId: string;
  doctorName?: string;
  doctorEmail?: string;
  shareToken: string;
  expiresAt: string;
  isActive: boolean;
  accessCount: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
