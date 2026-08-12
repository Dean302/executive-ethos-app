"use client"

import * as React from "react"
import Link from "next/link"

import { BrandMark } from "@/components/common/brandMark"
import { Button } from "@/components/common/button"
import { GoogleIcon } from "@/components/common/svg"
import { SignIn } from "@/components/signIn"
import { SignUp } from "@/components/signUp"
import { cn } from "@/lib/utils"

type Mode = "signup" | "signin"

const MODES = [
  { value: "signup", label: "Create account" },
  { value: "signin", label: "Sign in" },
] as const

const VALUE_PROPS = [
  { label: "33-question baseline", sub: "Across 6 communication dimensions" },
  { label: "Real-time session scoring", sub: "Longitudinal tracking over months" },
  { label: "1:1 human coach handoff", sub: "Personalised to your profile" },
]

function AuthLayout({ defaultMode = "signup" }: { defaultMode?: Mode }) {
  const [mode, setMode] = React.useState<Mode>(defaultMode)

  return (
    <div className="bg-background text-foreground flex min-h-dvh">
      {/* Branding */}
      <aside className="bg-primary text-primary-foreground relative hidden w-[44%] shrink-0 flex-col overflow-hidden p-12 lg:flex">
        <span
          aria-hidden
          className="text-accent/[0.06] pointer-events-none absolute -right-20 -bottom-16 font-serif text-[380px] leading-none font-bold select-none"
        >
          Θ
        </span>

        <div className="relative mb-auto flex items-center gap-3">
          <BrandMark tone="inverse" />
          <span className="text-[15px] font-semibold">The Executive Ethos</span>
        </div>

        <div className="relative mb-auto">
          <p className="text-accent mb-[18px] text-[11px] font-semibold tracking-[0.16em] uppercase">
            AI-Powered Executive Development
          </p>
          <h2 className="mb-5 text-[clamp(24px,2.6vw,34px)] leading-[1.2] font-bold tracking-[-0.02em]">
            No one tells a CEO the truth about how they really show up.
          </h2>
          <p className="text-primary-foreground/60 mb-10 text-[15px] leading-[26px]">
            Get the honest feedback you deserve. Build the confident leadership
            presence your company needs. We&rsquo;re in your corner — with
            AI-powered insights and human partnership that never stops.
          </p>

          <ul className="flex flex-col gap-5">
            {VALUE_PROPS.map((prop, i) => (
              <li key={prop.label} className="flex items-start gap-3.5">
                <span
                  aria-hidden
                  className="bg-accent/20 border-accent/25 text-accent mt-px flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{prop.label}</span>
                  <span className="text-primary-foreground/50 block text-[13px] leading-[18px]">
                    {prop.sub}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Auth */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-100">
          <div
            role="group"
            aria-label="Authentication mode"
            className="border-border bg-foreground/[0.04] mb-9 inline-flex rounded-full border p-1"
          >
            {MODES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={cn(
                  "h-[34px] cursor-pointer rounded-full px-5 text-[13px] font-medium transition-colors",
                  mode === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "signup" ? <SignUp /> : <SignIn />}

          <div className="my-6 flex items-center gap-3">
            <span className="bg-foreground/10 h-px flex-1" />
            <span className="text-muted-foreground text-xs font-medium">or</span>
            <span className="bg-foreground/10 h-px flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="bg-popover h-[50px] w-full gap-2.5 rounded-full border-[1.5px] text-sm font-medium"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="text-muted-foreground mt-7 text-center text-xs leading-[18px]">
            By continuing you agree to the{" "}
            <Link href="/terms" className="hover:text-foreground underline">
              Terms
            </Link>{" "}
            and acknowledge the{" "}
            <Link href="/privacy" className="hover:text-foreground underline">
              Privacy Notice
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}

export { AuthLayout }
