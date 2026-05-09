# METRICS.md — SpendSight

## North Star Metric

**Audits completed** (not sessions or pageviews)

An audit is counted as "completed" when the user reaches the results page — meaning they got value. A session where someone opened the landing page and bounced is not a data point worth optimizing. We optimize for people who got something useful.

---

## 3 Input Metrics

| Metric | Why It Matters | Target (Week 1) |
|---|---|---|
| **Form completion rate** | % of users who start Step 1 and complete Step 3. If this is <30%, the form is too long or confusing. | ≥50% |
| **Email capture rate** | % of audit-completers who enter email. This is the lead quality indicator. If <10%, results page isn't convincing enough. | ≥16% |
| **Consultation booking rate** | % of email leads who book a Credex call. Only high-savings ($500+/mo) users see the CTA. Target: 15% of those. | ≥10% of qualified |

---

## Analytics Implementation

**Tool:** Plausible Analytics (privacy-friendly, no cookie consent required, GDPR-compliant out of the box)

**Events to instrument:**

```javascript
// On Step 1 load
plausible('form_start')

// On successful Step 3 submission (API call made)
plausible('form_complete', { props: { toolCount: tools.length } })

// On audit results page load (SSR event or client hydration)
plausible('audit_viewed', { props: { 
  savings_bucket: totalMonthlySavings > 500 ? 'high' : totalMonthlySavings > 100 ? 'medium' : 'low'
} })

// On email modal submit (successful)
plausible('email_captured')

// On Credex CTA click
plausible('credex_cta_clicked')

// On share button click
plausible('audit_shared')
```

**Dashboard setup:** Plausible custom events in the Goals tab. Track funnel: `form_start` → `form_complete` → `audit_viewed` → `email_captured`.

---

## Pivot Triggers

| Signal | Threshold | Action |
|---|---|---|
| Email capture rate | <10% after 200 audits | Results page not landing — either savings are too low, or email CTA position is wrong. Move CTA above ToolBreakdown, or A/B test copy. |
| Form completion rate | <20% | Step 2 (tool input) is too complex. Reduce to 4 tools max, simplify plan selection. |
| Audits with $0 savings | >60% of all audits | Rules too conservative — users are selecting optimal plans or using tools engine hasn't covered. Add more rules or expand tool list. |
| Consultation bookings | 0 after 50 high-savings audits | CredexCTA not converting. Try sending a personal email to high-savings users instead of CTA button. |

---

## Secondary Metrics (Monitor, Don't Optimize)

- Average savings per audit (qualitative health check — if falling, users are more optimized)
- Top tools audited (shows which tool's community is driving traffic)
- Audit shares per day (proxy for viral coefficient)
- Time-to-complete form (if >3 min, form is too long)
