'use client';
import { useEffect, useRef } from 'react';

interface AuditHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend?: number;
}

export function AuditHero({ totalMonthlySavings, totalAnnualSavings, totalCurrentSpend }: AuditHeroProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const annualRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const wastePercent = totalCurrentSpend && totalCurrentSpend > 0
    ? Math.min(100, Math.round((totalMonthlySavings / totalCurrentSpend) * 100))
    : 0;

  // Animate monthly + annual counter
  useEffect(() => {
    if (totalMonthlySavings === 0) return;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (counterRef.current) counterRef.current.textContent = `$${Math.round(eased * totalMonthlySavings)}`;
      if (annualRef.current)  annualRef.current.textContent  = `$${Math.round(eased * totalAnnualSavings).toLocaleString()}`;
      if (barRef.current)     barRef.current.style.width     = `${eased * wastePercent}%`;
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [totalMonthlySavings, totalAnnualSavings, wastePercent]);

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
        <>
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
                <span ref={annualRef}>${totalAnnualSavings.toLocaleString()}</span>
              </div>
              <div className="stat-label">Annual Savings</div>
            </div>
          </div>
          {/* Waste bar */}
          {wastePercent > 0 && (
            <div style={{ marginTop: '28px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Preventable Spend</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#f87171' }}>{wastePercent}% of budget</span>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div
                  ref={barRef}
                  style={{
                    height: '100%', width: '0%',
                    background: 'linear-gradient(90deg, #f87171, #ef4444)',
                    borderRadius: '2px',
                    transition: 'width 0.05s linear',
                    boxShadow: '0 0 8px rgba(239,68,68,0.5)',
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
