"use client"

import * as React from "react"

import type { StandingSession } from "@/lib/pricing"
import {
  SESSION_START_TIMES,
  WEEKDAYS,
  firstOccurrence,
  formatSessionDate,
  formatSessionTime,
  formatTimeOfDay,
  type Slot,
  type Weekday,
} from "@/lib/schedule"
import { cn } from "@/lib/utils"

import type { CoachAvailability } from "./coachAvailability"

// The current minute, read only in the browser: the first-session date
// depends on the visitor's clock and timezone, so the server renders
// without it rather than guessing.
const subscribeNever = () => () => {}
const currentMinute = () => Math.floor(Date.now() / 60_000) * 60_000
function useNow() {
  const minute = React.useSyncExternalStore(subscribeNever, currentMinute, () => null)
  return minute === null ? null : new Date(minute)
}

const OPTION =
  "focus-visible:ring-ring/50 cursor-pointer rounded-lg border font-medium transition-colors outline-none focus-visible:ring-3"
const OPTION_SELECTED = "border-primary bg-primary text-primary-foreground"
const OPTION_IDLE = "border-border bg-card text-foreground/85 hover:border-primary/40"

type SlotPickerProps = {
  session: StandingSession
  slot: Slot
  availability: CoachAvailability
  onChange: (slot: Slot) => void
}

/** Weekday and start time for one standing session. */
function SlotPicker({ session, slot, availability, onChange }: SlotPickerProps) {
  const now = useNow()
  const dayLabelId = React.useId()
  const timeLabelId = React.useId()
  const open = availability[slot.day]

  // Keep the time when the coach has it on the new day; otherwise take
  // that day's first open time.
  const chooseDay = (day: Weekday) => {
    const times = availability[day]
    onChange({ day, start: times.includes(slot.start) ? slot.start : times[0] })
  }

  return (
    <section
      aria-label={session.label}
      className="bg-card mt-8 rounded-container border p-5 text-left"
    >
      <h2 className="font-sans text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
        {session.label}
      </h2>
      <p className="text-muted-foreground mt-0.5 text-sm">
        Runs {session.cadence}, same day and time, for the life of your program.
      </p>

      <p id={dayLabelId} className="text-muted-foreground mt-5 text-xs font-semibold tracking-[0.06em] uppercase">
        Day of the week
      </p>
      <div role="group" aria-labelledby={dayLabelId} className="mt-2.5 grid grid-cols-5 gap-2">
        {WEEKDAYS.map((weekday) => {
          const selected = weekday.value === slot.day
          return (
            <button
              key={weekday.value}
              type="button"
              aria-pressed={selected}
              aria-label={weekday.long}
              onClick={() => chooseDay(weekday.value)}
              className={cn(OPTION, "px-2 py-2.5 text-sm", selected ? OPTION_SELECTED : OPTION_IDLE)}
            >
              {weekday.short}
            </button>
          )
        })}
      </div>

      <p id={timeLabelId} className="text-muted-foreground mt-5 text-xs font-semibold tracking-[0.06em] uppercase">
        Time
      </p>
      <div role="group" aria-labelledby={timeLabelId} className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {SESSION_START_TIMES.map((start) => {
          const available = open.includes(start)
          const selected = start === slot.start
          return (
            <button
              key={start}
              type="button"
              disabled={!available}
              aria-pressed={selected}
              onClick={() => onChange({ ...slot, start })}
              className={cn(
                OPTION,
                "px-2 py-2 text-[12.5px]",
                !available
                  ? "border-border/60 bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                  : selected
                    ? OPTION_SELECTED
                    : OPTION_IDLE
              )}
            >
              {formatTimeOfDay(start)}
              {!available && <span className="sr-only"> (unavailable)</span>}
            </button>
          )
        })}
      </div>

      {now && (
        <p aria-live="polite" className="text-muted-foreground mt-4 text-sm">
          First one:{" "}
          <span className="text-foreground font-medium">
            {`${formatSessionDate(firstOccurrence(slot, now))} at ${formatSessionTime(slot.start)}`}
          </span>
        </p>
      )}
    </section>
  )
}

export { SlotPicker }
