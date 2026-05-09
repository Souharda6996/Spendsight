'use client';
import { useEffect, useRef } from 'react';

interface AuditHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export function AuditHero({ totalMonthlySavings, totalAnnualSavings }: AuditHeroProps) {
  const counterRef = useRef<HTMLSpanElement>(null);

  // Animated counter
  useEffect(() => {
    if (!counterRef.current || totalMonthlySavings === 0) return;
    const target = totalMonthlySavings;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      if (counterRef.current) counterRef.current.textContent = `$${current}`;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [totalMonthlySavings]);

  const isOptimal = totalMonthlySavings === 0;

  return (
    <div className="glow-card anim-scale-in" style={{
      padding: 'clamp(40px, 6vw, 72px)',
      textAlign: 'center',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle animated orb behind number */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px', height: '200px',
        background: 'radial-gradient(ellipse, rgba(99,210,150,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'orb-pulse 6s ease-in-out infinite',
      }} />

      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: '16px',
        fontFamily: 'var(--font-mono)',
      }}>
        {isOptimal ? 'Audit Complete' : 'Potential Monthly Savings'}
      </p>

      {isOptimal ? (
        <div>
          <p style={{fontSize: 'clamp(40px, 6vw, 64px)', fontFamily:'var(--font-display)', fontWeight:800, color:'var(--accent)', marginBottom:'8px'}}>
            You&apos;re spending well. ✓
          </p>
          <p style={{color:'var(--text-secondary)', fontSize:'16px'}}>
            No immediate savings identified — your stack is optimized.
          </p>
        </div>
      ) : (
        <>
          <div className="savings-number" style={{marginBottom: '16px', position:'relative', zIndex:1}}>
            <span ref={counterRef}>${totalMonthlySavings}</span>
          </div>
          <p style={{color: 'var(--text-secondary)', fontSize: 'clamp(14px, 2vw, 18px)', fontWeight:300}}>
            per month &nbsp;·&nbsp; <strong style={{color:'var(--text-primary)', fontWeight:600}}>${totalAnnualSavings.toLocaleString()}</strong> per year
          </p>
        </>
      )}
    </div>
  );
}
