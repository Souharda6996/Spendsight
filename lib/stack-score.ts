import { ToolAuditResult, OverlapResult } from '@/types';

// ── STACK SCORE ───────────────────────────────────────────────────────────────
// A single A–F letter grade for your AI tool stack efficiency.
// Pure deterministic math — no AI, no network, computable anywhere.
//
// Scoring formula:
//   Start at 100
//   - Subtract wastePercentage (% of total spend that could be saved)
//   - Subtract 15 per high-severity overlap (paying double for same capability)
//   - Subtract 7  per medium-severity overlap (partial duplicate)
//   Clamp to [0, 100]
//
// Grade thresholds:
//   A   ≥ 90   — Excellent. Minimal waste, no overlaps.
//   B+  ≥ 80   — Good. Small optimizations available.
//   B   ≥ 70   — Above average. A plan switch would help.
//   C+  ≥ 60   — Average. Meaningful savings identified.
//   C   ≥ 50   — Below average. Multiple issues found.
//   D   ≥ 35   — Poor. Significant duplicate or wrong-plan spend.
//   F   <  35  — Critical. Over half your AI budget is preventable waste.
// ──────────────────────────────────────────────────────────────────────────────

export interface StackScore {
  grade: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  score: number;           // 0–100 numeric score
  label: string;           // human-readable label
  wastePercentage: number; // % of total spend identified as savings
  totalCurrentSpend: number;
  highOverlaps: number;
  mediumOverlaps: number;
  color: string;           // CSS hex for grade colour
  description: string;     // one-line summary for sharing
}

const GRADE_CONFIG: Array<{
  min: number;
  grade: StackScore['grade'];
  label: string;
  color: string;
}> = [
  { min: 90, grade: 'A',  label: 'Excellent',     color: '#22c55e' },
  { min: 80, grade: 'B+', label: 'Good',           color: '#4ade80' },
  { min: 70, grade: 'B',  label: 'Above Average',  color: '#86efac' },
  { min: 60, grade: 'C+', label: 'Average',        color: '#facc15' },
  { min: 50, grade: 'C',  label: 'Below Average',  color: '#fb923c' },
  { min: 35, grade: 'D',  label: 'Poor',           color: '#f87171' },
  { min:  0, grade: 'F',  label: 'Critical Waste', color: '#ef4444' },
];

function describeScore(grade: StackScore['grade'], waste: number, highOverlaps: number): string {
  if (grade === 'A') return 'Your AI stack is lean and efficient. No significant waste found.';
  if (grade === 'B+') return `Minor optimizations available — ${waste.toFixed(0)}% of spend could be trimmed.`;
  if (grade === 'B')  return `A plan switch would reduce your AI spend by ~${waste.toFixed(0)}%.`;
  if (grade === 'C+') return `Meaningful savings identified. Review the recommendations below.`;
  if (grade === 'C')  return `Multiple issues found across your stack. ${highOverlaps > 0 ? `${highOverlaps} tool pair(s) are duplicating capability.` : 'Plan mismatches are costing you.'}`;
  if (grade === 'D')  return `Significant duplicate or wrong-plan spend detected. Immediate action recommended.`;
  return `Over half your AI budget is preventable waste. Consolidate your stack now.`;
}

export function calculateStackScore(
  toolResults: ToolAuditResult[],
  overlapResults: OverlapResult[],
): StackScore {
  const totalCurrentSpend = toolResults.reduce((s, r) => s + r.currentSpend, 0);
  const totalMonthlySavings = toolResults.reduce((s, r) => s + r.monthlySavings, 0);

  const wastePercentage = totalCurrentSpend > 0
    ? (totalMonthlySavings / totalCurrentSpend) * 100
    : 0;

  const highOverlaps   = overlapResults.filter((o) => o.severity === 'high').length;
  const mediumOverlaps = overlapResults.filter((o) => o.severity === 'medium').length;

  let rawScore = 100;
  rawScore -= wastePercentage;
  rawScore -= highOverlaps   * 15;
  rawScore -= mediumOverlaps * 7;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  const config = GRADE_CONFIG.find((g) => score >= g.min) ?? GRADE_CONFIG[GRADE_CONFIG.length - 1];

  return {
    grade: config.grade,
    score,
    label: config.label,
    wastePercentage,
    totalCurrentSpend,
    highOverlaps,
    mediumOverlaps,
    color: config.color,
    description: describeScore(config.grade, wastePercentage, highOverlaps),
  };
}
