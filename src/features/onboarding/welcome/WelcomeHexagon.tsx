const SIZE = 220
const CENTER = SIZE / 2
const RADIUS = CENTER - 14
const AXES = 6

// Illustrative only, not anyone's scores: varied enough across the six
// criteria to read as a measured shape rather than an empty grid.
const SAMPLE_SCORES = [0.55, 0.82, 0.68, 0.9, 0.6, 0.78]

function axisPoint(axis: number, fraction: number) {
  const angle = (axis / AXES) * Math.PI * 2 - Math.PI / 2
  return {
    x: CENTER + RADIUS * fraction * Math.cos(angle),
    y: CENTER + RADIUS * fraction * Math.sin(angle),
  }
}

const toPoints = (points: { x: number; y: number }[]) =>
  points.map(({ x, y }) => `${x},${y}`).join(" ")

const ring = (fraction: number) =>
  toPoints(Array.from({ length: AXES }, (_, axis) => axisPoint(axis, fraction)))

/** The six-criteria score shape, as a decorative hero for the welcome. */
function WelcomeHexagon() {
  const corners = Array.from({ length: AXES }, (_, axis) => axisPoint(axis, 1))
  const scores = SAMPLE_SCORES.map((fraction, axis) => axisPoint(axis, fraction))

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      aria-hidden
      className="mx-auto block"
    >
      {[0.5, 0.75, 1].map((fraction) => (
        <polygon key={fraction} points={ring(fraction)} fill="none" stroke="var(--border)" strokeWidth={1} />
      ))}
      <polygon
        points={ring(1)}
        fill="var(--primary)"
        fillOpacity={0.06}
        stroke="var(--brand-oxblood)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      <polygon
        points={toPoints(scores)}
        fill="var(--brand-mist)"
        fillOpacity={0.2}
        stroke="var(--brand-mist)"
        strokeWidth={1.5}
      />
      {scores.map(({ x, y }, i) => (
        <circle key={`score-${i}`} cx={x} cy={y} r={2.5} fill="var(--brand-mist)" />
      ))}
      {corners.map(({ x, y }, i) => (
        <circle key={`corner-${i}`} cx={x} cy={y} r={3} fill="var(--brand-oxblood)" />
      ))}
    </svg>
  )
}

export { WelcomeHexagon }
