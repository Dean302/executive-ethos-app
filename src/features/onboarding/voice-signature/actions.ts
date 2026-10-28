"use server"

import { voiceSignatureSchema } from "@/schemas/voiceSignatureSchema"

export type SaveSignatureResult = { ok: true } | { error: string }

/**
 * Stores the lead's voice signature: an unscored reference sample that
 * later recordings are checked against, so every score is confirmed to
 * be them speaking.
 */
export async function saveVoiceSignature(formData: FormData): Promise<SaveSignatureResult> {
  const parsed = voiceSignatureSchema.safeParse({
    audio: formData.get("audio"),
    durationMs: formData.get("durationMs"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "We couldn't save your recording. Record it again." }
  }

  // No file store or voice-verification service is connected yet, so the
  // recording is discarded. When they are: store it privately against the
  // lead (never shared with the coach or reviewers) and enrol it as their
  // reference voiceprint.
  return { ok: true }
}
