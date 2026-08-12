/**
 * Onboarding content — questions, answer options, and coach copy.
 *
 * Hard-coded for now. When the database lands, swap the exported constants
 * for fetches; the shapes below are what the API should return, so the
 * components consuming them shouldn't need to change.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Role = "CEO" | "Founder" | "President" | "C-Suite Executive"

export type Focus = "Vision" | "Presence" | "Resonance" | "Meetings"

export type AssessmentQuestion = {
  section: number
  /** 1-based position within its section */
  indexInSection: number
  /** total questions in the section — the denominator for "X of Y" */
  sectionTotal: number
  /** stable storage key, e.g. "s1_q1" */
  key: string
  kind: "rating" | "text"
  prompt: string
  /** muted helper text under a free-text input */
  hint?: string
}

export type GoldenCircleQuestion = {
  index: number
  ring: 1 | 2 | 3
  prompt: string
  hint: string
}

/* ------------------------------------------------------------------ */
/*  Answer options                                                     */
/* ------------------------------------------------------------------ */

/** The 1–5 scale used by every rating question. */
export const RATING_OPTIONS = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Consistently" },
] as const

export const ROLE_OPTIONS: Role[] = [
  "CEO",
  "Founder",
  "President",
  "C-Suite Executive",
]

export const FOCUS_OPTIONS: {
  key: Focus
  label: string
  short: string
  prompt: string
}[] = [
  {
    key: "Vision",
    label: "Communicating my vision more clearly",
    short: "Vision Clarity",
    prompt:
      "Describe your company's strategy for the next quarter as if speaking to your board for the first time.",
  },
  {
    key: "Presence",
    label: "Commanding presence in high-stakes rooms",
    short: "Executive Presence",
    prompt:
      "Open a high-stakes all-hands meeting. You have 60 seconds to command the room before you share the agenda.",
  },
  {
    key: "Resonance",
    label: "Connecting emotionally with my team",
    short: "Emotional Resonance",
    prompt:
      "Tell your team — in under 2 minutes — why the work they're doing this quarter genuinely matters.",
  },
  {
    key: "Meetings",
    label: "Running sharper, more decisive meetings",
    short: "Sharper Meetings",
    prompt:
      "Walk through how you would run an IDS session with an issue your team has been stuck on for three weeks.",
  },
]

export const RELATIONSHIP_OPTIONS = [
  "Direct Report",
  "Peer / Colleague",
  "Manager / Senior",
  "Board Member",
  "Client / Partner",
  "Other",
]

/* ------------------------------------------------------------------ */
/*  Assessment sections                                                */
/* ------------------------------------------------------------------ */

export const SECTIONS: Record<
  number,
  { title: string; intro: string; subtitle: string }
> = {
  1: {
    title: "Communication Fundamentals",
    intro: "Let's start with the fundamentals.",
    subtitle:
      "How clearly, concisely, and adaptively you communicate day-to-day.",
  },
  2: {
    title: "Presentation & Presence",
    intro: "Now: presentation and presence.",
    subtitle: "How you show up in the room — command, delivery, attention.",
  },
  3: {
    title: "Leadership Communication",
    intro: "Next — how you lead through your words.",
    subtitle: "How you communicate as the person others are following.",
  },
  4: {
    title: "Self-Awareness & Blind Spots",
    intro: "Self-awareness. This one needs the most honesty.",
    subtitle: "What you know about how you land — and where the gaps live.",
  },
  5: {
    title: "Honest Reflection",
    intro: "Four questions, in your own words. Be specific.",
    subtitle: "Your unfiltered assessment of where you are.",
  },
  6: {
    title: "Goal Setting",
    intro: "Last section. The outcomes you're committing to.",
    subtitle: "The specific outcomes you want from this programme.",
  },
}

/* ------------------------------------------------------------------ */
/*  Assessment questions — 33 across 6 sections                        */
/* ------------------------------------------------------------------ */

const rating = (
  section: number,
  prompts: string[]
): AssessmentQuestion[] =>
  prompts.map((prompt, i) => ({
    section,
    indexInSection: i + 1,
    sectionTotal: prompts.length,
    key: `s${section}_q${i + 1}`,
    kind: "rating",
    prompt,
  }))

