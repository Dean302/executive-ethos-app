import type { Metadata } from "next"
import { KeyRound } from "lucide-react"

import { AuthFormHeader, AuthHelpLinks, SignInForm } from "@/components/auth"

export const metadata: Metadata = {
  title: "Sign in",
}

export default function SignInPage() {
  return (
    <>
      <AuthFormHeader
        icon={KeyRound}
        title="Welcome back"
        description="Sign in with your email and password."
      />
      <SignInForm />
      <AuthHelpLinks
        prompt="New here?"
        linkLabel="Use the link your coach sent"
        href="/get-started"
      />
    </>
  )
}
