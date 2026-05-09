'use client';
import SpendForm from '@/components/form/SpendForm';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section
        aria-labelledby="hero-headline"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem 2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow blob */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(99,210,150,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '300px',
            height: '200px',
            background: 'radial-gradient(ellipse, rgba(99,170,255,0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '720px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Social proof */}
          <div
            className="fade-up"
            style={{
              animationDelay: '0ms',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>143</span>
            <span>startups audited this week</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>avg <span style={{ color: 'var(--accent)', fontWeight: 600 }}>$340/mo</span> identified</span>
          </div>

          <h1
            id="hero-headline"
            className="fade-up savings-glow"
            style={{
              animationDelay: '80ms',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 7vw, 72px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Stop overpaying<br />
            <span style={{ color: 'var(--accent)' }}>for AI tools.</span>
          </h1>

          <p
            className="fade-up"
            style={{
              animationDelay: '160ms',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Free 60-second audit. See exactly where your team is
            leaving money on the table.
          </p>

          <div className="fade-up" style={{ animationDelay: '240ms' }}>
            <a
              href="#audit-form"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '12px',
                background: 'var(--accent)',
                color: '#080b11',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 24px rgba(99,210,150,0.25)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#7dddaa';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 40px rgba(99,210,150,0.4)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 24px rgba(99,210,150,0.25)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
              }}
            >
              Audit My Stack →
            </a>
          </div>

          {/* Trust indicators */}
          <div
            className="fade-up"
            style={{
              animationDelay: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'No account required', icon: '🔓' },
              { label: 'Results in seconds', icon: '⚡' },
              { label: 'Shareable report', icon: '🔗' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section
        id="audit-form"
        aria-labelledby="form-headline"
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '2rem 1.5rem 6rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2
            id="form-headline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Audit your AI stack
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Takes 60 seconds. No signup required.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <SpendForm />
        </div>
      </section>
    </main>
  );
}
