import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="https://integrate.dev" className="flex items-center gap-2 font-medium text-foreground hover:opacity-80 transition-opacity">
            <div className="flex size-7 items-center justify-center">
              <Image src="/logo-black.png" alt="integrate.dev" width={28} height={28} className="size-7 rounded-lg" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Integrate</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Suspense fallback={<div className="h-[500px] flex items-center justify-center text-muted-foreground">Loading...</div>}>
              <SignupForm />
            </Suspense>
          </div>
        </div>
        <div className="flex justify-center md:justify-start">
          <p className="text-xs text-muted-foreground">
            The fastest gateway to any third party API
          </p>
        </div>
      </div>
      <div className="relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center overflow-hidden bg-gradient-to-br from-muted/50 via-background to-muted/30">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-muted/30 via-transparent to-transparent" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_20%,transparent_100%)]" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 p-12 text-center">
          <div className="flex size-24 items-center justify-center rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
            <Image src="/integrate.png" alt="Integrate" width={64} height={64} className="size-16 rounded-lg" />
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight">
              Start building integrations
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join thousands of developers building powerful integrations with our universal SDK.
            </p>
          </div>
          
          {/* Features list */}
          <div className="w-full max-w-sm space-y-3 text-left">
            {[
              "Connect to 100+ APIs instantly",
              "MCP server support out of the box",
              "Automatic OAuth handling",
              "Built-in rate limiting & retries",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 px-4 py-3">
                <svg className="size-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>Check</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-foreground/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
