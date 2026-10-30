# Content Draft

Copy for every section, written for recruiters and hiring managers. `[brackets]` mark things only
you can fill in. **Don't invent numbers.** If a metric isn't on your resume or cleared with
Cloudstaff, describe it without a figure.

This text moves into `src/content/*.ts` during Phase 1.

---

## Hero

**Sidney Medrano**
Senior Software Engineer · Laravel · React · Vue · Angular

> I build and maintain the internal systems companies run on: time tracking, HR workflows,
> APIs and the automation around them. Five-plus years, most of it on software real people use
> every day.

Buttons: **View my work** · **Try the POS demo** · **Download resume**
Small line under the buttons: *Ilocos Norte, Philippines · Open to remote*

---

## About

I'm a full-stack engineer at Cloudstaff, where I work on StaffCentral, the system about 7,000
staff use to log time, file leave, and request corrections. A lot of my job is careful work on a
large legacy codebase: adding features without breaking what people depend on, speeding up slow
queries, and moving pieces onto newer stacks when it makes sense.

Before Cloudstaff I built internal systems at Mariano Marcos State University, including POS,
inventory, payroll, a document repository and COVID-19 contact tracing. Before that I built
hospital systems for patient records and inventory. I like the unglamorous parts: approval
flows, reports that HR actually trusts, and making sure the numbers add up.

These days I also spend time on AI-assisted development: building guardrails and automation so
AI agents help with coding, review and documentation without cutting corners.

**Quick facts**
- 5+ years building production web apps
- Maintains a system used by ~7,000 staff
- BS Computer Science, *cum laude*, Mariano Marcos State University
- Certifications/trainings: Visual Graphics Design NC III, GitHub, AWS

---

## Skills

| Group | Items |
|---|---|
| Backend | Laravel (incl. 12), CakePHP (1.3 / 3.x), PHP, REST API design, authentication |
| Frontend | React, Vue, Angular, Nuxt, jQuery, Tailwind CSS, Bootstrap |
| Data | MySQL, query optimization, reporting |
| DevOps & tools | Docker, AWS, Git/GitHub, GitHub Actions, n8n |
| Quality | Playwright E2E, code review, staged releases (staging → UAT → production) |
| AI-assisted dev | Claude Code, GitHub Copilot, custom agents, skills and guardrails |

---

## Featured work: Cloudstaff case studies

> Template for each one: **Context → Problem → My role → Approach → Outcome → Stack.**
> Visuals are mock UIs with fake data or diagrams, never real screenshots.

### 1. StaffCentral: time, leave and holidays for ~7,000 staff

**Context.** StaffCentral is the internal system Cloudstaff staff use every day to track time,
file leave, see holidays, and correct missed or wrong time logs. It's a large CakePHP 1.3
application that has been in production for years.

**Problem.** The business keeps needing new rules (new holiday calendars, new approval steps,
country-specific policies), but the codebase is old, has no modern framework conveniences, and
any regression lands on thousands of people the same day.

**My role.** Feature development and maintenance across timesheets, leave, holidays and log
corrections, plus HR/Operations reporting.

**Approach.**
- Built new request-and-approval workflows (for example, a holiday calendar request flow with
  configurable approval routing) that follow the existing pages' patterns, so users don't have to
  learn anything new.
- Wrote and tuned the SQL behind HR and Operations reports, reworking slow queries on large
  attendance tables. `[optional: before/after timing if cleared]`
- Followed a disciplined release path (feature branch → staging QA → UAT → production) with a
  skeptic code review before every PR.
- Modernized page styling incrementally (see case study 6) without touching business logic.

**Outcome.** New policies ship without disrupting day-to-day use, and the reports are fast enough
for HR to rely on. `[add a cleared outcome if you have one]`

**Stack.** CakePHP 1.3, PHP, MySQL, jQuery, Bootstrap, Docker

**Visual.** A mock "Request Holiday Calendar Change" form plus an approval timeline (fake data).

---

### 2. Moving a user-management microservice to Laravel 12

**Context.** An older CakePHP 3 microservice handled user and staff data for several internal
apps. The plan was to retire it and serve the same endpoints from a modern Laravel 12 staff API.

**Problem.** Many apps call the old service, and some of them can't be changed quickly. Any
difference in behaviour, even a quirky one, could break a consumer silently.

**My role.** Ported production endpoints to the new Laravel API and took them through staging,
UAT and production.

**Approach.**
- **Behaviour parity first:** endpoints were ported to match the old responses exactly, including
  edge cases. Improvements came afterwards as separate changes, not mixed into the port.
- Only endpoints actually used in production were ported, which kept the scope honest.
- Supported both machine-to-machine and customer-facing (B2C) authentication on the new routes.
- Shipped in bundles through staging → UAT → production, with a rollback plan for each release.

**Outcome.** Consumers moved onto the new API without coordinated rewrites, and the old service
can be retired. `[add timing/endpoint count if cleared]`

**Stack.** Laravel 12, PHP, MySQL, REST, OAuth/JWT-style tokens, Docker, AWS (ECS)

