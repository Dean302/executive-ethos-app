"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Home,
  MessageSquare,
  PanelLeft,
  Settings,
  User,
} from "lucide-react"

import { BrandMark } from "@/components/common/brandMark"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/onboarding", label: "Onboarding", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "bg-primary text-primary-foreground hidden shrink-0 flex-col p-4 transition-[width] md:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 py-2",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <BrandMark tone="inverse">E</BrandMark>
            <span className="truncate font-semibold">The Executive Ethos</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="text-primary-foreground/60 hover:text-primary-foreground shrink-0 cursor-pointer transition-colors"
        >
          <PanelLeft className="size-5" />
        </button>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {!collapsed && (
          <p className="text-primary-foreground/45 mb-2 px-3 text-[11px] font-semibold tracking-[0.14em] uppercase">
            Menu
          </p>
        )}

        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-[15px] transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary-foreground/10 text-primary-foreground font-medium"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export { Sidebar }
