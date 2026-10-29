import { ArrowRight, Check, type LucideIcon } from "lucide-react"

import { Card } from "@/components/common/card"
import { cn } from "@/lib/utils"

function PointsCard({ title, points, icon: Icon, iconClassName }: { title: string; points: string[]; icon: LucideIcon; iconClassName: string }) {
  return (
    <Card>
      <h2 className="font-sans text-lg font-medium">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm">
            <Icon aria-hidden className={cn("mt-0.5 size-3.5 shrink-0", iconClassName)} strokeWidth={2.25} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/** What went well, to keep doing, beside what to change in the next recording. */
function StrengthsAndNextSteps({ strengths, nextSteps }: { strengths: string[]; nextSteps: string[] }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <PointsCard title="Strengths to build on" points={strengths} icon={Check} iconClassName="text-success" />
      <PointsCard title="For your next recording" points={nextSteps} icon={ArrowRight} iconClassName="text-primary" />
    </div>
  )
}

export { StrengthsAndNextSteps }
