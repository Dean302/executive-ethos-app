import { z } from "zod"

import { DEFAULT_PLAN, DEFAULT_TERM, type PlanId, type TermDays } from "@/lib/pricing"
import { planIdSchema, termDaysSchema } from "@/schemas/programSchema"

// Until accounts hold it, the lead's program travels between onboarding
// steps in the URL (?plan=…&term=…), starting from the invite link.
// Anything missing or unrecognised falls back to the shortest commitment
// on the entry tier.
const programParamsSchema = z.object({
  plan: planIdSchema.catch(DEFAULT_PLAN),
  term: z.coerce.number().pipe(termDaysSchema).catch(DEFAULT_TERM),
})

export type SearchParams = Record<string, string | string[] | undefined>

export function parseProgramParams(searchParams: SearchParams) {
  const { plan, term } = programParamsSchema.parse(searchParams)
  return { planId: plan, termDays: term }
}

/** `path` with the program carried along, e.g. "/onboarding/welcome?plan=Alignment&term=180". */
export function withProgram(path: string, planId: PlanId, termDays: TermDays) {
  return `${path}?${new URLSearchParams({ plan: planId, term: String(termDays) })}`
}
