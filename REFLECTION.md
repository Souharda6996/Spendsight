# REFLECTION.md — SpendSight

---

## 1. The Hardest Bug I Hit This Week

The hardest bug was in the audit engine's rule ordering — and it was invisible until I wrote the tests.

My initial architecture had five rules evaluated in sequence: Rule 1 (wrong plan for team size), Rule 2 (cheaper same-vendor plan), Rule 3 (better alternative tool for use case), Rule 4 (credits opportunity), Rule 5 (optimal, no action). The order felt logical — check the most specific case first, then broaden out.

The bug: Test 5 (`ChatGPT Plus for a coding team → switch to Cursor`) was failing. The assertion was `expect(result.recommendation).toBe('switch')`, but the result was coming back as `'optimal'`. That made no sense — there's clearly a cheaper, better-fit tool for a coding team.

My first hypothesis was that the `alreadyHas()` check in Rule 3 was misfiring — maybe `chatgpt` was somehow appearing in its own `allTools` list and triggering the "user already has this tool" guard. I added a console.log to inspect the `allTools` array. It was correct — just `[{tool: 'chatgpt', ...}]`.

Second hypothesis: the `getBestFit('cursor')` function was returning `null` because no Cursor plan was cheaper than the ChatGPT Plus spend-per-seat ($20). I logged the output — it was finding Cursor Pro at $20/seat, which is `< spendPerSeat` only when spend-per-seat is exactly $20 and the comparison is strict `<`. The fix there was to use `<=` but that's not the real issue.

The real issue was that Rule 2 was running *before* Rule 3. For a user on ChatGPT Plus at $20/seat, Rule 2 looks for a cheaper ChatGPT plan — it finds none (Plus is already the cheapest paid plan), returns `null`, and falls through. But because Rule 3 was the fourth check and the earlier returns weren't firing, I assumed it was being reached. It was — but the `savings > 10` threshold wasn't being met because `$20 - $20 = $0`.

The actual fix: move Rule 3 before Rule 2. Cross-tool switches are higher value than same-vendor downgrades and should be evaluated first. Once I reordered, all 6 tests passed. The lesson: write tests before you write logic, or at minimum before you consider the logic "done."

---

## 2. A Decision I Reversed Mid-Week

I originally designed the lead capture as a **pre-audit gate**: enter your email, then see the audit. My reasoning was standard B2B lead-gen thinking — capture the lead at peak interest (when they're about to get something valuable).

I reversed this on Day 4 after two of my user interviews confirmed what I'd read but ignored: the users I spoke to had both abandoned similar tools at the email wall. One said, "If I can't see what it does first, I assume it's just gonna be generic advice I could Google." The other said he'd tried three "AI spend calculator" tools and all of them wanted his email before showing anything — so he stopped using all of them.

The reversal was uncomfortable because it meant I had to redesign the results page to carry the full weight of the lead capture, rather than using the form as a funnel gate. The email modal now sits below the results — visible only after the user has seen real numbers.

What changed my mind wasn't just the user feedback — it was thinking through the viral loop. The entire sharing mechanic (unique URL, OG tags) only works if the results page is publicly accessible without login. A pre-gate would make shared links useless — the recipient would just hit the same email wall and bounce. Post-value capture is the only architecture that enables the viral loop.

The outcome: I built `LeadCaptureModal` as a client-side component triggered by a button click, not a route guard. Email is completely optional. The user gets full value with or without submitting an email. Conversion happens through persuasion (the results are good enough to want a copy), not coercion.

---

## 3. What I Would Build in Week 2

If I had Week 2, I'd focus on three things in priority order.

**First: Benchmark Mode.** The single most common request from user interviews was comparison data. "Am I spending more or less than other teams my size?" is a more interesting question than "Am I on the right plan?" Right now I can answer the second but not the first. In Week 2 I'd build a benchmark dataset — even if it's seeded with reasonable industry estimates rather than real data — and show "Your AI spend per developer: $X. Companies your size average: $Y." This makes the audit shareable in a different way — people share benchmarks because they want their peers to see where they stand.

**Second: PDF Export.** Multiple users mentioned they'd want to share the audit internally — with their CFO, their board, or their team. A shareable URL is great for peers, but a PDF is what gets included in a Notion doc or emailed to finance. The implementation is straightforward with `@react-pdf/renderer` — render the same data as a styled PDF, serve it from an API route.

**Third: Weekly Digest Email.** The lead capture currently sends a one-time email. In Week 2 I'd build an opt-in for a monthly re-audit reminder — "Prices change. Your team size changes. Run your audit again." This turns a one-time tool into a recurring touchpoint with Credex's highest-intent users. The Supabase data is already there; it just needs a Resend scheduled campaign or a cron-triggered API route.

---

## 4. How I Used AI Tools

I used Claude (via the API and claude.ai) as my primary coding assistant throughout the week. Specifically: writing boilerplate (the Supabase schema SQL, the Resend email template, the CI workflow YAML), explaining error messages when I was stuck (the RLS policy issue, the `nanoid` ESM error in production), and generating the first draft of several markdown documents.

What I didn't trust AI with:
- **The audit engine logic.** The pricing rules, the recommendation thresholds, and the ordering of rules were all written by hand. An LLM cannot know whether Claude Team requires 5 seats minimum from memory — it might hallucinate a lower number, or use a price from 2023. I verified every rule against the vendor's live pricing page.
- **The pricing data itself.** I asked Claude to help me format the PRICING_DATA.md table, but I typed every number myself after checking the vendor page. This was correct — AI confidently gave me a wrong GitHub Copilot Enterprise price ($29, not $39) in an early draft.
- **The user interview analysis.** I took my own notes from those conversations. No AI involved.

The specific time AI was wrong: Early on, I asked Claude to generate the initial `PRICING_DATA.md` with all 8 tools. It returned ChatGPT Team at $25/seat — which is the *annual billing* price, not the monthly price ($30/seat). If I'd used that number, every Claude Team audit would have underestimated the user's actual spend by $5/seat/month, making the savings calculations wrong. I caught it because I crosschecked against `openai.com/chatgpt/pricing` directly. The lesson: AI is useful for formatting and structure, not for facts about the current world.

---

## 5. Self-Ratings

| Dimension | Rating | Honest Sentence |
|---|---|---|
| **Discipline** | 7/10 | I started immediately and worked consistently, but I cramped more hours into Days 1–3 than I'd like and the daily rhythm wasn't as even as the DEVLOG makes it look. |
| **Code quality** | 8/10 | TypeScript is strict, abstractions are sensible, the audit engine is deterministic and testable — but there's no error boundary on the results page and the form could benefit from more granular loading states. |
| **Design sense** | 8/10 | The glassmorphism dark theme is polished and the Framer Motion transitions feel premium — but I didn't do any formal usability testing and the mobile experience is functional but not exceptional. |
| **Problem-solving** | 9/10 | The rule-ordering bug, the Supabase RLS issue, and the production `nanoid` ESM failure were all solved through systematic hypothesis-testing rather than guessing; I'm proud of that process. |
| **Entrepreneurial thinking** | 7/10 | I thought carefully about the lead funnel, viral loop, and unit economics — but I should have done the user interviews on Day 1, not Day 4, because they would have changed my design decisions earlier in the week. |
