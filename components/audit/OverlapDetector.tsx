'use client';
import { OverlapResult } from '@/types';

interface OverlapDetectorProps {
  overlaps: OverlapResult[];
}

const TOOL_LOGOS: Record<string, string> = {
  'cursor':         '/logos/cursor.png',
  'github-copilot': '/logos/copilot.png',
  'claude':         '/logos/claude.png',
  'chatgpt':        '/logos/chatgpt.png',
  'anthropic-api':  '/logos/claude.png',
  'openai-api':     '/logos/chatgpt.png',
  'gemini':         '/logos/gemini.png',
  'windsurf':       '/logos/windsurf.png',
};

function SeverityBadge({ severity }: { severity: 'high' | 'medium' }) {
  const isHigh = severity === 'high';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '100px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      background: isHigh
        ? 'rgba(239, 68, 68, 0.12)'
        : 'rgba(245, 158, 11, 0.12)',
      color: isHigh ? '#f87171' : '#fbbf24',
      border: `1px solid ${isHigh ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
    }}>
      <span style={{ fontSize: '9px' }}>{isHigh ? '●' : '◐'}</span>
      {isHigh ? 'High Overlap' : 'Partial Overlap'}
    </span>
  );
}

function OverlapCard({ overlap, index }: { overlap: OverlapResult; index: number }) {
  const isHigh = overlap.severity === 'high';

  return (
    <div
      className="glass-card anim-fade-up"
      style={{
        padding: '28px',
        animationDelay: `${index * 0.1}s`,
        borderLeft: `3px solid ${isHigh ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div aria-hidden style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        background: isHigh
          ? 'radial-gradient(ellipse at top left, rgba(239,68,68,0.04) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at top left, rgba(245,158,11,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Header row: tools + severity */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        {/* Tool pair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img
              src={TOOL_LOGOS[overlap.toolA]}
              alt={overlap.toolALabel}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--text-primary)',
            }}>
              {overlap.toolALabel}
            </span>
          </div>

          {/* VS divider */}
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: isHigh ? '#f87171' : '#fbbf24',
            padding: '2px 8px',
            background: isHigh ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
            borderRadius: '4px',
            letterSpacing: '0.05em',
          }}>
            vs
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img
              src={TOOL_LOGOS[overlap.toolB]}
              alt={overlap.toolBLabel}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--text-primary)',
            }}>
              {overlap.toolBLabel}
            </span>
          </div>
        </div>

        <SeverityBadge severity={overlap.severity} />
      </div>

      {/* Capability tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '6px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '14px',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Duplicated capability:
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {overlap.capability}
        </span>
      </div>

      {/* Recommendation body */}
      <p style={{
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: '1.65',
        marginBottom: '16px',
      }}>
        {overlap.recommendation}
      </p>

      {/* Action footer */}
      <div style={{
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Keep
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img
              src={TOOL_LOGOS[overlap.keepTool]}
              alt={overlap.keepToolLabel}
              style={{ width: '14px', height: '14px', objectFit: 'contain' }}
            />
            <span style={{
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
            }}>
              {overlap.keepToolLabel}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Combined spend</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: isHigh ? '#f87171' : '#fbbf24',
          }}>
            ${overlap.combinedSpend}/mo
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OverlapDetector({ overlaps }: OverlapDetectorProps) {
  if (!overlaps || overlaps.length === 0) return null;

  const highCount = overlaps.filter((o) => o.severity === 'high').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Section header */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '12px',
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'rgba(239,68,68,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '18px',
        }}>
          🔍
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}>
            {overlaps.length} Capability Overlap{overlaps.length !== 1 ? 's' : ''} Detected
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {highCount > 0
              ? `You're paying for ${highCount} pair${highCount !== 1 ? 's' : ''} of tools that do the same thing. This is duplicate spend — not redundancy.`
              : `You have tools with partial capability overlaps. Review whether each serves a distinct workflow.`}
          </div>
        </div>
      </div>

      {/* Overlap cards */}
      {overlaps.map((overlap, i) => (
        <OverlapCard
          key={`${overlap.toolA}-${overlap.toolB}`}
          overlap={overlap}
          index={i}
        />
      ))}
    </div>
  );
}
