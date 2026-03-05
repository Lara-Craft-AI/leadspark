import Link from "next/link";
import { ArrowRight, Bell, Bot, Gauge, LayoutDashboard, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Sign Up",
  "Get Form Link",
  "Lead Fills Form",
  "AI Responds in 60s"
];

const features = [
  {
    title: "Speed-to-Lead",
    description: "Every lead gets a personalized first response in under 60 seconds.",
    icon: Gauge
  },
  {
    title: "AI Qualification",
    description: "Leads are scored and summarized before your team starts outreach.",
    icon: Bot
  },
  {
    title: "Instant Notifications",
    description: "New leads hit your inbox immediately with urgency and fit context.",
    icon: Bell
  },
  {
    title: "Dashboard",
    description: "Track lead status, qualification reason, notes, and next actions in one place.",
    icon: LayoutDashboard
  }
];

const pricing = [
  {
    name: "Free Trial",
    price: "10 leads",
    detail: "No credit card required",
    cta: "Start Free"
  },
  {
    name: "Starter",
    price: "$99/mo",
    detail: "Great for solo agents",
    cta: "Choose Starter"
  },
  {
    name: "Pro",
    price: "$199/mo",
    detail: "For growing agencies",
    cta: "Choose Pro"
  },
  {
    name: "Agency",
    price: "$399/mo",
    detail: "Multi-agent teams",
    cta: "Choose Agency"
  }
];

const faqs = [
  {
    q: "How fast is the first response?",
    a: "LeadSpark is built to deliver the initial AI response in about 60 seconds after form submission."
  },
  {
    q: "Can I use this with my existing website?",
    a: "Yes. You can use your hosted intake link or embed the form flow into campaign pages."
  },
  {
    q: "What lines of insurance are supported?",
    a: "Auto, Home, Life, Commercial, Health, and Other are supported out of the box."
  },
  {
    q: "Do I get notified right away?",
    a: "Yes. LeadSpark sends immediate lead notifications with score and qualification context."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-border bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-blue-100 text-blue-800">Built for insurance agents</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Your AI responds before they hang up.
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              LeadSpark captures every inbound prospect and delivers a qualified AI response within 60 seconds so your agency can close
              more policies with less manual follow-up.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Agent Login
                </Button>
              </Link>
            </div>
          </div>
          <Card className="w-full border-blue-100 lg:max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Why teams switch to LeadSpark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Respond to every lead in under one minute.</li>
                <li>See qualification score and urgency at first glance.</li>
                <li>Keep your pipeline organized by lead status.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">How It Works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step}>
              <CardHeader>
                <Badge className="w-fit">Step {index + 1}</Badge>
                <CardTitle className="text-base">{step}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Features</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Pricing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pricing.map((plan) => (
            <Card key={plan.name} className={plan.name === "Pro" ? "border-primary" : undefined}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-semibold text-slate-950">{plan.price}</p>
                <CardDescription>{plan.detail}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/signup">
                  <Button variant={plan.name === "Pro" ? "default" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-50/80">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((item) => (
              <Card key={item.q}>
                <CardHeader>
                  <CardTitle className="text-base">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.a}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>LeadSpark</p>
          <p>AI Speed-to-Lead SaaS for insurance agents.</p>
          <p>© {new Date().getFullYear()} LeadSpark. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
