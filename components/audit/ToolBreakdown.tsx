'use client';
import { ToolAuditResult } from '@/types';

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
          className="glass-card anim-fade-up"
          style={{ 
            padding: '24px 28px', 
            animationDelay: `${index * 0.08}s` 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '8px',
              }}>
                <img src={TOOL_LOGOS[result.tool]} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700, fontSize: '15px',
                  color: 'var(--text-primary)',
                }}>
                  {TOOL_LABELS[result.tool] ?? result.tool}
                </span>
              </div>
              <div style={{
                fontSize: '13px', color: 'var(--text-secondary)',
                lineHeight: '1.5',
              }}>
                {result.reason}
              </div>
            </div>
            <div className={result.monthlySavings > 0 ? 'savings-positive' : 'savings-neutral'}>
              {result.monthlySavings > 0 ? `Save $${result.monthlySavings}/mo` : 'Optimized'}
            </div>
          </div>
          
          {result.monthlySavings > 0 && result.recommendedPlan && (
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '12px', 
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommendation</span>
              <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>{result.recommendedPlan}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
