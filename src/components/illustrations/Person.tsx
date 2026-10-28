import * as React from "react"

type PersonProps = {
  cx: number
  cy: number
  r: number
  /** Fill of the disc. */
  className: string
  /** Fill of the head and shoulders. */
  figureClassName: string
  /** Stroke of the outline ring, if any. */
  ringClassName?: string
}

/** A person as an avatar inside an illustration's SVG: head and shoulders clipped to the circle. */
function Person({ cx, cy, r, className, figureClassName, ringClassName }: PersonProps) {
  const id = React.useId()
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} className={className} />
      <g clipPath={`url(#${id})`} className={figureClassName}>
        <circle cx={cx} cy={cy - r * 0.18} r={r * 0.34} />
        <ellipse cx={cx} cy={cy + r * 0.82} rx={r * 0.62} ry={r * 0.5} />
      </g>
      {ringClassName && <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth={2.5} className={ringClassName} />}
    </g>
  )
}

export { Person }
