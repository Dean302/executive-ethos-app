import type { Dashboard } from "@/lib/dashboard"

import { ReadinessBanner } from "./readiness/ReadinessBanner"

/**
 * The executive's home: where their score stands, how it's moving, and
 * what's next. Each section lives in a subfolder beside this file.
 */
function DashboardScreen({ dashboard }: { dashboard: Dashboard }) {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-3 text-2xl font-semibold">Overview</h1>
      <ReadinessBanner readiness={dashboard.readiness} />
    </div>
  )
}

export { DashboardScreen }
