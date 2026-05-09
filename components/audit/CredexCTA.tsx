'use client';
import { useRef } from 'react';
import { useTilt } from '@/lib/useTilt';

export default function CredexCTA() {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef);

  return (
    <div ref={cardRef} className="credex-card anim-fade-up delay-5">
      <div style={{marginBottom: '8px'}}>
        <span className="badge badge-credits" style={{fontSize:'12px', marginBottom:'16px', display:'inline-flex'}}>
          ◎ Credex Partner Offer
        </span>
      </div>
      <h3 style={{fontFamily:'var(--font-display)', fontWeight:700, fontSize:'clamp(20px,3vw,26px)', marginBottom:'12px'}}>
        You qualify for Credex credits
      </h3>
      <p style={{color:'var(--text-secondary)', fontSize:'15px', lineHeight:1.7, marginBottom:'28px', fontWeight:300}}>
        Companies at your spend level can source the same AI credits at 15–30% below retail.
        Credex sources unused credits from companies that over-forecasted.
      </p>
      <a
        href="https://credex.rocks"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{textDecoration:'none', display:'inline-flex'}}
      >
        Book a free consultation
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <p style={{marginTop:'12px', fontSize:'12px', color:'var(--text-muted)'}}>
        No commitment. 20-min call with the Credex team.
      </p>
    </div>
  );
}
