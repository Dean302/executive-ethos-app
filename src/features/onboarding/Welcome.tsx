"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, Users } from "lucide-react";

import { BrandMark } from "@/components/common/brandMark";
import { Card } from "@/components/common/card";
import {
  WELCOME_CHOICES,
  type WelcomeChoice,
} from "@/features/onboarding/data";
import { cn } from "@/lib/utils";

const CHOICE_ICONS = { self: User, peer: Users };

function Welcome() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<WelcomeChoice | null>(null);

  function choose(key: WelcomeChoice) {
    setSelected(key);
    // The peer track isn't built yet.
    if (key === "self") router.push("/onboarding/start");
  }

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <header className="border-border flex items-center gap-2.5 border-b px-10 py-5">
        <BrandMark size="sm" />
        <span className="text-sm font-bold tracking-[-0.01em]">
          The Executive Ethos
        </span>
      </header>

      <main className="relative flex flex-1 items-center overflow-hidden px-10 lg:px-20">
        <span
          aria-hidden
          className="text-foreground/[0.035] pointer-events-none absolute top-1/2 -right-10 -translate-y-1/2 font-serif text-[560px] leading-none font-bold select-none"
        >
          Θ
        </span>

        <div className="relative w-full max-w-[720px] py-16">
          <p className="text-accent mb-4 text-[11px] font-semibold tracking-[0.14em] uppercase">
            360° Baseline Assessment
          </p>

          <h1 className="mb-4 text-[clamp(32px,4vw,48px)] leading-[1.15] font-bold tracking-[-0.02em]">
            How do you actually{" "}
            <span className="text-muted-foreground font-serif font-normal italic">
              show up
            </span>
            ?
          </h1>

          <p className="text-muted-foreground mb-9 max-w-[520px] text-[clamp(15px,1.5vw,18px)] leading-[1.6]">
            The most accurate baseline comes from comparing how you see yourself
            with how others experience you. Choose how you&rsquo;re entering the
            assessment.
          </p>

          <span
            aria-hidden
            className="bg-accent/50 mb-9 block h-0.5 w-10 rounded-sm"
          />

          <div className="grid max-w-[640px] gap-3 sm:grid-cols-2">
            {WELCOME_CHOICES.map(
              ({ key, eyebrow, title, description, duration }) => {
                const Icon = CHOICE_ICONS[key];
                return (
                  <Card
                    key={key}
                    as="button"
                    type="button"
                    onClick={() => choose(key)}
                    aria-pressed={selected === key}
                    className={cn("p-7", selected === key && "border-accent")}
                  >
                    <span className="bg-muted text-muted-foreground mb-6 flex size-11 items-center justify-center rounded-xl">
                      <Icon className="size-5" />
                    </span>

                    <span className="text-accent mb-2.5 block text-[11px] font-semibold tracking-[0.12em] uppercase">
                      {eyebrow}
                    </span>

                    <span className="mb-3 block font-serif text-xl leading-[1.25] font-bold tracking-[-0.01em]">
                      {title}
                    </span>

                    <span className="text-muted-foreground mb-6 block text-sm leading-[22px]">
                      {description}
                    </span>

                    <span className="text-muted-foreground block text-[13px]">
                      {duration} →
                    </span>
                  </Card>
                );
              },
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export { Welcome };
