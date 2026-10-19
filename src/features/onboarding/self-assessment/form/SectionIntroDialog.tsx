"use client"

import type * as React from "react"
import {
  Compass,
  Eye,
  Flag,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/common/button"
import { Modal } from "@/components/common/modal"
import type { AssessmentSection } from "@/lib/selfAssessment"

const SECTION_ICONS: Record<string, LucideIcon> = {
  communication: MessageSquare,
  presence: Users,
  leadership: Compass,
  awareness: Eye,
  reflection: Lightbulb,
  goals: Flag,
}

type SectionIntroDialogProps = {
  section: AssessmentSection
  open: boolean
  onDismiss: () => void
  /** Where focus goes once it's dismissed: the first question. */
  finalFocus?: React.RefObject<HTMLElement | null>
}

/** A section's one-time introduction, shown as the lead enters it. */
function SectionIntroDialog({ section, open, onDismiss, finalFocus }: SectionIntroDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => !isOpen && onDismiss()}
      finalFocus={finalFocus}
      icon={SECTION_ICONS[section.id] ?? Sparkles}
      title={section.title}
      description={section.intro}
      descriptionClassName="text-foreground/80 text-[13.5px] italic"
      className="max-w-sm text-center [--modal-pad:--spacing(6)]"
    >
      <div className="mt-1 flex justify-center">
        <Button onClick={onDismiss} className="w-full rounded-full sm:w-auto sm:px-8">
          Let&apos;s go
        </Button>
      </div>
    </Modal>
  )
}

export { SectionIntroDialog }
