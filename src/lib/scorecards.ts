import type { CriterionKey } from "@/lib/criteria"
import type { GoalPriority } from "@/lib/goals"

// What the analysis found in a recording, behind its scores: for each
// criterion, what was checked and how it went, the key issue where there's
// a real gap, then the strengths to build on and what to do next time.

export type CheckTone = "good" | "warn" | "bad"

/** One thing checked in a criterion: what, how it went, and how that reads. */
export type Check = [label: string, status: string, tone: CheckTone]

export type CriterionFinding = {
  /** How much this criterion needs work, from the gap to its goal. */
  priority: GoalPriority
  checks: Check[]
  /** The finding in plain words, where the gap is real. */
  keyIssue?: string
}

export type Scorecard = {
  findings: Record<CriterionKey, CriterionFinding>
  strengths: string[]
  nextSteps: string[]
}

/** One concrete thing to try next time, per criterion. */
export const TRY_NEXT: Record<CriterionKey, string> = {
  clarity: "Say the one decision or takeaway in your first sentence, then give the reasons.",
  vocal: "Mark two places to pause and reset your energy, and leave a full beat after each key number.",
  business: "Link each point to one company priority or number before you move on.",
  audience: "After each section, ask one named person for their reaction.",
  presence: "Prepare one calm, direct line for the hardest question you expect, and say it first.",
  time: "Give each section a time box and protect the last ten minutes for discussion.",
}

/** A realistic next step toward a goal: half the gap, at least 0.3. Null once at goal. */
export function nextStepTarget(current: number, goal: number): number | null {
  if (current >= goal) return null
  return Math.round(Math.min(goal, current + Math.max(0.3, (goal - current) / 2)) * 10) / 10
}

