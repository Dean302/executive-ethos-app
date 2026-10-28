"use client"

import * as React from "react"
import { AlertCircle, Mail, Send } from "lucide-react"

import { Button } from "@/components/common/button"
import { Modal } from "@/components/common/modal"
import { PeerRing } from "@/components/illustrations"
import type { OutstandingReviewer } from "@/lib/peerReviews"

import { sendPeerReminders } from "./actions"

const firstName = (name: string) => name.split(" ")[0]

type RemindDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  reviewers: OutstandingReviewer[]
  /** The executive, for the email preview. */
  senderName: string
  onSent: (names: string[]) => void
}

/** Confirms a reminder, showing the email that will go out. */
function RemindDialog({ open, onOpenChange, reviewers, senderName, onSent }: RemindDialogProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const one = reviewers.length === 1

  const send = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await sendPeerReminders({ inviteIds: reviewers.map((reviewer) => reviewer.id) })
        if ("error" in result) {
          setError(result.error)
          return
        }
        onSent(result.names)
        onOpenChange(false)
      } catch {
        setError("We couldn't send the reminder. Check your connection and try again.")
      }
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      media={
        <div className="bg-tone-cream-soft flex justify-center pt-5">
          <PeerRing className="w-48" />
        </div>
      }
      title={`Send a reminder to ${one ? firstName(reviewers[0].name) : `${reviewers.length} people`}?`}
      description={`We'll email ${reviewers.map((reviewer) => `${reviewer.name} (${reviewer.email})`).join(" and ")} for you.`}
      headerClassName="gap-1"
      titleClassName="font-sans text-lg font-medium"
      className="overflow-hidden [--modal-pad:--spacing(6)] sm:max-w-md"
    >
      <div className="border-border bg-secondary/40 rounded-panel border p-4 text-sm">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] uppercase">
          <Mail aria-hidden className="size-3.5" strokeWidth={2} />
          The email
        </p>
        <p className="text-foreground mt-2 font-medium">{`A quick reminder from ${senderName}`}</p>
        <p className="text-muted-foreground mt-1.5 leading-relaxed">
          {`Hi ${one ? firstName(reviewers[0].name) : "there"}, ${firstName(senderName)} asked for your view on how they communicate. It takes about 10 minutes, no account needed, and your answers stay private. Your link is below.`}
        </p>
      </div>

      {error && (
        <p role="alert" className="text-destructive flex items-start gap-1.5 text-sm">
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <div className="mt-1 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={isPending}>
          Cancel
        </Button>
        <Button size="sm" className="gap-1.5" onClick={send} disabled={isPending}>
          <Send aria-hidden className="size-3.5" strokeWidth={2} />
          {isPending ? "Sending…" : "Send reminder"}
        </Button>
      </div>
    </Modal>
  )
}

export { RemindDialog }
