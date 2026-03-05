"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const insuranceOptions = ["Auto", "Home", "Life", "Commercial", "Health", "Other"];

type SignupResponse = {
  error?: string;
  user?: {
    id: string;
    email?: string;
    slug: string;
  };
};

export default function SignupPage() {
  const inferredTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York", []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone] = useState(inferredTimezone);
  const [insuranceTypes, setInsuranceTypes] = useState<string[]>(["Auto"]);
  const [calendarLink, setCalendarLink] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInsurance = (line: string) => {
    setInsuranceTypes((prev) => {
      if (prev.includes(line)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== line);
      }
      return [...prev, line];
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          agencyName,
          phone,
          timezone,
          insuranceTypes,
          calendarLink,
          brandVoice
        })
      });

      const data = (await response.json()) as SignupResponse;
      if (!response.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }

      setSuccess(true);
      if (data.user?.slug) setSlug(data.user.slug);
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white px-4 py-10 sm:px-6 lg:py-14">
        <Card className="mx-auto w-full max-w-xl border-green-200 bg-green-50/30">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center text-2xl">You&apos;re in!</CardTitle>
            <CardDescription className="text-center text-base">
              We&apos;re setting up your LeadSpark AI right now. You&apos;ll receive your personalized intake form link within a few hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">What happens next:</p>
              <ol className="mt-2 space-y-1 text-left text-sm text-blue-700">
                <li>1. We configure your AI with your brand voice and insurance types</li>
                <li>2. You get a unique form link to embed on your website</li>
                <li>3. Every lead that fills it out gets a response in under 60 seconds</li>
              </ol>
            </div>
            {slug && (
              <p className="text-sm text-slate-500">
                Your form will be at: <span className="font-mono font-medium text-slate-700">/form/{slug}</span>
              </p>
            )}
            <Link href="/">
              <Button variant="outline" className="mt-4">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to LeadSpark
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white px-4 py-10 sm:px-6 lg:py-14">
      {/* Nav */}
      <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold text-slate-950">LeadSpark</span>
        </Link>
        <Link href="/login" className="text-sm text-slate-600 hover:text-primary hover:underline">
          Already have an account?
        </Link>
      </div>

      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Start your free trial</CardTitle>
          <CardDescription>10 free leads. No credit card. Cancel anytime.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" minLength={2} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency_name">Agency Name</Label>
                <Input id="agency_name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Smith Insurance Group" minLength={2} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@smithinsurance.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Insurance Types You Write</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {insuranceOptions.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={insuranceTypes.includes(option)}
                      onChange={() => toggleInsurance(option)}
                      className="accent-blue-600"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendar_link">Calendar Link <span className="text-slate-400">(optional)</span></Label>
              <Input
                id="calendar_link"
                type="url"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
                placeholder="https://calendly.com/your-link"
              />
              <p className="text-xs text-slate-400">We&apos;ll include this in AI responses so leads can book calls with you directly.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_voice">How should your AI sound? <span className="text-slate-400">(optional)</span></Label>
              <Textarea
                id="brand_voice"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="Example: Friendly and professional. We're a family-owned agency that's been serving our community for 20 years."
                rows={3}
              />
            </div>

            <input type="hidden" value={timezone} />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" disabled={loading} size="lg" className="w-full gap-2 text-base sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-slate-400">
              By signing up, you agree to our Terms of Service. Your first 10 leads are free.
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
