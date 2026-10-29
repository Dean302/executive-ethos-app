import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { RecordingsScreen } from "@/features/dashboard"
import { getRecordings } from "@/lib/recordings"

export const metadata: Metadata = {
  title: "Recordings",
}

export default async function RecordingsPage() {
  const recordings = await getRecordings()

  return (
    <DashboardLayout>
      <RecordingsScreen recordings={recordings} />
    </DashboardLayout>
  )
}
