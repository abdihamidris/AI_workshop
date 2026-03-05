/**
 * myAfya-AI — Dashboard Header
 */
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getInitials } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

const mockNotifications = [
  { id: 1, type: 'reminder', message: 'Time to take Atorvastatin 20mg', time: '2 min ago', unread: true },
  { id: 2, type: 'refill', message: 'Lisinopril supply is running low (7 pills left)', time: '1 hour ago', unread: true },
  { id: 3, type: 'success', message: 'Great job! 7-day adherence streak! 🎉', time: '3 hours ago', unread: false },
];

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--glass-border)] px-4 sm:px-6 h-16 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-[var(--text-primary)] truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)] hidden sm:block">
            {subtitle || format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-glass border border-[var(--glass-border)] overflow-hidden z-50"
              >
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-[var(--text-primary)]">Notifications</h3>
                  <button className="text-xs text-primary-400 hover:text-primary-300">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors ${
                        notif.unread ? 'bg-primary-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          notif.unread ? 'bg-primary-400' : 'bg-transparent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-primary)] leading-snug">{notif.message}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add medicine quick action */}
        <Link href="/medicines/add" className="btn-primary px-3 py-2 text-sm hidden sm:flex">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Add Medicine</span>
        </Link>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white cursor-pointer flex-shrink-0">
          {session?.user?.name ? getInitials(session.user.name) : 'U'}
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 h-16 flex items-center px-6 glass border-b border-[var(--glass-border)] z-10"
          >
            <Search className="w-5 h-5 text-[var(--text-muted)] mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search medicines, reports, settings..."
              autoFocus
              className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors ml-3"
            >
              ESC
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
