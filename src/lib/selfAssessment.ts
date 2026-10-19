// The baseline self-assessment: one question bank, answered either in
// conversation with Ethos or as a form. Wording is Dean's, from his
// "Baseline Assessment" and "Golden Circle" artifacts, kept verbatim.
//
// This is its own instrument, not the six scoring-rubric criteria used on
// recordings; don't merge the two even though both are "things, scored".

export const ASSESSMENT_MODES = ["chat", "form"] as const
export type AssessmentMode = (typeof ASSESSMENT_MODES)[number]

type SectionBase = {
  id: string
  title: string
  /** Short name for the section rail. */
  shortTitle: string
  subtitle: string
  /** Shown once, as the section's intro dialog. */
  intro: string
}

/** Statements rated 1–5. */
export type RatingSection = SectionBase & { type: "rating"; questions: string[] }

export const GOLDEN_CIRCLE_RINGS = ["Why", "How", "What"] as const
export type GoldenCircleRing = (typeof GOLDEN_CIRCLE_RINGS)[number]

/** Written answers; `goals` sections render on navy. */
export type WrittenQuestion = {
  label: string
  prompt: string
  hint: string
  /** Golden Circle questions only: the ring the question belongs to. */
  ring?: GoldenCircleRing
}
export type WrittenSection = SectionBase & {
  type: "text" | "goals"
  questions: WrittenQuestion[]
}

export type AssessmentSection = RatingSection | WrittenSection

