"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  const router = useRouter();
  const inferredTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York", []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState(inferredTimezone);
  const [insuranceTypes, setInsuranceTypes] = useState<string[]>(["Auto"]);
  const [calendarLink, setCalendarLink] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [error, setError] = useState("");
  const [successSlug, setSuccessSlug] = useState("");
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
    setSuccessSlug("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
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

      if (data.user?.slug) {
        setSuccessSlug(data.user.slug);
      }

      router.prefetch("/login");
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Create your LeadSpark account</CardTitle>
          <CardDescription>Start your free trial with 10 leads.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency_name">Agency Name</Label>
                <Input id="agency_name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} minLength={2} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Insurance Types</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {insuranceOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={insuranceTypes.includes(option)}
                      onChange={() => toggleInsurance(option)}
                      className="accent-[#1e40af]"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendar_link">Calendar Link</Label>
              <Input
                id="calendar_link"
                type="url"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
                placeholder="https://calendly.com/your-link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_voice">Brand Voice</Label>
              <Textarea
                id="brand_voice"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="Example: Professional, concise, consultative tone with clear next steps."
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {successSlug ? (
              <p className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                Account created. Your intake form is available at <span className="font-semibold">/form/{successSlug}</span>.
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={loading} className="sm:min-w-40">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <Link href="/login" className="text-sm text-primary hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
