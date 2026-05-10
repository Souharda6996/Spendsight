# USER_INTERVIEWS.md — SpendSight

> Notes from three real conversations conducted via LinkedIn and WhatsApp, May 2026. Each conversation lasted 10–15 minutes.

---

## Interview 1

**Date:** 2026-05-10
**Interviewee:** Akaash A., college student (final year), uses AI tools for personal coding projects and academics
**Duration:** ~10 minutes
**Method:** WhatsApp text chat

**Their current AI tools:**
Claude Pro (paid, ~₹2,000/month), ChatGPT (free tier), Gemini (free tier)

**Did they know their monthly spend off the top of their head?**
Yes — immediately said "around 2k per month" for Claude Pro without hesitation. However, he doesn't count ChatGPT and Gemini because he uses them on free plans, so his mental model of his "AI spend" is only what he explicitly pays for, not total tool cost.

**Have they ever tried to optimize this?**
No deliberate optimization. He's on Claude Pro because he hit the free plan limits repeatedly, so he upgraded. He hasn't compared whether a different plan or tool would give him the same output for less money.

**What would make them use this tool?**
Conditional trust — said he'd use it "if it's really worth using the application." Needs to see real value before trusting the recommendation. A tool showing him savings numbers wouldn't be enough on its own — he'd want to verify it first.

**Most surprising thing they said:**
He hits the Claude Pro usage limit frequently ("a lot of time") even though he's on the paid plan. I expected free users to hit limits — not people paying ₹2,000/month for Pro. This means the audit engine needs to account for the opposite direction too: some users should be recommended to *upgrade* to Max, not downgrade.

**Direct quotes (3+ verbatim):**
> "I use Claude pro and spend around 2k per month"

> "I mainly use it for coding... making frontend mainly"

> "Yes i hit the limit in claude a lot of time it's frustrating"

> "Yaa but i will use it surely if it's really worth using the application"

**What it changed about your design:**
Two things. First, I realized the audit engine only ever recommends downgrades or switches — but Akaash represents users who are genuinely under-served by their current plan and should see an upgrade recommendation with justification ("you're hitting limits frequently — Max at $100/seat gives you 5× usage"). Second, his conditional trust answer confirmed the post-value email gate was the right decision. Asking for his email before showing results would have lost him immediately.

---

## Interview 2

**Date:** 2026-05-11
**Interviewee:** Sohan Saha, Quantitative Analyst (AI, Business Strategy & Financial Markets), B.Tech AI & Data Engineering — works at an early-stage company
**Duration:** ~12 minutes
**Method:** LinkedIn DM chat

**Their current AI tools:**
Gemini (company use, paid), Claude (company use, paid) — uses both actively with distinct roles for each

**Did they know their monthly spend off the top of their head?**
Did not give a specific number, but described the spending pattern clearly: it starts scattered across personal and company cards in early-stage teams, then finance or ops begins tracking it once subscriptions pile up. His framing suggested no one person has a clear single number — it's distributed.

**Have they ever tried to optimize this?**
No formal optimization. Described organic tool adoption as the norm: individuals try tools on their own first, and if something improves workflow, the team adopts it more formally. Spend tracking comes after adoption, not before — meaning waste accumulates before anyone notices.

**What would make them use this tool?**
Implied: if the savings number is significant and affects multiple users, leadership would want to see it. The tool's output needs to be forward-able to a CTO or ops lead — not just a personal insight but a report that justifies a budget decision.

**Most surprising thing they said:**
The most unexpected insight was the "bottom-up adoption, top-down spending" dynamic he described. I had assumed the person running an audit would also be the person who acts on it. Sohan made clear that at most startups, the person who discovers a tool is different from the person who controls the budget for it. This means SpendSight's share URL isn't just for viral growth — it's actually a workflow tool: the person who ran the audit forwards the link to their CTO or finance lead to get approval for a change.

**Direct quotes (verbatim from LinkedIn):**
> "For company-wide tools or paid plans, usually the CTO or founders take the final call because of security and cost. But for day-to-day AI tools, people often try things on their own first and if it actually improves workflow, then the team starts adopting it more formally."

> "Gemini is mostly useful for research, long-context work, and anything connected to Google ecosystem stuff. Claude is generally preferred for structured writing, coding discussions, documentation, and deeper reasoning tasks."

> "Usually AI spending starts off scattered across personal/company cards, especially in smaller teams. Over time finance or ops starts tracking it once subscriptions pile up. Most startups are still figuring out proper AI budget management because tools get adopted very quickly."

> "That would probably go to the CTO, ops lead, or whoever handles software subscriptions and budgeting. If the savings are significant and it affects multiple users, leadership would definitely want visibility on it."

**What it changed about my design:**
Sohan's answer about forwarding audit results changed how I think about the shareable URL feature. I'd designed it primarily as a viral loop — share your result, others discover the tool. But he surfaced a second use case: sharing the audit *internally* to get budget approval from the person who actually controls subscriptions. This is why the public audit URL deliberately strips personal details (email, company name) — it should be safe to forward to a CTO without exposing who ran it. I also updated the ShareButton copy to say "Share with your team" as a secondary label, not just "Share this audit."

