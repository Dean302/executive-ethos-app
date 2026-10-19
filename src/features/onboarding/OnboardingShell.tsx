import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Logo } from "@/components/common/logo"
import { cn } from "@/lib/utils"

type OnboardingShellProps = {
  /** Previous step. Omit on a step with nowhere meaningful to go back to. */
  backHref?: string
  /** A wider column, for steps laid out in several columns. */
  wide?: boolean
  /** Where this step sits in the onboarding sequence. */
  progress?: { step: number; total: number }
  children: React.ReactNode
}

/**
 * Focus frame for onboarding steps: no app navigation, just the logo (and
 * a way back) above one centred column.
 */
function OnboardingShell({ backHref, wide = false, progress, children }: OnboardingShellProps) {
  return (
    <div className="bg-background flex min-h-dvh flex-col overflow-x-clip">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link
              href={backHref}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
              Back
            </Link>
          )}
          <Logo height={24} />
        </div>
      </header>

      {progress && (
        <div
          role="progressbar"
          aria-label="Onboarding progress"
          aria-valuemin={1}
          aria-valuemax={progress.total}
          aria-valuenow={progress.step}
          aria-valuetext={`Step ${progress.step} of ${progress.total}`}
          className="bg-border h-0.5 w-full"
        >
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${(progress.step / progress.total) * 100}%` }}
          />
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className={cn("w-full", wide ? "max-w-3xl" : "max-w-xl")}>{children}</div>
      </main>
    </div>
  )
}

export { OnboardingShell }
