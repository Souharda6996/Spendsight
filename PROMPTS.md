# PROMPTS.md — SpendSight

## AI Summary Prompt

**File:** `lib/anthropic.ts` → `generateAuditSummary()`  
**Model:** `claude-sonnet-4-20250514`  
**Max tokens:** 256

---

### System Prompt

```
You are a financial advisor specializing in AI tool spend for tech startups.
Write crisp, specific, second-person summaries. No fluff. No em dashes. No bullet points.
```

### User Prompt Template

```
Generate a 90-100 word summary for a startup.
Team size: {teamSize}
Use case: {useCase}
Tools audited: {toolList}
Total monthly savings: ${totalMonthlySavings}
Top recommendation: {topRecommendation}

Cover: (1) the spending pattern, (2) the single biggest win with dollar amount, (3) one forward-looking suggestion.
```

---

## Why This Prompt Works

**Short structured context prevents hallucination.** Providing exact numbers (team size, savings amount) forces the model to anchor to real data rather than invent statistics.

**Format constraints ensure clean UI rendering.** The result card has a fixed 90-100 word text block. If we ask for bullet points, the layout breaks. If we ask for em dashes, the text looks like a style mismatch with the rest of the UI.

**The 3-part structure (pattern → win → forward look) makes every summary feel actionable**, not generic. Without this, the model tends toward vague "your AI spend is significant" summaries that add no value.

---

## What Didn't Work

**Longer prompts produced padded output.** An earlier version included instructions like "be empathetic" and "acknowledge their efforts to optimize." The output bloated to 150+ words and became useless.

**Asking for lists broke card layout.** A version that said "include a bulleted list of top 3 actions" worked great in the playground but completely broke the AISummary component's text-block design.

**Over-specifying tone made it robotic.** Saying "sound like a Bloomberg terminal" produced stilted, jargon-heavy output that testers found off-putting. The current system prompt ("crisp, specific, second-person") hits the right balance.

---

## Fallback Behavior

If the Anthropic API call fails for any reason (network error, rate limit, invalid response), the system falls back to a deterministic template:

```
Based on your AI tool usage across [N] tools with a [teamSize]-person team focused on [useCase],
we identified [count] optimization opportunities totaling $[X]/month.
Your biggest win is [top recommendation].
Review the full breakdown below for specific actions.
```

This fallback is never surfaced as an error to the user — the page renders identically. The only difference is the summary text is template-generated rather than AI-generated.
