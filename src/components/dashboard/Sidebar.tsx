/**
 * myAfya-AI — Dashboard Sidebar
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Pill, Calendar, MessageSquare,
  FileText, Settings, LogOut, Bell, Users,
  ChevronLeft, ChevronRight, Scan, TrendingUp, X
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  group?: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', icon: Activity, label: 'Dashboard', group: 'main' },
  { href: '/medicines', icon: Pill, label: 'My Medicines', group: 'main' },
  { href: '/calendar', icon: Calendar, label: 'Med Calendar', group: 'main' },
  { href: '/ai-assistant', icon: MessageSquare, label: 'AI Assistant', group: 'tools' },
  { href: '/reports', icon: TrendingUp, label: 'Reports', group: 'tools' },
  { href: '/prescriptions', icon: Scan, label: 'Prescriptions', group: 'tools' },
  { href: '/family', icon: Users, label: 'Family Mode', group: 'tools' },
  { href: '/settings', icon: Settings, label: 'Settings', group: 'account' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className={cn(
      'flex flex-col h-full transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border-color)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-neon">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden"
          >
            <p className="font-black text-base gradient-text leading-none">myAfya-AI</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Health Platform</p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
        {/* Main group */}
        {!collapsed && (
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-3 mb-2">
            Main
          </p>
        )}
        {navItems.filter(i => i.group === 'main').map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} onMobileClose={onMobileClose} />
        ))}

        {!collapsed && (
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-3 mb-2 mt-5">
            Tools
          </p>
        )}
        {!collapsed && <div className="border-t border-[var(--border-color)] my-2" />}
        {navItems.filter(i => i.group === 'tools').map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} onMobileClose={onMobileClose} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--border-color)] p-3 space-y-2">
        {/* Settings */}
        {navItems.filter(i => i.group === 'account').map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item.href)} collapsed={collapsed} onMobileClose={onMobileClose} />
        ))}

        {/* Theme toggle */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-[var(--text-muted)]">Theme</span>
            <ThemeToggle />
          </div>
        )}

        {/* User profile */}
        <div className={cn(
          'flex items-center gap-3 rounded-xl p-2.5',
          'hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors',
          collapsed ? 'justify-center' : ''
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {session?.user?.name ? getInitials(session.user.name) : 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {session?.user?.email}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center justify-center gap-2 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 glass border-r border-[var(--glass-border)] overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen z-50 glass border-r border-[var(--glass-border)] overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={onMobileClose}
                  className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  item,
  isActive,
  collapsed,
  onMobileClose,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onMobileClose: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onMobileClose}
      className={cn(
        'nav-item relative group',
        isActive && 'active',
        collapsed && 'justify-center px-0'
      )}
      title={collapsed ? item.label : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav"
          className="absolute inset-0 bg-primary-500/10 rounded-xl"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <Icon className={cn(
        'w-5 h-5 relative z-10 flex-shrink-0',
        isActive ? 'text-primary-500' : 'text-[var(--text-secondary)]'
      )} />
      {!collapsed && (
        <span className={cn(
          'relative z-10 text-sm',
          isActive ? 'text-primary-500 font-semibold' : 'font-medium'
        )}>
          {item.label}
        </span>
      )}
      {item.badge && !collapsed && (
        <span className="ml-auto relative z-10 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
