"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import { cn, roundTo } from "@/lib/utils"

const BARS = 26

/** Speech-like bar heights (0.18–1), the same every time for a given recording. */
function waveform(seed: string) {
  let hash = 2166136261
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  const random = () => {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    return ((hash ^= hash >>> 16) >>> 0) / 4294967296
  }
  return Array.from({ length: BARS }, (_, i) => {
    // Phrases: louder in the middle of each "sentence", quieter between.
    const phrase = 0.55 + 0.45 * Math.sin((i / BARS) * Math.PI * 3 + random())
    return Math.max(0.18, Math.min(1, phrase * (0.45 + random() * 0.75)))
  })
}

const durationSeconds = (duration: string) => Number(duration.match(/\d+/)?.[0] ?? 0) * 60
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`

type RecordingThumbnailProps = {
  /** "38 min". */
  duration: string
  /** When it was recorded, wall-clock milliseconds (see lib/dates). */
  recordedAt: number
  /** Stable per recording (its id), for the waveform. */
  seed: string
}

/**
 * A recording as a square navy tile: the day it happened, its length, and
 * a play button beside a waveform unique to it. While playing, the bars
 * breathe and the length becomes an elapsed timer.
 */
function RecordingThumbnail({ duration, recordedAt, seed }: RecordingThumbnailProps) {
  const [playing, setPlaying] = React.useState(false)
  const [elapsed, setElapsed] = React.useState(0)
  const audioRef = React.useRef<AudioContext | null>(null)
  const toneRef = React.useRef<OscillatorNode | null>(null)
  const tickRef = React.useRef<number | null>(null)
  const bars = React.useMemo(() => waveform(seed), [seed])
  const total = durationSeconds(duration)
  const date = new Date(recordedAt)

  const stop = React.useCallback(() => {
    try {
      toneRef.current?.stop()
    } catch {
      // Already stopped.
    }
    toneRef.current = null
    if (tickRef.current) window.clearInterval(tickRef.current)
    tickRef.current = null
    setPlaying(false)
    setElapsed(0)
  }, [])

  // No audio files are stored yet, so play is a short soft tone that
  // stands in for the recording: the control works (play, stop, the
  // timer, ending by itself) without pretending to play someone's voice.
  // When recordings keep their audio, play that file here instead.
  const toggle = () => {
    if (playing) return stop()
    const context = audioRef.current ?? new AudioContext()
    audioRef.current = context
    const tone = context.createOscillator()
    const gain = context.createGain()
    tone.type = "sine"
    tone.frequency.value = 392
    gain.gain.value = 0.06
    tone.connect(gain).connect(context.destination)
    tone.start()
    tone.stop(context.currentTime + 4)
    tone.onended = () => stop()
    toneRef.current = tone
    const started = performance.now()
    tickRef.current = window.setInterval(() => setElapsed((performance.now() - started) / 1000), 250)
    setPlaying(true)
  }

  // Stop on leaving the page rather than leave a tone running.
  React.useEffect(() => stop, [stop])

  return (
    <div
      role="group"
      aria-label={`Audio recording, ${date.toLocaleDateString("en-US", { timeZone: "UTC", dateStyle: "long" })}, ${duration}`}
      className="from-primary-raised to-primary text-primary-foreground relative flex size-32 shrink-0 flex-col justify-between overflow-hidden rounded-panel bg-linear-to-br p-3.5 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--primary-foreground)_6%,transparent)] sm:size-40 sm:p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="leading-none">
          <p className="text-accent text-[11px] font-semibold tracking-[0.06em] uppercase sm:text-xs">
            {date.toLocaleDateString("en-US", { timeZone: "UTC", month: "short" })}
          </p>
          <p className="mt-1 font-sans text-[34px] leading-none font-light tabular-nums sm:text-[44px]">
            {date.getUTCDate()}
          </p>
        </div>
        {playing ? (
          <span aria-live="polite" className="text-right leading-tight whitespace-nowrap tabular-nums">
            <span className="text-primary-foreground block text-xs sm:text-[13px]">{clock(elapsed)}</span>
            <span className="text-muted-on-dark block text-[11px] sm:text-xs">of {clock(total)}</span>
          </span>
        ) : (
          <span className="text-muted-on-dark text-xs whitespace-nowrap tabular-nums sm:text-[13px]">{duration}</span>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Stop playback" : "Play recording"}
          aria-pressed={playing}
          className={cn(
            "border-accent focus-visible:ring-ring/50 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] transition-colors outline-none focus-visible:ring-3 sm:size-10",
            playing ? "bg-accent" : "hover:bg-accent/15"
          )}
        >
          {playing ? (
            <Pause aria-hidden className="fill-primary text-primary size-3.5 sm:size-4" strokeWidth={0} />
          ) : (
            <Play aria-hidden className="fill-accent text-accent size-3.5 translate-x-px sm:size-4" strokeWidth={0} />
          )}
        </button>
        <svg aria-hidden viewBox={`0 0 ${BARS * 3} 24`} preserveAspectRatio="none" className="h-6 min-w-0 flex-1 sm:h-7">
          {bars.map((level, i) => {
            // Rounded so server and browser renders agree.
            const height = roundTo(level * 22)
            return (
              <rect
                key={i}
                x={i * 3}
                y={roundTo((24 - height) / 2)}
                width={1.6}
                height={height}
                rx={0.8}
                className={cn(
                  "wave-bar transition-[fill,opacity] duration-200",
                  playing ? "fill-accent wave-bar-playing" : "fill-muted-on-dark"
                )}
                style={{ opacity: playing ? 0.9 : 0.35, animationDelay: `${(i % 7) * 0.11}s` }}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export { RecordingThumbnail }
