"use client"

import * as React from "react"
import Link from "next/link"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"

type MenuProps = {
  /** The button that opens the menu. */
  trigger: React.ReactElement
  /** Which edge of the trigger the menu lines up with. */
  align?: "start" | "center" | "end"
  /** Width and spacing overrides for the panel. */
  className?: string
  children: React.ReactNode
}

/**
 * A dropdown of actions or links. Arrow keys move through the items,
 * Escape and clicking away close it, and focus returns to the trigger.
 *
 *   <Menu trigger={<button>…</button>} align="end">
 *     <MenuLinkItem href="/account" icon={Settings}>Account</MenuLinkItem>
 *   </Menu>
 */
function Menu({ trigger, align = "end", className, children }: MenuProps) {
  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger render={trigger} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner align={align} sideOffset={8} className="z-50">
          <MenuPrimitive.Popup
            className={cn(
              "border-border bg-card text-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 w-60 origin-(--transform-origin) rounded-panel border p-1.5 text-left duration-100 outline-none",
              className
            )}
          >
            {children}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}

const ITEM =
  "data-highlighted:bg-secondary flex cursor-pointer items-center gap-2.5 rounded-inset px-3 py-2 text-sm font-medium outline-none select-none transition-colors"

type MenuLinkItemProps = {
  href: string
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>
  className?: string
  children: React.ReactNode
}

/** A menu entry that navigates. Pass rich content as children for a two-line item. */
function MenuLinkItem({ href, icon: Icon, className, children }: MenuLinkItemProps) {
  return (
    <MenuPrimitive.LinkItem closeOnClick render={<Link href={href} />} className={cn(ITEM, className)}>
      {Icon && <Icon aria-hidden className="text-muted-foreground size-4" strokeWidth={1.75} />}
      {children}
    </MenuPrimitive.LinkItem>
  )
}

/** Non-interactive heading at the top of a menu, e.g. who's signed in. */
function MenuHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("border-border mb-1.5 border-b px-3 pt-2 pb-3", className)}>{children}</div>
}

export { Menu, MenuHeader, MenuLinkItem }
