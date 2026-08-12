"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { NAME_STORAGE_KEY } from "@/features/onboarding/data"
import { signUpSchema, type SignUpValues } from "@/schemas/signUpSchema"
import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"
import { ArrowRightIcon } from "@/components/common/svg"

function SignUp() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = (values: SignUpValues) => {
    // No auth backend yet. The name carries into onboarding so the coach
    // opens with "Welcome back" instead of asking for it again.
    try {
      window.localStorage.setItem(NAME_STORAGE_KEY, values.firstName)
    } catch {
      /* storage unavailable — onboarding will ask for the name */
    }
    router.push("/onboarding")
  }

  return (
    <div>
      <h1 className="mb-1.5 text-[28px] leading-tight font-bold tracking-[-0.02em]">
        Create your account
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">
        A private space for your communication practice.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            variant="field"
            placeholder="Jordan"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            variant="field"
            placeholder="Reeves"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-[50px] gap-2 rounded-full text-[15px] font-semibold"
        >
          Create account
          <ArrowRightIcon />
        </Button>
      </form>
    </div>
  )
}

export { SignUp }
