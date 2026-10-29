import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { RecordingsScreen } from "@/features/dashboard"
import { wallClock } from "@/lib/dates"
import { getRecordings } from "@/lib/recordings"
import { getViewer } from "@/lib/viewer"

export const metadata: Metadata = {
  title: "Recordings",
}

export default async function RecordingsPage() {
  const viewer = await getViewer()
  const recordings = await getRecordings(viewer.timeZone)
  const today = wallClock(new Date(), viewer.timeZone).getTime()

  return (
    <DashboardLayout>
      <RecordingsScreen recordings={recordings} today={today} />
    </DashboardLayout>
  )
}
