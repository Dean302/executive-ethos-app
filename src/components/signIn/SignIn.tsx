"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { signInSchema, type SignInValues } from "@/schemas/signInSchema"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { ArrowRightIcon } from "@/components/common/svg"

function SignIn() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) })

  const onSubmit = () => {
    // No auth backend yet — send the user straight through.
    router.push("/dashboard")
  }

  return (
    <div>
      <h1 className="mb-1.5 text-[28px] leading-tight font-bold tracking-[-0.02em]">
        Welcome back
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Sign in to continue your coaching profile.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          label="Work email"
          type="email"
          variant="field"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          variant="field"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-[50px] gap-2 rounded-full text-[15px] font-semibold"
        >
          Sign in
          <ArrowRightIcon />
        </Button>
      </form>
    </div>
  )
}

export { SignIn }
