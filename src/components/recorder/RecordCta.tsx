"use client"

import { ChevronDown, Mic, Upload } from "lucide-react"

import { Menu, MenuLinkItem } from "@/components/common/menu"
import { cn } from "@/lib/utils"

// The one "add a recording" action, offering both paths side by side:
// record live, or upload a meeting that's already happened. It's a
// button on the screens that need it, not a navigation item.

const OPTIONS = [
  { href: "/record?mode=live", icon: Mic, title: "Record live", detail: "Capture a meeting or practice as it happens" },
  {
    href: "/record?mode=upload",
    icon: Upload,
    title: "Upload a recording",
    detail: "Audio or video of a meeting you already had",
  },
]

type RecordCtaProps = {
  /** `onDark`: gold, for navy banners. */
  variant?: "default" | "onDark"
  label?: string
  className?: string
}

function RecordCta({ variant = "default", label = "Add a recording", className }: RecordCtaProps) {
  return (
    <Menu
      className="w-72"
      trigger={
        <button
          type="button"
          className={cn(
            "group focus-visible:ring-ring/50 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-3",
            variant === "onDark"
              ? "bg-accent text-accent-foreground hover:bg-accent-hover px-5 py-3"
              : "bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2",
            className
          )}
        >
          <Mic aria-hidden className="size-4" strokeWidth={1.75} />
          {label}
          <ChevronDown
            aria-hidden
            className="size-3.5 transition-transform group-data-popup-open:rotate-180"
            strokeWidth={2}
          />
        </button>
      }
    >
      {OPTIONS.map(({ href, icon: Icon, title, detail }) => (
        <MenuLinkItem key={href} href={href} className="items-start gap-3 py-2.5">
          <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
            <Icon aria-hidden className="size-4" strokeWidth={1.75} />
          </span>
          <span>
            <span className="text-foreground block text-sm font-medium">{title}</span>
            <span className="text-muted-foreground block text-sm font-normal">{detail}</span>
          </span>
        </MenuLinkItem>
      ))}
    </Menu>
  )
}

export { RecordCta }
