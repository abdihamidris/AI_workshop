/**
 * myAfya-AI — Family Mode Page
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Pill, Heart, Baby, UserCheck, Edit2, X, Check } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const RELATION_OPTIONS = [
  { value: 'SPOUSE', label: 'Spouse/Partner', icon: Heart },
  { value: 'CHILD', label: 'Child', icon: Baby },
  { value: 'PARENT', label: 'Parent', icon: UserCheck },
  { value: 'SIBLING', label: 'Sibling', icon: Users },
  { value: 'GRANDPARENT', label: 'Grandparent', icon: UserCheck },
  { value: 'OTHER', label: 'Other', icon: Users },
];

const RELATION_COLORS: Record<string, string> = {
  SPOUSE: '#0ea5e9',
  CHILD: '#10b981',
  PARENT: '#8b5cf6',
  SIBLING: '#f59e0b',
  GRANDPARENT: '#ec4899',
  OTHER: '#64748b',
};

const mockProfiles = [
  {
    id: '1',
    name: 'Sarah Johnson',
    relationship: 'SPOUSE',
    conditions: ['Asthma'],
    medicines: 2,
    avatar: 'SJ',
  },
  {
    id: '2',
    name: 'Ethan Johnson',
    relationship: 'CHILD',
    conditions: ['Seasonal allergies'],
    medicines: 1,
    avatar: 'EJ',
  },
];

export default function FamilyPage() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    relationship: 'SPOUSE',
    conditions: '',
  });

  const handleAddProfile = async () => {
    if (!newProfile.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      relationship: newProfile.relationship,
      conditions: newProfile.conditions.split(',').map((c) => c.trim()).filter(Boolean),
      medicines: 0,
      avatar: getInitials(newProfile.name),
    };

    setProfiles([...profiles, profile]);
    setNewProfile({ name: '', relationship: 'SPOUSE', conditions: '' });
    setShowAddForm(false);
    toast.success(`${profile.name} added to Family Mode!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Family Mode</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            Manage medications for your entire family
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Me card */}
      <div className="glass-card p-5 border border-primary-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
            ME
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-[var(--text-primary)]">Your Profile</p>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/15 text-primary-400">Primary</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Hypertension, Type 2 Diabetes</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary-400">5</p>
            <p className="text-xs text-[var(--text-muted)]">medicines</p>
          </div>
        </div>
      </div>

      {/* Family profiles */}
      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {profiles.map((profile, i) => {
            const color = RELATION_COLORS[profile.relationship] || '#64748b';
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: color }}
                  >
                    {profile.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[var(--text-primary)] truncate">{profile.name}</p>
                    <p className="text-xs font-medium" style={{ color }}>
                      {RELATION_OPTIONS.find((r) => r.value === profile.relationship)?.label}
                    </p>
                    {profile.conditions.length > 0 && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                        {profile.conditions.join(', ')}
                      </p>
                    )}
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)]">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {profile.medicines} active medicine{profile.medicines !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
                    onClick={() => toast.success(`Managing ${profile.name}'s medicines`)}
                  >
                    Manage →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add member CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAddForm(true)}
          className="glass-card p-5 border-2 border-dashed border-[var(--border-color)] hover:border-primary-500/50 transition-all flex flex-col items-center justify-center gap-3 min-h-[140px] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] group-hover:bg-primary-500/15 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-[var(--text-muted)] group-hover:text-primary-400 transition-colors" />
          </div>
          <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-primary-400 transition-colors">
            Add family member
          </span>
        </motion.button>
      </div>

      {/* Add form modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[var(--text-primary)]">Add Family Member</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Full Name
                  </label>
                  <input
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Relationship
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RELATION_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <label key={value} className={cn(
                        'flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                        newProfile.relationship === value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-[var(--border-color)] hover:border-primary-500/30'
                      )}>
                        <input
                          type="radio"
                          value={value}
                          checked={newProfile.relationship === value}
                          onChange={(e) => setNewProfile({ ...newProfile, relationship: e.target.value })}
                          className="sr-only"
                        />
                        <Icon className={cn(
                          'w-4 h-4',
                          newProfile.relationship === value ? 'text-primary-400' : 'text-[var(--text-muted)]'
                        )} />
                        <span className={cn(
                          'text-xs font-medium',
                          newProfile.relationship === value ? 'text-primary-400' : 'text-[var(--text-secondary)]'
                        )}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Medical Conditions
                  </label>
                  <input
                    value={newProfile.conditions}
                    onChange={(e) => setNewProfile({ ...newProfile, conditions: e.target.value })}
                    placeholder="e.g. Asthma, Allergies (comma-separated)"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleAddProfile} className="btn-primary flex-1">
                  <Check className="w-4 h-4" />
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
