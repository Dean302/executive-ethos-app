"use client"

import * as React from "react"
import { AlertCircle, FileText, Upload, X, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

type FileDropzoneProps = {
  /** The chosen file, or null to show the drop target. */
  file: File | null
  onFileChange: (file: File | null) => void
  /** The file picker's `accept`. */
  accept?: string
  /** Main line of the drop target. */
  label?: string
  /** What's accepted, under the label. */
  hint?: React.ReactNode
  /** Shown beside the chosen file. */
  fileIcon?: LucideIcon
  /** Validation message. Shown below and marks the control invalid. */
  error?: string | null
  disabled?: boolean
  className?: string
}

/**
 * Pick one file by clicking or dropping it, then show it as a removable
 * row. Validation stays with the caller, which passes back `error`.
 *
 *   <FileDropzone file={file} onFileChange={setFile} accept=".pdf" hint="PDF, up to 10 MB" />
 */
function FileDropzone({
  file,
  onFileChange,
  accept,
  label = "Choose a file",
  hint,
  fileIcon: FileIcon = FileText,
  error,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const targetRef = React.useRef<HTMLButtonElement>(null)
  const removeRef = React.useRef<HTMLButtonElement>(null)
  const hadFile = React.useRef(file !== null)
  const [dragging, setDragging] = React.useState(false)
  const hintId = React.useId()
  const errorId = React.useId()

  // Keep focus in place as the drop target and the file row swap.
  React.useEffect(() => {
    if (hadFile.current === (file !== null)) return
    hadFile.current = file !== null
    ;(file ? removeRef : targetRef).current?.focus()
  }, [file])

  const choose = (files: FileList | null) => {
    const next = files?.[0]
    if (next) onFileChange(next)
  }

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        tabIndex={-1}
        aria-hidden
        className="hidden"
        onChange={(event) => {
          choose(event.target.files)
          // Let the same file be chosen again after removing it.
          event.target.value = ""
        }}
      />

      {file ? (
        <div
          className={cn(
            "bg-card flex items-center gap-3 rounded-panel border px-5 py-4 text-left",
            error ? "border-destructive" : "border-border"
          )}
        >
          <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-md">
            <FileIcon aria-hidden className="size-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-sm">{formatFileSize(file.size)}</p>
          </div>
          <button
            ref={removeRef}
            type="button"
            disabled={disabled}
            onClick={() => onFileChange(null)}
            aria-label={`Remove ${file.name}`}
            aria-describedby={error ? errorId : undefined}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 cursor-pointer rounded-sm outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
          >
            <X aria-hidden className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      ) : (
        <button
          ref={targetRef}
          type="button"
          disabled={disabled}
          aria-describedby={describedBy}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            choose(event.dataTransfer.files)
          }}
          className={cn(
            "bg-card hover:border-primary/40 hover:bg-tint-soft focus-visible:ring-ring/50 flex w-full cursor-pointer flex-col items-center gap-3 rounded-panel border border-dashed px-8 py-12 transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50",
            dragging ? "border-primary bg-tint-soft" : error ? "border-destructive" : "border-border"
          )}
        >
          <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full">
            <Upload aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-medium">{dragging ? "Drop it here" : label}</span>
          {hint && (
            <span id={hintId} className="text-muted-foreground text-sm">
              {hint}
            </span>
          )}
        </button>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-destructive mt-2 flex items-start gap-1.5 text-left text-sm">
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  )
}

export { FileDropzone }
