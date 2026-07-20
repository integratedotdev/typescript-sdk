"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { AuthMarketingShell } from "@/components/auth-marketing-shell";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/dashboard/reset-password`,
      });

      if (error) {
        toast.error(error.message || "Failed to send reset email");
        setLoading(false);
        return;
      }

      setEmailSent(true);
      toast.success("Password reset email sent!", {
        description: "Check your inbox for instructions to reset your password.",
        duration: 6000,
      });
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthMarketingShell
      title={emailSent ? "Check your email" : "Forgot password"}
      description={
        emailSent
          ? "We've sent reset instructions if that account exists."
          : "Enter your email and we'll send a reset link."
      }
    >
      {emailSent ? (
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Check spam if you don&apos;t see it. The link expires in 1 hour.
          </p>
          <Link href="/dashboard/login" className="text-link">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={loading}
              autoFocus
              autoComplete="email"
              className="h-10 rounded-none border-dashed"
            />
            <FieldDescription>
              We&apos;ll send a password reset link to this email.
            </FieldDescription>
          </Field>
          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-none font-medium"
          >
            {loading ? "Sending…" : "Send reset link"}
          </Button>
          <p className="text-sm text-muted-foreground">
            <Link href="/dashboard/login" className="text-link">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthMarketingShell>
  );
}
