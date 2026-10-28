import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Attributes are typed against HTMLElement, not HTMLDivElement, so the same
// handlers type-check whether Card renders a div or a button.
type CardProps = React.HTMLAttributes<HTMLElement> & {
  title?: React.ReactNode
  /** Small icon before the title. */
  icon?: LucideIcon
  description?: React.ReactNode
  /** Top-right slot — a link, a picker, a small action. */
  action?: React.ReactNode
  /** Line the action up with the title's centre rather than its top. */
  centerAction?: boolean
  footer?: React.ReactNode
  /** Render as a button when the whole card is clickable. */
  as?: "div" | "button"
  type?: "button" | "submit"
}

/**
 * Surface for grouped content.
 *
 * Elevation is border + background tint only — no shadows or gradients,
 * per the brand's "precise, not ornate" rule.
 *
 *   <Card title="Recent recordings" description="9 recordings" action={<Link …>View all</Link>}>…</Card>
 */
function Card({
  className,
  title,
  icon: Icon,
  description,
  action,
  centerAction = false,
  footer,
  children,
  as: Component = "div",
  ...props
}: CardProps) {
  const hasHeader = title || description || action

  return (
    <Component
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground border-border rounded-container border p-6",
        Component === "button" &&
          "hover:border-line focus-visible:ring-ring/50 cursor-pointer text-left transition-colors outline-none focus-visible:ring-3",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className={cn("mb-6 flex justify-between gap-3", centerAction ? "items-center" : "items-start")}>
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-foreground flex items-center gap-2 font-sans text-lg font-medium">
                {Icon && <Icon aria-hidden className="text-muted-foreground size-4 shrink-0" strokeWidth={1.75} />}
                {title}
              </h2>
            )}
            {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
          </div>
          {action && <div className="flex shrink-0">{action}</div>}
        </div>
      )}

      {children}

      {footer && (
        <div className="border-border mt-5 border-t pt-4">{footer}</div>
      )}
    </Component>
  )
}

export { Card }
