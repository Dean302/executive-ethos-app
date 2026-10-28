"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, RotateCcw, ShieldCheck } from "lucide-react"

import { Button } from "@/components/common/button"
import { Card } from "@/components/common/card"
import { CircularRecorder } from "@/components/recorder"
import { useAudioRecorder } from "@/hooks"
import { MAX_SIGNATURE_MS, MIN_SIGNATURE_MS } from "@/schemas/voiceSignatureSchema"

import { saveVoiceSignature } from "./actions"

// Written by the founder for this step; read exactly as given.
const PASSAGE =
  "Executive Ethos starts with one idea: the gap between what I know and how I say it is the gap between my potential and my results. Leadership is judged the moment I open my mouth. So I want the honest score, not the comfortable one, my clarity, my energy, my presence, my connection to the people in the room. Clear before clever. Direct before decorated. Calm before loud. I choose progress over comfort. I know my business; my job now is to make sure the room knows it too. Every time I speak, I'm either building trust or spending it."

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
}

/**
 * Voice signature: one unscored reading of a set passage, kept as the
 * reference voiceprint that confirms later recordings are the lead
 * speaking. Its own step, so the "why" is explained on its own terms.
 */
function VoiceSignatureScreen({ nextHref }: { nextHref: string }) {
  const router = useRouter()
  const recorder = useAudioRecorder({ maxDurationMs: MAX_SIGNATURE_MS })
  const { status, elapsedMs, audio, audioUrl, analyser } = recorder
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const tooShort = status === "stopped" && elapsedMs < MIN_SIGNATURE_MS
  const error = recorder.error ?? saveError

  const toggle = () => {
    if (status === "recording") recorder.stop()
    else if (status === "idle" || status === "error") recorder.start()
  }

  const reRecord = () => {
    setSaveError(null)
    recorder.reset()
  }

  const confirm = () => {
    if (!audio) return
    setSaveError(null)
    const formData = new FormData()
    formData.set("audio", audio, `voice-signature.${audio.type.includes("mp4") ? "m4a" : "webm"}`)
    formData.set("durationMs", String(Math.round(elapsedMs)))
    startTransition(async () => {
      try {
        const result = await saveVoiceSignature(formData)
        if ("error" in result) setSaveError(result.error)
        else router.push(nextHref)
      } catch {
        setSaveError("We couldn't save your recording. Check your connection and try again.")
      }
    })
  }

  const hint = {
    idle: "About 45 seconds. Tap to begin.",
    requesting: "Allow microphone access to start.",
    recording: "Reading. Tap to stop when you're done.",
    stopped: tooShort ? "That was short. Read the whole passage, then stop." : "Got it. Have a listen before you confirm.",
    error: "Tap to try again.",
  }[status]

  return (
    <div className="text-center">
      <span className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
        <ShieldCheck aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-[0.06em] uppercase">Voice Signature</p>
      <h1 className="mt-1.5 text-3xl text-balance">Let&apos;s capture your voice, once</h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-[15px]">
        A short reference sample, so every score that follows is confirmed to be you. It isn&apos;t scored, and
        your coach and reviewers never hear it.
      </p>

      <Card className="mt-8 px-6 py-5 text-left">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">Read this out loud</p>
        <p className="text-foreground mt-2 text-[15px] leading-relaxed">{PASSAGE}</p>
      </Card>

      <div className="mt-8">
        <CircularRecorder status={status} analyser={analyser} onToggle={toggle} />
      </div>

      <p className="text-primary mt-6 font-heading text-4xl tabular-nums" aria-hidden>
        {formatTime(elapsedMs)}
      </p>
      <p aria-live="polite" className="text-muted-foreground mt-1 min-h-5 text-sm">
        {hint}
      </p>

      {error && (
        <p role="alert" className="text-destructive mx-auto mt-4 flex max-w-md items-start justify-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      {status === "stopped" && (
        <>
          {audioUrl && <audio controls src={audioUrl} className="mx-auto mt-4 w-full max-w-sm" />}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="lg" onClick={reRecord} disabled={isPending}>
              <RotateCcw aria-hidden strokeWidth={1.75} /> Re-record
            </Button>
            <Button size="lg" onClick={confirm} disabled={tooShort || !audio || isPending}>
              <Check aria-hidden strokeWidth={1.75} />
              {isPending ? "Saving…" : "Confirm & continue"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export { VoiceSignatureScreen }
