import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { CoachingScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Your coach",
}

export default function CoachingPage() {
  return (
    <DashboardLayout>
      <CoachingScreen />
    </DashboardLayout>
  )
}
