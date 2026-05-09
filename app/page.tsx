'use client';
import SpendForm from '@/components/form/SpendForm';

export default function HomePage() {
  const scrollToForm = () => {
    document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Animated background */}
        <div className="hero-bg" aria-hidden="true" />

        {/* Floating particles — pure CSS, 8 particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDuration: `${4 + i * 1.3}s`,
              animationDelay: `${i * 0.5}s`,
              width: i % 3 === 0 ? '4px' : '2px',
              height: i % 3 === 0 ? '4px' : '2px',
              opacity: 0.3,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Content — centered, staggered animation */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Social proof pill */}
          <div className="social-proof-pill anim-fade-up delay-1 mb-10">
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>143</span>
            <span>startups audited this week</span>
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span>avg <strong style={{ color: 'var(--accent)' }}>$340/mo</strong> identified</span>
          </div>

          {/* Main headline */}
          <h1 className="display-xl anim-fade-up delay-2" style={{ marginBottom: '8px' }}>
            Stop overpaying
          </h1>
          <h1 className="display-xl anim-fade-up delay-3" style={{
            color: 'var(--accent)',
            marginBottom: '28px',
            textShadow: '0 0 80px rgba(99,210,150,0.3)',
          }}>
            for AI tools.
          </h1>

          {/* Subheadline */}
          <p className="anim-fade-up delay-4" style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            marginBottom: '44px',
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            Free 60-second audit. See exactly where your team is leaving money on the table.
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToForm}
            className="btn-primary btn-primary-pulse anim-fade-up delay-5"
            style={{ fontSize: '18px', padding: '16px 36px', borderRadius: '14px' }}
          >
            Audit My Stack
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Feature tags */}
          <div className="anim-fade-up delay-6" style={{
            display: 'flex', gap: '28px', marginTop: '36px', flexWrap: 'wrap', justifyContent: 'center'
          }}>
            <span className="feature-tag">🔓 No account required</span>
            <span className="feature-tag">⚡ Results in seconds</span>
            <span className="feature-tag">🔗 Shareable report</span>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(to bottom, transparent, var(--bg-base))',
          pointerEvents: 'none',
        }} />
      </section>

      {/* Form Section */}
      <section
        id="audit-form"
        aria-labelledby="form-headline"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem 6rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2
            id="form-headline"
            className="display-md"
            style={{
              marginBottom: '0.5rem',
            }}
          >
            Audit your AI stack
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Takes 60 seconds. No signup required.
          </p>
        </div>

        <SpendForm />
      </section>
    </main>
  );
}
