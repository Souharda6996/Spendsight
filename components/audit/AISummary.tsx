'use client';

interface AISummaryProps {
  summary: string;
}

export function AISummary({ summary }: AISummaryProps) {
  return (
    <div className="ai-card anim-fade-up delay-4">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
        <p style={{
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
        }}>AI Analysis</p>
        <span style={{
          fontSize: '11px', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          ✦ AI Generated
        </span>
      </div>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '15px',
        lineHeight: 1.75,
        fontWeight: 300,
      }}>
        {summary}
      </p>
    </div>
  );
}
