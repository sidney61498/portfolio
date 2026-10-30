# Portfolio Website — Plan

## 1. Goals

1. **Get interviews for senior full-stack roles.** A recruiter should understand who you are in
   under 10 seconds, and a hiring manager should find real engineering depth within 2 minutes.
2. **Show the work you can't link to.** Most of your Cloudstaff work is internal (StaffCentral,
   Phoenix, the staff API migration, automations), and so is everything you built before:
   POS, inventory, payroll, a document repository and contact tracing at MMSU, patient records
   and surveys at the hospital, and lesson pages at Bizmates. Case studies and rebuilt mock UIs
   make all of it visible without leaking anything.
3. **Prove you can ship a complete product.** The POS + Inventory demo is a working app with real
   business rules (stock ledger, voids, VAT, roles, reports), not a to-do list.
4. **The site is itself a work sample.** Clean code in a public repo, typed, tested, accessible
   and fast (Lighthouse 95+).

### Audience

| Visitor | What they need | Where they find it |
|---|---|---|
| Recruiter / HR | Title, years, stack, location/remote, contact, resume PDF | Hero + Skills + Contact, above the fold |
| Hiring manager / tech lead | How you think: trade-offs, scale, legacy work, ownership | Case studies |
| Engineer doing a screen | Code quality | GitHub repo link, POS demo source |
| Freelance client | "Can he build my system?" | POS demo + Experience |

## 2. Site map

```
/                      Home (single scrolling page)
  #hero                Name, title, one-line pitch, CTAs: "View work", "Try the POS demo", "Resume"
  #about               Short bio + photo + quick facts (5+ yrs, ~7,000-user system, cum laude)
  #skills              Grouped stack badges (Backend, Frontend, Data, DevOps/Tools, AI-assisted dev)
  #work                All projects, with tabs: All · Cloudstaff · Earlier systems
                       (cards → /work/:slug, or straight to a live demo)
  #demo                Live demos: POS + Inventory (+ optional mini demos, §5 Phase 6)
  #experience          Timeline: Cloudstaff → Bizmates → MMSU → Black Nazarene Hospital
  #contact             Email, LinkedIn, GitHub, resume download; optional contact form

/work/:slug            Case study page (one template for Cloudstaff and earlier systems)
/demo/pos/*            POS + Inventory app (lazy-loaded, its own layout)
/demo/contact-tracing  Optional mini demo (Phase 6)
/demo/payroll          Optional mini demo (Phase 6)
/resume.pdf            Static file in /public
*                      404 page
```

## 3. Cloudstaff case studies (featured work)

Full drafts are in [CONTENT.md](CONTENT.md). Planned list, strongest first:

| # | Slug | Title | What it shows |
|---|---|---|---|
| 1 | `staffcentral` | StaffCentral: time, leave and holidays for ~7,000 staff | Owning a large legacy system, approval workflows, reporting, SQL performance |
| 2 | `staff-api-migration` | Moving a user-management microservice to Laravel 12 | Migration with behaviour parity, auth (M2M + B2C), staged rollout |
| 3 | `phoenix` | Phoenix platform (Laravel + Angular) | APIs, features, decommissioning a legacy integration service |
| 4 | `ai-dev-harness` | An AI-assisted development harness | Guardrails, automation and review agents on top of Claude Code (strong differentiator) |
| 5 | `automation-qa` | n8n automations and Playwright E2E | Ops automation, safe read-only data access, test automation |
| 6 | `legacy-ui-modernization` | Reskinning legacy pages to a design system | Incremental modernization without touching business logic |

Each case study follows the same template: **Context → Problem → My role → Approach → Outcome →
Stack**, plus 1 or 2 mock visuals.

### 3b. Earlier systems (from the resume)

