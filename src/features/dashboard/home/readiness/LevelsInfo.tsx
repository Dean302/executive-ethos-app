"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { Modal } from "@/components/common/modal"
import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"
import { levelFor, LEVELS } from "@/lib/scores"
import { cn } from "@/lib/utils"

/** The info button beside the level, opening what each of the five levels means. */
function LevelsInfo({ score }: { score: number }) {
  const [open, setOpen] = React.useState(false)
  const current = levelFor(score).name

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          aria-label="What do these levels mean?"
          title="What do these levels mean?"
          className={cn(
            "text-muted-on-dark hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-ring/50 inline-flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3",
            open && "bg-primary-foreground/10 text-primary-foreground"
          )}
        >
          <Info aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      }
      title="The five levels"
      description="From the scoring rubric, applied to your average across the six criteria."
      headerClassName="gap-1 pr-6"
      titleClassName="font-sans text-lg font-medium"
      className="max-h-[85dvh] overflow-y-auto [--modal-pad:--spacing(6)] sm:max-w-lg sm:[--modal-pad:--spacing(7)]"
    >
      <ul className="flex flex-col gap-1">
        {[...LEVELS].reverse().map((level) => {
          const isCurrent = level.name === current
          return (
            <li key={level.name} className={cn("flex gap-3 rounded-inset px-3 py-2.5", isCurrent && "bg-secondary")}>
              <span className="text-muted-foreground w-14 shrink-0 pt-px text-sm tabular-nums">
                {`${level.min}–${level.max === 100 ? 100 : level.max - 1}`}
              </span>
              <span className="min-w-0">
                <span className="text-foreground flex items-center gap-2 text-sm font-medium">
                  {level.name}
                  {isCurrent && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-px text-xs font-medium">
                      You
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground mt-0.5 block text-sm">{level.description}</span>
              </span>
            </li>
          )
        })}
      </ul>
      <p className="border-border text-muted-foreground border-t pt-3 text-sm">
        {`Executive Ready (${EXECUTIVE_READY_SCORE}) is the program's goal, the same for every executive. It sits inside Proficient, so it comes before Mastery, not after.`}
      </p>
    </Modal>
  )
}

export { LevelsInfo }
