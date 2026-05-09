'use client';
import React from 'react';

export default function BrandLogo({ className = '', showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Credex Icon */}
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#006837" />
        <path d="M72 35C72 35 65 65 35 72C35 72 45 45 72 35Z" fill="white" />
        <path d="M65 30C65 30 58 55 32 62C32 62 40 40 65 30Z" fill="#006837" />
      </svg>
      
      {showText && (
        <span style={{ 
          fontSize: '20px', 
          fontWeight: 700, 
          letterSpacing: '-0.02em', 
          color: '#ffffff',
          fontFamily: 'var(--font-display), sans-serif'
        }}>
          credex
        </span>
      )}
    </div>
  );
}