export const ASSESSMENT_SECTIONS: AssessmentSection[] = [
  {
    id: "communication",
    type: "rating",
    title: "Executive Communication",
    shortTitle: "Communication",
    subtitle: "How clearly, confidently, and strategically you communicate across every context.",
    intro:
      "Rate each statement as it honestly reflects your current reality, not your aspiration. The most valuable baselines are the most honest ones.",
    questions: [
      "I communicate ideas clearly and concisely. I say what I mean, then stop.",
      "I adapt my communication style instinctively to different audiences: board, team, clients, and media.",
      "I listen actively and seek to understand fully before I respond.",
      "I navigate difficult conversations directly, without softening the message to the point of losing it.",
      "My written communication, including emails, proposals, and updates, is precise, professional, and reflects my authority.",
      "I give feedback that is specific, honest, and delivered in a way the other person can actually act on.",
    ],
  },
  {
    id: "presence",
    type: "rating",
    title: "Presentation & Presence",
    shortTitle: "Presence",
    subtitle: "How you show up in the room. Your command, delivery, and ability to hold attention.",
    intro:
      "Executive presence is not about personality type. It is about intentional practice. Rate yourself on how you show up today.",
    questions: [
      "I command attention when I enter a room or open a meeting. People know I have something worth hearing.",
      "I structure my presentations logically. My audience always knows where I'm taking them and why.",
      "I use storytelling deliberately to make my message land, not just inform.",
      "My body language, posture, and eye contact project confidence, particularly under pressure.",
      "My vocal delivery, including pace, tone, and gravitas, conveys authority without being aggressive.",
      "I handle unexpected questions and pushback with composure and credibility.",
      "I feel fully confident presenting to boards, investors, senior leadership, or media.",
    ],
  },
  {
    id: "leadership",
    type: "rating",
    title: "Leadership Communication",
    shortTitle: "Leadership",
    subtitle: "How effectively you communicate as the person others are following.",
    intro:
      "The way a leader communicates shapes everything: culture, performance, trust, and results. Rate how you lead through your words.",
    questions: [
      "I communicate a vision so clearly that my team can articulate it without me in the room.",
      "My team is energised and motivated by how I communicate, not only by what I communicate.",
      "I deliver candid, direct feedback without damaging the relationship or reducing psychological safety.",
      "I manage up effectively. I know how to influence, frame, and present to people above me.",
      "I make decisions under pressure and communicate them with conviction, even when the decision is hard.",
      "My team feels safe to disagree with me, challenge assumptions, and bring me problems without fear.",
    ],
  },
  {
    id: "awareness",
    type: "rating",
    title: "Self-Awareness & Blind Spots",
    shortTitle: "Awareness",
    subtitle: "What you know about how you land with others and where your gaps live.",
    intro:
      "The executives who grow fastest are those who know exactly where they fall short. This section requires the most honesty.",
    questions: [
      "I understand precisely how I come across to others in high-stakes situations.",
      "I recognize when I'm under stress and actively manage how it affects my communication.",
      "I proactively seek feedback on my communication and presence, and I act on it.",
      "I can name the specific habits or tendencies that undermine my executive presence.",
      "I know which communication situations are my weakest, and I have a plan to address them.",
    ],
  },
  {
    id: "reflection",
    type: "text",
    title: "Honest Reflection",
    shortTitle: "Reflection",
    subtitle: "Your unfiltered assessment of where you are and what needs to change.",
    intro:
      "These questions have no right answers. They exist to give your coach the raw material to build the right program for you.",
    questions: [
      {
        label: "Current Challenge",
        prompt:
          "What is the most pressing communication or leadership challenge you are facing right now? Be specific.",
        hint: "The most useful answers name specific people, meetings, or moments.",
      },
      {
        label: "Recent Miss",
        prompt:
          "Describe a recent situation where your communication did not land the way you intended. What happened and why?",
        hint: "Describe what happened, not how you felt about it.",
      },
      {
        label: "How Others See You",
        prompt:
          "How would your board, peers, or direct reports honestly describe your communication style today?",
        hint: "Use their words, not yours. What would they actually say?",
      },
      {
        label: "What You Avoid",
        prompt:
          "What communication situations do you avoid, delay, or consistently handle less well than you should?",
        hint: "Name the specific context or conversation type you consistently avoid.",
      },
      {
        label: "The Gap",
        prompt:
          "What does outstanding executive communication look like for you, and what specifically stands between you and that standard?",
        hint: "Be precise about the gap. Vague goals produce vague results.",
      },
    ],
  },
  {
    id: "goals",
    type: "goals",
    title: "Goal Setting",
    shortTitle: "Goals",
    subtitle: "The specific outcomes you are committing to from this program.",
    intro:
      "Clarity of intention drives outcomes. Define what success looks like for you. Be specific, not aspirational.",
    questions: [
      {
        label: "Primary Goal",
        prompt: "What is your single most important communication goal for the next 90 days?",
        hint: "Be specific. What will you actually do in the next 90 days?",
      },
      {
        label: "Audience or Context",
        prompt:
          "Which audience, stakeholder group, or situation do you most need to improve your impact with?",
        hint: "Name the room, the person, the meeting. The more specific the better.",
      },
      {
        label: "The Habit",
        prompt: "What is the one communication habit you want to build or break through this program?",
        hint: "One habit. Not five. The one thing that would change everything.",
      },
      {
        label: "Definition of Success",
        prompt: "In 12 months, what will tell you this program was worth the investment?",
        hint: "Describe it in a way that your coach could verify independently.",
      },
    ],
  },
  {
    id: "golden-circle",
    type: "text",
    title: "Golden Circle",
    shortTitle: "Golden Circle",
    subtitle: "Your own Why, How, and What — the foundation everything else in your leadership sits on.",
    intro:
      "Simon Sinek's model, turned on you: people don't follow what you do, they follow why you do it. Nine questions, three rings. Answer honestly, this becomes the throughline for everything else in your program.",
    questions: [
      {
        label: "Why · The Change",
        ring: "Why",
        prompt: "What change do you want to see in the world?",
        hint: "Think beyond your product. What future are you building toward?",
      },
      {
        label: "Why · What's At Stake",
        ring: "Why",
        prompt: "What would be lost if your organization disappeared tomorrow?",
        hint: "What unique contribution do you make that no one else does?",
      },
      {
        label: "Why · The Belief",
        ring: "Why",
        prompt: "What belief drove you to start, or join, this work?",
        hint: "What do you fundamentally believe to be true that others don't act on?",
      },
      {
        label: "How · Non-Negotiables",
        ring: "How",
        prompt: "What are the non-negotiable values that guide every decision?",
        hint: "What do you refuse to compromise on, even when it's costly?",
      },
      {
        label: "How · Your Approach",
        ring: "How",
        prompt: "What is the unique way you approach your work?",
        hint: "What does your process look like that competitors don't replicate?",
      },
      {
        label: "How · The Experience",
        ring: "How",
        prompt: "How do people feel after working with or for you?",
        hint: "What's the consistent emotional experience your culture produces?",
      },
      {
        label: "What · Your Offer",
        ring: "What",
        prompt: "What products or services do you offer?",
        hint: "Describe what you sell, build, or provide, in plain language.",
      },
      {
        label: "What · Who You Serve",
        ring: "What",
        prompt: "Who do you serve, and what problem do you solve?",
        hint: "Be specific about the person and the real need you address.",
      },
      {
        label: "What · The Outcome",
        ring: "What",
        prompt: "What measurable outcome does your work create?",
        hint: "What's the before and after for your customer or community?",
      },
    ],
  },
]

