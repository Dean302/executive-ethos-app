import { z } from "zod"

import { FLAG_NOTE_MAX_LENGTH } from "@/lib/coachFlags"

/** Flagging a recording for the coach, or changing or removing the flag. */
export const coachFlagSchema = z.object({
  recordingId: z.string().min(1),
  flagged: z.boolean(),
  note: z.string().trim().max(FLAG_NOTE_MAX_LENGTH, `Keep the note under ${FLAG_NOTE_MAX_LENGTH} characters`),
})
