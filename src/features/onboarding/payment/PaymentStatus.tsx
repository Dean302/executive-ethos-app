"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { LogoLoader } from "@/components/common/svg"
import type { PlanId } from "@/lib/pricing"

type PaymentStatusProps = {
  status: "processing" | "success"
  planId: PlanId
}

/** Full-column status while the payment runs, then its confirmation. */
function PaymentStatus({ status, planId }: PaymentStatusProps) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const success = status === "success"

  // The form (and the focused Pay button) just unmounted; keep focus on
  // the page's current content.
  React.useEffect(() => {
    headingRef.current?.focus()
  }, [status])

  return (
    <div className="flex flex-col items-center py-20 text-center">
      {success ? (
        <span className="bg-success/15 text-success animate-in zoom-in-75 fade-in flex size-16 items-center justify-center rounded-full duration-300">
          <Check aria-hidden className="size-7" strokeWidth={2.5} />
        </span>
      ) : (
        <LogoLoader className="text-primary size-16" label="Processing your payment" />
      )}
      <div role="status" className="contents">
        <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl text-balance outline-none">
          {success ? "Payment confirmed" : "Processing your payment"}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xs text-[15px]">
          {success
            ? `You're all set, welcome to ${planId}.`
            : "Just a moment, we're setting everything up."}
        </p>
      </div>
    </div>
  )
}

export { PaymentStatus }
