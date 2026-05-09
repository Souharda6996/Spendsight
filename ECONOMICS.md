# ECONOMICS.md — SpendSight Unit Economics

## The Value Chain

SpendSight is a **lead generation tool** for Credex's core business: sourcing discounted AI credits for startups. The audit is free because the data it generates (team size, tool stack, spend level) is the qualification filter that Credex uses to identify high-value prospects.

---

## Lead Value Calculation

**Credex core transaction:**
- Customer buys $10,000/year in AI credits (Anthropic, OpenAI, etc.)
- Credex sources at 15% margin = **$1,500 LTV per customer**

**Conversion funnel (conservative estimates):**

| Stage | Rate | Cumulative |
|---|---|---|
| Audit completed | 100% | 1,000 audits |
| Email captured | 25% | 250 leads |
| Consultation booked (high-savings only, ~60% of leads qualify) | 15% of qualified | 22 consultations |
| Purchase closed | 30% close rate | ~6–7 customers |

**Effective audit→revenue rate:** 25% × 15% × 30% = **1.125%**  
**Revenue per audit at scale:** 1.125% × $1,500 = **$16.88 per completed audit**

---

## Customer Acquisition Cost

| Channel | CAC | Notes |
|---|---|---|
| Organic (Show HN, Reddit, Slack) | ~$0 paid, ~$0.50 effective | At $25/hr labor cost, 1 hour of posting per 50 audits = $0.50 CAC |
| LinkedIn CPC | ~$50/click | Even at $50 CAC, profitable if LTV > $50 — yes, 30× yes |
| X/Twitter promotion | ~$5/click | Better ROI; dev audience more engaged |
| Email to Credex customers | ~$0 | Marginal cost of one email; near-infinite ROI |

**Payback period:** Near-instant for organic. LinkedIn paid: ~3 customers from 150 clicks at $50/click = $7,500 spend → $4,500 revenue → not profitable at that scale. **Organic-first is the right strategy.**

---

## $1M ARR Math

- **Target LTV:** $1,500/customer
- **Customers needed for $1M ARR:** $1,000,000 / $1,500 = **667 customers**
- **At 1.125% audit→customer conversion:** 667 / 0.01125 = **~59,300 audits total**
- **Timeline (18 months):** 59,300 / 18 months / 30 days = **~110 audits/day**

**Is 110 audits/day achievable?**  
Yes, if the viral sharing loop works. One HN Show post can drive 500–2,000 audits in a day. If 10% of users share their audit link (the URL is already built for this), each person drives ~3–5 additional audits. At 100 audits/day baseline, the sharing loop creates ~30–50 organic audits/day on top.

---

## Why Free Matters

The tool must be completely free with no forced signup to maximize the top of the funnel. Every friction point (registration wall, credit card, mandatory email) reduces completion rate by 40–60%. At 1.125% conversion, a 50% drop in completions = 50% drop in revenue. The email gate post-results (not pre) is the right balance: capture intent after demonstrating value, not before.

---

## Sensitivity Analysis

| Conversion Rate | Revenue per Audit | Audits for $1M ARR |
|---|---|---|
| 0.5% | $7.50 | 133,333 |
| **1.125%** | **$16.88** | **59,300** |
| 2.0% | $30.00 | 33,333 |
| 3.0% | $45.00 | 22,222 |

The 1.125% base case is conservative. High-savings audits (>$500/mo) that see the CredexCTA convert at 3–5× the baseline rate because the user has clear, concrete financial motivation.
