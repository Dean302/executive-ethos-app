import { z } from "zod"

export const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean(),
})

export type SignInValues = z.infer<typeof signInSchema>
