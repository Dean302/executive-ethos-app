"use client"

import * as React from "react"
import { Check, Play } from "lucide-react"

import { useReducedMotion, type RecorderStatus } from "@/hooks"
import { cn, roundTo } from "@/lib/utils"

const TICK_COUNT = 56
const SIZE = 280
const CENTER = SIZE / 2
const BUTTON_DIAMETER = 128
const TICK_INNER = BUTTON_DIAMETER / 2 + 16
const MAX_LENGTH = CENTER - 6 - TICK_INNER
const REST_LENGTH = MAX_LENGTH * 0.16
/** Every eighth tick is a gold marker, like the hours on a dial. */
const MARKER_EVERY = 8

const ANGLES = Array.from({ length: TICK_COUNT }, (_, i) => (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2)

function tickEnd(angle: number, length: number) {
  const radius = TICK_INNER + Math.max(4, length)
  return { x2: roundTo(CENTER + radius * Math.cos(angle)), y2: roundTo(CENTER + radius * Math.sin(angle)) }
}

type CircularRecorderProps = {
  status: RecorderStatus
  analyser: AnalyserNode | null
  onToggle: () => void
}

/**
 * The app's recording control: one large navy button ringed by a radial
 * waveform that follows the microphone while recording. It never turns
 * alarm-red; a soft pulse ring says "live" instead.
 */
function CircularRecorder({ status, analyser, onToggle }: CircularRecorderProps) {
  const ticks = React.useRef<(SVGLineElement | null)[]>([])
  const recording = status === "recording"
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const lengths = new Array<number>(TICK_COUNT).fill(REST_LENGTH)
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
    let frame = 0

    const draw = () => {
      if (recording && analyser && data) {
        analyser.getByteFrequencyData(data)
        const step = Math.max(1, Math.floor(data.length / TICK_COUNT))
        for (let i = 0; i < TICK_COUNT; i++) {
          const level = Math.max(0.08, data[i * step] / 255) * MAX_LENGTH
          lengths[i] = reduceMotion ? level : lengths[i] * 0.6 + level * 0.4
        }
      } else {
        for (let i = 0; i < TICK_COUNT; i++) lengths[i] = lengths[i] * 0.85 + REST_LENGTH * 0.15
      }

      ticks.current.forEach((tick, i) => {
        if (!tick) return
        const { x2, y2 } = tickEnd(ANGLES[i], lengths[i])
        tick.setAttribute("x2", String(x2))
        tick.setAttribute("y2", String(y2))
        tick.style.opacity = String(recording ? 0.55 + (lengths[i] / MAX_LENGTH) * 0.45 : 0.55)
      })

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [recording, analyser, reduceMotion])

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg aria-hidden viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 size-full">
        {ANGLES.map((angle, i) => (
          <line
            key={i}
            ref={(element) => {
              ticks.current[i] = element
            }}
            x1={roundTo(CENTER + TICK_INNER * Math.cos(angle))}
            y1={roundTo(CENTER + TICK_INNER * Math.sin(angle))}
            {...tickEnd(angle, REST_LENGTH)}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.55}
            className={cn(
              "transition-[stroke] duration-300",
              i % MARKER_EVERY === 0 ? "stroke-accent" : recording ? "stroke-primary" : "stroke-border"
            )}
          />
        ))}
      </svg>
      <button
        type="button"
        onClick={onToggle}
        disabled={status === "requesting" || status === "stopped"}
        aria-label={recording ? "Stop recording" : "Start recording"}
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring/50 absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-[transform,background-color] outline-none focus-visible:ring-4 active:scale-95 disabled:cursor-default disabled:hover:bg-primary",
          recording && "record-pulse"
        )}
        style={{ width: BUTTON_DIAMETER, height: BUTTON_DIAMETER }}
      >
        {recording && <span className="size-7 rounded-[7px] bg-current" />}
        {status === "stopped" && <Check aria-hidden className="size-9" strokeWidth={1.75} />}
        {(status === "idle" || status === "requesting" || status === "error") && (
          <Play
            aria-hidden
            className={cn("size-9 fill-current", status === "requesting" && "opacity-50")}
            strokeWidth={0}
          />
        )}
      </button>
    </div>
  )
}

export { CircularRecorder }
