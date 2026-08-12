"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { BrandMark } from "@/components/common/brandMark";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Radio, RadioGroup, radioVariants } from "@/components/common/radio";
import { Textarea } from "@/components/common/textarea";
import { ArrowRightIcon } from "@/components/common/svg";
import { CoachingProfile } from "@/features/onboarding/CoachingProfile";
import { GoldenCirclePanel } from "@/features/onboarding/GoldenCirclePanel";
import { PeerInvite } from "@/features/onboarding/PeerInvite";
import {
  ASSESSMENT_INVITE,
  ASSESSMENT_QUESTIONS,
  BRIDGES,
  COACH_LINES,
  FOCUS_OPTIONS,
  GOLDEN_CIRCLE_HEADING,
  GOLDEN_CIRCLE_QUESTIONS,
  GOLDEN_CIRCLE_RINGS,
  NAME_STORAGE_KEY,
  PEER_INVITE,
  RATING_OPTIONS,
  ROLE_OPTIONS,
  SECTIONS,
  STAGE_HEADINGS,
  TOTAL_QUESTIONS,
  TOTAL_SECTIONS,
  type Focus,
  type Role,
} from "@/features/onboarding/data";
import { cn } from "@/lib/utils";

type Stage =
  "name" | "role" | "focus" | "invite" | "assessment" | "golden" | "peers";

type Bubble = { id: number; kind: "coach" | "user"; content: React.ReactNode };

/** Progress denominator — matches the reference's five-step arc. */
const TOTAL_STEPS = 5;

const STEP_OF: Record<Stage, number> = {
  name: 1,
  role: 2,
  focus: 3,
  invite: 4,
  assessment: 4,
  golden: 5,
  peers: 5,
};

function pickBridge(
  score: number | null,
  previous: string | null,
  name: string,
): string | null {
  if (score === 3) return null;
  const pool =
    score === null ? BRIDGES.text : score <= 2 ? BRIDGES.low : BRIDGES.high;
  const lines = pool.map((line) => line.replace("{name}", name || "there"));
  const fresh = lines.filter((line) => line !== previous);
  const from = fresh.length ? fresh : lines;
  return from[Math.floor(Math.random() * from.length)];
}

/* ------------------------------------------------------------------ */

function QuestionBody({
  caption,
  bridge,
  prompt,
}: {
  caption: string;
  bridge?: string | null;
  prompt: string;
}) {
  return (
    <>
      {bridge && (
        <span className="text-muted-foreground mb-2.5 block text-base leading-[26px] font-medium">
          {bridge}
        </span>
      )}
      <span className="text-muted-foreground mb-1.5 block text-sm font-medium">
        {caption}
      </span>
      {prompt}
    </>
  );
}

