import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

function DashboardLayout({
  title,
  user,
  children,
}: {
  title: string
  user?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-background text-foreground flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export { DashboardLayout }