**Visual.** A diagram of apps → API gateway → old service vs new service during the cutover.

---

### 3. Phoenix platform (Laravel + Angular)

**Context.** Phoenix is a newer Cloudstaff platform with Laravel APIs and Angular front ends for
staff and admins.

**My role.** API and feature development, plus migration work. This included helping decommission
a legacy integration service by moving its responsibilities into the platform's own API.

**Approach.** Broke the removal into small tickets that each shipped on their own, checked
staging before each switch, and kept infrastructure changes to a single coordinated request at
the end.

**Outcome.** Fewer moving parts in production and one less service to maintain. `[refine]`

**Stack.** Laravel, Angular, MySQL, Docker, AWS

---

### 4. An AI-assisted development harness

**Context.** AI coding agents are fast, but in a multi-repo team with strict release rules,
speed without guardrails creates risk: commits on the wrong branch, PRs to the wrong
environment, unreviewed changes.

**What I built.** A personal development harness on top of Claude Code that makes the AI work
inside the team's rules:
- **Always-on rules:** branch guards, PR target defaults, a ban on secrets and raw SQL
  concatenation, and Docker-only execution.
- **Skills:** per-framework convention guides (CakePHP 1.3, CakePHP 3, Laravel 12) that load
  automatically when the agent touches that codebase, plus analysis, testing and secure-coding
  checklists.
- **Commands:** one-step workflows for PRs, staged deploys, ticket updates, database lookups and
  time logging, each with confirmation points where a human must decide.
- **A skeptic reviewer agent** that assumes bugs exist and has to cite file and line evidence for
  every "this still works" claim.
- **A session diary** that records what was done and why, so context carries across days.

**Outcome.** Faster delivery on routine work, with merges into shared environments still
requiring an explicit human go-ahead. `[add your own observation]`

**Stack.** Claude Code (skills, commands, subagents, hooks), Bash, GitHub CLI, Jira API

**Visual.** A diagram: request → rules/skills → agent → reviewer → PR → human merge gate.

---

### 5. Automation and QA: n8n workflows and Playwright

- Built **n8n** workflows that automate business and development chores, including a read-only
  query proxy so developers can check staging and production data without direct database access.
- Wrote **Playwright** end-to-end tests for critical user flows, run before releases.

**Stack.** n8n, Playwright, MySQL, REST

---

### 6. Modernizing legacy pages to a design system

**Problem.** Older pages used Bootstrap 3 with Material styling and looked out of place next to
the company's current design system.

**Approach.** Reskinned pages one at a time with a scoped stylesheet per page and no changes to
markup logic or behaviour, so each page could be reviewed and shipped on its own.

**Outcome.** A consistent look across old and new pages without a risky rewrite.

**Stack.** CSS, Bootstrap 3, Cloudstaff Design System

**Visual.** A before/after split of a mock page (fake data).

---

## Earlier systems

> Facts below come only from your resume. Everything in `[brackets]` is a question only you can
> answer. Fill those in and delete any line you can't back up. A short honest card beats a long
> padded one.
>
> Each card shows: **title · employer · years · stack · 1–2 sentence summary · link**
> (case study page, live demo, or none).

### Mariano Marcos State University · Computer Programmer I · 2019–2022

Section intro:
> At MMSU I was one of the developers behind the university's internal systems. I built them
> full-stack with Laravel and Vue, and moved newer ones to React. I also trained the staff who
> used them and supported them after launch.

#### Point of Sale → links to the live POS demo
**Summary:** A point-of-sale system for `[which unit: e.g. university store / canteen / press]`,
built with Laravel and `[Vue/React]`. The live demo is a clean-room rebuild of the same idea.
- `[What it replaced: manual receipts? spreadsheets?]`
- `[Who used it / how many terminals or cashiers]`

#### Inventory → links to the POS demo's inventory module
**Summary:** Inventory tracking for `[what: supplies / store goods / equipment]`, with stock in and
out and `[reports / low-stock alerts / requisitions?]`.

#### Payroll (case study page)
- **Context:** `[Which staff it covered: e.g. job-order / contractual / all employees; roughly how many]`
- **Problem:** `[What it replaced: e.g. computing payroll in spreadsheets each cut-off]`
- **My role:** `[Sole developer? Backend? Full-stack?]`
- **Approach:** `[Key features: attendance import? deductions? payslips? reports for accounting?]`
  Kept calculation rules `[configurable / in code]` so `[rate changes]` didn't need a rewrite.
- **Outcome:** `[e.g. payroll prep went from days to hours. Only if true.]`
- **Stack:** Laravel, `[Vue/React]`, MySQL
- **Visual:** Mock payslip and payroll summary with fictional employees. Link to `/demo/payroll`
  if Phase 6 is built.

#### Document repository (case study page)
- **Context:** `[Which office(s) stored what: memos, records, forms?]`
- **Problem:** `[Paper files / shared drives that were hard to search?]`
- **Approach:** `[Upload, categories/tags, search, access by office/role, versioning?]`
- **Outcome:** `[Faster retrieval, fewer lost documents. Only if true.]`
- **Stack:** Laravel, `[Vue/React]`, MySQL, `[file storage used]`
- **Visual:** Mock document list with filters and a document detail panel (fictional files).

