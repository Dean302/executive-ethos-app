"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const radioVariants = cva(
  "border-border hover:border-accent focus-visible:ring-ring/50 data-[checked]:border-accent data-[checked]:bg-accent/10 cursor-pointer border transition-colors outline-none focus-visible:ring-3",
  {
    variants: {
      variant: {
        /** Pill option — role and focus choices. */
        pill: "rounded-full px-5 py-2.5 text-sm font-medium",
        /** Tile with a value above its label — the 1–5 rating scale. */
        tile: "flex flex-col items-center gap-0.5 rounded-xl px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  }
)

type RadioGroupProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive>,
  "onValueChange"
> & {
  onValueChange?: (value: string) => void
}

/** Wraps options for arrow-key navigation and single-select semantics. */
function RadioGroup({ className, onValueChange, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-wrap gap-2.5", className)}
      onValueChange={
        onValueChange
          ? (value) => onValueChange(value as string)
          : undefined
      }
      {...props}
    />
  )
}

type RadioProps = React.ComponentProps<typeof RadioPrimitive.Root> &
  VariantProps<typeof radioVariants> & {
    /** Small line above the label — the number on a rating tile. */
    caption?: React.ReactNode
  }

/**
 * A selectable option. Renders as a styled control rather than a dot, so the
 * whole pill or tile is the hit target.
 *
 *   <RadioGroup value={role} onValueChange={setRole}>
 *     <Radio value="CEO">CEO</Radio>
 *   </RadioGroup>
 */
function Radio({
  className,
  variant,
  caption,
  children,
  ...props
}: RadioProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(radioVariants({ variant, className }))}
      {...props}
    >
      {caption != null && (
        <span className="text-muted-foreground text-lg font-medium">
          {caption}
        </span>
      )}
      {children}
    </RadioPrimitive.Root>
  )
}

export { Radio, RadioGroup, radioVariants }
