"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { BrandMark } from "@/components/common/brandMark"
import { Button } from "@/components/common/button"
import { Card } from "@/components/common/card"
import { Input } from "@/components/common/input"
import { Radio, RadioGroup } from "@/components/common/radio"
import {
  FOCUS_OPTIONS,
  ROLE_OPTIONS,
  type Focus,
  type Role,
} from "@/features/onboarding/data"
import { PeerInvite } from "@/features/onboarding/PeerInvite"
import { useStoredName } from "@/features/onboarding/useStoredName"

/**
 * The manual alternative to the guided conversation — same profile fields,
 * filled in directly.
 */
function SetupYourself() {
  const router = useRouter()
  const storedName = useStoredName()
  // Seeded from sign-up until the field is edited — derived rather than
  // copied into state, so there's no effect to sync.
  const [edited, setEdited] = React.useState<string | null>(null)
  const name = edited ?? storedName ?? ""
  const [role, setRole] = React.useState<Role | null>(null)
  const [focus, setFocus] = React.useState<Focus | null>(null)

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <header className="border-border flex items-center justify-between border-b px-10 py-5">
        <div className="flex items-center gap-2.5">
          <BrandMark size="sm" />
          <span className="text-sm font-bold tracking-[-0.01em]">
            The Executive Ethos
          </span>
        </div>
        <Button
          variant="ghost"
          render={<Link href="/onboarding/start" />}
          className="text-muted-foreground h-9 rounded-full px-4 text-[13px]"
        >
          Use the guided setup
        </Button>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-10 py-12">
        <h1 className="mb-2 text-[clamp(28px,3vw,36px)] leading-tight font-bold tracking-[-0.02em]">
          Set up your profile
        </h1>
        <p className="text-muted-foreground mb-9 text-base">
          The same profile Ethos builds in conversation — filled in yourself.
        </p>

        <div className="flex flex-col gap-4">
          <Card title="Your identity">
            <Input
              label="First name"
              variant="field"
              placeholder="Jordan"
              value={name}
              onChange={(e) => setEdited(e.target.value)}
            />
          </Card>

          <Card title="Your role">
            <RadioGroup
              value={role ?? ""}
              onValueChange={(value) => setRole(value as Role)}
              className="grid gap-3 sm:grid-cols-2"
            >
              {ROLE_OPTIONS.map((option) => (
                <Radio key={option} value={option} className="text-center">
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          </Card>

          <Card title="Your focus area">
            <RadioGroup
              value={focus ?? ""}
              onValueChange={(value) => setFocus(value as Focus)}
              className="flex flex-col gap-3"
            >
              {FOCUS_OPTIONS.map((option) => (
                <Radio
                  key={option.key}
                  value={option.key}
                  className="text-left"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </Card>

          <Card title="Peer perspectives">
            <PeerInvite onDone={() => router.push("/dashboard")} />
          </Card>
        </div>
      </main>
    </div>
  )
}

export { SetupYourself }
