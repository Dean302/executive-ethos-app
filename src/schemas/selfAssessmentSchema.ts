import { z } from "zod"

import {
  ASSESSMENT_SECTIONS,
  RATING_VALUES,
  WRITTEN_ANSWER_MAX_LENGTH,
  answerKey,
} from "@/lib/selfAssessment"

const ratingValue = z.number().int().min(RATING_VALUES[0]).max(RATING_VALUES[RATING_VALUES.length - 1])
const writtenValue = z.string().trim().min(1).max(WRITTEN_ANSWER_MAX_LENGTH)

const ratingKeys = ASSESSMENT_SECTIONS.flatMap((section) =>
  section.type === "rating" ? section.questions.map((_, i) => answerKey(section.id, i)) : []
)
const writtenKeys = ASSESSMENT_SECTIONS.flatMap((section) =>
  section.type === "rating" ? [] : section.questions.map((_, i) => answerKey(section.id, i))
)

/** A finished self-assessment: every question answered, nothing else. */
export const selfAssessmentSchema = z.object({
  ratings: z.object(Object.fromEntries(ratingKeys.map((key) => [key, ratingValue]))),
  written: z.object(Object.fromEntries(writtenKeys.map((key) => [key, writtenValue]))),
})

export type SelfAssessmentValues = z.infer<typeof selfAssessmentSchema>
