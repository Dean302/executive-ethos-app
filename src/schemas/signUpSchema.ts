import { z } from "zod"

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid work email"),
  password: z.string().min(8, "Use at least 8 characters"),
})

export type SignUpValues = z.infer<typeof signUpSchema>
