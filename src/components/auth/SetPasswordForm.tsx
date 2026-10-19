"use client"

import * as React from "react"
import { unstable_rethrow } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import {
  setPasswordSchema,
  type SetPasswordValues,
} from "@/schemas/setPasswordSchema"

import { setPassword } from "./actions"
import { PasswordStrengthMeter } from "./PasswordStrengthMeter"

const CONFIRM_ID = "confirm-password"

type SetPasswordFormProps = {
  /** The email confirmed in the previous step. */
  email: string
  onBack: () => void
}

function SetPasswordForm({ email, onBack }: SetPasswordFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { email, password: "", confirmPassword: "" },
    // Errors show on submit and clear on the next edit, as in the design.
    reValidateMode: "onSubmit",
  })

  const password = useWatch({ control, name: "password" })

  // One message for the pair, under the second field.
  const error =
    errors.password?.message ?? errors.confirmPassword?.message ?? serverError ?? undefined

  const clearAllErrors = () => {
    clearErrors()
    setServerError(null)
  }

  const onSubmit = (values: SetPasswordValues) => {
    setServerError(null)
    startTransition(async () => {
      try {
        // Returns a result only on failure; success redirects.
        const result = await setPassword(values)
        if (result?.error) setServerError(result.error)
      } catch (err) {
        unstable_rethrow(err)
        setServerError("We couldn't create your account. Check your connection and try again.")
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isPending}
      className="mt-7 flex flex-col gap-1.5"
    >
      <Input
        label="New password"
        hideLabel
        type="password"
        variant="field"
        placeholder="New password"
        autoComplete="new-password"
        autoFocus
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${CONFIRM_ID}-error` : undefined}
        {...register("password", { onChange: clearAllErrors })}
      />
      <PasswordStrengthMeter password={password} />

      <Input
        id={CONFIRM_ID}
        label="Confirm password"
        hideLabel
        wrapperClassName="mt-2"
        type="password"
        variant="field"
        placeholder="Confirm password"
        autoComplete="new-password"
        error={error}
        {...register("confirmPassword", { onChange: clearAllErrors })}
      />

      <Button type="submit" size="lg" disabled={isPending} className="mt-2.5 w-full gap-2">
        {isPending ? (
          "Creating account…"
        ) : (
          <>
            Create account &amp; continue
            <ArrowRight aria-hidden className="text-accent size-4" strokeWidth={1.75} />
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground mt-1 flex cursor-pointer items-center gap-1.5 self-start text-sm"
      >
        <ArrowLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
        Back
      </button>
    </form>
  )
}

export { SetPasswordForm }
