"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type ModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Element that opens the modal. Omit when driving `open` yourself. */
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/**
 * Centred dialog with a scrim. Focus is trapped and Escape closes it —
 * both handled by the underlying primitive.
 *
 *   <Modal trigger={<Button>Log in</Button>} title="Sign in">…</Modal>
 */
function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  className,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger render={trigger as React.ReactElement} />}

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "bg-popover text-foreground border-border fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-7 transition-all outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
        >
          <Dialog.Close
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-5 right-5 cursor-pointer rounded-full transition-colors outline-none focus-visible:ring-3"
          >
            <X className="size-4" />
          </Dialog.Close>

          {title && (
            <Dialog.Title className="mb-1.5 text-xl font-bold tracking-[-0.01em]">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="text-muted-foreground mb-6 text-sm">
              {description}
            </Dialog.Description>
          )}

          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Modal }
