# DEVLOG — SpendSight

## Day 1 — 2026-05-10
**Hours worked:** 6

**What I did:**
- Scaffolded Next.js 14 project with TypeScript, Tailwind, ESLint
- Installed all dependencies: Supabase, Resend, Anthropic SDK, Upstash, Zod, react-hook-form, framer-motion
- Created complete folder structure: app/, components/, lib/, types/, __tests__/
- Built `types/index.ts` with all shared interfaces (AITool, FormData, AuditResult, etc.)
- Built `lib/pricing-data.ts` — full pricing database for all 8 tools, all plans, with notes
- Built `lib/audit-engine.ts` — 5 hardcoded rules, fully deterministic, no AI
- Wrote 6 vitest tests in `__tests__/audit-engine.test.ts` — all pass
- Set up vitest.config.ts with path alias matching Next.js tsconfig
- Added `npm run test` to package.json
- Created `.github/workflows/ci.yml` for lint + test on push to main

**What I learned:**
Ordering matters in the audit engine — Rule 3 (cross-tool switch) must run before Rule 2 (cheaper same-vendor plan), or a `chatgpt-plus → cursor` switch never fires because Rule 2 doesn't find a cheaper ChatGPT plan first and exits early. Discovered this through test failures, fixed by reordering rules.

Also: Rule 2 must explicitly exclude free ($0) plans — "downgrade to Hobby" is never a valid recommendation since free plans always have meaningful restrictions. Added `pricePerSeatPerMonth === 0` guard.

**Blockers / what I'm stuck on:**
None — tests all green. Environment keys (Supabase, Upstash) not yet filled in; that's Day 2 work.

**Plan for tomorrow:**
Set up Supabase project + run schema SQL. Configure Upstash Redis. Build all API routes. Build UI components and landing page.

---

## Day 2 — 2026-05-11
**Hours worked:** 5

**What I did:**
- Created Supabase project, ran schema SQL (audits + leads tables, RLS policies)
- Set up Upstash Redis instance, configured `@upstash/ratelimit` with sliding window (10 req/hr/IP on audit route, 5 req/hr/IP on lead route)
- Built `/api/audit` route: Zod validation → honeypot check → rate limit → audit engine → Anthropic summary → Supabase INSERT → return result
- Built `/api/lead` route: rate limit → Supabase INSERT → Resend email send (best-effort)
- Built `lib/anthropic.ts` — `generateAuditSummary()` with graceful fallback to deterministic template
- Built `lib/resend.ts` — `sendAuditEmail()` with plain-text transactional email
- Wired up `.env.local` with all keys, confirmed API routes returning 200/201 locally via curl

**What I learned:**
Supabase RLS tripped me up. I enabled RLS on both tables (correct), but then my service-role key inserts were being blocked because I'd accidentally created the RLS policy for anon role, not service_role. The fix: `create policy "service_insert_leads" on leads for insert with check (true)` which allows service-role bypass. Took 45 minutes to debug via the Supabase Logs → Auth tab.

**Blockers / what I'm stuck on:**
Resend's free tier only allows sending from verified domains. Used `onboarding@resend.dev` as a temporary "from" address for local testing. Need to verify a real domain before launch.

**Plan for tomorrow:**
Build the full frontend: landing page, multi-step SpendForm, audit results page. Start with the design system (CSS variables, glassmorphism tokens).

---

## Day 3 — 2026-05-12
**Hours worked:** 7

**What I did:**
- Built the entire design system in `app/globals.css`: CSS custom properties for color tokens, glassmorphism utilities (`.glass-card`), animation easing variables, button classes (`.btn-primary`, `.btn-ghost`), input styles
- Built `SpendForm.tsx` — 3-step multi-step form with Framer Motion slide animations, localStorage persistence, react-hook-form + Zod validation
- Built `ToolRow.tsx` — per-tool form row with plan selector dynamically populated from `PRICING_DATA`
- Built landing page (`app/page.tsx`) — hero section, how-it-works, FAQ, tool logo grid
- Built the audit result page (`app/audit/[id]/page.tsx`) — SSR fetch from Supabase, `AuditHero`, `ToolBreakdown`, `AISummary`, `CredexCTA`, `ShareButton`
- Built `LeadCaptureModal.tsx` — post-value email gate with optional company name + role fields

**What I learned:**
Framer Motion's `AnimatePresence` with `mode="wait"` requires a unique `key` prop on each child — without it, the exit animation fires but the enter animation doesn't, making the form feel broken. Once I added `key="step1"` etc., the slide transition worked smoothly.

**Blockers / what I'm stuck on:**
The `SpendForm` was initially one giant component (~600 lines). React's reconciler was re-rendering everything on every keystroke, causing noticeable lag on slower devices. Splitting into `StepOne`, `StepTwo`, `StepThree` sub-components solved it.

**Plan for tomorrow:**
User research day — reach out to 3 founders/developers for quick 10-minute conversations. Meanwhile, polish UI: add tool brand logos to the form chips and results cards.

---

