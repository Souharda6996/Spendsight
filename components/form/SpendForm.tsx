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
  enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
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
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                height: '4px',
                flex: 1,
                background: step >= s ? 'var(--accent)' : 'var(--border-subtle)',
                borderRadius: '2px',
                transition: 'background 0.4s var(--ease-out)',
              }}
            />
          ))}
        </div>

        <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
          <AnimatePresence custom={direction} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
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
                transition={{ duration: 0.3, ease: 'easeOut' }}
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
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <StepThree apiError={apiError} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          {step > 1 ? (
            <button className="btn-ghost" onClick={handleBack} type="button" style={{ paddingLeft: 0 }}>
              ← Back
            </button>
          ) : <div />}
          
          <button
            className="btn-primary"
            onClick={step === 3 ? undefined : handleNext}
            type={step === 3 ? 'submit' : 'button'}
            disabled={methods.formState.isSubmitting}
            style={{ minWidth: '140px' }}
          >
            {step === 3 
              ? (methods.formState.isSubmitting ? 'Running...' : 'Run Audit →') 
              : 'Next Step →'}
          </button>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <label className="input-label">How many people are on your team?</label>
        <input
          {...register('teamSize', { valueAsNumber: true })}
          type="number"
          className="input-field"
          placeholder="e.g. 12"
          style={{ fontSize: '16px', padding: '14px 18px' }}
        />
        {errors.teamSize && (
          <p style={{ color: 'var(--accent)', fontSize: '11px', marginTop: '6px', fontWeight: 500 }}>{errors.teamSize.message}</p>
        )}
      </div>

      <div>
        <label className="input-label">What is your primary use case?</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginTop: '12px' }}>
          {['Coding', 'Writing', 'Data', 'Research', 'Mixed'].map(uc => {
            const val = uc.toLowerCase() as FormValues['useCase'];
            const isActive = useCase === val;
            return (
              <button
                key={uc}
                type="button"
                onClick={() => setValue('useCase', val)}
                style={{
                  padding: '12px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                {uc}
              </button>
            );
          })}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <label className="input-label" style={{ marginBottom: '16px' }}>Select the tools you use</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {AVAILABLE_TOOLS.map(tool => {
            const isAdded = addedToolIds.includes(tool);
            return (
              <button
                key={tool}
                type="button"
                onClick={() => addTool(tool)}
                disabled={isAdded}
                style={{
                  padding: '8px 14px',
                  borderRadius: '100px',
                  background: isAdded ? 'rgba(0,200,150,0.1)' : 'transparent',
                  border: `1px solid ${isAdded ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  color: isAdded ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: isAdded ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isAdded ? '✓' : '+'} {TOOL_LABELS[tool]}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        {fields.map((field, index) => (
          <ToolRow key={field.id} index={index} onRemove={() => remove(index)} />
        ))}
        {fields.length === 0 && (
          <div style={{ 
            padding: '48px 24px', 
            textAlign: 'center', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)',
            fontSize: '14px'
          }}>
            No tools added. Click a chip above to start.
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Team Configuration</span>
          <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{data.teamSize} seats · {data.useCase}</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {data.tools.length} tool{data.tools.length !== 1 ? 's' : ''} added to stack
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.tools.map((tool, i) => (
          <div key={i} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{TOOL_LABELS[tool.tool as AITool]}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tool.seats} seat{tool.seats !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>
              ${tool.monthlySpend.toFixed(0)}/mo
            </div>
          </div>
        ))}
      </div>

      {apiError && (
        <div style={{ padding: '14px', background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.2)', color: '#feb2b2', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
          {apiError}
        </div>
      )}
    </div>
  );
}
