"use client"

import * as React from "react"

const subscribeNever = () => () => {}

/**
 * False on the server and during hydration, true after. For UI that
 * depends on the browser (its clock, storage, screen) and would otherwise
 * mismatch the server render.
 */
export function useHydrated() {
  return React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}
