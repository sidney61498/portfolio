// The AI development harness, described at the level of design, not internals: no hostnames,
// credentials, ticket keys or repository names. Numbers come from the harness repo itself.

export const harness = {
  title: 'An AI-assisted development harness',
  tagline: 'Guardrails, automation and a skeptic reviewer that keep AI coding agents inside a team’s real release rules.',
  intro:
    'AI coding agents are fast, but in a multi-repo team with strict release rules, speed without guardrails creates risk: commits on the wrong branch, PRs to the wrong environment, merges nobody approved. I built a harness on top of Claude Code that makes the agent work the way the team does, across three codebases on three different stacks.',
  stats: [
    { value: 32, label: 'slash commands' },
    { value: 9, label: 'skills' },
    { value: 13, label: 'deterministic scripts' },
    { value: 12, label: 'Playwright QA specs' },
  ],
}

export interface Primitive {
  name: string
  trigger: string
  useFor: string
  icon: 'rules' | 'skill' | 'command' | 'agent' | 'hook' | 'script'
}

/** The layout rule of the harness: each piece lives where its trigger and context needs say. */
export const primitives: Primitive[] = [
  { name: 'Always-on rules', trigger: 'Loaded every session', useFor: 'Non-negotiables that must never be missed: branch guards, PR targets, no secrets.', icon: 'rules' },
  { name: 'Skills', trigger: 'The agent recognises the situation', useFor: 'Framework conventions per codebase, analysis, testing, secure coding, incident investigation.', icon: 'skill' },
  { name: 'Commands', trigger: 'I start them on purpose', useFor: 'Deploys, PRs, ticket updates, database lookups, time logging, status boards.', icon: 'command' },
  { name: 'Reviewer agent', trigger: 'Delegated, in its own context', useFor: 'A skeptic review that never saw the code being written, so it doesn’t share the author’s blind spots.', icon: 'agent' },
  { name: 'Hooks', trigger: 'Automatic on events', useFor: 'Injecting recent session history at startup so work carries across days.', icon: 'hook' },
  { name: 'Scripts', trigger: 'Called by the above', useFor: 'Anything that must be exact: API calls, auth, repo detection, parsing. Never improvised by the model.', icon: 'script' },
]

export const guardrails = [
  { rule: 'Branch guard before every commit', detail: 'The current branch must match the ticket. Shared branches can never be committed to directly.' },
  { rule: 'PRs target staging by default', detail: 'Other environments only when I name them in the same request, even if an earlier PR went elsewhere.' },
  { rule: 'Merging needs an explicit go-ahead', detail: 'Opening and approving a PR is automatic. Merging into a shared environment never is: “continue” is not consent.' },
  { rule: 'Code runs where production runs', detail: 'All PHP runs inside Docker containers, never on the host machine.' },
  { rule: 'Secrets stay out of reach', detail: 'Environment files are off limits to the agent; scripts load credentials themselves and never print them.' },
  { rule: 'Secure-coding baseline', detail: 'Parameterized queries only, server-side validation, no mass assignment, no stack traces or secrets in logs.' },
]

export interface PipelineStep {
  label: string
  detail: string
  gate?: boolean
}

export const pipeline: PipelineStep[] = [
  { label: 'Ticket', detail: 'Fetch the ticket and its acceptance criteria' },
  { label: 'Analyze', detail: 'Code flow, blast radius and an AC challenge pass' },
  { label: 'Build', detail: 'Stack conventions load automatically' },
  { label: 'Review', detail: 'Skeptic agent cites file:line for every claim' },
  { label: 'PR', detail: 'Opened against staging and approved' },
  { label: 'Staging', detail: 'QA, then UAT', gate: true },
  { label: 'Production', detail: 'Release bundle with a rollback plan', gate: true },
]

export const commandGroups = [
  { name: 'Ship', items: ['/commit', '/pr', '/deploy:staging', '/deploy:uat', '/deploy:prod'] },
  { name: 'Tickets', items: ['/ticket:new', '/ticket:update', '/jira:comment', '/jira:transition', '/jira:worklog'] },
  { name: 'Data', items: ['/db:local', '/db:stage', '/db:prod', '/db:schema'] },
  { name: 'Status', items: ['/status:board', '/status:gap', '/status:prod', '/status:ci'] },
  { name: 'Time', items: ['/time:today', '/time:week', '/time:propose', '/time:submit'] },
  { name: 'Session', items: ['/handoff', '/huddle', '/retro', '/break-test'] },
]

export interface TerminalLine {
  kind: 'prompt' | 'ok' | 'info' | 'gate' | 'out'
  text: string
}

/** Simulated sessions for the animated terminal. Illustrative, with generic names. */
export const terminalSessions: TerminalLine[][] = [
  [
    { kind: 'prompt', text: '/deploy:staging' },
    { kind: 'ok', text: 'Branch guard: on feature/holiday-requests, matches the ticket' },
    { kind: 'ok', text: 'Trial merge into staging: no conflicts' },
    { kind: 'ok', text: 'Reviewer agent: 0 blocking findings, every claim cited file:line' },
    { kind: 'ok', text: 'PR opened against staging and approved' },
    { kind: 'gate', text: 'Merge waits for your explicit go-ahead' },
  ],
  [
    { kind: 'prompt', text: '/status:gap' },
    { kind: 'info', text: 'Comparing where each ticket’s code is with its tracker status…' },
    { kind: 'out', text: '2 tickets marked “Ready for UAT” are not on the UAT branch yet' },
    { kind: 'out', text: '1 ticket is in production but still marked “In QA”' },
    { kind: 'ok', text: 'Report only: nothing in the tracker changes' },
  ],
  [
    { kind: 'prompt', text: '/time:propose' },
    { kind: 'info', text: 'Reading the session diary…' },
    { kind: 'out', text: 'Drafted 8h across 4 tickets from 11 diary entries' },
    { kind: 'gate', text: 'Proposal ready, nothing posted until you approve it' },
  ],
]

export const evolution = [
  {
    version: 'v1',
    title: 'Instruction files for GitHub Copilot',
    text: 'Started as a set of instruction files and skills. Useful, but everything was one primitive, tables were copy-pasted between workflows, and broken pieces only showed up at use time.',
  },
  {
    version: 'v2',
    title: 'Rebuilt natively for Claude Code',
    text: 'Split by who triggers each piece and whether it needs its own context. One script owns the repo facts, a validator checks every skill and command, and an idempotent installer with a manifest and dry-run mode makes setup safe to repeat.',
  },
]

export const lessons = [
  'Rules written after a real mistake keep their exact wording. Rephrasing them for style tends to lose the edge case they exist for.',
  'Anything that must be exact belongs in a script, not in a prompt.',
  'A reviewer that didn’t write the code catches what self-review misses. Making it cite evidence turns “looks fine” into something checkable.',
  'The agent is fastest when every irreversible step has a clear human gate, because everything else can then run without asking.',
]
