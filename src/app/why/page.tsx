import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { WhyScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Why",
}

export default function WhyPage() {
  return (
    <DashboardLayout>
      <WhyScreen />
    </DashboardLayout>
  )
}
