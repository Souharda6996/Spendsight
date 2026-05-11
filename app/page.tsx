'use client';
import { useEffect, useRef, useState } from 'react';
import SpendForm from '@/components/form/SpendForm';

export default function HomePage() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (spotlightRef.current) {
      spotlightRef.current.style.transform =
        `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`;
    }
  }, [mousePos]);

  const scrollToForm = () => {
    document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Mouse-follow spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'transform 0.12s ease-out',
          willChange: 'transform',
          top: 0,
          left: 0,
        }}
      />

      {/* Mesh gradient orbs */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0,200,150,0.13) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          animation: 'orbDrift 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,152,212,0.11) 0%, transparent 70%)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          animation: 'orbDriftAlt 22s ease-in-out infinite',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* HERO SECTION */}
        <section className="hero-grid" style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '80px 24px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}>
          {/* Left: Text */}
          <div>
            <div className="badge-accent anim-fade-up" data-delay="1" style={{ marginBottom: '24px' }}>
              ⚡ Free AI Spend Audit
            </div>

            <h1 className="anim-fade-up" data-delay="2" style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              letterSpacing: '-0.03em',
              lineHeight: '1.08',
              marginBottom: '20px',
            }}>
              Stop overpaying<br />
              <span style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-blue) 50%, var(--accent) 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 4s linear infinite',
              }}>for AI tools.</span>
            </h1>

            <p className="anim-fade-up" data-delay="3" style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              maxWidth: '460px',
              marginBottom: '36px',
            }}>
              Free 60-second audit. See exactly where your team is leaving money on the table.
            </p>

            <button
              onClick={scrollToForm}
              className="btn-primary anim-fade-up"
              data-delay="4"
              style={{ padding: '16px 32px', fontSize: '16px' }}
            >
              Audit My Stack
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="anim-fade-up" data-delay="5" style={{
              display: 'flex', gap: '24px', marginTop: '36px', flexWrap: 'wrap',
            }}>
              {['🔓 No account required', '⚡ Results in seconds', '🔗 Shareable report'].map(item => (
                <span key={item} style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Right: Floating tool card illustration */}
          <div className="hero-illustration" aria-hidden="true" style={{
            position: 'relative', height: '400px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {[
              { name: 'Cursor',  icon: '/logos/cursor.png',  color: '#8B5CF6', delay: '0s',   top: '8%',  left: '20%',  dur: '6s' },
              { name: 'Claude',  icon: '/logos/claude.png',  color: '#E05A2B', delay: '1.2s', top: '5%',  right: '10%', dur: '7s' },
              { name: 'ChatGPT', icon: '/logos/chatgpt.png', color: '#10A37F', delay: '0.6s', top: '45%', left: '5%',   dur: '5.5s' },
              { name: 'Copilot', icon: '/logos/copilot.png', color: '#0078D4', delay: '1.8s', top: '55%', right: '5%',  dur: '6.5s' },
              { name: 'Gemini',  icon: '/logos/gemini.png',  color: '#4285F4', delay: '0.9s', bottom: '10%', left: '30%', dur: '7.5s' },
            ].map((tool) => (
              <div key={tool.name} style={{
                position: 'absolute',
                top: tool.top,
                left: tool.left,
                right: tool.right,
                bottom: tool.bottom,
                animation: `${parseInt(tool.delay) % 2 === 0 ? 'float' : 'floatAlt'} ${tool.dur} ease-in-out ${tool.delay} infinite`,
                willChange: 'transform',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${tool.color}30`,
                  borderRadius: '14px',
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 16px ${tool.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  whiteSpace: 'nowrap',
                  transition: 'box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Shimmer sweep */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    animation: `shimmer 3s ease-in-out ${tool.delay} infinite`,
                    pointerEvents: 'none',
                  }} />
                  <img
                    src={tool.icon}
                    alt=""
                    style={{
                      width: '18px', height: '18px',
                      objectFit: 'contain',
                      filter: tool.name === 'ChatGPT' ? 'brightness(1.2)' : 'none',
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}>{tool.name}</span>
                  {/* Coloured dot */}
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: tool.color,
                    boxShadow: `0 0 6px ${tool.color}`,
                    flexShrink: 0,
                    animation: 'pulseDot 2s ease-in-out infinite',
                  }} />
                </div>
              </div>
            ))}

            <div style={{
              width: '200px', height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,200,150,0.10) 0%, transparent 70%)',
              border: '1px solid rgba(0,200,150,0.15)',
              animation: 'pulseGlow 4s ease-in-out infinite',
            }} />
          </div>
        </section>

        {/* Social Proof Marquee Strip */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255,255,255,0.02)',
          overflow: 'hidden',
          padding: '14px 0',
          marginBottom: '80px',
        }}>
          <div style={{
            display: 'flex', gap: '60px',
            animation: 'marquee 28s linear infinite',
            width: 'max-content',
          }}>
            {[...Array(2)].map((_, i) =>
              ['143 startups audited this week', 'avg $340/mo identified', '4.8★ user rating', 'Free. No account.', 'Results in 60 seconds', 'Shareable audit link'].map(item => (
                <span key={`${i}-${item}`} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ color: 'var(--accent)', marginRight: '12px' }}>·</span>
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Form Section */}
        <section id="audit-form" style={{
          maxWidth: '800px', margin: '0 auto',
          padding: '0 24px 80px',
        }}>
          <div className="glass-card" style={{ padding: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: '8px',
              color: 'var(--text-primary)',
            }}>Audit your AI stack</h2>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
            }}>Add the tools your team pays for. We&apos;ll show you where the waste is.</p>
            
            <div className="divider" style={{ margin: '0 0 32px' }} />
            
            <SpendForm />
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{
          maxWidth: '700px', margin: '0 auto',
          padding: '0 24px 96px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px', fontWeight: 700,
            marginBottom: '32px',
            textAlign: 'center',
          }}>Common questions</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: "How accurate is the audit?",
                a: "Our engine uses live pricing data from 50+ AI vendors and calculates based on common team seat tiers. It identifies obvious overspend like paid seats for free-tier usage."
              },
              {
                q: "Is my data shared?",
                a: "Never. We don't even ask for your email until you want to download the PDF report. The audit happens entirely in your browser."
              },
              {
                q: "What is Credex?",
                a: "Credex is our partner that helps startups source unused AI credits at a discount. If your audit identifies significant waste, we connect you to help reclaim it."
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px 28px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px', fontWeight: 700,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}>Q: {faq.q}</h3>
                <p style={{
                  fontSize: '14px', lineHeight: '1.7',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}>A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
