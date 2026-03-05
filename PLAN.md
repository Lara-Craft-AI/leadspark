# PLAN.md — LeadSpark Build Plan

## Phase 1: Project Setup & Landing Page
- [ ] Initialize Next.js 14 (App Router) with TypeScript
- [ ] Install and configure shadcn/ui + Tailwind CSS
- [ ] Set up project structure (app/, components/, lib/)
- [ ] Build landing page with:
  - [ ] Hero section with tagline + CTA ("Start Free — 10 Leads on Us")
  - [ ] "How It Works" — 3-step visual (Lead fills form → AI responds in 60s → Agent gets notified)
  - [ ] Features section (Speed, Qualification, 24/7, Mobile notifications)
  - [ ] Pricing table (Free trial, Starter $99, Pro $199, Agency $399)
  - [ ] Social proof / trust section ("Built for insurance agents")
  - [ ] FAQ section
  - [ ] Footer with links
- [ ] Mobile-responsive throughout
- [ ] Light mode, minimalist, deep blue (#1e40af) primary

## Phase 2: Auth & Database
- [ ] Set up Supabase project connection (env vars)
- [ ] Create database schema:
  - agents (id, email, name, agency_name, phone, timezone, insurance_types, calendar_link, brand_voice, slug, created_at)
  - leads (id, agent_id, full_name, email, phone, insurance_type, current_coverage, timeline, zip_code, qualification_score, status, ai_response, created_at)
- [ ] Implement auth pages (signup, login) with Supabase Auth
- [ ] Agent onboarding flow (collect agency info, insurance types, calendar link)
- [ ] Generate unique slug for each agent's intake form

## Phase 3: Public Lead Intake Form
- [ ] Build public form page at `/form/[agent-slug]`
- [ ] Form fields: name, email, phone, insurance type, current coverage, timeline, ZIP
- [ ] Branded with agent's agency name
- [ ] On submit → POST to `/api/leads/intake`
- [ ] Show confirmation message to lead
- [ ] Mobile-optimized, fast-loading

## Phase 4: AI Qualification Engine
- [ ] Build `/api/leads/intake` endpoint:
  - Save lead to Supabase
  - Call Claude API to generate personalized qualification response
  - Send AI response via email to lead (using Resend)
  - Send Telegram notification to agent with lead summary + qualification score
- [ ] AI prompt engineering:
  - Use agent's brand voice and name
  - Ask smart follow-up questions based on insurance type
  - Assign qualification score (1-10) based on timeline, coverage status, completeness
  - Include agent's calendar link for booking
- [ ] Response time target: < 60 seconds end-to-end

## Phase 5: Agent Dashboard
- [ ] Build dashboard layout (sidebar nav, header with agent name)
- [ ] Leads list view:
  - Table/cards showing: lead name, insurance type, score, status, time received
  - Filter by status (new, contacted, qualified, closed)
  - Sort by date, score
- [ ] Lead detail view:
  - Full lead information
  - AI qualification response sent
  - Qualification score with explanation
  - Quick actions (mark as contacted, add notes)
- [ ] Settings page:
  - Edit agent profile (name, agency, phone)
  - Update calendar link
  - View/copy intake form URL
  - Telegram notification setup
- [ ] Mobile-responsive dashboard

## Phase 6: Polish & Deploy
- [ ] Test full flow end-to-end (signup → form → AI response → notification → dashboard)
- [ ] Error handling on all API routes
- [ ] Loading states and skeleton UI
- [ ] SEO meta tags (title, description, OG image)
- [ ] Deploy to Vercel with environment variables
- [ ] Verify production deployment works
- [ ] Final visual polish pass

## Completion Criteria
All boxes checked = ship it. Every phase must be verified working in production.
