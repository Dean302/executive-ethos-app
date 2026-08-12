"use client"

import { Check, ChevronRight } from "lucide-react"

import {
  GOLDEN_CIRCLE_NOTE,
  GOLDEN_CIRCLE_QUESTIONS,
  GOLDEN_CIRCLE_RINGS,
} from "@/features/onboarding/data"
import { cn } from "@/lib/utils"

const PER_RING = GOLDEN_CIRCLE_QUESTIONS.length / GOLDEN_CIRCLE_RINGS.length

/** Concentric rings — each fills as its three questions are answered. */
function Rings({ answered, current }: { answered: number; current: number }) {
  const stroke = (ring: number) =>
    answered >= ring * PER_RING
      ? "var(--brand-gold)"
      : current === ring
        ? "var(--gold-45)"
        : "var(--border)"

  return (
    <svg width="148" height="148" viewBox="0 0 148 148" aria-hidden>
      <circle cx="74" cy="74" r="68" fill="none" stroke={stroke(3)} strokeWidth="2.5" />
      <circle cx="74" cy="74" r="50" fill="none" stroke={stroke(2)} strokeWidth="2.5" />
      <circle cx="74" cy="74" r="32" fill="none" stroke={stroke(1)} strokeWidth="3" />
      <text
        x="74"
        y="70"
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize="22"
        fontWeight="700"
      >
        {answered}
      </text>
      <text
        x="74"
        y="85"
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize="9"
        letterSpacing="0.08em"
      >
        OF {GOLDEN_CIRCLE_QUESTIONS.length}
      </text>
    </svg>
  )
}

function GoldenCirclePanel({ answered }: { answered: number }) {
  const current = Math.min(Math.floor(answered / PER_RING) + 1, 3)

  return (
    <aside className="bg-background border-border hidden w-[400px] shrink-0 flex-col overflow-y-auto border-l px-6 py-6 xl:flex">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase">
          Golden Circle
        </h2>
        <ChevronRight className="text-muted-foreground size-5" />
      </div>

      <div className="mb-6 flex justify-center">
        <Rings answered={answered} current={current} />
      </div>

      <div className="flex flex-col gap-2">
        {GOLDEN_CIRCLE_RINGS.map((ring) => {
          const done = answered >= ring.ring * PER_RING
          const active = current === ring.ring
          const lit = done || active

          return (
            <div
              key={ring.ring}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                active ? "bg-card border-border" : "border-transparent"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full font-serif text-[11px] font-bold",
                  done
                    ? "bg-accent text-card"
                    : active
                      ? "bg-accent/15 text-accent"
                      : "bg-foreground/[0.08] text-muted-foreground/60"
                )}
              >
                {ring.label[0]}
              </span>

              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[13px] font-semibold",
                    lit ? "text-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {ring.label}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    lit ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {ring.subtitle}
                </p>
              </div>

              {done && (
                <span className="bg-accent text-card ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-muted-foreground mt-auto pt-5 text-xs leading-[18px]">
        {GOLDEN_CIRCLE_NOTE}
      </p>
    </aside>
  )
}

export { GoldenCirclePanel }
