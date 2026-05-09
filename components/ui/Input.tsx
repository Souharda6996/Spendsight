'use client';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span
              className="absolute left-3 text-sm select-none"
              style={{ color: 'var(--text-muted)' }}
            >
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full h-10 rounded-xl border text-sm transition-all duration-200 bg-transparent',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63d296]',
              prefix ? 'pl-7 pr-3' : 'px-3',
              error
                ? 'border-[var(--danger)] focus-visible:ring-[var(--danger)]'
                : 'border-[var(--border)] hover:border-[rgba(255,255,255,0.15)] focus-visible:border-[var(--accent)]',
              className
            )}
            style={{ color: 'var(--text-primary)' }}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
