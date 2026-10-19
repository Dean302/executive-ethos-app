import type { RATING_VALUES } from "@/lib/selfAssessment"

/** A rating's tone along the scale, low to high: fill, border and text. */
export const RATING_TONES: Record<(typeof RATING_VALUES)[number], string> = {
  1: "border-destructive bg-destructive text-destructive-foreground",
  2: "border-warning bg-warning text-warning-foreground",
  3: "border-mist bg-mist text-primary",
  4: "border-success bg-success text-success-foreground",
  5: "border-success bg-success text-success-foreground",
}
