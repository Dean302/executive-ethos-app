import { z } from "zod"

/** Peer reviews needed for a baseline, the same on every plan. */
export const MIN_PEER_INVITES = 2
export const MAX_PEER_INVITES = 10

export const peerInviteSchema = z.object({
  name: z.string().trim().min(1, "Add their name").max(100, "Keep the name under 100 characters"),
  email: z.email("Enter a valid email address").max(254),
})

export type PeerInvite = z.infer<typeof peerInviteSchema>

export const peerInvitesSchema = z
  .array(peerInviteSchema)
  .min(MIN_PEER_INVITES, `Invite at least ${MIN_PEER_INVITES} people`)
  .max(MAX_PEER_INVITES, `Invite up to ${MAX_PEER_INVITES} people`)
  .refine(
    (invites) => new Set(invites.map((invite) => invite.email.toLowerCase())).size === invites.length,
    "Invite each person once"
  )
