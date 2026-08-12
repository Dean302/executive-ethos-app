"use client"

import * as React from "react"

import { Button } from "@/components/common/button"
import { Card } from "@/components/common/card"
import { Input } from "@/components/common/input"
import { ArrowRightIcon } from "@/components/common/svg"
import { PEER_INVITE, RELATIONSHIP_OPTIONS } from "@/features/onboarding/data"

type PeerRow = { name: string; email: string; relationship: string }

const EMPTY: PeerRow = { name: "", email: "", relationship: "" }

function PeerInvite({ onDone }: { onDone: () => void }) {
  const [rows, setRows] = React.useState<PeerRow[]>([EMPTY, EMPTY, EMPTY])
  const [links, setLinks] = React.useState<{ row: PeerRow; link: string }[]>([])

  function update(index: number, patch: Partial<PeerRow>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    )
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const filled = rows.filter((row) => row.name.trim() && row.email.trim())
    if (!filled.length) return
    // Placeholder tokens — real invites need signed, expiring links.
    setLinks(
      filled.map((row, i) => ({
        row,
        link: `${window.location.origin}/peer-feedback?r=${i + 1}`,
      }))
    )
  }

  if (links.length) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">{PEER_INVITE.done}</p>
        {links.map(({ row, link }) => (
          <Card key={row.email} title={row.name} description={row.relationship}>
            <code className="text-muted-foreground block truncate text-[13px]">
              {link}
            </code>
          </Card>
        ))}
        <Button
          onClick={onDone}
          className="h-12 w-full gap-2 rounded-full text-[15px] font-semibold"
        >
          Go to your dashboard
          <ArrowRightIcon />
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">{PEER_INVITE.subtitle}</p>

      {rows.map((row, i) => (
        <Card key={i} className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Name"
            variant="field"
            placeholder="Alex Morgan"
            value={row.name}
            onChange={(e) => update(i, { name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            variant="field"
            placeholder="alex@company.com"
            value={row.email}
            onChange={(e) => update(i, { email: e.target.value })}
          />
          <div className="flex flex-col">
            <label
              htmlFor={`relationship-${i}`}
              className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.1em] uppercase"
            >
              Relationship
            </label>
            <select
              id={`relationship-${i}`}
              value={row.relationship}
              onChange={(e) => update(i, { relationship: e.target.value })}
              className="border-input bg-card focus-visible:border-ring h-12 cursor-pointer rounded-[10px] border-[1.5px] px-4 text-sm outline-none"
            >
              <option value="">Select…</option>
              {RELATIONSHIP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </Card>
      ))}

      <Button
        type="submit"
        className="h-12 gap-2 self-start rounded-full px-6 text-[15px] font-semibold"
      >
        Generate invite links
        <ArrowRightIcon />
      </Button>
    </form>
  )
}

export { PeerInvite }
