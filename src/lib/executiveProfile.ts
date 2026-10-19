// The executive profile captured before the self-assessment: role, why
// they came, and the area they want to change fastest.

export const ROLES = ["CEO", "Founder", "President", "C-Suite Executive", "Other"] as const
export type Role = (typeof ROLES)[number]

/** Focus areas, each tied to the self-assessment section it starts from. */
export const FOCUS_AREA_IDS = ["leadership", "presence", "communication", "awareness"] as const
export type FocusAreaId = (typeof FOCUS_AREA_IDS)[number]

export const FOCUS_AREAS: Record<FocusAreaId, { label: string; blurb: string }> = {
  leadership: {
    label: "Communicating my vision more clearly",
    blurb: "Vision, feedback, and leading through hard calls.",
  },
  presence: {
    label: "Commanding presence in high-stakes rooms",
    blurb: "How you show up, your delivery, and holding the room.",
  },
  communication: {
    label: "Running sharper, more decisive meetings",
    blurb: "Clarity, tough conversations, saying what you mean.",
  },
  awareness: {
    label: "Knowing how I really land with people",
    blurb: "Your blind spots, and what others see that you might miss.",
  },
}

export const WHY_MAX_LENGTH = 2000
