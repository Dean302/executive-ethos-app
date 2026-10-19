"use client"

import * as React from "react"
import { unstable_rethrow } from "next/navigation"
import { AlertCircle, ArrowRight, CalendarClock } from "lucide-react"

import { Button } from "@/components/common/button"
import { PLANS, type PlanId, type TermDays } from "@/lib/pricing"
import type { Slot } from "@/lib/schedule"

import { saveSchedule } from "./actions"
import type { CoachAvailability } from "./coachAvailability"
import { SlotPicker } from "./SlotPicker"

// Where each session's picker starts.
const DEFAULT_SLOTS: Record<"primary" | "secondary", Slot> = {
  primary: { day: 2, start: 600 },
  secondary: { day: 4, start: 840 },
}

/** The default if the coach has it, otherwise the first open slot. */
function initialSlot(preferred: Slot, availability: CoachAvailability): Slot {
  if (availability[preferred.day].includes(preferred.start)) return preferred
  return { day: preferred.day, start: availability[preferred.day][0] }
}

type ScheduleScreenProps = {
  planId: PlanId
  termDays: TermDays
  availability: CoachAvailability
}

/** Reserve the plan's standing coaching session(s) with the coach. */
function ScheduleScreen({ planId, termDays, availability }: ScheduleScreenProps) {
  const plan = PLANS[planId]
  const [primary, secondary] = plan.sessions
  const [slots, setSlots] = React.useState(() => ({
    primary: initialSlot(DEFAULT_SLOTS.primary, availability),
    secondary: initialSlot(DEFAULT_SLOTS.secondary, availability),
  }))
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const setSlot = (key: "primary" | "secondary") => (slot: Slot) => {
    setError(null)
    setSlots((current) => ({ ...current, [key]: slot }))
  }

  const confirm = () => {
    setError(null)
    startTransition(async () => {
      try {
        // Returns a result only on failure; success redirects.
        const result = await saveSchedule({
          planId,
          termDays,
          slots: { primary: slots.primary, secondary: secondary ? slots.secondary : undefined },
        })
        if (result?.error) setError(result.error)
      } catch (err) {
        unstable_rethrow(err)
        setError("We couldn't save your sessions. Check your connection and try again.")
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <span className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
        <CalendarClock aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-[0.06em] uppercase">
        {secondary ? "Your Coaching Sessions" : "Your Coaching Session"}
      </p>
      <h1 className="mt-1.5 text-3xl text-balance">Reserve time with your coach</h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-[15px]">
        {secondary
          ? `${plan.id} includes two standing coaching sessions. Choose what actually works for your calendar, then they repeat automatically, no rebooking each time.`
          : `${plan.id} includes a standing coaching session. Choose what actually works for your calendar, then it repeats automatically, no rebooking each time.`}
      </p>

      <SlotPicker
        session={primary}
        slot={slots.primary}
        availability={availability}
        onChange={setSlot("primary")}
      />
      {secondary && (
        <SlotPicker
          session={secondary}
          slot={slots.secondary}
          availability={availability}
          onChange={setSlot("secondary")}
        />
      )}

      {error && (
        <p role="alert" className="text-destructive mt-6 flex items-center justify-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <Button size="lg" className="mt-8 gap-2" disabled={isPending} onClick={confirm}>
        {isPending ? (
          "Saving…"
        ) : (
          <>
            Confirm &amp; continue
            <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
          </>
        )}
      </Button>
    </div>
  )
}

export { ScheduleScreen }
