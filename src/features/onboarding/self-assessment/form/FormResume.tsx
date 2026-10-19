"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { ASSESSMENT_SECTIONS, isAnswered } from "@/lib/selfAssessment"

import { readDraft, useDraftReady } from "../draftStore"

/** Sends the lead to where they left off: their saved place, or section one. */
function FormResume({ sectionHrefs }: { sectionHrefs: Record<string, string> }) {
  const router = useRouter()
  const ready = useDraftReady()

  React.useEffect(() => {
    if (!ready) return
    const draft = readDraft()
    const saved = draft.position?.sectionId
    const firstOpen = ASSESSMENT_SECTIONS.find((section) =>
      section.questions.some((_, i) => !isAnswered(section, i, draft))
    )
    const target = saved && sectionHrefs[saved] ? saved : (firstOpen ?? ASSESSMENT_SECTIONS[0]).id
    router.replace(sectionHrefs[target])
  }, [ready, router, sectionHrefs])

  return null
}

export { FormResume }
