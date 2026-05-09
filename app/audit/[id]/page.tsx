import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase';
import { AuditResult } from '@/types';
import { AuditHero } from '@/components/audit/AuditHero';
import ToolBreakdown from '@/components/audit/ToolBreakdown';
import { AISummary } from '@/components/audit/AISummary';
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
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
      {/* Nav */}
      <nav style={{ marginBottom: '40px' }}>
        <Link
          href="/"
          className="btn-ghost"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0', color: 'var(--accent)' }}
        >
          ← SpendSight
        </Link>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* 1. Hero */}
        <AuditHero
          totalMonthlySavings={audit.totalMonthlySavings}
          totalAnnualSavings={audit.totalAnnualSavings}
        />

        {/* 2. Main content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display-sm" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>Tool Breakdown</h2>
            <ToolBreakdown toolResults={audit.toolResults} />
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="display-sm" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>Analysis & Actions</h2>
            <AISummary summary={audit.aiSummary ?? ''} />
            {showCredexCTA && <CredexCTA />}
            
            <div className="form-glass" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Keep a copy of your audit
              </p>
              <LeadCaptureModal
                auditId={audit.id}
                totalMonthlySavings={audit.totalMonthlySavings}
              />
            </div>

            <ShareButton />
          </div>
        </div>

        {/* Footer info */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '32px', marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            AUDIT_ID: {audit.id} &nbsp;·&nbsp; GENERATED: {new Date(audit.createdAt).toISOString()}
          </p>
        </div>
      </div>
    </main>
  );
}
