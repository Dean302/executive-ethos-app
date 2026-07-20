@AGENTS.md

# Project Rules
- Always use reusable UI components — build shared components in `src/components/common` and reuse them; do not duplicate one-off UI.

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
