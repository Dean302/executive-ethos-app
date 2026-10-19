// The baseline self-assessment: one question bank, answered either in
// conversation with Ethos or as a form.

// Totals from the design's question bank. Derive them from the bank
// itself once it lives here.
export const ASSESSMENT_QUESTION_COUNT = 42
export const ASSESSMENT_SECTION_COUNT = 7

export const ASSESSMENT_MODES = ["chat", "form"] as const
export type AssessmentMode = (typeof ASSESSMENT_MODES)[number]
