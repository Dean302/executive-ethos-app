@AGENTS.md

# Project Rules
- Always use reusable UI components — build shared components in `src/components/common` and reuse them; do not duplicate one-off UI.
- **Never write a raw color** (`#hex`, `rgb()`, `rgba()`) in a component, className, or SVG attribute. Use a theme token. If the role you need has no token, add one to `globals.css` rather than inlining a value.

# Theming

All theming lives in `src/app/globals.css`, in three layers. Always change things at the lowest layer that can express the change.

1. **Primitives** — the raw Executive Ethos palette (`--brand-navy` `#13243f`, `--brand-gold` `#c9a449`, `--brand-cream` `#f5efe2`, the surface steps, and the navy/cream/gold alpha ramps). Alpha ramps derive from `--navy-rgb` / `--gold-rgb` / `--cream-rgb` channel triples, so changing a brand color is a **one-line edit**. A rebrand touches only this block.
2. **Semantics** — role tokens (`--background`, `--foreground`, `--primary`, `--accent`, `--muted-foreground`, `--border`, `--ring`, …) defined twice: `:root` = light cream/navy scheme, `.dark` = navy scheme. Re-theming without changing the brand means remapping these to different primitives.
3. **`@theme inline`** — exposes the semantic tokens to Tailwind as utilities (`bg-background`, `text-muted-foreground`, `border-border`, `font-serif`, …). Component code only ever touches this layer.

Notes:
- **Scheme switching**: the app renders light by default. Add `dark` to `<html>` in `app/layout.tsx` for the whole app, or a `light`/`dark` class on any element to switch just that subtree.
- **Type**: Inter (loaded by `next/font` as `--font-inter`, exposed as `--type-sans`/`font-sans`) for everything UI; Georgia (`--type-serif`/`font-serif`) for display and italic emphasis only. There is no mono face. Theme keys are named `--type-*` so the `@theme` mapping is not self-referential.
- **Gold is an accent, never body text** — it measures 2.1:1 on cream. `--muted-foreground` uses navy at 0.72 (5.8:1), not the design system's 0.55 (3.5:1), which `ethos-design/PRODUCT.md` flags as an accessibility risk. Hold new tokens to WCAG 2.1 AA.
- Source of truth for the design system is the sibling repo `../ethos-design` (see its `PRODUCT.md` for brand principles: restraint, no gradients/shadows/glassmorphism, hierarchy via weight and scale).

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
