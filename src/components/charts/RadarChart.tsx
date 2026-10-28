"use client"

import * as React from "react"

import { useReducedMotion } from "@/hooks"

export type RadarDatum = {
  key: string
  label: string
  value: number
}

type RadarChartProps = {
  data: RadarDatum[]
  /** The value at the outer ring. */
  max?: number
  /** Drawn size in px; the chart scales down to fit narrower containers. */
  size?: number
  /** The number at the centre. */
  centerValue: number
  centerCaption: string
  /** Legend and tooltip name for the series. */
  seriesLabel?: string
  /** Stroke and fill of the series polygon. */
  color?: string
}

const RING_FRACTIONS = [0.2, 0.4, 0.6, 0.8, 1]
const LABEL_PAD = 96

/**
 * A single-series radar: one axis per datum, rings at fifths of `max`, the
 * series growing in on mount. Points show a tooltip on hover or focus.
 */
function RadarChart({
  data,
  max = 100,
  size = 440,
  centerValue,
  centerCaption,
  seriesLabel = "Current",
  color = "var(--accent)",
}: RadarChartProps) {
  const reducedMotion = useReducedMotion()
  const [shown, setShown] = React.useState(false)
  const [activeKey, setActiveKey] = React.useState<string | null>(null)

  // Grow the series in on the frame after mounting.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const center = size / 2
  const radius = center - LABEL_PAD
  const angle = (i: number) => (i * Math.PI * 2) / data.length - Math.PI / 2
  const point = (i: number, value: number) => {
    const r = (Math.min(value, max) / max) * radius
    return { x: center + r * Math.cos(angle(i)), y: center + r * Math.sin(angle(i)) }
  }
  const polygon = (values: number[]) =>
    values.map((value, i) => point(i, value)).map(({ x, y }) => `${x},${y}`).join(" ")
  const percent = (value: number) => Math.round((value / max) * 100)

  const activeIndex = data.findIndex((d) => d.key === activeKey)
  const active = activeIndex === -1 ? null : data[activeIndex]
  const visible = shown || reducedMotion

  return (
    <div className="mx-auto flex w-full flex-col items-center" style={{ maxWidth: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full overflow-visible"
        role="img"
        aria-label={`${centerCaption} ${centerValue}. ${data.map((d) => `${d.label}: ${percent(d.value)}%`).join(". ")}`}
      >
        {RING_FRACTIONS.map((fraction) => (
          <polygon
            key={fraction}
            points={polygon(data.map(() => max * fraction))}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        {data.map((d, i) => {
          const end = point(i, max)
          const isActive = d.key === activeKey
          return (
            <line
              key={d.key}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={isActive ? color : "var(--border)"}
              strokeWidth={isActive ? 1.5 : 1}
            />
          )
        })}

        <g
          style={{
            transformOrigin: `${center}px ${center}px`,
            transform: visible ? "scale(1)" : "scale(0)",
            opacity: visible ? 1 : 0,
            transition: reducedMotion
              ? undefined
              : "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out",
          }}
        >
          <polygon
            points={polygon(data.map((d) => d.value))}
            fill={color}
            fillOpacity={0.14}
            stroke={color}
            strokeWidth={2.25}
            strokeLinejoin="round"
          />
          {data.map((d, i) => {
            const p = point(i, d.value)
            return <circle key={d.key} cx={p.x} cy={p.y} r={3.5} fill="var(--primary)" />
          })}
        </g>

        {data.map((d, i) => {
          const x = center + (radius + 40) * Math.cos(angle(i))
          const y = center + (radius + 40) * Math.sin(angle(i))
          const words = d.label.split(" ")
          const middle = Math.ceil(words.length / 2)
          const isActive = d.key === activeKey
          return (
            <text
              key={d.key}
              x={x}
              y={y}
              aria-hidden
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11.5}
              fontWeight={isActive ? 700 : 500}
              fill={isActive ? "var(--foreground)" : "var(--muted-foreground)"}
              onMouseEnter={() => setActiveKey(d.key)}
              onMouseLeave={() => setActiveKey(null)}
            >
              <tspan x={x} dy="-0.35em">
                {words.slice(0, middle).join(" ")}
              </tspan>
              <tspan x={x} dy="1.2em">
                {words.slice(middle).join(" ")}
              </tspan>
            </text>
          )
        })}

        {data.map((d, i) => {
          const p = point(i, d.value)
          const isActive = d.key === activeKey
          return (
            <g key={d.key}>
              {isActive && (
                <circle cx={p.x} cy={p.y} r={7} fill="none" stroke={color} strokeWidth={2} opacity={0.55} />
              )}
              {/* A generous hit area around each point; the dot itself is small. */}
              <circle
                cx={p.x}
                cy={p.y}
                r={10}
                fill="transparent"
                tabIndex={0}
                aria-label={`${d.label}: ${percent(d.value)}%`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setActiveKey(d.key)}
                onMouseLeave={() => setActiveKey(null)}
                onFocus={() => setActiveKey(d.key)}
                onBlur={() => setActiveKey(null)}
              />
            </g>
          )
        })}

        <text
          x={center}
          y={center - 6}
          aria-hidden
          textAnchor="middle"
          fontSize={30}
          fontWeight={600}
          fill="var(--primary)"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {centerValue}
        </text>
        <text
          x={center}
          y={center + 14}
          aria-hidden
          textAnchor="middle"
          fontSize={10}
          letterSpacing="0.08em"
          fill="var(--muted-foreground)"
        >
          {centerCaption}
        </text>

        {active &&
          (() => {
            const p = point(activeIndex, active.value)
            const width = Math.max(150, Math.min(220, active.label.length * 6.4 + 28))
            const height = 42
            const rawX = p.x >= center ? p.x + 14 : p.x - 14 - width
            const rawY = p.y >= center ? p.y - height - 14 : p.y + 14
            const x = Math.min(Math.max(rawX, 4), size - width - 4)
            const y = Math.min(Math.max(rawY, 4), size - height - 4)
            return (
              <g aria-hidden className="pointer-events-none">
                <rect x={x} y={y} width={width} height={height} rx={10} fill="var(--card)" stroke="var(--border)" />
                <text x={x + 14} y={y + 21} fontSize={12.5} fontWeight={600} fill="var(--foreground)">
                  {active.label}
                </text>
                <text x={x + 14} y={y + 37} fontSize={11.5} fill="var(--muted-foreground)">
                  {`${seriesLabel}: ${percent(active.value)}%`}
                </text>
              </g>
            )
          })()}
      </svg>

      <div className="text-muted-foreground mt-1 flex items-center gap-5 text-sm">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-0.5 w-4 rounded-full" style={{ backgroundColor: color }} />
          {seriesLabel}
        </span>
      </div>
    </div>
  )
}

export { RadarChart }
