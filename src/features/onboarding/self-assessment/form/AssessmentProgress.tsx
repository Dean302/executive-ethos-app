"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { SECONDS_PER_QUESTION } from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

export type SectionProgress = {
  id: string
  title: string
  shortTitle: string
  subtitle: string
  total: number
  answered: number
}

const EYEBROW = "text-xs font-semibold tracking-[0.06em] uppercase"

const MOBILE_QUERY = "(max-width: 639px)"
function subscribeToMobile(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}
function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  return (
    <div aria-hidden className="relative flex size-10 shrink-0 items-center justify-center">
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle
          cx={20}
          cy={20}
          r={radius}
          fill="none"
          stroke="var(--primary-foreground)"
          strokeOpacity={0.15}
          strokeWidth={3}
        />
        <circle
          cx={20}
          cy={20}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
          className="transition-all duration-500"
        />
      </svg>
      <span className="font-heading text-accent absolute text-sm tabular-nums">{percent}%</span>
    </div>
  )
}

type AssessmentProgressProps = {
  sections: SectionProgress[]
  currentSectionId: string
  /** The question showing now, within the current section. */
  currentQuestionIndex: number
}

/**
 * The self-assessment's navy banner: overall progress, the current
 * section, and the section rail. Scrolling past it on desktop pins a slim
 * bar in its place; on phones it starts slim and expands on demand.
 */
function AssessmentProgress({ sections, currentSectionId, currentQuestionIndex }: AssessmentProgressProps) {
  const isMobile = useIsMobile()
  const [scrolledPast, setScrolledPast] = React.useState(false)
  const [mobileCollapsed, setMobileCollapsed] = React.useState(true)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const fullRef = React.useRef<HTMLDivElement>(null)
  const fullId = React.useId()

  // Desktop: collapse once the full banner has scrolled out of view.
  React.useEffect(() => {
    if (isMobile) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setScrolledPast(!entry.isIntersecting))
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isMobile])

  const collapsed = isMobile ? mobileCollapsed : scrolledPast

  const totalAnswered = sections.reduce((sum, section) => sum + section.answered, 0)
  const totalQuestions = sections.reduce((sum, section) => sum + section.total, 0)
  const percent = totalQuestions ? Math.round((totalAnswered / totalQuestions) * 100) : 0
  const remaining = totalQuestions - totalAnswered
  const minutesLeft = Math.max(1, Math.round((remaining * SECONDS_PER_QUESTION) / 60))
  const currentIndex = sections.findIndex((section) => section.id === currentSectionId)
  const current = sections[currentIndex]
  if (!current) return null

  const expand = () => {
    if (isMobile) setMobileCollapsed(false)
    else fullRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <div
        ref={fullRef}
        id={fullId}
        className={cn("bg-primary w-full", isMobile && collapsed && "hidden")}
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex items-center justify-between gap-2 pt-4">
            <div className="flex items-center gap-2">
              <Image src="/brand/logo-icon-gold.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
              <p className={cn(EYEBROW, "text-primary-foreground/80")}>Executive Profile</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <ProgressRing percent={percent} />
              <button
                type="button"
                onClick={() => setMobileCollapsed(true)}
                aria-label="Collapse progress"
                aria-expanded
                aria-controls={fullId}
                className="text-primary-foreground/55 hover:text-primary-foreground flex size-6 shrink-0 cursor-pointer items-center justify-center transition-colors sm:hidden"
              >
                <ChevronDown aria-hidden className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className={cn(EYEBROW, "text-accent")}>
              Section {currentIndex + 1} of {sections.length}
            </p>
            <p className="text-primary-foreground/60 shrink-0 text-sm tabular-nums">
              {remaining > 0
                ? `${totalAnswered} of ${totalQuestions} · ~${minutesLeft} min`
                : `${totalAnswered} of ${totalQuestions}`}
            </p>
          </div>
          <h2 className="text-primary-foreground mt-1.5 text-[28px] leading-tight text-balance sm:text-[32px]">
            {current.title}
          </h2>
          <p className="text-primary-foreground/70 mt-1.5 max-w-2xl text-sm">{current.subtitle}</p>

          <div aria-hidden className="mt-5 flex gap-px">
            {sections.map((section, i) => (
              <div
                key={section.id}
                className={cn(
                  "h-[3px] flex-1 rounded-full",
                  i < currentIndex ? "bg-success" : i === currentIndex ? "bg-accent" : "bg-primary-foreground/15"
                )}
              />
            ))}
          </div>
          <ol aria-label="Sections" className="scrollbar-none mt-3 flex gap-10 overflow-x-auto pb-3">
            {sections.map((section, i) => {
              const done = i < currentIndex
              const isCurrent = i === currentIndex
              return (
                <li key={section.id} aria-current={isCurrent ? "step" : undefined} className="shrink-0">
                  <span
                    className={cn(
                      "block text-sm tracking-[0.1em] tabular-nums",
                      isCurrent ? "text-accent" : done ? "text-success-on-dark" : "text-primary-foreground/40"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-sm whitespace-nowrap",
                      isCurrent
                        ? "text-primary-foreground font-semibold"
                        : done
                          ? "text-success-on-dark"
                          : "text-primary-foreground/45"
                    )}
                  >
                    {section.shortTitle}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div ref={sentinelRef} className="h-px" />

      <div
        aria-hidden={!collapsed}
        className={cn(
          "bg-primary sticky top-0 z-30 w-full overflow-hidden transition-[height,opacity] duration-200",
          collapsed ? "h-14 opacity-100" : "invisible h-0 opacity-0"
        )}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-5 sm:px-8">
          <div className="min-w-0 flex-1">
            <p className={cn(EYEBROW, "text-accent")}>
              Section {currentIndex + 1} · Q{currentQuestionIndex + 1} of {current.total}
            </p>
            <p className="font-heading text-primary-foreground truncate text-[15px]">{current.title}</p>
          </div>
          <div aria-hidden className="flex shrink-0 items-center gap-[3px]">
            {Array.from({ length: current.total }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full",
                  i < currentQuestionIndex
                    ? "bg-success"
                    : i === currentQuestionIndex
                      ? "bg-accent"
                      : "bg-primary-foreground/20"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={expand}
            aria-label="Show full progress"
            aria-expanded={false}
            aria-controls={fullId}
            className="text-primary-foreground/55 hover:text-primary-foreground flex size-6 shrink-0 cursor-pointer items-center justify-center transition-colors"
          >
            <ChevronDown aria-hidden className="size-4 -rotate-180" strokeWidth={2} />
          </button>
        </div>
        <div aria-hidden className="bg-primary-foreground/15 absolute inset-x-0 bottom-0 h-[2px]">
          <div className="bg-accent h-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </>
  )
}

export { AssessmentProgress }
