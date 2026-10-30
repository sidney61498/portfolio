import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { skillGroups, type Skill, type SkillGroup } from '@/content/skills'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { staggerItem } from '@/components/motion/variants'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const SPAN: Record<SkillGroup['size'], string> = {
  half: 'lg:col-span-3',
  third: 'lg:col-span-2',
  full: 'lg:col-span-6',
}

function SkillIcon({ skill }: { skill: Skill }) {
  if ('brand' in skill.icon) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4 shrink-0">
        <path d={skill.icon.brand.path} />
      </svg>
    )
  }
  const Icon = skill.icon.line
  return <Icon aria-hidden="true" className="size-4 shrink-0" />
}

/** Core-stack chips are filled; the rest are outlined. Text stays full-contrast in both. */
function Chip({ skill, onDark }: { skill: Skill; onDark?: boolean }) {
  const style = onDark
    ? 'border-white/15 bg-white/10 text-white hover:border-white/40'
    : skill.core
      ? 'border-primary bg-primary text-primary-content shadow-sm'
      : 'border-base-300 bg-base-100 text-base-content hover:border-accent'
  return (
    <li
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition duration-200 hover:-translate-y-0.5 ${style}`}
    >
      <SkillIcon skill={skill} />
      {skill.name}
      {skill.core && <span className="sr-only">(core stack)</span>}
    </li>
  )
}

function GroupCard({ group }: { group: SkillGroup }) {
  const Icon = group.icon
  return (
    <SpotlightCard className="card bg-base-100 border-base-300 h-full border transition duration-300 hover:shadow-lg">
      <div className="card-body gap-4">
        <div className="flex items-start gap-3">
          <span className="from-primary to-accent text-primary-content grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br shadow-md">
            <Icon className="size-5" />
          </span>
          <div>
            <h3 className="text-lg leading-tight font-semibold">{group.name}</h3>
            <p className="text-base-content/70 text-sm">{group.blurb}</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label={`${group.name} skills`}>
          {group.items.map((s) => (
            <Chip key={s.name} skill={s} />
          ))}
        </ul>
      </div>
    </SpotlightCard>
  )
}

/** The AI group gets a dark band that echoes the harness section, with a link to it. */
function AiBand({ group }: { group: SkillGroup }) {
  const Icon = group.icon
  return (
    <div className="rounded-box relative isolate overflow-hidden border border-white/10 bg-[#0b1020] p-6 text-white sm:p-8">
      <div
        aria-hidden="true"
        className="bg-accent/25 animate-aurora pointer-events-none absolute -top-24 -right-16 -z-10 size-72 rounded-full blur-3xl"
      />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 text-slate-900 shadow-md">
            <Icon className="size-5" />
          </span>
          <div>
            <h3 className="text-lg leading-tight font-semibold">{group.name}</h3>
            <p className="text-sm text-slate-300">{group.blurb}</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label={`${group.name} skills`}>
          {group.items.map((s) => (
            <Chip key={s.name} skill={s} onDark />
          ))}
        </ul>
        <Link
          to="/ai-harness"
          className="btn btn-sm shrink-0 border-0 bg-white text-slate-900 hover:bg-slate-200"
        >
          See the harness <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Skills" title="What I work with" />
            <p className="text-base-content/70 mb-10 flex items-center gap-2 text-sm">
              <span className="bg-primary inline-block size-3 rounded" aria-hidden="true" /> Core
              stack I use day to day
            </p>
          </div>
        </Reveal>
        <Stagger className="grid gap-4 lg:grid-cols-6">
          {skillGroups.map((g) => (
            <motion.div key={g.name} variants={staggerItem} className={SPAN[g.size]}>
              {g.size === 'full' ? <AiBand group={g} /> : <GroupCard group={g} />}
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
