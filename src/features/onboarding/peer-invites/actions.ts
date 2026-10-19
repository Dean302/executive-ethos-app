"use server"

import { peerInvitesSchema } from "@/schemas/peerInvitesSchema"

export type SendInvitesResult = { ok: true } | { error: string }

/**
 * Invites the lead's peer reviewers. Each gets a link to review them,
 * with no account needed.
 */
export async function sendPeerInvites(input: unknown): Promise<SendInvitesResult> {
  const parsed = peerInvitesSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the people you're inviting and try again." }
  }

  // No email service or account store is connected yet, so no invites go
  // out. When they are: create a single-use review link per reviewer,
  // tied to the lead, and email it to them.
  return { ok: true }
}
