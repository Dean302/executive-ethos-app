"use client"

import * as React from "react"

import { RadarBreakdown } from "@/components/charts/RadarBreakdown"
import { Card } from "@/components/common/card"
import { Select } from "@/components/common/select"
import { useSettling } from "@/hooks"
import type { CriterionTarget } from "@/lib/dashboard"
import type { ScoredRecording } from "@/lib/scores"

import { PERIODS, viewFor, type Period } from "./periods"

type GrowthCardProps = {
  /** Scored recordings, newest first. */
  recordings: ScoredRecording[]
  targets: CriterionTarget[]
}

/**
 * "Your growth, made visible": the six criteria for a chosen period,
 * against the quarter's goals. The period applies to this card only; the
 * banner above always shows where they stand now.
 */
function GrowthCard({ recordings, targets }: GrowthCardProps) {
  const [period, setPeriod] = React.useState<Period>("latest")
  const settling = useSettling(period)
  const view = viewFor(period, recordings)
  const selectId = React.useId()
  if (!view) return null

  return (
    <Card
      className="text-sm"
      title="Your growth, made visible"
      description={view.description}
      action={
        <>
          <label htmlFor={selectId} className="sr-only">
            Period
          </label>
          <Select id={selectId} value={period} onChange={(event) => setPeriod(event.target.value as Period)}>
            {PERIODS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </>
      }
    >
      {view.fallbackNote && (
        <p className="border-border bg-secondary/40 text-muted-foreground mb-6 rounded-inset border px-4 py-2.5 text-sm">
          {view.fallbackNote}
        </p>
      )}

      <RadarBreakdown
        caption={view.caption}
        compareLabel={view.compareLabel}
        settling={settling}
        items={targets.map(({ key, label, goal }) => ({
          key,
          label,
          goal,
          current: view.scores[key],
          previous: view.compare?.[key] ?? null,
        }))}
      />
    </Card>
  )
}

export { GrowthCard }
