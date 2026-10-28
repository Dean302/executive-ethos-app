import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { CalendarScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Calendar",
}

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <CalendarScreen />
    </DashboardLayout>
  )
}
