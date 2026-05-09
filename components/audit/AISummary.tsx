interface AISummaryProps {
  summary: string;
  loading?: boolean;
}

export default function AISummary({ summary, loading }: AISummaryProps) {
  return (
    <section className="glass-card" style={{ padding: '1.5rem' }} aria-label="AI analysis">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          AI Analysis
        </p>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            opacity: 0.6,
            padding: '2px 8px',
            border: '1px solid var(--border)',
            borderRadius: '100px',
          }}
        >
          ✦ AI Generated
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[100, 80, 60].map((w, i) => (
            <div
              key={i}
              className="shimmer"
              style={{
                height: '16px',
                borderRadius: '4px',
                width: `${w}%`,
              }}
            />
          ))}
        </div>
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          {summary}
        </p>
      )}
    </section>
  );
}
