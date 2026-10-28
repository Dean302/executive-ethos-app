"use client"

import Link from "next/link"
import { Popover } from "@base-ui/react/popover"
import { ArrowRight, Lock, LockOpen } from "lucide-react"

import { BUSINESS_ASSESSMENT, LEADERSHIP_OS } from "@/components/navigation/navItems"
import { cn } from "@/lib/utils"

const Icon = LEADERSHIP_OS.icon

type LeadershipOsItemProps = {
  unlocked: boolean
  active: boolean
  /** Business Assessment progress, 0–100. */
  percent: number
  activeClass: string
  inactiveClass: string
}

/**
 * Leadership OS, nested under Business Assessment with an elbow
 * connector. Locked, it explains itself in a popover (on hover, focus or
 * click): the benefit first, then what unlocks it.
 */
function LeadershipOsItem({ unlocked, active, percent, activeClass, inactiveClass }: LeadershipOsItemProps) {
  const row = "mt-0.5 flex w-full items-center gap-2.5 rounded-full px-2.5 py-1.5 text-left text-sm font-medium transition-colors"

  return (
    <div className="relative pl-[30px]">
      <span
        aria-hidden
        className="border-primary-foreground/25 pointer-events-none absolute top-[-8px] left-[17px] h-[26px] w-[13px] rounded-bl-[10px] border-b border-l"
      />
      {unlocked ? (
        <Link
          href={LEADERSHIP_OS.href}
          aria-current={active ? "page" : undefined}
          className={cn(row, active ? activeClass : inactiveClass)}
        >
          <Icon aria-hidden className="size-4" strokeWidth={1.75} />
          <span className="flex-1">{LEADERSHIP_OS.label}</span>
          <span className="bg-oxblood flex size-5 shrink-0 items-center justify-center rounded-full">
            <LockOpen aria-label="Unlocked" className="text-primary-foreground size-3" strokeWidth={2.25} />
          </span>
        </Link>
      ) : (
        <Popover.Root>
          <Popover.Trigger
            openOnHover
            delay={0}
            closeDelay={200}
            className={cn(
              row,
              "text-primary-foreground/45 hover:bg-primary-hover hover:text-primary-foreground/75 focus-visible:ring-ring/50 cursor-pointer outline-none focus-visible:ring-3"
            )}
          >
            <Icon aria-hidden className="size-4" strokeWidth={1.75} />
            <span className="flex-1">{LEADERSHIP_OS.label}</span>
            <Lock aria-label="Locked" className="size-3.5 shrink-0" strokeWidth={2} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="right" sideOffset={14} className="z-50">
              <Popover.Popup className="border-border bg-card text-foreground data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 w-72 rounded-panel border p-4 duration-100 outline-none">
                <Popover.Arrow className="border-border bg-card size-3 rotate-45 border-b border-l data-[side=right]:-left-1.5" />
                <Popover.Title className="flex items-center gap-1.5 text-sm font-semibold">
                  <Lock aria-hidden className="size-3.5" strokeWidth={2} />
                  Leadership OS unlocks next
                </Popover.Title>
                <Popover.Description className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  Run your leadership team from one plan: shared quarterly priorities, a weekly scorecard and one
                  list of issues to solve, all built from your own answers.
                </Popover.Description>
                <div className="mt-3">
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>{BUSINESS_ASSESSMENT.label}</span>
                    <span className="tabular-nums">{`${percent}% done`}</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label="Business Assessment progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    className="bg-secondary mt-1 h-1.5 overflow-hidden rounded-full"
                  >
                    <div className="bg-accent h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
                <Link
                  href={BUSINESS_ASSESSMENT.href}
                  className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                >
                  {percent > 0 ? "Finish the assessment to unlock" : "Start the assessment to unlock"}
                  <ArrowRight aria-hidden className="size-3.5" strokeWidth={2} />
                </Link>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  )
}

export { LeadershipOsItem }
