/**
 * myAfya-AI — Loading Spinner Component
 */
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={cn(
        'rounded-full border-transparent animate-spin',
        'border-t-primary-500 border-r-primary-500/30',
        sizes[size],
        className
      )}
      style={{ borderStyle: 'solid' }}
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-primary-400 animate-ping opacity-30" />
        </div>
        <div className="text-center">
          <p className="font-bold gradient-text text-lg">myAfya-AI</p>
          <p className="text-sm text-[var(--text-muted)]">Loading your health dashboard...</p>
        </div>
      </div>
    </div>
  );
}