## Day 4 — 2026-05-13
**Hours worked:** 4

**What I did:**
- Conducted 3 user interviews (see USER_INTERVIEWS.md) — spoke with a developer at a seed-stage startup, a solo consultant who uses multiple AI tools, and a small agency CTO
- Added tool brand logos (`/public/logos/`) to form chips and result cards — improves tool recognition significantly
- Built `opengraph-image.tsx` for dynamic OG image generation on the audit result page
- Added `generateMetadata()` to the audit page for dynamic OG + Twitter card tags
- Built `ShareButton.tsx` — copies current URL to clipboard with a "Copied!" flash animation
- Added `CredexCTA.tsx` — conditionally rendered only when total savings > $500/mo

**What I learned:**
From user interviews: most people I talked to had no idea what they were paying per-seat. One developer said "I just see one line on the company card, I don't know if it's per-seat or flat." This confirmed the design decision to show per-seat math prominently in the tool breakdown — users need to see the unit economics, not just the total.

**Blockers / what I'm stuck on:**
Dynamic OG image generation using Next.js `opengraph-image.tsx` doesn't work well with complex styled components. Simplified to a plain green-on-black design that renders reliably in the `@vercel/og` runtime.

**Plan for tomorrow:**
Deployment day. Push to GitHub, connect to Vercel, verify all env vars, run a live end-to-end test. Write all remaining documentation (REFLECTION, ARCHITECTURE updates).

---

## Day 5 — 2026-05-14
**Hours worked:** 5

**What I did:**
- Deployed to Vercel. Set all 8 environment variables in Vercel dashboard
- Ran a live end-to-end test: submitted a form with 3 tools → got audit ID → verified Supabase row created → verified email sent via Resend dashboard → verified shared URL OG tags via `socialsharepreview.com`
- Fixed a production bug: `nanoid` import was ESM-only and broke the Next.js API route bundle in production. Fixed by pinning to `nanoid@5` (which supports both ESM and CJS) and updating the import path
- Ran Lighthouse on the live URL: Performance 91, Accessibility 94, Best Practices 95 ✓
- Added `NEXT_PUBLIC_APP_URL` to resolve the share link in production

**What I learned:**
Vercel's build environment is stricter about ESM than the local dev environment. The `nanoid` v5 issue was completely invisible locally but broke the production build silently — the error only appeared in Vercel Function logs, not the build output. Always check Function logs, not just build logs.

**Blockers / what I'm stuck on:**
The Anthropic API `claude-sonnet-4-20250514` model ID initially returned a 404 in production (model not yet available on my API tier). Temporarily fell back to `claude-3-5-sonnet-20241022` while waiting for access. The fallback template kicked in cleanly — no user-visible error.

**Plan for tomorrow:**
Complete all documentation files (REFLECTION.md, README screenshots). Final code review pass. Check git log for any accidental secret leaks.

---

## Day 6 — 2026-05-15
**Hours worked:** 4

**What I did:**
- Wrote `REFLECTION.md` — all 5 answers in full, based on the real experiences from this week
- Updated `README.md` with the live Vercel URL and real screenshots of landing page, form, and results
- Recorded a 30-second Loom walkthrough showing the end-to-end flow (linked in README)
- Re-read `PRICING_DATA.md` and spot-checked 3 vendor pages — Windsurf had updated their Teams plan slightly; corrected from $30 to $35/seat
- Reviewed `ECONOMICS.md` and `GTM.md` for word count and specificity — both well within 300–700 word range
- Verified `ci.yml` workflow passes on the latest commit (green check in GitHub Actions)

**What I learned:**
Pricing pages change frequently and silently. Windsurf's Teams plan price had changed since I first set it up. This is exactly why PRICING_DATA.md exists and why every number needs a verified date. For a real product, this data would need a weekly automated check against vendor pages.

**Blockers / what I'm stuck on:**
Screenshot sizing for README is tricky — GitHub scales images differently depending on the viewport. Used HTML `img` tags with `width="700"` attribute to control display size consistently.

**Plan for tomorrow:**
Final review. Read the entire submission spec one more time end-to-end. Submit.

---

## Day 7 — 2026-05-16
**Hours worked:** 2

**What I did:**
- Final read-through of all 12 required markdown files against the spec checklist
- Verified git log: commits across 5+ distinct calendar days ✓
- Ran `npm run test` one final time — 6 tests, all passing ✓
- Ran `npm run lint` — 0 errors ✓
- Checked Vercel deployment is live and responsive
- Submitted the Google Form with: public GitHub repo URL, live Vercel URL

**What I learned:**
Shipping something end-to-end in 7 days forces prioritization decisions that feel uncomfortable in the moment but are correct in retrospect. I didn't build PDF export or the embeddable widget — and that was right. The MVP is complete and polished. Bonus features on top of a broken MVP are worse than no bonus features.

**Blockers / what I'm stuck on:**
None. Submission complete.

**Plan for tomorrow:**
N/A — submitted. Wait for Round 2 notification within 3 working days.
