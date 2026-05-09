'use client';
import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ToolRow from '@/components/form/ToolRow';
import Button from '@/components/ui/Button';
import { AITool, UsageIntent } from '@/types';
import { PRICING_DATA } from '@/lib/pricing-data';

// ── Validation Schema ─────────────────────────────────────────────────────────
const schema = z.object({
  teamSize: z.number().int().min(1, 'Min 1').max(10000),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  tools: z.array(
    z.object({
      tool: z.enum(['cursor', 'github-copilot', 'claude', 'chatgpt', 'anthropic-api', 'openai-api', 'gemini', 'windsurf']),
      plan: z.string().min(1, 'Select a plan'),
      monthlySpend: z.number().min(0),
      seats: z.number().int().min(1),
    })
  ).min(1, 'Add at least one tool'),
});

type FormValues = z.infer<typeof schema>;

const USE_CASES: { value: UsageIntent; label: string }[] = [
  { value: 'coding',   label: 'Coding' },
  { value: 'writing',  label: 'Writing' },
  { value: 'data',     label: 'Data' },
  { value: 'research', label: 'Research' },
  { value: 'mixed',    label: 'Mixed' },
];

const AVAILABLE_TOOLS: AITool[] = ['cursor', 'claude', 'chatgpt', 'github-copilot', 'gemini', 'windsurf', 'anthropic-api', 'openai-api'];

const TOOL_LABELS: Record<AITool, string> = {
  'cursor': 'Cursor',
  'github-copilot': 'GitHub Copilot',
  'claude': 'Claude',
  'chatgpt': 'ChatGPT',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  'gemini': 'Gemini',
  'windsurf': 'Windsurf',
};

const STORAGE_KEY = 'spendsight_form';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function SpendForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { teamSize: 1, useCase: 'coding', tools: [] },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'tools',
  });

  // Persist form state to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        methods.reset(parsed);
      }
    } catch {}
  }, [methods]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {}
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const addTool = (tool: AITool) => {
    if (fields.some((f) => (f as { tool: AITool }).tool === tool)) return;
    append({ tool, plan: '', monthlySpend: 0, seats: 1 });
  };

  const goToStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = async () => {
    let valid = false;
    if (step === 0) valid = await methods.trigger(['teamSize', 'useCase']);
    if (step === 1) valid = await methods.trigger(['tools']);
    if (valid) goToStep(step + 1);
  };

  const onSubmit = async (data: FormValues) => {
    setApiError('');
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error ?? 'Something went wrong. Please try again.');
        return;
      }
      const result = await res.json();
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/audit/${result.id}`);
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    }
  };

  const stepLabels = ['Team', 'Tools', 'Review'];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {/* Hidden honeypot */}
        <input
          name="website"
          type="text"
          aria-hidden="true"
          tabIndex={-1}
          style={{ display: 'none' }}
          autoComplete="off"
        />

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all duration-300"
                style={{
                  background: i <= step ? 'var(--accent)' : 'var(--surface)',
                  color: i <= step ? '#080b11' : 'var(--text-muted)',
                  border: i === step ? '2px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && (
                <div
                  className="w-8 h-px ml-1 transition-all duration-300"
                  style={{ background: i < step ? 'var(--accent)' : 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="relative overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <StepOne />
                <div className="flex justify-end mt-6">
                  <Button type="button" onClick={handleNext} size="lg">
                    Next →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <StepTwo
                  fields={fields}
                  addTool={addTool}
                  remove={remove}
                />
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="ghost" onClick={() => goToStep(0)}>
                    ← Back
                  </Button>
                  <Button type="button" onClick={handleNext} size="lg">
                    Review →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <StepThree apiError={apiError} />
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="ghost" onClick={() => goToStep(1)}>
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    loading={methods.formState.isSubmitting}
                  >
                    Run My Audit →
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </FormProvider>
  );
}

// ── Step Components ────────────────────────────────────────────────────────────

function StepOne() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FormValues>();
  const useCase = watch('useCase');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Tell us about your team
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          This helps calibrate the audit to your scale.
        </p>
      </div>

      <div>
        <label htmlFor="teamSize" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          How big is your team?
        </label>
        <input
          {...register('teamSize', { valueAsNumber: true })}
          id="teamSize"
          type="number"
          min="1"
          className="h-10 w-full max-w-xs rounded-xl border border-[var(--border)] bg-transparent text-sm px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63d296] hover:border-[rgba(255,255,255,0.15)] transition-all"
          style={{ color: 'var(--text-primary)' }}
          placeholder="e.g. 8"
        />
        {errors.teamSize && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.teamSize.message}</p>
        )}
      </div>

      <div>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          Primary use case?
        </p>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('useCase', value)}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
              style={{
                background: useCase === value ? 'var(--accent)' : 'var(--surface)',
                color: useCase === value ? '#080b11' : 'var(--text-secondary)',
                border: useCase === value ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepTwo({
  fields,
  addTool,
  remove,
}: {
  fields: Record<string, unknown>[];
  addTool: (t: AITool) => void;
  remove: (i: number) => void;
}) {
  const { watch } = useFormContext<FormValues>();
  const watchedTools = watch('tools');
  const addedToolIds = watchedTools?.map((t) => t.tool) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Which AI tools does your team pay for?
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Add each tool and select your current plan.
        </p>
      </div>

      {/* Add tool chips */}
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TOOLS.map((tool) => {
          const added = addedToolIds.includes(tool);
          return (
            <button
              key={tool}
              type="button"
              onClick={() => !added && addTool(tool)}
              disabled={added}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 disabled:opacity-40"
              style={{
                background: added ? 'var(--surface-hover)' : 'var(--surface)',
                color: added ? 'var(--text-muted)' : 'var(--accent)',
                border: '1px solid var(--border-accent)',
              }}
            >
              {added ? '✓' : '+'} {TOOL_LABELS[tool]}
            </button>
          );
        })}
      </div>

      {/* Tool rows */}
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <ToolRow key={field.id as string} index={index} onRemove={() => remove(index)} />
        ))}
        {fields.length === 0 && (
          <div className="glass-card p-8 text-center" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">No tools added yet. Click a chip above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepThree({ apiError }: { apiError: string }) {
  const { getValues } = useFormContext<FormValues>();
  const data = getValues();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Review your submission
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Confirm your details before running the audit.
        </p>
      </div>

      <div className="glass-card p-4 flex flex-col gap-2">
        <div className="flex gap-4 text-sm">
          <span style={{ color: 'var(--text-muted)' }}>Team size:</span>
          <span style={{ color: 'var(--text-primary)' }}>{data.teamSize} people</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span style={{ color: 'var(--text-muted)' }}>Use case:</span>
          <span style={{ color: 'var(--text-primary)' }} className="capitalize">{data.useCase}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {data.tools.map((tool, i) => (
          <div key={i} className="glass-card p-3 flex justify-between items-center text-sm">
            <span style={{ color: 'var(--text-primary)' }}>
              {TOOL_LABELS[tool.tool as AITool]}
            </span>
            <div className="flex items-center gap-4">
              <span style={{ color: 'var(--text-muted)' }}>
                {tool.seats} seat{tool.seats !== 1 ? 's' : ''}
              </span>
              <span style={{ color: 'var(--accent)' }}>
                ${tool.monthlySpend.toFixed(0)}/mo
              </span>
            </div>
          </div>
        ))}
      </div>

      {apiError && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{ background: 'rgba(245,101,101,0.08)', color: 'var(--danger)', border: '1px solid rgba(245,101,101,0.2)' }}
        >
          {apiError}
        </div>
      )}
    </div>
  );
}
