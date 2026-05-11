import { FormData, ToolAuditResult, ToolInput, AITool } from '@/types';
import { PRICING_DATA } from '@/lib/pricing-data';

// ──────────────────────────────────────────────
// CORE AUDIT ENGINE — hardcoded rules, NO AI
// ──────────────────────────────────────────────

export function runAuditEngine(formData: FormData): ToolAuditResult[] {
  const { tools, teamSize, useCase } = formData;
  const results: ToolAuditResult[] = tools.map((toolInput) =>
    auditTool(toolInput, teamSize, useCase, tools)
  );

  // RULE 4 — Credits opportunity (applied as post-pass)
  const totalSavings = results.reduce((s, r) => s + r.monthlySavings, 0);
  if (totalSavings > 500) {
    results.forEach((r) => {
      if (r.recommendation !== 'optimal') {
        r.recommendation = 'credits';
        r.reason +=
          ' Credex sources discounted credits for this vendor — potential 15–30% off retail on top of plan optimization.';
      }
    });
  }

  return results;
}

function auditTool(
  toolInput: ToolInput,
  teamSize: number,
  useCase: string,
  allTools: ToolInput[]
): ToolAuditResult {
  const { tool, plan, monthlySpend, seats } = toolInput;
  const toolData = PRICING_DATA[tool];

  // ── RULE 1 — Wrong plan for team size ──────────
  const rule1Result = checkRule1(tool, plan, seats, monthlySpend);
  if (rule1Result) return rule1Result;

  // ── RULE 3 — Better-fit alternative tool (before Rule 2 to allow cross-tool wins)
  const rule3Result = checkRule3(tool, plan, monthlySpend, seats, useCase, allTools);
  if (rule3Result) return rule3Result;

  // ── RULE 2 — Cheaper same-vendor plan available ─
  const rule2Result = checkRule2(tool, plan, monthlySpend, seats);
  if (rule2Result) return rule2Result;

  // ── RULE 5 — Already optimal ────────────────────
  return {
    tool,
    currentSpend: monthlySpend,
    currentPlan: toolData?.plans.find((p) => p.planId === plan)?.planLabel ?? plan,
    recommendation: 'optimal',
    monthlySavings: 0,
    reason: "You're on the right plan for your usage. No immediate savings identified.",
  };
}

