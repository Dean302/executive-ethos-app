"use client"

import * as React from "react"

import { Button } from "@/components/common/button"
import { Input } from "@/components/common/input"

function NotifyForm() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return
    // No backend yet — capture intent and confirm.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p
        className="cs__confirm text-[#ECE7DC]"
        role="status"
        aria-live="polite"
      >
        <span className="text-[#C7A369]">✦</span> You&rsquo;re on the list. One
        note when the doors open.
      </p>
    )
  }

  return (
    <form className="cs__form" onSubmit={handleSubmit} noValidate>
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        aria-label="Email address"
        className="h-11 flex-1 rounded-none border-x-0 border-t-0 border-b border-[rgba(236,231,220,0.18)] bg-transparent px-0 text-[15px] text-[#ECE7DC] shadow-none transition-colors placeholder:text-[#6C7280] focus-visible:border-[#C7A369] focus-visible:ring-0"
      />
      <Button
        type="submit"
        className="h-11 shrink-0 rounded-none bg-[#ECE7DC] px-6 text-[13px] font-medium tracking-[0.02em] text-[#0A0C11] transition-colors hover:bg-[#C7A369] focus-visible:ring-[#C7A369]/40"
      >
        Request access
      </Button>
    </form>
  )
}

export { NotifyForm }
