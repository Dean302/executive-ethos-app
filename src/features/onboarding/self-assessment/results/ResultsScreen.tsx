"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowDown, ArrowRight, ArrowUp, Compass } from "lucide-react"

import { Button } from "@/components/common/button"
import { Card } from "@/components/common/card"
import { RadarChart } from "@/components/charts/RadarChart"
import {
  ASSESSMENT_SECTIONS,
  RATING_QUESTION_COUNT,
  RATING_SECTIONS,
  answerKey,
  isAssessmentComplete,
  lowestRatedStatement,
  overallScore,
  scoreTier,
  sectionScore,
  type ScoreTone,
  type WrittenSection,
} from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

import { submitSelfAssessment } from "../actions"
import { useDraft, useDraftReady } from "../draftStore"
import { RATING_TONES } from "../ratingTones"
import { GoldenCircleAnswers } from "./GoldenCircleAnswers"

const TONE_TEXT: Record<ScoreTone, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
}

/** "…" past `max` characters. */
const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max)}…` : text)

function focusMessage(overall: number) {
  if (overall >= 70) return "This is a strong foundation to build from."
  if (overall >= 50) return "You have clear strengths to leverage and specific areas to sharpen."
  return "There is significant opportunity ahead. The upside is considerable."
}

/** A written section's answers, label over answer. */
function WrittenAnswers({ section, written }: { section: WrittenSection; written: Record<string, string> }) {
  return (
    <Card className="mt-3 text-sm">
      <dl className="flex flex-col gap-4">
        {section.questions.map((question, i) => {
          const answer = written[answerKey(section.id, i)]?.trim()
          return (
            <div key={question.label}>
              <dt className="font-identifier text-muted-foreground text-sm font-semibold">{question.label}</dt>
              <dd
                className={cn(
                  "mt-1 text-[13.5px] leading-relaxed",
                  answer ? "text-foreground" : "text-muted-foreground italic"
                )}
              >
                {answer || "Not provided"}
              </dd>
            </div>
          )
        })}
      </dl>
    </Card>
  )
}

type ResultsScreenProps = {
  /** Where an unfinished assessment is sent back to. */
  formHref: string
  /** Peer invites, next. */
  nextHref: string
}

/** The baseline: scores, strengths, every answer, then submit and continue. */
function ResultsScreen({ formHref, nextHref }: ResultsScreenProps) {
  const router = useRouter()
  const ready = useDraftReady()
  const draft = useDraft()
  const complete = isAssessmentComplete(draft)
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (ready && !complete) router.replace(formHref)
  }, [ready, complete, router, formHref])

  if (!ready || !complete) return null

  const { ratings, written } = draft
  const overall = overallScore(ratings)
  const tier = scoreTier(overall)
  const scored = RATING_SECTIONS.map((section) => ({ section, score: sectionScore(section, ratings) }))
  const ranked = [...scored].sort((a, b) => b.score.percent - a.score.percent)
  const strongest = ranked[0]
  const weakest = ranked[ranked.length - 1]
  const lowest = lowestRatedStatement(ratings)
  const ratedCount = Object.keys(ratings).length
  const goals = ASSESSMENT_SECTIONS.find((s): s is WrittenSection => s.type === "goals")
  const textSections = ASSESSMENT_SECTIONS.filter((s): s is WrittenSection => s.type === "text")

  const submit = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await submitSelfAssessment({ ratings, written })
        if ("error" in result) setError(result.error)
        else router.push(nextHref)
      } catch {
        setError("We couldn't save your assessment. Check your connection and try again.")
      }
    })
  }

  return (
    <div className="w-full">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">Your Baseline</p>
      <h1 className="mt-1.5 text-3xl text-balance">Your Executive Profile</h1>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        <Card>
          <dt className="font-identifier text-muted-foreground text-sm">Overall</dt>
          <dd className="font-heading text-primary mt-1 text-3xl">{overall}%</dd>
        </Card>
        <Card>
          <dt className="font-identifier text-muted-foreground text-sm">Tier</dt>
          <dd className={cn("font-heading mt-1 text-xl", TONE_TEXT[tier.tone])}>{tier.label}</dd>
        </Card>
        <Card>
          <dt className="font-identifier text-muted-foreground text-sm">Rated</dt>
          <dd className="font-heading mt-1 text-xl">
            {ratedCount}
            <span className="text-muted-foreground">{` / ${RATING_QUESTION_COUNT}`}</span>
          </dd>
        </Card>
      </dl>

      <Card className="mt-5 flex items-center justify-center">
        <RadarChart
          data={scored.map(({ section, score }) => ({
            key: section.id,
            label: section.title,
            value: score.percent,
          }))}
          centerValue={overall}
          centerCaption="OVERALL"
        />
      </Card>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="border-success/25">
          <p className="text-success flex items-center gap-1.5 text-sm font-medium">
            <ArrowUp aria-hidden className="size-3.5" strokeWidth={2} />
            Greatest Strength
          </p>
          <p className="font-heading mt-2 text-base">{`${strongest.section.title} · ${strongest.score.percent}%`}</p>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            This is where your executive communication is most reliable. Use it as an anchor while you develop the
            dimensions below it.
          </p>
        </Card>
        <Card className="border-warning/25">
          <p className="text-warning flex items-center gap-1.5 text-sm font-medium">
            <ArrowDown aria-hidden className="size-3.5" strokeWidth={2} />
            Biggest Opportunity
          </p>
          <p className="font-heading mt-2 text-base">{`${weakest.section.title} · ${weakest.score.percent}%`}</p>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            This dimension is your highest-leverage area for growth. Targeted development here compounds across
            everything else.
          </p>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5 mt-3">
        <p className="text-primary flex items-center gap-1.5 text-sm font-medium">
          <Compass aria-hidden className="size-3.5" strokeWidth={2} />
          Programme Focus
        </p>
        <p className="font-heading mt-2 text-base">{focusMessage(overall)}</p>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          {lowest ? (
            <>
              Your lowest-rated statement, &ldquo;<em>{clip(lowest.statement, 100)}</em>,&rdquo; is where your program
              should begin.
            </>
          ) : (
            "Complete all ratings to unlock your focused development recommendation."
          )}
        </p>
      </Card>

      <section className="mt-8">
        <h2 className="text-lg">Section breakdown</h2>
        <div className="mt-3 flex flex-col gap-3">
          {scored.map(({ section, score }) => (
            <Card key={section.id}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm">{section.title}</h3>
                <span className="font-heading text-primary text-sm">{score.percent}%</span>
              </div>
              <div aria-hidden className="bg-secondary mt-2.5 h-1.5 overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${score.percent}%` }} />
              </div>
              <ul className="mt-4 flex flex-col gap-1.5">
                {section.questions.map((statement, i) => {
                  const value = ratings[answerKey(section.id, i)]
                  return (
                    <li key={statement} className="flex items-center justify-between gap-3 text-[12.5px]">
                      <span className="text-muted-foreground" title={statement}>
                        {clip(statement, 74)}
                      </span>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                          value ? RATING_TONES[value as keyof typeof RATING_TONES] : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <span className="sr-only">Rated </span>
                        {value ?? "—"}
                        <span className="sr-only"> of 5</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {goals && (
        <section className="mt-8">
          <h2 className="text-lg">Your commitments</h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {goals.questions.map((question, i) => {
              const answer = written[answerKey(goals.id, i)]?.trim()
              return (
                <Card key={question.label}>
                  <dt className="font-identifier text-muted-foreground text-sm font-semibold">{question.label}</dt>
                  <dd
                    className={cn(
                      "mt-1.5 text-[13.5px] leading-relaxed",
                      answer ? "text-foreground" : "text-muted-foreground italic"
                    )}
                  >
                    {answer || "Not yet provided"}
                  </dd>
                </Card>
              )
            })}
          </dl>
        </section>
      )}

      {textSections.map((section) => (
        <section key={section.id} className="mt-8">
          <h2 className="text-lg">{section.title}</h2>
          {section.questions.some((q) => q.ring) ? (
            <GoldenCircleAnswers section={section} written={written} />
          ) : (
            <WrittenAnswers section={section} written={written} />
          )}
        </section>
      ))}

      {error && (
        <p role="alert" className="text-destructive mt-8 flex items-center justify-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <Button size="lg" onClick={submit} disabled={isPending} className="gap-2">
          {isPending ? (
            "Saving…"
          ) : (
            <>
              Continue
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export { ResultsScreen }
