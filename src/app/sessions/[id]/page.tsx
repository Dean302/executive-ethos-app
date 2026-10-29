import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DashboardLayout } from "@/components/dashboardLayout"
import { RecordingDetailScreen } from "@/features/dashboard"
import { backLinkFor } from "@/features/dashboard/recordings/detail/origins"
import { wallClock } from "@/lib/dates"
import { getRecordings } from "@/lib/recordings"
import { getViewer } from "@/lib/viewer"

type RecordingPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function findRecording(id: string) {
  const viewer = await getViewer()
  const recordings = await getRecordings(viewer.timeZone)
  return { viewer, recording: recordings.find((recording) => recording.id === id) }
}

export async function generateMetadata({ params }: RecordingPageProps): Promise<Metadata> {
  const { recording } = await findRecording((await params).id)
  return { title: recording?.title ?? "Recording" }
}

export default async function RecordingPage({ params, searchParams }: RecordingPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams])
  const { viewer, recording } = await findRecording(id)
  if (!recording) notFound()

  return (
    <DashboardLayout crumbs={[{ label: "Recordings", href: "/sessions" }, { label: recording.title }]}>
      <RecordingDetailScreen
        recording={recording}
        back={backLinkFor(from)}
        now={wallClock(new Date(), viewer.timeZone).getTime()}
      />
    </DashboardLayout>
  )
}