const text = (
  section: number,
  items: { key: string; prompt: string; hint: string }[]
): AssessmentQuestion[] =>
  items.map((item, i) => ({
    section,
    indexInSection: i + 1,
    sectionTotal: items.length,
    key: item.key,
    kind: "text",
    prompt: item.prompt,
    hint: item.hint,
  }))

/** Section 1 — Communication Fundamentals */
const SECTION_1 = rating(1, [
  "I communicate ideas clearly and concisely. I say what I mean, then stop.",
  "I adapt my communication style instinctively to different audiences — board, team, clients, media.",
  "I listen actively and seek to understand fully before I respond.",
  "I navigate difficult conversations directly, without softening the message to the point of losing it.",
  "My written communication — emails, proposals, updates — is precise, professional, and reflects my authority.",
  "I give feedback that is specific, honest, and delivered in a way the other person can actually act on.",
])

/** Section 2 — Presentation & Presence */
const SECTION_2 = rating(2, [
  "I command attention when I enter a room or open a meeting. People know I have something worth hearing.",
  "I structure my presentations logically. My audience always knows where I'm taking them and why.",
  "I use storytelling deliberately to make my message land, not just inform.",
  "My body language, posture, and eye contact project confidence — particularly under pressure.",
  "My vocal delivery — pace, tone, gravitas — conveys authority without being aggressive.",
  "I handle unexpected questions and pushback with composure and credibility.",
  "I feel fully confident presenting to boards, investors, senior leadership, or media.",
])

/** Section 3 — Leadership Communication */
const SECTION_3 = rating(3, [
  "I communicate a vision so clearly that my team can articulate it without me in the room.",
  "My team is energised and motivated by how I communicate, not only by what I communicate.",
  "I deliver candid, direct feedback without damaging the relationship or reducing psychological safety.",
  "I manage up effectively. I know how to influence, frame, and present to people above me.",
  "I make decisions under pressure and communicate them with conviction, even when the decision is hard.",
  "My team feels safe to disagree with me, challenge assumptions, and bring me problems without fear.",
])

/** Section 4 — Self-Awareness & Blind Spots */
const SECTION_4 = rating(4, [
  "I understand precisely how I come across to others in high-stakes situations.",
  "I recognise when I'm under stress and actively manage how it affects my communication.",
  "I proactively seek feedback on my communication and presence, and I act on it.",
  "I can name the specific habits or tendencies that undermine my executive presence.",
  "I know which communication situations are my weakest, and I have a plan to address them.",
])

/** Section 5 — Honest Reflection */
const SECTION_5 = text(5, [
  {
    key: "s5_challenge",
    prompt:
      "What is the most pressing communication or leadership challenge you're facing right now?",
    hint: "Name specific people, meetings, or moments. The more concrete, the more useful.",
  },
  {
    key: "s5_miss",
    prompt:
      "Describe a recent moment your communication didn't land the way you intended. What happened?",
    hint: "Describe what happened, not how you felt about it.",
  },
  {
    key: "s5_avoid",
    prompt:
      "What communication situations do you avoid, delay, or handle less well than you should?",
    hint: "Name the specific context or conversation type you consistently avoid.",
  },
  {
    key: "s5_cost",
    prompt:
      "What's the cost — to you, your team, or your business — of not closing this gap?",
    hint: "Be honest about the price. That's what makes the work worth doing.",
  },
  {
    key: "s5_gap",
    prompt:
      "What does outstanding executive communication look like for you, and what stands between you and that standard?",
    hint: "Be precise about the gap. Vague goals produce vague results.",
  },
])

