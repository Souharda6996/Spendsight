'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import BrandLogo from '@/components/ui/BrandLogo';

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
    ? 'Notify me when new savings apply'
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
      <button 
        type="button"
        onClick={() => setOpen(true)} 
        className="btn-primary" 
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {buttonLabel}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={submitted ? 'Report on its way!' : 'Get your full report'}
      >
        <div style={{ padding: '8px 4px' }}>
          {!submitted && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <BrandLogo showText={false} />
            </div>
          )}
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--accent)' }}>✓</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                We&apos;ve sent your AI spend audit to your inbox. Check spam if it doesn&apos;t arrive within 2 minutes.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost"
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
                We&apos;ll email you a PDF copy of your audit and notification of future credits. No spam, ever.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>EMAIL ADDRESS *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field"
                    placeholder="you@startup.com"
                    autoComplete="email"
                  />
                  {errors.email && <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '4px' }}>{errors.email.message}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>COMPANY NAME</label>
                  <input
                    {...register('companyName')}
                    className="input-field"
                    placeholder="Acme Inc."
                    autoComplete="organization"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>YOUR ROLE</label>
                  <input
                    {...register('role')}
                    className="input-field"
                    placeholder="CTO, Engineering Lead..."
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              {apiError && (
                <div style={{ marginTop: '16px', padding: '10px', borderRadius: '8px', background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.2)', color: 'var(--danger)', fontSize: '13px' }}>
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '32px', justifyContent: 'center' }}
              >
                {isSubmitting ? 'Sending...' : 'Send my report →'}
              </button>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
                By submitting, you agree to occasional product updates.
              </p>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
