"use server"

import { redirect } from "next/navigation"

import { confirmEmailSchema } from "@/schemas/confirmEmailSchema"
import { setPasswordSchema } from "@/schemas/setPasswordSchema"
import { signInSchema } from "@/schemas/signInSchema"

export type AuthActionResult = { error: string }

/**
 * First step for an invited lead: confirms the email the coach's invite
 * link was sent to. Returns `{ ok: true }` to move on to setting a
 * password, or an error for the form to show.
 */
export async function confirmInvitedEmail(
  input: unknown
): Promise<AuthActionResult | { ok: true }> {
  const parsed = confirmEmailSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Enter a valid email address." }
  }

  // No identity provider is connected yet, so the invite isn't checked.
  // When one is, match parsed.data.email against the invite the link
  // carries and, on a mismatch, return:
  //   "We don't recognize that email. Double-check what your coach sent
  //    the link to."
  return { ok: true }
}

/**
 * Second step for an invited lead: sets the password they'll sign in with
 * from now on. Returns an error for the form to show, or redirects on
 * success.
 */
export async function setPassword(input: unknown): Promise<AuthActionResult> {
  const parsed = setPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your password and try again." }
  }

  // No identity provider is connected yet, so no account is created. When
  // one is, create the account for the confirmed invite here. The design
  // continues to onboarding (payment) next; that screen isn't built yet,
  // so this lands on the dashboard for now.
  redirect("/dashboard")
}

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