// ── RULE 1 IMPLEMENTATION ────────────────────────────────────────────────────
function checkRule1(
  tool: AITool,
  plan: string,
  seats: number,
  monthlySpend: number
): ToolAuditResult | null {
  const toolData = PRICING_DATA[tool];
  const currentPlanLabel = toolData?.plans.find((p) => p.planId === plan)?.planLabel ?? plan;

  // Claude Team + seats < 5 → recommend Pro
  if (tool === 'claude' && plan === 'claude-team' && seats < 5) {
    const proPlan = toolData.plans.find((p) => p.planId === 'claude-pro')!;
    const proMonthlyCost = proPlan.pricePerSeatPerMonth! * seats;
    const savings = monthlySpend - proMonthlyCost;
    if (savings > 5) {
      return {
        tool,
        currentSpend: monthlySpend,
        currentPlan: currentPlanLabel,
        recommendation: 'downgrade',
        recommendedPlan: proPlan.planLabel,
        monthlySavings: savings,
        reason: `Claude Team requires a minimum of 5 seats. With ${seats} seat(s), Claude Pro at $${proPlan.pricePerSeatPerMonth}/seat saves $${savings.toFixed(0)}/mo.`,
      };
    }
  }

  // ChatGPT Team + 1 seat → recommend Plus
  if (tool === 'chatgpt' && plan === 'chatgpt-team' && seats === 1) {
    const plusPlan = toolData.plans.find((p) => p.planId === 'chatgpt-plus')!;
    const savings = monthlySpend - plusPlan.pricePerSeatPerMonth!;
    if (savings > 5) {
      return {
        tool,
        currentSpend: monthlySpend,
        currentPlan: currentPlanLabel,
        recommendation: 'downgrade',
        recommendedPlan: plusPlan.planLabel,
        monthlySavings: savings,
        reason: `ChatGPT Team requires a minimum of 2 seats. For a solo user, Plus at $${plusPlan.pricePerSeatPerMonth}/mo saves $${savings.toFixed(0)}/mo.`,
      };
    }
  }

  // GitHub Copilot Business + 1 seat → recommend Individual
  if (tool === 'github-copilot' && plan === 'copilot-business' && seats === 1) {
    const individualPlan = toolData.plans.find((p) => p.planId === 'copilot-individual')!;
    const savings = monthlySpend - individualPlan.pricePerSeatPerMonth!;
    if (savings > 5) {
      return {
        tool,
        currentSpend: monthlySpend,
        currentPlan: currentPlanLabel,
        recommendation: 'downgrade',
        recommendedPlan: individualPlan.planLabel,
        monthlySavings: savings,
        reason: `GitHub Copilot Individual covers solo developers at $${individualPlan.pricePerSeatPerMonth}/seat vs Business at $19/seat — saves $${savings.toFixed(0)}/mo.`,
      };
    }
  }

  // Cursor Business + seats <= 2 → flag overhead
  if (tool === 'cursor' && plan === 'cursor-business' && seats <= 2) {
    const proPlan = toolData.plans.find((p) => p.planId === 'cursor-pro')!;
    const proMonthlyCost = proPlan.pricePerSeatPerMonth! * seats;
    const savings = monthlySpend - proMonthlyCost;
    if (savings > 5) {
      return {
        tool,
        currentSpend: monthlySpend,
        currentPlan: currentPlanLabel,
        recommendation: 'downgrade',
        recommendedPlan: proPlan.planLabel,
        monthlySavings: savings,
        reason: `Cursor Business features (SSO, admin) add overhead not justified under 3 seats. Pro at $${proPlan.pricePerSeatPerMonth}/seat saves $${savings.toFixed(0)}/mo.`,
      };
    }
  }

  return null;
}

// ── RULE 2 IMPLEMENTATION ────────────────────────────────────────────────────
function checkRule2(
  tool: AITool,
  plan: string,
  monthlySpend: number,
  seats: number
): ToolAuditResult | null {
  const toolData = PRICING_DATA[tool];
  if (!toolData) return null;

  const currentPlan = toolData.plans.find((p) => p.planId === plan);
  if (!currentPlan || currentPlan.pricePerSeatPerMonth === null) return null;

  const spendPerSeat = monthlySpend / seats;

  // Find viable cheaper plans (exclude free/zero plans — never manufacture savings to $0)
  const cheaperPlans = toolData.plans.filter((p) => {
    if (p.pricePerSeatPerMonth === null) return false;
    if (p.pricePerSeatPerMonth === 0) return false; // never downgrade to free
    if (p.planId === plan) return false;
    if (p.minSeats && seats < p.minSeats) return false;
    return p.pricePerSeatPerMonth < spendPerSeat;
  });

  if (cheaperPlans.length === 0) return null;

  // Pick the best cheaper plan (highest price that still saves money — most features)
  const bestPlan = cheaperPlans.reduce((best, p) =>
    (p.pricePerSeatPerMonth ?? 0) > (best.pricePerSeatPerMonth ?? 0) ? p : best
  );

  const savings = monthlySpend - bestPlan.pricePerSeatPerMonth! * seats;
  if (savings <= 5) return null;

  return {
    tool,
    currentSpend: monthlySpend,
    currentPlan: currentPlan.planLabel,
    recommendation: 'downgrade',
    recommendedPlan: bestPlan.planLabel,
    monthlySavings: savings,
    reason: `Switching to ${bestPlan.planLabel} ($${bestPlan.pricePerSeatPerMonth}/seat/mo) meets your needs at a lower cost — saving $${savings.toFixed(0)}/mo.`,
  };
}

