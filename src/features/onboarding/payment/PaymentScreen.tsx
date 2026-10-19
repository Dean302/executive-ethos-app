"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { monthlyRate, type PlanId, type TermDays } from "@/lib/pricing"

import { startProgram } from "./actions"
import { ChangeProgramDialog } from "./ChangeProgramDialog"
import { PaymentForm, type PaymentMethod } from "./PaymentForm"
import { PaymentStatus } from "./PaymentStatus"
import { ProgramBanner } from "./ProgramBanner"

// The design continues to the onboarding welcome step, which isn't built
// yet; until it is, a paid lead lands on the dashboard.
const NEXT_STEP = "/dashboard"
// The processing state shows for at least this long, so a fast response
// doesn't flash past and the payment still reads as happening.
const MIN_PROCESSING_MS = 1600
// How long the confirmation shows before moving on.
const CONFIRMATION_MS = 1100

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

type PaymentScreenProps = {
  initialPlanId: PlanId
  initialTermDays: TermDays
}

/**
 * Review the program (prefilled from the discovery call), change it if
 * needed, and pay the first month.
 */
function PaymentScreen({ initialPlanId, initialTermDays }: PaymentScreenProps) {
  const router = useRouter()
  const [planId, setPlanId] = React.useState(initialPlanId)
  const [termDays, setTermDays] = React.useState(initialTermDays)
  const [changeOpen, setChangeOpen] = React.useState(false)
  const [status, setStatus] = React.useState<"form" | "processing" | "success">("form")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (status !== "success") return
    const timer = window.setTimeout(() => router.push(NEXT_STEP), CONFIRMATION_MS)
    return () => window.clearTimeout(timer)
  }, [status, router])

  const pay = async (paymentMethod: PaymentMethod) => {
    setError(null)
    setStatus("processing")
    try {
      const [result] = await Promise.all([
        startProgram({ planId, termDays, paymentMethod }),
        wait(MIN_PROCESSING_MS),
      ])
      if ("error" in result) {
        setError(result.error)
        setStatus("form")
      } else {
        setStatus("success")
      }
    } catch {
      setError("We couldn't take the payment. Check your connection and try again.")
      setStatus("form")
    }
  }

  if (status !== "form") {
    return <PaymentStatus status={status} planId={planId} />
  }

  return (
    <>
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
        Payment
      </p>
      <h1 className="mt-1.5 text-3xl text-balance">Configure your program</h1>

      <ProgramBanner planId={planId} termDays={termDays} onChange={() => setChangeOpen(true)} />

      <ChangeProgramDialog
        open={changeOpen}
        onOpenChange={setChangeOpen}
        planId={planId}
        termDays={termDays}
        onPlanChange={setPlanId}
        onTermChange={setTermDays}
      />

      <PaymentForm amountDue={monthlyRate(planId, termDays)} error={error} onSubmit={pay} />
    </>
  )
}

export { PaymentScreen }
