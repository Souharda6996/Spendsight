import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { runAuditEngine, calculateTotals, detectOverlaps } from '@/lib/audit-engine';
import { createServerSupabaseClient } from '@/lib/supabase';
import { auditRateLimit, getClientIp } from '@/lib/rate-limit';
import { generateAuditSummary } from '@/lib/anthropic';
import { FormData } from '@/types';

const ToolInputSchema = z.object({
  tool: z.enum(['cursor', 'github-copilot', 'claude', 'chatgpt', 'anthropic-api', 'openai-api', 'gemini', 'windsurf']),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0),
  seats: z.number().int().min(1),
});

const FormDataSchema = z.object({
  tools: z.array(ToolInputSchema).min(1).max(8),
  teamSize: z.number().int().min(1).max(10000),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  // honeypot — must be absent or empty
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = await auditRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();

    // HONEYPOT — bot trap
    if (body.website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = FormDataSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const formData: FormData = {
      tools: parsed.data.tools,
      teamSize: parsed.data.teamSize,
      useCase: parsed.data.useCase,
    };

    const toolResults = runAuditEngine(formData);
    const { totalMonthlySavings, totalAnnualSavings } = calculateTotals(toolResults);
    const overlapResults = detectOverlaps(formData.tools);

    // AI summary with graceful fallback
    const aiSummary = await generateAuditSummary(formData, toolResults, totalMonthlySavings);

    const id = nanoid(10);
    const createdAt = new Date().toISOString();

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from('audits').insert({
      id,
      form_data: formData,
      tool_results: toolResults,
      total_monthly_savings: totalMonthlySavings,
      total_annual_savings: totalAnnualSavings,
      ai_summary: aiSummary,
      overlap_results: overlapResults,
      created_at: createdAt,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save audit.' }, { status: 500 });
    }

    const result = {
      id,
      formData,
      toolResults,
      totalMonthlySavings,
      totalAnnualSavings,
      aiSummary,
      overlapResults,
      createdAt,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('Audit route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
