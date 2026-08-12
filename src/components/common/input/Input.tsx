"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        // Tall form field — ethos-design's 48px control: 1.5px rule,
        // raised cream fill, gold on focus.
        field:
          "h-12 rounded-[10px] border-[1.5px] border-input bg-card px-4 text-sm focus-visible:border-ring focus-visible:bg-popover aria-invalid:border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    /** Renders an associated <label> above the control. */
    label?: React.ReactNode
    /** Content below the control — helper text, strength meter. */
    hint?: React.ReactNode
    /** Validation message. Renders below the control and marks the input invalid. */
    error?: string
    /** Class for the label/hint wrapper (only rendered with label or hint). */
    wrapperClassName?: string
    /** Show/hide button on password inputs. On by default. */
    revealToggle?: boolean
  }

/**
 * The single input for every field in the app.
 *
 * Handles its own label association, password reveal, and hint slot, so a
 * field is one element:
 *
 *   <Input label="Work email" type="email" variant="field" required />
 */
function Input({
  className,
  wrapperClassName,
  type,
  variant,
  label,
  hint,
  error,
  revealToggle = true,
  id,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const [revealed, setRevealed] = React.useState(false)
  const hasToggle = type === "password" && revealToggle

  const control = (
    <InputPrimitive
      id={inputId}
      type={hasToggle && revealed ? "text" : type}
      data-slot="input"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${inputId}-error` : undefined}
      className={cn(inputVariants({ variant }), hasToggle && "pr-12", className)}
      {...props}
    />
  )

  const field = hasToggle ? (
    <div className="relative">
      {control}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? "Hide password" : "Show password"}
        aria-pressed={revealed}
        aria-controls={inputId}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-3.5 flex -translate-y-1/2 cursor-pointer rounded-sm transition-colors outline-none focus-visible:ring-3"
      >
        {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  ) : (
    control
  )

  // Bare control when there's nothing to wrap — keeps the input itself the
  // flex/grid child at the call site.
  if (!label && !hint && !error) return field

  return (
    <div className={cn("flex flex-col", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.1em] uppercase"
        >
          {label}
        </label>
      )}
      {field}
      {error ? (
        <p id={`${inputId}-error`} className="text-destructive mt-1.5 text-xs">
          {error}
        </p>
      ) : (
        hint
      )}
    </div>
  )
}

export { Input, inputVariants }
