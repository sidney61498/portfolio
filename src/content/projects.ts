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
const MMSU_STACK = ['Laravel', 'Vue', 'MySQL']
const BNH_STACK = ['Laravel', 'React']

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
        'Wrote and tuned the SQL behind HR and Operations reports, reworking slow queries on large attendance tables.',
        'Followed a disciplined release path (feature branch → staging QA → UAT → production) with a skeptic code review before every PR.',
        'Modernized page styling one page at a time without touching business logic.',
      ],
      outcome:
        'New policies ship without disrupting day-to-day use, and HR and Operations get reports they can rely on.',
      visuals: [],
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
        'Ported endpoints run in production behind the same contracts, so consumers can switch without rewrites and the old service can be retired.',
      visuals: [],
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
      outcome: 'Moves the platform toward fewer moving parts in production and one less service to maintain.',
      visuals: [],
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
        'Routine work such as PRs, staged deploys, ticket updates and time logs takes one command, while merges into shared environments still need an explicit human go-ahead.',
      visuals: [],
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
      outcome: 'Less manual checking before releases, and data checks without handing out database credentials.',
      visuals: [],
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
      visuals: [],
    },
  },

  // ---- Earlier systems ---------------------------------------------------------------------
  // Facts come from the resume only: no numbers, outcomes or features it doesn't support.
  {
    slug: 'mmsu-pos',
    title: 'Point of Sale',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: MMSU_STACK,
    summary:
      'A point-of-sale system I built and maintained for the university. The live demo is a clean-room rebuild of the same idea.',
    demo: { href: '/demo/pos/register', label: 'Try the POS demo' },
  },
  {
    slug: 'mmsu-inventory',
    title: 'Inventory',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: MMSU_STACK,
    summary:
      'Inventory tracking for the university: stock coming in and going out, so on-hand counts stay accurate.',
    demo: { href: '/demo/pos/inventory/products', label: 'Try the inventory demo' },
  },
  {
    slug: 'mmsu-payroll',
    title: 'Payroll',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: MMSU_STACK,
    summary: 'Payroll computation for university staff, turning a rule-heavy manual task into a repeatable process.',
    featured: true,
    page: {
      context:
        'An internal payroll system for Mariano Marcos State University, one of several administrative systems I built and maintained there.',
      problem:
        'Payroll is repetitive, rule-heavy work where a small mistake affects someone’s pay. The goal was to automate the routine computation and cut manual effort.',
      role: 'Full-stack developer: Laravel backend, Vue frontend and MySQL database, plus user training and support after launch.',
      approach: [
        'Turned the payroll rules into code, so every run computes pay and deductions the same way.',
        'Trained the staff who run payroll and handled support, fixes and enhancements after go-live.',
      ],
      outcome: 'Payroll computation became a repeatable, automated process instead of manual work.',
      visuals: [],
    },
  },
  {
    slug: 'mmsu-document-repository',
    title: 'Document repository',
    employer: MMSU,
    group: 'earlier',
    period: '2019 – 2022',
    stack: MMSU_STACK,
    summary: 'One central, searchable place to store and find the university’s documents.',
    page: {
      context: 'An internal document repository for Mariano Marcos State University.',
      problem: 'Documents kept in scattered files are slow to find and easy to lose.',
      role: 'Full-stack developer (Laravel, Vue, MySQL), plus user training and support.',
      approach: [
        'Stored documents in one place, together with the details needed to find them again.',
        'Trained users and kept improving the system after launch.',
      ],
      outcome: 'One place to look for documents instead of many.',
      visuals: [],
    },
  },
  {
    slug: 'mmsu-contact-tracing',
    title: 'COVID-19 contact tracing',
    employer: MMSU,
    group: 'earlier',
    period: '2020 – 2021',
    stack: MMSU_STACK,
    summary:
      'Built during the pandemic so the university could keep a record of who was on campus and trace possible exposure.',
    featured: true,
    page: {
      context:
        'Built during the COVID-19 pandemic, when the university needed a reliable record of who had been on campus.',
      problem:
        'Contact tracing only works if visit records are complete and can be searched quickly when someone tests positive.',
      role: 'Full-stack developer (Laravel, Vue, MySQL), plus training and support for the staff using it.',
      approach: [
        'Recorded campus visits in a database, so they could be searched instead of read through by hand.',
        'Made it possible to look up who may have been in contact with a positive case.',
      ],
      outcome: 'A searchable record of campus visits at a time when tracing speed mattered.',
      visuals: [],
    },
  },
  {
    slug: 'bnh-patient-records',
    title: 'Patient records',
    employer: BNH,
    group: 'earlier',
    period: '2019',
    stack: BNH_STACK,
    summary: 'Patient records management for the hospital, built in my first developer role.',
    page: {
      context: 'The Black Nazarene Hospital needed better management of its patient records. This was my first developer role.',
      problem: 'Patient information has to be accurate, quick to find and kept private.',
      role: 'Developer (Laravel, React), plus IT support and system training for hospital staff.',
      approach: [
        'Kept patient records in one system, so staff could find a patient’s information quickly.',
        'Trained hospital staff so the new system was actually adopted.',
      ],
      outcome: 'Better data management and day-to-day efficiency for hospital staff.',
      visuals: [],
    },
  },
  {
    slug: 'bnh-patient-surveys',
    title: 'Patient surveys',
    employer: BNH,
    group: 'earlier',
    period: '2019',
    stack: BNH_STACK,
    summary: 'A system for running the hospital’s patient surveys and keeping the responses in one place.',
  },
  {
    slug: 'bnh-inventory',
    title: 'Hospital inventory',
    employer: BNH,
    group: 'earlier',
    period: '2019',
    stack: BNH_STACK,
    summary:
      'Inventory for the hospital’s supplies. The stock ledger, reorder levels and stock-in ideas behind it are what the live inventory demo shows.',
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
