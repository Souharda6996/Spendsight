'use client';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 clamp(20px, 5vw, 60px)',
      background: 'rgba(5, 7, 9, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      zIndex: 100,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <BrandLogo />
      </Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          transition: 'color 0.2s',
        }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
           onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
          About Credex
        </a>
        <Link href="/" className="btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>
          New Audit
        </Link>
      </div>
    </nav>
  );
}
