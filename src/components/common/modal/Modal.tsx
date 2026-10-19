"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import type { LucideIcon } from "lucide-react"
import { X } from "lucide-react"

import { Button } from "@/components/common/button"
import { cn } from "@/lib/utils"

type ModalProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Element that opens the modal. Omit when driving `open` yourself. */
  trigger?: React.ReactElement
  /** Soft navy tile above the title — every dialog in the design has one. */
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  /** Action row, set apart on a muted band at the bottom. */
  footer?: React.ReactNode
  /** Centre the header (the default when there's an icon). */
  centered?: boolean
  /** Size and padding overrides; set padding with [--modal-pad:…] so
   *  the footer band stays flush. */
  className?: string
  children?: React.ReactNode
}

/**
 * Centred dialog. Focus is trapped, Escape and the close button dismiss
 * it, and focus returns to the trigger — all handled by the primitive.
 *
 *   <Modal open={open} onOpenChange={setOpen} icon={Sliders} title="Change your program"
 *          footer={<Button onClick={() => setOpen(false)}>Done</Button>}>…</Modal>
 */
function Modal({
  open,
  onOpenChange,
  trigger,
  icon: Icon,
  title,
  description,
  footer,
  centered = Boolean(Icon),
  className,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger render={trigger} />}

      <Dialog.Portal>
        <Dialog.Backdrop className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs" />
        <Dialog.Popup
          data-slot="modal"
          className={cn(
            "bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-(--modal-pad) text-sm ring-1 duration-100 outline-none [--modal-pad:--spacing(4)] sm:max-w-sm",
            className
          )}
        >
          {Icon && (
            <div className="from-primary/15 via-primary/5 ring-border mx-auto flex size-16 items-center justify-center rounded-2xl bg-linear-to-br to-transparent ring-1">
              <Icon aria-hidden className="text-primary size-7" strokeWidth={1.5} />
            </div>
          )}

          <div className={cn("flex flex-col gap-2", centered && "items-center text-center")}>
            <Dialog.Title className="font-heading text-xl">{title}</Dialog.Title>
            {description && (
              <Dialog.Description className="text-muted-foreground text-sm">
                {description}
              </Dialog.Description>
            )}
          </div>

          {children}

          {footer && (
            <div className="bg-muted/50 -mx-(--modal-pad) -mb-(--modal-pad) flex flex-col-reverse gap-2 rounded-b-xl border-t p-(--modal-pad) sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}

          <Dialog.Close
            render={<Button variant="ghost" size="icon-sm" className="absolute top-2 right-2" />}
          >
            <X aria-hidden />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Modal }
