import { Check, Circle } from "lucide-react"

import { PASSWORD_MIN_LENGTH } from "@/schemas/setPasswordSchema"
import { cn } from "@/lib/utils"

const CHECKS = [
  {
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (pw: string) => pw.length >= PASSWORD_MIN_LENGTH,
  },
  {
    label: "Upper and lowercase letters",
    test: (pw: string) => /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  },
  { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
  { label: "At least one symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
]

const TIERS = [
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Fair", bar: "bg-warning", text: "text-warning" },
  { label: "Strong", bar: "bg-success", text: "text-success" },
]

/**
 * Advisory strength guidance under a new-password field. It doesn't gate
 * submission — the schema's minimum length does.
 */
function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const met = CHECKS.map((check) => check.test(password))
  const score = met.filter(Boolean).length
  const tierIndex = score <= 1 ? 0 : score === 2 ? 1 : 2
  const tier = TIERS[tierIndex]

  return (
    <div className="mt-3 w-full text-left">
      <div aria-hidden className="flex gap-1">
        {TIERS.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= tierIndex ? tier.bar : "bg-secondary"
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className={cn("mt-1.5 text-sm font-medium", tier.text)}>
        {tier.label} password
      </p>
      <ul className="mt-2 flex flex-col gap-1">
        {CHECKS.map((check, i) => (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-1.5 text-[12.5px]",
              met[i] ? "text-success" : "text-muted-foreground"
            )}
          >
            {met[i] ? (
              <Check aria-hidden className="size-3.5 shrink-0" strokeWidth={2} />
            ) : (
              <Circle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
            )}
            <span>
              {check.label}
              <span className="sr-only">{met[i] ? " (done)" : " (not yet)"}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PasswordStrengthMeter }
