"use client"

import * as React from "react"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/common/button"
import { Textarea } from "@/components/common/textarea"
import {
  GOLDEN_CIRCLE_RINGS,
  WRITTEN_ANSWER_MAX_LENGTH,
  answerKey,
  type GoldenCircleRing,
  type WrittenSection,
} from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

import { GoldenCircleProgress } from "./GoldenCircleProgress"
import { PreviousQuestionButton, QuestionNav } from "./QuestionNav"
import { QuestionSteps } from "./QuestionSteps"
import { QuestionTransition, type Direction } from "./QuestionTransition"

type WrittenQuestionProps = {
  section: WrittenSection
  index: number
  /** This section's written answers, keyed by answerKey. */
  answers: Record<string, string>
  direction: Direction
  onChange: (value: string) => void
  /** Jump back to an earlier, answered question in this section. */
  onJump: (index: number) => void
  onPrevious: () => void
  onNext: () => void
  /** The assessment's last question: Next becomes the finishing button. */
  finishLabel?: string
  /** Receives focus when the question changes. */
  textareaRef: React.Ref<HTMLTextAreaElement>
}

/** One written answer per screen. Goal-setting sits on navy. */
function WrittenQuestion({
  section,
  index,
  answers,
  direction,
  onChange,
  onJump,
  onPrevious,
  onNext,
  finishLabel,
  textareaRef,
}: WrittenQuestionProps) {
  const promptId = React.useId()
  const hintId = React.useId()
  const question = section.questions[index]
  const value = answers[answerKey(section.id, index)] ?? ""
  const answered = value.trim().length > 0
  const onNavy = section.type === "goals"

  const ringQuestions = section.questions.filter((q) => q.ring)
  const isGoldenCircle = ringQuestions.length > 0
  const answeredByRing = Object.fromEntries(
    GOLDEN_CIRCLE_RINGS.map((ring) => [
      ring,
      section.questions.filter((q, i) => q.ring === ring && answers[answerKey(section.id, i)]?.trim()).length,
    ])
  ) as Record<GoldenCircleRing, number>

  return (
    <div>
      {isGoldenCircle && question.ring ? (
        <GoldenCircleProgress
          answered={answeredByRing}
          perRing={ringQuestions.length / GOLDEN_CIRCLE_RINGS.length}
          total={ringQuestions.length}
          currentRing={question.ring}
        />
      ) : (
        <QuestionSteps total={section.questions.length} current={index} />
      )}

      {index > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {section.questions.slice(0, index).map((previous, i) =>
            answers[answerKey(section.id, i)] ? (
              <button
                key={previous.label}
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Edit your answer: ${previous.label}`}
                className="border-success/30 bg-success/10 text-success hover:bg-success/15 focus-visible:ring-ring/50 flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors outline-none focus-visible:ring-3"
              >
                <Check aria-hidden className="size-3" strokeWidth={2.5} />
                {previous.label}
              </button>
            ) : null
          )}
        </div>
      )}

      <QuestionTransition transitionKey={answerKey(section.id, index)} direction={direction} className="mt-5">
        <div className={cn("rounded-container px-6 py-6", onNavy ? "bg-primary" : "bg-card border")}>
          <p className={cn("text-sm font-bold", onNavy ? "text-accent" : "text-muted-foreground")}>{question.label}</p>
          <p
            id={promptId}
            className={cn("font-heading mt-2 text-xl", onNavy ? "text-primary-foreground" : "text-foreground")}
          >
            {question.prompt}
          </p>
          <Textarea
            ref={textareaRef}
            aria-labelledby={promptId}
            aria-describedby={hintId}
            value={value}
            maxLength={WRITTEN_ANSWER_MAX_LENGTH}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              onNavy ? "Write it plainly and specifically…" : "Be direct. The most useful answers are the most honest ones…"
            }
            className={cn(
              "mt-4 min-h-[100px] px-4 py-3 text-[13.5px] leading-relaxed transition-colors",
              onNavy &&
                "text-primary-foreground focus:border-accent border-white/15 bg-white/[0.07] placeholder:text-white/30 placeholder:not-italic focus:bg-white/10"
            )}
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <span className={onNavy ? "text-white/70" : "text-foreground/70"}>
              {value && `${value.length} characters`}
            </span>
            <span id={hintId} className={cn("text-right italic", onNavy ? "text-white/45" : "text-muted-foreground")}>
              {question.hint}
            </span>
          </div>
        </div>
      </QuestionTransition>

      <div className="mt-4 flex items-center justify-between">
        {finishLabel ? (
          <>
            <PreviousQuestionButton onClick={onPrevious} />
            <Button disabled={!answered} onClick={onNext} className="gap-1.5">
              {finishLabel}
              <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
            </Button>
          </>
        ) : (
          <div className="ml-auto">
            <QuestionNav onPrevious={onPrevious} onNext={onNext} canAdvance={answered} />
          </div>
        )}
      </div>
    </div>
  )
}

export { WrittenQuestion }
