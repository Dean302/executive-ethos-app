"use client"

import * as React from "react"

export type RecorderStatus = "idle" | "requesting" | "recording" | "stopped" | "error"

type Options = {
  /** Recording stops by itself at this length. */
  maxDurationMs?: number
  /** Target bitrate; voice needs far less than the browser default. */
  audioBitsPerSecond?: number
}

/** The first container the browser can record to: WebM in Chromium and Firefox, MP4 in Safari. */
function pickMimeType() {
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type))
}

function describeError(error: unknown) {
  const name = error instanceof DOMException ? error.name : ""
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Microphone access is blocked. Allow it in your browser's site settings, then try again."
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "We couldn't find a microphone. Connect one and try again."
  }
  if (name === "NotReadableError") {
    return "Another app is using your microphone. Close it and try again."
  }
  return "We couldn't start recording. Try again, or use a current version of Chrome, Safari or Edge."
}

/**
 * Records from the microphone with MediaRecorder, exposing an AnalyserNode
 * for a live waveform. The recording is ready as `audio` once status is
 * "stopped".
 */
export function useAudioRecorder({ maxDurationMs = 120_000, audioBitsPerSecond = 64_000 }: Options = {}) {
  const [status, setStatus] = React.useState<RecorderStatus>("idle")
  const [elapsedMs, setElapsedMs] = React.useState(0)
  const [audio, setAudio] = React.useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const streamRef = React.useRef<MediaStream | null>(null)
  const recorderRef = React.useRef<MediaRecorder | null>(null)
  const audioCtxRef = React.useRef<AudioContext | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const startedAtRef = React.useRef(0)
  // Bumped on reset and unmount, so a start still waiting on permission
  // knows to throw its stream away.
  const sessionRef = React.useRef(0)

  const release = React.useCallback(() => {
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    setAnalyser(null)
  }, [])

  const stop = React.useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== "inactive") recorder.stop()
  }, [])

  const start = React.useCallback(async () => {
    const session = ++sessionRef.current
    setError(null)

    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError(describeError(null))
      setStatus("error")
      return
    }

    setStatus("requesting")
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
    } catch (cause) {
      if (session !== sessionRef.current) return
      setError(describeError(cause))
      setStatus("error")
      return
    }
    if (session !== sessionRef.current) {
      stream.getTracks().forEach((track) => track.stop())
      return
    }
    streamRef.current = stream

    const ctx = new AudioContext()
    audioCtxRef.current = ctx
    const node = ctx.createAnalyser()
    node.fftSize = 256
    node.smoothingTimeConstant = 0.75
    ctx.createMediaStreamSource(stream).connect(node)
    setAnalyser(node)

    const mimeType = pickMimeType()
    const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond })
    const chunks: Blob[] = []
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data)
    }
    recorder.onstop = () => {
      release()
      if (session !== sessionRef.current) return
      setElapsedMs(Date.now() - startedAtRef.current)
      const blob = new Blob(chunks, { type: recorder.mimeType || mimeType })
      setAudio(blob)
      setAudioUrl(URL.createObjectURL(blob))
      setStatus("stopped")
    }
    recorderRef.current = recorder
    recorder.start()

    startedAtRef.current = Date.now()
    setElapsedMs(0)
    setStatus("recording")
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current
      setElapsedMs(elapsed)
      if (elapsed >= maxDurationMs) stop()
    }, 200)
  }, [audioBitsPerSecond, maxDurationMs, release, stop])

  const reset = React.useCallback(() => {
    sessionRef.current++
    stop()
    release()
    recorderRef.current = null
    setAudio(null)
    setAudioUrl(null)
    setElapsedMs(0)
    setError(null)
    setStatus("idle")
  }, [release, stop])

  // Free the previous recording's object URL when it's replaced.
  React.useEffect(() => {
    if (!audioUrl) return
    return () => URL.revokeObjectURL(audioUrl)
  }, [audioUrl])

  React.useEffect(
    () => () => {
      sessionRef.current++
      const recorder = recorderRef.current
      if (recorder && recorder.state !== "inactive") recorder.stop()
      release()
    },
    [release]
  )

  return { status, elapsedMs, audio, audioUrl, analyser, error, start, stop, reset }
}
