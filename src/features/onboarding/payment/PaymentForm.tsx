"use client"

import * as React from "react"
import { AlertCircle, CreditCard, Lock, Wallet } from "lucide-react"

import { Button } from "@/components/common/button"
import { Checkbox } from "@/components/common/checkbox"
import { Input } from "@/components/common/input"
import { CardBrandIcons } from "@/components/common/svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/tabs"
import { formatUsd } from "@/lib/pricing"
import { cardDetailsSchema, type CardDetailsInput } from "@/schemas/cardDetailsSchema"

import { digitsOnly, formatCardNumber, formatExpiry } from "./cardFormat"

export type PaymentMethod = "card" | "wallet"

type PaymentFormProps = {
  amountDue: number
  error: string | null
  onSubmit: (method: PaymentMethod) => void
}

const EMPTY_CARD: CardDetailsInput = {
  name: "",
  number: "",
  expiry: "",
  cvc: "",
  zip: "",
  saveCard: false,
}

// Payment fields share the default input's 16px mobile text.
const FIELD = "text-base md:text-sm"

/**
 * Card or digital-wallet payment for the first month.
 *
 * Card details live only in this component's state and are never sent to
 * our server. These fields stand in for the payment processor's hosted
 * fields, which will replace them when a processor is connected.
 */
function PaymentForm({ amountDue, error, onSubmit }: PaymentFormProps) {
  const [method, setMethod] = React.useState<PaymentMethod>("card")
  const [card, setCard] = React.useState<CardDetailsInput>(EMPTY_CARD)
  const payWithId = React.useId()

  // A wallet hands off to the device's own sheet, so there's nothing to
  // fill in here; a card needs every field.
  const canPay = method === "wallet" || cardDetailsSchema.safeParse(card).success
  const amount = formatUsd(amountDue)

  const update = (field: keyof CardDetailsInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const value =
      field === "number"
        ? formatCardNumber(raw)
        : field === "expiry"
          ? formatExpiry(raw)
          : field === "cvc"
            ? digitsOnly(raw, 4)
            : field === "zip"
              ? digitsOnly(raw, 5)
              : raw
    setCard((current) => ({ ...current, [field]: value }))
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (canPay) onSubmit(method)
      }}
      noValidate
      className="bg-card mt-6 flex flex-col gap-6 rounded-container border p-6"
    >
      <div>
        <p
          id={payWithId}
          className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase"
        >
          Pay with
        </p>
        <Tabs
          value={method}
          onValueChange={(value) => setMethod(value as PaymentMethod)}
          className="mt-2"
        >
          <TabsList aria-labelledby={payWithId} className="w-full">
            <TabsTrigger value="card" className="gap-1.5">
              <CreditCard aria-hidden className="size-3.5" strokeWidth={1.75} />
              Card
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-1.5">
              <Wallet aria-hidden className="size-3.5" strokeWidth={1.75} />
              Digital wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="mt-4 flex flex-col gap-4">
            <Input
              label="Name on card"
              variant="field"
              className={FIELD}
              placeholder="Jordan Ellis"
              autoComplete="cc-name"
              value={card.name}
              onChange={update("name")}
            />
            <Input
              label="Card number"
              labelAddon={<CardBrandIcons />}
              variant="field"
              className={`${FIELD} tabular-nums`}
              placeholder="1234 1234 1234 1234"
              inputMode="numeric"
              autoComplete="cc-number"
              endIcon={<CreditCard className="size-4" strokeWidth={1.75} />}
              value={card.number}
              onChange={update("number")}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry"
                variant="field"
                className={`${FIELD} tabular-nums`}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={card.expiry}
                onChange={update("expiry")}
              />
              <Input
                label="CVC"
                variant="field"
                className={`${FIELD} tabular-nums`}
                placeholder="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={card.cvc}
                onChange={update("cvc")}
              />
            </div>
            <Input
              label="Billing ZIP code"
              variant="field"
              className={`${FIELD} max-w-[140px] tabular-nums`}
              placeholder="94105"
              inputMode="numeric"
              autoComplete="postal-code"
              value={card.zip}
              onChange={update("zip")}
            />
            <Checkbox
              label="Save payment details for future payments"
              checked={card.saveCard}
              onCheckedChange={(saveCard) => setCard((current) => ({ ...current, saveCard }))}
            />
          </TabsContent>

          <TabsContent
            value="wallet"
            className="bg-secondary/30 mt-4 flex flex-col items-center gap-2 rounded-inset border px-6 py-10 text-center"
          >
            <Wallet aria-hidden className="text-muted-foreground size-6" strokeWidth={1.5} />
            <p className="text-foreground text-sm">You&apos;ll confirm with your device&apos;s digital wallet</p>
            <p className="text-muted-foreground text-sm">
              Apple Pay or Google Pay, whichever your device offers
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex items-center justify-between gap-4 border-t pt-4">
        <span className="font-heading text-base">Due today</span>
        <span className="font-heading shrink-0 text-xl tabular-nums">{amount}</span>
      </div>

      {error && (
        <p role="alert" className="text-destructive -mb-3 flex items-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={!canPay} className="w-full gap-2">
        <Lock aria-hidden className="size-3.5" strokeWidth={1.75} />
        {`Pay ${amount} & start`}
      </Button>

      <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
        <Lock aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        Payments secured with 256-bit encryption. We never store your full card number. Renews at the
        same rate unless either party gives 30 days&apos; notice.
      </p>
    </form>
  )
}

export { PaymentForm }
