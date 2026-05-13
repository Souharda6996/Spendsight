import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase';
import { AuditResult } from '@/types';
import { AuditHero } from '@/components/audit/AuditHero';
import ToolBreakdown from '@/components/audit/ToolBreakdown';
import OverlapDetector from '@/components/audit/OverlapDetector';
import StackScoreBadge from '@/components/audit/StackScoreBadge';
import { AISummary } from '@/components/audit/AISummary';
import CredexCTA from '@/components/audit/CredexCTA';
import ShareButton from '@/components/audit/ShareButton';
import LeadCaptureModal from '@/components/lead/LeadCaptureModal';
import Link from 'next/link';
import { calculateStackScore } from '@/lib/stack-score';

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
      overlapResults: data.overlap_results ?? [],
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
  const stackScore = calculateStackScore(
    audit.toolResults,
    audit.overlapResults ?? [],
  );

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Mesh gradient orbs */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,152,212,0.10) 0%, transparent 70%)',
          filter: 'blur(100px)',
          borderRadius: '50%',
        }} />
      </div>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
        {/* Nav */}
        <nav style={{ marginBottom: '40px' }}>
          <Link
            href="/"
            style={{ 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--accent)',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            ← New Audit
          </Link>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* 1. Hero */}
          <AuditHero
            totalMonthlySavings={audit.totalMonthlySavings}
            totalAnnualSavings={audit.totalAnnualSavings}
            totalCurrentSpend={stackScore.totalCurrentSpend}
          />

          {/* 2. Stack Score */}
          <StackScoreBadge stackScore={stackScore} />

          {/* 2. Main content grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="badge-accent" style={{ alignSelf: 'flex-start' }}>Tool Breakdown</div>
              <ToolBreakdown toolResults={audit.toolResults} />

              {audit.overlapResults && audit.overlapResults.length > 0 && (
                <>
                  <div className="badge-accent" style={{ alignSelf: 'flex-start', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                    ⚠ Overlap Detected
                  </div>
                  <OverlapDetector overlaps={audit.overlapResults} />
                </>
              )}
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="badge-accent" style={{ alignSelf: 'flex-start' }}>Analysis & Actions</div>
              <AISummary summary={audit.aiSummary ?? ''} />
              
              {showCredexCTA && <CredexCTA />}
              
              <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 700, 
                  fontSize: '18px', 
                  color: 'var(--text-primary)', 
                  marginBottom: '16px' 
                }}>
                  Keep a copy of your audit
                </h3>
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
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AUDIT_ID: {audit.id} &nbsp;·&nbsp; GENERATED: {new Date(audit.createdAt).toISOString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
