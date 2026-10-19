import type { LucideIcon } from "lucide-react"

type AuthFormHeaderProps = {
  icon: LucideIcon
  title: string
  description: React.ReactNode
}

/**
 * Opening of every auth form: a navy badge, the page's h1, a gold hairline
 * that ties the form to the brand panel, and one line of context.
 */
function AuthFormHeader({ icon: Icon, title, description }: AuthFormHeaderProps) {
  return (
    <header>
      <span
        aria-hidden
        className="bg-primary text-accent shadow-badge flex size-11 items-center justify-center rounded-full"
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h1 className="mt-5 text-3xl text-balance">{title}</h1>
      <div aria-hidden className="from-accent to-accent/0 mt-4 h-px w-16 bg-linear-to-r" />
      <p className="text-muted-foreground mt-2.5 text-[15px]">{description}</p>
    </header>
  )
}

export { AuthFormHeader }
