"use client"

import * as React from "react"

import { ArrowUpIcon } from "@/components/common/svg"
import { cn } from "@/lib/utils"

type TextareaProps = Omit<React.ComponentProps<"textarea">, "rows"> & {
  /** Adds the round send button and sends on Enter (Shift+Enter newlines). */
  onSend?: () => void
  /** Starting height in rows. Grows with content up to maxRows. */
  rows?: number
  maxRows?: number
  sendLabel?: string
}

/**
 * Chat-style input. Grows with its content rather than scrolling, and the
 * send affordance sits inside the field.
 *
 *   <Textarea value={draft} onChange={…} onSend={submit} />
 */
function Textarea({
  className,
  onSend,
  onKeyDown,
  rows = 1,
  maxRows = 8,
  sendLabel = "Send",
  value,
  ...props
}: TextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  // Reset to auto first so the box can shrink as well as grow.
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    const line = parseFloat(getComputedStyle(el).lineHeight) || 24
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows)}px`
  }, [value, maxRows])

  const empty = !String(value ?? "").trim()

  return (
    <div className="border-input bg-background focus-within:border-ring flex items-end gap-2 rounded-2xl border-[1.5px] py-2.5 pr-2.5 pl-4 transition-colors">
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (onSend && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSend()
          }
        }}
        className={cn(
          "placeholder:text-muted-foreground flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-6 outline-none",
          className
        )}
        {...props}
      />

      {onSend && (
        <button
          type="button"
          onClick={onSend}
          disabled={empty}
          aria-label={sendLabel}
          className="bg-foreground/10 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-foreground/10 disabled:hover:text-muted-foreground"
        >
          <ArrowUpIcon size={18} />
        </button>
      )}
    </div>
  )
}

export { Textarea }
