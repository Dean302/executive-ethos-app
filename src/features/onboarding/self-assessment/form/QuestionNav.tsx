import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const ROUND =
  "focus-visible:ring-ring/50 flex size-10 items-center justify-center rounded-full border transition-colors outline-none focus-visible:ring-3"

/** Previous question. */
function PreviousQuestionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous question"
      className={cn(ROUND, "border-border bg-card text-foreground/60 hover:border-primary/40 hover:text-foreground cursor-pointer")}
    >
      <ChevronUp aria-hidden className="size-4" strokeWidth={2} />
    </button>
  )
}

type QuestionNavProps = {
  onPrevious: () => void
  onNext: () => void
  /** Next stays off until the current question is answered. */
  canAdvance: boolean
}

/** Up and down arrows under the question card. */
function QuestionNav({ onPrevious, onNext, canAdvance }: QuestionNavProps) {
  return (
    <div className="flex items-center gap-2">
      <PreviousQuestionButton onClick={onPrevious} />
      <button
        type="button"
        onClick={onNext}
        disabled={!canAdvance}
        aria-label={canAdvance ? "Next question" : "Next question — answer this one first"}
        className={cn(
          ROUND,
          canAdvance
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/85 cursor-pointer"
            : "border-border bg-card text-foreground/25 cursor-not-allowed"
        )}
      >
        <ChevronDown aria-hidden className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}

export { PreviousQuestionButton, QuestionNav }
