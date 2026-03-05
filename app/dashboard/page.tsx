"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/lib/types";

type LeadsResponse = {
  error?: string;
  leads?: Lead[];
};

function scoreTone(score: number | null) {
  if (score === null) return "bg-slate-100 text-slate-600";
  if (score >= 8) return "bg-emerald-100 text-emerald-700";
  if (score >= 5) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const qualified = leads.filter((lead) => lead.status === "qualified").length;
    const contacted = leads.filter((lead) => lead.status === "contacted").length;
    const avgScore = leads.length
      ? Math.round((leads.reduce((acc, lead) => acc + (lead.qualification_score || 0), 0) / leads.length) * 10) / 10
      : 0;

    return {
      total: leads.length,
      qualified,
      contacted,
      avgScore
    };
  }, [leads]);

  const fetchLeads = useCallback(async () => {
    const token = localStorage.getItem("leadspark_access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = (await response.json()) as LeadsResponse;
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("leadspark_access_token");
          router.push("/login");
          return;
        }
        setError(data.error || "Failed to load leads.");
        return;
      }

      setLeads(data.leads || []);
    } catch {
      setError("Unexpected error loading leads.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
            <p className="text-sm text-slate-600">Monitor lead flow and qualification performance.</p>
          </div>
          <Button variant="outline" onClick={() => void fetchLeads()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total Leads</CardDescription>
              <CardTitle>{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Qualified</CardDescription>
              <CardTitle>{stats.qualified}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Contacted</CardDescription>
              <CardTitle>{stats.contacted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Avg Score</CardDescription>
              <CardTitle>{stats.avgScore}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

            {loading ? (
              <p className="text-sm text-slate-500">Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-slate-500">No leads yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Insurance Type</th>
                      <th className="px-3 py-2 font-medium">Score</th>
                      <th className="px-3 py-2 font-medium">Timeline</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border/70">
                        <td className="px-3 py-3 font-medium text-slate-900">
                          <Link href={`/dashboard/leads/${lead.id}`} className="text-primary hover:underline">
                            {lead.full_name}
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{lead.insurance_type}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${scoreTone(lead.qualification_score)}`}>
                            {lead.qualification_score ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{lead.timeline}</td>
                        <td className="px-3 py-3">
                          <Badge className="capitalize">{lead.status}</Badge>
                        </td>
                        <td className="px-3 py-3 text-slate-700">{new Date(lead.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
