import { z } from "zod"

// The onboarding sample: an existing recording of the lead speaking (a
// call, a meeting, a talk), or its transcript for anyone without a media
// file. The file goes straight to storage; only its details reach the
// server action.

export const SAMPLE_KINDS = ["recording", "transcript"] as const
export type SampleKind = (typeof SAMPLE_KINDS)[number]

export const SAMPLE_RULES = {
  recording: {
    extensions: ["mp3", "wav", "m4a", "aac", "ogg", "flac", "mp4", "mov", "webm"],
    maxBytes: 500 * 1024 * 1024,
    typeMessage: "Choose an audio or video file, such as MP3, M4A, WAV, MP4 or MOV.",
    sizeMessage: "That file is over 500 MB. Trim it to the part where you're speaking, or upload the transcript.",
  },
  transcript: {
    extensions: ["txt", "vtt", "srt", "doc", "docx", "pdf"],
    maxBytes: 10 * 1024 * 1024,
    typeMessage: "Choose a text document: TXT, VTT, SRT, DOC, DOCX or PDF.",
    sizeMessage: "That file is over 10 MB. Upload the transcript as text only.",
  },
} satisfies Record<SampleKind, { extensions: string[]; maxBytes: number; typeMessage: string; sizeMessage: string }>

/** The file picker's `accept` for a kind. */
export function sampleAccept(kind: SampleKind) {
  const extensions = SAMPLE_RULES[kind].extensions.map((extension) => `.${extension}`).join(",")
  return kind === "recording" ? `audio/*,video/*,${extensions}` : extensions
}

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".")
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase()
}

export const sessionSampleSchema = z
  .object({
    kind: z.enum(SAMPLE_KINDS),
    name: z.string().trim().min(1, "Choose a file to upload").max(255, "Rename the file to under 255 characters"),
    size: z.number().int().min(1, "That file is empty. Choose another."),
    type: z.string().max(255),
  })
  .superRefine((sample, ctx) => {
    const rules = SAMPLE_RULES[sample.kind]
    // Browsers report a MIME type for some files and not others, so the
    // extension decides.
    if (!rules.extensions.includes(extensionOf(sample.name))) {
      ctx.addIssue({ code: "custom", path: ["name"], message: rules.typeMessage })
    } else if (sample.size > rules.maxBytes) {
      ctx.addIssue({ code: "custom", path: ["size"], message: rules.sizeMessage })
    }
  })

export type SessionSample = z.infer<typeof sessionSampleSchema>
