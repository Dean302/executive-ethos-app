import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
