import { LoginForm } from "@/components/login-form";
import { AuthMarketingShell } from "@/components/auth-marketing-shell";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthMarketingShell
      title="Sign in"
      description="Access your integrate dashboard."
    >
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Loading…</div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthMarketingShell>
  );
}
