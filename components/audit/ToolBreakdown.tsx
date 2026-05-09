import { ToolAuditResult } from '@/types';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

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
    <section aria-label="Tool-by-tool breakdown">
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '1rem',
        }}
      >
        Tool Breakdown
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {toolResults.map((result) => (
          <article
            key={result.tool}
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-accent)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'none';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.75rem',
              }}
            >
              {/* Left — tool + plan */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                  }}
                >
                  {TOOL_LABELS[result.tool] ?? result.tool}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {result.currentPlan} · {formatCurrency(result.currentSpend)}/mo
                </div>
              </div>

              {/* Center — arrow + badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>→</span>
                <Badge variant={result.recommendation === 'credits' ? 'credits' : result.recommendation} />
              </div>

              {/* Right — savings or optimal */}
              <div style={{ textAlign: 'right' }}>
                {result.monthlySavings > 0 ? (
                  <>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '15px',
                        color: 'var(--accent)',
                      }}
                    >
                      Save {formatCurrency(result.monthlySavings)}/mo
                    </div>
                    {result.recommendedPlan && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        → {result.recommendedPlan}
                      </div>
                    )}
                    {result.recommendedTool && !result.recommendedPlan && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        → {result.recommendedTool}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    ✓ Optimal
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '0.75rem',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              {result.reason}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
