"use client"

import * as React from "react"

/**
 * Whether a CSS media query matches, kept live as it changes. False on the
 * server and during hydration, so render the narrow-screen or no-motion
 * case as the default.
 *
 *   const isMobile = useMediaQuery("(max-width: 639px)")
 */
export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query]
  )
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

/** The visitor has asked for less motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}
