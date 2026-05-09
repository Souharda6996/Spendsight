import { describe, it, expect } from 'vitest';
import { runAuditEngine, calculateTotals } from '@/lib/audit-engine';
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
    // Cursor Pro is $0 for first slot since Hobby is $0, savings should be > 10
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
