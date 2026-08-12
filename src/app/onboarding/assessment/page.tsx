import type { Metadata } from "next"

import { SelfAssessment } from "@/features/onboarding"

export const metadata: Metadata = {
  title: "Self-Assessment — The Executive Ethos",
}

export default function AssessmentPage() {
  return <SelfAssessment />
}
