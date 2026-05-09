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
  const { register, watch, setValue, formState: { errors } } = useFormContext();

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
    <div
      className="glass-card p-4 flex flex-col gap-3 hover:border-[rgba(255,255,255,0.15)] transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          {tool ? TOOL_LABELS[tool] : 'Tool'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors text-lg leading-none w-6 h-6 flex items-center justify-center rounded"
          aria-label={`Remove ${tool ? TOOL_LABELS[tool] : 'tool'}`}
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Plan selector */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`tool-plan-${index}`}
            className="text-xs font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Plan
          </label>
          <Controller
            name={`tools.${index}.plan`}
            render={({ field }) => (
              <select
                {...field}
                id={`tool-plan-${index}`}
                onChange={(e) => {
                  field.onChange(e);
                  handlePlanChange(e.target.value);
                }}
                className="h-10 rounded-xl border border-[var(--border)] bg-transparent text-sm px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63d296] hover:border-[rgba(255,255,255,0.15)] transition-all"
                style={{ color: 'var(--text-primary)', background: 'var(--surface)' }}
              >
                <option value="" style={{ background: '#0d1117' }}>Select plan</option>
                {toolData?.plans.map((p) => (
                  <option key={p.planId} value={p.planId} style={{ background: '#0d1117' }}>
                    {p.planLabel}{p.pricePerSeatPerMonth !== null ? ` — $${p.pricePerSeatPerMonth}/seat` : ' — Custom'}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Seats */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`tool-seats-${index}`}
            className="text-xs font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Seats
          </label>
          <input
            {...register(`tools.${index}.seats`, {
              valueAsNumber: true,
              onChange: (e) => handleSeatsChange(parseInt(e.target.value) || 1),
            })}
            id={`tool-seats-${index}`}
            type="number"
            min="1"
            className="h-10 rounded-xl border border-[var(--border)] bg-transparent text-sm px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63d296] hover:border-[rgba(255,255,255,0.15)] transition-all"
            style={{ color: 'var(--text-primary)' }}
            placeholder="1"
          />
        </div>

        {/* Monthly Spend */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`tool-spend-${index}`}
            className="text-xs font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Monthly Spend ($)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm select-none" style={{ color: 'var(--text-muted)' }}>$</span>
            <input
              {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
              id={`tool-spend-${index}`}
              type="number"
              min="0"
              step="0.01"
              className="h-10 w-full rounded-xl border border-[var(--border)] bg-transparent text-sm pl-6 pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63d296] hover:border-[rgba(255,255,255,0.15)] transition-all"
              style={{ color: 'var(--text-primary)' }}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
