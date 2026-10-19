"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Renders an associated <label> above the control. */
  label?: React.ReactNode
  /** Keep the label for assistive technology but hide it visually. */
  hideLabel?: boolean
  /** Validation message. Renders below the control and marks it invalid. */
  error?: string
  wrapperClassName?: string
}

/**
 * Multi-line text field for written answers.
 *
 *   <Textarea label="What brought you here?" hideLabel value={why} onChange={…} />
 */
function Textarea({
  className,
  wrapperClassName,
  label,
  hideLabel = false,
  error,
  id,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId

  const control = (
    <textarea
      id={textareaId}
      data-slot="textarea"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${textareaId}-error` : undefined}
      className={cn(
        "bg-card placeholder:text-muted-foreground/70 focus:border-primary aria-invalid:border-destructive min-h-[120px] w-full resize-y rounded-lg border px-4 py-3.5 text-left text-[14.5px] leading-relaxed outline-none placeholder:italic",
        className
      )}
      {...props}
    />
  )

  if (!label && !error) return control

  return (
    <div className={wrapperClassName}>
      {label && (
        <label
          htmlFor={textareaId}
          className={cn("text-muted-foreground mb-1.5 block text-sm font-medium", hideLabel && "sr-only")}
        >
          {label}
        </label>
      )}
      {control}
      {error && (
        <p id={`${textareaId}-error`} className="text-destructive mt-1.5 flex items-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  )
}

export { Textarea }
