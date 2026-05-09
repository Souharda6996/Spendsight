export default function CredexCTA() {
  return (
    <section
      className="glass-card accent-glow-pulse"
      style={{
        padding: '1.75rem',
        borderColor: 'var(--border-accent)',
        background: 'rgba(99,210,150,0.04)',
      }}
      aria-label="Credex credits offer"
    >
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--accent-glow)',
            border: '1px solid var(--border-accent)',
            borderRadius: '100px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          ⚡ High-Savings Alert
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          You qualify for Credex credits
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Companies at this spend level can source the same AI credits at 15–30% below retail. 
          Credex sources unused credits from companies that over-forecasted their AI budgets.
        </p>
      </div>

      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '10px',
          background: 'var(--accent)',
          color: '#080b11',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '14px',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          marginBottom: '12px',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#7dddaa';
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)';
          (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
        }}
      >
        Book a free consultation →
      </a>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Credex sources unused credits from companies that over-forecasted. No commitment required.
      </p>
    </section>
  );
}
