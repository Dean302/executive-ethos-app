"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { sectionFor } from "@/components/navigation/navItems"
import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1
          return (
            <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <ChevronRight aria-hidden className="text-muted-foreground/60 size-3.5 shrink-0" strokeWidth={2} />}
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground shrink-0 transition-colors hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-foreground truncate font-medium" : "text-muted-foreground shrink-0"}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

type HeaderProps = {
  /** The page's own trail. Defaults to the section you're in. */
  crumbs?: Crumb[]
  /** Actions on the right: notifications, account. */
  children: React.ReactNode
  className?: string
}

/**
 * Desktop header: where you are on the left, actions on the right. The
 * same height as the sidebar's logo row, so the two line up.
 */
function Header({ crumbs, children, className }: HeaderProps) {
  const pathname = usePathname()
  const section = sectionFor(pathname)
  const trail = crumbs ?? (section ? [{ label: section.label, href: section.href }] : [])

  return (
    <header
      className={cn(
        "border-foreground/10 bg-background hidden h-[72px] shrink-0 items-center justify-between gap-4 border-b px-8 lg:flex",
        className
      )}
    >
      <Breadcrumbs trail={trail} />
      <div className="flex shrink-0 items-center gap-3">{children}</div>
    </header>
  )
}

export { Header }
