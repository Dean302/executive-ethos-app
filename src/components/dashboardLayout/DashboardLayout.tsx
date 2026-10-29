import { Header, MobileHeader, UserMenu, type Crumb } from "@/components/header"
import { MobileNav } from "@/components/navigation"
import { NotificationBell } from "@/components/notifications"
import { RecordCta } from "@/components/recorder"
import { Sidebar } from "@/components/sidebar"
import { getViewer } from "@/lib/viewer"

type DashboardLayoutProps = {
  /** The header's breadcrumb. Defaults to the section you're in. */
  crumbs?: Crumb[]
  children: React.ReactNode
}

/**
 * The executive app's frame. Desktop: a navy sidebar and a header with
 * where you are, Record (once the page's own is out of view), notifications and the account menu. Phones: a
 * navy top bar and a bottom tab bar. Only the page itself scrolls.
 */
async function DashboardLayout({ crumbs, children }: DashboardLayoutProps) {
  const viewer = await getViewer()

  return (
    <div className="bg-background text-foreground flex h-dvh overflow-hidden">
      <Sidebar planId={viewer.planId} businessAssessmentPercent={viewer.businessAssessmentPercent} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader>
          <NotificationBell tone="dark" />
          <UserMenu name={viewer.name} role={viewer.role} tone="dark" />
        </MobileHeader>
        <Header crumbs={crumbs}>
          <RecordCta variant="header" className="mr-1" />
          <NotificationBell />
          <UserMenu name={viewer.name} role={viewer.role} />
        </Header>

        {/* Below lg, room at the end for the fixed tab bar. */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-10">{children}</main>
      </div>

      <MobileNav planId={viewer.planId} businessAssessmentPercent={viewer.businessAssessmentPercent} />
    </div>
  )
}

export { DashboardLayout }
