import { z } from "zod"

/** The passage takes about 45 seconds; anything much shorter wasn't read in full. */
export const MIN_SIGNATURE_MS = 20_000
/** The recorder stops itself here. */
export const MAX_SIGNATURE_MS = 120_000
/** Two minutes at 64 kbps is under 1 MB; the rest is headroom for browsers that ignore the bitrate. */
export const MAX_SIGNATURE_BYTES = 2.5 * 1024 * 1024

export const SIGNATURE_MIME_TYPES = ["audio/webm", "audio/mp4", "audio/ogg"]

export const voiceSignatureSchema = z.object({
  audio: z
    .file("Record your voice signature first")
    .min(1, "The recording came through empty. Record it again.")
    .max(MAX_SIGNATURE_BYTES, "That recording is too large. Record it again.")
    .refine(
      (file) => SIGNATURE_MIME_TYPES.includes(file.type.split(";")[0]),
      "That recording is in a format we can't use. Record it again."
    ),
  durationMs: z.coerce
    .number()
    .min(MIN_SIGNATURE_MS, "Read the whole passage, then stop the recording.")
    .max(MAX_SIGNATURE_MS + 5_000, "That recording is too long. Record it again."),
})
