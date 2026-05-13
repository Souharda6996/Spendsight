'use client';
import { useEffect, useRef, useState } from 'react';

interface AISummaryProps {
  summary: string;
}

export function AISummary({ summary }: AISummaryProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [thinking, setThinking] = useState(true);
  const idxRef = useRef(0);

  useEffect(() => {
    // 600ms "thinking" pause before typing starts
    const thinkTimer = setTimeout(() => {
      setThinking(false);
      const interval = setInterval(() => {
        idxRef.current += 1;
        setDisplayed(summary.slice(0, idxRef.current));
        if (idxRef.current >= summary.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 18);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(thinkTimer);
  }, [summary]);

  return (
    <div className="glass-card anim-fade-up" data-delay="2" style={{ padding: '28px', marginTop: '0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
      }}>
        <div className="badge-accent">AI Summary</div>
        {thinking && (
          <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: 'var(--accent)',
                animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                display: 'inline-block',
              }} />
            ))}
          </span>
        )}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        color: 'var(--text-secondary)',
        lineHeight: '1.8',
        margin: 0,
        fontWeight: 400,
        minHeight: '3em',
      }}>
        {displayed}
        {!done && !thinking && (
          <span style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            background: 'var(--accent)',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: 'blink 0.7s step-end infinite',
          }} />
        )}
      </p>
    </div>
  );
}

