/**
 * myAfya-AI — Signup Page
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock, User, ArrowRight, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const password = watch('password', '');

  const passwordRules = [
    { label: '8+ characters', test: password.length >= 8 },
    { label: 'Uppercase letter', test: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', test: /[a-z]/.test(password) },
    { label: 'Number', test: /\d/.test(password) },
  ];

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      const result = await res.json();
      if (!result.success) {
        toast.error(result.error || 'Registration failed');
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Account created! Please sign in.');
        router.push('/login');
      } else {
        toast.success('Welcome to myAfya-AI! 🎉');
        router.push('/dashboard');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-secondary-900 via-primary-900 to-primary-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-32 left-16 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-16 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">myAfya-AI</span>
          </div>

          <div>
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Start your health journey
              <br />today.
            </h1>
            <p className="text-secondary-200 text-lg mb-8">
              Free forever for individuals. Join millions managing their health with AI assistance.
            </p>

            <div className="space-y-3">
              {[
                'Smart medication reminders',
                'AI-powered health guidance',
                'Prescription scanning',
                'Family health management',
                'Doctor report sharing',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary-400/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-secondary-300" />
                  </div>
                  <span className="text-secondary-100 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-secondary-300 text-sm">
            Already trusted by healthcare professionals in 50+ countries
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">myAfya-AI</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="btn-secondary text-sm px-4 py-2">
              Sign in
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2">
                Create your account
              </h2>
              <p className="text-[var(--text-secondary)]">
                Free forever — no credit card required
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Alex Johnson"
                    className="form-input pl-10"
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="form-input pl-10"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="form-input pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {passwordRules.map(({ label, test }) => (
                      <div key={label} className={`flex items-center gap-1.5 text-xs ${test ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${test ? 'bg-emerald-400' : 'bg-[var(--text-muted)]'}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Repeat your password"
                    className="form-input pl-10"
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-base py-3.5 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-center text-[var(--text-muted)] mt-4">
              By creating an account you agree to our{' '}
              <a href="#" className="text-primary-400 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
            </p>

            <p className="text-center text-sm text-[var(--text-muted)] mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
