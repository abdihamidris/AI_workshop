/**
 * myAfya-AI — Landing Page
 * Premium health-tech marketing page
 */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, Brain, Bell, Shield, Users, BarChart3,
  Scan, Mic, ArrowRight, Check, Star, Zap,
  Activity, Pill, Clock, TrendingUp, ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const features = [
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a dose with intelligent, personalized medication reminders.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Brain,
    title: 'AI Health Assistant',
    description: 'Get instant answers about medications, interactions, and health guidance.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Scan,
    title: 'Prescription Scanner',
    description: 'Upload prescriptions and auto-generate reminders using OCR technology.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BarChart3,
    title: 'Adherence Analytics',
    description: 'Track your medication adherence with beautiful charts and insights.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Users,
    title: 'Family Mode',
    description: 'Manage medications for your entire family from one account.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Shield,
    title: 'Healthcare Privacy',
    description: 'Enterprise-grade security with healthcare data privacy compliance.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

const stats = [
  { value: '98%', label: 'Adherence Rate', icon: TrendingUp },
  { value: '2M+', label: 'Active Users', icon: Users },
  { value: '50K+', label: 'Medicines Tracked', icon: Pill },
  { value: '4.9★', label: 'App Store Rating', icon: Star },
];

const testimonials = [
  {
    name: 'Dr. Sarah Okonkwo',
    role: 'Cardiologist, Nairobi Hospital',
    text: 'myAfya-AI has transformed how my patients manage their cardiac medications. The adherence reports are invaluable.',
    avatar: 'SO',
    color: 'bg-blue-500',
  },
  {
    name: 'James Mwangi',
    role: 'Type 2 Diabetes Patient',
    text: 'Managing 4 medications daily was overwhelming. Now I never miss a dose and my HbA1c is the best it\'s been in years.',
    avatar: 'JM',
    color: 'bg-emerald-500',
  },
  {
    name: 'Grace Kamau',
    role: 'Family Caregiver',
    text: 'I manage medications for my elderly parents and two kids. Family Mode is a lifesaver — everything in one place.',
    avatar: 'GK',
    color: 'bg-purple-500',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* ─── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">myAfya-AI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How it works', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login" className="btn-secondary text-sm px-4 py-2 hidden sm:flex">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary text-sm px-4 py-2">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-40 w-80 h-80 bg-secondary-500/15 rounded-full blur-3xl" />
          <div className="absolute top-60 right-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-400 text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              <span>Powered by Claude AI</span>
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
              <span>HIPAA-ready infrastructure</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            >
              Your
              <span className="gradient-text"> AI Health </span>
              <br />Companion
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Never miss a medication, understand your prescriptions, and get
              personalized AI health guidance — all in one beautifully designed platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/signup" className="btn-primary text-base px-8 py-4 group">
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-4">
                View demo dashboard
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]"
            >
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: ['#0ea5e9','#10b981','#8b5cf6','#f59e0b','#ec4899'][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span>Trusted by <strong className="text-[var(--text-secondary)]">2M+ patients</strong> worldwide</span>
            </motion.div>
          </div>

          {/* ─── Dashboard Preview ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="card-gradient-border">
              <div className="p-6 rounded-[calc(1rem-1px)]">
                {/* Mock Dashboard UI */}
                <div className="flex gap-4">
                  {/* Sidebar mock */}
                  <div className="hidden md:flex flex-col gap-2 w-48 flex-shrink-0">
                    <div className="flex items-center gap-2 p-3 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-bold gradient-text">myAfya-AI</span>
                    </div>
                    {[
                      { icon: Activity, label: 'Dashboard', active: true },
                      { icon: Pill, label: 'Medicines', active: false },
                      { icon: Bell, label: 'Reminders', active: false },
                      { icon: Brain, label: 'AI Assistant', active: false },
                    ].map(({ icon: Icon, label, active }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                          active ? 'bg-primary-500/15 text-primary-400' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Main content mock */}
                  <div className="flex-1 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Today\'s Doses', value: '4/6', color: 'text-blue-400' },
                        { label: 'Adherence', value: '94%', color: 'text-emerald-400' },
                        { label: 'Day Streak', value: '12 days', color: 'text-purple-400' },
                        { label: 'Refill Due', value: '2 meds', color: 'text-amber-400' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="glass rounded-xl p-3">
                          <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
                          <p className={`text-lg font-bold ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Schedule preview */}
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">TODAY'S SCHEDULE</p>
                      <div className="space-y-2">
                        {[
                          { time: '8:00 AM', name: 'Metformin 500mg', status: 'taken', color: '#3B82F6' },
                          { time: '12:00 PM', name: 'Lisinopril 10mg', status: 'taken', color: '#10B981' },
                          { time: '8:00 PM', name: 'Atorvastatin 20mg', status: 'pending', color: '#8B5CF6' },
                        ].map(({ time, name, status, color }) => (
                          <div key={name} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span className="text-xs text-[var(--text-muted)] w-16">{time}</span>
                            <span className="text-xs text-[var(--text-primary)] flex-1">{name}</span>
                            <span className={`text-xs font-medium ${status === 'taken' ? 'text-emerald-400' : 'text-blue-400'}`}>
                              {status === 'taken' ? '✓ Taken' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Adherence chart mock */}
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">WEEKLY ADHERENCE</p>
                      <div className="flex items-end gap-2 h-16">
                        {[90, 75, 100, 85, 95, 70, 88].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-primary-500/20 relative overflow-hidden">
                            <div
                              className="absolute bottom-0 inset-x-0 rounded-t-sm bg-gradient-to-t from-primary-600 to-primary-400"
                              style={{ height: `${h}%` }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 glass rounded-2xl p-3 shadow-glass hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Dose Taken</p>
                <p className="text-xs text-[var(--text-muted)]">Metformin 500mg ✓</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 glass rounded-2xl p-3 shadow-glass hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">AI Insight</p>
                <p className="text-xs text-[var(--text-muted)]">Great adherence streak! 🎉</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Section ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <p className="text-2xl font-black text-[var(--text-primary)]">{value}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--border-color)] text-sm text-[var(--text-secondary)] mb-4"
            >
              <Zap className="w-4 h-4 text-primary-400" />
              Everything you need
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl font-black mb-4"
            >
              Built for your
              <span className="gradient-text"> health journey</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] max-w-2xl mx-auto"
            >
              Every feature designed with patients, caregivers, and healthcare
              professionals in mind.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
                <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Get started in
              <span className="gradient-text"> 3 simple steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your profile',
                description: 'Sign up and add your health profile including conditions, allergies, and current medications.',
                icon: Users,
                color: 'text-blue-400',
              },
              {
                step: '02',
                title: 'Add your medicines',
                description: 'Manually add medications or upload a prescription photo for automatic extraction.',
                icon: Scan,
                color: 'text-emerald-400',
              },
              {
                step: '03',
                title: 'Stay on track',
                description: 'Receive smart reminders, track adherence, and get AI-powered health insights daily.',
                icon: Bell,
                color: 'text-purple-400',
              },
            ].map(({ step, title, description, icon: Icon, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-3xl glass border border-[var(--border-color)] flex items-center justify-center mx-auto">
                    <Icon className={`w-8 h-8 ${color}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-black text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Loved by patients &
              <span className="gradient-text"> healthcare providers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, avatar, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 text-center"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />
            <div className="absolute inset-0 bg-dots opacity-20" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4">
                Start your health journey today
              </h2>
              <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                Join 2 million patients who trust myAfya-AI for their medication management. Free forever for individuals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-bold text-base hover:bg-primary-50 transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                >
                  Create free account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-base border border-white/20 hover:bg-white/15 transition-all"
                >
                  Sign in
                </Link>
              </div>
              <p className="mt-6 text-primary-200 text-sm">
                <Check className="w-4 h-4 inline-block mr-1" />
                No credit card required &nbsp;·&nbsp;
                <Check className="w-4 h-4 inline-block mr-1" />
                HIPAA-ready &nbsp;·&nbsp;
                <Check className="w-4 h-4 inline-block mr-1" />
                Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-color)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">myAfya-AI</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm text-center">
              © 2026 myAfya-AI. Empowering healthier lives through intelligent technology.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
