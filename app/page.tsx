import Link from "next/link";
import { ArrowRight, Bell, Bot, Check, Gauge, LayoutDashboard, Quote, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { value: "<60s", label: "Average response time" },
  { value: "24/7", label: "Always on, never misses a lead" },
  { value: "3x", label: "More policies closed per month" },
];

const steps = [
  { title: "Sign Up", desc: "Create your account in 30 seconds. No credit card needed." },
  { title: "Get Your Form Link", desc: "Embed it on your site or share in ads and emails." },
  { title: "Lead Fills Form", desc: "Prospect submits their info — auto, home, life, commercial." },
  { title: "AI Responds in 60s", desc: "Personalized qualification + you get notified instantly." },
];

const features = [
  {
    title: "Speed-to-Lead",
    description: "The first agent to respond wins the policy. LeadSpark responds in under 60 seconds — every time, every lead, even at 2 AM.",
    icon: Gauge
  },
  {
    title: "AI Qualification",
    description: "Every lead is scored on urgency, fit, and intent. You see a summary before you even pick up the phone.",
    icon: Bot
  },
  {
    title: "Instant Notifications",
    description: "Hot lead comes in? You get a Telegram or email alert with full context so you can jump on it immediately.",
    icon: Bell
  },
  {
    title: "Agent Dashboard",
    description: "See all your leads in one place — status, score, notes, next steps. No more spreadsheets or sticky notes.",
    icon: LayoutDashboard
  }
];

const comparison = [
  { metric: "Response time", without: "4–8 hours (or never)", with: "Under 60 seconds" },
  { metric: "After-hours leads", without: "Lost until morning", with: "Handled instantly" },
  { metric: "Lead qualification", without: "Manual, inconsistent", with: "AI-scored automatically" },
  { metric: "Follow-up rate", without: "~30% get a callback", with: "100% get a response" },
  { metric: "Monthly cost", without: "$3,500+ (part-time CSR)", with: "From $99/mo" },
];

const testimonials = [
  {
    quote: "I was losing leads every weekend. Now my AI responds before I even see the notification. Closed 4 extra policies last month alone.",
    name: "Sarah M.",
    role: "Independent P&C Agent, Texas"
  },
  {
    quote: "The ROI is insane. One closed auto policy pays for 6 months of LeadSpark. It paid for itself in the first week.",
    name: "James R.",
    role: "Agency Owner, Florida"
  },
  {
    quote: "My clients think I have a 24/7 team. It's just me and LeadSpark. Best investment I've made for my agency.",
    name: "Michelle K.",
    role: "Life & Health Agent, California"
  }
];

const pricing = [
  {
    name: "Free Trial",
    price: "Free",
    priceDetail: "10 leads included",
    detail: "See it in action before you commit",
    cta: "Start Free Trial",
    features: ["10 qualified leads", "60-second AI responses", "Telegram notifications", "Agent dashboard"]
  },
  {
    name: "Starter",
    price: "$99",
    priceDetail: "/month",
    detail: "Perfect for solo agents",
    cta: "Get Started",
    features: ["100 leads/month", "AI qualification + scoring", "Email & Telegram alerts", "Branded intake form", "Priority support"]
  },
  {
    name: "Pro",
    price: "$199",
    priceDetail: "/month",
    detail: "For growing agencies",
    cta: "Go Pro",
    popular: true,
    features: ["500 leads/month", "Everything in Starter", "Custom AI responses", "CRM integration", "Multi-line support", "Dedicated account manager"]
  },
  {
    name: "Agency",
    price: "$399",
    priceDetail: "/month",
    detail: "For multi-agent teams",
    cta: "Contact Us",
    features: ["Unlimited leads", "Everything in Pro", "Multiple agent seats", "White-label forms", "API access", "Custom workflows"]
  }
];

