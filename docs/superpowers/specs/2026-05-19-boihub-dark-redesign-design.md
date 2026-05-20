# Boi Hub — Dark Visual Redesign

**Date:** 2026-05-19  
**Status:** Approved  
**Approach:** C — Hybrid (token overhaul + AnimatedHero + key component redesigns)

---

## Context

The current Boi Hub landing and interior pages use a light theme (off-white canvas, dark ink text, green primary). The goal is to replace this entirely with a dark, high-contrast visual identity based on a hero section discovered on 21st.dev — jet black backgrounds, `#4ade80` green accent, glass/blur effects, and bold typography.

---

## Design Identity

| Property | Value |
|---|---|
| Background base | `#050505` (jet black) |
| Background elevated | `#0d0d0d` (cards, sidebar) |
| Accent | `#4ade80` (green) |
| Accent hover | `#22c55e` |
| Accent dim (bg) | `rgba(74,222,128,0.12)` |
| Text primary | `#ffffff` |
| Text secondary | `rgba(255,255,255,0.65)` |
| Text muted | `rgba(255,255,255,0.35)` |
| Border subtle | `rgba(255,255,255,0.08)` |
| Border strong | `rgba(255,255,255,0.18)` |
| Glass surface | `rgba(255,255,255,0.10)` + `backdrop-blur-sm` |
| Font weight (headings) | 800–900 |
| Letter spacing (headings) | `-0.03em` to `-0.05em` |

No box shadows. Dark themes use borders, not shadows, for depth.

---

## Section 1 — CSS Tokens (`globals.css`)

The project has tokens in two places that must both be updated:
- **`@theme {}`** — prefixed with `--color-`, generates Tailwind utility classes (`bg-canvas`, `text-ink`, `border-primary`, etc.)
- **`:root {}`** — raw CSS variables used via `var(--canvas)` in inline styles and custom CSS

Both blocks must be updated in sync. No token names change — only values.

```css
/* === @theme block (Tailwind classes) === */
--color-canvas:       #050505;
--color-canvas-soft:  #0d0d0d;
--color-ink:          #ffffff;
--color-body:         rgba(255,255,255,0.65);
--color-mute:         rgba(255,255,255,0.35);
--color-primary:      #4ade80;
--color-primary-hover:#22c55e;
--color-primary-pale: rgba(74,222,128,0.12);
--color-positive:     #4ade80;
--color-positive-deep:#22c55e;
--color-negative:     #f87171;
--color-warning:      #facc15;
--color-border:       rgba(255,255,255,0.08);   /* new */
--color-border-strong:rgba(255,255,255,0.18);   /* new */

/* === :root block (CSS var() usage) === */
/* Mirror all of the above without --color- prefix */
--canvas:       #050505;
--canvas-soft:  #0d0d0d;
--ink:          #ffffff;
/* ... same pattern ... */
--border:       rgba(255,255,255,0.08);
--border-strong:rgba(255,255,255,0.18);
```

Body default: `background-color: var(--canvas-soft); color: var(--ink);` — already wired, values just change.

---

## Section 2 — Components

### `animated-hero-section-1.tsx` (new)
- Path: `src/components/ui/animated-hero-section-1.tsx`
- Source: 21st.dev prompt provided by user, unchanged in structure
- Dependency: `framer-motion` (install via npm)
- Props used in landing: `backgroundImageUrl`, `logo`, `navLinks`, `topRightAction`, `title`, `description`, `ctaButton`, `secondaryCta`
- Background image: Unsplash cattle photo (`photo-1500595046743-cd271d694d30`)
- Overlay: `bg-black/60`

### `button.tsx` — add `glass` variant
```ts
glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
```
Existing variants (`primary`, `ghost`, `tertiary`, etc.) keep their names. `primary` gets updated to `bg-primary text-black` for better contrast on dark backgrounds.

