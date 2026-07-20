"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, organization } from "@/lib/auth-client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [isAccepting, setIsAccepting] = useState(false);
  const invitationId = searchParams.get("invitationId");

  useEffect(() => {
    const handleInvitation = async () => {
      // Validate invitation ID
      if (!invitationId) {
        toast.error("Invalid invitation link");
        router.push("/dashboard/login");
        return;
      }

      // If session is still loading, wait
      if (isPending) {
        return;
      }

      // If user is logged in, accept invitation immediately
      if (session?.user) {
        setIsAccepting(true);
        try {
          const { error } = await organization.acceptInvitation({
            invitationId,
          });

          if (error) {
            console.error("Failed to accept invitation:", error);
            const errorMessage = error.message || "Failed to accept invitation";
            
            // Check for specific error types
            if (errorMessage.toLowerCase().includes("expired")) {
              toast.error("This invitation has expired");
            } else if (errorMessage.toLowerCase().includes("not found") || errorMessage.toLowerCase().includes("invalid")) {
              toast.error("Invalid invitation link");
            } else if (errorMessage.toLowerCase().includes("already accepted") || errorMessage.toLowerCase().includes("already a member")) {
              toast.info("You're already a member of this organization");
            } else {
              toast.error(errorMessage);
            }
            
            router.push("/dashboard/home");
          } else {
            toast.success("Successfully joined the organization!");
            router.push("/dashboard/home");
          }
        } catch (error) {
          console.error("Error accepting invitation:", error);
          toast.error("An unexpected error occurred");
          router.push("/dashboard/home");
        }
        return;
      }

      // User is not logged in - store invitation ID and redirect to signup
      localStorage.setItem("pendingInvitationId", invitationId);
      router.push("/dashboard/signup?from=invitation");
    };

    handleInvitation();
  }, [invitationId, session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner className="mx-auto h-8 w-8" />
        <div>
          <h1 className="text-xl font-semibold">
            {isAccepting ? "Accepting invitation..." : "Processing invitation..."}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Please wait while we process your invitation
          </p>
        </div>
      </div>
    </div>
  );
}

