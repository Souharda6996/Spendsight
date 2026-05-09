import { NextRequest, NextResponse } from 'next/server';
import { generateAuditSummary } from '@/lib/anthropic';
import { FormData, ToolAuditResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { formData, toolResults, totalMonthlySavings } = (await request.json()) as {
      formData: FormData;
      toolResults: ToolAuditResult[];
      totalMonthlySavings: number;
    };

    const summary = await generateAuditSummary(formData, toolResults, totalMonthlySavings);
    return NextResponse.json({ summary }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate summary.' },
      { status: 500 }
    );
  }
}
