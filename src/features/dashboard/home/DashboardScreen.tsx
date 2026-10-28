import type { Dashboard } from "@/lib/dashboard"

import { GrowthCard } from "./growth/GrowthCard"
import { ReadinessBanner } from "./readiness/ReadinessBanner"

/**
 * The executive's home: where their score stands, how it's moving, and
 * what's next. Each section lives in a subfolder beside this file.
 */
function DashboardScreen({ dashboard }: { dashboard: Dashboard }) {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-3 text-2xl font-semibold">Overview</h1>
      <div className="flex flex-col gap-5">
        <ReadinessBanner readiness={dashboard.readiness} />
        <GrowthCard recordings={dashboard.recordings} targets={dashboard.targets} />
      </div>
    </div>
  )
}

export { DashboardScreen }
