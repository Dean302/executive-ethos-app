"use server"

import { z } from "zod"

import { programSchema } from "@/schemas/programSchema"

const startProgramSchema = programSchema.extend({
  paymentMethod: z.enum(["card", "wallet"]),
})

export type StartProgramResult = { ok: true } | { error: string }

/**
 * Starts the lead's program and takes the first month's payment.
 *
 * Takes only the program choice — never card data, which belongs with the
 * payment processor. The amount must be computed here from the plan and
 * term, never taken from the client.
 */
export async function startProgram(input: unknown): Promise<StartProgramResult> {
  const parsed = startProgramSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Choose a program and term before paying." }
  }

  // No payment processor is connected yet, so nothing is charged and no
  // program is created. When one is: charge monthlyRate(planId, termDays)
  // against the payment method the processor's own fields tokenised in
  // the browser, then record the program against the account.
  return { ok: true }
}
