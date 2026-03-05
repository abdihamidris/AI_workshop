/**
 * myAfya-AI — Settings Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  User, Bell, Shield, Moon, Sun, Smartphone,
  Globe, Heart, Trash2, ChevronRight, Check,
  Loader2, Camera, Mail, Phone, Droplets,
  AlertTriangle, Save
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Moon },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'health', label: 'Health Profile', icon: Heart },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: 'O+',
  });

  const [notifications, setNotifications] = useState({
    reminderPush: true,
    reminderEmail: false,
    refillAlert: true,
    weeklyReport: true,
    aiInsights: true,
    reminderMinutesBefore: '15',
  });

  // Load profile from API on mount
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setProfileData({
            name: d.data.name || '',
            email: d.data.email || '',
            phone: d.data.phone || '',
            bloodType: d.data.bloodType || 'O+',
          });
        }
      })
      .catch(() => {
        // Fallback to session data
        setProfileData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          bloodType: 'O+',
        });
      });
  }, []);

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          bloodType: profileData.bloodType,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Update the session so the name changes everywhere instantly
      await updateSession({ name: profileData.name });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="sm:w-56 flex-shrink-0">
          <div className="glass-card p-2">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeSection === id
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                  id === 'danger' && activeSection !== 'danger' && 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {activeSection === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Profile ────────────────────────────────────────────────── */}
            {activeSection === 'profile' && (
              <div className="glass-card p-6 space-y-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Profile Settings</h3>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-black text-white">
                      {session?.user?.name ? getInitials(session.user.name) : 'U'}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{session?.user?.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{session?.user?.email}</p>
                    <button className="text-xs text-primary-400 hover:text-primary-300 mt-1 transition-colors">
                      Change photo
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      <User className="w-4 h-4 inline-block mr-1.5 mb-0.5" />
                      Full Name
                    </label>
                    <input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      <Mail className="w-4 h-4 inline-block mr-1.5 mb-0.5" />
                      Email Address
                    </label>
                    <input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      type="email"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      <Phone className="w-4 h-4 inline-block mr-1.5 mb-0.5" />
                      Phone Number
                    </label>
                    <input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      <Droplets className="w-4 h-4 inline-block mr-1.5 mb-0.5" />
                      Blood Type
                    </label>
                    <select
                      value={profileData.bloodType}
                      onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                      className="form-input"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                        <option key={bt} value={bt}>{bt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button onClick={handleSaveProfile} disabled={isSaving} className="btn-primary">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            )}

            {/* ── Notifications ───────────────────────────────────────────── */}
            {activeSection === 'notifications' && (
              <div className="glass-card p-6 space-y-5">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Notification Preferences</h3>

                {[
                  { key: 'reminderPush', label: 'Medication reminders', desc: 'Push notifications before scheduled doses', icon: Bell },
                  { key: 'reminderEmail', label: 'Email reminders', desc: 'Receive reminders via email', icon: Mail },
                  { key: 'refillAlert', label: 'Refill alerts', desc: 'Notify when medication supply is low', icon: AlertTriangle },
                  { key: 'weeklyReport', label: 'Weekly summary', desc: 'Weekly adherence report digest', icon: Globe },
                  { key: 'aiInsights', label: 'AI health insights', desc: 'Daily personalized health tips from AI', icon: Heart },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--border-color)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                        <p className="text-xs text-[var(--text-muted)]">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                      className={cn(
                        'w-11 h-6 rounded-full transition-all duration-300 relative',
                        notifications[key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-[var(--bg-tertiary)]'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-sm',
                        notifications[key as keyof typeof notifications] ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Remind me before dose (minutes)
                  </label>
                  <select
                    value={notifications.reminderMinutesBefore}
                    onChange={(e) => setNotifications({ ...notifications, reminderMinutesBefore: e.target.value })}
                    className="form-input max-w-xs"
                  >
                    {['5', '10', '15', '30', '60'].map((m) => (
                      <option key={m} value={m}>{m} minutes before</option>
                    ))}
                  </select>
                </div>

                <button onClick={() => toast.success('Notification settings saved')} className="btn-primary">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            )}

            {/* ── Appearance ──────────────────────────────────────────────── */}
            {activeSection === 'appearance' && (
              <div className="glass-card p-6 space-y-5">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Appearance</h3>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Smartphone },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                          theme === value
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-[var(--border-color)] hover:border-primary-500/50'
                        )}
                      >
                        <Icon className={cn('w-6 h-6', theme === value ? 'text-primary-400' : 'text-[var(--text-secondary)]')} />
                        <span className={cn('text-sm font-medium', theme === value ? 'text-primary-400' : 'text-[var(--text-secondary)]')}>
                          {label}
                        </span>
                        {theme === value && (
                          <span className="w-2 h-2 rounded-full bg-primary-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Accent Color</label>
                  <div className="flex gap-3">
                    {[
                      { color: '#0ea5e9', label: 'Sky Blue' },
                      { color: '#10b981', label: 'Emerald' },
                      { color: '#8b5cf6', label: 'Violet' },
                      { color: '#ec4899', label: 'Pink' },
                      { color: '#f59e0b', label: 'Amber' },
                    ].map(({ color, label }) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full hover:scale-110 transition-transform"
                        style={{ background: color }}
                        title={label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Security ───────────────────────────────────────────────── */}
            {activeSection === 'security' && (
              <div className="glass-card p-6 space-y-5">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Security Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Current Password
                    </label>
                    <input type="password" placeholder="••••••••" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      New Password
                    </label>
                    <input type="password" placeholder="••••••••" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Confirm New Password
                    </label>
                    <input type="password" placeholder="••••••••" className="form-input" />
                  </div>
                  <button className="btn-primary" onClick={() => toast.success('Password changed')}>
                    <Shield className="w-4 h-4" />
                    Change Password
                  </button>
                </div>

                <div className="border-t border-[var(--border-color)] pt-5">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">2FA Status</p>
                      <p className="text-xs text-red-400">Not enabled</p>
                    </div>
                    <button className="btn-primary text-sm py-2">Enable 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Health Profile ─────────────────────────────────────────── */}
            {activeSection === 'health' && (
              <div className="glass-card p-6 space-y-5">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Health Profile</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  This information helps the AI assistant provide more personalized guidance.
                </p>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Known Allergies
                  </label>
                  <input
                    defaultValue="Penicillin, Sulfa drugs"
                    placeholder="e.g. Penicillin, Aspirin"
                    className="form-input"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Separate multiple with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Medical Conditions
                  </label>
                  <input
                    defaultValue="Hypertension, Type 2 Diabetes"
                    placeholder="e.g. Hypertension, Diabetes"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Emergency Contact
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input placeholder="Contact name" className="form-input" />
                    <input placeholder="Phone number" className="form-input" />
                  </div>
                </div>

                <button onClick={() => toast.success('Health profile saved')} className="btn-primary">
                  <Save className="w-4 h-4" />
                  Save Health Profile
                </button>
              </div>
            )}

            {/* ── Danger Zone ─────────────────────────────────────────────── */}
            {activeSection === 'danger' && (
              <div className="glass-card p-6 space-y-5 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Danger Zone</h3>
                    <p className="text-xs text-[var(--text-muted)]">These actions cannot be undone</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: 'Delete all medication history',
                      desc: 'Permanently delete all adherence logs and reminder history',
                    },
                    {
                      title: 'Export and delete all data',
                      desc: 'Download your data and permanently delete your account',
                    },
                    {
                      title: 'Delete account',
                      desc: 'Permanently delete your myAfya-AI account and all associated data',
                    },
                  ].map(({ title, desc }) => (
                    <div key={title} className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{desc}</p>
                      </div>
                      <button
                        className="text-sm font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0 ml-4"
                        onClick={() => toast.error('This action requires additional confirmation in production')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
