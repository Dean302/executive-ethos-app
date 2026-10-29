"use client"

import * as React from "react"
import { AlertCircle, Check, Flag } from "lucide-react"

import { Button } from "@/components/common/button"
import { Modal } from "@/components/common/modal"
import { Textarea } from "@/components/common/textarea"
import { FLAG_NOTE_MAX_LENGTH, type CoachFlag } from "@/lib/coachFlags"
import { shortDate } from "@/lib/dates"
import { cn } from "@/lib/utils"

import { saveCoachFlag } from "./actions"

type FlagToggleProps = {
  recordingId: string
  initialFlag: CoachFlag
  /** Now on the executive's clock, wall-clock milliseconds, for a new flag's date. */
  now: number
}

/**
 * Flag a recording to discuss with the coach, with an optional note. The
 * button flags it and opens the note; once flagged it reopens the note,
 * where the flag can be removed. A flag the coach has covered shows the
 * outcome and can be raised again.
 */
function FlagToggle({ recordingId, initialFlag, now }: FlagToggleProps) {
  const [flag, setFlag] = React.useState(initialFlag)
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const saved = React.useRef(initialFlag)
  const discussed = flag.flagged && flag.resolvedAt !== undefined
  const discussedOn = flag.resolvedAt === undefined ? "" : shortDate(new Date(flag.resolvedAt))
  const label = discussed ? `Discussed with your coach · ${discussedOn}` : flag.flagged ? "Flagged for coach" : "Flag for coach"

  // Shows the change straight away; puts it back if the save fails.
  const save = async (next: CoachFlag) => {
    const previous = saved.current
    setFlag(next)
    setError(null)
    try {
      const result = await saveCoachFlag({ recordingId, flagged: next.flagged, note: next.note })
      if ("error" in result) throw new Error(result.error)
      saved.current = next
    } catch (cause) {
      setFlag(previous)
      setError(cause instanceof Error && cause.message ? cause.message : "We couldn't save that. Try again.")
    }
  }

  // Flagging again after it was discussed reopens it, keeping the note.
  const raise = () => save({ flagged: true, note: flag.note, flaggedAt: now })

  const close = () => {
    setOpen(false)
    if (flag.flagged && flag.note !== saved.current.note) void save(flag)
  }

  return (
    <>
      <Button
        variant={flag.flagged ? "secondary" : "outline"}
        size="sm"
        onClick={() => {
          if (!flag.flagged) void raise()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        title={label}
        className="gap-1.5 max-sm:size-9 max-sm:px-0"
      >
        {discussed ? (
          <Check aria-hidden className="text-success size-3.5" strokeWidth={2.25} />
        ) : (
          <Flag aria-hidden className={cn("size-3.5", flag.flagged && "fill-oxblood text-oxblood")} strokeWidth={1.75} />
        )}
        <span className="max-sm:sr-only">{label}</span>
      </Button>

      <Modal
        open={open && flag.flagged}
        onOpenChange={(next) => (next ? setOpen(true) : close())}
        headerClassName="gap-1"
        titleClassName="flex items-center gap-2 font-sans text-lg font-medium"
        className="[--modal-pad:--spacing(6)] sm:max-w-md"
        title={
          discussed ? (
            <>
              <Check aria-hidden className="text-success size-4" strokeWidth={2.25} />
              {`Discussed with your coach on ${discussedOn}`}
            </>
          ) : (
            <>
              <Flag aria-hidden className="fill-oxblood text-oxblood size-4" strokeWidth={1.75} />
              Flagged for your coach
            </>
          )
        }
        description={
          discussed
            ? flag.outcome
              ? undefined
              : "Covered in your coaching session."
            : "Your coach will see it when preparing your next coaching session."
        }
      >
        {discussed ? (
          <>
            {flag.outcome && (
              <p className="bg-secondary/60 text-foreground rounded-inset px-3.5 py-2.5 text-sm leading-relaxed">
                {flag.outcome}
              </p>
            )}
            <div className="mt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={raise}
                className="text-primary focus-visible:ring-ring/50 cursor-pointer rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3"
              >
                Flag again
              </button>
              <Button size="sm" onClick={close}>
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <Textarea
              label="What do you want to discuss?"
              hideLabel
              autoFocus
              rows={4}
              maxLength={FLAG_NOTE_MAX_LENGTH}
              value={flag.note}
              onChange={(event) => setFlag((current) => ({ ...current, note: event.target.value }))}
              placeholder="What do you want to discuss? (optional)"
              className="border-input block min-h-0 resize-none rounded-inset px-3.5 py-2.5 text-sm leading-5"
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  void save({ flagged: false, note: "" })
                }}
                className="text-muted-foreground hover:text-destructive focus-visible:ring-ring/50 cursor-pointer rounded-sm text-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3"
              >
                Remove flag
              </button>
              <Button size="sm" onClick={close}>
                Done
              </Button>
            </div>
          </>
        )}
        {error && (
          <p role="alert" className="text-destructive flex items-start gap-1.5 text-sm">
            <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
            {error}
          </p>
        )}
      </Modal>

      {error && !open && (
        <p role="alert" className="sr-only">
          {error}
        </p>
      )}
    </>
  )
}

export { FlagToggle }