// Sample findings for the sample history (lib/recordings), standing in
// until recordings are analysed.
const SAMPLE_SCORECARDS: Record<string, Scorecard> = {
  s4: {
    findings: {
      clarity: {
        priority: "medium",
        checks: [
          ["Agenda stated upfront", "Yes", "good"],
          ["Section transitions", "Clear", "good"],
          ["Ask framed explicitly", "Implied only", "warn"],
        ],
        keyIssue:
          "The board left unsure whether you were asking for a decision today or just an update. State the ask in the first two minutes next time.",
      },
      vocal: {
        priority: "high",
        checks: [
          ["Opening energy", "Strong", "good"],
          ["Mid-deck energy", "Flattened", "warn"],
          ["Filler words", "12 instances", "warn"],
        ],
        keyIssue:
          "Energy dropped noticeably around the financials section: pace slowed and pitch flattened. That's exactly where the board leans in the most.",
      },
      business: {
        priority: "on-track",
        checks: [
          ["Tied to Q3 Commitments", "Yes", "good"],
          ["Revenue link", "Explicit", "good"],
        ],
      },
      audience: {
        priority: "on-track",
        checks: [
          ["Checked for questions", "Twice", "good"],
          ["Named board members directly", "Yes", "good"],
        ],
      },
      presence: {
        priority: "medium",
        checks: [
          ["Eye contact / camera", "Strong", "good"],
          ["Handled pushback", "Slightly defensive once", "warn"],
        ],
        keyIssue:
          "When pressed on the delayed timeline, tone shifted defensive for about 30 seconds. Own the delay directly, then pivot to the plan.",
      },
      time: {
        priority: "critical",
        checks: [
          ["Opening", "On time", "good"],
          ["Q&A buffer", "Cut short", "bad"],
          ["Section pacing", "Rushed in Q3", "bad"],
        ],
        keyIssue:
          "You spent 14 of your 20 minutes on the first two slides, then compressed the growth plan and Q&A into 6 minutes. The board's questions about Q4 hiring never got a real answer.",
      },
    },
    strengths: [
      "Opened with a clear, confident agenda the board could follow",
      "Explicitly tied Q3 performance to the commitments you set last quarter",
      "Named board members directly when addressing their prior questions",
    ],
    nextSteps: [
      "Script your Q&A buffer explicitly into the agenda and protect at least 8 minutes",
      'State the specific ask ("I need board approval on X") in the first two minutes',
      "Practice the financials section pacing, then record and compare energy against your opening",
      "Prepare one steady, non-defensive line for delayed-timeline pushback in advance",
    ],
  },
  s3: {
    findings: {
      clarity: {
        priority: "high",
        checks: [
          ["Main point stated early", "Mixed", "warn"],
          ["Structure easy to follow", "Mixed", "warn"],
        ],
      },
      vocal: {
        priority: "high",
        checks: [
          ["Pace under disagreement", "Rushed", "bad"],
          ["Tone", "Mostly even", "warn"],
        ],
        keyIssue: "You sped up when you disagreed with the hiring plan, which made the pushback land as frustration.",
      },
      business: {
        priority: "high",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "high",
        checks: [
          ["Invited input", "Mixed", "warn"],
          ["Responded to questions", "Mixed", "warn"],
        ],
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Mixed", "warn"],
          ["Decisive language", "Mixed", "warn"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Time on status updates", "11 of 26 min", "warn"],
          ["Decisions reached", "1 of 2", "warn"],
        ],
        keyIssue:
          "Status updates were shorter, but the one real issue, Q4 hiring, was still cut off without a decision.",
      },
    },
    strengths: [
      "Opened with a clear agenda and the decisions needed",
      "Closed by confirming owners and dates",
      "Brought the hiring plan back to the quarter's targets",
    ],
    nextSteps: [
      "Put the hardest issue first on the agenda, not last",
      "Slow down deliberately when you disagree",
      "Timebox updates at sixty seconds per leader",
    ],
  },
  s2: {
    findings: {
      clarity: {
        priority: "high",
        checks: [
          ["Main point stated early", "Mixed", "warn"],
          ["Structure easy to follow", "Mixed", "warn"],
        ],
      },
      vocal: {
        priority: "critical",
        checks: [
          ["Pace", "Mixed", "warn"],
          ["Energy through the recording", "Mixed", "warn"],
        ],
      },
      business: {
        priority: "high",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "critical",
        checks: [
          ["Checked listener priorities", "Once", "warn"],
          ["Followed up on interest", "Missed the retention cue", "bad"],
        ],
        keyIssue:
          "More conversational than the Series B prep, but you talked past a clear signal of interest in retention and never came back to it.",
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Mixed", "warn"],
          ["Decisive language", "Mixed", "warn"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Team slide", "3 min", "warn"],
          ["Time for the ask", "Under 1 min", "bad"],
        ],
        keyIssue: "The team slide took three minutes, which squeezed the ask into the final sixty seconds.",
      },
    },
    strengths: [
      "Numbers were paced well and easy to follow",
      "A clear story from problem to traction",
      "Composed and specific under a tough valuation question",
    ],
    nextSteps: [
      "When a listener leans into a topic, stay there and ask a follow-up",
      "Keep the team slide to one minute",
      "Give the ask its own full minute, with a clear next step",
    ],
  },
  s1: {
    findings: {
      clarity: {
        priority: "high",
        checks: [
          ["Main point stated early", "Mixed", "warn"],
          ["Structure easy to follow", "Mixed", "warn"],
        ],
      },
      vocal: {
        priority: "high",
        checks: [
          ["Pace", "Steady", "good"],
          ["Filler words", "14 instances", "warn"],
        ],
        keyIssue: "Your pace was steady, but filler words crept back in during the unscripted answers.",
      },
      business: {
        priority: "high",
        checks: [
          ["Tied to company priorities", "Strong", "good"],
          ["Numbers used to make the case", "Strong", "good"],
        ],
      },
      audience: {
        priority: "medium",
        checks: [
          ["Invited input", "Mixed", "warn"],
          ["Responded to questions", "Mixed", "warn"],
        ],
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Mixed", "warn"],
          ["Decisive language", "Mixed", "warn"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Questions answered", "9 of 12", "warn"],
          ["Closing summary", "Skipped", "bad"],
        ],
        keyIssue:
          "Much better than the last All-Hands, but the final ten minutes were rushed and three questions went unanswered.",
      },
    },
    strengths: [
      "Answers were short and direct, most under two minutes",
      "Named the people behind each team win",
      "Handled a skeptical question about the reorg with real candor",
    ],
    nextSteps: [
      "Leave five minutes at the end to summarize and say what's next",
      "Promise written follow-ups for anything you can't cover live",
      'Practice pausing instead of saying "um" before difficult answers',
    ],
  },
  s5: {
    findings: {
      clarity: {
        priority: "critical",
        checks: [
          ["Main point stated early", "Mixed", "warn"],
          ["Structure easy to follow", "Mixed", "warn"],
        ],
      },
      vocal: {
        priority: "critical",
        checks: [
          ["Opening energy", "Strong", "good"],
          ["Energy through features", "Dropped", "bad"],
        ],
        keyIssue: "Energy was high in the opening and dropped sharply once you moved into the feature walkthrough.",
      },
      business: {
        priority: "critical",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "critical",
        checks: [
          ["Invited input", "Mixed", "warn"],
          ["Responded to questions", "Mixed", "warn"],
        ],
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Mixed", "warn"],
          ["Decisive language", "Mixed", "warn"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Demo length", "4 min over plan", "bad"],
          ["Pricing section", "Rushed", "bad"],
        ],
        keyIssue:
          "The demo overran by four minutes, and the pricing section, the part the sales team needed most, was rushed.",
      },
    },
    strengths: [
      "Opened with a customer story that made the problem real",
      "Explained the product in plain language, without jargon",
      "Linked the launch to this year's revenue target",
    ],
    nextSteps: [
      "Cut the demo to the three moments that matter, and time it",
      "Move pricing earlier so it never gets squeezed",
      "Mark two places in the script to reset your energy",
    ],
  },
  s6: {
    findings: {
      clarity: {
        priority: "critical",
        checks: [
          ["Main point stated early", "Needs work", "bad"],
          ["Structure easy to follow", "Needs work", "bad"],
        ],
      },
      vocal: {
        priority: "critical",
        checks: [
          ["Speaking pace", "About 190 wpm", "bad"],
          ["Pauses after key numbers", "Rare", "bad"],
        ],
        keyIssue:
          "Delivery sounded rehearsed and fast, around 190 words a minute through the market-size section, which made the numbers hard to absorb.",
      },
      business: {
        priority: "critical",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "critical",
        checks: [
          ["Checked listener priorities", "No", "bad"],
          ["Invited questions", "At the end only", "warn"],
        ],
        keyIssue:
          "It came across as a monologue. There was no point where you checked what the listener cared about most.",
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Mixed", "warn"],
          ["Decisive language", "Mixed", "warn"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Stayed within the time slot", "Needs work", "bad"],
          ["Time left for discussion", "Needs work", "bad"],
        ],
      },
    },
    strengths: [
      "Clear, memorable one-line description of the company",
      "Strong command of the unit economics",
      "Confident close with a specific raise amount",
    ],
    nextSteps: [
      "Slow down and leave a full beat after every key number",
      'Add two check-in questions, such as "Is this the market you expected?"',
      "Rehearse the market-size section out loud until it fits in 90 seconds",
    ],
  },
  s7: {
    findings: {
      clarity: {
        priority: "critical",
        checks: [
          ["Agenda stated upfront", "No", "bad"],
          ["Owners confirmed at close", "No", "bad"],
        ],
        keyIssue:
          "It wasn't clear what the meeting was for. There was no agenda at the start and no summary of owners at the end.",
      },
      vocal: {
        priority: "critical",
        checks: [
          ["Pace", "Needs work", "bad"],
          ["Energy through the recording", "Needs work", "bad"],
        ],
      },
      business: {
        priority: "critical",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "critical",
        checks: [
          ["Invited input", "Mixed", "warn"],
          ["Responded to questions", "Mixed", "warn"],
        ],
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Mixed", "warn"],
          ["Decisive language", "Mixed", "warn"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Time on status updates", "20 of 29 min", "bad"],
          ["Decisions reached", "0 of 2", "bad"],
        ],
        keyIssue:
          "The meeting ran as status updates. Twenty of 29 minutes went to round-robin reporting, leaving little time for the two issues that needed a decision.",
      },
    },
    strengths: [
      "Gave every leader a turn to speak",
      "Pushed back well when a project timeline looked unrealistic",
      "Kept the tone constructive during a tense budget discussion",
    ],
    nextSteps: [
      "Collect status updates in writing beforehand and use the meeting for issues",
      "Open with the one or two decisions the meeting has to make",
      "Close by reading back each action item with an owner and a date",
    ],
  },
  s8: {
    findings: {
      clarity: {
        priority: "critical",
        checks: [
          ["Main point stated early", "Needs work", "bad"],
          ["Structure easy to follow", "Needs work", "bad"],
        ],
      },
      vocal: {
        priority: "critical",
        checks: [
          ["Pace", "Slow in long answers", "bad"],
          ["Filler words", "21 instances", "bad"],
        ],
        keyIssue:
          "Answers ran long and flat: several stretches of more than two minutes with no change in pace or pitch, and the room went quiet.",
      },
      business: {
        priority: "critical",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "critical",
        checks: [
          ["Invited input", "Needs work", "bad"],
          ["Responded to questions", "Needs work", "bad"],
        ],
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Needs work", "bad"],
          ["Decisive language", "Needs work", "bad"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Questions answered", "5 of 12", "bad"],
          ["Longest single answer", "9 min", "bad"],
        ],
        keyIssue: "Twelve questions came in and you got to five. The first answer alone took nine minutes.",
      },
    },
    strengths: [
      "Answered the question about layoffs directly instead of deflecting",
      "Opened by thanking the team for specific wins",
      "The business context behind each answer was clear",
    ],
    nextSteps: [
      "Aim for two-minute answers and offer to follow up on the rest",
      "Group similar questions and answer them together",
      "Vary your pace on purpose: slow down for the key line, speed up for context",
    ],
  },
  s9: {
    findings: {
      clarity: {
        priority: "critical",
        checks: [
          ["Main point stated early", "Needs work", "bad"],
          ["Structure easy to follow", "Needs work", "bad"],
        ],
      },
      vocal: {
        priority: "critical",
        checks: [
          ["Pace", "Needs work", "bad"],
          ["Energy through the recording", "Needs work", "bad"],
        ],
      },
      business: {
        priority: "critical",
        checks: [
          ["Tied to company priorities", "Mixed", "warn"],
          ["Numbers used to make the case", "Mixed", "warn"],
        ],
      },
      audience: {
        priority: "critical",
        checks: [
          ["Invited input", "Once, at the end", "bad"],
          ["Named board members directly", "No", "bad"],
        ],
        keyIssue:
          "The update was almost entirely one-way. You asked for questions once, at the very end, and nobody took you up on it.",
      },
      presence: {
        priority: "critical",
        checks: [
          ["Composure under questions", "Needs work", "bad"],
          ["Decisive language", "Needs work", "bad"],
        ],
      },
      time: {
        priority: "critical",
        checks: [
          ["Stayed within the time slot", "13 min over", "bad"],
          ["Time left for discussion", "Under 4 min", "bad"],
        ],
        keyIssue:
          "You planned 20 minutes and ran 33. The approval item landed in the last four minutes, when the board's attention was already gone.",
      },
    },
    strengths: [
      "Came prepared with a complete, accurate set of numbers",
      "Connected the quarter's results to the annual plan",
      "Stayed calm when a director challenged the churn figure",
    ],
    nextSteps: [
      "Set a time box for each agenda item before the next board meeting",
      "Put the decision you need on the first slide, not the last",
      "Pause after each section and ask one named director for a reaction",
    ],
  },
}

/** What the analysis found in one of the signed-in executive's recordings; null when it hasn't been analysed. */
export async function getScorecard(recordingId: string): Promise<Scorecard | null> {
  return SAMPLE_SCORECARDS[recordingId] ?? null
}
