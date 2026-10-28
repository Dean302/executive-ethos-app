"use client"

import { LogOut, Settings } from "lucide-react"

import { Menu, MenuHeader, MenuLinkItem } from "@/components/common/menu"
import { cn } from "@/lib/utils"
import { initialsOf } from "@/lib/viewer"

type UserMenuProps = {
  name: string
  role: string
  /** `light` on the page's header, `dark` on the navy phone bar. */
  tone?: "light" | "dark"
}

/** The avatar in the top-right corner: who you are, Account and Log out. */
function UserMenu({ name, role, tone = "light" }: UserMenuProps) {
  return (
    <Menu
      trigger={
        <button
          type="button"
          aria-label={`${name}, account menu`}
          className={cn(
            "focus-visible:ring-ring/50 flex cursor-pointer rounded-full ring-offset-2 transition-shadow outline-none hover:ring-2 focus-visible:ring-3",
            tone === "light" ? "ring-border ring-offset-background" : "ring-primary-foreground/30 ring-offset-primary"
          )}
        >
          {/* Gold only on navy; on the light header the disc takes the primary colour. */}
          <span
            aria-hidden
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-sm",
              tone === "light" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            )}
          >
            {initialsOf(name)}
          </span>
        </button>
      }
    >
      <MenuHeader>
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-muted-foreground truncate text-sm">{role}</p>
      </MenuHeader>
      <MenuLinkItem href="/account" icon={Settings}>
        Account
      </MenuLinkItem>
      <MenuLinkItem href="/signin" icon={LogOut}>
        Log out
      </MenuLinkItem>
    </Menu>
  )
}

export { UserMenu }