#### COVID-19 contact tracing (case study page)
- **Context:** Built during the pandemic so the university could `[log campus entry / trace exposure]`.
- **Problem:** `[Paper logbooks at gates were slow, unreadable, and unsafe to share]`
- **Approach:** `[QR codes per person? Gate check-in? Exposure lookup by date and area? Health declaration form?]`
- **Outcome:** `[Used at N entry points / by N people. Only if known.]`
- **Stack:** Laravel, `[Vue/React]`, MySQL
- **Visual:** Mock check-in screen + trace results. Link to `/demo/contact-tracing` if Phase 6 is built.

Shared line for all MMSU systems (from your resume):
> I also automated administrative processes, trained users, and handled support, fixes and
> enhancements after each system went live.

---

### The Black Nazarene Hospital, Inc. · IT Staff · 2019

Section intro:
> My first developer job was at a hospital, building systems that replaced paper records, using
> Laravel and React. I also trained staff so the new systems were actually adopted.

#### Patient records (case study page)
- **Context:** `[Which departments used it: OPD, admissions, records section?]`
- **Problem:** `[Paper charts, slow retrieval, duplicate records?]`
- **Approach:** `[Patient registration, visit history, search, role-based access?]`
- **Outcome:** Better data management and day-to-day efficiency (from your resume).
  `[add specifics if you have them]`
- **Stack:** Laravel, React, MySQL
- **Visual:** Diagram of the record flow plus one mock patient-profile screen. **Fictional patient only.**

#### Patient surveys (card)
**Summary:** A survey system for `[patient satisfaction / health screening]`, with
`[results reports for management]`. Laravel + React.

#### Hospital inventory (card → POS demo inventory module)
**Summary:** Inventory for `[medical supplies / pharmacy / general supplies]`. The ideas behind
it (stock ledger, reorder levels, stock-in from suppliers) are what the live inventory demo
shows.

---

### Bizmates Philippines Inc. · Software Engineer I · 2022

#### Web classroom lessons (card + sample)
**Summary:** Turned PDF lesson materials into structured, reusable HTML/CSS for a web-based
classroom platform. Built front-end features in Nuxt.js with Laravel on the backend, and kept
lessons consistent and responsive across devices.
- **Sample:** One rebuilt lesson layout with your own placeholder text (not Bizmates content),
  so visitors can see the reusable components in action.

---

## POS + Inventory demo (showcase card)

**Tindahan POS: a point-of-sale and inventory system you can try**

I built POS and inventory systems at Mariano Marcos State University, and inventory for a
hospital. Those are private, so this is a clean-room version you can click through: ring up a
sale, watch stock update in the ledger, switch to Manager and void it.

- Barcode-ready register with VAT-inclusive receipts
- Stock ledger with every change traceable
- Roles, voids and refunds, reports and CSV export
- React · TypeScript · Tailwind · daisyUI · Zustand · tested with Vitest + Playwright

Buttons: **Open the demo** · **View source**

---

## Experience

**Cloudstaff Modern Workforce Inc.** · Senior Software Engineer I · Jul 2022 – Present
- Develop and maintain StaffCentral (~7,000 users): time tracking, leave, holidays, log corrections
- Build HR/Operations reporting; maintain legacy CakePHP 1.3 applications
- Contribute to Phoenix (Laravel + Angular): APIs, features, migration work; also React and Vue
- Optimize SQL and application performance for large data sets
- Build n8n automations; use AI agents for coding, docs and BA/PO workflows; Playwright E2E

**Bizmates Philippines Inc.** · Software Engineer I · Jan 2022 – Jul 2022
- Turned PDF lesson material into reusable HTML/CSS for a web classroom platform
- Built frontend features in Nuxt.js with Laravel on the backend

**Mariano Marcos State University** · Computer Programmer I · Sep 2019 – Jan 2022
- Built and maintained POS, inventory, payroll, document repository and COVID-19 contact tracing systems
- Laravel + Vue, with newer systems in React; trained users and supported deployed apps

**The Black Nazarene Hospital, Inc.** · IT Staff · Mar 2019 – Sep 2019
- Built systems for patient records, surveys and inventory (Laravel, React); staff training and support

**Education:** BS Computer Science, *cum laude*, Mariano Marcos State University (2014–2018)

---

## Contact

> Have a role or a project in mind? Email is the fastest way to reach me.

- Email: sidney.medrano61498@gmail.com (with a copy-to-clipboard button)
- LinkedIn: `[url]` · GitHub: `[url]`
- Resume: `/resume.pdf`
- *References available on request.* (Don't publish the references' phone numbers or emails.)

---

## SEO / meta

- **Title:** Sidney Medrano | Senior Software Engineer (Laravel, React)
- **Description:** Full-stack engineer with 5+ years building internal systems, APIs and
  automation. Case studies and a working POS + inventory demo.
- **OG image:** name + title + a cropped POS screenshot, 1200×630
