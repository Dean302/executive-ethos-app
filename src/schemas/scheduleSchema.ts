import { z } from "zod"

import { SESSION_START_TIMES, WEEKDAYS } from "@/lib/schedule"

import { planIdSchema, termDaysSchema } from "./programSchema"

export const slotSchema = z.object({
  day: z.union(WEEKDAYS.map(({ value }) => z.literal(value))),
  start: z.union(SESSION_START_TIMES.map((minutes) => z.literal(minutes))),
})

/** The standing slot chosen for each of a plan's sessions. */
export const scheduleSchema = z.object({
  planId: planIdSchema,
  termDays: termDaysSchema,
  slots: z.object({
    primary: slotSchema,
    secondary: slotSchema.optional(),
  }),
})

export type ScheduleValues = z.infer<typeof scheduleSchema>
