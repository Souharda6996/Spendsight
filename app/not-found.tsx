import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '12px',
        }}
      >
        Audit not found
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '360px', lineHeight: 1.6, marginBottom: '2rem' }}>
        This audit link may have expired or the ID is incorrect.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          borderRadius: '10px',
          background: 'var(--accent)',
          color: '#080b11',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '14px',
          textDecoration: 'none',
        }}
      >
        ← Run a new audit
      </Link>
    </main>
  );
}
