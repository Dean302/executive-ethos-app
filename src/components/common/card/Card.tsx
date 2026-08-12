import * as React from "react"

import { cn } from "@/lib/utils"

// Attributes are typed against HTMLElement, not HTMLDivElement, so the same
// handlers type-check whether Card renders a div or a button.
type CardProps = React.HTMLAttributes<HTMLElement> & {
  title?: React.ReactNode
  description?: React.ReactNode
  /** Top-right slot — a badge, count, or small action. */
  action?: React.ReactNode
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
 *   <Card title="Sessions" action={<Badge />}>…</Card>
 */
function Card({
  className,
  title,
  description,
  action,
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
        "bg-card text-card-foreground border-border rounded-2xl border p-5",
        Component === "button" &&
          "hover:border-border-strong focus-visible:ring-ring/50 cursor-pointer text-left transition-colors outline-none focus-visible:ring-3",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="truncate text-sm font-semibold">{title}</h3>
            )}
            {description && (
              <p className="text-muted-foreground mt-1 text-[13px] leading-[18px]">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
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
