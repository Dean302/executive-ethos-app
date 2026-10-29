"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"
import { shortDate } from "@/lib/dates"

export type TrendPoint = {
  /** Wall-clock milliseconds (see lib/dates). */
  at: number
  score: number
  title: string
}

const X_TICKS = 5
const AXIS_TICK = { fontSize: 12, fill: "var(--muted-foreground)" }
const formatTick = (at: number) => shortDate(new Date(at))

type Datum = { at: number; score: number; title: string }

type DotProps = { cx?: number; cy?: number; index?: number; payload?: Datum }

/**
 * Executive Readiness over time: points at their real dates, so a quiet
 * month reads as a gap. A soft wash under the line, the Executive Ready
 * zone as a faint band above its dashed line, and the latest recording
 * called out with the navy score chip.
 */
function ScoreTrend({ points, domain }: { points: TrendPoint[]; domain: [number, number] }) {
  // SVG ids can't hold the colons React puts in useId.
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const data = [...points].sort((a, b) => a.at - b.at)
  const [from, to] = domain
  const xTicks = Array.from({ length: X_TICKS }, (_, i) => Math.round(from + ((to - from) * i) / (X_TICKS - 1)))

  // 15-point steps down from 100, so Executive Ready (85) is always a tick.
  const low = Math.min(40, ...data.map((point) => point.score - 5))
  const yTicks: number[] = []
  for (let value = 100; value >= low; value -= 15) yTicks.push(value)
  const yMin = yTicks[yTicks.length - 1]
  const latest = data[data.length - 1]

  const dot = ({ cx, cy, index, payload }: DotProps) => {
    if (cx == null || cy == null) return <g key={index} />
    if (payload?.at !== latest?.at) {
      return <circle key={index} cx={cx} cy={cy} r={3.5} fill="var(--card)" stroke="var(--chart-3)" strokeWidth={2} />
    }
    return (
      <g key={index}>
        <circle cx={cx} cy={cy} r={10} fill="var(--primary)" opacity={0.12} />
        <circle cx={cx} cy={cy} r={5} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
        <rect x={cx - 52} y={cy - 10} width={34} height={20} rx={10} fill="var(--primary)" />
        <text x={cx - 35} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--accent)">
          {payload.score}
        </text>
      </g>
    )
  }

  return (
    <div className="w-full">
      <div
        role="img"
        aria-label={`Score trend, ${data.length} recordings from ${data[0]?.score ?? 0} to ${latest?.score ?? 0}. Executive Ready is ${EXECUTIVE_READY_SCORE}.`}
        className="h-60 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.34} />
                <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.02} />
              </linearGradient>
              {/* The line deepens from light slate to the primary colour as time moves on. */}
              <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--chart-trend-start)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <ReferenceArea
              y1={EXECUTIVE_READY_SCORE}
              y2={100}
              fill="var(--color-oxblood)"
              fillOpacity={0.05}
              stroke="none"
              ifOverflow="hidden"
              label={{
                value: "Executive Ready",
                position: "insideTopLeft",
                fontSize: 11,
                fontWeight: 600,
                fill: "var(--color-oxblood)",
                offset: 8,
              }}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="at"
              type="number"
              scale="time"
              domain={[from, to]}
              ticks={xTicks}
              interval={0}
              tickFormatter={formatTick}
              tick={AXIS_TICK}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              tickMargin={8}
            />
            <YAxis
              domain={[yMin, 100]}
              ticks={yTicks}
              interval={0}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <ReferenceLine
              y={EXECUTIVE_READY_SCORE}
              stroke="var(--color-oxblood)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as Datum | undefined
                if (!active || !point) return null
                return (
                  <div className="border-border bg-card rounded-inset border px-3.5 py-2.5">
                    <p className="text-foreground text-sm font-medium">{point.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatTick(point.at)} · Score <span className="text-foreground font-medium">{point.score}</span>
                    </p>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill={`url(#${id}-wash)`}
              baseValue={yMin}
              isAnimationActive={false}
              tooltipType="none"
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={`url(#${id}-line)`}
              strokeWidth={2.5}
              dot={dot}
              activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="bg-gradient-trend h-0.5 w-4 rounded-full" />
          Your score
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="border-oxblood h-0 w-4 border-t-[1.5px] border-dashed" />
          Executive Ready target ({EXECUTIVE_READY_SCORE})
        </span>
      </div>
    </div>
  )
}

export { ScoreTrend }
