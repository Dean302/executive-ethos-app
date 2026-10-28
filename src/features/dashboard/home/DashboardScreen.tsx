import type { Dashboard } from "@/lib/dashboard"
import { goalStanding } from "@/lib/goals"

import { GrowthCard } from "./growth/GrowthCard"
import { ReadinessBanner } from "./readiness/ReadinessBanner"
import { CriteriaAtGoal } from "./widgets/CriteriaAtGoal"
import { PeerReviewsCard } from "./widgets/PeerReviewsCard"
import { RecentRecordings } from "./widgets/RecentRecordings"

type DashboardScreenProps = {
  dashboard: Dashboard
  /** The signed-in executive's name, for reminder emails. */
  viewerName: string
}

/**
 * The executive's home: where their score stands, how it's moving, and
 * what's next. Each section lives in a subfolder beside this file.
 */
function DashboardScreen({ dashboard, viewerName }: DashboardScreenProps) {
  const [latest] = dashboard.recordings

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-3 text-2xl font-semibold">Overview</h1>
      <div className="flex flex-col gap-5">
        <ReadinessBanner readiness={dashboard.readiness} />
        <GrowthCard recordings={dashboard.recordings} targets={dashboard.targets} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <RecentRecordings recordings={dashboard.recordings} className="lg:col-span-2" />
          <div className="flex flex-col gap-5">
            {latest && <CriteriaAtGoal standing={goalStanding(latest.criteria, dashboard.targets)} />}
            <PeerReviewsCard summary={dashboard.peerReviews} senderName={viewerName} />
          </div>
        </div>
      </div>
    </div>
  )
}

export { DashboardScreen }
