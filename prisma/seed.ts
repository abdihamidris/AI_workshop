/**
 * myAfya-AI — Database Seed
 * Populates database with realistic demo data
 */
import { PrismaClient, FrequencyType, MedicineForm, DosageUnit, ReminderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, subDays, startOfDay, addHours } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding myAfya-AI database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo@12345', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@myafya.ai' },
    update: {},
    create: {
      email: 'demo@myafya.ai',
      name: 'Abdihamid',
      password: hashedPassword,
      bloodType: 'O+',
      allergies: ['Penicillin', 'Sulfa drugs'],
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      isEmailVerified: true,
    },
  });

  console.log('✅ Demo user created:', user.email);

  // Create family profiles
  const spouse = await prisma.familyProfile.upsert({
    where: { id: 'family-spouse-1' },
    update: {},
    create: {
      id: 'family-spouse-1',
      userId: user.id,
      name: 'Sarah Johnson',
      relationship: 'SPOUSE',
      allergies: ['Aspirin'],
      conditions: ['Asthma'],
    },
  });

  const child = await prisma.familyProfile.upsert({
    where: { id: 'family-child-1' },
    update: {},
    create: {
      id: 'family-child-1',
      userId: user.id,
      name: 'Ethan Johnson',
      relationship: 'CHILD',
      dateOfBirth: new Date('2015-06-15'),
      conditions: ['Seasonal allergies'],
    },
  });

  console.log('✅ Family profiles created');

  // Create medicines
  const medicines = [
    {
      name: 'Metformin',
      genericName: 'Metformin HCl',
      dosage: '500',
      unit: DosageUnit.MG,
      form: MedicineForm.TABLET,
      frequency: FrequencyType.TWICE_DAILY,
      timesPerDay: 2,
      specificTimes: ['08:00', '20:00'],
      startDate: subDays(new Date(), 30),
      instructions: 'Take with meals to reduce stomach upset',
      color: '#60A5FA',
      prescribedBy: 'Dr. James Carter',
      pillCount: 60,
      pillsPerDose: 1,
      refillAt: 10,
    },
    {
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10',
      unit: DosageUnit.MG,
      form: MedicineForm.TABLET,
      frequency: FrequencyType.DAILY,
      timesPerDay: 1,
      specificTimes: ['08:00'],
      startDate: subDays(new Date(), 60),
      instructions: 'Take at the same time each day. Avoid potassium supplements.',
      color: '#34D399',
      prescribedBy: 'Dr. James Carter',
      pillCount: 30,
      pillsPerDose: 1,
      refillAt: 7,
    },
    {
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      dosage: '20',
      unit: DosageUnit.MG,
      form: MedicineForm.TABLET,
      frequency: FrequencyType.DAILY,
      timesPerDay: 1,
      specificTimes: ['21:00'],
      startDate: subDays(new Date(), 45),
      instructions: 'Take in the evening. Avoid grapefruit juice.',
      color: '#A78BFA',
      prescribedBy: 'Dr. Lisa Wong',
      pillCount: 28,
      pillsPerDose: 1,
      refillAt: 5,
    },
    {
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      dosage: '81',
      unit: DosageUnit.MG,
      form: MedicineForm.TABLET,
      frequency: FrequencyType.DAILY,
      timesPerDay: 1,
      specificTimes: ['08:00'],
      startDate: subDays(new Date(), 90),
      instructions: 'Take with water. Low-dose for cardiovascular protection.',
      color: '#F472B6',
      prescribedBy: 'Dr. James Carter',
      pillCount: 100,
      pillsPerDose: 1,
      refillAt: 20,
    },
    {
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      dosage: '2000',
      unit: DosageUnit.IU,
      form: MedicineForm.CAPSULE,
      frequency: FrequencyType.DAILY,
      timesPerDay: 1,
      specificTimes: ['08:00'],
      startDate: subDays(new Date(), 15),
      instructions: 'Take with a fatty meal for better absorption.',
      color: '#FCD34D',
      prescribedBy: 'Dr. Lisa Wong',
      pillCount: 90,
      pillsPerDose: 1,
      refillAt: 15,
    },
  ];

  const createdMedicines = [];
  for (const med of medicines) {
    const m = await prisma.medicine.create({
      data: { ...med, userId: user.id },
    });
    createdMedicines.push(m);
  }

  console.log('✅ Medicines created:', createdMedicines.length);

  // Create adherence logs for the last 30 days
  const today = startOfDay(new Date());
  const statuses = ['TAKEN', 'TAKEN', 'TAKEN', 'TAKEN', 'SKIPPED', 'MISSED'] as const;

  for (const medicine of createdMedicines) {
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      try {
        await prisma.adherenceLog.create({
          data: {
            userId: user.id,
            medicineId: medicine.id,
            date,
            status,
            notes: status === 'SKIPPED' ? 'Felt nauseous' : undefined,
          },
        });
      } catch {
        // Skip duplicates
      }
    }
  }

  console.log('✅ Adherence logs created');

  // Create today's reminders
  for (const medicine of createdMedicines) {
    for (const time of medicine.specificTimes) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledAt = new Date(today);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const now = new Date();
      let status: ReminderStatus = 'PENDING';
      if (scheduledAt < now) {
        status = Math.random() > 0.3 ? 'TAKEN' : 'MISSED';
      }

      await prisma.reminder.create({
        data: {
          userId: user.id,
          medicineId: medicine.id,
          scheduledAt,
          status,
          takenAt: status === 'TAKEN' ? new Date(scheduledAt.getTime() + 5 * 60000) : undefined,
        },
      });
    }
  }

  console.log('✅ Today\'s reminders created');

  // Create AI chat history
  const chat = await prisma.aiChat.create({
    data: {
      userId: user.id,
      title: 'Metformin & Diet Questions',
      messages: {
        create: [
          {
            role: 'USER',
            content: 'Can I take Metformin with grapefruit?',
          },
          {
            role: 'ASSISTANT',
            content: 'Good question! Unlike some medications (like statins), Metformin does not have a significant interaction with grapefruit. You can safely consume grapefruit while taking Metformin. However, it\'s always best to take Metformin with meals to reduce gastrointestinal side effects like nausea and stomach upset. If you have specific concerns, consult your prescribing physician.',
          },
          {
            role: 'USER',
            content: 'What are the signs of low blood sugar I should watch for?',
          },
          {
            role: 'ASSISTANT',
            content: 'Great question for diabetes management! Watch for these hypoglycemia symptoms:\n\n**Early signs:**\n• Shakiness or trembling\n• Sweating\n• Rapid heartbeat\n• Hunger\n• Dizziness\n\n**Moderate signs:**\n• Confusion or difficulty concentrating\n• Pale skin\n• Headache\n• Blurred vision\n\n**What to do:** If you experience these, consume 15g of fast-acting carbs (4 glucose tablets, 4oz juice, or 5-6 hard candies). Recheck after 15 minutes.\n\nAlways carry a glucose source and wear medical ID jewelry.',
          },
        ],
      },
    },
  });

  console.log('✅ AI chat history created');

  // Create refill alerts
  await prisma.refillAlert.create({
    data: {
      userId: user.id,
      medicineId: createdMedicines[1].id, // Lisinopril
      alertAt: new Date(),
      pillsLeft: 7,
      isRead: false,
    },
  });

  console.log('✅ Refill alerts created');

  // Create doctor share
  await prisma.doctorShare.create({
    data: {
      userId: user.id,
      doctorName: 'Dr. James Carter',
      doctorEmail: 'j.carter@healthclinic.com',
      expiresAt: addDays(new Date(), 30),
      isActive: true,
    },
  });

  console.log('✅ Doctor shares created');

  console.log('\n🎉 Seed complete! Demo credentials:');
  console.log('   Email: demo@myafya.ai');
  console.log('   Password: Demo@12345');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
