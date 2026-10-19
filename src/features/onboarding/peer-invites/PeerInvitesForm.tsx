"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Plus, Users, X } from "lucide-react"

import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import {
  MAX_PEER_INVITES,
  MIN_PEER_INVITES,
  peerInviteSchema,
  type PeerInvite,
} from "@/schemas/peerInvitesSchema"

import { sendPeerInvites } from "./actions"

type Row = PeerInvite & { id: number; touched: boolean }

type RowState = { status: "blank" } | { status: "valid" } | { status: "invalid"; message: string }

/** Classifies each row: blank rows are ignored, the rest must be valid. */
function rowStates(rows: Row[]): RowState[] {
  const seen = new Set<string>()
  return rows.map(({ name, email }) => {
    if (!name.trim() && !email.trim()) return { status: "blank" }
    const parsed = peerInviteSchema.safeParse({ name, email })
    if (!parsed.success) return { status: "invalid", message: parsed.error.issues[0].message }
    const key = parsed.data.email.toLowerCase()
    if (seen.has(key)) return { status: "invalid", message: "Already on your list" }
    seen.add(key)
    return { status: "valid" }
  })
}

/** Invite peer reviewers: anyone, by name and email, at least two. */
function PeerInvitesForm({ nextHref }: { nextHref: string }) {
  const router = useRouter()
  const nextId = React.useRef(MIN_PEER_INVITES)
  const [rows, setRows] = React.useState<Row[]>(() =>
    Array.from({ length: MIN_PEER_INVITES }, (_, id) => ({ id, name: "", email: "", touched: false }))
  )
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const nameInputs = React.useRef(new Map<number, HTMLInputElement>())
  const addButtonRef = React.useRef<HTMLButtonElement>(null)
  const focusRowId = React.useRef<number | null>(null)

  const states = rowStates(rows)
  const validCount = states.filter((state) => state.status === "valid").length
  const hasInvalid = states.some((state) => state.status === "invalid")
  const canSend = validCount >= MIN_PEER_INVITES && !hasInvalid

  // Focus the name field of a row that was just added.
  React.useEffect(() => {
    if (focusRowId.current === null) return
    nameInputs.current.get(focusRowId.current)?.focus()
    focusRowId.current = null
  }, [rows])

  const update = (id: number, change: Partial<Row>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...change } : row)))

  const add = () => {
    const id = nextId.current++
    focusRowId.current = id
    setRows((current) => [...current, { id, name: "", email: "", touched: false }])
  }

  const remove = (id: number) => {
    setRows((current) => current.filter((row) => row.id !== id))
    addButtonRef.current?.focus()
  }

  const send = () => {
    setError(null)
    const invites = rows
      .filter((_, i) => states[i].status === "valid")
      .map(({ name, email }) => ({ name: name.trim(), email: email.trim() }))
    startTransition(async () => {
      try {
        const result = await sendPeerInvites(invites)
        if ("error" in result) setError(result.error)
        else router.push(nextHref)
      } catch {
        setError("We couldn't send the invites. Check your connection and try again.")
      }
    })
  }

  return (
    <div className="text-center">
      <span className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
        <Users aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-[0.06em] uppercase">Peer Review</p>
      <h1 className="mt-1.5 text-3xl text-balance">It&apos;s not just how you see yourself</h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-[15px]">
        {`Invite at least ${MIN_PEER_INVITES} people: a colleague, a partner, someone who'll see you clearly. They'll get a link, no account needed. Their responses complete in the background; you don't need to wait for them to keep going.`}
      </p>

      <div className="mt-8 flex flex-col gap-3 text-left">
        {rows.map((row, i) => {
          const state = states[i]
          const message = row.touched && state.status === "invalid" ? state.message : null
          const messageId = `peer-invite-${row.id}-error`
          return (
            <div key={row.id}>
              <div className="flex items-center gap-2">
                <Input
                  ref={(element) => {
                    if (element) nameInputs.current.set(row.id, element)
                    else nameInputs.current.delete(row.id)
                  }}
                  label={`Name of person ${i + 1}`}
                  hideLabel
                  wrapperClassName="w-32 shrink-0 sm:w-40"
                  placeholder="Name"
                  autoComplete="off"
                  value={row.name}
                  aria-invalid={message ? true : undefined}
                  aria-describedby={message ? messageId : undefined}
                  onChange={(event) => update(row.id, { name: event.target.value })}
                />
                <Input
                  label={`Email of person ${i + 1}`}
                  hideLabel
                  wrapperClassName="min-w-0 flex-1"
                  type="email"
                  placeholder="email@company.com"
                  autoComplete="off"
                  value={row.email}
                  aria-invalid={message ? true : undefined}
                  aria-describedby={message ? messageId : undefined}
                  onChange={(event) => update(row.id, { email: event.target.value })}
                  onBlur={() => update(row.id, { touched: true })}
                />
                {rows.length > MIN_PEER_INVITES && (
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    aria-label={`Remove ${row.name.trim() || `person ${i + 1}`}`}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 cursor-pointer rounded-sm outline-none focus-visible:ring-3"
                  >
                    <X aria-hidden className="size-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>
              {message && (
                <p id={messageId} className="text-destructive mt-1.5 flex items-center gap-1.5 text-sm">
                  <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
                  {message}
                </p>
              )}
            </div>
          )
        })}

        {rows.length < MAX_PEER_INVITES && (
          <button
            ref={addButtonRef}
            type="button"
            onClick={add}
            className="text-primary focus-visible:ring-ring/50 flex cursor-pointer items-center gap-1.5 self-start rounded-sm text-sm outline-none hover:underline focus-visible:ring-3"
          >
            <Plus aria-hidden className="size-3.5" strokeWidth={2} />
            Add another
          </button>
        )}
      </div>

      <p aria-live="polite" className="text-muted-foreground mt-4 text-sm">
        {`${validCount} of ${MIN_PEER_INVITES} minimum`}
      </p>

      {error && (
        <p role="alert" className="text-destructive mt-4 flex items-center justify-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <Button size="lg" className="mt-6" disabled={!canSend || isPending} onClick={send}>
        {isPending ? "Sending…" : "Send invites & continue"}
      </Button>
    </div>
  )
}

export { PeerInvitesForm }
