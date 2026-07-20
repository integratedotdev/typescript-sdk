"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { authClient, organization } from "@/lib/auth-client"
import { useState, useEffect, useCallback } from "react"
import { MailWarning } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [isFromInvitation, setIsFromInvitation] = useState(false)
  const [showVerificationReminder, setShowVerificationReminder] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [resendingVerification, setResendingVerification] = useState(false)
  
  useEffect(() => {
    const fromParam = searchParams.get("from")
    setIsFromInvitation(fromParam === "invitation")
  }, [searchParams])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    try {
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard/home",
        },
        {
          onError: (ctx) => {
            // Handle email verification required
            if (ctx.error.status === 403) {
              setShowVerificationReminder(true)
              setUnverifiedEmail(email)
              toast.error("Please verify your email address", {
                description: "Check your inbox for a verification link. Don't forget to check your spam folder.",
                duration: 6000,
              })
              setLoading(false)
              return
            }
            
            // Handle other errors
            const errorMessage = ctx.error.message || "Failed to sign in"
            if (errorMessage.toLowerCase().includes("invalid")) {
              toast.error("Invalid email or password", {
                description: "Please check your credentials and try again.",
              })
            } else {
              toast.error(errorMessage)
            }
            setLoading(false)
          },
          onSuccess: async () => {
            toast.success("Logged in successfully!")
            
            // Check for pending invitation
            const pendingInvitationId = localStorage.getItem("pendingInvitationId")
            
            if (pendingInvitationId) {
              try {
                // Accept the invitation
                const { error: inviteError } = await organization.acceptInvitation({
                  invitationId: pendingInvitationId,
                })
                
                // Clear the stored invitation ID
                localStorage.removeItem("pendingInvitationId")
                
                if (inviteError) {
                  console.error("Failed to accept invitation:", inviteError)
                  toast.error("Logged in, but failed to accept invitation. Please check your email for the invitation link.")
                } else {
                  toast.success("Successfully joined the organization!")
                }
              } catch (inviteErr) {
                console.error("Error accepting invitation:", inviteErr)
                toast.error("Logged in, but failed to accept invitation.")
              }
              
              // Users from invitations should go to dashboard
              router.push("/dashboard/home")
              router.refresh()
              return
            }
            
            // Proxy middleware will handle onboarding redirect if needed
            router.push("/dashboard/home")
            router.refresh()
          },
        }
      )

      if (error) {
        setLoading(false)
      }
    } catch {
      toast.error("An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    try {
      // Proxy middleware will handle onboarding redirect if needed
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard/home",
      })
    } catch {
      toast.error("Failed to login with GitHub")
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return
    
    setResendingVerification(true)
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: unverifiedEmail,
        callbackURL: "/dashboard/home",
      })

      if (error) {
        throw new Error(error.message || "Failed to resend verification email")
      }

      toast.success("Verification email sent!", {
        description: "Please check your inbox and spam folder.",
        duration: 6000,
      })
    } catch (error) {
      console.error("Resend verification error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to resend verification email")
    } finally {
      setResendingVerification(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {isFromInvitation ? "Join your team" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance max-w-[280px]">
            {isFromInvitation
              ? "Sign in to accept your invitation"
              : "Sign in to your account to continue"
            }
          </p>
        </div>
        
        {showVerificationReminder ? (
          <Alert variant="destructive" className="text-left">
            <MailWarning className="size-4" />
            <AlertTitle>Email Verification Required</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                Please verify your email address before signing in. Check your inbox for the verification link.
                If you didn&apos;t receive it, check your spam folder.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="mt-2"
              >
                {resendingVerification ? "Sending..." : "Resend Verification Email"}
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}
        
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="name@example.com" 
            required 
            disabled={loading}
            autoComplete="email"
            className="h-10"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/dashboard/forgot-password"
              className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <Input 
            id="password" 
            name="password"
            type="password" 
            required 
            disabled={loading}
            autoComplete="current-password"
            className="h-10"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="h-10 w-full font-medium">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={handleGitHubLogin} className="h-10 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
              <title>GitHub</title>
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Continue with GitHub
          </Button>
          <FieldDescription className="text-center text-xs pt-2">
            Don&apos;t have an account?{" "}
            <a href={isFromInvitation ? "/dashboard/signup?from=invitation" : "/dashboard/signup"} className="text-foreground hover:underline underline-offset-4 font-medium">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