Each system from the resume gets a card in the **Earlier systems** tab. The strongest ones also
get a full case study page. The others stay as cards so the page doesn't drag. Drafts are in
[CONTENT.md](CONTENT.md#earlier-systems).

| Employer | System | Stack | On the site | Live demo |
|---|---|---|---|---|
| MMSU | Point of Sale | Laravel + Vue/React + MySQL | Card → POS demo | ✅ `/demo/pos` |
| MMSU | Inventory | Laravel + Vue/React + MySQL | Card → POS demo (inventory module) | ✅ `/demo/pos/inventory` |
| MMSU | Payroll | Laravel + Vue/React + MySQL | **Case study page** | Optional `/demo/payroll` |
| MMSU | Document repository | Laravel + Vue/React + MySQL | Case study page | — |
| MMSU | COVID-19 contact tracing | Laravel + Vue/React + MySQL | **Case study page** | Optional `/demo/contact-tracing` |
| Black Nazarene Hospital | Patient records | Laravel + React | **Case study page** | — (health data: mock visual only) |
| Black Nazarene Hospital | Patient surveys | Laravel + React | Card | — |
| Black Nazarene Hospital | Hospital inventory | Laravel + React | Card → POS demo (inventory module) | ✅ shared with POS |
| Bizmates | Web classroom lessons (PDF → HTML/CSS) | Nuxt.js + Laravel | Card + one rebuilt sample lesson page | Optional static sample |

The cards say which stack each system used, so the site doesn't suggest the live demos are the
original code. Every live demo is labelled **"Clean-room rebuild — the original is private."**

### Confidentiality rules (apply to every case study)

- No source code, internal hostnames, repo names, ticket keys, client names or staff names.
- No screenshots of real systems. Rebuild a simplified mock in React/Figma using fake data, or use
  a diagram instead.
- Only use numbers that are already on your public resume (~7,000 users). Describe other wins
  qualitatively ("cut report generation from minutes to seconds") unless the figure is cleared.
- No security details: auth secrets, token formats, gateway rules.
- **Before launch, have your lead or manager sign off on the case study text** (see Open decisions).
- **Earlier systems follow the same rules,** and some are stricter:
  - **Patient records and surveys:** fictional patients only, no real forms, no hospital
    letterhead. A diagram plus a mock screen is enough.
  - **Payroll:** no real employee names, salaries or university pay rules. Use fictional people,
    and label any contribution or tax tables "illustrative".
  - **Contact tracing:** no real visitor logs or locations.
  - **Bizmates lessons:** don't reproduce their lesson content. Rebuild one sample lesson layout
    with your own text.
  - **Naming employers:** it's fine to name MMSU and the hospital, since they're on your resume.
    Don't use their logos.

## 4. POS + Inventory demo (covers MMSU POS, MMSU inventory, hospital inventory)

Full spec: [POS-INVENTORY-SPEC.md](POS-INVENTORY-SPEC.md). In short:

- **Register:** product grid and search, barcode input, cart, discounts, 12% VAT, cash/e-wallet
  payment with change, printable receipt.
- **Inventory:** products, categories and suppliers (CRUD), stock-in, adjustments, a stock movement
  ledger, low-stock alerts.
- **Sales:** history, receipt reprint, void/refund that puts the stock back.
- **Dashboard and reports:** KPIs, 7-day sales chart, top products, inventory valuation, CSV export.
- **Roles:** a Cashier/Manager switcher that shows the permissions working.
- **Demo-friendly:** seeded data, "Reset demo data" button, guided first-run tour.

## 5. Build phases

Estimates assume part-time work (around 2–3 focused hours a day).

### Phase 0: Setup (½ day)
- [ ] Create a public GitHub repo `portfolio` and scaffold Vite + React + TS ([ARCHITECTURE.md §2](ARCHITECTURE.md))
- [ ] Tailwind v4 + daisyUI v5, custom `sidney` light/dark themes
- [ ] ESLint + Prettier, Vitest, Playwright, path aliases
- [ ] Deploy the empty shell to Vercel from day one (preview URLs on every PR)

### Phase 1: Portfolio shell and content (2–3 days)
- [ ] Layout: sticky navbar with section links, theme toggle, mobile drawer (daisyUI `drawer`)
- [ ] Hero, About, Skills, Experience timeline (daisyUI `timeline`), Contact, Footer
- [ ] Content lives in `src/content/*.ts` typed data files, not hardcoded in JSX
- [ ] Resume PDF in `/public`, plus a download button
- [ ] Scroll-spy on nav links, smooth scroll, `prefers-reduced-motion` respected

### Phase 2: Case studies and earlier systems (3 days)
- [ ] `WorkCard` grid on home with tabs (All · Cloudstaff · Earlier systems), plus a `/work/:slug` page template
- [ ] Write the 6 Cloudstaff case studies from the [CONTENT.md](CONTENT.md) drafts
- [ ] Fill in the `[brackets]` for the earlier systems and write their 4 case study pages
      (payroll, contact tracing, patient records, document repository) plus 5 cards
- [ ] Mock visuals: 1–2 per case study page (diagram or mock screen with fake data)
- [ ] Cards for POS/inventory link straight into the live demo
- [ ] Manager sign-off on the Cloudstaff text

### Phase 3: POS demo, core (4–5 days)
- [ ] Demo layout (`drawer` sidebar, top bar with role switcher and reset button)
- [ ] Domain types, money utils (integer centavos), seed data
- [ ] Zustand stores + persistence + `services/` layer
- [ ] Inventory: products/categories/suppliers CRUD, stock-in, adjustments, movement ledger
- [ ] Register: grid, search, barcode input, cart, discounts, VAT, payment, receipt
- [ ] Unit tests for cart math, VAT and stock rules

### Phase 4: POS demo, sales, reports, dashboard (2–3 days)
- [ ] Sales history, receipt reprint, void/refund with stock restore
- [ ] Dashboard KPIs + 7-day chart + low-stock list
- [ ] Reports: sales by day/product/category, inventory valuation, CSV export
- [ ] Role permissions enforced in the service layer, not only hidden in the UI
- [ ] First-run guided tour

### Phase 5: Polish and launch (2 days)
- [ ] Playwright E2E: homepage smoke, full checkout, void restores stock, cashier can't edit inventory
- [ ] Accessibility pass: keyboard-only checkout, focus states, labels, contrast in both themes
- [ ] SEO: titles/meta per route, Open Graph image, `sitemap.xml`, `robots.txt`
- [ ] Performance: lazy-load the demo, optimize images (WebP/AVIF), Lighthouse 95+ on mobile
- [ ] Custom domain, analytics (privacy-friendly, e.g. Vercel Analytics or Plausible)
- [ ] README in the repo with screenshots, stack, "how to run", and the architecture notes

**Total (Phases 0–5): about 14–16 working days part-time, or about 1½ weeks full-time.**

### Phase 6 (optional): Mini demos of earlier systems (2–4 days)

These are smaller than the POS: one screen each, sharing the POS demo's layout, theme, storage
and reset button. Build them after launch, one at a time. Recommended order:

1. **Contact tracing (`/demo/contact-tracing`, about 1½ days).** Visitor registration produces
   a QR code. A check-in screen scans it with the device camera (or a manual code) and logs the
   visit. A "trace" view takes a person and a date and lists everyone who overlapped in the same
   area. It's visual, quick to try, and recognisable to anyone who lived through 2020.
2. **Payroll (`/demo/payroll`, about 2 days).** Fictional employees, a payroll period,
   attendance/overtime input, then earnings, deductions and net pay with a printable payslip.
   Contribution and tax rates sit in an editable "illustrative" settings table, so the demo never
   claims to be current law. The calculation logic is pure functions with unit tests, like the
   POS domain layer.

Skip demos for the document repository, patient records, surveys and lessons. Case study pages
with mock visuals cover them well, and a fake patient-records app adds little and invites
data-privacy questions.

### Later (optional)
- Laravel 12 REST API version of the POS backend (your strongest backend stack), swapped in through
  the `services/` layer. Good second repo to link from the case study.
- A blog/notes section (MDX), e.g. "Lessons from maintaining a CakePHP 1.3 app in 2026".

## 6. Deployment

- **Host:** Vercel (free tier). Connect the GitHub repo. It auto-detects Vite, gives preview
  deploys per branch, and handles the SPA rewrite.
- `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` so
  `/demo/pos/inventory` works on refresh.
- **Domain:** e.g. `sidneymedrano.dev` (about $12/yr), or the free `*.vercel.app` to start.
- **CI:** GitHub Actions on PRs runs `lint → typecheck → vitest → build → playwright`.

## 7. Launch checklist

- [ ] All personal data reviewed: **email only on the site, no phone number, no home address**
      (show "Ilocos Norte, PH · Open to remote" instead)
- [ ] **References are not on the site.** Reymart's and Kim's phone/email are their PII. Use
      "References available on request" instead.
- [ ] Case study text cleared with Cloudstaff
- [ ] Resume PDF on the site is the public version (same rules: no references' contacts, no phone)
- [ ] Lighthouse ≥ 95 (Performance, Accessibility, Best Practices, SEO) on mobile
- [ ] Demo works on a fresh browser, after reset, and on a phone/tablet
- [ ] Earlier-systems pages use only fictional people/patients/salaries; no employer logos
- [ ] All links work (GitHub, LinkedIn, mailto, resume)
- [ ] Repo README has screenshots and a live link; repo pinned on your GitHub profile
- [ ] Add the URL to your resume, LinkedIn and GitHub bio

## 8. Open decisions

| # | Decision | My recommendation |
|---|---|---|
| 1 | How much Cloudstaff detail to publish | Keep it at resume-level specifics plus the approach. Ask your lead before launch. |
| 2 | Include the AI dev harness case study? | Yes. It's uncommon and current. Describe the design (guardrails, review agent, automation), not the internals. |
| 3 | Domain name | `sidneymedrano.dev` if available |
| 4 | Contact form vs mailto only | mailto + copy-email button at launch; add Formspree later if wanted |
| 5 | Photo | Reuse the resume photo, cropped square, served as WebP |
| 6 | Phone number on site | No. Email and LinkedIn only. |
| 7 | Which earlier systems get full pages | Payroll, contact tracing, patient records, document repository. The rest stay as cards. |
| 8 | Extra mini demos | Contact tracing first, payroll second, both after launch (Phase 6) |
| 9 | Missing details for earlier systems | You fill in the `[brackets]` in CONTENT.md (users, what each system replaced, key features). I won't invent them. |
