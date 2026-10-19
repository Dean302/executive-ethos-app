import { z } from "zod"

import { FOCUS_AREA_IDS, ROLES, WHY_MAX_LENGTH } from "@/lib/executiveProfile"

export const executiveProfileSchema = z.object({
  role: z.enum(ROLES, "Choose your role"),
  why: z
    .string()
    .trim()
    .min(1, "Tell us what brought you here")
    .max(WHY_MAX_LENGTH, `Keep it under ${WHY_MAX_LENGTH} characters`),
  focus: z.enum(FOCUS_AREA_IDS, "Choose where you'd like to see change"),
})

export type ExecutiveProfileValues = z.infer<typeof executiveProfileSchema>
