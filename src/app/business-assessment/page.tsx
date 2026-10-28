import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { DashboardLayout } from "@/components/dashboardLayout"
import { hasBusinessTools } from "@/components/navigation/navItems"
import { BusinessAssessmentScreen } from "@/features/dashboard"
import { getViewer } from "@/lib/viewer"

export const metadata: Metadata = {
  title: "Business Assessment",
}

export default async function BusinessAssessmentPage() {
  // Alignment and Cohesion only.
  const viewer = await getViewer()
  if (!hasBusinessTools(viewer.planId)) redirect("/dashboard")

  return (
    <DashboardLayout>
      <BusinessAssessmentScreen />
    </DashboardLayout>
  )
}
