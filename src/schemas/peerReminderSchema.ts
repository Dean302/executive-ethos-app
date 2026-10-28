import { z } from "zod"

/** Reminding outstanding peer reviewers: just which invites. */
export const peerReminderSchema = z.object({
  inviteIds: z.array(z.string().min(1)).min(1, "Choose who to remind").max(10),
})
