'use client';
import { useFormContext, Controller } from 'react-hook-form';
import { AITool } from '@/types';
import { PRICING_DATA } from '@/lib/pricing-data';

interface ToolRowProps {
  index: number;
  onRemove: () => void;
}

const TOOL_LABELS: Record<AITool, string> = {
  'cursor':         'Cursor',
  'github-copilot': 'GitHub Copilot',
  'claude':         'Claude',
  'chatgpt':        'ChatGPT',
  'anthropic-api':  'Anthropic API',
  'openai-api':     'OpenAI API',
  'gemini':         'Gemini',
  'windsurf':       'Windsurf',
};

const TOOL_LOGOS: Record<AITool, string> = {
  'cursor': '/logos/cursor.png',
  'github-copilot': '/logos/copilot.png',
  'claude': '/logos/claude.png',
  'chatgpt': '/logos/chatgpt.png',
  'anthropic-api': '/logos/claude.png',
  'openai-api': '/logos/chatgpt.png',
  'gemini': '/logos/gemini.png',
  'windsurf': '/logos/windsurf.png',
};

export default function ToolRow({ index, onRemove }: ToolRowProps) {
  const { register, watch, setValue } = useFormContext();

  const tool = watch(`tools.${index}.tool`) as AITool;
  const seats = watch(`tools.${index}.seats`) as number;
  const toolData = tool ? PRICING_DATA[tool] : null;

  const handlePlanChange = (planId: string) => {
    if (!toolData) return;
    const plan = toolData.plans.find((p) => p.planId === planId);
    if (plan && plan.pricePerSeatPerMonth !== null && seats) {
      setValue(`tools.${index}.monthlySpend`, plan.pricePerSeatPerMonth * (seats || 1));
    }
  };

  const handleSeatsChange = (newSeats: number) => {
    const planId = watch(`tools.${index}.plan`);
    if (!toolData || !planId) return;
    const plan = toolData.plans.find((p) => p.planId === planId);
    if (plan && plan.pricePerSeatPerMonth !== null) {
      setValue(`tools.${index}.monthlySpend`, plan.pricePerSeatPerMonth * newSeats);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {tool && (
            <img src={TOOL_LOGOS[tool]} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
          )}
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
            {tool ? TOOL_LABELS[tool] : 'Tool'}
          </span>
        </div>
        <button onClick={onRemove} type="button" style={{
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: '20px', padding: '0 8px',
        }}>&times;</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '12px' }}>
        <div>
          <label className="input-label">Plan</label>
          <Controller
            name={`tools.${index}.plan`}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handlePlanChange(e.target.value);
                }}
                className="input-field"
                style={{ appearance: 'auto' }}
              >
                <option value="">Select plan</option>
                {toolData?.plans.map((p) => (
                  <option key={p.planId} value={p.planId} style={{ background: 'var(--bg-surface)', color: '#fff' }}>
                    {p.planLabel}{p.pricePerSeatPerMonth !== null ? ` ($${p.pricePerSeatPerMonth})` : ' (Custom)'}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div>
          <label className="input-label">Seats</label>
          <input
            {...register(`tools.${index}.seats`, {
              valueAsNumber: true,
              onChange: (e) => handleSeatsChange(parseInt(e.target.value) || 1),
            })}
            type="number"
            className="input-field"
            placeholder="1"
          />
        </div>
        <div>
          <label className="input-label">Monthly ($)</label>
          <input
            {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
            type="number"
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
