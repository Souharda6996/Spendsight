import Anthropic from '@anthropic-ai/sdk';
import { ToolAuditResult, FormData } from '@/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildFallbackSummary(
  formData: FormData,
  toolResults: ToolAuditResult[],
  totalMonthlySavings: number
): string {
  const topResult = [...toolResults].sort((a, b) => b.monthlySavings - a.monthlySavings)[0];
  const opportunities = toolResults.filter((r) => r.monthlySavings > 0).length;
  return `Based on your AI tool usage across ${toolResults.length} tool${toolResults.length !== 1 ? 's' : ''} with a ${formData.teamSize}-person team focused on ${formData.useCase}, we identified ${opportunities} optimization ${opportunities !== 1 ? 'opportunities' : 'opportunity'} totaling $${totalMonthlySavings.toFixed(0)}/month. Your biggest win is ${topResult?.reason ?? 'switching to a better-fit plan'}. Review the full breakdown below for specific actions.`;
}

export async function generateAuditSummary(
  formData: FormData,
  toolResults: ToolAuditResult[],
  totalMonthlySavings: number
): Promise<string> {
  try {
    const topResult = [...toolResults].sort((a, b) => b.monthlySavings - a.monthlySavings)[0];
    const toolList = toolResults.map((r) => `${r.tool} (${r.currentPlan})`).join(', ');

    const prompt = `Generate a 90-100 word summary for a startup.
Team size: ${formData.teamSize}
Use case: ${formData.useCase}
Tools audited: ${toolList}
Total monthly savings: $${totalMonthlySavings.toFixed(0)}
Top recommendation: ${topResult?.reason ?? 'Already optimized'}

Cover: (1) the spending pattern, (2) the single biggest win with dollar amount, (3) one forward-looking suggestion.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system:
        'You are a financial advisor specializing in AI tool spend for tech startups. Write crisp, specific, second-person summaries. No fluff. No em dashes. No bullet points.',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return text.trim();
  } catch {
    return buildFallbackSummary(formData, toolResults, totalMonthlySavings);
  }
}
