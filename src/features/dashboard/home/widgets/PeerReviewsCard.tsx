"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check, Send, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/common/button"
import { Card } from "@/components/common/card"
import { roundLabel, type PeerReviewSummary } from "@/lib/peerReviews"

import { RemindDialog } from "./RemindDialog"

const firstName = (name: string) => name.split(" ")[0]

type PeerReviewsCardProps = {
  summary: PeerReviewSummary
  /** The executive, for the reminder email. */
  senderName: string
}

/**
 * The current round of peer reviews. Never a dead end: while reviews are
 * out it offers a reminder; once the round is in, a comparison and more
 * invites; and it always links to the full list.
 */
function PeerReviewsCard({ summary, senderName }: PeerReviewsCardProps) {
  const [open, setOpen] = React.useState(false)
  const [sent, setSent] = React.useState<string[] | null>(null)
  const remindable = summary.outstanding.filter((reviewer) => reviewer.canRemind)
  const blocked = summary.outstanding.length > 0 && remindable.length === 0
  const round = roundLabel(summary.round)

  return (
    <Card
      id="peer-reviews"
      className="scroll-mt-6 text-sm"
      title="Peer reviews"
      icon={Users}
      centerAction
      action={
        <Link href="/peer-reviews" className="text-primary text-sm font-medium hover:underline">
          Manage
        </Link>
      }
    >
      <p className="text-foreground font-sans text-2xl">
        {summary.received}
        <span className="text-foreground/35">{` of ${summary.needed} received`}</span>
      </p>
      <p className="text-muted-foreground mt-0.5 text-xs font-semibold tracking-[0.06em] uppercase">{round}</p>
      <div
        role="progressbar"
        aria-label={`${round} peer reviews received`}
        aria-valuemin={0}
        aria-valuemax={summary.needed}
        aria-valuenow={summary.received}
        className="bg-secondary mt-3 h-1.5 overflow-hidden rounded-full"
      >
        <div
          className="bg-accent h-full rounded-full"
          style={{ width: `${Math.min(1, summary.received / summary.needed) * 100}%` }}
        />
      </div>

      {summary.complete ? (
        <>
          <p className="text-muted-foreground mt-3 text-sm">
            <span className="text-success font-medium">All in.</span> See how your peers&apos; view compares with your
            own and your recordings. Asking again each quarter shows what&apos;s changed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="gap-1.5" render={<Link href="/goals#perception" />} nativeButton={false}>
              See how you compare
              <ArrowRight aria-hidden className="size-3.5" strokeWidth={2} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              render={<Link href="/peer-reviews#invite" />}
              nativeButton={false}
            >
              <UserPlus aria-hidden className="size-3.5" strokeWidth={2} />
              Invite more
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mt-3 text-sm">
            {summary.outstanding.length > 0
              ? `Waiting on ${summary.outstanding.map((reviewer) => reviewer.name).join(", ")}.`
              : `Invite ${summary.needed - summary.received} more to complete the ${round.toLowerCase()}.`}
          </p>
          {sent ? (
            <p role="status" className="text-success mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
              <Check aria-hidden className="size-4" strokeWidth={2.25} />
              {`Reminder emailed to ${sent.map(firstName).join(" and ")}`}
            </p>
          ) : remindable.length > 0 ? (
            <Button size="sm" className="mt-4 gap-1.5" onClick={() => setOpen(true)}>
              <Send aria-hidden className="size-3.5" strokeWidth={2} />
              Send reminder
            </Button>
          ) : blocked ? (
            <p className="text-muted-foreground mt-4 text-sm">
              {summary.outstanding[0].reminderNote ?? "Check the details on Peer reviews."}
            </p>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="mt-4 gap-1.5"
              render={<Link href="/peer-reviews#invite" />}
              nativeButton={false}
            >
              <UserPlus aria-hidden className="size-3.5" strokeWidth={2} />
              Invite a peer
            </Button>
          )}
        </>
      )}

      {remindable.length > 0 && (
        <RemindDialog
          open={open}
          onOpenChange={setOpen}
          reviewers={remindable}
          senderName={senderName}
          onSent={setSent}
        />
      )}
    </Card>
  )
}

export { PeerReviewsCard }
