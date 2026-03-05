/**
 * myAfya-AI — AI Health Assistant Page
 */
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { AIAssistantClient } from '@/components/ai/AIAssistantClient';

export default async function AIAssistantPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [user, recentChat, medicines] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { allergies: true, conditions: true },
    }),
    db.aiChat.findFirst({
      where: { userId: session.user.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 50 },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    db.medicine.findMany({
      where: { userId: session.user.id, isActive: true },
      select: { name: true, dosage: true, unit: true },
      take: 10,
    }),
  ]);

  return (
    <AIAssistantClient
      initialMessages={
        recentChat?.messages.map((m) => ({
          id: m.id,
          role: m.role as 'USER' | 'ASSISTANT',
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        })) || []
      }
      chatId={recentChat?.id}
      userContext={{
        medicines: medicines.map((m) => `${m.name} ${m.dosage}${m.unit.toLowerCase()}`),
        allergies: user?.allergies || [],
        conditions: user?.conditions || [],
      }}
    />
  );
}
