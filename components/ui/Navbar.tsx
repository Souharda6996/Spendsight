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
      background: 'rgba(4, 5, 10, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 1000,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <BrandLogo />
      </Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a 
          href="https://credex.rocks" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'color var(--dur-fast)',
          }}
        >
          Credex.rocks
        </a>
        <Link 
          href="/" 
          className="btn-primary" 
          style={{ 
            fontSize: '13px', 
            padding: '8px 18px',
            height: '38px',
            borderRadius: '100px'
          }}
        >
          Audit Now
        </Link>
      </div>
    </nav>
  );
}
