import { z } from "zod"

/** Locking the goals takes an explicit acknowledgement; nothing else comes from the client. */
export const goalsConfirmationSchema = z.object({
  acknowledged: z.literal(true, "Confirm you understand the goals lock for the quarter"),
})
