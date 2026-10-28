"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

import { Card } from "@/components/common/card"
import { DateBlock } from "@/components/common/date-block"
import type { UpcomingSession } from "@/lib/coachingSessions"
import { cn } from "@/lib/utils"

/** Six, so the two columns fill three even rows. */
const SHOWN = 6
/** The most the dashboard lists; the calendar has the rest. */
const MAX = 8

/** The executive's next live sessions with their coach, in two columns of dates. */
function UpcomingSessions({ sessions }: { sessions: UpcomingSession[] }) {
  const [expanded, setExpanded] = React.useState(false)
  const all = sessions.slice(0, MAX)
  if (all.length === 0) return null
  const visible = expanded ? all : all.slice(0, SHOWN)
  const remaining = all.length - visible.length

  return (
    <Card
      className="h-full text-sm"
      title="Upcoming coaching sessions"
      description="Your live sessions with your coach, for the rest of your term."
      action={
        <Link href="/calendar" className="text-primary flex items-center gap-1.5 text-sm font-medium hover:underline">
          <CalendarDays aria-hidden className="size-3.5" strokeWidth={1.75} />
          Calendar view
        </Link>
      }
    >
      <ul className="grid gap-x-12 sm:grid-cols-2">
        {visible.map((session) => (
          <li key={session.id} className="border-border flex items-center gap-3 border-b py-3">
            <DateBlock month={session.month} day={session.day} soon={session.soon} />
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-medium", session.soon && "text-oxblood")}>
                {session.dayLabel} · {session.timeLabel}
              </p>
              <p className="truncate text-sm">{session.title}</p>
              <p className="text-muted-foreground text-sm">with your coach</p>
            </div>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-primary focus-visible:ring-ring/50 mt-3 cursor-pointer rounded-sm text-sm font-medium outline-none hover:underline focus-visible:ring-3"
        >
          {`Show ${remaining} more`}
        </button>
      )}
    </Card>
  )
}

export { UpcomingSessions }
