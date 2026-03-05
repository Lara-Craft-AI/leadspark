"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type AgentInfo = {
  id: string;
  name: string;
  agency_name: string;
  insurance_types: string[];
  calendar_link: string | null;
  brand_voice: string | null;
  slug: string;
};

type AgentResponse = {
  error?: string;
  agent?: AgentInfo;
};

type IntakeResponse = {
  error?: string;
  lead?: {
    id: string;
  };
};

const insuranceTypes = ["Auto", "Home", "Life", "Commercial", "Health", "Other"];
const coverageTypes = ["Currently insured", "Previously insured", "Never insured"];
const timelineTypes = ["Shopping now", "Renewing in 1-3 months", "Renewing in 3-6 months", "Just looking"];

export default function PublicIntakeFormPage() {
  const params = useParams<{ slug: string }>();

  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [insuranceType, setInsuranceType] = useState("Auto");
  const [currentCoverage, setCurrentCoverage] = useState("Currently insured");
  const [timeline, setTimeline] = useState("Shopping now");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agents/${params.slug}`);
        const data = (await response.json()) as AgentResponse;

        if (!response.ok || !data.agent) {
          setError(data.error || "Agent not found.");
          return;
        }

        setAgent(data.agent);
        if (data.agent.insurance_types?.length) {
          setInsuranceType(data.agent.insurance_types[0]);
        }
      } catch {
        setError("Unable to load form.");
      } finally {
        setLoadingAgent(false);
      }
    };

    if (params.slug) {
      void fetchAgent();
    }
  }, [params.slug]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentSlug: params.slug,
          full_name: fullName,
          email,
          phone,
          insurance_type: insuranceType,
          current_coverage: currentCoverage,
          timeline,
          zip_code: zipCode
        })
      });

      const data = (await response.json()) as IntakeResponse;
      if (!response.ok) {
        setError(data.error || "Failed to submit form.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Unexpected error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAgent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-600">Loading form...</p>
      </main>
    );
  }

  if (!agent || error === "Agent not found.") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Form unavailable</CardTitle>
            <CardDescription>{error || "Agent not found."}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Thanks, you are all set.</CardTitle>
            <CardDescription>{agent.name} or a team member from {agent.agency_name} will contact you shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            {agent.calendar_link ? (
              <a
                href={agent.calendar_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Book a call now
              </a>
            ) : null}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 px-4 py-10 sm:px-6">
      <Card className="mx-auto w-full max-w-2xl border-blue-100">
        <CardHeader>
          <CardTitle>Get a quote from {agent.agency_name}</CardTitle>
          <CardDescription>
            Tell us what you need and we will follow up quickly. {agent.brand_voice ? `About us: ${agent.brand_voice}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} required minLength={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required minLength={7} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance_type">Insurance Type</Label>
                <Select id="insurance_type" value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)}>
                  {insuranceTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_coverage">Current Coverage</Label>
                <Select id="current_coverage" value={currentCoverage} onChange={(e) => setCurrentCoverage(e.target.value)}>
                  {coverageTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                  {timelineTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input id="zip_code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required minLength={3} />
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
