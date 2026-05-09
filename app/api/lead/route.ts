import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase';
import { sendAuditEmail } from '@/lib/resend';
import { leadRateLimit, getClientIp } from '@/lib/rate-limit';

const LeadSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = await leadRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { auditId, email, companyName, role } = parsed.data;
    const supabase = createServerSupabaseClient();

    // Fetch audit for email context
    const { data: audit } = await supabase
      .from('audits')
      .select('total_monthly_savings, tool_results')
      .eq('id', auditId)
      .single();

    // Insert lead
    const { error } = await supabase.from('leads').insert({
      audit_id: auditId,
      email,
      company_name: companyName,
      role,
    });

    if (error) {
      console.error('Lead insert error:', error);
      return NextResponse.json({ error: 'Failed to capture lead.' }, { status: 500 });
    }

    // Send email (best-effort — don't fail if email fails)
    if (audit) {
      try {
        const toolResults = audit.tool_results as Array<{ reason: string; monthlySavings: number }>;
        const topRecs = [...toolResults]
          .sort((a, b) => b.monthlySavings - a.monthlySavings)
          .slice(0, 2)
          .map((r) => r.reason);

        await sendAuditEmail({
          to: email,
          totalMonthlySavings: audit.total_monthly_savings,
          topRecommendations: topRecs,
          auditId,
        });
      } catch (emailErr) {
        console.error('Email send error (non-fatal):', emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Lead route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
