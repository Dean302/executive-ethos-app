"use client"

import * as React from "react"

import { LoadingVeil } from "@/components/common/loading-veil"
import { Trend } from "@/components/common/trend"
import { cn } from "@/lib/utils"

import { RadarChart } from "./RadarChart"

export type BreakdownItem = {
  key: string
  label: string
  /** 0–10. */
  current: number
  /** 0–10. */
  goal: number
  /** The same criterion at the comparison point, 0–10; null when there's nothing to compare with. */
  previous: number | null
}

type RadarBreakdownProps = {
  items: BreakdownItem[]
  /** What the changes compare against, e.g. "vs previous recording". */
  compareLabel?: string
  /** Under the radar's centre number, e.g. "LATEST". */
  caption: string
  /** While a new view settles: the loader over the radar, the list dimmed. */
  settling?: boolean
}

/**
 * The radar beside its "Performance breakdown": each criterion as a gold
 * bar with its change, and the greatest strength. Hovering a point or a
 * row highlights both.
 */
function RadarBreakdown({ items, compareLabel, caption, settling = false }: RadarBreakdownProps) {
  const [hovered, setHovered] = React.useState<string | null>(null)
  const strongest = [...items].sort((a, b) => b.current - a.current)[0]
  const overall = Math.round((items.reduce((sum, item) => sum + item.current, 0) / items.length) * 10)
  const comparing = items.some((item) => item.previous !== null)

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[3fr_2fr]">
      <LoadingVeil active={settling} label="Updating chart">
        <RadarChart
          size={560}
          max={10}
          centerValue={overall}
          centerCaption={caption}
          data={items.map(({ key, label, current, goal }) => ({ key, label, value: current, goal }))}
          hoveredKey={hovered}
          onHoveredKeyChange={setHovered}
        />
      </LoadingVeil>

      <div className={cn("flex flex-col gap-5 transition-opacity duration-300", settling && "opacity-25")}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-muted-foreground font-sans text-sm font-medium">Performance breakdown</h3>
          {comparing && compareLabel && <p className="text-muted-foreground shrink-0 text-sm">{compareLabel}</p>}
        </div>
        {items.map((item) => {
          const percent = Math.round(item.current * 10)
          const change = item.previous === null ? null : Math.round((item.current - item.previous) * 10)
          return (
            <div
              key={item.key}
              className={cn("-mx-2.5 rounded-inset px-2.5 py-1 transition-colors", hovered === item.key && "bg-secondary")}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="flex items-baseline gap-2.5">
                  {change !== null && <Trend value={change} />}
                  <span className="text-primary w-10 text-right text-base">{`${percent}%`}</span>
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={item.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="bg-secondary mt-1.5 h-1.5 overflow-hidden rounded-full"
              >
                <div className="bg-accent h-full rounded-full" style={{ width: `${percent}%` }} />
              </div>
            </div>
          )
        })}
        {strongest && (
          <div className="border-border mt-2 flex items-center justify-between gap-3 border-t pt-4 text-sm">
            <span className="text-muted-foreground">Greatest strength</span>
            <span className="text-primary font-medium">{strongest.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export { RadarBreakdown }
