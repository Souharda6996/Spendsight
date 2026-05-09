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
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid var(--border-default)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '12px',
      transition: 'border-color 0.2s ease',
    }}>
      {/* Tool name header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
        <span style={{fontFamily:'var(--font-display)', fontWeight:600, fontSize:'15px'}}>
          {tool ? TOOL_LABELS[tool] : 'Tool'}
        </span>
        <button onClick={onRemove} type="button" style={{
          background:'transparent', border:'none', color:'var(--text-muted)',
          cursor:'pointer', fontSize:'18px', lineHeight:1, padding:'4px 8px',
          transition:'color 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--danger)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >×</button>
      </div>

      {/* Three inputs in a row */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
        <div>
          <label style={{fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block'}}>Plan</label>
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
              >
                <option value="">Select plan</option>
                {toolData?.plans.map((p) => (
                  <option key={p.planId} value={p.planId} style={{ background: 'var(--bg-surface)' }}>
                    {p.planLabel}{p.pricePerSeatPerMonth !== null ? ` ($${p.pricePerSeatPerMonth})` : ' (Custom)'}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div>
          <label style={{fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block'}}>Seats</label>
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
          <label style={{fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px', display:'block'}}>Monthly ($)</label>
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
