/**
 * myAfya-AI — Medicines List Client Component
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pill, Search, Filter, MoreVertical,
  Trash2, Edit, Power, Clock, Calendar,
  AlertTriangle, ChevronRight, Package
} from 'lucide-react';
import { format } from 'date-fns';
import { cn, getFrequencyLabel, getMedicineFormLabel, getMedicineFormIcon, formatTimeSlot } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MedicinesClientProps {
  medicines: any[];
}

const FILTER_OPTIONS = ['All', 'Active', 'Inactive', 'Low Stock'];

export function MedicinesClient({ medicines: initialMedicines }: MedicinesClientProps) {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName?.toLowerCase().includes(search.toLowerCase()) ||
      m.prescribedBy?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && m.isActive) ||
      (filter === 'Inactive' && !m.isActive) ||
      (filter === 'Low Stock' && m.pillCount && m.refillAt && m.pillCount <= m.refillAt);

    return matchesSearch && matchesFilter;
  });

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setMedicines((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isActive: !currentStatus } : m))
        );
        toast.success(currentStatus ? 'Medicine deactivated' : 'Medicine activated');
      }
    } catch {
      toast.error('Failed to update medicine');
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedicines((prev) => prev.filter((m) => m.id !== id));
        toast.success('Medicine deleted');
      }
    } catch {
      toast.error('Failed to delete medicine');
    }
    setDeletingId(null);
    setOpenMenuId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">My Medicines</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            {medicines.filter((m) => m.isActive).length} active · {medicines.length} total
          </p>
        </div>
        <Link href="/medicines/add" className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add Medicine
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search medicines, dosage, doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm font-medium transition-all',
                filter === opt
                  ? 'bg-primary-500 text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Cards */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <Pill className="w-10 h-10 text-primary-400 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {search ? 'No medicines found' : 'No medicines yet'}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            {search
              ? 'Try a different search term'
              : 'Add your first medicine to start tracking your medications.'}
          </p>
          {!search && (
            <Link href="/medicines/add" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              Add your first medicine
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((medicine, i) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'glass-card p-5 relative border',
                  medicine.isActive ? 'border-[var(--border-color)]' : 'border-[var(--border-color)] opacity-60'
                )}
              >
                {/* Status indicator */}
                <div className={cn(
                  'absolute top-4 right-12 w-2 h-2 rounded-full',
                  medicine.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-[var(--text-muted)]'
                )} />

                {/* Top row */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${medicine.color || '#0ea5e9'}20` }}
                  >
                    {getMedicineFormIcon(medicine.form)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--text-primary)] truncate">{medicine.name}</h3>
                    {medicine.genericName && (
                      <p className="text-xs text-[var(--text-muted)] truncate">{medicine.genericName}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: medicine.color || '#0ea5e9', background: `${medicine.color || '#0ea5e9'}15` }}
                      >
                        {medicine.dosage} {medicine.unit.toLowerCase()}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {getMedicineFormLabel(medicine.form)}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === medicine.id ? null : medicine.id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === medicine.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-8 w-44 glass rounded-xl shadow-glass border border-[var(--glass-border)] overflow-hidden z-20"
                        >
                          <Link
                            href={`/medicines/${medicine.id}/edit`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Edit className="w-4 h-4" /> Edit medicine
                          </Link>
                          <button
                            onClick={() => handleToggleActive(medicine.id, medicine.isActive)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            <Power className="w-4 h-4" />
                            {medicine.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <div className="border-t border-[var(--border-color)]" />
                          <button
                            onClick={() => handleDelete(medicine.id)}
                            disabled={deletingId === medicine.id}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{getFrequencyLabel(medicine.frequency)}</span>
                    {medicine.specificTimes.length > 0 && (
                      <span className="text-[var(--text-muted)]">
                        · {medicine.specificTimes.map(formatTimeSlot).join(', ')}
                      </span>
                    )}
                  </div>

                  {medicine.prescribedBy && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="text-[var(--text-muted)]">Rx:</span>
                      <span>{medicine.prescribedBy}</span>
                    </div>
                  )}

                  {medicine.pillCount !== null && (
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[var(--text-secondary)]">{medicine.pillCount} pills remaining</span>
                          {medicine.refillAt && medicine.pillCount <= medicine.refillAt && (
                            <span className="text-amber-400 flex items-center gap-1 font-medium">
                              <AlertTriangle className="w-3 h-3" /> Refill soon
                            </span>
                          )}
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill bg-gradient-to-r from-primary-500 to-secondary-500"
                            style={{
                              width: `${Math.min(100, (medicine.pillCount / (medicine.refillAt ? medicine.refillAt * 3 : 90)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Since {format(new Date(medicine.startDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    medicine.isActive
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                  )}>
                    {medicine.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Instructions */}
                {medicine.instructions && (
                  <p className="text-xs text-[var(--text-muted)] mt-2 italic border-t border-[var(--border-color)] pt-2">
                    💡 {medicine.instructions}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
