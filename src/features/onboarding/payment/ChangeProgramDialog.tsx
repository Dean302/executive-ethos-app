"use client"

import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/common/button"
import { Modal } from "@/components/common/modal"
import type { PlanId, TermDays } from "@/lib/pricing"

import { ProgramSelector } from "./ProgramSelector"

type ChangeProgramDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: PlanId
  termDays: TermDays
  onPlanChange: (planId: PlanId) => void
  onTermChange: (termDays: TermDays) => void
}

/** Switch plan or term; the banner's totals follow immediately. */
function ChangeProgramDialog({
  open,
  onOpenChange,
  ...selector
}: ChangeProgramDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={SlidersHorizontal}
      title="Change your program"
      description="Switch tiers or terms. Your total updates immediately."
      className="max-h-[85vh] w-[80vw] max-w-[80vw] gap-6 overflow-y-auto [--modal-pad:--spacing(6)] sm:max-w-[80vw]"
      footer={
        <Button onClick={() => onOpenChange(false)} className="w-full rounded-full sm:w-auto sm:px-8">
          Done
        </Button>
      }
    >
      <ProgramSelector {...selector} />
    </Modal>
  )
}

export { ChangeProgramDialog }
