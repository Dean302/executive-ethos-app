"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** `right`: a panel sliding in from the edge. `bottom`: a phone sheet with a grab handle. */
  side?: "right" | "bottom"
  /** `primary` paints the sheet in the scheme colour, for navigation. */
  tone?: "light" | "primary"
  title: React.ReactNode
  /** Under the title, e.g. a count. */
  description?: React.ReactNode
  /** Beside the close button, e.g. "Mark all as read". */
  action?: React.ReactNode
  /** Visually hide the title (it still names the dialog). */
  hideTitle?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * A panel that slides over the page: notifications, the phone's "More"
 * menu. Focus is trapped while it's open; Escape, the close button and
 * clicking the backdrop dismiss it.
 *
 *   <Sheet open={open} onOpenChange={setOpen} title="Notifications">…</Sheet>
 */
function Sheet({
  open,
  onOpenChange,
  side = "right",
  tone = "light",
  title,
  description,
  action,
  hideTitle = false,
  className,
  children,
}: SheetProps) {
  const primary = tone === "primary"
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          data-slot="sheet"
          className={cn(
            "fixed z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none motion-reduce:transition-none",
            primary ? "bg-primary text-primary-foreground" : "bg-background text-foreground",
            side === "right"
              ? "inset-y-0 right-0 w-full data-ending-style:translate-x-full data-starting-style:translate-x-full sm:w-[420px]"
              : "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[1.5rem] px-4 pt-3 pb-6 data-ending-style:translate-y-full data-starting-style:translate-y-full",
            className
          )}
        >
          {side === "bottom" && (
            <span
              aria-hidden
              className={cn("mx-auto h-1 w-10 shrink-0 rounded-full", primary ? "bg-primary-foreground/20" : "bg-border")}
            />
          )}
          <div
            className={cn(
              "flex shrink-0 items-center justify-between gap-3",
              side === "right" ? "border-border bg-card border-b px-5 py-4" : "mt-3 pl-3"
            )}
          >
            <div className={cn("min-w-0", hideTitle && "sr-only")}>
              <Dialog.Title
                className={cn(
                  side === "right" ? "text-lg font-semibold" : "text-sm font-medium",
                  primary && "text-primary-foreground/55"
                )}
                render={<p />}
              >
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-muted-foreground text-sm">{description}</Dialog.Description>
              )}
            </div>
            <div className="ml-auto flex items-center gap-1">
              {action}
              <Dialog.Close
                aria-label="Close"
                className={cn(
                  "focus-visible:ring-ring/50 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3",
                  primary
                    ? "text-primary-foreground/70 hover:bg-primary-hover hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <X aria-hidden className={side === "right" ? "size-4" : "size-5"} strokeWidth={1.75} />
              </Dialog.Close>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Sheet }
