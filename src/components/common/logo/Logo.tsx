import Image from "next/image"

import { cn } from "@/lib/utils"

// The official horizontal lockup files, unmodified — the guidelines forbid
// recolouring or re-spacing the logo, so these are images, not redrawn SVG.
// Source viewBox is 1000 × 193.84.
const SOURCES = {
  light: "/brand/logo-horizontal-on-light.svg",
  dark: "/brand/logo-horizontal-on-dark.svg",
} as const

const ASPECT_RATIO = 1000 / 193.84

type LogoProps = {
  /** The surface the logo sits on: `light` for cream/white, `dark` for navy. */
  surface?: keyof typeof SOURCES
  /** Rendered height in px; width follows the lockup's proportions. */
  height?: number
  className?: string
  /** Preload — set when the logo is the page's above-the-fold image. */
  preload?: boolean
}

/**
 * Executive Ethos horizontal logo: outline mark beside the wordmark.
 *
 *   <Logo surface="dark" height={28} />
 */
function Logo({ surface = "light", height = 28, className, preload }: LogoProps) {
  return (
    <Image
      src={SOURCES[surface]}
      alt="Executive Ethos"
      height={height}
      width={Math.round(height * ASPECT_RATIO)}
      preload={preload}
      data-slot="logo"
      className={cn("shrink-0", className)}
    />
  )
}

export { Logo }
