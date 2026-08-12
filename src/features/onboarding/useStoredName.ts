"use client"

import * as React from "react"

import { NAME_STORAGE_KEY } from "@/features/onboarding/data"

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}

function read() {
  try {
    return window.localStorage.getItem(NAME_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * The first name captured at sign-up.
 *
 * Read through useSyncExternalStore rather than an effect, so the server
 * snapshot is null and the client picks up the stored value on hydration
 * without a setState-in-effect round trip.
 */
export function useStoredName() {
  return React.useSyncExternalStore(subscribe, read, () => null)
}
