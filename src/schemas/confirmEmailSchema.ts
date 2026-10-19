import { z } from "zod"

export const confirmEmailSchema = z.object({
  email: z.email("Enter a valid email address"),
})

export type ConfirmEmailValues = z.infer<typeof confirmEmailSchema>
