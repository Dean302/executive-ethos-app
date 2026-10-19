/** "4242424242424242" → "4242 4242 4242 4242", digits only, 16 max. */
export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim()
}

/** "1228" → "12/28", digits only, 4 max. */
export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length < 3 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`
}

/** Digits only, capped at `max`. */
export function digitsOnly(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max)
}
