import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"
import { AccountScreen } from "@/features/dashboard"

export const metadata: Metadata = {
  title: "Account",
}

export default function AccountPage() {
  return (
    <DashboardLayout>
      <AccountScreen />
    </DashboardLayout>
  )
}
