/**
 * myAfya-AI — AI Health Assistant Chat Interface
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Mic, MicOff, Plus, ChevronDown,
  Sparkles, Heart, Pill, AlertTriangle, Activity,
  Loader2, Copy, Check, Volume2, RefreshCw, User
} from 'lucide-react';
import { format } from 'date-fns';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

interface AIAssistantClientProps {
  initialMessages: Message[];
  chatId?: string;
  userContext: {
    medicines: string[];
    allergies: string[];
    conditions: string[];
  };
}

const QUICK_PROMPTS = [
  { icon: Pill, text: 'What are common drug interactions I should know about?', color: 'text-blue-400 bg-blue-500/10' },
  { icon: AlertTriangle, text: 'What happens if I miss a dose?', color: 'text-amber-400 bg-amber-500/10' },
  { icon: Activity, text: 'What are my medication side effects?', color: 'text-purple-400 bg-purple-500/10' },
  { icon: Heart, text: 'Give me tips to improve medication adherence', color: 'text-rose-400 bg-rose-500/10' },
];

function MarkdownContent({ content }: { content: string }) {
  const formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*?)$/gm, '<h3 class="font-bold text-[var(--text-primary)] mt-3 mb-1">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="font-bold text-[var(--text-primary)] mt-4 mb-2 text-base">$1</h2>')
    .replace(/^• (.*?)$/gm, '<li class="ml-3">$1</li>')
    .replace(/^- (.*?)$/gm, '<li class="ml-3">$1</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');

  return (
    <div
      className="prose-sm text-[var(--text-primary)] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: `<p>${formatted}</p>` }}
    />
  );
}

export function AIAssistantClient({ initialMessages, chatId, userContext }: AIAssistantClientProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          chatId: currentChatId,
          history: messages.slice(-10).map((m) => ({
            role: m.role.toLowerCase() as 'user' | 'assistant',
            content: m.content,
          })),
          userContext,
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();

      const assistantMessage: Message = {
        id: data.messageId || Date.now().toString() + '_ai',
        role: 'ASSISTANT',
        content: data.response,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (data.chatId) setCurrentChatId(data.chatId);
    } catch {
      toast.error('Failed to get AI response. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(undefined);
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Voice recognition failed');
    };
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-0 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-4 rounded-b-none flex items-center justify-between border-b-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--bg-secondary)] animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)]">myAfya AI Assistant</h3>
            <p className="text-xs text-emerald-400 font-medium">Online · Powered by Claude</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userContext.medicines.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
              <Pill className="w-3.5 h-3.5 text-primary-400" />
              <span className="text-xs text-primary-400 font-medium">{userContext.medicines.length} meds in context</span>
            </div>
          )}
          <button
            onClick={handleNewChat}
            className="btn-secondary text-sm py-2 px-3"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto glass-card rounded-none border-t-0 border-b-0 p-4 space-y-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-primary-500/20 flex items-center justify-center mb-6 animate-breathing"
            >
              <Brain className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Hello, I'm your AI Health Assistant
            </h3>
            <p className="text-[var(--text-secondary)] max-w-md mb-8 text-sm leading-relaxed">
              I can explain medications, warn about interactions, answer health questions, and provide personalized guidance based on your medication profile.
            </p>

            {/* Quick prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {QUICK_PROMPTS.map(({ icon: Icon, text, color }) => (
                <motion.button
                  key={text}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(text)}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border border-[var(--border-color)] text-left transition-all hover:border-primary-500/30',
                    'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', color.split(' ')[1])}>
                    <Icon className={cn('w-4 h-4', color.split(' ')[0])} />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-snug">{text}</p>
                </motion.button>
              ))}
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-6 max-w-sm">
              ⚠️ AI responses are for informational purposes only. Always consult your healthcare provider for medical decisions.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'USER' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1',
                  message.role === 'USER'
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                    : 'bg-gradient-to-br from-purple-500 to-primary-500 text-white'
                )}>
                  {message.role === 'USER' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div className={cn(
                  'max-w-[80%] flex flex-col gap-1',
                  message.role === 'USER' ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    message.role === 'USER'
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm'
                      : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-bl-sm'
                  )}>
                    {message.role === 'ASSISTANT' ? (
                      <MarkdownContent content={message.content} />
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">
                      {format(new Date(message.createdAt), 'h:mm a')}
                    </span>
                    {message.role === 'ASSISTANT' && (
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] typing-dot" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="glass-card p-4 rounded-t-none border-t">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your medications, health questions..."
              className="form-input resize-none min-h-[48px] max-h-32 pr-12 py-3"
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={toggleRecording}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
              title="Voice input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                input.trim() && !isLoading
                  ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-neon'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
          <Sparkles className="w-3 h-3 inline-block mr-1 text-purple-400" />
          AI responses are informational only · Always consult your doctor
        </p>
      </div>
    </div>
  );
}
