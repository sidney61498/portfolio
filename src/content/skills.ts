export interface SkillGroup {
  name: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    name: 'Backend',
    items: ['Laravel (incl. 12)', 'CakePHP 1.3 / 3.x', 'PHP', 'REST API design', 'Authentication'],
  },
  {
    name: 'Frontend',
    items: ['React', 'Vue', 'Angular', 'Nuxt', 'jQuery', 'Tailwind CSS', 'Bootstrap'],
  },
  { name: 'Data', items: ['MySQL', 'Query optimization', 'Reporting'] },
  { name: 'DevOps & tools', items: ['Docker', 'AWS', 'Git / GitHub', 'GitHub Actions', 'n8n'] },
  {
    name: 'Quality',
    items: ['Playwright E2E', 'Code review', 'Staged releases (staging → UAT → production)'],
  },
  {
    name: 'AI-assisted development',
    items: ['Claude Code', 'GitHub Copilot', 'Custom agents, skills and guardrails'],
  },
]
