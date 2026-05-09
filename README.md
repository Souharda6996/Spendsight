# SpendSight

SpendSight is a free AI spend audit tool for startup engineering teams. Input your subscriptions, get an instant breakdown of overspend, and a shareable report.

---

## Screenshots

> **TODO before submission:** Replace placeholders with real screenshots.

| Landing Page | Audit Form | Results |
|---|---|---|
| ![Landing](public/screenshot-landing.png) | ![Form](public/screenshot-form.png) | ![Results](public/screenshot-results.png) |

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/yourusername/spendsight.git
cd spendsight
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in all keys (Supabase, Resend, Anthropic, Upstash)

# 3. Run Supabase SQL (in Supabase dashboard → SQL Editor)
# See ARCHITECTURE.md for schema

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

1. Push to a **public** GitHub repo
2. Connect repo at [vercel.com/new](https://vercel.com/new)
3. Add all env vars from `.env.local.example` in Vercel → Settings → Environment Variables
4. Set `NEXT_PUBLIC_APP_URL` to your live Vercel URL (e.g. `https://spendsight.vercel.app`)
5. Deploy

---

## 5 Key Architectural Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | **Supabase over Firebase** | Relational integrity for `leads.audit_id` FK. Firebase NoSQL would require denormalization and complicate analytics queries on savings amounts. |
| 2 | **Audit engine hardcoded, not AI** | Savings figures must be deterministic and auditable. A finance person can verify a hardcoded rule; they can't verify an LLM output. AI writes the *summary*, not the *math*. |
| 3 | **Email capture after results** | Post-value gates convert 3-5× better than pre-gate walls. Showing results first also creates the viral sharing loop — shared links work without any login. |
| 4 | **`nanoid(10)` over UUID** | URL-friendly, 10 chars, ~61 bits of collision resistance for this use case. UUIDs add unnecessary visual noise in shared links. |
| 5 | **Upstash Redis over Vercel KV** | More generous free tier (10k requests/day), and `@upstash/ratelimit` provides a clean sliding-window abstraction without boilerplate. |

---

## Running Tests

```bash
npm run test
# All 6 tests should pass
```

---

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Supabase · Resend · Anthropic API · Upstash Redis · Vercel
