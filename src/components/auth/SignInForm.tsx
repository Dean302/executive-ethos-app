"use client"

import * as React from "react"
import Link from "next/link"
import { unstable_rethrow } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/common/button"
import { Checkbox } from "@/components/common/checkbox"
import { Input } from "@/components/common/input"
import { signInSchema, type SignInValues } from "@/schemas/signInSchema"

import { signIn } from "./actions"

function SignInForm() {
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  })

  // Submit stays disabled until both fields could pass, as in the design.
  // Checked quietly here so errors don't flash while the user is typing.
  const [email, password] = useWatch({ control, name: ["email", "password"] })
  const canSubmit = signInSchema.safeParse({ email, password, rememberMe: true }).success

  const onSubmit = (values: SignInValues) => {
    setFormError(null)
    startTransition(async () => {
      try {
        // Returns a result only on failure; success redirects.
        const result = await signIn(values)
        if (result?.error) setFormError(result.error)
      } catch (error) {
        // Leave Next.js's own control flow (the success redirect) to it.
        unstable_rethrow(error)
        setFormError("We couldn't sign you in. Check your connection and try again.")
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
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        hideLabel
        wrapperClassName="mt-2"
        type="password"
        variant="field"
        placeholder="Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Checkbox
              label="Keep me signed in"
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              inputRef={field.ref}
            />
          )}
        />
        <Link
          href="/forgot-password"
          className="text-primary text-sm font-medium underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {formError && (
        <p role="alert" className="text-destructive flex items-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit || isPending}
        className="mt-2.5 w-full gap-2"
      >
        {isPending ? (
          "Signing in…"
        ) : (
          <>
            Sign in
            <ArrowRight aria-hidden className="text-accent size-4" strokeWidth={1.75} />
          </>
        )}
      </Button>
    </form>
  )
}

export { SignInForm }
