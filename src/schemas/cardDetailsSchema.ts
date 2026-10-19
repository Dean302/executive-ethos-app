import { z } from "zod"

/**
 * Card details as the payment form collects them (already formatted:
 * "4242 4242 4242 4242", "12/28"). Client-side only — card data must never
 * be sent to our server; it goes straight to the payment processor.
 */
export const cardDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter the name on the card"),
  number: z
    .string()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, "Enter the 16-digit card number")),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Enter the expiry as MM/YY"),
  cvc: z.string().regex(/^\d{3,4}$/, "Enter the 3 or 4 digit code"),
  zip: z.string().regex(/^\d{5}$/, "Enter a 5-digit ZIP code"),
  saveCard: z.boolean(),
})

export type CardDetailsInput = z.input<typeof cardDetailsSchema>
