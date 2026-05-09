'use client';
import { ToolAuditResult } from '@/types';

const TOOL_LABELS: Record<string, string> = {
  'cursor':         'Cursor',
  'github-copilot': 'GitHub Copilot',
  'claude':         'Claude',
  'chatgpt':        'ChatGPT',
  'anthropic-api':  'Anthropic API',
  'openai-api':     'OpenAI API',
  'gemini':         'Gemini',
  'windsurf':       'Windsurf',
};

interface ToolBreakdownProps {
  toolResults: ToolAuditResult[];
}

export default function ToolBreakdown({ toolResults }: ToolBreakdownProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toolResults.map((result, index) => (
        <div 
          key={result.tool}
          className={`tool-card ${result.monthlySavings > 0 ? 'has-savings' : ''} anim-fade-up`}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            {/* Left: tool + current */}
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                {TOOL_LABELS[result.tool] ?? result.tool}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                {result.currentPlan} · <span style={{ color: 'var(--text-secondary)' }}>${result.currentSpend}/mo</span>
              </p>
            </div>

            {/* Right: savings OR optimal */}
            <div style={{ textAlign: 'right' }}>
              {result.monthlySavings > 0 ? (
                <>
                  <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px' }}>
                    Save ${result.monthlySavings}/mo
                  </p>
                  {result.recommendedPlan && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                      → {result.recommendedPlan}
                    </p>
                  )}
                  {result.recommendedTool && !result.recommendedPlan && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                      → {result.recommendedTool}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>✓ Optimal</p>
              )}
            </div>
          </div>

          {/* Badge row */}
          <div style={{ marginBottom: '12px' }}>
            <span className={`badge badge-${result.recommendation}`}>
              {result.recommendation === 'downgrade' ? '↓ Downgrade' :
                result.recommendation === 'switch' ? '⇄ Switch Tool' :
                  result.recommendation === 'credits' ? '◎ Credits Available' :
                    '✓ Optimal'}
            </span>
          </div>

          {/* Reason */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: 1.6,
            fontStyle: 'italic',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
          }}>
            {result.reason}
          </p>
        </div>
      ))}
    </div>
  );
}
