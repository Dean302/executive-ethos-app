import {
  CalendarDays,
  Compass,
  FileSearch,
  History,
  LayoutDashboard,
  LayoutGrid,
  MessageSquareQuote,
  Target,
  type LucideIcon,
} from "lucide-react"

// The executive app's destinations.

export type NavItem = { href: string; label: string; icon: LucideIcon; shortLabel?: string }

const DASHBOARD: NavItem = { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
const RECORDINGS: NavItem = { href: "/sessions", label: "Recordings", icon: History }
const CALENDAR: NavItem = { href: "/calendar", label: "Calendar", icon: CalendarDays }
const GOALS: NavItem = { href: "/goals", label: "Goals & Progress", shortLabel: "Goals", icon: Target }
const COACH: NavItem = { href: "/coaching", label: "Your coach", icon: MessageSquareQuote }
const WHY: NavItem = { href: "/why", label: "Why", icon: Compass }

export const BUSINESS_ASSESSMENT: NavItem = {
  href: "/business-assessment",
  label: "Business Assessment",
  icon: FileSearch,
}
export const LEADERSHIP_OS: NavItem = { href: "/leadership-os", label: "Leadership OS", icon: LayoutGrid }

/** The desktop sidebar, top to bottom. Business Assessment and Leadership OS follow, by plan. */
export const SIDEBAR_ITEMS = [DASHBOARD, RECORDINGS, CALENDAR, GOALS, COACH, WHY]

/** The phone's bottom bar; the rest live in its "More" sheet. */
export const TAB_ITEMS = [DASHBOARD, RECORDINGS, GOALS, WHY]
export const MORE_ITEMS = [CALENDAR, COACH]

/** Leadership OS opens once the Business Assessment is finished. */
export const LEADERSHIP_OS_UNLOCK_PERCENT = 100

/** Selected anywhere inside its section, so a page one level down still shows where you are. */
export function inSection(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** The section a path belongs to, for the header's default breadcrumb. */
export function sectionFor(pathname: string): NavItem | undefined {
  return [
    ...SIDEBAR_ITEMS,
    BUSINESS_ASSESSMENT,
    LEADERSHIP_OS,
    { href: "/account", label: "Account", icon: LayoutDashboard },
    { href: "/practice", label: "Practice", icon: LayoutDashboard },
  ].find((item) => inSection(pathname, item.href))
}

/** Business Assessment and Leadership OS come with Alignment and Cohesion. */
export function hasBusinessTools(planId: string) {
  return planId !== "Foundation"
}
