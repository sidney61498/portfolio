import { BookOpen, Bot, Cog, ScrollText, Terminal, Webhook } from 'lucide-react'
import type { Primitive } from '@/content/harness'

const ICONS = {
  rules: ScrollText,
  skill: BookOpen,
  command: Terminal,
  agent: Bot,
  hook: Webhook,
  script: Cog,
}

export function PrimitiveIcon({
  icon,
  className,
}: {
  icon: Primitive['icon']
  className?: string
}) {
  const Icon = ICONS[icon]
  return <Icon className={className} />
}
