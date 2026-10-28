"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Ellipsis, Lock, LockOpen } from "lucide-react"

import { Sheet } from "@/components/common/sheet"
import { cn } from "@/lib/utils"

import {
  BUSINESS_ASSESSMENT,
  hasBusinessTools,
  inSection,
  LEADERSHIP_OS,
  LEADERSHIP_OS_UNLOCK_PERCENT,
  MORE_ITEMS,
  TAB_ITEMS,
} from "./navItems"

const TAB = "flex flex-1 flex-col items-center gap-1 py-2.5 text-sm outline-none focus-visible:bg-primary-hover"
const SHEET_ROW =
  "focus-visible:ring-ring/50 flex items-center gap-3 rounded-panel px-3 py-3 text-base font-medium transition-colors outline-none focus-visible:ring-3"
const SHEET_ACTIVE = "bg-primary-foreground text-primary"
const SHEET_INACTIVE = "text-primary-foreground/80 hover:bg-primary-hover hover:text-primary-foreground"

type MobileNavProps = {
  planId: string
  /** Business Assessment progress, 0–100. */
  businessAssessmentPercent: number
}

/**
 * Phones: a navy tab bar along the bottom, with the less frequent
 * destinations in a "More" sheet behind the last tab. Gold marks where
 * you are.
 */
function MobileNav({ planId, businessAssessmentPercent }: MobileNavProps) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = React.useState(false)
  const showBusiness = hasBusinessTools(planId)
  const unlocked = businessAssessmentPercent >= LEADERSHIP_OS_UNLOCK_PERCENT
  const moreActive =
    MORE_ITEMS.some((item) => inSection(pathname, item.href)) ||
    inSection(pathname, BUSINESS_ASSESSMENT.href) ||
    inSection(pathname, LEADERSHIP_OS.href) ||
    inSection(pathname, "/account")

  const close = () => setMoreOpen(false)

  return (
    <>
      <nav aria-label="Main" className="bg-primary fixed inset-x-0 bottom-0 z-10 flex lg:hidden">
        {TAB_ITEMS.map(({ href, label, shortLabel, icon: Icon }) => {
          const active = inSection(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(TAB, active ? "text-accent font-medium" : "text-muted-on-dark")}
            >
              <Icon aria-hidden className="size-5" strokeWidth={active ? 2.1 : 1.75} />
              {shortLabel ?? label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          className={cn(TAB, "cursor-pointer", moreActive || moreOpen ? "text-accent font-medium" : "text-muted-on-dark")}
        >
          <Ellipsis aria-hidden className="size-5" strokeWidth={moreActive ? 2.1 : 1.75} />
          More
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen} side="bottom" tone="primary" title="More" className="lg:hidden">
        <nav aria-label="More" className="mt-1 flex flex-col gap-0.5">
          {MORE_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = inSection(pathname, href)
            return (
              <Link
                onClick={close}
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(SHEET_ROW, active ? SHEET_ACTIVE : SHEET_INACTIVE)}
              >
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                {label}
              </Link>
            )
          })}

          {showBusiness && (
            <>
              <Link
                onClick={close}
                href={BUSINESS_ASSESSMENT.href}
                aria-current={inSection(pathname, BUSINESS_ASSESSMENT.href) ? "page" : undefined}
                className={cn(SHEET_ROW, inSection(pathname, BUSINESS_ASSESSMENT.href) ? SHEET_ACTIVE : SHEET_INACTIVE)}
              >
                <BUSINESS_ASSESSMENT.icon aria-hidden className="size-5" strokeWidth={1.75} />
                {BUSINESS_ASSESSMENT.label}
              </Link>
              {unlocked ? (
                <Link
                  onClick={close}
                  href={LEADERSHIP_OS.href}
                  aria-current={inSection(pathname, LEADERSHIP_OS.href) ? "page" : undefined}
                  className={cn(SHEET_ROW, inSection(pathname, LEADERSHIP_OS.href) ? SHEET_ACTIVE : SHEET_INACTIVE)}
                >
                  <LEADERSHIP_OS.icon aria-hidden className="size-5" strokeWidth={1.75} />
                  <span className="flex-1">{LEADERSHIP_OS.label}</span>
                  <span className="bg-oxblood flex size-6 shrink-0 items-center justify-center rounded-full">
                    <LockOpen aria-label="Unlocked" className="text-primary-foreground size-3.5" strokeWidth={2.25} />
                  </span>
                </Link>
              ) : (
                // No hover on touch, so the locked state explains itself
                // inline and goes straight to what unlocks it.
                <Link
                  onClick={close}
                  href={BUSINESS_ASSESSMENT.href}
                  className="text-muted-on-dark hover:bg-primary-hover focus-visible:ring-ring/50 flex items-start gap-3 rounded-panel px-3 py-3 transition-colors outline-none focus-visible:ring-3"
                >
                  <LEADERSHIP_OS.icon aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium">{LEADERSHIP_OS.label}</span>
                    <span className="mt-0.5 block text-sm">
                      {`Unlocks when the Business Assessment is done (${businessAssessmentPercent}%)`}
                    </span>
                  </span>
                  <Lock aria-label="Locked" className="mt-1 size-4 shrink-0" strokeWidth={2} />
                </Link>
              )}
            </>
          )}
        </nav>
      </Sheet>
    </>
  )
}

export { MobileNav }
