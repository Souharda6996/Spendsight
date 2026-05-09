import { cn } from '@/lib/utils';

type BadgeVariant = 'downgrade' | 'switch' | 'optimal' | 'credits' | 'neutral';

const BADGE_STYLES: Record<BadgeVariant, string> = {
  downgrade: 'bg-[rgba(245,101,101,0.12)] text-[#f56565] border border-[rgba(245,101,101,0.25)]',
  switch:    'bg-[rgba(246,173,85,0.12)] text-[#f6ad55] border border-[rgba(246,173,85,0.25)]',
  optimal:   'bg-[rgba(99,210,150,0.12)] text-[#63d296] border border-[rgba(99,210,150,0.25)]',
  credits:   'bg-[rgba(99,170,255,0.12)] text-[#63aaff] border border-[rgba(99,170,255,0.25)]',
  neutral:   'bg-[rgba(255,255,255,0.06)] text-[#8b99b0] border border-[rgba(255,255,255,0.08)]',
};

const BADGE_LABELS: Record<BadgeVariant, string> = {
  downgrade: 'Downgrade',
  switch:    'Switch Tool',
  optimal:   'Optimal',
  credits:   'Credits Available',
  neutral:   '',
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        BADGE_STYLES[variant],
        className
      )}
    >
      {label ?? BADGE_LABELS[variant]}
    </span>
  );
}
