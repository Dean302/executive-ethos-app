"use client"

import * as React from "react"
import { Bell } from "lucide-react"

import { Sheet } from "@/components/common/sheet"
import { cn } from "@/lib/utils"

type NotificationBellProps = {
  /** `light` on the page's header, `dark` on the navy phone bar. */
  tone?: "light" | "dark"
}

/**
 * The bell in the top-right corner, opening the notifications panel
 * beside it. "Needs your attention" leads, then "Updates".
 */
function NotificationBell({ tone = "light" }: NotificationBellProps) {
  const [open, setOpen] = React.useState(false)
  // No notification feed is connected yet, so there's never anything
  // unread. When it is, the count shows as a gold badge on the bell.
  const unread = 0

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        className={cn(
          "focus-visible:ring-ring/50 relative flex size-8 cursor-pointer items-center justify-center rounded-full border transition-colors outline-none focus-visible:ring-3",
          tone === "light"
            ? "border-foreground/20 text-foreground/75 hover:border-foreground/35 hover:bg-secondary hover:text-foreground"
            : "border-primary-foreground/25 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        )}
      >
        <Bell aria-hidden className="size-4" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="bg-accent text-accent-foreground absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-semibold tabular-nums">
            {unread}
          </span>
        )}
      </button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Notifications"
        description={unread > 0 ? `${unread} new` : "You're all caught up"}
      >
        <div className="flex flex-col items-center px-8 py-16 text-center">
          <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full">
            <Bell aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <p className="mt-4 text-sm font-medium">Nothing new</p>
          <p className="text-muted-foreground mt-1 max-w-xs text-sm">
            Session reminders, peer reviews and your scores will show up here.
          </p>
        </div>
      </Sheet>
    </>
  )
}

export { NotificationBell }
