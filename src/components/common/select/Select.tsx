import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type SelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  /** Classes for the wrapper (width, margin, placement). */
  wrapperClassName?: string
  size?: "default" | "sm"
}

/**
 * A native select with the app's field styling, so keyboard, screen reader
 * and phone pickers all work as the platform intends.
 *
 *   <Select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Period">…</Select>
 */
function Select({ className, wrapperClassName, size = "default", children, ...props }: SelectProps) {
  return (
    <span className={cn("relative inline-flex", wrapperClassName)}>
      <select
        data-slot="select"
        className={cn(
          "border-input bg-card text-foreground hover:border-primary/40 focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 cursor-pointer appearance-none rounded-lg border text-sm font-medium transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" ? "h-8 pr-9 pl-3" : "h-9 pr-11 pl-3.5",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          "text-muted-foreground pointer-events-none absolute top-1/2 size-4 -translate-y-1/2",
          size === "sm" ? "right-3" : "right-4"
        )}
      />
    </span>
  )
}

export { Select }
