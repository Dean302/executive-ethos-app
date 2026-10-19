"use server"

import { redirect } from "next/navigation"

import { PLANS } from "@/lib/pricing"
import { scheduleSchema } from "@/schemas/scheduleSchema"

import { getCoachAvailability } from "./coachAvailability"

// The design continues to the self-assessment, which isn't built yet;
// until it is, a scheduled lead lands on the dashboard.
const NEXT_STEP = "/dashboard"

export type SaveScheduleResult = { error: string }

/**
 * Books the lead's standing coaching slots. Checks each against the
 * coach's availability here rather than trusting the picker.
 */
export async function saveSchedule(input: unknown): Promise<SaveScheduleResult> {
  const parsed = scheduleSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Choose a day and time for each session." }
  }

  const { planId, slots } = parsed.data
  const availability = await getCoachAvailability()

  for (const session of PLANS[planId].sessions) {
    const slot = slots[session.key]
    if (!slot) {
      return { error: `Choose a day and time for your ${session.label.toLowerCase()}.` }
    }
    if (!availability[slot.day].includes(slot.start)) {
      return { error: "That time was just taken. Choose another and try again." }
    }
  }

  // No calendar is connected yet, so nothing is booked. When one is,
  // reserve each standing slot on the coach's calendar for the program's
  // term here, then save them against the lead's program.
  redirect(NEXT_STEP)
}
