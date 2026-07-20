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
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { authClient, organization } from "@/lib/auth-client"
import { useState, useEffect } from "react"
import Link from "next/link"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [isFromInvitation, setIsFromInvitation] = useState(false)
  
  useEffect(() => {
    // Check if user is coming from an invitation
    const fromParam = searchParams.get("from")
    setIsFromInvitation(fromParam === "invitation")
  }, [searchParams])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      setLoading(false)
      return
    }
    
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard/onboarding",
      })
      
      if (error) {
        // Check for specific error messages
        const errorMessage = error.message || ""
        const errorString = JSON.stringify(error)
        
        // Check if it's a duplicate email error (from database or Polar)
        if (
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("already registered") ||
          errorMessage.toLowerCase().includes("email already") ||
          errorString.toLowerCase().includes("customer with this email address already exists") ||
          errorString.toLowerCase().includes("unique constraint") ||
          errorMessage.toLowerCase().includes("duplicate")
        ) {
          toast.error("An account with this email already exists. Please sign in instead.")
        } else {
          toast.error(errorMessage || "Failed to create account")
        }
        setLoading(false)
        return
      }
      
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account before signing in.",
        duration: 8000,
      })
      
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
            toast.error("Account created, but failed to accept invitation. Please check your email for the invitation link.")
          } else {
            toast.success("Successfully joined the organization!")
          }
        } catch (inviteErr) {
          console.error("Error accepting invitation:", inviteErr)
          toast.error("Account created, but failed to accept invitation.")
        }
        
        // Redirect to dashboard for invitation signups
        router.push("/dashboard/home")
      } else {
        // Regular signup flow - redirect to onboarding
        router.push("/dashboard/onboarding")
      }
      
      router.refresh()
    } catch (err: unknown) {
      // Handle unexpected errors
      const errorMessage = err instanceof Error ? err.message : String(err)
      const errorString = JSON.stringify(err)
      
      // Check if it's a duplicate email error
      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("customer with this email address already exists") ||
        errorString.toLowerCase().includes("customer with this email address already exists")
      ) {
        toast.error("An account with this email already exists. Please sign in instead.")
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
      setLoading(false)
    }
  }

  const handleGitHubSignup = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard/onboarding",
      })
    } catch {
      toast.error("Failed to sign up with GitHub")
    }
  }

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {isFromInvitation ? "Join your team" : "Create your account"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance max-w-[280px]">
            {isFromInvitation 
              ? "Create an account to accept your invitation"
              : "Get started with your free account"
            }
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input 
            id="name" 
            name="name"
            type="text" 
            placeholder="John Doe" 
            required 
            disabled={loading}
            autoComplete="name"
            className="h-10"
          />
        </Field>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password" 
            name="password"
            type="password" 
            required 
            minLength={8}
            disabled={loading}
            autoComplete="new-password"
            className="h-10"
          />
          <FieldDescription>
            Must be at least 8 characters.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input 
            id="confirm-password" 
            name="confirm-password"
            type="password" 
            required 
            minLength={8}
            disabled={loading}
            autoComplete="new-password"
            className="h-10"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="h-10 w-full font-medium">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={handleGitHubSignup} className="h-10 w-full">
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
            Already have an account?{" "}
            <Link href={isFromInvitation ? "/?from=invitation" : "/"} className="text-foreground hover:underline underline-offset-4 font-medium">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
