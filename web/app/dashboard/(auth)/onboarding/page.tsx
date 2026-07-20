"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Copy, Building2, CreditCard, Bell, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession, authClient } from "@/lib/auth-client"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/dashboard/login")
    }
  }, [session, isPending, router])

  // Handle return from Polar checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('step')
    const fromParam = params.get('from')
    
    if (stepParam === '3' && fromParam === 'polar') {
      // Restore form data from sessionStorage
      const storedData = sessionStorage.getItem('onboarding_formData')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setFormData(parsedData)
        } catch {
          // Failed to parse stored form data
        }
      }
      
      // Set step to 3 (Spending Settings)
      setStep(3)
      
      // Clean up URL params
      window.history.replaceState({}, '', '/dashboard/onboarding')
    }
  }, [])

  // Form state
  const [formData, setFormData] = useState({
    orgName: "",
    companyName: "",
    useCase: "",
    teamSize: "",
    plan: "",
    alert50: true,
    alert75: true,
    alert100: true,
    spendingCap: "",
  })

  const handleNext = async () => {
    if (step === 1) {
      // Validate organization info
      if (!formData.orgName) {
        toast.error("Please enter an organization name")
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate plan selection
      if (!formData.plan) {
        toast.error("Please select a plan")
        return
      }
      
      // Create organization and redirect to Polar checkout
      setLoading(true)
      try {
        // Create the organization
        const organization = await authClient.organization.create({
          name: formData.orgName || "My Organization",
          slug: (formData.orgName || "my-org")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        })

        // Check if organization creation was successful
        if (!organization?.data) {
          throw new Error("Failed to create organization")
        }

        // Set the newly created organization as active
        await authClient.organization.setActive({
          organizationId: organization.data.id,
        })

        // Store form data in sessionStorage to restore after Polar redirect
        sessionStorage.setItem('onboarding_formData', JSON.stringify(formData))

        // Trigger Polar checkout for ALL plans (including starter)
        await authClient.checkout({
          slug: formData.plan,
          referenceId: organization.data.id, // Associate with organization
        })
        // User will be redirected to Polar checkout, then back to /onboarding?step=3&from=polar
        return
      } catch (error: unknown) {
        console.error("Organization creation or checkout error:", error)
        const message = error instanceof Error ? error.message : "Failed to start checkout"
        toast.error(message)
        setLoading(false)
      }
    } else if (step === 3) {
      // Complete onboarding with spending settings
      setLoading(true)
      try {
        const response = await fetch("/dashboard/api/onboarding/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationName: formData.orgName,
            companyName: formData.companyName || formData.orgName,
            useCase: formData.useCase,
            teamSize: formData.teamSize,
            plan: formData.plan,
            spendingCap: formData.spendingCap,
            alerts: {
              alert50: formData.alert50,
              alert75: formData.alert75,
              alert100: formData.alert100,
            },
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to complete onboarding")
        }

        // Clear stored form data
        sessionStorage.removeItem('onboarding_formData')
        
        toast.success("Setup complete!")
        setStep(4) // Move to final "You're all set" screen
        setLoading(false)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to complete onboarding"
        toast.error(message)
        setLoading(false)
      }
    } else {
      // Step 4: Go to dashboard
      router.push("/dashboard/home")
      router.refresh()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  const steps = [
    { number: 1, title: "Organization", icon: Building2 },
    { number: 2, title: "Plan", icon: CreditCard },
    { number: 3, title: "Alerts", icon: Bell },
    { number: 4, title: "Ready!", icon: Rocket },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="flex size-8 items-center justify-center">
            <Image src="/logo-black.png" alt="integrate.dev" width={32} height={32} className="size-8 rounded-lg" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Integrate</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
            {steps.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.number} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step > s.number
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : step === s.number
                        ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                        : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? <Check className="size-5" /> : <Icon className="size-4" />}
                  </div>
                  <span className={`text-xs text-center max-w-20 transition-colors ${
                    step >= s.number ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>{s.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">
              {step === 1 && "Tell us about your organization"}
              {step === 2 && "Choose your plan"}
              {step === 3 && "Configure spending alerts"}
              {step === 4 && "You're all set!"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "We'll use this information to set up your workspace"}
              {step === 2 && "Start free, upgrade anytime as you grow"}
              {step === 3 && "Set limits and get notified before they're reached"}
              {step === 4 && "Start building integrations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Organization Info */}
            {step === 1 && (
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="orgName">Organization Name</FieldLabel>
                  <Input
                    id="orgName"
                    value={formData.orgName}
                    onChange={(e) => updateFormData("orgName", e.target.value)}
                    placeholder="Your Company Inc."
                    required
                    disabled={loading}
                  />
                  <FieldDescription>
                    This will be the name of your workspace
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="useCase">What will you use integrate.dev for?</FieldLabel>
                  <Input
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => updateFormData("useCase", e.target.value)}
                    placeholder="e.g., CRM integrations, data syncing"
                    disabled={loading}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="teamSize">Team Size</FieldLabel>
                  <Input
                    id="teamSize"
                    value={formData.teamSize}
                    onChange={(e) => updateFormData("teamSize", e.target.value)}
                    placeholder="e.g., 1-5, 5-20, 20+"
                    disabled={loading}
                  />
                  <FieldDescription>
                    How many people will be using integrate.dev?
                  </FieldDescription>
                </Field>
              </div>
            )}

            {/* Step 2: Plan Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.plan === "starter"
                        ? "border-primary ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateFormData("plan", "starter")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Starter</CardTitle>
                          <CardDescription>Pay-as-you-go pricing</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">$0.20</div>
                          <div className="text-sm text-muted-foreground">per 1,000 requests</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          10,000 free requests/month
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          2 rps sustained, 20 rps burst
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          10 sec timeout, 256 KB payload
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          7 days log retention
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Community support
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.plan === "scale"
                        ? "border-primary ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateFormData("plan", "scale")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Scale
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                              POPULAR
                            </span>
                          </CardTitle>
                          <CardDescription>For production teams</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">$149</div>
                          <div className="text-sm text-muted-foreground">per month + usage</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Everything in Starter + usage rate
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          10 rps sustained, 100 rps burst
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          30 sec timeout, 1 MB payload
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          30 days log retention
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          Priority support (8×5, ≤4h response)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          SSO, audit logs, sandbox orgs
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Spending Settings */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Spending Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alert50"
                        checked={formData.alert50}
                        onCheckedChange={(checked) => updateFormData("alert50", checked as boolean)}
                      />
                      <label
                        htmlFor="alert50"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Alert me at 50% of spending cap
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alert75"
                        checked={formData.alert75}
                        onCheckedChange={(checked) => updateFormData("alert75", checked as boolean)}
                      />
                      <label
                        htmlFor="alert75"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Alert me at 75% of spending cap
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="alert100"
                        checked={formData.alert100}
                        onCheckedChange={(checked) => updateFormData("alert100", checked as boolean)}
                      />
                      <label
                        htmlFor="alert100"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Alert me at 100% of spending cap
                      </label>
                    </div>
                  </div>
                </div>

                <Field>
                  <FieldLabel htmlFor="spendingCap">Monthly Spending Cap</FieldLabel>
                  <Input
                    id="spendingCap"
                    type="number"
                    value={formData.spendingCap}
                    onChange={(e) => updateFormData("spendingCap", e.target.value)}
                    placeholder="500"
                    required
                  />
                  <FieldDescription>
                    Set a maximum amount you want to spend per month. API requests will be paused when this limit is reached.
                  </FieldDescription>
                </Field>
              </div>
            )}

            {/* Step 4: All Set / Getting Started */}
            {step === 4 && (
              <div className="space-y-6 py-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">You&apos;re all set!</h3>
                    <p className="text-muted-foreground">
                      Your organization has been created and you&apos;re ready to start building.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg space-y-4">
                  <h4 className="font-semibold text-lg">Get started by installing the SDK</h4>
                  
                  <div className="bg-background border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground font-medium">Run this command:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("bun i integrate-sdk")
                          toast.success("Copied to clipboard!")
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <code className="text-sm font-mono bg-muted px-3 py-2 rounded block">
                      bun i integrate-sdk
                    </code>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      For more information and examples, check out our documentation:
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <a 
                        href="https://integrate.dev/docs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                        Visit Documentation
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <h5 className="font-medium mb-3">What&apos;s next?</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Generate API keys in your dashboard settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Connect your first integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Invite your team members to collaborate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Monitor your usage and API calls</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || step === 4 || loading}
                className="h-10"
                type="button"
              >
                Back
              </Button>
              <Button onClick={handleNext} disabled={loading} className="h-10 min-w-[140px] font-medium" type="button">
                {loading
                  ? "Setting up..."
                  : step === 3
                  ? "Complete setup"
                  : step === 4
                  ? "Go to Dashboard"
                  : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

