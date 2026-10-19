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
- Gradients: only the guidelines' three — `bg-gradient-navy-slate` (navy banners), `bg-gradient-gold-cream` (arrival moments), `bg-gradient-navy-cream` (hairlines beside the mark). Subtle, never the focal point. No shadows or glassmorphism.
- Hold every new token to WCAG 2.1 AA.

## Type
Faces are loaded by `next/font` in `app/layout.tsx`.
- `font-sans` — Funnel Sans: body and UI.
- `font-heading` — Funnel Sans at light weight. `h1`–`h6` get it (and `font-light`) from the base layer. The guidelines name Newsreader for headlines; the design deliberately moved headings to Funnel Sans.
- `font-identifier` — Funnel Display: labels, eyebrows, metadata. Natural case; no uppercase tracking.
- `font-signature` — Newsreader italic: one signature moment per screen at most.

## Shape
- Controls (buttons, inputs, chips): `rounded-sm`…`rounded-xl` off `--radius` (8px).
- Surfaces, by nesting depth: `rounded-container` (32px, page-level cards), `rounded-panel` (24px, tiles, option cards, dialogs), `rounded-inset` (16px, boxes inside a container).

## Brand assets
- `<Logo surface="light" | "dark" />` (`components/common/logo`) — the official horizontal lockup files in `public/brand`, used unmodified. The guidelines forbid recolouring, re-spacing or adding effects to the logo.
- `<BrandMark variant="filled" | "outline" />` (`components/common/brandMark`) — the icon in `currentColor`. Filled when it stands alone; outline only beside the wordmark. Gold on navy, navy on cream.
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
  components/
    common/             # shared UI components (shadcn target)
  lib/
    utils.ts            # cn() helper
```
