// Client-side CSV export: a Blob and an <a download>, no library.

/** Quotes a cell only when it holds a comma, quote or newline. */
function escapeCell(value: string | number) {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(headers: string[], rows: (string | number)[][]) {
  // CRLF, the CSV spec's line ending and what Excel expects.
  return [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n")
}

/** Downloads rows as a CSV file. A byte-order mark lets Excel read it as UTF-8. */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const blob = new Blob(["﻿" + toCsv(headers, rows)], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
