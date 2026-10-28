import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type TileTone = "light" | "blush" | "slate" | "sage" | "navy"

const TILE: Record<TileTone, string> = {
  light: "bg-tile-light",
  blush: "bg-tile-blush",
  slate: "bg-tile-slate",
  sage: "bg-tile-sage",
  navy: "bg-tile-navy",
}

type IllustratedCardProps = {
  href: string
  /** A small illustration from components/illustrations. */
  art: React.ReactNode
  /** The wash behind the illustration; `navy` for premium surfaces such as Leadership OS. */
  tone?: TileTone
  /** `side`: copy beside the art, for wide rows. `top`: art above, for narrow columns. */
  layout?: "side" | "top"
  eyebrow?: string
  /** Doubles as the action: the whole card is the link. */
  title: React.ReactNode
  description?: React.ReactNode
  cta?: string
  /** A soft outline when the card needs the person to act. */
  highlight?: boolean
  className?: string
}

/**
 * A white card with a small illustration tile beside or above its copy.
 * The whole card is one link, so its title reads as the action.
 *
 *   <IllustratedCard href="/practice" art={<RecordingStack className="w-40" />} title="Record a practice story" cta="Record a story" />
 */
function IllustratedCard({
  href,
  art,
  tone = "light",
  layout = "side",
  eyebrow,
  title,
  description,
  cta,
  highlight = false,
  className,
}: IllustratedCardProps) {
  const side = layout === "side"
  const copy = (
    <div className="min-w-0 flex-1">
      {eyebrow && <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">{eyebrow}</p>}
      <p className={cn("text-foreground font-sans font-medium", side ? "text-lg" : "mt-0.5 line-clamp-3 text-[15px]")}>
        {title}
      </p>
      {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      {cta && (
        <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
          {cta}
          <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </span>
      )}
    </div>
  )
  const tile = (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[20px]",
        TILE[tone],
        side ? "h-24 w-28 shrink-0 sm:h-32 sm:w-44" : "h-28 w-full"
      )}
    >
      {art}
    </div>
  )

  return (
    <Link
      href={href}
      className={cn(
        // The hover lift is a deliberate exception to "no shadows on chrome" (see CLAUDE.md).
        "group bg-card focus-visible:ring-ring/50 flex rounded-container border transition-shadow outline-none hover:shadow-md focus-visible:ring-3",
        highlight ? "border-primary/30" : "border-border",
        side ? "items-center gap-5 p-4 pl-6" : "flex-col gap-4 p-3 pb-5",
        className
      )}
    >
      {side ? (
        <>
          {copy}
          {tile}
        </>
      ) : (
        <>
          {tile}
          <div className="px-2">{copy}</div>
        </>
      )}
    </Link>
  )
}

export { IllustratedCard }
