import type { Metadata } from "next"
import Link from "next/link"
import { KeyRound } from "lucide-react"

import { AuthFormHeader, SignInForm } from "@/components/auth"

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

      <div className="text-muted-foreground mt-6 flex flex-col gap-1.5 text-sm">
        <p>
          New here?{" "}
          <Link
            href="/get-started"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Use the link your coach sent
          </Link>
        </p>
        <p>Trouble signing in? Reach out to your coach.</p>
      </div>
    </>
  )
}
