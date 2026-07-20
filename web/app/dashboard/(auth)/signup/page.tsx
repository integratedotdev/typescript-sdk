import { SignupForm } from "@/components/signup-form";
import { AuthMarketingShell } from "@/components/auth-marketing-shell";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <AuthMarketingShell
      title="Get started"
      description="Create an account to manage keys, usage, and orgs."
    >
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading…</div>
        }
      >
        <SignupForm />
      </Suspense>
    </AuthMarketingShell>
  );
}
