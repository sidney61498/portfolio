import { useState } from 'react'
import { projects, type ProjectGroup } from '@/content/projects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkCard } from './WorkCard'

type Tab = 'all' | ProjectGroup
const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'cloudstaff', label: 'Cloudstaff' },
  { id: 'earlier', label: 'Earlier systems' },
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
        <SectionHeading
          eyebrow="Work"
          title="Systems I have built and maintained"
          intro="Most of this work is internal, so instead of source code you get the problem, the approach and the outcome. Mock visuals use fake data, and the live demos are clean-room rebuilds."
        />
        <div role="tablist" aria-label="Filter projects" className="tabs tabs-box bg-base-100 mb-8 inline-flex">
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
