"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/common/button"
import { isAssessmentComplete, missionStatementParts } from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

import { useDraft, useDraftReady } from "../draftStore"

type StatementScreenProps = {
  /** Where an unfinished assessment is sent back to. */
  formHref: string
  /** The results, next. */
  nextHref: string
}

/**
 * The brand mission statement, assembled from the Golden Circle answers
 * just given: a reveal, not an editor. Editing comes later, in the app.
 */
function StatementScreen({ formHref, nextHref }: StatementScreenProps) {
  const router = useRouter()
  const ready = useDraftReady()
  const draft = useDraft()
  const complete = isAssessmentComplete(draft)

  React.useEffect(() => {
    if (ready && !complete) router.replace(formHref)
  }, [ready, complete, router, formHref])

  if (!ready || !complete) return null

  const { why, how, what, isEmpty } = missionStatementParts(draft.written)

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <span className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
        <Sparkles aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-[0.06em] uppercase">
        Your Brand Mission Statement
      </p>
      <h1 className="mt-1.5 text-3xl text-balance">Built from your own Golden Circle</h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-[15px]">
        Assembled from what you just answered — adapted from Simon Sinek&apos;s Golden Circle framework. Not
        final: you can edit it any time from the Why tab once you&apos;re in the app.
      </p>

      <div className="bg-card mt-8 rounded-container border px-7 py-8 text-left">
        {isEmpty ? (
          <p className="text-muted-foreground text-sm italic">
            Not enough answered yet to build a statement — you can still continue and fill it in later.
          </p>
        ) : (
          <p className="font-heading text-foreground text-xl leading-relaxed">
            We believe in <span className="text-oxblood">{why}</span> We do this by{" "}
            <span className="text-warning">{how}</span> This shows up every day through{" "}
            <span className="text-success">{what}</span>
          </p>
        )}
      </div>

      <Link href={nextHref} className={cn(buttonVariants({ size: "lg" }), "mt-8 gap-2")}>
        Continue
        <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
      </Link>
    </div>
  )
}

export { StatementScreen }
