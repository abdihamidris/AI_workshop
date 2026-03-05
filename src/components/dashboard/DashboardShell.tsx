/**
 * myAfya-AI — Dashboard Shell (Client wrapper)
 */
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your health overview' },
  '/medicines': { title: 'My Medicines', subtitle: 'Manage your medications' },
  '/medicines/add': { title: 'Add Medicine', subtitle: 'Add a new medication' },
  '/calendar': { title: 'Medication Calendar', subtitle: 'View your schedule' },
  '/ai-assistant': { title: 'AI Health Assistant', subtitle: 'Powered by Claude AI' },
  '/reports': { title: 'Reports & Analytics', subtitle: 'Medication adherence insights' },
  '/prescriptions': { title: 'Prescription Scanner', subtitle: 'Scan & auto-import prescriptions' },
  '/family': { title: 'Family Mode', subtitle: 'Manage family medications' },
  '/settings': { title: 'Settings', subtitle: 'Account & preferences' },
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const page = pageTitles[pathname] || { title: 'myAfya-AI', subtitle: 'Your health companion' };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={page.title}
          subtitle={page.subtitle}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
