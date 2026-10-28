import Link from "next/link"

import { Logo } from "@/components/common/logo"

/** Phones: a navy bar in place of the sidebar, with the logo and the header's actions. */
function MobileHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="bg-primary flex shrink-0 items-center justify-between px-4 py-3 lg:hidden">
      <Link href="/dashboard">
        <Logo surface="dark" height={24} />
      </Link>
      <div className="flex items-center gap-1">{children}</div>
    </header>
  )
}

export { MobileHeader }
