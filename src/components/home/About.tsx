import { about } from '@/content/profile'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function About() {
  return (
    <section id="about" className="bg-base-200 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow="About" title="Software people rely on every day" />
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="text-base-content/80 space-y-4 text-lg leading-relaxed">
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="space-y-4">
            <div className="stats stats-vertical bg-base-100 border-base-300 w-full border">
              {about.facts.map((f) => (
                <div key={f.label} className="stat">
                  <div className="stat-value text-primary text-3xl">{f.value}</div>
                  <div className="stat-desc text-sm whitespace-normal">{f.label}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Trainings</p>
              <div className="flex flex-wrap gap-2">
                {about.trainings.map((t) => (
                  <span key={t} className="badge badge-outline">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
