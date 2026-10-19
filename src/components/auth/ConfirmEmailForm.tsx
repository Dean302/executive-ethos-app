"use client"

import * as React from "react"
import { unstable_rethrow } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import {
  confirmEmailSchema,
  type ConfirmEmailValues,
} from "@/schemas/confirmEmailSchema"

import { confirmInvitedEmail } from "./actions"

type ConfirmEmailFormProps = {
  defaultEmail?: string
  onConfirmed: (email: string) => void
}

function ConfirmEmailForm({ defaultEmail = "", onConfirmed }: ConfirmEmailFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const { control, register, handleSubmit } = useForm<ConfirmEmailValues>({
    resolver: zodResolver(confirmEmailSchema),
    defaultValues: { email: defaultEmail },
  })

  // Submit stays disabled until the email could pass, as in the design.
  const email = useWatch({ control, name: "email" })
  const canSubmit = confirmEmailSchema.safeParse({ email }).success

  const onSubmit = (values: ConfirmEmailValues) => {
    setServerError(null)
    startTransition(async () => {
      try {
        const result = await confirmInvitedEmail(values)
        if ("error" in result) setServerError(result.error)
        else onConfirmed(values.email)
      } catch (error) {
        unstable_rethrow(error)
        setServerError("We couldn't check that email. Check your connection and try again.")
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
        label="Email"
        hideLabel
        type="email"
        variant="field"
        placeholder="you@company.com"
        autoComplete="email"
        autoFocus
        error={serverError ?? undefined}
        {...register("email", { onChange: () => setServerError(null) })}
      />

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit || isPending}
        className="mt-1.5 w-full gap-2"
      >
        {isPending ? (
          "Verifying…"
        ) : (
          <>
            Confirm &amp; continue
            <ArrowRight aria-hidden className="text-accent size-4" strokeWidth={1.75} />
          </>
        )}
      </Button>
    </form>
  )
}

export { ConfirmEmailForm }
