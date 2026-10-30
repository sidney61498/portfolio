# Sidney Medrano — Portfolio

**Live: https://sidneymedrano.vercel.app**

Personal portfolio: Cloudstaff case studies, earlier systems, and **Tindahan POS**, a working
point-of-sale and inventory demo that runs entirely in the browser.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · daisyUI v5 · React Router · Zustand ·
Recharts · Vitest · Playwright

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run build` | Type-check and build to `dist/` |
| `npm test` | Unit tests (POS business rules) |
| `npm run e2e` | Browser tests against a production build (first time: `npx playwright install chromium`) |
| `npm run lint` | ESLint |
| `npm run placeholders` | Lists `[bracketed]` content still to be filled in; exits 1 while any remain |

## Where things are

```
src/content/        All portfolio copy (profile, skills, experience, projects). Edit text here.
src/components/     Homepage sections and layout
src/pages/          Home, case study, 404
src/demos/pos/
  domain/           Pure business rules: money, cart/VAT, stock ledger, permissions,
                    operations (checkout, void, refund, stock-in...), reports
  seed/             Deterministic demo store + 30 days of history
  store/            Zustand store persisted to localStorage
  services/         The API the screens call (swap for a real backend later)
  pages/            Register, dashboard, inventory, sales, reports, settings
docs/               Planning docs: plan, architecture, content draft, POS spec
e2e/                Playwright tests
```

## POS design notes

- **Money is integer centavos.** VAT (12%, price-inclusive) is split out once at the total.
- **Stock only changes through the ledger.** Every sale, return, stock-in and adjustment writes
  a movement with before → after; a dev-mode check verifies `stock === sum(movements)`.
- **Operations are pure functions** `(data, input) → data`, all-or-nothing, with permissions
  checked inside, so hiding a button is never the only guard.
- **Voids are same-day; refunds can be partial** and always add up to exactly what was paid.

## Deploy

Vercel: import the repo; it detects Vite. `vercel.json` rewrites all paths to `index.html` so
deep links like `/demo/pos/inventory/products` work on refresh.
