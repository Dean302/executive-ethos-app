// Where a recording was opened from, so its page can offer the way back.
// Only these known origins are accepted, so the URL can't point anywhere.

const ORIGINS = {
  dashboard: { href: "/dashboard", label: "Back to dashboard" },
  calendar: { href: "/calendar", label: "Back to calendar" },
} as const

export type RecordingOrigin = keyof typeof ORIGINS

/** The way back for `?from=`, or null when it came from Recordings (or nowhere known). */
export function backLinkFor(from: string | string[] | undefined) {
  return typeof from === "string" && from in ORIGINS ? ORIGINS[from as RecordingOrigin] : null
}
