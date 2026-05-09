'use client';
import React from 'react';

export default function BrandLogo({ className = '', showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Credex-style geometric logo */}
      <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="var(--bg-elevated)" />
        <path d="M30 70L50 30L70 70H30Z" fill="var(--accent)" fillOpacity="0.2" />
        <path d="M40 70L55 40L70 70H40Z" fill="var(--accent)" />
        <path d="M30 70L45 40L50 50L40 70Z" fill="var(--accent-blue)" />
      </svg>
      
      {showText && (
        <span style={{ 
          fontSize: '19px', 
          fontWeight: 800, 
          letterSpacing: '-0.04em', 
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display), sans-serif',
          display: 'flex',
          alignItems: 'center'
        }}>
          spendsight
          <span style={{ color: 'var(--accent)', marginLeft: '1px' }}>.</span>
        </span>
      )}
    </div>
  );
}
