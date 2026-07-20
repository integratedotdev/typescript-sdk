"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/dashboard/reset-password`,
      })

      if (error) {
        toast.error(error.message || "Failed to send reset email")
        setLoading(false)
        return
      }

      setEmailSent(true)
      toast.success("Password reset email sent!", {
        description: "Check your inbox for instructions to reset your password.",
        duration: 6000,
      })
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
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
              {emailSent ? (
                <CheckCircle2 className="size-6 text-green-500" />
              ) : (
                <Mail className="size-6 text-muted-foreground" />
              )}
            </div>
            <CardTitle className="text-xl">
              {emailSent ? "Check your email" : "Forgot your password?"}
            </CardTitle>
            <CardDescription className="text-sm">
              {emailSent
                ? "We've sent you instructions to reset your password."
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
                  <p className="text-sm text-green-400">
                    If an account exists with this email address, you&apos;ll receive a password reset link shortly.
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/60">•</span>
                    Check your spam folder if you don&apos;t see the email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/60">•</span>
                    The reset link expires in 1 hour
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/60">•</span>
                    The link can only be used once
                  </li>
                </ul>

                <Link href="/dashboard/login" className="block">
                  <Button variant="outline" className="w-full h-10">
                    <ArrowLeft className="size-4 mr-2" />
                    Back to sign in
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                    autoFocus
                    autoComplete="email"
                    className="h-10"
                  />
                  <FieldDescription>
                    We&apos;ll send a password reset link to this email.
                  </FieldDescription>
                </Field>

                <div className="flex flex-col gap-3 pt-2">
                  <Button type="submit" disabled={loading} className="w-full h-10 font-medium">
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>

                  <Link href="/dashboard/login" className="block">
                    <Button type="button" variant="ghost" className="w-full h-10">
                      <ArrowLeft className="size-4 mr-2" />
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/dashboard/signup" className="text-foreground hover:underline underline-offset-4 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