### `Sidebar.tsx` — dark redesign
- Container: `bg-canvas-soft border-r border-border`
- Active item: `bg-primary-pale text-primary border-l-2 border-primary`
- Inactive item: `text-mute hover:bg-white/5 hover:text-white`
- Logo: white "Boi" + green "Hub"

### `Navbar.tsx` — glass redesign
- Default state: `bg-transparent backdrop-blur-sm`
- Scrolled state (JS scroll listener): `bg-canvas/80 backdrop-blur border-b border-border`
- Links: `text-white/70 hover:text-white`
- CTA button: `glass` variant

### Inputs / Forms
- Background: `bg-canvas-soft`
- Border: `border border-border`
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/20`
- Text: `text-white placeholder:text-mute`
- Label: `text-mute text-sm`

### Cards (generic + FreteCard, LojaCard, SaudeCard, etc.)
- Background: `bg-canvas-soft`
- Border: `border border-border`
- Radius: unchanged (existing `rounded-xl`)
- No box shadow

---

## Section 3 — Pages

### Landing (`src/app/page.tsx`) — full redesign
1. **Hero**: Replace current hero section with `<AnimatedHero>`. Nav links: Fretes, Veterinários, Loja, Saúde Animal. Title: "Sua fazenda na palma da mão." Buttons: glass variant.
2. **Stats bar**: Horizontal strip `bg-canvas-soft border-t border-border`, four stats with green values.
3. **Features grid**: Uniform dark cards `bg-canvas-soft border-border`, remove the current light/dark alternating pattern.
4. **Perfis section**: Same dark cards, uniform style.
5. **CTA final**: `bg-canvas-soft`, green heading, white body, green solid button.
6. **Footer**: `bg-canvas border-t border-border`.

### Auth pages (`src/app/(auth)/layout.tsx` + login + cadastro)
- Layout: full-screen `bg-canvas`, centered column
- Form card: `bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8`
- Logo at top of card
- No background photo (hero stays landing-only)

### Onboarding (`src/app/onboarding/page.tsx`)
- Same treatment as auth: glass card centered on black background
- Step indicators: green dot for active, `border-border` for inactive

### App layout (`src/app/(app)/layout.tsx`)
- Body: `bg-canvas` (already picks up from token remap)
- Sidebar: redesigned (see above)
- Navbar: redesigned (see above)

### Inner pages (fretes, loja, saúde, suplementos, perfil)
- No structural changes
- Token remap handles ~80% automatically
- `FreteCard`, `LojaCard`, `VeterinarioCard`, `SuplementoCard`, `ProdutoCard`: add explicit `bg-canvas-soft border border-border` so they don't rely on inherited background

---

## Dependencies

```bash
npm install framer-motion
```

`@radix-ui/react-slot` and `class-variance-authority` already installed.

---

## Out of Scope

- No changes to routing, auth logic, or Supabase integration
- No new pages or features
- No mobile nav redesign (can follow in a separate pass)
- No animation beyond what `AnimatedHero` provides

---

## File Change Summary

| File | Change type |
|---|---|
| `src/app/globals.css` | Token overhaul |
| `src/components/ui/animated-hero-section-1.tsx` | New file |
| `src/components/ui/button.tsx` | Add `glass` variant, update `primary` contrast |
| `src/components/layout/Sidebar.tsx` | Dark redesign |
| `src/components/layout/Navbar.tsx` | Glass + scroll behavior |
| `src/app/page.tsx` | Full landing redesign |
| `src/app/(auth)/layout.tsx` | Dark auth layout |
| `src/app/(app)/layout.tsx` | Picks up tokens; may need minor adjustments |
| `src/app/onboarding/page.tsx` | Glass card style |
| `src/components/fretes/FreteCard.tsx` | Explicit dark card tokens |
| `src/components/loja/LojaCard.tsx` | Explicit dark card tokens |
| `src/components/loja/SuplementoCard.tsx` | Explicit dark card tokens |
| `src/components/saude/VeterinarioCard.tsx` | Explicit dark card tokens |
| `src/components/saude/ProdutoCard.tsx` | Explicit dark card tokens |
