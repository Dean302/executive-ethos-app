"use client"

import * as React from "react"
import { ChevronDown, Mic, Upload } from "lucide-react"

import { Menu, MenuLinkItem } from "@/components/common/menu"
import { cn } from "@/lib/utils"

// The one "add a recording" action, offering both paths side by side:
// record live, or upload a meeting that's already happened. It's a
// button on the screens that need it, not a navigation item.
//
// The header carries a copy that shows only while none of the page's own
// buttons is on screen, so exactly one is ever in view: the page's where
// it has one, the header's once you scroll past it or on pages without.

const OPTIONS = [
  { href: "/record?mode=live", icon: Mic, title: "Record live", detail: "Capture a meeting or practice as it happens" },
  {
    href: "/record?mode=upload",
    icon: Upload,
    title: "Upload a recording",
    detail: "Audio or video of a meeting you already had",
  },
]

/** The desktop header's height: a page button tucked under it counts as scrolled away. */
const HEADER_HEIGHT = 72

const onScreen = new Set<symbol>()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const anyOnScreen = () => onScreen.size > 0

/** Reports whether one of the page's own buttons is visible below the header. */
function useReportOnScreen(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  React.useEffect(() => {
    const element = ref.current
    if (!enabled || !element) return
    const key = Symbol()
    // Count it visible straight away, so the header's copy doesn't flash in first.
    onScreen.add(key)
    emit()
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onScreen.add(key)
        else onScreen.delete(key)
        emit()
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` }
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      onScreen.delete(key)
      emit()
    }
  }, [ref, enabled])
}

type RecordCtaProps = {
  /** `onDark`: gold, for navy banners. `header`: the compact copy in the top bar. */
  variant?: "default" | "onDark" | "header"
  label?: string
  /** Icon-only below sm (the label stays for screen readers), so a page header can keep it pinned while its title wraps. */
  collapseOnMobile?: boolean
  className?: string
}

function RecordCta({ variant = "default", label = "Add a recording", collapseOnMobile = false, className }: RecordCtaProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isHeader = variant === "header"
  useReportOnScreen(ref, !isHeader)
  // Server and first paint assume the page has its own, so nothing doubles up.
  const pageHasOne = React.useSyncExternalStore(subscribe, anyOnScreen, () => true)
  // Held back a beat after mount, so the page's own buttons can report in.
  const [settled, setSettled] = React.useState(!isHeader)
  React.useEffect(() => {
    if (!isHeader) return
    const timer = setTimeout(() => setSettled(true), 150)
    return () => clearTimeout(timer)
  }, [isHeader])
  const hidden = isHeader && (!settled || pageHasOne)

  return (
    <div
      ref={ref}
      inert={hidden || undefined}
      className={cn(
        isHeader && "transition-[opacity,transform] duration-300",
        hidden && "pointer-events-none translate-y-1 opacity-0",
        className
      )}
    >
      <Menu
        className="w-72"
        trigger={
          <button
            type="button"
            className={cn(
              "group focus-visible:ring-ring/50 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-3",
              variant === "onDark"
                ? "bg-accent text-accent-foreground hover:bg-accent-hover px-5 py-3"
                : isHeader
                  ? "bg-primary text-primary-foreground hover:bg-primary-hover h-9 px-3.5"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2",
              collapseOnMobile && "max-sm:h-9 max-sm:gap-1 max-sm:px-3"
            )}
          >
            <Mic aria-hidden className="size-4" strokeWidth={1.75} />
            <span className={cn(collapseOnMobile && "max-sm:sr-only")}>{label}</span>
            <ChevronDown
              aria-hidden
              className="size-3.5 transition-transform group-data-popup-open:rotate-180"
              strokeWidth={2}
            />
          </button>
        }
      >
        {OPTIONS.map(({ href, icon: Icon, title, detail }) => (
          <MenuLinkItem key={href} href={href} className="items-start gap-3 py-2.5">
            <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="text-foreground block text-sm font-medium">{title}</span>
              <span className="text-muted-foreground block text-sm font-normal">{detail}</span>
            </span>
          </MenuLinkItem>
        ))}
      </Menu>
    </div>
  )
}

export { RecordCta }
