import { z } from "zod"

export const PASSWORD_MIN_LENGTH = 8
// Long enough for passphrases, short enough to bound hashing cost.
export const PASSWORD_MAX_LENGTH = 128

export const setPasswordSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
      .max(PASSWORD_MAX_LENGTH, `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

export type SetPasswordValues = z.infer<typeof setPasswordSchema>
