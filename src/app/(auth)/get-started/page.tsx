import type { Metadata } from "next"

import { AuthHelpLinks, GetStartedFlow } from "@/components/auth"

export const metadata: Metadata = {
  title: "Get started",
}

export default function GetStartedPage() {
  return (
    <>
      <GetStartedFlow />
      <AuthHelpLinks
        prompt="Already set your password?"
        linkLabel="Sign in instead"
        href="/signin"
      />
    </>
  )
}
