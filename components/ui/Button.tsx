'use client';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63d296] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b11]';

    const variants = {
      primary:
        'bg-[#63d296] text-[#080b11] font-semibold hover:bg-[#7dddaa] hover:shadow-[0_0_24px_rgba(99,210,150,0.35)] active:scale-[0.98]',
      ghost:
        'text-[#8b99b0] hover:text-[#f0f4f8] hover:bg-[rgba(255,255,255,0.06)] active:scale-[0.98]',
      outline:
        'border border-[rgba(255,255,255,0.12)] text-[#f0f4f8] hover:border-[#63d296] hover:text-[#63d296] hover:bg-[rgba(99,210,150,0.05)] active:scale-[0.98]',
      danger:
        'border border-[rgba(245,101,101,0.3)] text-[#f56565] hover:bg-[rgba(245,101,101,0.08)] active:scale-[0.98]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