/** Section 6 — Goal Setting */
const SECTION_6 = text(6, [
  {
    key: "s6_primary",
    prompt:
      "What is your single most important communication goal for the next 90 days?",
    hint: "Be specific. What will you actually do?",
  },
  {
    key: "s6_audience",
    prompt:
      "Which audience, stakeholder group, or situation do you most need to improve your impact with?",
    hint: "Name the room, the person, the meeting.",
  },
  {
    key: "s6_habit",
    prompt:
      "One communication habit you want to build — or break — through this programme.",
    hint: "One habit. Not five. The one thing that would change everything.",
  },
  {
    key: "s6_success",
    prompt:
      "In 12 months, what will tell you this programme was worth the investment?",
    hint: "Describe it in a way that your coach could verify independently.",
  },
])

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  ...SECTION_1,
  ...SECTION_2,
  ...SECTION_3,
  ...SECTION_4,
  ...SECTION_5,
  ...SECTION_6,
]

export const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length
export const TOTAL_SECTIONS = 6

/* ------------------------------------------------------------------ */
/*  Golden Circle — 9 questions across 3 rings                         */
/* ------------------------------------------------------------------ */

export const GOLDEN_CIRCLE_RINGS = [
  { ring: 1, label: "WHY", subtitle: "Your purpose", tag: "Ring 1 · Core" },
  { ring: 2, label: "HOW", subtitle: "Your process", tag: "Ring 2 · Process" },
  { ring: 3, label: "WHAT", subtitle: "Your offer", tag: "Ring 3 · Offer" },
] as const

export const GOLDEN_CIRCLE_QUESTIONS: GoldenCircleQuestion[] = [
  {
    index: 0,
    ring: 1,
    prompt: "What change do you want to see in the world?",
    hint: "Think beyond your product. What future are you building toward?",
  },
  {
    index: 1,
    ring: 1,
    prompt: "What would be lost if your organization disappeared tomorrow?",
    hint: "What unique contribution do you make that no one else does?",
  },
  {
    index: 2,
    ring: 1,
    prompt: "What belief drove you to start (or join) this work?",
    hint: "What do you fundamentally believe to be true that others don't act on?",
  },
  {
    index: 3,
    ring: 2,
    prompt:
      "What are the non-negotiable values that guide every decision?",
    hint: "What do you refuse to compromise on, even when it's costly?",
  },
  {
    index: 4,
    ring: 2,
    prompt: "What is the unique way you approach your work?",
    hint: "What does your process look like that competitors don't replicate?",
  },
  {
    index: 5,
    ring: 2,
    prompt: "How do people feel after working with or for you?",
    hint: "What's the consistent emotional experience your culture produces?",
  },
  {
    index: 6,
    ring: 3,
    prompt: "What products or services do you offer?",
    hint: "Describe what you sell, build, or provide in plain language.",
  },
  {
    index: 7,
    ring: 3,
    prompt: "Who do you serve, and what problem do you solve?",
    hint: "Be specific about the person and the real need you address.",
  },
  {
    index: 8,
    ring: 3,
    prompt: "What measurable outcome does your work create?",
    hint: "What's the before and after for your customer or community?",
  },
]

/* ------------------------------------------------------------------ */
/*  Coach bridge lines                                                 */
/*                                                                     */
/*  Shown after an answer. A neutral rating of 3 gets no bridge —      */
/*  the silence is deliberate.                                         */
/* ------------------------------------------------------------------ */

export const BRIDGES = {
  /** Ratings of 1–2 */
  low: [
    "{name}, recognising where the gap is — that's the hardest part, and the most important.",
    "That honesty is exactly what makes this coaching meaningful, {name}.",
    "Appreciated, {name}. Most leaders find this the hardest area to be candid about.",
    "Growth always starts with that kind of awareness.",
  ],
  /** Ratings of 4–5 */
  high: [
    "That consistency is a real asset, {name}.",
    "{name}, leaders who anchor here tend to have real presence in the room.",
    "Good to have that as a foundation we can build on.",
    "That's a meaningful strength to carry into your sessions.",
  ],
  /** Free-text answers */
  text: [
    "Thank you for putting that into words, {name}.",
    "{name}, that gives me a clear picture.",
    "That context will shape everything that follows.",
    "That's a meaningful reflection.",
  ],
}

/* ------------------------------------------------------------------ */
/*  Welcome — entry choice                                             */
/* ------------------------------------------------------------------ */

export type WelcomeChoice = "self" | "peer"

