import { skillGroups } from '@/content/skills'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="Skills" title="What I work with" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div key={g.name} className="card bg-base-100 border-base-300 border">
              <div className="card-body">
                <h3 className="card-title text-base">{g.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span key={item} className="badge badge-soft badge-primary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
