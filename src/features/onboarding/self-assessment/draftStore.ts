"use client"

import * as React from "react"
import { z } from "zod"

import { WRITTEN_ANSWER_MAX_LENGTH, type AssessmentAnswers } from "@/lib/selfAssessment"

// The in-progress self-assessment, shared by every route of the flow
// (form, chat, results) so switching screens never loses answers.
//
// Kept in sessionStorage until drafts are saved on the server: it
// survives a refresh, and it clears when the tab closes, which suits
// answers this personal on a possibly shared machine.

const STORAGE_KEY = "ee.selfAssessment.draft.v1"

const draftSchema = z.object({
  ratings: z.record(z.string(), z.number().int().min(1).max(5)),
  written: z.record(z.string(), z.string().max(WRITTEN_ANSWER_MAX_LENGTH)),
  position: z.object({ sectionId: z.string(), index: z.number().int().min(0) }).nullable(),
  seenIntros: z.array(z.string()),
})

export type Draft = AssessmentAnswers & {
  /** Where the lead is, to resume there. */
  position: { sectionId: string; index: number } | null
  /** Sections whose intro dialog has been dismissed. */
  seenIntros: string[]
}

const EMPTY_DRAFT: Draft = { ratings: {}, written: {}, position: null, seenIntros: [] }

let current: Draft | null = null
const listeners = new Set<() => void>()

function load(): Draft {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) return draftSchema.parse(JSON.parse(raw))
  } catch {
    // Unreadable or tampered — start over rather than crash.
  }
  return EMPTY_DRAFT
}

function getSnapshot() {
  current ??= load()
  return current
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function update(change: (draft: Draft) => Draft) {
  current = change(getSnapshot())
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch {
    // Storage full or blocked: the answers still live for this page.
  }
  listeners.forEach((listener) => listener())
}

/** The draft right now — for event handlers and timers, where a value
 *  captured at render time may already be stale. */
export function readDraft() {
  return getSnapshot()
}

/** The draft. Empty during server rendering; use useDraftReady to wait. */
export function useDraft() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_DRAFT)
}

const subscribeNever = () => () => {}

/** False on the server and during hydration, true once the draft is read. */
export function useDraftReady() {
  return React.useSyncExternalStore(subscribeNever, () => true, () => false)
}

export const draftActions = {
  rate(key: string, value: number) {
    update((draft) => ({ ...draft, ratings: { ...draft.ratings, [key]: value } }))
  },
  write(key: string, value: string) {
    update((draft) => ({ ...draft, written: { ...draft.written, [key]: value } }))
  },
  moveTo(sectionId: string, index: number) {
    update((draft) => ({ ...draft, position: { sectionId, index } }))
  },
  markIntroSeen(sectionId: string) {
    update((draft) =>
      draft.seenIntros.includes(sectionId)
        ? draft
        : { ...draft, seenIntros: [...draft.seenIntros, sectionId] }
    )
  },
}
