import { describe, it, expect } from 'vitest';
import { runAuditEngine, calculateTotals, detectOverlaps } from '@/lib/audit-engine';
import { FormData, ToolAuditResult } from '@/types';

describe('SpendSight Audit Engine', () => {
  // TEST 1 — GitHub Copilot Business, 1 seat → recommends Individual, savings = $9/mo
  it('GitHub Copilot Business with 1 seat recommends Individual and saves $9/mo', () => {
    const formData: FormData = {
      tools: [{ tool: 'github-copilot', plan: 'copilot-business', monthlySpend: 19, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    };
    const results = runAuditEngine(formData);
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result.recommendation).toBe('downgrade');
    expect(result.recommendedPlan).toBe('Individual');
    expect(result.monthlySavings).toBe(9);
  });

  // TEST 2 — Claude Team, 3 seats → recommends Pro, saves ($30-$20)*3 = $30/mo
  it('Claude Team with 3 seats recommends Pro and saves $30/mo', () => {
    const formData: FormData = {
      tools: [{ tool: 'claude', plan: 'claude-team', monthlySpend: 90, seats: 3 }],
      teamSize: 3,
      useCase: 'mixed',
    };
    const results = runAuditEngine(formData);
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result.recommendation).toBe('downgrade');
    expect(result.recommendedPlan).toBe('Pro');
    expect(result.monthlySavings).toBe(30);
  });

  // TEST 3 — ChatGPT Team, 1 seat → recommends Plus, saves $10/mo
  it('ChatGPT Team with 1 seat recommends Plus and saves $10/mo', () => {
    const formData: FormData = {
      tools: [{ tool: 'chatgpt', plan: 'chatgpt-team', monthlySpend: 30, seats: 1 }],
      teamSize: 1,
      useCase: 'writing',
    };
    const results = runAuditEngine(formData);
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result.recommendation).toBe('downgrade');
    expect(result.recommendedPlan).toBe('Plus');
    expect(result.monthlySavings).toBe(10);
  });

  // TEST 4 — User on Cursor Pro correctly → returns 'optimal', savings = 0
  it('User on Cursor Pro with 1 seat returns optimal with no savings', () => {
    const formData: FormData = {
      tools: [{ tool: 'cursor', plan: 'cursor-pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    };
    const results = runAuditEngine(formData);
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result.recommendation).toBe('optimal');
    expect(result.monthlySavings).toBe(0);
  });

  // TEST 5 — ChatGPT Plus for coding use case → surfaces coding tool alternative
  it('ChatGPT Plus for coding use case surfaces an alternative coding tool', () => {
    const formData: FormData = {
      tools: [{ tool: 'chatgpt', plan: 'chatgpt-plus', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    };
    const results = runAuditEngine(formData);
    expect(results).toHaveLength(1);
    const result = results[0];
    expect(result.recommendation).toBe('switch');
    expect(result.recommendedTool).toBeDefined();
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  // TEST 6 — Total savings calculation sums correctly across 3 tools
  it('calculateTotals correctly sums monthly and annual savings across 3 tools', () => {
    const mockResults: ToolAuditResult[] = [
      {
        tool: 'github-copilot',
        currentSpend: 19,
        currentPlan: 'Business',
        recommendation: 'downgrade',
        recommendedPlan: 'Individual',
        monthlySavings: 9,
        reason: 'Test reason',
      },
      {
        tool: 'chatgpt',
        currentSpend: 30,
        currentPlan: 'Team',
        recommendation: 'downgrade',
        recommendedPlan: 'Plus',
        monthlySavings: 10,
        reason: 'Test reason',
      },
      {
        tool: 'cursor',
        currentSpend: 20,
        currentPlan: 'Pro',
        recommendation: 'optimal',
        monthlySavings: 0,
        reason: 'Already optimal',
      },
    ];

    const totals = calculateTotals(mockResults);
    expect(totals.totalMonthlySavings).toBe(19);
    expect(totals.totalAnnualSavings).toBe(228);
  });
});

// ── OVERLAP DETECTOR TESTS ────────────────────────────────────────────────────
describe('Overlap Detector', () => {
  // TEST 7 — Cursor + GitHub Copilot → high severity overlap flagged
  it('detects high-severity overlap between Cursor and GitHub Copilot', () => {
    const tools = [
      { tool: 'cursor' as const, plan: 'cursor-pro', monthlySpend: 20, seats: 3 },
      { tool: 'github-copilot' as const, plan: 'copilot-business', monthlySpend: 57, seats: 3 },
    ];
    const overlaps = detectOverlaps(tools);
    expect(overlaps.length).toBeGreaterThan(0);
    const overlap = overlaps[0];
    expect(overlap.severity).toBe('high');
    expect(overlap.toolA).toBe('cursor');
    expect(overlap.toolB).toBe('github-copilot');
    expect(overlap.combinedSpend).toBe(77);
  });

  // TEST 8 — Claude + ChatGPT → high severity overlap flagged
  it('detects high-severity overlap between Claude and ChatGPT', () => {
    const tools = [
      { tool: 'claude' as const, plan: 'claude-pro', monthlySpend: 20, seats: 1 },
      { tool: 'chatgpt' as const, plan: 'chatgpt-plus', monthlySpend: 20, seats: 1 },
    ];
    const overlaps = detectOverlaps(tools);
    const claudeChatgptOverlap = overlaps.find(
      (o) => o.toolA === 'claude' && o.toolB === 'chatgpt'
    );
    expect(claudeChatgptOverlap).toBeDefined();
    expect(claudeChatgptOverlap!.severity).toBe('high');
    expect(claudeChatgptOverlap!.keepTool).toBe('claude');
  });

  // TEST 9 — Single tool → no overlaps detected
  it('returns empty array when only one tool is present', () => {
    const tools = [
      { tool: 'cursor' as const, plan: 'cursor-pro', monthlySpend: 20, seats: 1 },
    ];
    const overlaps = detectOverlaps(tools);
    expect(overlaps).toHaveLength(0);
  });
});
