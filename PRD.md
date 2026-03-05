# PRD — LeadSpark

## What

**LeadSpark** — AI Speed-to-Lead for Insurance Agents.

When a new lead comes in (web form, email, or API), LeadSpark's AI responds in under 60 seconds. It qualifies the lead, collects key insurance info (DOB, address, current carrier, coverage needs), and books a call with the agent — all automatically.

**Tagline:** "Your AI responds before they hang up."

## Why

Insurance agents lose 78% of leads because they respond too slowly. The first agent to respond wins 50% of the time. Most agents take hours or days. LeadSpark makes them the fastest responder in their market — every single time.

## ICP (Ideal Customer Profile)

- **Independent insurance agents** and small agencies (1-10 people)
- Sell P&C (auto, home, commercial) or life/health
- Get 10-100+ leads/month from web forms, referrals, bought leads
- Currently respond manually (or not at all for off-hours leads)
- Already paying $200-500/mo for lead sources — speed-to-lead is their #1 conversion lever

## Core Feature (V1 — Ship Tonight)

**One feature only: Instant AI lead qualification & response.**

### Flow:
1. Agent signs up → gets a unique intake form URL (or embeddable widget)
2. Lead fills out the form on agent's website
3. LeadSpark AI responds via email within 60 seconds:
   - Personalized greeting using the agent's name/brand
   - Asks qualifying questions (coverage type, current policy, timeline)
   - Proposes available time slots to book a call
4. Agent gets instant Telegram/email notification with lead details + qualification score
5. Agent dashboard shows all leads, status, conversation history

### What the AI collects:
- Full name, email, phone
- Type of insurance needed (auto, home, life, commercial, other)
- Current coverage status (insured/uninsured, carrier name)
- Timeline (shopping now, renewing soon, just looking)
- ZIP code (for carrier availability)

### Agent Setup (onboarding):
- Agency name, agent name, phone, email
- Business hours + timezone
- Types of insurance offered
- Preferred calendar link (Calendly, Cal.com, etc.) for booking
- Custom greeting/brand voice (optional)

## Pricing

- **Free trial:** 10 leads (no credit card)
- **Starter:** $99/mo — up to 100 leads/mo
- **Pro:** $199/mo — unlimited leads + custom branding + priority support
- **Agency:** $399/mo — multi-agent, team dashboard, API access

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + shadcn/ui + Tailwind CSS
- **Backend:** Next.js API routes + Supabase (auth, database, realtime)
- **AI:** Claude API (via Anthropic SDK) for lead qualification responses
- **Email:** Resend (for sending AI responses to leads)
- **Hosting:** Vercel
- **Notifications:** Telegram bot (agent notifications)

## Design Guidelines

- **Light mode only** (clean, professional — insurance agents are conservative)
- **Minimalist** — no clutter, no gradients gone wild
- **Colors:** Deep blue primary (#1e40af), white background, subtle gray accents
- **Typography:** Inter or system font, clean and readable
- **Mobile-first** — agents check leads on their phone
- **Trust signals:** "Trusted by X agents", security badges, "HIPAA-aware" messaging
- **Hero section:** Live demo animation showing a lead form → instant AI response

## Pages

1. **Landing page** (`/`) — Hero with demo, features, pricing, testimonials, CTA
2. **Sign up** (`/signup`) — Simple onboarding form (name, email, agency, insurance types)
3. **Dashboard** (`/dashboard`) — Lead list with status, qualification score, conversation preview
4. **Lead detail** (`/dashboard/leads/[id]`) — Full conversation, lead info, actions
5. **Settings** (`/dashboard/settings`) — Agent profile, branding, calendar link, notifications
6. **Public intake form** (`/form/[agent-slug]`) — The lead-facing form agents embed on their site

## API Endpoints

- `POST /api/leads/intake` — Receives new lead from public form
- `POST /api/leads/qualify` — Triggers AI qualification (internal)
- `GET /api/leads` — List agent's leads (authenticated)
- `GET /api/leads/[id]` — Get lead detail (authenticated)
- `POST /api/auth/signup` — Agent registration
- `POST /api/auth/login` — Agent login
- `POST /api/webhooks/email` — Inbound email replies from leads (future)

## Success Metrics

- Lead response time < 60 seconds
- Agent signup → first lead processed < 5 minutes
- Form-to-notification pipeline works end-to-end
- Landing page converts at > 5% visitor-to-signup

## Out of Scope (V1)

- Phone/SMS integration
- CRM integrations (Salesforce, HubSpot)
- Multi-language support
- Advanced analytics
- White-label
- Inbound email parsing
- Calendar booking integration (just show the link for now)

## V1 Shipping Criteria

The product is "done" when:
1. Landing page is live and beautiful on Vercel
2. Agent can sign up and set up their profile
3. Agent gets a unique public intake form URL
4. Lead fills form → AI qualifies → agent notified via Telegram within 60 seconds
5. Agent can see all leads in dashboard with qualification details
6. Pricing page with clear tiers
7. Everything works on mobile
