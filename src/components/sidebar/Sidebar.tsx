"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Logo } from "@/components/common/logo"
import {
  BUSINESS_ASSESSMENT,
  hasBusinessTools,
  inSection,
  LEADERSHIP_OS,
  LEADERSHIP_OS_UNLOCK_PERCENT,
  SIDEBAR_ITEMS,
} from "@/components/navigation/navItems"
import type { PlanId } from "@/lib/pricing"
import { cn } from "@/lib/utils"

import { GrowTeam } from "./GrowTeam"
import { LeadershipOsItem } from "./LeadershipOsItem"

// Selected: a solid cream pill, so the current page reads at a glance.
const ACTIVE = "bg-primary-foreground text-primary"
const INACTIVE = "text-primary-foreground/65 hover:bg-primary-hover hover:text-primary-foreground"
const ROW =
  "focus-visible:ring-ring/50 flex items-center gap-2.5 rounded-full px-2.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3"

// The next plan up, for the upgrade note. Cohesion is the top plan.
const UPGRADE: Record<PlanId, { title: string; body: string } | null> = {
  Foundation: {
    title: "Bring a second leader in",
    body: "Alignment adds a co-leader, high-stakes prep and Leadership OS.",
  },
  Alignment: {
    title: "Grow to your whole team",
    body: "Cohesion covers four leaders, with a quarterly intensive and Talent Calibration.",
  },
  Cohesion: null,
}

type SidebarProps = {
  planId: PlanId
  /** Business Assessment progress, 0–100. */
  businessAssessmentPercent: number
}

/** Desktop navigation: a navy column with the logo level with the header. */
function Sidebar({ planId, businessAssessmentPercent }: SidebarProps) {
  const pathname = usePathname()
  const upgrade = UPGRADE[planId]

  return (
    <aside className="bg-primary text-primary-foreground hidden w-60 shrink-0 flex-col overflow-y-auto px-4 pb-6 lg:flex">
      <div className="flex h-[72px] shrink-0 items-center pl-2">
        <Link href="/dashboard">
          <Logo surface="dark" height={28} />
        </Link>
      </div>

      <nav aria-label="Main" className="mt-4 flex flex-1 flex-col gap-0.5">
        {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = inSection(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(ROW, active ? ACTIVE : INACTIVE)}
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
              {label}
            </Link>
          )
        })}

        {hasBusinessTools(planId) && (
          <>
            <Link
              href={BUSINESS_ASSESSMENT.href}
              aria-current={inSection(pathname, BUSINESS_ASSESSMENT.href) ? "page" : undefined}
              className={cn(ROW, inSection(pathname, BUSINESS_ASSESSMENT.href) ? ACTIVE : INACTIVE)}
            >
              <BUSINESS_ASSESSMENT.icon aria-hidden className="size-4" strokeWidth={1.75} />
              {BUSINESS_ASSESSMENT.label}
            </Link>
            <LeadershipOsItem
              unlocked={businessAssessmentPercent >= LEADERSHIP_OS_UNLOCK_PERCENT}
              active={inSection(pathname, LEADERSHIP_OS.href)}
              percent={businessAssessmentPercent}
              activeClass={ACTIVE}
              inactiveClass={INACTIVE}
            />
          </>
        )}
      </nav>

      {upgrade && (
        <Link
          href="/account#billing"
          className="group bg-primary-raised ring-primary-foreground/10 hover:bg-primary-hover focus-visible:ring-ring/50 mt-6 block shrink-0 rounded-panel p-4 ring-1 transition-colors outline-none focus-visible:ring-3"
        >
          <GrowTeam className="h-10 w-auto" />
          <p className="text-primary-foreground mt-3 text-sm font-medium">{upgrade.title}</p>
          <p className="text-primary-foreground/75 mt-1 text-xs leading-relaxed">{upgrade.body}</p>
          <span className="text-accent mt-3 inline-flex items-center gap-1 text-xs font-medium">
            See plans
            <ArrowRight aria-hidden className="size-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </span>
        </Link>
      )}
      <p className="text-muted-on-dark mt-5 shrink-0 px-2 text-[11px] leading-relaxed">
        {`© ${new Date().getFullYear()} Executive Ethos.`}
        <br />
        All rights reserved.
      </p>
    </aside>
  )
}

export { Sidebar }
