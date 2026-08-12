import type { Metadata } from "next"

import { DashboardLayout } from "@/components/dashboardLayout"

export const metadata: Metadata = {
  title: "Dashboard — The Executive Ethos",
}

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <p className="text-muted-foreground text-sm">
        Your sessions and progress will appear here.
      </p>
    </DashboardLayout>
  )
}
