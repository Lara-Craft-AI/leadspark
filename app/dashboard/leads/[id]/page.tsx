"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Lead, LeadStatus } from "@/lib/types";

type LeadResponse = {
  error?: string;
  lead?: Lead;
};

const statusOptions: LeadStatus[] = ["new", "contacted", "qualified", "closed"];

function scoreTone(score: number | null) {
  if (score === null) return "bg-slate-100 text-slate-600";
  if (score >= 8) return "bg-emerald-100 text-emerald-700";
  if (score >= 5) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState<LeadStatus>("new");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchLead = useCallback(async () => {
    const token = localStorage.getItem("leadspark_access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/leads/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = (await response.json()) as LeadResponse;
      if (!response.ok || !data.lead) {
        if (response.status === 401) {
          localStorage.removeItem("leadspark_access_token");
          router.push("/login");
          return;
        }

        setError(data.error || "Lead not found.");
        return;
      }

      setLead(data.lead);
      setStatus(data.lead.status);
      setNotes(data.lead.notes || "");
    } catch {
      setError("Unexpected error loading lead.");
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) {
      void fetchLead();
    }
  }, [fetchLead, params.id]);

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("leadspark_access_token");
    if (!token || !lead) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes })
      });

      const data = (await response.json()) as LeadResponse;
      if (!response.ok || !data.lead) {
        setError(data.error || "Failed to save changes.");
        return;
      }

      setLead(data.lead);
      setMessage("Lead updated successfully.");
    } catch {
      setError("Unexpected error while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-sm text-slate-600">Loading lead...</div>
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-red-600">{error || "Lead not found."}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="mb-2 inline-flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-slate-950">{lead.full_name}</h1>
            <p className="text-sm text-slate-600">{lead.email}</p>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${scoreTone(lead.qualification_score)}`}>
            Score: {lead.qualification_score ?? "N/A"}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-medium text-slate-900">Phone:</span> {lead.phone}
              </p>
              <p>
                <span className="font-medium text-slate-900">Insurance Type:</span> {lead.insurance_type}
              </p>
              <p>
                <span className="font-medium text-slate-900">Current Coverage:</span> {lead.current_coverage}
              </p>
              <p>
                <span className="font-medium text-slate-900">Timeline:</span> {lead.timeline}
              </p>
              <p>
                <span className="font-medium text-slate-900">ZIP:</span> {lead.zip_code}
              </p>
              <p>
                <span className="font-medium text-slate-900">Status:</span> <Badge className="ml-1 capitalize">{lead.status}</Badge>
              </p>
              <p>
                <span className="font-medium text-slate-900">Date:</span> {new Date(lead.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Qualification</CardTitle>
              <CardDescription>{lead.qualification_reason || "No qualification reason provided."}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{lead.ai_response || "No AI response recorded yet."}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSave}>
              <div className="max-w-xs space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add follow-up notes." />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
