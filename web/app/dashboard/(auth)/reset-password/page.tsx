"use client"

import { useState, useEffect, Suspense, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    const errorParam = searchParams.get("error")

    if (errorParam === "INVALID_TOKEN") {
      setError("This password reset link is invalid or has expired. Please request a new one.")
    } else if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError("No reset token provided. Please use the link from your email.")
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) {
      toast.error("No reset token found")
      return
    }

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      })

      if (resetError) {
        if (resetError.message?.toLowerCase().includes("token") || 
            resetError.message?.toLowerCase().includes("expired")) {
          setError("This password reset link has expired or is invalid. Please request a new one.")
        } else {
          toast.error(resetError.message || "Failed to reset password")
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success("Password reset successfully!", {
        description: "You can now sign in with your new password.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/dashboard/login")
      }, 3000)
    } catch {
      toast.error("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Link href="https://integrate.dev" className="flex items-center justify-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <div className="flex size-8 items-center justify-center">
            <Image src="/logo-black.png" alt="integrate.dev" width={32} height={32} className="size-8 rounded-lg" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Integrate</span>
        </Link>

        <Card className="border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              {success ? (
                <CheckCircle2 className="size-6 text-green-500" />
              ) : error ? (
                <AlertCircle className="size-6 text-destructive" />
              ) : (
                <KeyRound className="size-6 text-muted-foreground" />
              )}
            </div>
            <CardTitle className="text-xl">
              {success ? "Password updated" : error ? "Link expired" : "Set new password"}
            </CardTitle>
            <CardDescription className="text-sm">
              {success
                ? "Your password has been successfully reset."
                : error
                ? "This reset link is no longer valid."
                : "Enter your new password below."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="space-y-4">
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Invalid Reset Link</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>

                <Link href="/dashboard/forgot-password" className="block">
                  <Button variant="outline" className="w-full h-10">
                    Request new reset link
                  </Button>
                </Link>
              </div>
            ) : success ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                  <p className="text-sm text-green-400">
                    Your password has been successfully changed. Redirecting you to the login page...
                  </p>
                </div>

                <Link href="/dashboard/login" className="block">
                  <Button className="w-full h-10 font-medium">
                    Go to sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    disabled={loading}
                    autoFocus
                    autoComplete="new-password"
                    className="h-10"
                  />
                  <FieldDescription>
                    Must be at least 8 characters.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
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

                <Button type="submit" disabled={loading} className="w-full h-10 font-medium">
                  {loading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {!success ? (
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/dashboard/login" className="text-foreground hover:underline underline-offset-4 font-medium">
              Sign in
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

