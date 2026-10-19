import { Card } from "@/components/common/card"
import {
  GOLDEN_CIRCLE_RINGS,
  answerKey,
  type GoldenCircleRing,
  type WrittenSection,
} from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

import { GoldenCircleDiagram } from "../GoldenCircleDiagram"
import { RING_STYLES } from "../goldenCircleStyles"

type GoldenCircleAnswersProps = {
  section: WrittenSection
  written: Record<string, string>
}

/** The Golden Circle answers, grouped by ring under the filled diagram. */
function GoldenCircleAnswers({ section, written }: GoldenCircleAnswersProps) {
  const questions = section.questions.map((question, index) => ({
    ...question,
    answer: written[answerKey(section.id, index)]?.trim() ?? "",
    // "Why · The Change" → "The Change"
    caption: question.label.split(" · ")[1] ?? question.label,
  }))
  const ringQuestions = questions.filter((q) => q.ring)
  const answered = Object.fromEntries(
    GOLDEN_CIRCLE_RINGS.map((ring) => [ring, ringQuestions.filter((q) => q.ring === ring && q.answer).length])
  ) as Record<GoldenCircleRing, number>

  return (
    <div className="mt-3 flex flex-col gap-4">
      <div className="flex justify-center py-2">
        <GoldenCircleDiagram
          answered={answered}
          perRing={ringQuestions.length / GOLDEN_CIRCLE_RINGS.length}
          total={ringQuestions.length}
          size={240}
        />
      </div>

      {GOLDEN_CIRCLE_RINGS.map((ring) => {
        const style = RING_STYLES[ring]
        return (
          <Card key={ring} className={cn("flex flex-col gap-4 border-l-4 text-sm", style.edge)}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "font-heading flex size-8 shrink-0 items-center justify-center rounded-full border text-sm",
                  style.softBadge
                )}
              >
                {ring[0]}
              </span>
              <h3 className={cn("text-xl", style.text)}>{ring}</h3>
            </div>
            <dl className="flex flex-col gap-4 pl-11">
              {ringQuestions
                .filter((q) => q.ring === ring)
                .map((q) => (
                  <div key={q.label}>
                    <dt>
                      <span className="font-identifier text-muted-foreground block text-sm font-semibold">
                        {q.caption}
                      </span>
                      <span className="text-muted-foreground/70 block text-sm">{q.prompt}</span>
                    </dt>
                    <dd
                      className={cn(
                        "mt-1 text-[13.5px] leading-relaxed",
                        q.answer ? "text-foreground" : "text-muted-foreground italic"
                      )}
                    >
                      {q.answer || "Not provided"}
                    </dd>
                  </div>
                ))}
            </dl>
          </Card>
        )
      })}
    </div>
  )
}

export { GoldenCircleAnswers }
