"use server"

import { getRecordings } from "@/lib/recordings"
import { getViewer } from "@/lib/viewer"
import { coachFlagSchema } from "@/schemas/coachFlagSchema"

export type SaveFlagResult = { ok: true } | { error: string }

/**
 * Flags a recording for the coach, saves its note, or removes the flag.
 * Flagging a discussed recording again reopens it for the next session.
 */
export async function saveCoachFlag(input: unknown): Promise<SaveFlagResult> {
  const parsed = coachFlagSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "We couldn't save that. Try again." }

  const viewer = await getViewer()
  const recordings = await getRecordings(viewer.timeZone)
  if (!recordings.some((recording) => recording.id === parsed.data.recordingId)) {
    return { error: "We couldn't find that recording." }
  }

  // No store is connected yet, so the flag isn't kept. When it is: save it
  // against the executive's recording (clearing the note when unflagged,
  // and the discussed date and outcome when flagged again) and add it to
  // the coach's prep for the next session.
  return { ok: true }
}
