import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { DashboardScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardScreen />
    </DashboardLayout>
  )
}
