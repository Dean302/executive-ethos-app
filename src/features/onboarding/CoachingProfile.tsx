"use client"

import * as React from "react"
import { Check, ChevronRight, Lightbulb, UserRound } from "lucide-react"

import { Button } from "@/components/common/button"
import { Modal } from "@/components/common/modal"
import { SignIn } from "@/components/signIn"

import {
  GOLDEN_CIRCLE_QUESTIONS,
  PROFILE_TIP,
  TOTAL_QUESTIONS,
  TOTAL_SECTIONS,
  WHY_SUMMARY,
} from "@/features/onboarding/data"
import { cn } from "@/lib/utils"

type ProfileSection = {
  label: string
  /** Rendered once the section has an answer. */
  body?: React.ReactNode
  done?: boolean
  badge?: React.ReactNode
}

function SectionCard({ label, body, done, badge }: ProfileSection) {
  const filled = Boolean(body)

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 transition-opacity",
        filled ? "bg-card border-border" : "bg-card/40 border-border/50"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span
          className={cn(
            "text-[11px] font-bold tracking-[0.1em] uppercase",
            filled ? "text-foreground" : "text-muted-foreground/50"
          )}
        >
          {label}
        </span>
        {badge ??
          (done && (
            <span className="bg-accent text-accent-foreground flex size-5 shrink-0 items-center justify-center rounded-full">
              <Check className="size-3" strokeWidth={3} />
            </span>
          ))}
      </div>

      {filled ? (
        <div className="text-sm leading-[22px]">{body}</div>
      ) : (
        <p className="text-muted-foreground/50 text-sm italic">
          Waiting for answer…
        </p>
      )}
    </div>
  )
}

function CoachingProfile({
  name,
  role,
  focusLabel,
  started,
  skipped,
  answeredCount,
  sectionsDone,
  goldenCircleCount,
}: {
  name?: string
  role?: string | null
  focusLabel?: string
  started: boolean
  skipped: boolean
  answeredCount: number
  sectionsDone: number
  goldenCircleCount: number
}) {
  const sections: ProfileSection[] = [
    {
      label: "Your identity",
      done: Boolean(name && role),
      body: name ? (
        <>
          <p>Name · {name}</p>
          {role && <p>Role · {role}</p>}
        </>
      ) : undefined,
    },
    {
      label: "Why you're here",
      done: Boolean(role),
      body: role ? WHY_SUMMARY : undefined,
    },
    {
      label: "Focus area",
      done: Boolean(focusLabel),
      body: focusLabel,
    },
    {
      label: "Self-assessment",
      done: skipped || answeredCount >= TOTAL_QUESTIONS,
      badge:
        started && answeredCount < TOTAL_QUESTIONS ? (
          <span className="border-border text-muted-foreground shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
            In progress
          </span>
        ) : undefined,
      body: skipped ? (
        <p className="text-muted-foreground">Skipped for now</p>
      ) : started ? (
        <>
          <p className="text-muted-foreground">
            {sectionsDone} / {TOTAL_SECTIONS} sections · {answeredCount} /{" "}
            {TOTAL_QUESTIONS} answered
          </p>
          <div className="mt-2.5 flex gap-1.5">
            {Array.from({ length: TOTAL_SECTIONS }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i < sectionsDone ? "bg-accent" : "bg-foreground/10"
                )}
              />
            ))}
          </div>
        </>
      ) : undefined,
    },
    {
      label: "Golden circle",
      done: goldenCircleCount >= GOLDEN_CIRCLE_QUESTIONS.length,
      body: goldenCircleCount ? (
        <p className="text-muted-foreground">
          {goldenCircleCount} / {GOLDEN_CIRCLE_QUESTIONS.length} answered
        </p>
      ) : undefined,
    },
  ]

  const complete = sections.filter((s) => s.body).length

  return (
    <aside className="bg-background border-border hidden w-[400px] shrink-0 flex-col gap-3 overflow-y-auto border-l p-6 xl:flex">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold tracking-[-0.01em]">
          Coaching Profile
        </h2>
        <ChevronRight className="text-muted-foreground size-5" />
      </div>
      <p className="text-muted-foreground -mt-2 text-sm">
        {complete} of {sections.length} sections complete
      </p>

      <div className="bg-card/60 border-border/50 mt-1 flex gap-2.5 rounded-2xl border px-4 py-3.5">
        <Lightbulb className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-muted-foreground text-[13px] leading-[20px]">
          {PROFILE_TIP}
        </p>
      </div>

      {sections.map((section) => (
        <SectionCard key={section.label} {...section} />
      ))}

      <AccountSection name={name} />
    </aside>
  )
}

/** Sits at the foot of the panel — who this profile belongs to. */
function AccountSection({ name }: { name?: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="border-border/60 mt-auto border-t pt-4">
      <p className="text-muted-foreground/70 mb-3 text-[11px] font-bold tracking-[0.1em] uppercase">
        Account
      </p>

      <div className="flex items-center gap-3">
        <span className="bg-foreground/[0.08] text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
          <UserRound className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{name || "Guest"}</p>
          <p className="text-muted-foreground truncate text-xs">
            Not signed in — answers stay on this device
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="mt-3 h-9 w-full rounded-full text-[13px] font-medium"
      >
        Log in
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Log in"
        description="Sign in to save your progress to your account."
      >
        <SignIn showHeading={false} onSuccess={() => setOpen(false)} />
      </Modal>
    </div>
  )
}

export { CoachingProfile }
