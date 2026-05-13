'use client';
import { useEffect, useRef, useState } from 'react';
import { StackScore } from '@/lib/stack-score';

interface StackScoreBadgeProps {
  stackScore: StackScore;
}

export default function StackScoreBadge({ stackScore }: StackScoreBadgeProps) {
  const arcRef = useRef<SVGCircleElement>(null);
  const scoreNumRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  const handleShareGrade = () => {
    const text = `My AI stack scored a ${stackScore.grade} (${stackScore.score}/100) on SpendSight — free audit for your team: https://spendsight-chi.vercel.app`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const targetDash = (stackScore.score / 100) * circumference;

  // Animate the SVG arc + numeric score on mount
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (arcRef.current) {
        const dash = eased * targetDash;
        arcRef.current.style.strokeDashoffset = String(circumference - dash);
      }
      if (scoreNumRef.current) {
        scoreNumRef.current.textContent = String(Math.round(eased * stackScore.score));
      }
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [stackScore.score, targetDash, circumference]);

  return (
    <div
      className="glass-card anim-fade-up"
      style={{
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `3px solid ${stackScore.color}`,
      }}
    >
      {/* Background glow behind grade */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '300px', height: '120px',
        background: `radial-gradient(ellipse, ${stackScore.color}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* SVG arc gauge + letter grade */}
      <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Animated arc */}
          <circle
            ref={arcRef}
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={stackScore.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: 'stroke 0.3s ease', filter: `drop-shadow(0 0 6px ${stackScore.color}60)` }}
          />
        </svg>

        {/* Centered letter grade */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 900,
            color: stackScore.color,
            lineHeight: 1,
            filter: `drop-shadow(0 0 12px ${stackScore.color}80)`,
          }}>
            {stackScore.grade}
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            Score
          </span>
        </div>
      </div>

      {/* Right side — label + stats */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {/* Badge + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            Stack Score
          </span>
          <span style={{
            padding: '3px 10px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 700,
            background: `${stackScore.color}18`,
            color: stackScore.color,
            border: `1px solid ${stackScore.color}40`,
          }}>
            {stackScore.label}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '20px',
        }}>
          {stackScore.description}
        </p>

        {/* Mini stat pills + Share button */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Numeric score</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '14px',
              color: stackScore.color,
            }}>
              <span ref={scoreNumRef}>0</span>/100
            </span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Waste</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '14px',
              color: stackScore.wastePercentage > 20 ? '#f87171' : 'var(--accent)',
            }}>
              {stackScore.wastePercentage.toFixed(0)}%
            </span>
          </div>

          {stackScore.highOverlaps > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px',
              background: 'rgba(239,68,68,0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Overlaps</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '14px',
                color: '#f87171',
              }}>
                {stackScore.highOverlaps} high
              </span>
            </div>
          )}

          {/* Share Grade button */}
          <button
            onClick={handleShareGrade}
            title="Copy shareable grade to clipboard"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px',
              background: copied ? `${stackScore.color}20` : 'transparent',
              border: `1px solid ${copied ? stackScore.color : 'var(--border-default)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              color: copied ? stackScore.color : 'var(--text-secondary)',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              marginLeft: 'auto',
            }}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share Grade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
