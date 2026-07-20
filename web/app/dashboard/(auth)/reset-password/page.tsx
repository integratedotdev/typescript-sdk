"use client";

import { useState, useEffect, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { AuthMarketingShell } from "@/components/auth-marketing-shell";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam === "INVALID_TOKEN") {
      setError(
        "This password reset link is invalid or has expired. Please request a new one.",
      );
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("No reset token provided. Please use the link from your email.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("No reset token found");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (resetError) {
        if (
          resetError.message?.toLowerCase().includes("token") ||
          resetError.message?.toLowerCase().includes("expired")
        ) {
          setError(
            "This password reset link has expired or is invalid. Please request a new one.",
          );
        } else {
          toast.error(resetError.message || "Failed to reset password");
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Password reset successfully!", {
        description: "You can now sign in with your new password.",
      });

      setTimeout(() => {
        router.push("/dashboard/login");
      }, 3000);
    } catch {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const title = success
    ? "Password updated"
    : error
      ? "Link expired"
      : "Set new password";
  const description = success
    ? "Your password has been successfully reset."
    : error
      ? "This reset link is no longer valid."
      : "Enter your new password below.";

  return (
    <AuthMarketingShell title={title} description={description}>
      {error ? (
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">{error}</p>
          <Link href="/dashboard/forgot-password" className="text-link">
            Request new reset link
          </Link>
        </div>
      ) : success ? (
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Redirecting you to sign in…
          </p>
          <Link href="/dashboard/login" className="text-link">
            Go to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              disabled={loading}
              autoFocus
              autoComplete="new-password"
              className="h-10 rounded-none border-dashed"
            />
            <FieldDescription>Must be at least 8 characters.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              minLength={8}
              disabled={loading}
              autoComplete="new-password"
              className="h-10 rounded-none border-dashed"
            />
          </Field>
          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-none font-medium"
          >
            {loading ? "Resetting…" : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthMarketingShell title="Set new password">
          <div className="text-sm text-muted-foreground">Loading…</div>
        </AuthMarketingShell>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