export const WELCOME_CHOICES: {
  key: WelcomeChoice
  eyebrow: string
  title: string
  description: string
  duration: string
}[] = [
  {
    key: "self",
    eyebrow: "For you",
    title: "I'm taking my own assessment",
    description:
      "Complete your self-assessment, then invite peers, direct reports, and your board to provide their perspective.",
    duration: "~12–15 minutes",
  },
  {
    key: "peer",
    eyebrow: "For someone else",
    title: "I was invited to assess someone",
    description:
      "Provide honest, anonymous feedback on a colleague's executive communication and presence. Your responses are confidential.",
    duration: "~8–10 minutes",
  },
]

/* ------------------------------------------------------------------ */
/*  Coaching profile panel                                             */
/* ------------------------------------------------------------------ */

/** Derived once a role is chosen — the panel's "why you're here" line. */
export const WHY_SUMMARY =
  "Wants sharper communication across the 6 dimensions."

export const PROFILE_TIP =
  "This profile builds itself as you answer. By the end, Ethos will have everything needed to personalise your first session."

/** Sections tracked in the right-hand panel. */
export const PROFILE_SECTION_COUNT = 5

/* ------------------------------------------------------------------ */
/*  Stage copy                                                         */
/* ------------------------------------------------------------------ */

export const STAGE_HEADINGS = {
  name: { title: "Your Identity", subtitle: "Let's start with who you are." },
  role: {
    title: "Your Role",
    subtitle: "What best describes your current position?",
  },
  focus: {
    title: "Your Focus Area",
    subtitle: "Identifying where to start.",
  },
  invite: {
    title: "Self-Assessment",
    subtitle: "Honest baseline across 6 dimensions.",
  },
  complete: {
    title: "Baseline captured",
    subtitle: "Your coach has what they need.",
  },
}

export const ASSESSMENT_INVITE = {
  prompt:
    "Before your first session, I want to understand where you're starting from. It takes two minutes. Want to do a quick self-assessment?",
  accept: "Let's do it",
  skip: "Skip for now",
}

/* ------------------------------------------------------------------ */
/*  Conversation copy                                                  */
/* ------------------------------------------------------------------ */

/** localStorage key the sign-up form writes and onboarding reads. */
export const NAME_STORAGE_KEY = "ethos.firstName"

export const COACH_LINES = {
  greetNew:
    "Welcome. I'm Ethos — your AI coaching partner. Before we begin, what should I call you?",
  greetReturning: (name: string) =>
    `Welcome back, ${name}. What best describes your current role?`,
  afterName: (name: string) =>
    `Good to meet you, ${name}. What best describes your current role?`,
  focus: (name: string) =>
    `Which of these would create the most impact for you right now, ${name}?`,
  skipped: "No problem — you can complete it any time from your dashboard.",
  toGoldenCircle: (name: string) =>
    `You're all set, ${name}. Now let's build your Golden Circle — the foundation of how you communicate your purpose, your approach, and your impact.`,
  toPeers:
    "Your Golden Circle is set. Now let's get perspectives from the people who work with you.",
}

export const GOLDEN_CIRCLE_HEADING = {
  title: "Golden Circle",
  subtitle: "Purpose, process, and offer — in your words.",
}

export const PEER_INVITE = {
  title: "Invite your reviewers",
  subtitle:
    "Three people who see you work. Their responses stay anonymous.",
  heading: "Peer Perspectives",
  done: "Links generated. Share them with your reviewers.",
}

/* ------------------------------------------------------------------ */
/*  Start screen                                                       */
/* ------------------------------------------------------------------ */

export const START_SCREEN = {
  eyebrow: "Your coaching session starts here",
  greeting: (name?: string) => (name ? `Hey ${name}, I'm Ethos.` : "Hey, I'm Ethos."),
  leadIn: "Let's build your",
  profileName: "Executive Communication Profile",
  leadOut: "in about 4 minutes.",
  primary: "Set up profile with Ethos",
  secondary: "Set up profile yourself",
  defer: "Come back later",
  step: "Step 1 of 5",
  totalSteps: 5,
}

export const GOLDEN_CIRCLE_NOTE =
  "Answer honestly. There are no wrong answers. The deeper you go, the more useful your Golden Circle becomes."
