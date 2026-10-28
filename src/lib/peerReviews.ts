import { MIN_PEER_INVITES } from "@/schemas/peerInvitesSchema"

// Peer reviews: people the executive invited to review how they
// communicate. They come in rounds; the first is the baseline, and asking
// again each quarter shows what's changed.

/** A reminder can go out at most this often per person… */
export const REMIND_EVERY_DAYS = 3
/** …and this many times in all. */
export const MAX_REMINDERS = 3
/** An unanswered invite lapses after this long. */
export const EXPIRES_AFTER_DAYS = 21

const DAY = 24 * 60 * 60 * 1000

export type PeerInvite = {
  id: string
  round: number
  name: string
  email: string
  invitedAt: Date
  reminders: Date[]
  submittedAt?: Date
  withdrawnAt?: Date
  bounced?: boolean
}

export type PeerStatus = "submitted" | "pending" | "expired" | "bounced" | "withdrawn"

export function statusOf(invite: PeerInvite, now: Date): PeerStatus {
  if (invite.withdrawnAt) return "withdrawn"
  if (invite.submittedAt) return "submitted"
  if (invite.bounced) return "bounced"
  if (now.getTime() - invite.invitedAt.getTime() > EXPIRES_AFTER_DAYS * DAY) return "expired"
  return "pending"
}

const daysSince = (date: Date, now: Date) => Math.floor((now.getTime() - date.getTime()) / DAY)

/** Whether a reminder can go out now, and if not, why. */
export function reminderState(invite: PeerInvite, now: Date): { can: boolean; reason?: string } {
  if (statusOf(invite, now) !== "pending") return { can: false }
  if (invite.reminders.length >= MAX_REMINDERS) {
    return { can: false, reason: `${MAX_REMINDERS} reminders sent. A personal note, or asking someone else, works better now.` }
  }
  const last = invite.reminders[invite.reminders.length - 1]
  if (last && daysSince(last, now) < REMIND_EVERY_DAYS) {
    const ago = daysSince(last, now)
    const wait = REMIND_EVERY_DAYS - ago
    return {
      can: false,
      reason: `Reminded ${ago === 0 ? "today" : `${ago} days ago`}. You can remind again in ${wait} day${wait === 1 ? "" : "s"}.`,
    }
  }
  return { can: true }
}

export function roundLabel(round: number) {
  return round === 1 ? "Baseline" : `Round ${round}`
}

export type OutstandingReviewer = {
  id: string
  name: string
  email: string
  canRemind: boolean
  /** Why a reminder can't go out, when it can't. */
  reminderNote?: string
}

export type PeerReviewSummary = {
  round: number
  /** Reviews needed to complete the round. */
  needed: number
  received: number
  complete: boolean
  /** Still to come in: pending, expired or bounced. */
  outstanding: OutstandingReviewer[]
}

/** The current round at a glance, for the dashboard. */
export function summarisePeerReviews(invites: PeerInvite[], now: Date): PeerReviewSummary {
  const round = invites.length ? Math.max(...invites.map((invite) => invite.round)) : 1
  const current = invites.filter((invite) => invite.round === round && statusOf(invite, now) !== "withdrawn")
  const received = current.filter((invite) => statusOf(invite, now) === "submitted").length
  const needed = Math.max(MIN_PEER_INVITES, current.length)
  return {
    round,
    needed,
    received,
    complete: received >= needed,
    outstanding: current
      .filter((invite) => ["pending", "expired", "bounced"].includes(statusOf(invite, now)))
      .map((invite) => {
        const { can, reason } = reminderState(invite, now)
        return { id: invite.id, name: invite.name, email: invite.email, canRemind: can, reminderNote: reason }
      }),
  }
}

/**
 * The signed-in executive's peer invites. Until invites are stored, every
 * executive sees a sample baseline round: two peers asked a fortnight ago,
 * one answered.
 */
export async function getPeerInvites(now: Date): Promise<PeerInvite[]> {
  const daysAgo = (days: number) => new Date(now.getTime() - days * DAY)
  return [
    {
      id: "peer-priya",
      round: 1,
      name: "Priya Nair",
      email: "priya.nair@meridianhealth.com",
      invitedAt: daysAgo(14),
      reminders: [],
      submittedAt: daysAgo(7),
    },
    {
      id: "peer-sam",
      round: 1,
      name: "Sam Okafor",
      email: "sam.okafor@meridianhealth.com",
      invitedAt: daysAgo(14),
      reminders: [],
    },
  ]
}
