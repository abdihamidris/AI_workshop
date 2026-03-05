/**
 * myAfya-AI — AI Chat API
 * Streams responses from Claude via Anthropic SDK
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { sendHealthMessage, ChatMessage } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, chatId, history = [], userContext } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Build message history
    const messages: ChatMessage[] = [
      ...history.slice(-10),
      { role: 'user', content: message },
    ];

    // Get AI response
    const response = await sendHealthMessage(messages, userContext);

    // Find or create chat
    let chat;
    if (chatId) {
      chat = await db.aiChat.findFirst({
        where: { id: chatId, userId: session.user.id },
      });
    }

    if (!chat) {
      // Generate title from first message
      const title = message.length > 50 ? `${message.slice(0, 47)}...` : message;
      chat = await db.aiChat.create({
        data: { userId: session.user.id, title },
      });
    }

    // Save both messages
    const [, assistantMsg] = await db.$transaction([
      db.aiMessage.create({
        data: { chatId: chat.id, role: 'USER', content: message },
      }),
      db.aiMessage.create({
        data: { chatId: chat.id, role: 'ASSISTANT', content: response },
      }),
    ]);

    // Update chat timestamp
    await db.aiChat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      response,
      chatId: chat.id,
      messageId: assistantMsg.id,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const chats = await db.aiChat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    return NextResponse.json({ success: true, data: chats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch chats' }, { status: 500 });
  }
}
