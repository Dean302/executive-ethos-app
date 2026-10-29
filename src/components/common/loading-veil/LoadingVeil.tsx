import { LogoLoader } from "@/components/common/svg"
import { cn } from "@/lib/utils"

type LoadingVeilProps = {
  active: boolean
  /** Names the loader for screen readers. */
  label?: string
  className?: string
  children: React.ReactNode
}

/** Dims its content and shows the logo loader over it while `active`, e.g. as a chart updates. */
function LoadingVeil({ active, label = "Updating", className, children }: LoadingVeilProps) {
  return (
    <div className={cn("relative", className)} aria-busy={active}>
      <div className={cn("transition-opacity duration-300", active && "opacity-25")}>{children}</div>
      {active && (
        <div className="animate-in fade-in absolute inset-0 flex items-center justify-center duration-200">
          <LogoLoader className="text-primary size-11" label={label} />
        </div>
      )}
    </div>
  )
}

export { LoadingVeil }