export const ASSESSMENT_SECTION_COUNT = ASSESSMENT_SECTIONS.length
export const ASSESSMENT_QUESTION_COUNT = ASSESSMENT_SECTIONS.reduce(
  (sum, section) => sum + section.questions.length,
  0
)

export function getSection(sectionId: string) {
  return ASSESSMENT_SECTIONS.find((section) => section.id === sectionId)
}

export function sectionIndexOf(sectionId: string) {
  return ASSESSMENT_SECTIONS.findIndex((section) => section.id === sectionId)
}

/** Answers are keyed by section and question: "presence-3". */
export function answerKey(sectionId: string, questionIndex: number) {
  return `${sectionId}-${questionIndex}`
}

export type AssessmentAnswers = {
  /** Rating sections, 1–5. */
  ratings: Record<string, number>
  /** Text and goals sections. */
  written: Record<string, string>
}

export function isAnswered(section: AssessmentSection, questionIndex: number, answers: AssessmentAnswers) {
  const key = answerKey(section.id, questionIndex)
  return section.type === "rating"
    ? Boolean(answers.ratings[key])
    : Boolean(answers.written[key]?.trim())
}

/** How many of a section's questions are answered. */
export function answeredCount(section: AssessmentSection, answers: AssessmentAnswers) {
  return section.questions.filter((_, index) => isAnswered(section, index, answers)).length
}

export const RATING_VALUES = [1, 2, 3, 4, 5] as const

export const RATING_SCALE = [
  { label: "Not at all", description: "This isn't true for you yet: a real, honest gap." },
  { label: "Rarely", description: "It shows up occasionally, but you can't count on it." },
  { label: "Sometimes", description: "True some of the time: inconsistent under pressure." },
  { label: "Often", description: "True most of the time: a real strength, still sharpening." },
  { label: "Consistently", description: "Reliably true, every time, no matter the room." },
] as const

/** Longest written answer kept. */
export const WRITTEN_ANSWER_MAX_LENGTH = 5000

/** Rough answering pace, for "~N min" left. */
export const SECONDS_PER_QUESTION = 12

/** True once every question in every section is answered. */
export function isAssessmentComplete(answers: AssessmentAnswers) {
  return ASSESSMENT_SECTIONS.every((section) => answeredCount(section, answers) === section.questions.length)
}

// ── Mission statement ───────────────────────────────────────────────────
// Assembled from the Golden Circle exactly as Dean's "Start With Why" tool
// does: one answer per ring (the first one answered), each cut to 80
// characters at a word, in one fixed sentence. Editable later; a real
// build may hand the nine answers to a model instead.

