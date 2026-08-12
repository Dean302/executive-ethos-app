import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const brandMarkVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-serif font-bold select-none",
  {
    variants: {
      tone: {
        // Navy disc, gold glyph — on light grounds.
        default: "bg-primary text-accent",
        // Gold disc, navy glyph — on navy grounds.
        inverse: "bg-accent text-accent-foreground",
      },
      size: {
        sm: "size-8 text-sm",
        md: "size-10 text-lg",
        lg: "size-16 text-2xl",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
    },
  }
)

/** The Executive Ethos monogram. Decorative — pair it with the wordmark. */
function BrandMark({
  className,
  tone,
  size,
  children = "Θ",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof brandMarkVariants>) {
  return (
    <span
      aria-hidden
      data-slot="brand-mark"
      className={cn(brandMarkVariants({ tone, size, className }))}
      {...props}
    >
      {children}
    </span>
  )
}

export { BrandMark, brandMarkVariants }
