'use client';

interface AISummaryProps {
  summary: string;
}

export function AISummary({ summary }: AISummaryProps) {
  return (
    <div className="glass-card anim-fade-up" data-delay="2" style={{ padding: '28px', marginTop: '0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
      }}>
        <div className="badge-accent">AI Summary</div>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        color: 'var(--text-secondary)',
        lineHeight: '1.8',
        margin: 0,
        fontWeight: 400
      }}>
        {summary}
      </p>
    </div>
  );
}
