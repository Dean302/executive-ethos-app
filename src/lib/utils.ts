import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the theme's custom radii (styles/theme.css), so a
// passed-in rounded-container replaces a component's default rounded-xl
// instead of both applying and the default winning.
const twMerge = extendTailwindMerge({
  extend: { theme: { radius: ["container", "panel", "inset"] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Rounds to `places` decimals. Use it on computed SVG coordinates: the
 * server's and the browser's trig can differ in the last decimal place,
 * which fails hydration.
 */
export function roundTo(value: number, places = 2) {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}
