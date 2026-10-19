import * as React from "react"

import { cn } from "@/lib/utils"

// Paths from the official logo set (Logo/EE_Logo_*_Icon_*.svg), drawn in
// currentColor so callers colour the mark with a text-* class. The viewBox
// is cropped to the ring so the mark fills its box.
const VIEWBOX = "27.4 27.4 139.2 139.2"

const RING = { cx: 97.02, cy: 96.96, r: 65.28, strokeWidth: 8.58 }

const GLYPH =
  "M130.59,73.79l4.04-3.24c.58-.46.91-1.16.91-1.89v-2.89c0-.46-.38-.84-.84-.84h-26.01c-.42,0-.79.3-.88.71l-2.27,11.03c-.11.55.31,1.08.88,1.08h9.19c.51,0,.92.41.92.92v10.96c0,.51-.41.92-.92.92h-12.19c-.42,0-.79.3-.88.71l-2.27,11.01c-.11.56.31,1.08.88,1.08h14.46c.51,0,.92.41.92.92v10.99c0,.51-.41.92-.92.92h-17.48c-.42,0-.79.3-.88.71l-2.27,11.04c-.11.55.31,1.07.88,1.07h38.84c.46,0,.84-.38.84-.84v-2.91c0-.74-.33-1.43-.91-1.89l-4.04-3.24c-.81-.65-1.28-1.63-1.28-2.67v-41c0-1.04.47-2.02,1.28-2.67ZM77.59,89.62v-10.96c0-.51.41-.92.92-.92h17.49c.42,0,.79-.3.88-.71l2.27-11.03c.11-.55-.31-1.08-.88-1.08h-38.91c-.46,0-.84.38-.84.84v2.89c0,.74.33,1.43.91,1.89l4.04,3.24c.81.65,1.28,1.63,1.28,2.67v41c0,1.04-.47,2.02-1.28,2.66l-4.04,3.24c-.58.46-.91,1.16-.91,1.89v2.91c0,.46.38.84.84.84h26.08c.42,0,.79-.3.88-.71l2.27-11.04c.11-.55-.31-1.07-.88-1.07h-9.21c-.51,0-.92-.41-.92-.92v-10.99c0-.51.41-.92.92-.92h12.22c.42,0,.79-.3.88-.71l2.27-11.01c.11-.56-.31-1.08-.88-1.08h-14.49c-.51,0-.92-.41-.92-.92Z"

// The solid disc with the glyph cut out, as one path.
const DISC =
  "M97.02,27.39c-38.36,0-69.57,31.22-69.57,69.57s31.21,69.56,69.57,69.56v.02c38.37,0,69.58-31.22,69.58-69.58S135.38,27.39,97.02,27.39ZM91.6,102.63c-.09.41-.45.71-.88.71h-12.21c-.51,0-.92.42-.92.92v10.99c0,.51.41.92.91.92h9.21c.57,0,.99.52.88,1.07l-2.27,11.05c-.09.41-.45.71-.88.71h-26.08c-.46,0-.84-.37-.84-.84v-2.91c0-.73.33-1.43.91-1.89l4.04-3.24c.81-.65,1.28-1.63,1.28-2.66v-41c0-1.04-.47-2.02-1.28-2.67l-4.04-3.24c-.58-.46-.91-1.16-.91-1.9v-2.89c0-.46.38-.84.84-.84h38.91c.57,0,.99.52.88,1.07l-2.28,11.04c-.08.41-.45.71-.87.71h-17.49c-.51,0-.92.41-.92.92v10.96c0,.51.4.92.91.92h14.49c.57,0,1,.52.88,1.08l-2.27,11.01ZM135.53,68.65c0,.74-.33,1.44-.9,1.9l-4.04,3.24c-.81.65-1.28,1.63-1.28,2.67v40.99c0,1.04.47,2.02,1.28,2.67l4.04,3.24c.57.46.9,1.16.9,1.89v2.91c0,.47-.37.84-.84.84h-38.84c-.56,0-.99-.52-.87-1.07l2.27-11.05c.08-.41.45-.71.87-.71h17.48c.51,0,.92-.41.92-.92v-10.99c0-.5-.42-.92-.92-.92h-14.47c-.56,0-.99-.52-.87-1.07l2.27-11.01c.08-.42.45-.72.88-.72h12.19c.5,0,.92-.41.92-.92v-10.96c0-.51-.42-.92-.92-.92h-9.19c-.57,0-.99-.52-.88-1.08l2.27-11.03c.09-.41.46-.71.88-.71h26.01c.47,0,.84.38.84.84v2.89Z"

type BrandMarkProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /**
   * `filled` when the mark stands alone; `outline` only beside the
   * "Executive Ethos" wordmark (use <Logo> for that lockup).
   */
  variant?: "filled" | "outline"
  /** Accessible name. Omit when the mark is decorative. */
  label?: string
}

/**
 * The Executive Ethos icon.
 *
 * Colour follows the brand rule — gold on navy surfaces, navy on cream or
 * white — set by the caller with a text-* class:
 *
 *   <BrandMark className="text-accent size-8" />
 */
function BrandMark({
  variant = "filled",
  label,
  className,
  ...props
}: BrandMarkProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      data-slot="brand-mark"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      {variant === "filled" ? (
        <path d={DISC} fill="currentColor" />
      ) : (
        <>
          <circle {...RING} fill="none" stroke="currentColor" />
          <path d={GLYPH} fill="currentColor" />
        </>
      )}
    </svg>
  )
}

export { BrandMark }
