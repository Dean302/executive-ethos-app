"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const radioVariants = cva(
  "group/radio focus-visible:ring-ring/50 cursor-pointer border transition-colors outline-none focus-visible:ring-3",
  {
    variants: {
      variant: {
        /** Short choice; the selected one fills navy. */
        tile: "border-border bg-card text-foreground/85 hover:border-primary/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground rounded-panel px-4 py-3 text-center text-sm font-medium",
        /** Choice with a description and a radio dot; the selected one is outlined. */
        card: "border-border bg-card hover:border-primary/40 data-checked:border-primary data-checked:bg-primary/5 data-checked:ring-primary flex items-start justify-between gap-4 rounded-panel px-4 py-3.5 text-left data-checked:ring-1",
      },
    },
    defaultVariants: {
      variant: "tile",
    },
  }
)

type RadioGroupProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive>, "onValueChange"> & {
  onValueChange?: (value: string) => void
}

/** Single-select set of options. Arrow keys move between them. */
function RadioGroup({ className, onValueChange, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={className}
      onValueChange={onValueChange ? (value) => onValueChange(value as string) : undefined}
      {...props}
    />
  )
}

type RadioProps = React.ComponentProps<typeof RadioPrimitive.Root> &
  VariantProps<typeof radioVariants> & {
    /** Secondary line under the label (card variant). */
    description?: React.ReactNode
  }

/**
 * One option in a RadioGroup. The whole tile or card is the hit target.
 *
 *   <RadioGroup value={role} onValueChange={setRole}>
 *     <Radio value="CEO">CEO</Radio>
 *   </RadioGroup>
 */
function Radio({ className, variant, description, children, ...props }: RadioProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(radioVariants({ variant }), className)}
      {...props}
    >
      {variant === "card" ? (
        <>
          <span>
            <span className="block text-sm font-semibold">{children}</span>
            {description && (
              <span className="text-muted-foreground mt-1 block text-[12.5px] leading-snug">
                {description}
              </span>
            )}
          </span>
          <span
            aria-hidden
            className="border-border group-data-checked/radio:border-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors"
          >
            <span className="bg-primary hidden size-2.5 rounded-full group-data-checked/radio:block" />
          </span>
        </>
      ) : (
        children
      )}
    </RadioPrimitive.Root>
  )
}

export { Radio, RadioGroup, radioVariants }