---

## Interview 3

**Date:** 2026-05-11
**Interviewee:** Simran Das, AOCS Officer at IndiGo (Navi Mumbai), BBA Aviation Graduate & Content Creator — fresher, non-technical role
**Duration:** ~10 minutes
**Method:** LinkedIn DM chat

**Their current AI tools:**
Currently on free versions of ChatGPT, Gemini, and Claude. Has awareness of GitHub Copilot but doesn't use it actively. Not on any paid AI plan at present.

**Did they know their monthly spend off the top of their head?**
No exact number — because she's on free plans. However, she immediately estimated what a full paid stack would cost: "it could easily be around ₹5k–₹10k/month" for ChatGPT Plus + Gemini Advanced + Claude Pro + GitHub Copilot together. She understood the pricing landscape even without paying for it personally.

**Have they ever tried to optimize this?**
No optimization needed yet since she's on free tiers. Her subscriptions are personal, not company-billed — she said she wouldn't expense tools unless her company specifically requires or allows it.

**What would make them use this tool?**
Clear threshold: savings must be meaningful AND the switch must be low-effort. Said "saving ₹100–₹200 with a lot of effort, probably not worth it. But saving 15–20% monthly with no hassle would definitely get attention." The effort-to-savings ratio matters as much as the savings number itself.

**Most surprising thing they said:**
Simran is an aviation operations officer — not a developer, not a founder. She had no paid AI subscriptions at the time of the interview. I expected this to make the conversation less useful, but the opposite was true. She knew approximate pricing for all four tools without paying for any of them, and gave the sharpest answer of all three interviews on the switching threshold question. It revealed that the tool's "already optimal / spending well" state (shown when savings < ₹X) is not a failure state — it's actually valuable to non-technical users who want to benchmark their awareness against real pricing. The "notify me when new savings apply" email capture for low-savings users is the right design.

She also volunteered that she'd cut GitHub Copilot first because her role isn't coding-focused — validating that the audit engine's use-case matching logic (Rule 3: surfacing coding tools for coding teams, not for writing/ops roles) is the right approach.

**Direct quotes (verbatim from LinkedIn):**
> "Honestly, I don't know the exact combined monthly cost because I mostly use the free versions right now. But roughly, if someone uses ChatGPT Plus, Gemini Advanced, Claude Pro, and GitHub Copilot together, it could easily be around ₹5k–₹10k/month"

> "Since I'm just starting out, most tools would probably be personal subscriptions for learning and productivity. I don't think I'd formally expense them unless the company specifically allows it or requires a certain tool for work."

> "Probably GitHub Copilot, mainly because my role isn't heavily coding-focused. ChatGPT or Gemini feels more useful for daily tasks, learning, writing, and quick research."

> "Yes, if the savings are meaningful and the switch is simple. If it's just saving ₹100–₹200 with a lot of effort, probably not worth it. But saving 15–20% monthly with no hassle would definitely get attention."

**What it changed about my design:**
Two things. First, the effort-to-savings framing changed how I write recommendation reasons in the audit engine. The reason string now includes the word "switch" or "downgrade" with a one-step action — making the effort feel minimal. Second, Simran confirmed that non-technical, non-developer users are a real segment of the audience. The tool needs to work for someone who manages operations, not just CTOs. This is why the form uses plain labels ("Coding", "Writing", "Research") instead of technical descriptions — so anyone can understand and answer without a dev background.

---

## Patterns Across All 3 Interviews

Three people: a college developer paying for Claude Pro, a quantitative analyst using AI at a startup, and a non-technical aviation officer on free plans. Different backgrounds, but several things converged.

**What all three agreed on:**
Nobody had a clear, single number for their total AI spend. Akaash knew his Claude bill (₹2,000) but didn't count his free tools. Sohan described spend as "scattered across cards" at most startups. Simran estimated the market but wasn't paying herself. The consistent pattern: people track the tools they pay for, not the total cost of their AI stack. This is the core problem SpendSight solves — it forces users to see the full picture for the first time.

**What contradicted my assumptions:**
I built the tool expecting users to be motivated purely by saving money. Simran's answer changed that: the effort-to-savings ratio matters as much as the absolute number. A ₹500/month saving with a 30-minute migration isn't obviously worth it. A ₹200/month saving with a one-click plan change is. This means the recommendation copy needs to emphasize how easy the switch is, not just the savings number.

I also assumed the person running the audit would be the person who acts on it. Sohan directly contradicted this — at most startups, an individual discovers the insight and forwards it to the CTO or ops lead who controls the budget. The share URL isn't just a viral loop feature — it's an internal approval workflow.

**The most surprising overall finding:**
Akaash hits Claude Pro usage limits "a lot of time" despite paying ₹2,000/month. This was genuinely unexpected. I'd built the entire audit engine around recommending downgrades and switches — but a real user is hitting ceilings on a paid plan and might need an upgrade recommendation, not a downgrade. The tool currently has no logic for this. If I had more time, I'd add a "are you hitting limits frequently?" input field and surface Claude Max as an option for heavy users who are already on Pro.
