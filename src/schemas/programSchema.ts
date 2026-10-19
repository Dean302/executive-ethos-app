import { z } from "zod"

import { PLAN_IDS, TERM_DAYS } from "@/lib/pricing"

export const planIdSchema = z.enum(PLAN_IDS)

export const termDaysSchema = z.union(TERM_DAYS.map((days) => z.literal(days)))

/** The program a lead is buying: which plan, for which term. */
export const programSchema = z.object({
  planId: planIdSchema,
  termDays: termDaysSchema,
})

export type ProgramValues = z.infer<typeof programSchema>
