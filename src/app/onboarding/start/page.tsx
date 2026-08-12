import type { Metadata } from "next"

import { Start } from "@/features/onboarding"

export const metadata: Metadata = {
  title: "Start — The Executive Ethos",
}

export default function StartPage() {
  return <Start />
}
