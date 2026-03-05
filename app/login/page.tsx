"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginResponse = {
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  };
  user?: {
    id: string;
    email?: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = (await response.json()) as LoginResponse;
      if (!response.ok || !data.session?.access_token) {
        setError(data.error || "Invalid credentials");
        return;
      }

      localStorage.setItem("leadspark_access_token", data.session.access_token);
      localStorage.setItem("leadspark_refresh_token", data.session.refresh_token);
      localStorage.setItem("leadspark_expires_at", String(data.session.expires_at || ""));
      localStorage.setItem("leadspark_user", JSON.stringify(data.user || {}));

      router.push("/dashboard");
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Agent Login</CardTitle>
          <CardDescription>Access your LeadSpark dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-sm text-slate-600">
              Need an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Start free
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
