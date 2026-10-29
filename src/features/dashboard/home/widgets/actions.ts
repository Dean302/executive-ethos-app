"use server"

import { getPeerInvites, reminderState } from "@/lib/peerReviews"
import { peerReminderSchema } from "@/schemas/peerReminderSchema"

export type SendRemindersResult = { ok: true; names: string[] } | { error: string }

/**
 * Emails a reminder to outstanding peer reviewers. Each invite is checked
 * again here (theirs, still pending, not reminded too recently), so the
 * client can't push a reminder past the limits.
 */
export async function sendPeerReminders(input: unknown): Promise<SendRemindersResult> {
  const parsed = peerReminderSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Choose who to remind." }

  const now = new Date()
  const invites = await getPeerInvites(now)
  const chosen = parsed.data.inviteIds.map((id) => invites.find((invite) => invite.id === id))
  if (chosen.some((invite) => !invite)) return { error: "We couldn't find one of those reviewers. Refresh and try again." }
  const blocked = chosen.find((invite) => !reminderState(invite!, now).can)
  if (blocked) return { error: reminderState(blocked, now).reason ?? `${blocked.name} can't be reminded right now.` }

  // No email service or invite store is connected yet, so nothing is sent
  // or recorded. When they are: email each reviewer their review link and
  // add the reminder to the invite, which starts its cooldown.
  return { ok: true, names: chosen.map((invite) => invite!.name) }
}
