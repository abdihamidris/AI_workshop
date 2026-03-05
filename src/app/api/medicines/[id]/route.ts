/**
 * myAfya-AI — Medicine Detail API (GET, PUT, PATCH, DELETE)
 * Next.js 16: params is a Promise
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const medicine = await db.medicine.findFirst({
      where: { id, userId: session.user.id },
      include: {
        profile: true,
        adherenceLogs: { orderBy: { date: 'desc' }, take: 30 },
        reminders: {
          where: { scheduledAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (!medicine) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: medicine });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch medicine' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const existing = await db.medicine.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    const updated = await db.medicine.update({
      where: { id },
      data: {
        name: body.name,
        genericName: body.genericName,
        dosage: body.dosage,
        unit: body.unit,
        form: body.form,
        frequency: body.frequency,
        timesPerDay: body.timesPerDay,
        specificTimes: body.specificTimes,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : null,
        instructions: body.instructions,
        color: body.color,
        prescribedBy: body.prescribedBy,
        pillCount: body.pillCount ?? null,
        pillsPerDose: body.pillsPerDose,
        refillAt: body.refillAt ?? null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update medicine' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const existing = await db.medicine.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    const updated = await db.medicine.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update medicine' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await db.medicine.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    await db.$transaction([
      db.reminder.deleteMany({ where: { medicineId: id } }),
      db.adherenceLog.deleteMany({ where: { medicineId: id } }),
      db.refillAlert.deleteMany({ where: { medicineId: id } }),
      db.medicine.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete medicine' }, { status: 500 });
  }
}