function Options({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mt-6 ml-12", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */

function SelfAssessment() {
  const router = useRouter();

  const [stage, setStage] = React.useState<Stage>("name");
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<Role | null>(null);
  const [focus, setFocus] = React.useState<Focus | null>(null);
  const [index, setIndex] = React.useState(0);
  const [gcIndex, setGcIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number | string>>(
    {},
  );
  const [gcAnswers, setGcAnswers] = React.useState<Record<number, string>>({});
  const [lastBridge, setLastBridge] = React.useState<string | null>(null);
  const [skipped, setSkipped] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const nextId = React.useRef(0);
  const greeted = React.useRef(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const say = React.useCallback(
    (kind: Bubble["kind"], content: React.ReactNode, reset = false) => {
      const bubble = { id: nextId.current++, kind, content };
      setBubbles((prev) => (reset ? [bubble] : [...prev, bubble]));
    },
    [],
  );

  /* Opening turn — the name carries over from sign-up when it's there. */
  React.useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(NAME_STORAGE_KEY);
    } catch {
      /* storage unavailable — fall back to asking */
    }

    if (stored) {
      setName(stored);
      setStage("role");
      say("coach", COACH_LINES.greetReturning(stored));
    } else {
      say("coach", COACH_LINES.greetNew);
    }
  }, [say]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [bubbles, stage]);

  const question = ASSESSMENT_QUESTIONS[index];
  const gcQuestion = GOLDEN_CIRCLE_QUESTIONS[gcIndex];
  const focusLabel = FOCUS_OPTIONS.find((o) => o.key === focus)?.short;
  const answeredCount = Object.keys(answers).length;
  const sectionsDone = Math.max(
    0,
    (question?.section ?? TOTAL_SECTIONS + 1) - 1,
  );

  const percent =
    stage === "golden"
      ? Math.round((gcIndex / GOLDEN_CIRCLE_QUESTIONS.length) * 100)
      : Math.round((STEP_OF[stage] / TOTAL_STEPS) * 100);

  /* ---- transitions ---- */

  function askQuestion(idx: number, bridge: string | null) {
    const q = ASSESSMENT_QUESTIONS[idx];
    const previous = idx > 0 ? ASSESSMENT_QUESTIONS[idx - 1] : null;
    const opensSection = !previous || previous.section !== q.section;

    const body = (
      <QuestionBody
        caption={`Question ${q.indexInSection} of ${q.sectionTotal}`}
        bridge={opensSection ? null : bridge}
        prompt={q.prompt}
      />
    );

    // A new section wipes the screen so one theme is on it at a time.
    say("coach", body, opensSection);
    setIndex(idx);
  }

  function startAssessment() {
    say("user", ASSESSMENT_INVITE.accept);
    setStage("assessment");
    askQuestion(0, null);
  }

  function startGoldenCircle() {
    setStage("golden");
    setGcIndex(0);
    askGoldenCircle(0, true);
  }

  function askGoldenCircle(idx: number, reset = false) {
    const q = GOLDEN_CIRCLE_QUESTIONS[idx];
    const previous = idx > 0 ? GOLDEN_CIRCLE_QUESTIONS[idx - 1] : null;
    const opensRing = !previous || previous.ring !== q.ring;
    const perRing = GOLDEN_CIRCLE_QUESTIONS.length / GOLDEN_CIRCLE_RINGS.length;
    say(
      "coach",
      <QuestionBody
        caption={`Question ${(idx % perRing) + 1} of ${perRing}`}
        prompt={q.prompt}
      />,
      reset || opensRing,
    );
    setGcIndex(idx);
  }

  function finishAssessment(bridge: string | null) {
    if (bridge) say("coach", bridge);
    say("coach", COACH_LINES.toGoldenCircle(name));
    startGoldenCircle();
  }

  function recordAnswer(value: number | string, score: number | null) {
    const q = ASSESSMENT_QUESTIONS[index];
    const label =
      score === null
        ? String(value)
        : (RATING_OPTIONS.find((o) => o.value === value)?.label ??
          String(value));

    say("user", label);
    setAnswers((prev) => ({ ...prev, [q.key]: value }));
    setDraft("");

    const bridge = pickBridge(score, lastBridge, name);
    if (bridge) setLastBridge(bridge);

    if (index + 1 >= TOTAL_QUESTIONS) finishAssessment(bridge);
    else askQuestion(index + 1, bridge);
  }

  function recordGoldenCircle(value: string) {
    say("user", value);
    setGcAnswers((prev) => ({ ...prev, [gcIndex]: value }));
    setDraft("");

    if (gcIndex + 1 >= GOLDEN_CIRCLE_QUESTIONS.length) {
      say("coach", COACH_LINES.toPeers);
      setStage("peers");
    } else {
      askGoldenCircle(gcIndex + 1);
    }
  }

  function send() {
    const value = draft.trim();
    if (!value) return;
    if (stage === "golden") recordGoldenCircle(value);
    else recordAnswer(value, null);
  }

  function goBack() {
    setBubbles((prev) => prev.slice(0, -2));
    setDraft("");
    if (stage === "assessment" && index > 0) return setIndex(index - 1);
    if (stage === "assessment") return setStage("invite");
    if (stage === "invite") return setStage("focus");
    if (stage === "focus") return setStage("role");
    if (stage === "role") return setStage("name");
  }

  /* ---- header ---- */

  const heading =
    stage === "assessment" && question
      ? {
          title: SECTIONS[question.section].title,
          subtitle: SECTIONS[question.section].subtitle,
        }
      : stage === "golden" && gcQuestion
        ? {
            title: GOLDEN_CIRCLE_HEADING.title,
            subtitle: `${GOLDEN_CIRCLE_RINGS.find((r) => r.ring === gcQuestion.ring)!.tag} — ${GOLDEN_CIRCLE_RINGS.find((r) => r.ring === gcQuestion.ring)!.subtitle}`,
          }
        : stage === "peers"
          ? { title: PEER_INVITE.heading, subtitle: PEER_INVITE.subtitle }
          : STAGE_HEADINGS[stage as keyof typeof STAGE_HEADINGS];

  const showBack = stage !== "name" && stage !== "peers";

  return (
    <div className="bg-popover text-foreground flex h-dvh">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-primary text-primary-foreground shrink-0 px-10 pt-4 pb-6">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBack && (
                <button
                  type="button"
                  onClick={goBack}
                  className="text-primary-foreground/45 hover:text-primary-foreground border-primary-foreground/15 flex cursor-pointer items-center gap-1.5 border-r pr-3 text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </button>
              )}
              <BrandMark tone="inverse" size="sm" className="text-xs" />
              <span className="text-sm font-bold tracking-[-0.01em]">
                The Executive Ethos
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-primary-foreground/40 hover:text-primary-foreground/70 cursor-pointer text-sm transition-colors"
            >
              Save &amp; exit
            </button>
          </div>

          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="bg-primary-foreground/15 mb-5 h-0.5"
          >
            <div
              className="bg-accent h-full transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em]">
            {heading.title}
          </h1>
          <p className="text-primary-foreground/55 mt-1 text-sm">
            {heading.subtitle}
          </p>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-10">
          <div className="mx-auto flex max-w-[760px] flex-col gap-8">
            {bubbles.map((bubble) =>
              bubble.kind === "coach" ? (
                <div key={bubble.id} className="flex items-start gap-4">
                  <BrandMark size="sm" className="mt-1 shrink-0 text-xs" />
                  <div className="max-w-[640px] text-2xl leading-[1.35] font-bold tracking-[-0.01em]">
                    {bubble.content}
                  </div>
                </div>
              ) : (
                <div key={bubble.id} className="flex justify-end">
                  <span className="border-border bg-popover max-w-[75%] rounded-full border px-5 py-2.5 text-sm font-medium">
                    {bubble.content}
                  </span>
                </div>
              ),
            )}

            {/* ---- controls ---- */}

            {stage === "name" && (
              <Options className="max-w-[520px]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = draft.trim();
                    if (!value) return;
                    setName(value);
                    setDraft("");
                    say("user", value);
                    setStage("role");
                    say("coach", COACH_LINES.afterName(value));
                  }}
                  className="flex gap-3"
                >
                  <Input
                    variant="field"
                    placeholder="Your first name"
                    aria-label="Your first name"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    className="h-12 shrink-0 gap-2 rounded-full px-6"
                  >
                    Continue
                    <ArrowRightIcon />
                  </Button>
                </form>
              </Options>
            )}

            {stage === "role" && (
              <Options>
                <RadioGroup
                  value={role ?? ""}
                  onValueChange={(value) => {
                    setRole(value as Role);
                    say("user", value);
                    setStage("focus");
                    say("coach", COACH_LINES.focus(name));
                  }}
                  className="grid max-w-[660px] grid-cols-2 gap-3"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <Radio key={option} value={option} className="text-center">
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
              </Options>
            )}

            {stage === "focus" && (
              <Options>
                <RadioGroup
                  value={focus ?? ""}
                  onValueChange={(value) => {
                    const option = FOCUS_OPTIONS.find((o) => o.key === value)!;
                    setFocus(option.key);
                    say("user", option.label);
                    setStage("invite");
                    say("coach", ASSESSMENT_INVITE.prompt);
                  }}
                  className="flex max-w-[660px] flex-col gap-3"
                >
                  {FOCUS_OPTIONS.map((option) => (
                    <Radio
                      key={option.key}
                      value={option.key}
                      className="text-left"
                    >
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </Options>
            )}

            {stage === "invite" && (
              <Options className="flex gap-3">
                {/* Branches the flow rather than recording an answer, so
                    these reuse the pill styling only. */}
                <button
                  type="button"
                  onClick={startAssessment}
                  className={radioVariants({ variant: "pill" })}
                >
                  {ASSESSMENT_INVITE.accept}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSkipped(true);
                    say("user", ASSESSMENT_INVITE.skip);
                    say("coach", COACH_LINES.skipped);
                    say("coach", COACH_LINES.toGoldenCircle(name));
                    startGoldenCircle();
                  }}
                  className={radioVariants({ variant: "pill" })}
                >
                  {ASSESSMENT_INVITE.skip}
                </button>
              </Options>
            )}

            {stage === "assessment" && question?.kind === "rating" && (
              <Options>
                <RadioGroup
                  key={question.key}
                  value=""
                  onValueChange={(value) =>
                    recordAnswer(Number(value), Number(value))
                  }
                  className="flex flex-wrap gap-3"
                >
                  {RATING_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      value={String(option.value)}
                      variant="tile"
                      caption={option.value}
                      className="min-w-[104px]"
                    >
                      <span className="text-muted-foreground text-[13px]">
                        {option.label}
                      </span>
                    </Radio>
                  ))}
                </RadioGroup>
              </Options>
            )}

            {((stage === "assessment" && question?.kind === "text") ||
              stage === "golden") && (
              <Options className="max-w-[660px]">
                {(stage === "golden" ? gcQuestion?.hint : question?.hint) && (
                  <p className="text-muted-foreground mb-3 text-sm">
                    {stage === "golden" ? gcQuestion.hint : question!.hint}
                  </p>
                )}
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onSend={send}
                  placeholder="Type your answer..."
                  aria-label="Your answer"
                  autoFocus
                />
              </Options>
            )}

            {stage === "peers" && (
              <Options className="ml-0">
                <PeerInvite onDone={() => router.push("/dashboard")} />
              </Options>
            )}
          </div>
        </div>
      </div>

      {stage === "golden" ? (
        <GoldenCirclePanel answered={Object.keys(gcAnswers).length} />
      ) : (
        <CoachingProfile
          name={name}
          role={role}
          focusLabel={focusLabel}
          started={stage === "assessment" || stage === "peers"}
          skipped={skipped}
          answeredCount={answeredCount}
          sectionsDone={sectionsDone}
          goldenCircleCount={Object.keys(gcAnswers).length}
        />
      )}
    </div>
  );
}

export { SelfAssessment };
