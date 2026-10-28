"use client"

import * as React from "react"

const subscribeNever = () => () => {}
const currentMinute = () => Math.floor(Date.now() / 60_000) * 60_000

/**
 * The current time to the minute, read only in the browser: anything that
 * depends on the visitor's clock and timezone renders without it on the
 * server rather than guessing. Null until hydrated.
 */
export function useNow() {
  const minute = React.useSyncExternalStore(subscribeNever, currentMinute, () => null)
  return minute === null ? null : new Date(minute)
}
