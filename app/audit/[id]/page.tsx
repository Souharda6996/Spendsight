import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase';
import { AuditResult } from '@/types';
import AuditHero from '@/components/audit/AuditHero';
import ToolBreakdown from '@/components/audit/ToolBreakdown';
import AISummary from '@/components/audit/AISummary';
import CredexCTA from '@/components/audit/CredexCTA';
import ShareButton from '@/components/audit/ShareButton';
import LeadCaptureModal from '@/components/lead/LeadCaptureModal';
import Link from 'next/link';

interface AuditPageProps {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string): Promise<AuditResult | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      formData: data.form_data,
      toolResults: data.tool_results,
      totalMonthlySavings: data.total_monthly_savings,
      totalAnnualSavings: data.total_annual_savings,
      aiSummary: data.ai_summary,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) {
    return { title: 'Audit not found | SpendSight' };
  }

  const n = audit.toolResults.length;
  const teamSize = audit.formData.teamSize;

  return {
    title: `AI Spend Audit — $${audit.totalMonthlySavings.toFixed(0)}/mo savings`,
    description: `Audited ${n} tool${n !== 1 ? 's' : ''} for a ${teamSize}-person team. ${audit.totalMonthlySavings > 0 ? `Found $${audit.totalMonthlySavings.toFixed(0)}/mo in potential savings.` : 'Stack looks optimized.'}`,
    openGraph: {
      title: `AI Spend Audit — $${audit.totalMonthlySavings.toFixed(0)}/mo savings | SpendSight`,
      description: `Audited ${n} AI tools for a ${teamSize}-person team.`,
      images: [`/audit/${id}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Spend Audit — $${audit.totalMonthlySavings.toFixed(0)}/mo savings`,
      description: `See how much this team could save on AI tools.`,
    },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  const showCredexCTA = audit.totalMonthlySavings > 500;

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
      {/* Nav */}
      <nav style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--accent)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← SpendSight
        </Link>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. Hero */}
        <AuditHero
          totalMonthlySavings={audit.totalMonthlySavings}
          totalAnnualSavings={audit.totalAnnualSavings}
        />

        {/* 2. Tool breakdown */}
        <ToolBreakdown toolResults={audit.toolResults} />

        {/* 3. AI Summary */}
        <AISummary summary={audit.aiSummary ?? ''} />

        {/* 4. Credex CTA — only if savings > $500 */}
        {showCredexCTA && <CredexCTA />}

        {/* 5. Email capture */}
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '16px',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            Keep a copy of your audit
          </p>
          <LeadCaptureModal
            auditId={audit.id}
            totalMonthlySavings={audit.totalMonthlySavings}
          />
        </div>

        {/* 6. Share */}
        <ShareButton />

        {/* Audit metadata */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          Audit ID: <code style={{ fontFamily: 'monospace', opacity: 0.7 }}>{audit.id}</code>
          {' · '}
          {new Date(audit.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </p>
      </div>
    </main>
  );
}