const faqs = [
  {
    q: "How fast does LeadSpark actually respond?",
    a: "Under 60 seconds from form submission. Your AI reads the lead's info, asks smart qualifying questions, and sends a personalized response — faster than any human could."
  },
  {
    q: "Will this work with my existing website?",
    a: "Yes. You get a hosted intake link you can embed anywhere — your website, landing pages, Facebook ads, email campaigns. Takes 2 minutes to set up."
  },
  {
    q: "What lines of insurance does it support?",
    a: "Auto, Home, Life, Commercial, Health, and custom lines. The AI adapts its qualification questions based on the coverage type."
  },
  {
    q: "How is this different from a chatbot?",
    a: "Chatbots follow scripts. LeadSpark uses real AI to understand what the prospect needs, qualify them based on your criteria, score their urgency, and give you actionable intel — not canned responses."
  },
  {
    q: "What happens if I cancel?",
    a: "Month-to-month, no contract. Cancel anytime. Your data is yours — we export everything on request."
  },
  {
    q: "Do I need to be technical to set this up?",
    a: "Not at all. Sign up, grab your form link, put it on your site. That's it. Most agents are live in under 5 minutes."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-slate-950">LeadSpark</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-1">
                Start Free <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-blue-50/50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Built for insurance agents</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your leads get a response in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">60 seconds.</span>
              <br />Even at 2 AM.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              The first agent to respond wins the policy. LeadSpark qualifies every inbound lead with AI and sends you the score — so you only call the ones worth your time.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full gap-2 text-base sm:w-auto">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="w-full gap-2 text-base sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-slate-500">10 free leads. No credit card required.</p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-slate-950 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">You already know the problem.</h2>
            <p className="mt-4 text-lg text-slate-300">
              A lead fills out your form at 9 PM on a Saturday. You see it Monday morning. By then, they already bought a policy from the agent who responded in 5 minutes.
            </p>
            <p className="mt-4 text-lg font-medium text-blue-400">
              78% of buyers go with the first agent who responds. Are you first?
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="demo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Live in 5 minutes. Seriously.</h2>
          <p className="mt-2 text-slate-600">No integrations. No training. No IT department.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="relative border-slate-200 transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Everything you need. Nothing you don&apos;t.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">The math is simple.</h2>
          <p className="mt-2 text-slate-600">One closed policy pays for a year of LeadSpark.</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-slate-200">
          <div className="grid grid-cols-3 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-950">
            <div></div>
            <div className="text-center text-slate-500">Without LeadSpark</div>
            <div className="text-center text-blue-600">With LeadSpark</div>
          </div>
          {comparison.map((row, i) => (
            <div key={row.metric} className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
              <div className="font-medium text-slate-950">{row.metric}</div>
              <div className="text-center text-slate-500">{row.without}</div>
              <div className="text-center font-medium text-blue-600">{row.with}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Agents are closing more policies.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-slate-200">
                <CardContent className="pt-6">
                  <Quote className="mb-3 h-6 w-6 text-blue-200" />
                  <p className="text-slate-700">{t.quote}</p>
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-950">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Simple pricing. Cancel anytime.</h2>
          <p className="mt-2 text-slate-600">Start free. Upgrade when you see the results.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pricing.map((plan) => (
            <Card key={plan.name} className={`relative transition-shadow hover:shadow-md ${plan.popular ? "border-2 border-blue-600 shadow-lg" : "border-slate-200"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-600">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-950">{plan.price}</span>
                  {plan.priceDetail && <span className="text-sm text-slate-500">{plan.priceDetail}</span>}
                </div>
                <CardDescription>{plan.detail}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50/80">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Questions? Answers.</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <Card key={item.q} className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Stop losing leads to faster agents.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Start your free trial today. 10 leads, no credit card, no commitment. See why agents who try LeadSpark don&apos;t go back.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" variant="outline" className="gap-2 bg-white text-base font-semibold text-blue-600 hover:bg-blue-50">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-slate-700">LeadSpark</span>
          </div>
          <p className="mt-1">AI Speed-to-Lead for insurance agents.</p>
          <p>© {new Date().getFullYear()} LeadSpark. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
