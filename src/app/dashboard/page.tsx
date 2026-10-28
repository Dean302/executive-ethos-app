import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { DashboardScreen } from "@/features/dashboard"
import { getDashboard } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const dashboard = await getDashboard()

  return (
    <DashboardLayout>
      <DashboardScreen dashboard={dashboard} />
    </DashboardLayout>
  )
}
