import {
  Bot,
  ChartColumn,
  Cloud,
  Gauge,
  GitPullRequest,
  KeyRound,
  Rocket,
  ShieldCheck,
  Sparkles,
  TestTubeDiagonal,
  Webhook,
  Database,
  LayoutTemplate,
  Server,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import {
  siAngular,
  siBootstrap,
  siCakephp,
  siClaude,
  siDocker,
  siGit,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siJquery,
  siLaravel,
  siMysql,
  siN8n,
  siNuxt,
  siPhp,
  siReact,
  siTailwindcss,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons'

/** A brand logo (simple-icons) or a generic line icon (lucide) for skills without a logo. */
export type SkillIcon = { brand: SimpleIcon } | { line: LucideIcon }

export interface Skill {
  name: string
  icon: SkillIcon
  /** The resume's "Core Stack": highlighted as daily drivers. */
  core?: boolean
}

export interface SkillGroup {
  name: string
  blurb: string
  icon: LucideIcon
  items: Skill[]
  /** Layout hint for the bento grid. */
  size: 'half' | 'third' | 'full'
}

const brand = (icon: SimpleIcon): SkillIcon => ({ brand: icon })
const line = (icon: LucideIcon): SkillIcon => ({ line: icon })

export const skillGroups: SkillGroup[] = [
  {
    name: 'Backend',
    blurb: 'APIs, auth and the business rules behind them.',
    icon: Server,
    size: 'half',
    items: [
      { name: 'Laravel', icon: brand(siLaravel), core: true },
      { name: 'CakePHP 1.3 / 3.x', icon: brand(siCakephp), core: true },
      { name: 'PHP', icon: brand(siPhp) },
      { name: 'REST API design', icon: line(Webhook) },
      { name: 'Authentication', icon: line(KeyRound) },
    ],
  },
  {
    name: 'Frontend',
    blurb: 'Interfaces people use every working day.',
    icon: LayoutTemplate,
    size: 'half',
    items: [
      { name: 'React', icon: brand(siReact), core: true },
      { name: 'Vue', icon: brand(siVuedotjs), core: true },
      { name: 'Angular', icon: brand(siAngular), core: true },
      { name: 'jQuery', icon: brand(siJquery), core: true },
      { name: 'Nuxt', icon: brand(siNuxt) },
      { name: 'Tailwind CSS', icon: brand(siTailwindcss) },
      { name: 'Bootstrap', icon: brand(siBootstrap) },
    ],
  },
  {
    name: 'Data',
    blurb: 'Queries and reports that stay fast at scale.',
    icon: Database,
    size: 'third',
    items: [
      { name: 'MySQL', icon: brand(siMysql) },
      { name: 'Query optimization', icon: line(Gauge) },
      { name: 'Reporting', icon: line(ChartColumn) },
    ],
  },
  {
    name: 'DevOps & tools',
    blurb: 'Containers, cloud and the pipeline around the code.',
    icon: Wrench,
    size: 'third',
    items: [
      { name: 'Docker', icon: brand(siDocker) },
      { name: 'AWS', icon: line(Cloud) },
      { name: 'Git', icon: brand(siGit) },
      { name: 'GitHub', icon: brand(siGithub) },
      { name: 'GitHub Actions', icon: brand(siGithubactions) },
      { name: 'n8n', icon: brand(siN8n) },
    ],
  },
  {
    name: 'Quality',
    blurb: 'Catching problems before users do.',
    icon: ShieldCheck,
    size: 'third',
    items: [
      { name: 'Playwright E2E', icon: line(TestTubeDiagonal) },
      { name: 'Code review', icon: line(GitPullRequest) },
      { name: 'Staged releases', icon: line(Rocket) },
    ],
  },
  {
    name: 'AI-assisted development',
    blurb: 'Agents that speed up the work without skipping the rules.',
    icon: Sparkles,
    size: 'full',
    items: [
      { name: 'Claude Code', icon: brand(siClaude) },
      { name: 'GitHub Copilot', icon: brand(siGithubcopilot) },
      { name: 'Custom agents, skills and guardrails', icon: line(Bot) },
    ],
  },
]
