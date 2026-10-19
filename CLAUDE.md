@AGENTS.md

# Project Rules
- Always use reusable UI components — build shared components in `src/components/common` and reuse them; do not duplicate one-off UI.
- **Never write a raw color** (`#hex`, `rgb()`, `rgba()`) in a component, className, or SVG attribute. Use a theme token. If the role you need has no token, add one to `globals.css` rather than inlining a value.

# Theming

Source of truth: the brand guidelines `EE_BrandGuidelines_260909_R2.pdf` (House of Kin), as applied in the design prototype `../executive-ethos-latest-design/web`. Follow the prototype's intended design, not its code.

All theming lives in `src/app/globals.css`, in three layers. Always change things at the lowest layer that can express the change.

1. **Primitives** — the raw palette. Primary: Navy `#121F2F`, Gold `#CCA869`, Cream `#F2EFEB`. Secondary: Oxblood, Metal, Bronze, Slate, Mist, Ash. The guidelines' product UI tokens (Navy Raised, Navy Hover, Gold Hover, Cream Hover, Line, Input), plus functional values the guidelines don't cover (gold ink, neutral border, status colours). A rebrand touches only this block.
2. **Semantics** — role tokens (`--background`, `--primary`, `--accent`, `--accent-text`, `--muted-foreground`, `--muted-on-dark`, `--border`, `--line`, `--ring`, status colours…). Light only: the guidelines define no dark scheme, so there is no `.dark` block. `dark:` is pinned to a `.dark` class nothing sets.
3. **`@theme inline`** — exposes the tokens to Tailwind as utilities. Component code only ever touches this layer.

## Colour rules
- **Gold belongs on navy surfaces.** On cream or white, gold is only a fill or a rule paired with navy text — never text (1.95:1 on cream). Gold text on a light ground uses `text-accent-text` (4.70:1). Plain `text-accent` is for navy surfaces (7.4:1).
- Focus rings are navy (`--ring`), not gold.
- `text-muted-foreground` (Slate) passes AA on cream and white but not on `bg-muted`. Don't pair them.
- On navy surfaces use `text-muted-on-dark` (Mist), `text-success-on-dark` and `text-destructive-on-dark` for secondary and status text.
- `border-border` frames surfaces; `border-line` divides rows inside them.
- `bg-tint` / `bg-tint-soft` are light navy fills for header rows, quiet cells and selected states.
- Status colours (`success`, `warning`, `destructive`) are used sparingly, never as the main palette.
- Tones (`sage`, `slate`, `blush`, `cream`) tell sections, tiles and statuses apart: `bg-tone-<name>-soft` for bands and tracks, `bg-tone-<name>-muted` for chips, `bg-tone-<name>` for bars (non-text), `text-tone-<name>-ink` for text on any of them.
- Gradients: only the guidelines' three — `bg-gradient-navy-slate` (navy banners), `bg-gradient-gold-cream` (arrival moments), `bg-gradient-navy-cream` (hairlines beside the mark). Subtle, never the focal point. No shadows or glass effects on UI chrome; the only exception is product illustrations floating over photography (`components/auth/ProductGlimpse`).
- Hold every new token to WCAG 2.1 AA.

## Type
Faces are loaded by `next/font` in `app/layout.tsx`.
- `font-sans` — Funnel Sans: body and UI.
- `font-heading` — Funnel Sans at regular weight. `h1`–`h6` get it (and `font-normal`) from the base layer. The prototype's code says `font-light`, but it never loads weight 300, so its headings render at 400 — match what renders. The guidelines name Newsreader for headlines; the design deliberately moved headings to Funnel Sans.
- `font-identifier` — Funnel Display: labels, eyebrows, metadata. Natural case; no uppercase tracking.
- `font-signature` — Newsreader italic: one signature moment per screen at most.

## Shape
- Controls (buttons, inputs, chips): `rounded-sm`…`rounded-xl` off `--radius` (8px).
- Surfaces, by nesting depth: `rounded-container` (32px, page-level cards), `rounded-panel` (24px, tiles, option cards, dialogs), `rounded-inset` (16px, boxes inside a container).

## Brand assets
Icons and the brand mark live in `components/common/svg.tsx`. It holds icons and logos only — charts and illustrations stay with the component that draws them.

- `<Logo surface="light" | "dark" />` (`components/common/logo`) — the official horizontal lockup files in `public/brand`, used unmodified. The guidelines forbid recolouring, re-spacing or adding effects to the logo.
- `<BrandMark variant="filled" | "outline" />` (`components/common/svg.tsx`) — the icon in `currentColor`. Filled when it stands alone; outline only beside the wordmark. Gold on navy, navy on cream.
- `app/icon.svg` — the favicon, from the official gold icon.

## Voice
Considered, direct, warm, confident, literate — "the way a confident executive speaks: measured, plain, precise."

# Tech Stack

## Framework & Language
- **Next.js 16.2.10** — App Router (`src/app`), React Server Components enabled
- **React 19.2.4** / **React DOM 19.2.4**
- **TypeScript 5** — strict, `@/*` import alias → `src/`

## Styling
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss` (no `tailwind.config.js`; theme in `src/app/globals.css`)
- **tw-animate-css** — animation utilities
- **clsx** + **tailwind-merge** — class composition (`cn()` in `src/lib/utils.ts`)

## UI Components
- **shadcn/ui** (CLI `shadcn ^4.13.1`) — components live in `src/components/common` (the `ui` alias points here in `components.json`)
- **Base UI** (`@base-ui/react`) — underlying unstyled primitives (this shadcn setup uses Base UI, not Radix)
- **class-variance-authority** — component variants
- **lucide-react** — icons

## Tooling
- **ESLint 9** with `eslint-config-next`
- **npm** — package manager

## Project Structure
```
src/
  app/                  # App Router routes, layouts, globals.css
    (auth)/             # auth routes only; the UI lives in components/auth
  components/
    common/             # shared UI primitives (shadcn target)
    auth/               # everything auth: layout, brand panel, forms, server actions
    <name>/             # other shared components (header, sidebar)
  features/
    onboarding/         # onboarding steps (OnboardingShell frame, payment, …)
  schemas/              # zod schemas shared by client forms and server actions
  lib/
    utils.ts            # cn() helper
```

Server actions re-validate their input with the same zod schema the form uses; the client check is for UX, not security.

- **Card data never reaches our server.** Payment actions take only the program choice and compute amounts from `lib/pricing.ts`; card fields are stand-ins for the payment processor's hosted fields.
- **JSX gotcha:** this compiler drops the space between an expression and a following HTML entity (`{amount} &amp; start` renders "$2,500& start"). Write such text as one template string: ``{`Pay ${amount} & start`}``.
