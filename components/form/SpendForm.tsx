'use client';
import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import ToolRow from '@/components/form/ToolRow';
import { AITool } from '@/types';

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
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function SpendForm() {
  const [step, setStep] = useState(1);
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
    } catch { }
  }, [methods]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch { }
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
    if (step === 1) valid = await methods.trigger(['teamSize', 'useCase']);
    if (step === 2) valid = await methods.trigger(['tools']);
    if (valid) goToStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) goToStep(step - 1);
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

  return (
    <FormProvider {...methods}>
      <div className="form-glass" style={{ padding: '40px 44px', maxWidth: '680px', width: '100%', margin: '0 auto' }}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          {/* Step indicator */}
          <div className="step-indicator">
            {['Team', 'Tools', 'Review'].map((label, idx) => {
              const stepNum = idx + 1;
              const isDone = step > stepNum;
              const isActive = step === stepNum;
              return (
                <React.Fragment key={label}>
                  {idx > 0 && <div className={`step-line ${step > idx ? 'done' : ''}`} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div className={`step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? '✓' : stepNum}
                    </div>
                    <span style={{ fontSize: '11px', color: isActive ? 'var(--accent)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>
                      {label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
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
                  <StepOne />
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
                  <StepTwo fields={fields} addTool={addTool} remove={remove} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <StepThree apiError={apiError} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
            {step > 1 && (
              <button className="btn-ghost" onClick={handleBack} type="button">← Back</button>
            )}
            <button
              className="btn-primary"
              style={{ marginLeft: 'auto' }}
              onClick={step === 3 ? undefined : handleNext}
              type={step === 3 ? 'submit' : 'button'}
              disabled={methods.formState.isSubmitting}
            >
              {step === 3 ? (methods.formState.isSubmitting ? 'Running...' : 'Run My Audit →') : 'Next →'}
            </button>
          </div>
        </form>
      </div>
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
        <h2 className="display-md" style={{ marginBottom: '6px' }}>Tell us about your team</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
          This calibrates the audit to your scale.
        </p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
          How big is your team?
        </label>
        <input
          {...register('teamSize', { valueAsNumber: true })}
          type="number"
          className="input-field"
          placeholder="e.g. 10"
        />
        {errors.teamSize && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.teamSize.message}</p>
        )}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
          Primary use case?
        </label>
        <div className="segment-group" style={{ marginTop: '8px' }}>
          {['Coding', 'Writing', 'Data', 'Research', 'Mixed'].map(uc => (
            <button
              key={uc}
              className={`segment-pill ${useCase === uc.toLowerCase() ? 'active' : ''}`}
              onClick={() => setValue('useCase', uc.toLowerCase() as FormValues['useCase'])}
              type="button"
            >
              {uc}
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
  fields: Array<{ id: string } & FormValues['tools'][number]>;
  addTool: (t: AITool) => void;
  remove: (i: number) => void;
}) {
  const { watch } = useFormContext<FormValues>();
  const watchedTools = watch('tools');
  const addedToolIds = watchedTools?.map((t) => t.tool) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="display-md" style={{ marginBottom: '6px' }}>Which tools do you use?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
          Add each tool and select your current plan.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {AVAILABLE_TOOLS.map(tool => (
          <button
            key={tool}
            className={`tool-chip ${addedToolIds.includes(tool) ? 'added' : ''}`}
            onClick={() => addTool(tool)}
            type="button"
            disabled={addedToolIds.includes(tool)}
          >
            {addedToolIds.includes(tool) ? '✓' : '+'} {TOOL_LABELS[tool]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <ToolRow key={field.id} index={index} onRemove={() => remove(index)} />
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
        <h2 className="display-md" style={{ marginBottom: '6px' }}>Review Audit</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
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
