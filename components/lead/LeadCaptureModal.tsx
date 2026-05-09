'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  companyName: z.string().optional(),
  role: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface LeadCaptureModalProps {
  auditId: string;
  totalMonthlySavings: number;
  trigger?: string;
}

export default function LeadCaptureModal({ auditId, totalMonthlySavings, trigger }: LeadCaptureModalProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const isLowSavings = totalMonthlySavings < 100;
  const buttonLabel = isLowSavings
    ? 'Notify me when new savings apply to my stack'
    : trigger ?? 'Get full report via email';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setApiError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, auditId }),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error ?? 'Something went wrong.');
        return;
      }
      setSubmitted(true);
    } catch {
      setApiError('Network error. Please try again.');
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="lg" style={{ width: '100%' }}>
        {buttonLabel}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={submitted ? 'Report on its way! ✓' : 'Get your full report'}
      >
        {submitted ? (
          <div style={{ paddingTop: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              {"We've sent your AI spend audit to your inbox. Check spam if it doesn't arrive within 2 minutes."}
            </p>
            <Button
              onClick={() => setOpen(false)}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ paddingTop: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1.5rem' }}>
              {"We'll email you a copy of your audit. No spam, ever."}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                {...register('email')}
                id="lead-email"
                type="email"
                label="Email *"
                placeholder="you@startup.com"
                error={errors.email?.message}
                autoComplete="email"
              />
              <Input
                {...register('companyName')}
                id="lead-company"
                label="Company name (optional)"
                placeholder="Acme Inc."
                autoComplete="organization"
              />
              <Input
                {...register('role')}
                id="lead-role"
                label="Your role (optional)"
                placeholder="CTO, Engineering Lead…"
                autoComplete="organization-title"
              />
            </div>

            {apiError && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--danger)',
                  marginTop: '0.75rem',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(245,101,101,0.08)',
                  border: '1px solid rgba(245,101,101,0.2)',
                }}
              >
                {apiError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Send my report →
            </Button>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
              By submitting, you agree to occasional product updates. Unsubscribe anytime.
            </p>
          </form>
        )}
      </Modal>
    </>
  );
}
