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
**Hours worked:** (to be filled)  
**What I did:** (to be filled)  
**What I learned:** (to be filled)  
**Blockers / what I'm stuck on:** (to be filled)  
**Plan for tomorrow:** (to be filled)

---

## Day 3 — 2026-05-12
**Hours worked:** (to be filled)  
**What I did:** (to be filled)  
**What I learned:** (to be filled)  
**Blockers / what I'm stuck on:** (to be filled)  
**Plan for tomorrow:** (to be filled)

---

## Day 4 — 2026-05-13
**Hours worked:** (to be filled)  
**What I did:** (to be filled)  
**What I learned:** (to be filled)  
**Blockers / what I'm stuck on:** (to be filled)  
**Plan for tomorrow:** (to be filled)
