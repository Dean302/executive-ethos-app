"use client"

import * as React from "react"
import Link from "next/link"
import { unstable_rethrow } from "next/navigation"
import { AlertCircle, ArrowLeft, ArrowRight, Check, UserRound } from "lucide-react"

import { Button, buttonVariants } from "@/components/common/button"
import { Radio, RadioGroup } from "@/components/common/radio"
import { Textarea } from "@/components/common/textarea"
import {
  FOCUS_AREA_IDS,
  FOCUS_AREAS,
  ROLES,
  WHY_MAX_LENGTH,
  type FocusAreaId,
  type Role,
} from "@/lib/executiveProfile"
import { cn } from "@/lib/utils"

import { saveExecutiveProfile } from "./actions"

const STEPS = [
  {
    title: "What's your role?",
    hint: "This shapes every question that follows.",
  },
  {
    title: "What brought you here?",
    hint: "In your own words. There's no wrong answer, just the honest one. This is for your coach, not a test of you.",
  },
  {
    title: "Where would you like to see the fastest change?",
    hint: "Pick the one that matters most right now. It becomes the starting lens for your first session. You can always adjust it later.",
  },
] as const

const EYEBROW = "text-xs font-semibold tracking-[0.06em] uppercase"

type ProfileIntakeProps = {
  /** The lead's name and initials, when known. */
  person?: { name: string; firstName: string; initials: string }
  /** Where Back goes from the first question. */
  backHref: string
}

/**
 * Role → why → focus, before the self-assessment. The navy profile card
 * fills in as each answer lands; it is this phase's progress indicator.
 */
function ProfileIntake({ person, backHref }: ProfileIntakeProps) {
  const [step, setStep] = React.useState(0)
  const [role, setRole] = React.useState<Role | null>(null)
  const [why, setWhy] = React.useState("")
  const [focus, setFocus] = React.useState<FocusAreaId | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const hasMoved = React.useRef(false)

  // Each step swaps the question in place; move focus to it so keyboard
  // and screen-reader users land on the new question. Not on first load.
  React.useEffect(() => {
    if (!hasMoved.current) return
    if (step === 1) textareaRef.current?.focus()
    else headingRef.current?.focus()
  }, [step])

  const go = (next: number) => {
    hasMoved.current = true
    setError(null)
    setStep(next)
  }

  const canContinue = step === 0 ? role !== null : step === 1 ? why.trim().length > 0 : focus !== null
  const isLastStep = step === STEPS.length - 1

  const submit = () => {
    setError(null)
    startTransition(async () => {
      try {
        // Returns a result only on failure; success redirects.
        const result = await saveExecutiveProfile({ role, why, focus })
        if (result?.error) setError(result.error)
      } catch (err) {
        unstable_rethrow(err)
        setError("We couldn't save your profile. Check your connection and try again.")
      }
    })
  }

  const fields = [
    { label: "Role", value: role, done: step > 0 },
    { label: "Why", value: why.trim() ? "Captured" : null },
    { label: "Focus", value: focus ? FOCUS_AREAS[focus].label : null },
  ]

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="text-center">
        <h1 className="text-3xl text-balance">
          {person ? `Let's build your Executive Profile, ${person.firstName}` : "Let's build your Executive Profile"}
        </h1>
        <p className="text-muted-foreground mt-3 text-[15px]">
          Three quick questions, then your baseline self-assessment: about 18 minutes in total.
        </p>
      </div>

      <section
        aria-label="Your executive profile so far"
        className="border-accent/25 bg-primary text-primary-foreground mt-8 rounded-panel border px-6 py-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="bg-accent/20 text-accent font-heading flex size-11 shrink-0 items-center justify-center rounded-full text-base"
          >
            {person ? person.initials : <UserRound className="size-5" strokeWidth={1.75} />}
          </span>
          <div>
            <p className={cn(EYEBROW, "text-primary-foreground/50")}>Executive Profile</p>
            <p className="font-heading text-lg">{person ? person.name : "Your profile"}</p>
          </div>
        </div>

        <dl className="border-primary-foreground/10 mt-4 grid grid-cols-3 gap-3 border-t pt-4">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className={cn(EYEBROW, "text-primary-foreground/50")}>{field.label}</dt>
              <dd
                className={cn(
                  "mt-1 truncate text-sm font-medium transition-colors",
                  field.value ? "text-accent" : "text-primary-foreground/30 italic"
                )}
              >
                {field.value ?? "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 text-center">
        <p className={cn(EYEBROW, "text-muted-foreground")}>
          {step + 1} of {STEPS.length}
        </p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl text-balance outline-none">
          {STEPS[step].title}
        </h2>
        <p className="text-muted-foreground mt-2 text-[15px]">{STEPS[step].hint}</p>

        {step === 0 && (
          <RadioGroup
            aria-label={STEPS[0].title}
            value={role}
            onValueChange={(value) => setRole(value as Role)}
            className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
          >
            {ROLES.map((option) => (
              <Radio key={option} value={option} variant="tile">
                {option}
              </Radio>
            ))}
          </RadioGroup>
        )}

        {step === 1 && (
          <Textarea
            ref={textareaRef}
            label={STEPS[1].title}
            hideLabel
            wrapperClassName="mt-6"
            value={why}
            maxLength={WHY_MAX_LENGTH}
            onChange={(event) => setWhy(event.target.value)}
            placeholder="e.g. I know how I want to lead, I just don't always land it the way I mean to."
          />
        )}

        {step === 2 && (
          <RadioGroup
            aria-label={STEPS[2].title}
            value={focus}
            onValueChange={(value) => setFocus(value as FocusAreaId)}
            className="mt-6 grid grid-cols-1 gap-2.5"
          >
            {FOCUS_AREA_IDS.map((id) => (
              <Radio key={id} value={id} variant="card" description={FOCUS_AREAS[id].blurb}>
                {FOCUS_AREAS[id].label}
              </Radio>
            ))}
          </RadioGroup>
        )}

        {error && (
          <p role="alert" className="text-destructive mt-6 flex items-center justify-center gap-1.5 text-sm">
            <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          {step === 0 ? (
            <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}>
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
              Back
            </Link>
          ) : (
            <Button variant="outline" onClick={() => go(step - 1)} className="gap-1.5">
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
              Back
            </Button>
          )}

          <Button
            onClick={isLastStep ? submit : () => go(step + 1)}
            disabled={!canContinue || isPending}
            className="gap-1.5"
          >
            {isLastStep ? (
              isPending ? (
                "Saving…"
              ) : (
                <>
                  Begin Self-Assessment
                  <Check aria-hidden className="size-4" strokeWidth={1.75} />
                </>
              )
            ) : (
              <>
                Continue
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProfileIntake }
