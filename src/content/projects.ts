// Cloudstaff case studies and earlier systems share one shape, so one card and one page template
// serve both. Confidentiality: no source code, internal hostnames, ticket keys, client names,
// real people, real patients or real salaries. Visuals are mock screens or diagrams only.

export type ProjectGroup = 'cloudstaff' | 'earlier'

export interface CaseStudyPage {
  context: string
  problem?: string
  role: string
  approach: string[]
  outcome: string
  visuals: string[]
}

export interface Project {
  slug: string
  title: string
  employer: string
  group: ProjectGroup
  period: string
  stack: string[]
  summary: string
  featured?: boolean
  page?: CaseStudyPage
  demo?: { href: string; label: string }
}

const MMSU = 'Mariano Marcos State University'
const BNH = 'The Black Nazarene Hospital'

export const projects: Project[] = [
  // ---- Cloudstaff --------------------------------------------------------------------------
  {
    slug: 'staffcentral',
    title: 'StaffCentral: time, leave and holidays for ~7,000 staff',
    employer: 'Cloudstaff',
    group: 'cloudstaff',
    period: '2022 – present',
    stack: ['CakePHP 1.3', 'PHP', 'MySQL', 'jQuery', 'Bootstrap', 'Docker'],
    summary:
      'Feature work and maintenance on the internal system staff use every day to track time, file leave, see holidays and correct time logs.',
    featured: true,
    page: {
      context:
        'StaffCentral is the internal system Cloudstaff staff use every day to track time, file leave, see holidays, and correct missed or wrong time logs. It is a large CakePHP 1.3 application that has been in production for years.',
      problem:
        'The business keeps needing new rules (new holiday calendars, new approval steps, country-specific policies), but the codebase is old, has no modern framework conveniences, and any regression lands on thousands of people the same day.',
      role: 'Feature development and maintenance across timesheets, leave, holidays and log corrections, plus HR/Operations reporting.',
      approach: [
        'Built new request-and-approval workflows, such as a holiday calendar request flow with configurable approval routing, following the existing pages so users have nothing new to learn.',
        'Wrote and tuned the SQL behind HR and Operations reports, reworking slow queries on large attendance tables. [Optional: before/after timing if cleared]',
        'Followed a disciplined release path (feature branch → staging QA → UAT → production) with a skeptic code review before every PR.',
        'Modernized page styling one page at a time without touching business logic.',
      ],
      outcome:
        'New policies ship without disrupting day-to-day use, and reports are fast enough for HR to rely on. [Add a cleared outcome if you have one]',
      visuals: ['[Visual: mock holiday calendar request form + approval timeline, fake data]'],
    },
  },
  {
    slug: 'staff-api-migration',
    title: 'Moving a user-management microservice to Laravel 12',
    employer: 'Cloudstaff',
    group: 'cloudstaff',
    period: '2025 – 2026',
    stack: ['Laravel 12', 'PHP', 'MySQL', 'REST', 'Token auth', 'Docker', 'AWS ECS'],
    summary:
      'Ported production endpoints from a legacy CakePHP 3 service to a modern Laravel 12 API with exact behaviour parity, so consumers could switch without rewrites.',
    featured: true,
    page: {
      context:
        'An older CakePHP 3 microservice handled user and staff data for several internal apps. The plan was to retire it and serve the same endpoints from a modern Laravel 12 staff API.',
      problem:
        'Many apps call the old service and some cannot be changed quickly. Any difference in behaviour, even a quirky one, could break a consumer silently.',
      role: 'Ported production endpoints to the new Laravel API and took them through staging, UAT and production.',
      approach: [
        'Behaviour parity first: endpoints match the old responses exactly, edge cases included. Improvements come later as separate changes, never mixed into the port.',
        'Only endpoints actually used in production were ported, which kept the scope honest.',
        'Supported both machine-to-machine and customer-facing (B2C) authentication on the new routes.',
        'Shipped in bundles through staging → UAT → production, each with a rollback plan.',
      ],
      outcome:
        'Consumers moved onto the new API without coordinated rewrites, and the old service can be retired. [Add timing or endpoint count if cleared]',
      visuals: ['[Visual: diagram of apps → gateway → old service vs new service during cutover]'],
    },
  },
  {
    slug: 'phoenix',
    title: 'Phoenix platform (Laravel + Angular)',
    employer: 'Cloudstaff',
    group: 'cloudstaff',
    period: '2022 – present',
    stack: ['Laravel', 'Angular', 'MySQL', 'Docker', 'AWS'],
    summary:
      'API and feature work on a newer staff and admin platform, including decommissioning a legacy integration service.',
    page: {
      context:
        'Phoenix is a newer Cloudstaff platform with Laravel APIs and Angular front ends for staff and admins.',
      role: 'API and feature development, plus migration work, including helping decommission a legacy integration service by moving its responsibilities into the platform API.',
      approach: [
        'Broke the removal into small tickets that each shipped on their own.',
        'Checked staging before every switch.',
        'Kept infrastructure changes to a single coordinated request at the end.',
      ],
      outcome: 'Fewer moving parts in production and one less service to maintain. [Refine]',
      visuals: ['[Visual: before/after service diagram]'],
    },
  },
  {
    slug: 'ai-dev-harness',
    title: 'An AI-assisted development harness',
    employer: 'Cloudstaff (personal tooling)',
    group: 'cloudstaff',
    period: '2025 – present',
    stack: ['Claude Code', 'Skills & subagents', 'Hooks', 'Bash', 'GitHub CLI', 'Jira API'],
    summary:
      'Guardrails, automation and a skeptic review agent that keep AI coding agents inside the team’s branch, release and security rules.',
    featured: true,
    page: {
      context:
        'AI coding agents are fast, but in a multi-repo team with strict release rules, speed without guardrails creates risk: commits on the wrong branch, PRs to the wrong environment, unreviewed changes.',
      role: 'Designed and built it for my own daily work across three codebases.',
      approach: [
        'Always-on rules: branch guards, PR target defaults, no secrets, no raw SQL concatenation, Docker-only execution.',
        'Skills: per-framework convention guides (CakePHP 1.3, CakePHP 3, Laravel 12) that load automatically, plus analysis, testing and secure-coding checklists.',
        'Commands: one-step workflows for PRs, staged deploys, ticket updates, database lookups and time logging, each with points where a human must decide.',
        'A skeptic reviewer agent that assumes bugs exist and must cite file and line evidence for every “this still works” claim.',
        'A session diary that records what was done and why, so context carries across days.',
      ],
      outcome:
        'Faster delivery on routine work, while merges into shared environments still need an explicit human go-ahead. [Add your own observation]',
      visuals: ['[Visual: request → rules/skills → agent → reviewer → PR → human merge gate]'],
    },
  },
  {
    slug: 'automation-qa',
    title: 'Automation and QA: n8n workflows and Playwright',
    employer: 'Cloudstaff',
    group: 'cloudstaff',
    period: '2023 – present',
    stack: ['n8n', 'Playwright', 'MySQL', 'REST'],
    summary:
      'Workflow automation for business and dev chores, including a read-only data proxy, plus end-to-end tests for critical flows.',
    page: {
      context: 'Repetitive checks and manual QA were slowing down releases.',
      role: 'Built the automations and the end-to-end test suites.',
      approach: [
        'n8n workflows that automate business and development chores, including a read-only query proxy so developers can check staging and production data without direct database access.',
        'Playwright end-to-end tests for critical user flows, run before releases.',
      ],
      outcome: 'Less manual checking and safer data access. [Add an example if you have one]',
      visuals: ['[Visual: n8n workflow diagram with generic node names]'],
    },
  },
  {
    slug: 'legacy-ui-modernization',
    title: 'Modernizing legacy pages to a design system',
    employer: 'Cloudstaff',
    group: 'cloudstaff',
    period: '2025 – 2026',
    stack: ['CSS', 'Bootstrap 3', 'Design system'],
    summary:
      'Reskinned old Bootstrap 3 pages to the current design system, one page at a time, without touching behaviour.',
    page: {
      context:
        'Older pages used Bootstrap 3 with Material styling and looked out of place next to the current design system.',
      role: 'Planned and carried out the reskin.',
      approach: [
        'A scoped stylesheet per page, so each change is isolated and easy to review.',
        'No changes to markup logic or behaviour, so every page can ship on its own.',
      ],
      outcome: 'A consistent look across old and new pages without a risky rewrite.',
      visuals: ['[Visual: before/after split of a mock page, fake data]'],
    },
  },

  // ---- Earlier systems ---------------------------------------------------------------------
  {
    slug: 'mmsu-pos',
    title: 'Point of Sale',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: ['Laravel', 'Vue', 'React', 'MySQL'],
    summary:
      'A point-of-sale system for [which unit: e.g. university store / canteen / press]. The live demo is a clean-room rebuild of the same idea.',
    demo: { href: '/demo/pos/register', label: 'Try the POS demo' },
  },
  {
    slug: 'mmsu-inventory',
    title: 'Inventory',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: ['Laravel', 'Vue', 'React', 'MySQL'],
    summary:
      'Inventory tracking for [what: supplies / store goods / equipment], with stock in and out and [reports / low-stock alerts / requisitions].',
    demo: { href: '/demo/pos/inventory/products', label: 'Try the inventory demo' },
  },
  {
    slug: 'mmsu-payroll',
    title: 'Payroll',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: ['Laravel', '[Vue or React]', 'MySQL'],
    summary: 'Payroll computation and payslips for [which staff: e.g. job-order / contractual / all employees].',
    featured: true,
    page: {
      context: '[Which staff it covered and roughly how many]',
      problem: '[What it replaced: e.g. computing payroll in spreadsheets each cut-off]',
      role: '[Sole developer? Backend? Full-stack?]',
      approach: [
        '[Key features: attendance import? deductions? payslips? reports for accounting?]',
        'Kept calculation rules [configurable / in code] so [rate changes] did not need a rewrite.',
      ],
      outcome: '[e.g. payroll prep went from days to hours. Only if true.]',
      visuals: ['[Visual: mock payslip and payroll summary with fictional employees]'],
    },
  },
  {
    slug: 'mmsu-document-repository',
    title: 'Document repository',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: ['Laravel', '[Vue or React]', 'MySQL'],
    summary: 'A searchable home for [which documents: memos, records, forms] across [which offices].',
    page: {
      context: '[Which office(s) stored what: memos, records, forms?]',
      problem: '[Paper files or shared drives that were hard to search?]',
      role: '[Your role]',
      approach: ['[Upload, categories/tags, search, access by office/role, versioning?]'],
      outcome: '[Faster retrieval, fewer lost documents. Only if true.]',
      visuals: ['[Visual: mock document list with filters and a detail panel, fictional files]'],
    },
  },
  {
    slug: 'mmsu-contact-tracing',
    title: 'COVID-19 contact tracing',
    employer: MMSU,
    group: 'earlier',
    period: '2020 – 2021',
    stack: ['Laravel', '[Vue or React]', 'MySQL'],
    summary: 'Built during the pandemic so the university could [log campus entry / trace exposure].',
    featured: true,
    page: {
      context: 'Built during the pandemic so the university could [log campus entry / trace exposure].',
      problem: '[Paper logbooks at gates were slow, unreadable, and unsafe to share?]',
      role: '[Your role]',
      approach: [
        '[QR codes per person? Gate check-in? Exposure lookup by date and area? Health declaration form?]',
      ],
      outcome: '[Used at N entry points / by N people. Only if known.]',
      visuals: ['[Visual: mock check-in screen + trace results]'],
    },
  },
  {
    slug: 'bnh-patient-records',
    title: 'Patient records',
    employer: BNH,
    group: 'earlier',
    period: '2019',
    stack: ['Laravel', 'React', 'MySQL'],
    summary: 'Replaced paper-based patient records for [which departments: OPD, admissions, records section].',
    page: {
      context: '[Which departments used it: OPD, admissions, records section?]',
      problem: '[Paper charts, slow retrieval, duplicate records?]',
      role: '[Your role]',
      approach: ['[Patient registration, visit history, search, role-based access?]'],
      outcome:
        'Better data management and day-to-day efficiency for hospital staff. [Add specifics if you have them]',
      visuals: ['[Visual: record-flow diagram + one mock patient profile, fictional patient only]'],
    },
  },
  {
    slug: 'bnh-patient-surveys',
    title: 'Patient surveys',
    employer: BNH,
    group: 'earlier',
    period: '2019',
    stack: ['Laravel', 'React', 'MySQL'],
    summary:
      'A survey system for [patient satisfaction / health screening], with [results reports for management].',
  },
  {
    slug: 'bnh-inventory',
    title: 'Hospital inventory',
    employer: BNH,
    group: 'earlier',
    period: '2019',
    stack: ['Laravel', 'React', 'MySQL'],
    summary:
      'Inventory for [medical supplies / pharmacy / general supplies]. The stock ledger, reorder levels and stock-in ideas behind it are what the live inventory demo shows.',
    demo: { href: '/demo/pos/inventory/movements', label: 'See the stock ledger demo' },
  },
  {
    slug: 'bizmates-lessons',
    title: 'Web classroom lessons',
    employer: 'Bizmates Philippines',
    group: 'earlier',
    period: '2022',
    stack: ['Nuxt.js', 'Laravel', 'HTML/CSS'],
    summary:
      'Turned PDF lesson materials into structured, reusable HTML/CSS for a web classroom platform, responsive and consistent across devices.',
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
