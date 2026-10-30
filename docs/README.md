# Sidney Medrano — Portfolio (planning)

Planning docs for a personal portfolio site built with **React + Tailwind CSS + daisyUI**.
It covers current Cloudstaff work and includes a working **POS + Inventory demo**.

| File | What's in it |
|---|---|
| [PLAN.md](PLAN.md) | Goals, site map, build phases with checklists, timeline, deploy, launch checklist, open decisions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, scaffold commands, folder structure, routing, theming, state, testing |
| [CONTENT.md](CONTENT.md) | Draft copy for every section: Cloudstaff case studies (written to be safe under NDA) and the earlier systems from the resume (MMSU, Black Nazarene Hospital, Bizmates) |
| [POS-INVENTORY-SPEC.md](POS-INVENTORY-SPEC.md) | Full spec for the POS + Inventory demo: features, screens, data model, business rules, seed data |

## Summary of decisions

- **One app, one deploy:** the portfolio and the POS demo live in the same Vite project. The demo
  sits under `/demo/pos` and is lazy-loaded, so it doesn't slow the homepage down.
- **Frontend only, no backend:** demo data lives in the browser (Zustand + localStorage) and can be
  reset with one click. All data access goes through a `services/` layer of async functions, so
  a Laravel API can replace it later without changing any screens.
- **Cloudstaff work is shown as case studies, not code:** we describe the problem, the approach and
  the outcome, illustrated with rebuilt mock UIs that use fake data. No screenshots of real
  systems, no internal URLs, ticket keys or client names.
- **Every system on the resume appears on the site.** The Work section has tabs (All ·
  Cloudstaff · Earlier systems). Payroll, contact tracing, patient records and the document
  repository get full case study pages. POS, inventory, surveys, hospital inventory and the
  Bizmates lessons are cards.
- **The POS demo stands in for the MMSU POS, MMSU inventory and hospital inventory systems.**
  Those were real systems but they aren't public, so this demo is the version people can
  actually click through. Contact tracing and payroll mini demos are optional after launch
  (PLAN.md Phase 6).
