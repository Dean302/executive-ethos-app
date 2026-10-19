import { GOLDEN_CIRCLE_RINGS, type GoldenCircleRing } from "@/lib/selfAssessment"

import { RING_STYLES } from "./goldenCircleStyles"

const CENTER = 120

/** Three nested rings, each filling clockwise as its questions are answered. */
export function GoldenCircleDiagram({
  answered,
  perRing,
  total,
  size = 180,
}: {
  answered: Record<GoldenCircleRing, number>
  perRing: number
  total: number
  size?: number
}) {
  const totalAnswered = GOLDEN_CIRCLE_RINGS.reduce((sum, ring) => sum + answered[ring], 0)

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={`Golden Circle progress: ${totalAnswered} of ${total} questions answered`}
      className="mx-auto"
    >
      {[...GOLDEN_CIRCLE_RINGS].reverse().map((ring) => {
        const { radius, stroke } = RING_STYLES[ring]
        const circumference = 2 * Math.PI * radius
        const fraction = Math.min(1, answered[ring] / perRing)
        return (
          <g key={ring}>
            <circle cx={CENTER} cy={CENTER} r={radius} fill="none" stroke="var(--border)" strokeWidth={4} />
            {fraction > 0 && (
              <circle
                cx={CENTER}
                cy={CENTER}
                r={radius}
                fill="none"
                stroke={stroke}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - fraction)}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
              />
            )}
          </g>
        )
      })}
      <text
        x={CENTER}
        y={CENTER - 6}
        textAnchor="middle"
        fill="var(--primary)"
        fontSize={30}
        fontWeight={700}
        className="font-heading"
      >
        {totalAnswered}
      </text>
      <text
        x={CENTER}
        y={CENTER + 16}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize={10}
        fontWeight={600}
        letterSpacing="0.1em"
      >
        OF {total}
      </text>
    </svg>
  )
}
