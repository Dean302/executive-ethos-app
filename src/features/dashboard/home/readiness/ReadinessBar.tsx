"use client"

import * as React from "react"

import { levelFor, LEVELS, type Target } from "@/lib/scores"
import { cn } from "@/lib/utils"

type ReadinessBarProps = {
  score: number
  target: Target | null
}

/**
 * The five levels as one segmented bar, filled up to the score, with a
 * tick at the target. With a mouse, the level names fade in underneath:
 * the current level in gold, the one under the pointer brighter.
 */
function ReadinessBar({ score, target }: ReadinessBarProps) {
  const [hoverAt, setHoverAt] = React.useState<number | null>(null)
  const current = levelFor(score).name
  const pointed = hoverAt === null ? null : levelFor(hoverAt).name

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    setHoverAt(Math.max(0, Math.min(99.9, ((event.clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div className="relative mt-8 mb-4">
      {target && (
        <span
          aria-hidden
          className="text-primary-foreground/80 absolute -top-6 -translate-x-1/2 text-[12px] font-medium whitespace-nowrap"
          style={{ left: `${target.at}%` }}
        >
          {`${target.label === "Executive Ready" ? "Ready" : target.label} · ${target.at}`}
        </span>
      )}

      {/* A taller hit area than the bar itself, so it's easy to find. */}
      <div
        role="img"
        aria-label={`${score} out of 100, ${current}.${target ? ` ${target.label} at ${target.at}.` : ""}`}
        className="relative -my-3 py-3"
        onPointerMove={track}
        onPointerLeave={() => setHoverAt(null)}
      >
        <div className="flex gap-1">
          {LEVELS.map((level) => {
            const span = level.max - level.min
            const fill = Math.max(0, Math.min(1, (score - level.min) / span))
            return (
              <div
                key={level.name}
                className="bg-primary-foreground/15 h-1.5 overflow-hidden rounded-full"
                style={{ width: `${span}%` }}
              >
                <div className="bg-accent h-full" style={{ width: `${fill * 100}%` }} />
              </div>
            )
          })}
        </div>
        {target && (
          <span
            aria-hidden
            className="bg-primary-foreground pointer-events-none absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${target.at}%` }}
          />
        )}
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-4 flex gap-1 opacity-0 transition-opacity duration-200",
          hoverAt !== null && "opacity-100"
        )}
      >
        {LEVELS.map((level) => (
          <span
            key={level.name}
            className={cn(
              "truncate text-[12px] transition-colors",
              level.name === current
                ? "text-accent font-medium"
                : level.name === pointed
                  ? "text-primary-foreground"
                  : "text-muted-on-dark"
            )}
            style={{ width: `${level.max - level.min}%` }}
          >
            {"shortName" in level ? level.shortName : level.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export { ReadinessBar }
