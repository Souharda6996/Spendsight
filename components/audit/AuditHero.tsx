'use client';
import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface AuditHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

export default function AuditHero({ totalMonthlySavings, totalAnnualSavings }: AuditHeroProps) {
  const countedMonthly = useCountUp(totalMonthlySavings);
  const countedAnnual  = useCountUp(totalAnnualSavings);
  const optimal = totalMonthlySavings === 0;

  return (
    <div
      className="glass-card text-center"
      style={{
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        borderColor: optimal ? 'var(--border)' : 'var(--border-accent)',
        background: optimal ? 'var(--surface)' : 'rgba(99,210,150,0.04)',
      }}
    >
      {/* Background glow */}
      {!optimal && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(99,210,150,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative' }}>
        {optimal ? (
          <>
            <div style={{ fontSize: '64px', marginBottom: '8px' }}>✓</div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 5vw, 48px)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}
            >
              {"You're spending well."}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              No immediate savings identified. Your stack looks optimized.
            </p>
          </>
        ) : (
          <>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '12px',
              }}
            >
              Potential monthly savings
            </p>
            {/* Reserve fixed height to prevent layout shift */}
            <h1
              className="savings-glow"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 10vw, 96px)',
                fontWeight: 800,
                color: 'var(--accent)',
                lineHeight: 1,
                marginBottom: '8px',
                minHeight: '1.1em',
              }}
            >
              {formatCurrency(countedMonthly)}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              per month &nbsp;·&nbsp;{' '}
              <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {formatCurrency(countedAnnual)}
              </strong>{' '}
              per year
            </p>
          </>
        )}
      </div>
    </div>
  );
}
