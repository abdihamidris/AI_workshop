/**
 * myAfya-AI — Medicines List Page
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { MedicinesClient } from '@/components/medicines/MedicinesClient';

export default async function MedicinesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const medicines = await db.medicine.findMany({
    where: { userId: session.user.id },
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
  });

  const serialized = medicines.map((m) => ({
    ...m,
    startDate: m.startDate.toISOString(),
    endDate: m.endDate?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    profile: m.profile
      ? {
          ...m.profile,
          dateOfBirth: m.profile.dateOfBirth?.toISOString() ?? null,
          createdAt: m.profile.createdAt.toISOString(),
          updatedAt: m.profile.updatedAt.toISOString(),
        }
      : null,
  }));

  return <MedicinesClient medicines={serialized} />;
}
