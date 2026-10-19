"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckboxProps = CheckboxPrimitive.Root.Props & {
  /** Renders a clickable label beside the box. */
  label?: React.ReactNode
}

/**
 * A single checkbox, optionally labelled.
 *
 *   <Checkbox label="Keep me signed in" checked={on} onCheckedChange={setOn} />
 */
function Checkbox({ className, label, ...props }: CheckboxProps) {
  const box = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // bg-card, not bg-background: an unchecked box on a cream page
        // would otherwise disappear into it.
        "border-input bg-card focus-visible:border-ring focus-visible:ring-ring/50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label) return box

  return (
    <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
      {box}
      {label}
    </label>
  )
}

export { Checkbox }