const STATEMENT_CLAUSE_MAX_LENGTH = 80

const RING_FALLBACK: Record<GoldenCircleRing, string> = {
  Why: "our purpose",
  How: "our principles",
  What: "our work",
}

function truncateAtWord(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/\s\S*$/, "")}…`
}

/** Ends a clause with a full stop, unless it already ends in punctuation. */
export function asClause(text: string) {
  return /[.…!?]$/.test(text) ? text : `${text}.`
}

/** The statement's three clauses, for showing each in its ring's colour. */
export function missionStatementParts(written: Record<string, string>) {
  const goldenCircle = ASSESSMENT_SECTIONS.find(
    (section): section is WrittenSection => section.type !== "rating" && section.questions.some((q) => q.ring)
  )

  const firstAnswer = (ring: GoldenCircleRing) => {
    if (!goldenCircle) return ""
    for (const [index, question] of goldenCircle.questions.entries()) {
      const answer = question.ring === ring ? written[answerKey(goldenCircle.id, index)]?.trim() : ""
      if (answer) return answer
    }
    return ""
  }

  const raw = Object.fromEntries(GOLDEN_CIRCLE_RINGS.map((ring) => [ring, firstAnswer(ring)])) as Record<
    GoldenCircleRing,
    string
  >
  const clause = (ring: GoldenCircleRing) =>
    asClause(truncateAtWord(raw[ring] || RING_FALLBACK[ring], STATEMENT_CLAUSE_MAX_LENGTH))

  return {
    why: clause("Why"),
    how: clause("How"),
    what: clause("What"),
    isEmpty: GOLDEN_CIRCLE_RINGS.every((ring) => !raw[ring]),
  }
}

// ── Scoring ─────────────────────────────────────────────────────────────

export const RATING_SECTIONS = ASSESSMENT_SECTIONS.filter(
  (section): section is RatingSection => section.type === "rating"
)

export const RATING_QUESTION_COUNT = RATING_SECTIONS.reduce((sum, section) => sum + section.questions.length, 0)

/** A rating section's points out of its maximum, as a whole percentage. */
export function sectionScore(section: RatingSection, ratings: Record<string, number>) {
  const max = section.questions.length * RATING_VALUES.length
  const total = section.questions.reduce((sum, _, i) => sum + (ratings[answerKey(section.id, i)] ?? 0), 0)
  return { total, max, percent: max > 0 ? Math.round((total / max) * 100) : 0 }
}

/** All rating sections' points out of their maximum, as a whole percentage. */
export function overallScore(ratings: Record<string, number>) {
  let total = 0
  let max = 0
  for (const section of RATING_SECTIONS) {
    const score = sectionScore(section, ratings)
    total += score.total
    max += score.max
  }
  return max > 0 ? Math.round((total / max) * 100) : 0
}

export type ScoreTone = "success" | "warning" | "destructive"

/** Named bands for an overall score. None share a name with a plan. */
export function scoreTier(percent: number): { label: string; tone: ScoreTone } {
  if (percent >= 85) return { label: "Exceptional", tone: "success" }
  if (percent >= 70) return { label: "Strong", tone: "success" }
  if (percent >= 55) return { label: "Developing", tone: "warning" }
  if (percent >= 40) return { label: "Emerging", tone: "warning" }
  return { label: "Early Stage", tone: "destructive" }
}

/** The single lowest-rated statement — the first one, on a tie. */
export function lowestRatedStatement(ratings: Record<string, number>) {
  let lowest: { statement: string; value: number } | null = null
  for (const section of RATING_SECTIONS) {
    for (const [i, statement] of section.questions.entries()) {
      const value = ratings[answerKey(section.id, i)]
      if (value && (!lowest || value < lowest.value)) lowest = { statement, value }
    }
  }
  return lowest
}
