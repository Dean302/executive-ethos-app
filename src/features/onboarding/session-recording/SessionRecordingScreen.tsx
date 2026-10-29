"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, FileAudio, FileText } from "lucide-react"

import { Badge } from "@/components/common/badge"
import { Button } from "@/components/common/button"
import { FileDropzone } from "@/components/common/file-dropzone"
import { sampleAccept, sessionSampleSchema, type SampleKind } from "@/schemas/sessionSampleSchema"

import { submitSessionSample } from "./actions"

const MODES = {
  recording: {
    heading: "Upload a recording",
    body: "A call, a meeting, a talk you gave: any recording of you actually speaking. We'll analyze it the same way we would a live recording.",
    hint: "Audio or video, most formats work",
    icon: FileAudio,
    switchTo: "transcript",
    switchLabel: "Only have a transcript? Upload that instead",
  },
  transcript: {
    heading: "Upload a transcript",
    body: "Have a transcript of a call or meeting you spoke in? Upload it and we'll analyze your words the same way.",
    hint: ".txt, .vtt, .srt, .doc, .docx, or .pdf",
    icon: FileText,
    switchTo: "recording",
    switchLabel: "Upload a recording instead",
  },
} as const satisfies Record<SampleKind, { switchTo: SampleKind } & Record<string, unknown>>

function checkFile(kind: SampleKind, file: File) {
  const parsed = sessionSampleSchema.safeParse({ kind, name: file.name, size: file.size, type: file.type })
  return parsed.success ? null : parsed.error.issues[0].message
}

/**
 * Session recording: an existing recording of the lead speaking, so the
 * analysis has one objective input straight away. Upload only (live
 * recording is too much to ask during onboarding), with a transcript as
 * the fallback for anyone without a media file.
 */
function SessionRecordingScreen({ nextHref }: { nextHref: string }) {
  const router = useRouter()
  const [kind, setKind] = React.useState<SampleKind>("recording")
  const [file, setFile] = React.useState<File | null>(null)
  const [fileError, setFileError] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const mode = MODES[kind]

  const choose = (next: File | null) => {
    setFile(next)
    setSubmitError(null)
    setFileError(next ? checkFile(kind, next) : null)
  }

  const switchMode = () => {
    setKind(mode.switchTo)
    choose(null)
  }

  const confirm = () => {
    if (!file || fileError) return
    setSubmitError(null)
    startTransition(async () => {
      try {
        const result = await submitSessionSample({ kind, name: file.name, size: file.size, type: file.type })
        if ("error" in result) setSubmitError(result.error)
        else router.push(nextHref)
      } catch {
        setSubmitError("We couldn't upload your file. Check your connection and try again.")
      }
    })
  }

  return (
    // A centred column of flex items, as in the design, so buttons and the
    // badge sit as blocks rather than on text lines.
    <div className="flex flex-col items-center text-center">
      <span className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
        <FileAudio aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-[0.06em] uppercase">Session Recording</p>
      <h1 className="mt-1.5 text-3xl text-balance">Give the AI something real to work with</h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-[15px]">
        Your self-assessment is one input; your peers&apos; take time to come back. This is the fast one: an actual
        recording of you speaking, so we can show you how you really land, not just how you rated yourself.
      </p>

      <Badge className="mt-8">Onboarding Recording</Badge>
      <h2 className="mt-6 text-2xl">{mode.heading}</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">{mode.body}</p>

      <FileDropzone
        // Remount on switching, so the picker's accept and focus reset.
        key={kind}
        className="mt-8 max-w-sm"
        file={file}
        onFileChange={choose}
        accept={sampleAccept(kind)}
        hint={mode.hint}
        fileIcon={mode.icon}
        error={fileError}
        disabled={isPending}
      />

      {submitError && (
        <p role="alert" className="text-destructive mx-auto mt-4 flex max-w-sm items-start justify-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          {submitError}
        </p>
      )}

      <div className="mt-10 flex items-center gap-3">
        <Button size="lg" className="gap-2" disabled={!file || !!fileError || isPending} onClick={confirm}>
          <Check aria-hidden strokeWidth={1.75} />
          {isPending ? "Uploading…" : "Confirm & Upload"}
        </Button>
      </div>

      <button
        type="button"
        onClick={switchMode}
        disabled={isPending}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 mt-6 cursor-pointer rounded-sm text-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
      >
        {mode.switchLabel}
      </button>
    </div>
  )
}

export { SessionRecordingScreen }
