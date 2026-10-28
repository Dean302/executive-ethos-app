"use client"

import * as React from "react"

/**
 * True for a short beat after `key` changes (never on the first render),
 * so a view computed instantly still shows that it updated, the way a
 * fetch would. Compares with the previous key, so a development
 * double-mount doesn't trigger it.
 */
export function useSettling(key: string | number, ms = 650) {
  const [settling, setSettling] = React.useState(false)
  const previous = React.useRef(key)

  React.useEffect(() => {
    if (previous.current === key) return
    previous.current = key
    setSettling(true)
    const timer = window.setTimeout(() => setSettling(false), ms)
    return () => window.clearTimeout(timer)
  }, [key, ms])

  return settling
}
