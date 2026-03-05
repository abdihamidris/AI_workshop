/**
 * myAfya-AI — Medicine Form Component
 * Add or edit a medication with full details
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Pill, Clock, Calendar, User, Info, Plus, X,
  ChevronDown, Loader2, Check, Palette, Package
} from 'lucide-react';
import { cn, MEDICINE_COLORS, formatTimeSlot } from '@/lib/utils';
import toast from 'react-hot-toast';

const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  genericName: z.string().optional(),
  dosage: z.string().min(1, 'Dosage is required'),
  unit: z.enum(['MG', 'MCG', 'G', 'ML', 'IU', 'PERCENT', 'OTHER']),
  form: z.enum(['TABLET', 'CAPSULE', 'LIQUID', 'INJECTION', 'PATCH', 'CREAM', 'DROPS', 'INHALER', 'SUPPOSITORY', 'OTHER']),
  frequency: z.enum(['DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY', 'EVERY_OTHER_DAY', 'WEEKLY', 'AS_NEEDED', 'CUSTOM']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  instructions: z.string().optional(),
  prescribedBy: z.string().optional(),
  pillCount: z.coerce.number().int().positive().nullable().optional(),
  pillsPerDose: z.coerce.number().positive().default(1),
  refillAt: z.coerce.number().int().positive().nullable().optional(),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

const FREQUENCY_OPTIONS = [
  { value: 'DAILY', label: 'Once daily', times: 1 },
  { value: 'TWICE_DAILY', label: 'Twice daily', times: 2 },
  { value: 'THREE_TIMES_DAILY', label: '3 times daily', times: 3 },
  { value: 'FOUR_TIMES_DAILY', label: '4 times daily', times: 4 },
  { value: 'EVERY_OTHER_DAY', label: 'Every other day', times: 1 },
  { value: 'WEEKLY', label: 'Once weekly', times: 1 },
  { value: 'AS_NEEDED', label: 'As needed (PRN)', times: 0 },
  { value: 'CUSTOM', label: 'Custom schedule', times: 0 },
];

const FORM_OPTIONS = [
  { value: 'TABLET', label: 'Tablet', icon: '💊' },
  { value: 'CAPSULE', label: 'Capsule', icon: '💊' },
  { value: 'LIQUID', label: 'Liquid', icon: '🧴' },
  { value: 'INJECTION', label: 'Injection', icon: '💉' },
  { value: 'PATCH', label: 'Patch', icon: '🩹' },
  { value: 'CREAM', label: 'Cream', icon: '🧴' },
  { value: 'DROPS', label: 'Drops', icon: '💧' },
  { value: 'INHALER', label: 'Inhaler', icon: '🫧' },
];

const UNIT_OPTIONS = ['MG', 'MCG', 'G', 'ML', 'IU', 'PERCENT', 'OTHER'];

const STEPS = [
  { id: 1, label: 'Medicine Info', icon: Pill },
  { id: 2, label: 'Schedule', icon: Clock },
  { id: 3, label: 'Supply', icon: Package },
  { id: 4, label: 'Review', icon: Check },
];

export function MedicineForm({ medicine }: { medicine?: any }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(medicine?.color || MEDICINE_COLORS[0]);
  const [times, setTimes] = useState<string[]>(medicine?.specificTimes || ['08:00']);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: medicine?.name || '',
      genericName: medicine?.genericName || '',
      dosage: medicine?.dosage || '',
      unit: medicine?.unit || 'MG',
      form: medicine?.form || 'TABLET',
      frequency: medicine?.frequency || 'DAILY',
      startDate: medicine?.startDate ? medicine.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: medicine?.endDate ? medicine.endDate.split('T')[0] : '',
      instructions: medicine?.instructions || '',
      prescribedBy: medicine?.prescribedBy || '',
      pillsPerDose: medicine?.pillsPerDose || 1,
    },
  });

  const frequency = watch('frequency');

  const addTime = () => {
    if (times.length < 6) setTimes([...times, '12:00']);
  };

  const removeTime = (i: number) => {
    setTimes(times.filter((_, idx) => idx !== i));
  };

  const updateTime = (i: number, value: string) => {
    const newTimes = [...times];
    newTimes[i] = value;
    setTimes(newTimes);
  };

  const onSubmit = async (data: MedicineFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        color: selectedColor,
        specificTimes: times,
        timesPerDay: times.length,
        pillCount: data.pillCount ?? null,
        refillAt: data.refillAt ?? null,
      };

      const url = medicine ? `/api/medicines/${medicine.id}` : '/api/medicines';
      const method = medicine ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save medicine');
      }

      toast.success(medicine ? 'Medicine updated!' : 'Medicine added successfully!');
      router.push('/medicines');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save medicine');
    } finally {
      setIsLoading(false);
    }
  };

  const watchedValues = watch();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = step > s.id;
          const isActive = step === s.id;

          return (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => isCompleted && setStep(s.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5',
                  (isCompleted || isActive) ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-primary-500 text-white shadow-neon'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                )}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:block',
                  isActive ? 'text-primary-400' : isCompleted ? 'text-emerald-400' : 'text-[var(--text-muted)]'
                )}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-3 transition-all duration-500',
                  step > s.id ? 'bg-emerald-500' : 'bg-[var(--border-color)]'
                )} />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass-card p-6 sm:p-8">
          {/* ─── Step 1: Medicine Info ─────────────────────────────────────── */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Medicine Information</h3>
                <p className="text-sm text-[var(--text-secondary)]">Enter the basic details of your medication</p>
              </div>

              {/* Medicine name */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Medicine Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g. Metformin, Aspirin"
                  className="form-input"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Generic Name <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  {...register('genericName')}
                  placeholder="e.g. Metformin HCl"
                  className="form-input"
                />
              </div>

              {/* Dosage + Unit */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Dosage <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    {...register('dosage')}
                    placeholder="e.g. 500"
                    className="form-input flex-1"
                    type="number"
                    min="0"
                    step="any"
                  />
                  <select {...register('unit')} className="form-input w-28">
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u.toLowerCase()}</option>
                    ))}
                  </select>
                </div>
                {errors.dosage && <p className="text-red-400 text-xs mt-1">{errors.dosage.message}</p>}
              </div>

              {/* Medicine form */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Medicine Form
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                  {FORM_OPTIONS.map((opt) => (
                    <label key={opt.value} className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all',
                      watch('form') === opt.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-[var(--border-color)] hover:border-primary-500/50'
                    )}>
                      <input {...register('form')} type="radio" value={opt.value} className="sr-only" />
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  <Palette className="w-4 h-4 inline-block mr-1.5 mb-0.5" />
                  Medicine Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {MEDICINE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-[var(--text-secondary)] scale-110' : 'hover:scale-105'
                      )}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Prescribing doctor */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Prescribed by <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  {...register('prescribedBy')}
                  placeholder="Dr. Name"
                  className="form-input"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Special Instructions <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <textarea
                  {...register('instructions')}
                  placeholder="e.g. Take with food, avoid grapefruit juice..."
                  className="form-input resize-none h-20"
                />
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Schedule ──────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Schedule</h3>
                <p className="text-sm text-[var(--text-secondary)]">Set when and how often to take this medicine</p>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Frequency <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <label key={opt.value} className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      watch('frequency') === opt.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-[var(--border-color)] hover:border-primary-500/50'
                    )}>
                      <input {...register('frequency')} type="radio" value={opt.value} className="sr-only" />
                      <div>
                        <p className={cn('text-sm font-medium', watch('frequency') === opt.value ? 'text-primary-400' : 'text-[var(--text-primary)]')}>
                          {opt.label}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reminder times */}
              {frequency !== 'AS_NEEDED' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                      Reminder Times
                    </label>
                    <button
                      type="button"
                      onClick={addTime}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add time
                    </button>
                  </div>
                  <div className="space-y-2">
                    {times.map((time, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => updateTime(i, e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">{formatTimeSlot(time)}</span>
                        {times.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTime(i)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input {...register('startDate')} type="date" className="form-input" />
                  {errors.startDate && <p className="text-red-400 text-xs mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    End Date <span className="text-[var(--text-muted)]">(optional)</span>
                  </label>
                  <input {...register('endDate')} type="date" className="form-input" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Supply ────────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Supply Tracking</h3>
                <p className="text-sm text-[var(--text-secondary)]">Track your pill count and get refill reminders</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Current Pill Count
                  </label>
                  <input
                    {...register('pillCount', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="e.g. 30"
                    className="form-input"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">How many pills you have now</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Pills Per Dose
                  </label>
                  <input
                    {...register('pillsPerDose', { valueAsNumber: true })}
                    type="number"
                    min="0.25"
                    step="0.25"
                    placeholder="e.g. 1"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Refill Alert Threshold
                </label>
                <input
                  {...register('refillAt', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  placeholder="e.g. 7 (alert when 7 pills left)"
                  className="form-input"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  You'll be notified when your supply reaches this amount
                </p>
              </div>

              <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary-300">Supply tracking is optional</p>
                    <p className="text-primary-200/80 mt-1 text-xs">
                      If enabled, myAfya-AI will automatically deduct doses and alert you when it's time to refill.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 4: Review ────────────────────────────────────────────── */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Review & Save</h3>
                <p className="text-sm text-[var(--text-secondary)]">Confirm your medication details</p>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{ borderColor: `${selectedColor}40`, background: `${selectedColor}10` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `${selectedColor}20` }}
                  >
                    💊
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-lg">{watchedValues.name || '—'}</h4>
                    {watchedValues.genericName && (
                      <p className="text-xs text-[var(--text-muted)]">{watchedValues.genericName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Dosage', value: `${watchedValues.dosage} ${watchedValues.unit?.toLowerCase()}` },
                    { label: 'Form', value: watchedValues.form?.toLowerCase() },
                    { label: 'Frequency', value: FREQUENCY_OPTIONS.find(f => f.value === watchedValues.frequency)?.label },
                    { label: 'Times', value: times.map(t => formatTimeSlot(t)).join(', ') || 'As needed' },
                    { label: 'Start Date', value: watchedValues.startDate },
                    { label: 'Prescribed by', value: watchedValues.prescribedBy || 'Not specified' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-[var(--text-muted)]">{label}</p>
                      <p className="font-medium text-[var(--text-primary)] capitalize">{value || '—'}</p>
                    </div>
                  ))}
                </div>

                {watchedValues.instructions && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)]">Instructions</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">{watchedValues.instructions}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : router.back()}
              className="btn-secondary"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn-primary"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary min-w-[120px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {medicine ? 'Save Changes' : 'Add Medicine'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
