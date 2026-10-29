import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DashboardLayout } from "@/components/dashboardLayout"
import { RecordingDetailScreen } from "@/features/dashboard"
import { backLinkFor } from "@/features/dashboard/recordings/detail/origins"
import { wallClock } from "@/lib/dates"
import { getCriterionTargets } from "@/lib/goals"
import { getRecordings } from "@/lib/recordings"
import { getViewer } from "@/lib/viewer"

type RecordingPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function findRecording(id: string) {
  const viewer = await getViewer()
  const recordings = await getRecordings(viewer.timeZone)
  const index = recordings.findIndex((recording) => recording.id === id)
  return { viewer, recording: recordings[index], previous: recordings[index + 1] ?? null }
}

export async function generateMetadata({ params }: RecordingPageProps): Promise<Metadata> {
  const { recording } = await findRecording((await params).id)
  return { title: recording?.title ?? "Recording" }
}

export default async function RecordingPage({ params, searchParams }: RecordingPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams])
  const [{ viewer, recording, previous }, targets] = await Promise.all([findRecording(id), getCriterionTargets()])
  if (!recording) notFound()

  return (
    <DashboardLayout crumbs={[{ label: "Recordings", href: "/sessions" }, { label: recording.title }]}>
      <RecordingDetailScreen
        recording={recording}
        previous={previous}
        targets={targets}
        back={backLinkFor(from)}
        now={wallClock(new Date(), viewer.timeZone).getTime()}
      />
    </DashboardLayout>
  )
}
