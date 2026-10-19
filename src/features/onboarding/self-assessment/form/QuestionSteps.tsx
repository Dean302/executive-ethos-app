import { cn } from "@/lib/utils"

/** Segmented bar for the questions in the current section, with "N of M". */
function QuestionSteps({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      <div aria-hidden className="flex flex-1 gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < current ? "bg-success" : i === current ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
      <span className="text-muted-foreground shrink-0 text-sm">
        {current + 1} of {total}
      </span>
    </div>
  )
}

export { QuestionSteps }
