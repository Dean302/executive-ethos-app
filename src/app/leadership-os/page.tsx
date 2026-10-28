import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { DashboardLayout } from "@/components/dashboardLayout"
import {
  BUSINESS_ASSESSMENT,
  hasBusinessTools,
  LEADERSHIP_OS_UNLOCK_PERCENT,
} from "@/components/navigation/navItems"
import { LeadershipOsScreen } from "@/features/leadershipOs"
import { getViewer } from "@/lib/viewer"

export const metadata: Metadata = {
  title: "Leadership OS",
}

export default async function LeadershipOsPage() {
  // Locked until the Business Assessment is finished, whatever the URL says.
  const viewer = await getViewer()
  if (!hasBusinessTools(viewer.planId)) redirect("/dashboard")
  if (viewer.businessAssessmentPercent < LEADERSHIP_OS_UNLOCK_PERCENT) redirect(BUSINESS_ASSESSMENT.href)

  return (
    <DashboardLayout>
      <LeadershipOsScreen />
    </DashboardLayout>
  )
}
