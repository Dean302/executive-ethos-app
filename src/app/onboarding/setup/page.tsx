import type { Metadata } from "next"

import { SetupYourself } from "@/features/onboarding"

export const metadata: Metadata = {
  title: "Set up your profile — The Executive Ethos",
}

export default function SetupPage() {
  return <SetupYourself />
}