// ── RULE 3 IMPLEMENTATION ────────────────────────────────────────────────────
function checkRule3(
  tool: AITool,
  plan: string,
  monthlySpend: number,
  seats: number,
  useCase: string,
  allTools: ToolInput[]
): ToolAuditResult | null {
  const toolData = PRICING_DATA[tool];
  const currentPlanLabel = toolData?.plans.find((p) => p.planId === plan)?.planLabel ?? plan;
  const alreadyHas = (t: AITool) => allTools.some((ti) => ti.tool === t);

  // Helper to find the best fit plan for a target tool given a team size
  const getBestFit = (targetTool: AITool) => {
    const data = PRICING_DATA[targetTool];
    // Filter for plans that have a price and meet minSeats
    const viable = data.plans.filter(p => p.pricePerSeatPerMonth !== null && (p.minSeats ?? 0) <= seats);
    if (viable.length === 0) return null;

    // For teams > 5, prioritize 'Team' or 'Business' plans even if they aren't the absolute cheapest
    if (seats >= 5) {
      const teamPlan = viable.find(p => 
        p.planLabel.toLowerCase().includes('team') || 
        p.planLabel.toLowerCase().includes('business') ||
        p.planLabel.toLowerCase().includes('org')
      );
      if (teamPlan) return teamPlan;
    }

    // Otherwise, pick the most feature-rich plan that is still cheaper than the current spend per seat
    const spendPerSeat = monthlySpend / seats;
    const cheaperViable = viable.filter(p => p.pricePerSeatPerMonth! < spendPerSeat);
    if (cheaperViable.length === 0) return null;

    return cheaperViable.reduce((best, p) => 
      (p.pricePerSeatPerMonth ?? 0) > (best.pricePerSeatPerMonth ?? 0) ? p : best
    );
  };

  // useCase === 'coding' AND tool === 'chatgpt' → surface Cursor or GitHub Copilot
  if (useCase === 'coding' && tool === 'chatgpt') {
    const alternateTool: AITool | null = !alreadyHas('cursor') ? 'cursor' : !alreadyHas('github-copilot') ? 'github-copilot' : null;
    if (alternateTool) {
      const bestPlan = getBestFit(alternateTool);
      if (bestPlan) {
        const altCost = bestPlan.pricePerSeatPerMonth! * seats;
        const savings = monthlySpend - altCost;
        if (savings > 10) {
          return {
            tool,
            currentSpend: monthlySpend,
            currentPlan: currentPlanLabel,
            recommendation: 'switch',
            recommendedTool: PRICING_DATA[alternateTool].label,
            recommendedPlan: bestPlan.planLabel,
            monthlySavings: savings,
            reason: `For coding-focused teams, ${PRICING_DATA[alternateTool].label} (${bestPlan.planLabel}) is purpose-built for engineering workflows — saves $${savings.toFixed(0)}/mo vs ChatGPT.`,
          };
        }
      }
    }
  }

  // useCase === 'writing' AND tool === 'cursor' → surface Claude
  if (useCase === 'writing' && tool === 'cursor') {
    if (!alreadyHas('claude')) {
      const bestPlan = getBestFit('claude');
      if (bestPlan) {
        const altCost = bestPlan.pricePerSeatPerMonth! * seats;
        const savings = monthlySpend - altCost;
        if (savings > 10) {
          return {
            tool,
            currentSpend: monthlySpend,
            currentPlan: currentPlanLabel,
            recommendation: 'switch',
            recommendedTool: PRICING_DATA['claude'].label,
            recommendedPlan: bestPlan.planLabel,
            monthlySavings: savings,
            reason: `For writing-focused work, Claude (${bestPlan.planLabel}) has superior long-form output quality vs Cursor — saves $${savings.toFixed(0)}/mo.`,
          };
        }
      }
    }
  }

  // useCase === 'coding' AND Anthropic API direct > $50 savings → surface Cursor
  if (useCase === 'coding' && tool === 'anthropic-api') {
    if (!alreadyHas('cursor')) {
      const bestPlan = getBestFit('cursor');
      if (bestPlan) {
        const altCost = bestPlan.pricePerSeatPerMonth! * seats;
        const savings = monthlySpend - altCost;
        if (savings > 50) {
          return {
            tool,
            currentSpend: monthlySpend,
            currentPlan: currentPlanLabel,
            recommendation: 'switch',
            recommendedTool: PRICING_DATA['cursor'].label,
            recommendedPlan: bestPlan.planLabel,
            monthlySavings: savings,
            reason: `Cursor (${bestPlan.planLabel}) includes Claude access via a flat monthly fee — significantly cheaper than direct API usage for coding, saving $${savings.toFixed(0)}/mo.`,
          };
        }
      }
    }
  }

  return null;
}

