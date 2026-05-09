import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  accentBorder?: boolean;
}

export default function Card({ className, glow, accentBorder, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 transition-all duration-300',
        glow && 'accent-glow-pulse',
        accentBorder && 'border-accent bg-accent-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
