import Link from "next/link"
import { ArrowRight, Compass, Sparkles, Target } from "lucide-react"

import { buttonVariants } from "@/components/common/button"
import { BrandMark } from "@/components/common/svg"
import { cn } from "@/lib/utils"

import { WelcomeHexagon } from "./WelcomeHexagon"

// The Golden Circle: why, how, what.
const PRINCIPLES = [
  {
    label: "Why",
    icon: Compass,
    text: "Most executives get feedback on their decisions. Almost none get honest feedback on how they communicate them, and that's usually what actually moves a room.",
  },
  {
    label: "How",
    icon: Sparkles,
    text: "Six criteria, scored by AI without flattery. Your own perception, checked against how two peers actually see you. A coach watching the pattern, not just one session.",
  },
  {
    label: "What",
    icon: Target,
    text: "Record your real meetings: board meetings, pitches, weekly leadership meetings. Get scored. Watch the trend. Tie it back to what your business actually needs from you this quarter.",
  },
]

type WelcomeScreenProps = {
  /** Shown as "You're in, {firstName}" when known. */
  firstName?: string
  /** The next onboarding step. */
  nextHref: string
}

/** The arrival moment after payment: why the program works the way it does. */
function WelcomeScreen({ firstName, nextHref }: WelcomeScreenProps) {
  return (
    <div className="relative isolate text-center">
      {/* Gold to Cream: a soft glow behind the hero. */}
      <div
        aria-hidden
        className="bg-gradient-gold-cream pointer-events-none absolute -inset-x-16 -top-16 -z-10 h-[460px]"
      />
      <WelcomeHexagon />

      <p className="text-muted-foreground mt-2 text-xs font-semibold tracking-[0.06em] uppercase">
        {firstName ? `You're in, ${firstName}` : "You're in"}
      </p>
      <h1 className="mt-2 text-4xl text-balance sm:text-5xl">Let&apos;s talk about why this matters</h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-[15px]">
        Before your first coaching session, three things worth knowing about how Executive Ethos works.
      </p>

      {/* Brand mark between two hairlines: a break before the cards. */}
      <div aria-hidden className="mt-10 flex items-center justify-center gap-4">
        <span className="bg-gradient-navy-cream h-px w-24 opacity-40" />
        <BrandMark className="text-primary size-6" />
        <span className="bg-gradient-navy-cream h-px w-24 -scale-x-100 opacity-40" />
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {PRINCIPLES.map(({ label, icon: Icon, text }) => (
          <li key={label} className="bg-card rounded-panel border p-6">
            <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
              <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
            </span>
            <h2 className="text-primary mt-3 text-sm">{label}</h2>
            <p className="text-foreground/90 mt-1.5 text-sm leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>

      <Link href={nextHref} className={cn(buttonVariants({ size: "lg" }), "mt-12 gap-2")}>
        Get Started
        <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
      </Link>
    </div>
  )
}

export { WelcomeScreen }
