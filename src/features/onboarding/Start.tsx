"use client"

import Link from "next/link"

import { BrandMark } from "@/components/common/brandMark"
import { Button } from "@/components/common/button"
import { ArrowRightIcon } from "@/components/common/svg"
import { START_SCREEN } from "@/features/onboarding/data"
import { useStoredName } from "@/features/onboarding/useStoredName"
import { cn } from "@/lib/utils"

function Start() {
  const name = useStoredName() ?? undefined

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <header className="border-border flex items-center justify-between border-b px-10 py-5">
        <div className="flex items-center gap-2.5">
          <BrandMark size="sm" />
          <span className="text-sm font-bold tracking-[-0.01em]">
            The Executive Ethos
          </span>
        </div>
        <Button
          variant="outline"
          render={<Link href="/" />}
          className="text-muted-foreground h-9 rounded-full px-4 text-[13px] font-medium"
        >
          {START_SCREEN.defer}
        </Button>
      </header>

      <main className="relative flex flex-1 items-center overflow-hidden px-10 lg:px-20">
        <span
          aria-hidden
          className="text-foreground/[0.035] pointer-events-none absolute top-1/2 -right-10 -translate-y-1/2 font-serif text-[560px] leading-none font-bold select-none"
        >
          Θ
        </span>

        <div className="relative max-w-[680px] py-16">
          {/* Avatar with its status dot */}
          <div className="relative mb-9 inline-block">
            <BrandMark size="lg" className="text-[26px]" />
            <span className="bg-accent border-background absolute bottom-0 left-[46px] size-3.5 rounded-full border-[3px]" />
          </div>

          <p className="text-accent mb-4 text-[11px] font-semibold tracking-[0.14em] uppercase">
            {START_SCREEN.eyebrow}
          </p>

          <h1 className="mb-4 text-[clamp(32px,4vw,48px)] leading-[1.15] font-bold tracking-[-0.02em]">
            {START_SCREEN.greeting(name)}
          </h1>

          <p className="text-muted-foreground mb-11 max-w-[580px] text-[clamp(18px,2.5vw,26px)] leading-[1.5] font-medium tracking-[-0.01em]">
            {START_SCREEN.leadIn}{" "}
            <span className="text-foreground font-serif italic">
              {START_SCREEN.profileName}
            </span>{" "}
            {START_SCREEN.leadOut}
          </p>

          <span
            aria-hidden
            className="bg-accent/50 mb-11 block h-0.5 w-10 rounded-sm"
          />

          <div className="flex flex-wrap gap-3">
            <Button
              render={<Link href="/onboarding/assessment" />}
              className="h-12 gap-2 rounded-full px-7 text-[15px] font-semibold"
            >
              {START_SCREEN.primary}
              <ArrowRightIcon />
            </Button>
            <Button
              variant="outline"
              render={<Link href="/onboarding/setup" />}
              className="text-muted-foreground h-12 rounded-full px-6 text-sm font-medium"
            >
              {START_SCREEN.secondary}
            </Button>
          </div>

          <div className="mt-9 flex items-center gap-2">
            {Array.from({ length: START_SCREEN.totalSteps }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-[3px] rounded-sm transition-all",
                  i === 0 ? "bg-accent w-6" : "bg-border w-3"
                )}
              />
            ))}
            <span className="text-muted-foreground ml-1.5 text-xs font-medium">
              {START_SCREEN.step}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export { Start }
