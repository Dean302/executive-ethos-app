"use server"

import { redirect } from "next/navigation"

import { signInSchema } from "@/schemas/signInSchema"

export type AuthActionResult = { error: string }

/**
 * Signs a returning user in with email and password.
 *
 * Input is re-validated here: the client schema is a convenience, not a
 * security boundary. Returns an error for the form to show, or redirects
 * on success.
 */
export async function signIn(input: unknown): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Enter a valid email address and your password." }
  }

  // No identity provider is connected yet, so credentials are not
  // verified. When one is, call it here with parsed.data and, on failure,
  // return one generic message ("That email and password don't match")
  // whether or not the account exists, so the form can't be used to probe
  // which emails are registered.
  redirect("/dashboard")
}
