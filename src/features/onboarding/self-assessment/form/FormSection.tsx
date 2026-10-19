"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  ASSESSMENT_SECTIONS,
  answerKey,
  answeredCount,
  isAnswered,
  sectionIndexOf,
  type AssessmentAnswers,
} from "@/lib/selfAssessment"

import { OnboardingShell } from "../../OnboardingShell"
import { draftActions, readDraft, useDraft, useDraftReady } from "../draftStore"
import { AssessmentProgress } from "./AssessmentProgress"
import { type Direction } from "./QuestionTransition"
import { RatingQuestion } from "./RatingQuestion"
import { SectionIntroDialog } from "./SectionIntroDialog"
import { WrittenQuestion } from "./WrittenQuestion"

/** The first unanswered question across the whole assessment. */
function firstOpenQuestion(answers: AssessmentAnswers) {
  for (const [sectionIndex, section] of ASSESSMENT_SECTIONS.entries()) {
    const index = section.questions.findIndex((_, i) => !isAnswered(section, i, answers))
    if (index !== -1) return { sectionIndex, index }
  }
  return null
}

type FormSectionProps = {
  sectionId: string
  /** Each section's page, keyed by section id. */
  sectionHrefs: Record<string, string>
  /** Where Back goes from the very first question. */
  pickerHref: string
  /** Where the last answer leads: the mission statement. */
  finishHref: string
}

/**
 * One section of the self-assessment form, one question per screen. A
 * question must be answered before moving past it, and sections can't be
 * skipped ahead to; going back is always allowed.
 */
function FormSection({ sectionId, sectionHrefs, pickerHref, finishHref }: FormSectionProps) {
  const router = useRouter()
  const ready = useDraftReady()
  const draft = useDraft()
  const [direction, setDirection] = React.useState<Direction>("forward")
  // What takes focus on each new question: the statement being rated, or
  // the box to write in.
  const questionRef = React.useRef<HTMLParagraphElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const hasMoved = React.useRef(false)

  const sectionIndex = sectionIndexOf(sectionId)
  const section = ASSESSMENT_SECTIONS[sectionIndex]
  const firstOpen = firstOpenQuestion(draft)
  const aheadOfProgress = firstOpen !== null && firstOpen.sectionIndex < sectionIndex

  // Resume where the lead left off, but never past their first unanswered
  // question in this section.
  const savedIndex = draft.position?.sectionId === sectionId ? draft.position.index : 0
  const openIndex = section.questions.findIndex((_, i) => !isAnswered(section, i, draft))
  const index = Math.min(savedIndex, openIndex === -1 ? section.questions.length - 1 : openIndex)

  // Arriving at a section with earlier ones unfinished: go back to them.
  React.useEffect(() => {
    if (ready && aheadOfProgress && firstOpen) {
      router.replace(sectionHrefs[ASSESSMENT_SECTIONS[firstOpen.sectionIndex].id])
    }
  }, [ready, aheadOfProgress, firstOpen, router, sectionHrefs])

  // Land focus on each new question so it's read out. Not on arrival.
  React.useEffect(() => {
    if (hasMoved.current) (textareaRef.current ?? questionRef.current)?.focus()
  }, [index])

  // Reads the store fresh: a delayed auto-advance would otherwise see the
  // answers from before its own pick.
  const goTo = (target: number) => {
    const answers = readDraft()
    if (target > index && !isAnswered(section, index, answers)) return
    hasMoved.current = true
    setDirection(target > index ? "forward" : "backward")

    if (target < 0) {
      const previous = ASSESSMENT_SECTIONS[sectionIndex - 1]
      if (!previous) return router.push(pickerHref)
      draftActions.moveTo(previous.id, previous.questions.length - 1)
      return router.push(sectionHrefs[previous.id])
    }
    if (target >= section.questions.length) {
      const next = ASSESSMENT_SECTIONS[sectionIndex + 1]
      if (!next) return router.push(finishHref)
      draftActions.moveTo(next.id, 0)
      return router.push(sectionHrefs[next.id])
    }
    draftActions.moveTo(section.id, target)
  }

  if (!ready || aheadOfProgress) return null

  const isFinalQuestion = sectionIndex === ASSESSMENT_SECTIONS.length - 1 && index === section.questions.length - 1

  const progress = ASSESSMENT_SECTIONS.map((s) => ({
    id: s.id,
    title: s.title,
    shortTitle: s.shortTitle,
    subtitle: s.subtitle,
    total: s.questions.length,
    answered: answeredCount(s, draft),
  }))

  return (
    <OnboardingShell
      banner={<AssessmentProgress sections={progress} currentSectionId={section.id} currentQuestionIndex={index} />}
    >
      <SectionIntroDialog
        section={section}
        open={!draft.seenIntros.includes(section.id)}
        onDismiss={() => draftActions.markIntroSeen(section.id)}
        finalFocus={section.type === "rating" ? questionRef : textareaRef}
      />
      <div className="mx-auto w-full max-w-2xl pb-20">
        {section.type === "rating" && (
          <RatingQuestion
            section={section}
            index={index}
            value={draft.ratings[answerKey(section.id, index)]}
            direction={direction}
            onRate={(value) => draftActions.rate(answerKey(section.id, index), value)}
            onPrevious={() => goTo(index - 1)}
            onNext={() => goTo(index + 1)}
            questionRef={questionRef}
          />
        )}
        {section.type !== "rating" && (
          <WrittenQuestion
            section={section}
            index={index}
            answers={draft.written}
            direction={direction}
            onChange={(value) => draftActions.write(answerKey(section.id, index), value)}
            onJump={goTo}
            onPrevious={() => goTo(index - 1)}
            onNext={() => goTo(index + 1)}
            finishLabel={isFinalQuestion ? "Build My Statement" : undefined}
            textareaRef={textareaRef}
          />
        )}
      </div>
    </OnboardingShell>
  )
}

export { FormSection }