// ── TOTALS ────────────────────────────────────────────────────────────────────
export function calculateTotals(results: ToolAuditResult[]) {
  const totalMonthlySavings = results.reduce((s, r) => s + r.monthlySavings, 0);
  return {
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}

// ── OVERLAP DETECTOR ──────────────────────────────────────────────────────────
// Detects when the user is paying for two tools with substantially overlapping
// capabilities. Completely independent of the 5 audit rules above.
// Each overlap entry is a pair (toolA, toolB) with a severity, capability string,
// and a keep-one recommendation. Finance-defensible reasoning throughout.
// ──────────────────────────────────────────────────────────────────────────────

import { OverlapResult } from '@/types';

type OverlapRule = {
  toolA: AITool;
  toolB: AITool;
  capability: string;
  severity: 'high' | 'medium';
  recommendation: string;
  keepTool: AITool;
  keepToolLabel: string;
};

/** Hardcoded overlap rules — every pair that duplicates real capability */
const OVERLAP_RULES: OverlapRule[] = [
  // ── General-purpose LLM duplicates ────────────────────────────
  {
    toolA: 'claude',
    toolB: 'chatgpt',
    capability: 'General-purpose LLM (chat, writing, reasoning)',
    severity: 'high',
    recommendation:
      'Claude and ChatGPT both provide general-purpose AI assistance. ' +
      'Running both costs double for nearly identical output quality on most tasks. ' +
      'Keep Claude for long-form writing and coding discussions; cancel ChatGPT.',
    keepTool: 'claude',
    keepToolLabel: 'Claude',
  },
  {
    toolA: 'anthropic-api',
    toolB: 'openai-api',
    capability: 'LLM API access (completions, embeddings)',
    severity: 'high',
    recommendation:
      'You are paying for both the Anthropic API and OpenAI API. ' +
      'Unless you have hard model-specific requirements per feature, consolidate to one provider. ' +
      'Claude Sonnet and GPT-4o are near-equivalent for most production use cases — pick the cheaper per-token cost for your actual usage pattern.',
    keepTool: 'anthropic-api',
    keepToolLabel: 'Anthropic API',
  },
  // ── IDE coding assistants ─────────────────────────────────────
  {
    toolA: 'cursor',
    toolB: 'github-copilot',
    capability: 'AI-powered code completion and inline editing',
    severity: 'high',
    recommendation:
      'Cursor and GitHub Copilot both provide inline AI code completion inside the editor. ' +
      'Cursor includes Claude and GPT-4 access on top of completions — it is a strict superset of Copilot at a similar price point. ' +
      'Cancel Copilot and use Cursor exclusively.',
    keepTool: 'cursor',
    keepToolLabel: 'Cursor',
  },
  {
    toolA: 'cursor',
    toolB: 'windsurf',
    capability: 'Agentic AI coding environment',
    severity: 'high',
    recommendation:
      'Cursor and Windsurf are both AI-first coding environments that include agentic code generation. ' +
      'No team needs both. Compare your active usage: whichever has more daily active users on your team should win; cancel the other.',
    keepTool: 'cursor',
    keepToolLabel: 'Cursor',
  },
  {
    toolA: 'github-copilot',
    toolB: 'windsurf',
    capability: 'AI-assisted code completion',
    severity: 'high',
    recommendation:
      'GitHub Copilot and Windsurf both provide AI code completion. ' +
      'Windsurf includes agentic features that Copilot lacks — if your team uses agentic coding, keep Windsurf and cancel Copilot.',
    keepTool: 'windsurf',
    keepToolLabel: 'Windsurf',
  },
  // ── API + chat product for same vendor ───────────────────────
  {
    toolA: 'claude',
    toolB: 'anthropic-api',
    capability: 'Anthropic Claude access',
    severity: 'medium',
    recommendation:
      'You are paying for Claude (subscription) and Anthropic API access. ' +
      'If your team uses Claude for personal productivity AND the API for product features, this is expected. ' +
      'But if developers are using the API interactively in lieu of the product UI, the subscription is redundant — audit actual usage.',
    keepTool: 'anthropic-api',
    keepToolLabel: 'Anthropic API',
  },
  {
    toolA: 'chatgpt',
    toolB: 'openai-api',
    capability: 'OpenAI GPT model access',
    severity: 'medium',
    recommendation:
      'You are paying for ChatGPT (subscription) and OpenAI API access. ' +
      'If developers use the API to power product features and use ChatGPT separately for personal productivity, this is justified. ' +
      'Otherwise, API access already provides full GPT-4o access via Playground — cancel the ChatGPT subscription.',
    keepTool: 'openai-api',
    keepToolLabel: 'OpenAI API',
  },
  // ── Gemini + general LLM ─────────────────────────────────────
  {
    toolA: 'gemini',
    toolB: 'chatgpt',
    capability: 'General-purpose AI assistant (non-coding)',
    severity: 'medium',
    recommendation:
      'Gemini and ChatGPT Plus target the same general-purpose AI assistant use case. ' +
      'Gemini is stronger for Google Workspace integration and long-context tasks; ChatGPT is stronger for plugin ecosystem. ' +
      'Pick one based on your team\'s primary workflow and cancel the other.',
    keepTool: 'gemini',
    keepToolLabel: 'Gemini',
  },
  {
    toolA: 'gemini',
    toolB: 'claude',
    capability: 'General-purpose LLM for writing and research',
    severity: 'medium',
    recommendation:
      'Gemini and Claude both excel at long-context writing and research tasks. ' +
      'This overlap is worth evaluating: Claude outperforms on structured writing and coding discussions; ' +
      'Gemini wins on Google Workspace integration and multimodal tasks. ' +
      'Unless your team has clear distinct use cases, consolidating saves $20–30/seat/month.',
    keepTool: 'claude',
    keepToolLabel: 'Claude',
  },
];

const TOOL_LABELS_MAP: Record<AITool, string> = {
  'cursor': 'Cursor',
  'github-copilot': 'GitHub Copilot',
  'claude': 'Claude',
  'chatgpt': 'ChatGPT',
  'anthropic-api': 'Anthropic API',
  'openai-api': 'OpenAI API',
  'gemini': 'Gemini',
  'windsurf': 'Windsurf',
};

export function detectOverlaps(tools: ToolInput[]): OverlapResult[] {
  const toolSet = new Set(tools.map((t) => t.tool));
  const results: OverlapResult[] = [];

  for (const rule of OVERLAP_RULES) {
    if (toolSet.has(rule.toolA) && toolSet.has(rule.toolB)) {
      const spendA = tools.find((t) => t.tool === rule.toolA)?.monthlySpend ?? 0;
      const spendB = tools.find((t) => t.tool === rule.toolB)?.monthlySpend ?? 0;
      results.push({
        toolA: rule.toolA,
        toolB: rule.toolB,
        toolALabel: TOOL_LABELS_MAP[rule.toolA],
        toolBLabel: TOOL_LABELS_MAP[rule.toolB],
        capability: rule.capability,
        recommendation: rule.recommendation,
        keepTool: rule.keepTool,
        keepToolLabel: rule.keepToolLabel,
        combinedSpend: spendA + spendB,
        severity: rule.severity,
      });
    }
  }

  // Sort: high severity first
  return results.sort((a, b) => (a.severity === 'high' && b.severity !== 'high' ? -1 : 1));
}
