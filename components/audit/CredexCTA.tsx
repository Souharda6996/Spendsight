'use client';

export default function CredexCTA() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,200,150,0.08) 0%, rgba(0,152,212,0.08) 100%)',
      border: '1px solid var(--border-accent)',
      borderRadius: 'var(--radius-xl)',
      padding: '40px',
      marginTop: '32px',
      position: 'relative',
      overflow: 'hidden',
    }} className="anim-fade-up" data-delay="3">
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0,
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      
      <div className="badge-accent" style={{ marginBottom: '16px' }}>You qualify for Credex credits</div>
      
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px', fontWeight: 700,
        marginBottom: '12px',
        color: 'var(--text-primary)',
      }}>You qualify for Credex credits</h3>
      
      <p style={{
        fontSize: '15px', color: 'var(--text-secondary)',
        lineHeight: '1.7', marginBottom: '28px', maxWidth: '520px',
      }}>
        Companies at this spend level can source the same AI credits at 15–30% below retail.
        Credex sources unused credits from companies that over-forecasted their AI budgets.
      </p>
      
      <a 
        href="https://credex.rocks" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-primary"
      >
        Book a free consultation →
      </a>
      
      <p style={{
        fontSize: '12px', color: 'var(--text-muted)',
        marginTop: '14px',
      }}>No commitment required. Credex sources unused credits from companies that over-forecasted.</p>
    </div>
  );
}
