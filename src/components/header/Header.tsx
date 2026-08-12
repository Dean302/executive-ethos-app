import { Mic } from "lucide-react"

import { BrandMark } from "@/components/common/brandMark"
import { Button } from "@/components/common/button"

function Header({ title, user = "Executive" }: { title: string; user?: string }) {
  return (
    <header className="border-border bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6">
      <div className="flex min-w-0 items-center gap-3">
        <BrandMark size="sm" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
          <span className="text-muted-foreground truncate text-sm">
            Executive Ethos
          </span>
          <span className="text-muted-foreground/60 text-sm">/</span>
          <span className="truncate text-sm font-semibold">{title}</span>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="border-border bg-popover flex items-center gap-2.5 rounded-full border py-1.5 pr-5 pl-1.5">
          <BrandMark tone="inverse" size="sm" className="text-xs">
            E
          </BrandMark>
          <span className="text-sm">{user}</span>
        </span>

        <Button className="h-11 gap-2 rounded-full px-5 text-sm font-semibold">
          <Mic className="size-4" />
          Record Session
        </Button>
      </div>
    </header>
  )
}

export { Header }
