import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { projects, type ProjectGroup } from '@/content/projects'
import { Reveal } from '@/components/motion/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkCard } from './WorkCard'

type Tab = 'all' | ProjectGroup
const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cloudstaff', label: 'Cloudstaff' },
  { id: 'earlier', label: 'Earlier systems' },
  { id: 'personal', label: 'Side projects' },
]

export function WorkGrid() {
  const [tab, setTab] = useState<Tab>('all')
  const shown =
    tab === 'all'
      ? [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
      : projects.filter((p) => p.group === tab)

  return (
    <section id="work" className="bg-base-200 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading
            eyebrow="Work"
            title="Systems I have built and maintained"
            intro="Most of this work is internal, so instead of source code you get the problem, the approach and the outcome. Screenshots are redacted, and the live demos are clean-room rebuilds."
          />
        </Reveal>
        <div
          role="tablist"
          aria-label="Filter projects"
          className="tabs tabs-box bg-base-100 mb-8 inline-flex"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`tab ${tab === t.id ? 'tab-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <span className="badge badge-sm badge-ghost ml-2">
                {t.id === 'all' ? projects.length : projects.filter((p) => p.group === t.id).length}
              </span>
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              >
                <WorkCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
