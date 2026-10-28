import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { DashboardScreen } from "@/features/dashboard"
import { getDashboard } from "@/lib/dashboard"
import { getViewer } from "@/lib/viewer"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const [dashboard, viewer] = await Promise.all([getDashboard(), getViewer()])

  return (
    <DashboardLayout>
      <DashboardScreen dashboard={dashboard} viewer={viewer} />
    </DashboardLayout>
  )
}
