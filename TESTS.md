# TESTS.md — SpendSight

All tests live in `__tests__/audit-engine.test.ts` and run with Vitest.

## Run Command

```bash
npm run test
```

Expected output: `9 passed (9)` with no failures.

---

## Test Cases

| # | File | Test Name | What It Verifies | Expected Result |
|---|---|---|---|---|
| 1 | `audit-engine.test.ts` | GitHub Copilot Business with 1 seat recommends Individual and saves $9/mo | Rule 1: wrong plan for team size — Business not justified for 1 seat; Individual is $10 vs Business $19 | `recommendation: 'downgrade'`, `recommendedPlan: 'Individual'`, `monthlySavings: 9` |
| 2 | `audit-engine.test.ts` | Claude Team with 3 seats recommends Pro and saves $30/mo | Rule 1: Claude Team requires minimum 5 seats; 3 seats on Team ($90) vs Pro ($60) | `recommendation: 'downgrade'`, `recommendedPlan: 'Pro'`, `monthlySavings: 30` |
| 3 | `audit-engine.test.ts` | ChatGPT Team with 1 seat recommends Plus and saves $10/mo | Rule 1: ChatGPT Team requires minimum 2 seats; 1 seat on Team ($30) vs Plus ($20) | `recommendation: 'downgrade'`, `recommendedPlan: 'Plus'`, `monthlySavings: 10` |
| 4 | `audit-engine.test.ts` | User on Cursor Pro with 1 seat returns optimal with no savings | Rule 5: all rules fail to fire; correct plan for use case and team size | `recommendation: 'optimal'`, `monthlySavings: 0` |
| 5 | `audit-engine.test.ts` | ChatGPT Plus for coding use case surfaces an alternative coding tool | Rule 3: wrong tool for use case — coding teams should use Cursor, not ChatGPT | `recommendation: 'switch'`, `recommendedTool` defined, `monthlySavings > 0` |
| 6 | `audit-engine.test.ts` | calculateTotals correctly sums monthly and annual savings across 3 tools | Utility: totals $9 + $10 + $0 = $19/mo, × 12 = $228/yr | `totalMonthlySavings: 19`, `totalAnnualSavings: 228` |
| 7 | `audit-engine.test.ts` | Detects high-severity overlap between Cursor and GitHub Copilot | Overlap Detector: both provide inline AI code completion — high severity duplicate | `severity: 'high'`, `toolA: 'cursor'`, `combinedSpend: 77` |
| 8 | `audit-engine.test.ts` | Detects high-severity overlap between Claude and ChatGPT | Overlap Detector: both are general-purpose LLMs — high severity | `severity: 'high'`, `keepTool: 'claude'` |
| 9 | `audit-engine.test.ts` | Returns empty array when only one tool is present | Overlap Detector: no pair to compare — correctly returns zero overlaps | `overlaps.length === 0` |

---

## Notes

- Tests are **pure unit tests** — no mocking, no network calls, no database
- The audit engine is deterministic — tests produce identical results on every run
- Tests 1–6 cover the 5 audit rules and totals utility
- Tests 7–9 cover the **Overlap Detector** feature (added v1.1)
- Rule 4 (credits flag) is not tested in isolation because it activates only when total savings > $500; integration test would require multiple high-savings inputs
