import { motion } from 'motion/react'
import { skillGroups } from '@/content/skills'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { staggerItem } from '@/components/motion/variants'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading eyebrow="Skills" title="What I work with" />
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <motion.div key={g.name} variants={staggerItem}>
              <SpotlightCard className="card bg-base-100 border-base-300 h-full border transition duration-300 hover:-translate-y-1 hover:shadow-lg">
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
              </SpotlightCard>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
