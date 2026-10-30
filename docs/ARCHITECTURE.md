# Architecture

> **Status (2026-10-30):** first version built. Where this doc and the code disagree, the code wins;
> see the repo README for the current layout.

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Build | **Vite** | Fast dev server, simple static build |
| UI | **React 19 + TypeScript** | Requested; TS signals seniority and catches POS math bugs |
| Styling | **Tailwind CSS v4** | Requested; CSS-first config through `@tailwindcss/vite` |
| Components | **daisyUI v5** | Requested; themeable components (navbar, drawer, modal, table, stats, timeline) |
| Routing | **React Router v8** (data router, SPA mode) | Lazy routes; the demo is its own chunk |
| State (demo) | **Zustand** + `persist` middleware | Small, no boilerplate, built-in localStorage persistence |
| Forms | Plain controlled forms | All validation lives in the domain operations, so the UI and any future API share one set of rules |
| Charts | **Recharts** | daisyUI has no charts; Recharts is light and React-native |
| Icons | **lucide-react** | Consistent, tree-shakeable |
| Animation | CSS transitions only | No animation library; all motion is off under `prefers-reduced-motion` |
| Unit tests | **Vitest + Testing Library** | Same config as Vite |
| E2E | **Playwright** | Already on your resume, so the tests double as proof |
| Hosting | **Vercel** | Free, preview deploys, SPA rewrites |

Use the latest stable version of each package at scaffold time.

## 2. Scaffold

```bash
cd ~/Documents/portfolio
npm create vite@latest app -- --template react-ts   # or scaffold into . if you want the repo root here
cd app
npm i react-router zustand react-hook-form zod @hookform/resolvers recharts lucide-react framer-motion
npm i -D tailwindcss @tailwindcss/vite daisyui vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test prettier prettier-plugin-tailwindcss
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts' },
})
```

