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
    <div className="glass-card anim-fade-up" data-delay="1" style={{
      padding: '48px',
      textAlign: 'center',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accent glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '200px',
        background: 'radial-gradient(circle, rgba(0,200,150,0.10) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      
      <div className="badge-accent" style={{ marginBottom: '24px' }}>
        {isOptimal ? 'Audit Complete' : 'Audit Complete'}
      </div>
      
      {isOptimal ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: 'clamp(32px, 5vw, 48px)', 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            color: 'var(--accent)', 
            marginBottom: '12px' 
          }}>
            Your stack is optimized. ✓
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 300 }}>
            No immediate overspend identified. You&apos;re spending efficiently.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '32px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div className="stat-number">
              <span ref={counterRef}>${totalMonthlySavings}</span>
            </div>
            <div className="stat-label">Monthly Savings</div>
          </div>
          <div style={{ width: '1px', height: '60px', background: 'var(--border-subtle)' }} />
          <div>
            <div className="stat-number">
              ${totalAnnualSavings.toLocaleString()}
            </div>
            <div className="stat-label">Annual Savings</div>
          </div>
        </div>
      )}
    </div>
  );
}
