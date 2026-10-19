import { cn } from "@/lib/utils"

export type Direction = "forward" | "backward"

type QuestionTransitionProps = {
  /** Changes with the question, to replay the entrance. */
  transitionKey: string
  /** Forward rises in from below; backward drops in from above. */
  direction: Direction
  className?: string
  children: React.ReactNode
}

/** Slides each new question into place, so a change of question reads as one. */
function QuestionTransition({ transitionKey, direction, className, children }: QuestionTransitionProps) {
  return (
    <div
      key={transitionKey}
      className={cn("question-slide-in", className)}
      style={{ "--slide-from": direction === "forward" ? "28px" : "-28px" } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export { QuestionTransition }
