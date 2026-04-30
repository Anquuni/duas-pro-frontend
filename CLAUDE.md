# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, listens on 0.0.0.0)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run format    # Run Prettier formatter
```

No test runner is configured. No lint script is configured (Prettier only via `format`).

## Stack

- **SvelteKit 2 + Svelte 5** (file-based routing, SSR, runes syntax: `$state`, `$derived`, `$effect`, `$props`)
- **Vite 6** as build tool
- **Tailwind CSS 3** for styling
- **shadcn-svelte / Bits UI** for accessible headless components (`src/lib/components/ui/`)
- **Supabase** for auth and database (via `@supabase/ssr`)
- **TypeScript** with strict mode

## Architecture

### Routing & i18n

All user-facing pages live under `src/routes/[[lang]]/`. The optional `[lang]` segment supports `en`, `ar`, `de`, `fa`, `tr`, and `translit`. Language detection happens in `src/hooks.server.ts` via the `Accept-Language` header, which redirects users to the appropriate language prefix.

The server hook chain uses `sequence()`: language redirect → HTML `lang`/`dir` attribute injection → Supabase client setup → auth guard for protected routes.

### State Management

Feature-scoped Svelte stores follow the `{feature}.store.ts` naming convention:

| Store | Location | Purpose |
|---|---|---|
| `settingsStore` | `src/lib/settings/settings.store.ts` | Theme, language, font sizes, transliteration toggle — persisted to `localStorage` |
| `duaStore` | `src/lib/dua-detail/dua.store.ts` | Current view mode (line-by-line, full, presentation) and verse position |
| `headerStore` | `src/lib/header/header.store.ts` | Header visibility and dua page metadata |
| `liveReadingStore` | `src/lib/live-reading/live-reading.store.ts` | Realtime group reading session state |

### Feature Modules

Code is organized by feature under `src/lib/`:

- **`dua-detail/`** — Individual dua page logic: multiple view modes, audio player with timestamp sync, multi-language display
- **`dua-discovery/`** — Dua grid, filtering by tags/narrator/type, pagination
- **`collections/`** — Curated dua collection pages
- **`posts/`** — Blog content
- **`live-reading/`** — Realtime group reading sessions (Supabase Realtime)
- **`settings/`** — Settings panel UI and store
- **`header/`** — Top navigation bar
- **`types/`** — Shared TypeScript types (e.g. `dua.model.ts`: `Dua`, `DuaLine`, `DuaRecitation`)
- **`translations/`** — UI string translations keyed by language
- **`components/ui/`** — shadcn-svelte components (buttons, dialogs, sheets, etc.)

### RTL / Multi-Language

The settings store exposes an `isRtl` flag. Arabic and Persian content uses RTL layout. CSS custom properties are used for dynamic per-language font sizes (primary/secondary/tertiary) set from the settings store.

### Key Utilities

- `src/lib/utils.ts` — `cn()` (Tailwind class merge) and `flyAndScale` Svelte transition
- `src/lib/SEOHead.svelte` — Reusable SEO `<meta>` tag component used on all content pages
