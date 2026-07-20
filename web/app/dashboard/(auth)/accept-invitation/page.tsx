import { Suspense } from "react";
import AcceptInvitationContent from "./accept-invitation-content";
import { Spinner } from "@/components/ui/spinner";

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="mx-auto h-8 w-8" />
          <div>
            <h1 className="text-xl font-semibold">Loading...</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Please wait
            </p>
          </div>
        </div>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}
