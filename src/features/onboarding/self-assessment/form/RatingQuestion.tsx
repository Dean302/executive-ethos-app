"use client"

import * as React from "react"

import { answerKey, type RatingSection } from "@/lib/selfAssessment"

import { QuestionNav } from "./QuestionNav"
import { QuestionSteps } from "./QuestionSteps"
import { QuestionTransition, type Direction } from "./QuestionTransition"
import { RatingScale } from "./RatingScale"

// A pick moves on by itself, after a beat long enough to see it land.
const ADVANCE_DELAY_MS = 280

type RatingQuestionProps = {
  section: RatingSection
  index: number
  value: number | undefined
  direction: Direction
  onRate: (value: number) => void
  onPrevious: () => void
  onNext: () => void
  /** Receives focus when the question changes. */
  questionRef: React.Ref<HTMLParagraphElement>
}

/** One statement rated 1–5, one per screen. */
function RatingQuestion({
  section,
  index,
  value,
  direction,
  onRate,
  onPrevious,
  onNext,
  questionRef,
}: RatingQuestionProps) {
  const questionId = React.useId()
  const advanceTimer = React.useRef<number | null>(null)

  // A pending advance belongs to the question it was made on.
  React.useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    }
  }, [index])

  const rate = (n: number) => {
    onRate(n)
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(onNext, ADVANCE_DELAY_MS)
  }

  return (
    <div>
      <QuestionSteps total={section.questions.length} current={index} />

      <QuestionTransition transitionKey={answerKey(section.id, index)} direction={direction} className="mt-5">
        <div className="bg-card rounded-container border px-6 py-6">
          <span className="font-identifier text-muted-foreground text-sm font-bold">Q{index + 1}</span>
          <p id={questionId} ref={questionRef} tabIndex={-1} className="font-heading mt-2 text-xl outline-none">
            {section.questions[index]}
          </p>
          <div className="mt-5">
            <RatingScale value={value} onChange={rate} labelledBy={questionId} />
          </div>
        </div>
      </QuestionTransition>

      <div className="mt-4 flex items-center justify-between">
        <div className="ml-auto">
          <QuestionNav onPrevious={onPrevious} onNext={onNext} canAdvance={Boolean(value)} />
        </div>
      </div>
    </div>
  )
}

export { RatingQuestion }
