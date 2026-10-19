"use client"

import * as React from "react"
import { KeyRound, ShieldCheck } from "lucide-react"

import { AuthFormHeader } from "./AuthFormHeader"
import { ConfirmEmailForm } from "./ConfirmEmailForm"
import { SetPasswordForm } from "./SetPasswordForm"

/**
 * An invited lead's first visit: confirm the email the coach's link went
 * to, then set the password they'll sign in with from now on.
 */
function GetStartedFlow() {
  const [email, setEmail] = React.useState("")
  const [step, setStep] = React.useState<"email" | "password">("email")

  if (step === "email") {
    return (
      <>
        <AuthFormHeader
          icon={ShieldCheck}
          title="Let’s get you started"
          description="You're here because you clicked the link your coach sent. Confirm the email it went to, and we'll get you set up."
        />
        <ConfirmEmailForm
          defaultEmail={email}
          onConfirmed={(confirmed) => {
            setEmail(confirmed)
            setStep("password")
          }}
        />
      </>
    )
  }

  return (
    <>
      <AuthFormHeader
        icon={KeyRound}
        title="Set your password"
        description="One thing to remember instead of a new email link every time. You'll use this to sign back in from now on."
      />
      <SetPasswordForm email={email} onBack={() => setStep("email")} />
    </>
  )
}

export { GetStartedFlow }
