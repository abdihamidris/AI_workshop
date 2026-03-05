/**
 * myAfya-AI — Medicines API (GET all, POST new)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';

const createMedicineSchema = z.object({
  name: z.string().min(1),
  genericName: z.string().optional(),
  dosage: z.string().min(1),
  unit: z.enum(['MG', 'MCG', 'G', 'ML', 'IU', 'PERCENT', 'OTHER']).default('MG'),
  form: z.enum(['TABLET', 'CAPSULE', 'LIQUID', 'INJECTION', 'PATCH', 'CREAM', 'DROPS', 'INHALER', 'SUPPOSITORY', 'OTHER']).default('TABLET'),
  frequency: z.enum(['DAILY', 'TWICE_DAILY', 'THREE_TIMES_DAILY', 'FOUR_TIMES_DAILY', 'EVERY_OTHER_DAY', 'WEEKLY', 'AS_NEEDED', 'CUSTOM']),
  timesPerDay: z.number().int().min(0).default(1),
  specificTimes: z.array(z.string()).default([]),
  startDate: z.string(),
  endDate: z.string().optional(),
  instructions: z.string().optional(),
  color: z.string().optional(),
  prescribedBy: z.string().optional(),
  pillCount: z.number().int().positive().nullable().optional(),
  pillsPerDose: z.number().positive().default(1),
  refillAt: z.number().int().positive().nullable().optional(),
  profileId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';
    const profileId = searchParams.get('profileId');

    const medicines = await db.medicine.findMany({
      where: {
        userId: session.user.id,
        ...(activeOnly && { isActive: true }),
        ...(profileId && { profileId }),
      },
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: medicines.map((m) => ({
        ...m,
        startDate: m.startDate.toISOString(),
        endDate: m.endDate?.toISOString(),
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch medicines' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = createMedicineSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid medicine data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    const medicine = await db.medicine.create({
      data: {
        userId: session.user.id,
        name: data.name,
        genericName: data.genericName,
        dosage: data.dosage,
        unit: data.unit,
        form: data.form,
        frequency: data.frequency,
        timesPerDay: data.timesPerDay,
        specificTimes: data.specificTimes,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        instructions: data.instructions,
        color: data.color,
        prescribedBy: data.prescribedBy,
        pillCount: data.pillCount ?? null,
        pillsPerDose: data.pillsPerDose,
        refillAt: data.refillAt ?? null,
        profileId: data.profileId,
      },
    });

    // Create reminders for today if applicable
    await createTodayReminders(session.user.id, medicine.id, data.specificTimes);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...medicine,
          startDate: medicine.startDate.toISOString(),
          createdAt: medicine.createdAt.toISOString(),
          updatedAt: medicine.updatedAt.toISOString(),
        },
        message: 'Medicine added successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create medicine error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create medicine' }, { status: 500 });
  }
}

async function createTodayReminders(userId: string, medicineId: string, times: string[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders = times.map((time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledAt = new Date(today);
    scheduledAt.setHours(hours, minutes, 0, 0);

    // Only create future reminders
    if (scheduledAt <= new Date()) return null;

    return { userId, medicineId, scheduledAt };
  }).filter(Boolean) as { userId: string; medicineId: string; scheduledAt: Date }[];

  if (reminders.length > 0) {
    await db.reminder.createMany({ data: reminders });
  }
}
