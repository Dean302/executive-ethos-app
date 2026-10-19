import type { GoldenCircleRing } from "@/lib/selfAssessment"

/** Each ring's look, shared by the form's progress and the results. */
export const RING_STYLES: Record<
  GoldenCircleRing,
  { tagline: string; stroke: string; badge: string; softBadge: string; text: string; edge: string; radius: number }
> = {
  Why: {
    tagline: "Your purpose",
    stroke: "var(--brand-oxblood)",
    badge: "border-oxblood bg-oxblood/15 text-oxblood",
    softBadge: "border-oxblood/40 bg-oxblood/15 text-oxblood",
    text: "text-oxblood",
    edge: "border-l-oxblood",
    radius: 38,
  },
  How: {
    tagline: "Your process",
    stroke: "var(--warning)",
    badge: "border-warning bg-warning/15 text-warning",
    softBadge: "border-warning/40 bg-warning/15 text-warning",
    text: "text-warning",
    edge: "border-l-warning",
    radius: 72,
  },
  What: {
    tagline: "Your offer",
    stroke: "var(--success)",
    badge: "border-success bg-success/15 text-success",
    softBadge: "border-success/40 bg-success/15 text-success",
    text: "text-success",
    edge: "border-l-success",
    radius: 108,
  },
}
