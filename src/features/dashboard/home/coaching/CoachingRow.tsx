import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { IllustratedCard, type TileTone } from "@/components/common/illustrated-card"
import { CalendarSheet, PulseNote, RecordingStack, ReportBars } from "@/components/illustrations"
import type { CoachingCard, CoachingCardKind } from "@/lib/coaching"
import { cn } from "@/lib/utils"

// One illustration and tile tint per kind of touchpoint.
const ART: Record<CoachingCardKind, { art: React.ReactNode; tone: TileTone }> = {
  pulse: { art: <PulseNote className="w-36" />, tone: "blush" },
  workshop: { art: <CalendarSheet className="w-36" />, tone: "slate" },
  prep: { art: <RecordingStack className="w-36" />, tone: "sage" },
  report: { art: <ReportBars className="w-36" />, tone: "light" },
}

/**
 * "Your coaching, week to week": the latest Pulse note, then whatever
 * needs the executive (a workshop date to pick, prep, a report that's
 * ready). Each card opens its part of Your coach.
 */
function CoachingRow({ cards }: { cards: CoachingCard[] }) {
  return (
    <section aria-labelledby="coaching-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="coaching-heading" className="text-foreground font-sans text-lg font-medium">
          Your coaching, week to week
        </h2>
        <Link href="/coaching" className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline">
          Open Your coach
          <ArrowRight aria-hidden className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2",
          cards.length > 3 && "lg:grid-cols-4",
          cards.length === 3 && "lg:grid-cols-3"
        )}
      >
        {cards.map((card) => (
          <IllustratedCard
            key={card.kind}
            href={card.href}
            layout="top"
            art={ART[card.kind].art}
            tone={ART[card.kind].tone}
            eyebrow={card.eyebrow}
            title={card.title}
            description={card.body}
            cta={card.action ? "Choose a date" : undefined}
            highlight={card.action}
          />
        ))}
      </div>
    </section>
  )
}

export { CoachingRow }
