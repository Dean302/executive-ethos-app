import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { GoalsProgressScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Goals & Progress",
}

export default function GoalsProgressPage() {
  return (
    <DashboardLayout>
      <GoalsProgressScreen />
    </DashboardLayout>
  )
}