`src/index.css` (Tailwind v4 + daisyUI v5 are configured in CSS; there's no `tailwind.config.js`):

```css
@import "tailwindcss";

@plugin "daisyui" {
  themes: false; /* only our custom themes below */
}

@plugin "daisyui/theme" {
  name: "sidney";
  default: true;
  color-scheme: light;
  --color-base-100: oklch(99% 0.003 260);
  --color-base-200: oklch(96% 0.006 260);
  --color-base-300: oklch(92% 0.01 260);
  --color-base-content: oklch(28% 0.03 260);
  --color-primary: oklch(36% 0.05 260);      /* navy from the resume sidebar */
  --color-primary-content: oklch(98% 0 0);
  --color-accent: oklch(70% 0.14 200);        /* teal highlight */
  --color-accent-content: oklch(20% 0.03 200);
  --radius-box: 1rem;
  --radius-field: 0.5rem;
}

@plugin "daisyui/theme" {
  name: "sidney-dark";
  prefersdark: true;
  color-scheme: dark;
  --color-base-100: oklch(22% 0.02 260);
  --color-base-200: oklch(19% 0.02 260);
  --color-base-300: oklch(16% 0.02 260);
  --color-base-content: oklch(92% 0.01 260);
  --color-primary: oklch(75% 0.08 260);
  --color-primary-content: oklch(20% 0.03 260);
  --color-accent: oklch(75% 0.13 200);
  --color-accent-content: oklch(18% 0.03 200);
}
```

The theme toggle sets `data-theme="sidney" | "sidney-dark"` on `<html>` and remembers the choice
in `localStorage` (wrapped in try/catch). With no saved choice it follows the OS setting.

## 3. Folder structure

```
src/
  main.tsx
  router.tsx                     # route tree, lazy() for /demo/pos and /work/:slug
  index.css
  content/                       # all portfolio copy as typed data (edit text here, not in JSX)
    profile.ts                   # name, title, pitch, links, location
    skills.ts
    experience.ts
    projects.ts                  # every Cloudstaff + earlier system, see §4b for the type
  components/
    layout/  Navbar.tsx  Footer.tsx  ThemeToggle.tsx  Section.tsx
    home/    Hero.tsx  About.tsx  Skills.tsx  WorkGrid.tsx  DemoShowcase.tsx  Experience.tsx  Contact.tsx
    ui/      Badge.tsx  SectionHeading.tsx  ExternalLink.tsx
  pages/
    HomePage.tsx
    CaseStudyPage.tsx
    NotFoundPage.tsx
  demos/
    pos/
      PosLayout.tsx              # drawer sidebar + top bar (role switch, reset)
      routes.tsx                 # nested routes, see POS spec §3
      domain/                    # pure TS, no React: types, money, tax, cart, stock rules
        types.ts  money.ts  cart.ts  stock.ts  permissions.ts
      store/                     # Zustand stores (persisted)
        catalogStore.ts  inventoryStore.ts  salesStore.ts  sessionStore.ts  settingsStore.ts
      services/                  # async API the screens call; swap for a Laravel backend later
        productService.ts  inventoryService.ts  saleService.ts  reportService.ts
      seed/                      # seed products, categories, suppliers, 30 days of sales
      pages/                     # Dashboard, Register, Inventory, Products, StockIn, Sales, Reports, Settings
      components/                # ProductGrid, Cart, PaymentModal, Receipt, StockBadge, ...
      __tests__/
    shared/                      # demo shell reused by every demo: layout, reset button, storage helper, "clean-room rebuild" banner
    contact-tracing/             # optional Phase 6, same domain/ store/ pages/ split as pos
    payroll/                     # optional Phase 6, same split; domain/ holds the pay calculation
  test/setup.ts
e2e/
  home.spec.ts  pos-checkout.spec.ts  pos-void.spec.ts  pos-roles.spec.ts
public/
  resume.pdf  og-image.png  favicon.svg  robots.txt  sitemap.xml
```

## 4. Key design rules

1. **The domain layer is pure.** `demos/pos/domain/*` has no React and no storage. Cart totals,
   VAT, discounts, stock checks and permissions are plain functions with unit tests. This is the
   part a reviewer will read.
2. **Screens never touch stores directly for writes.** They call `services/*` (async, returning
   `Promise`). Services validate with Zod, check permissions, update stores and append ledger
   entries. Replacing the services with `fetch('/api/...')` is the Laravel upgrade path.
3. **Money is integer centavos.** Format only at the edge (`formatPHP(12345) → ₱123.45`).
   Never use floats for money.
4. **Stock changes only through the ledger.** Every change appends a `StockMovement`.
   `product.stock` is a cached sum that a dev-only integrity check can verify.
5. **Content is data.** Portfolio text lives in `src/content/`, so copy edits never touch components.

## 4b. Project data model

Cloudstaff case studies and earlier systems share one type, so a single card component and a
single page template serve both:

```ts
// src/content/projects.ts
type Group = 'cloudstaff' | 'earlier'

interface Project {
  slug: string
  title: string
  employer: string               // 'Cloudstaff', 'Mariano Marcos State University', ...
  group: Group                   // drives the All · Cloudstaff · Earlier systems tabs
  period: string                 // '2019–2022'
  stack: string[]
  summary: string                // card text, 1–2 sentences
  featured?: boolean             // shown first on the home grid
  page?: {                       // present → card links to /work/:slug
    context: string; problem?: string; role: string
    approach: string[]; outcome: string
    visuals: { src: string; alt: string; caption: string }[]
  }
  demo?: { href: string; label: string }   // present → "Try it" button (e.g. /demo/pos)
}
```

A card links to its page if it has one, otherwise to its demo, and is plain text if it has
neither. A small Vitest test checks that every slug is unique and every `demo.href` matches a
real route.

## 5. Routing

```tsx
// router.tsx (sketch)
createBrowserRouter([
  { path: '/', element: <RootLayout />, errorElement: <NotFoundPage />, children: [
    { index: true, element: <HomePage /> },
    { path: 'work/:slug', lazy: () => import('./pages/CaseStudyPage') },
  ]},
  { path: '/demo/pos/*', lazy: () => import('./demos/pos/routes') },  // own layout, own chunk
  // Phase 6 (optional):
  { path: '/demo/contact-tracing/*', lazy: () => import('./demos/contact-tracing/routes') },
  { path: '/demo/payroll/*', lazy: () => import('./demos/payroll/routes') },
])
```

## 6. Testing strategy

| Layer | Tool | What |
|---|---|---|
| Domain | Vitest | Cart totals, VAT-inclusive math, rounding, discount caps, stock can't go negative, void restores stock, permission matrix |
| Components | Testing Library | Cart interactions, payment modal change calculation, form validation messages |
| E2E | Playwright | Home loads + nav works; full checkout → receipt → stock decreased; void → stock restored; cashier blocked from inventory edit; reset demo |

Target: domain layer at 90%+ coverage. Don't chase coverage on presentational components.

## 7. Performance and accessibility budget

- Home JS under ~150 KB gzipped (the demo and Recharts are in separate chunks)
- Images: WebP/AVIF with `width`/`height` set, `loading="lazy"` below the fold
- Every interactive element reachable by keyboard; the register is fully usable without a mouse
- Contrast AA in both themes; `aria-live` on cart total and payment change
