import Link from "next/link"
import { ArrowLeft, ClipboardList, MessageCircle, type LucideIcon } from "lucide-react"

import {
  ASSESSMENT_QUESTION_COUNT,
  ASSESSMENT_SECTION_COUNT,
  type AssessmentMode,
} from "@/lib/selfAssessment"

const MODES: {
  mode: AssessmentMode
  icon: LucideIcon
  title: React.ReactNode
  description: string
  duration: string
}[] = [
  {
    mode: "chat",
    icon: MessageCircle,
    // "Ethos" on its own is the guide's name, set apart from the brand.
    title: (
      <>
        Connect with <em>Ethos</em>
      </>
    ),
    description: "Your AI guide walks you through it, one question at a time.",
    duration: "~13–15 minutes",
  },
  {
    mode: "form",
    icon: ClipboardList,
    title: "Full Assessment Form",
    description: "See every question per section, move at your own pace. Ends with a full results breakdown.",
    duration: "~15–18 minutes",
  },
]

type ModePickerProps = {
  /** Where each way through the assessment starts. */
  hrefs: Record<AssessmentMode, string>
  backHref: string
}

/** Choose how to take the self-assessment: with Ethos, or as a form. */
function ModePicker({ hrefs, backHref }: ModePickerProps) {
  return (
    <div className="text-center">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
        Executive Profile · Self-Assessment
      </p>
      <h1 className="mt-2 text-3xl text-balance">Now, the real work: an honest baseline</h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-[15px]">
        {`${ASSESSMENT_QUESTION_COUNT} questions, ${ASSESSMENT_SECTION_COUNT} dimensions, about 15 minutes.`}{" "}
        This isn&apos;t a test. There&apos;s no passing score. It&apos;s one of three inputs (yours, two
        peers&apos;, and the AI&apos;s) we use to find where perception and reality line up, and where they
        don&apos;t. Choose how you&apos;d like to go through it.
      </p>

      <ul className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
        {MODES.map(({ mode, icon: Icon, title, description, duration }) => (
          <li key={mode} className="flex">
            <Link
              href={hrefs[mode]}
              className="bg-card hover:border-primary/40 focus-visible:ring-ring/50 flex w-full flex-col justify-center rounded-panel border p-5 transition-colors outline-none focus-visible:ring-3"
            >
              <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full">
                <Icon aria-hidden className="size-4" strokeWidth={1.75} />
              </span>
              <span className="font-heading mt-3 block text-base">{title}</span>
              <span className="text-muted-foreground mt-1 block text-sm">{description}</span>
              <span className="text-primary mt-2 block text-sm">
                {duration}{" "}
                <span aria-hidden className="font-symbol">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={backHref}
        className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
        Back
      </Link>
    </div>
  )
}

export { ModePicker }
