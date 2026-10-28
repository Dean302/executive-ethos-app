import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { RecordingsScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Recordings",
}

export default function RecordingsPage() {
  return (
    <DashboardLayout>
      <RecordingsScreen />
    </DashboardLayout>
  )
}
