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

  // useCase === 'coding' AND tool === 'chatgpt' → surface Cursor or GitHub Copilot
  if (useCase === 'coding' && tool === 'chatgpt') {
    const alternateTool = !alreadyHas('cursor') ? 'cursor' : !alreadyHas('github-copilot') ? 'github-copilot' : null;
    if (alternateTool) {
      const altData = PRICING_DATA[alternateTool];
      const altCheapestPlan = altData.plans.find((p) => p.pricePerSeatPerMonth !== null)!;
      const altCost = altCheapestPlan.pricePerSeatPerMonth! * seats;
      const savings = monthlySpend - altCost;
      if (savings > 10) {
        return {
          tool,
          currentSpend: monthlySpend,
          currentPlan: currentPlanLabel,
          recommendation: 'switch',
          recommendedTool: altData.label,
          recommendedPlan: altCheapestPlan.planLabel,
          monthlySavings: savings,
          reason: `For coding-focused teams, ${altData.label} (${altCheapestPlan.planLabel}) is purpose-built with inline completions — saves $${savings.toFixed(0)}/mo vs ChatGPT.`,
        };
      }
    }
  }

  // useCase === 'writing' AND tool === 'cursor' → surface Claude Pro
  if (useCase === 'writing' && tool === 'cursor') {
    if (!alreadyHas('claude')) {
      const claudeData = PRICING_DATA['claude'];
      const claudeProPlan = claudeData.plans.find((p) => p.planId === 'claude-pro')!;
      const altCost = claudeProPlan.pricePerSeatPerMonth! * seats;
      const savings = monthlySpend - altCost;
      if (savings > 10) {
        return {
          tool,
          currentSpend: monthlySpend,
          currentPlan: currentPlanLabel,
          recommendation: 'switch',
          recommendedTool: claudeData.label,
          recommendedPlan: claudeProPlan.planLabel,
          monthlySavings: savings,
          reason: `For writing-focused work, Claude Pro has superior long-form output quality vs Cursor — saves $${savings.toFixed(0)}/mo.`,
        };
      }
    }
  }

  // useCase === 'coding' AND Anthropic API direct > $50 savings → surface Cursor Pro
  if (useCase === 'coding' && tool === 'anthropic-api') {
    if (!alreadyHas('cursor')) {
      const cursorData = PRICING_DATA['cursor'];
      const cursorProPlan = cursorData.plans.find((p) => p.planId === 'cursor-pro')!;
      const altCost = cursorProPlan.pricePerSeatPerMonth! * seats;
      const savings = monthlySpend - altCost;
      if (savings > 50) {
        return {
          tool,
          currentSpend: monthlySpend,
          currentPlan: currentPlanLabel,
          recommendation: 'switch',
          recommendedTool: cursorData.label,
          recommendedPlan: cursorProPlan.planLabel,
          monthlySavings: savings,
          reason: `Cursor Pro includes Claude access via a flat $${cursorProPlan.pricePerSeatPerMonth}/seat/mo — significantly cheaper than raw Anthropic API for coding workflows, saving $${savings.toFixed(0)}/mo.`,
        };
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
