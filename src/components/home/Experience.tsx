import { GraduationCap } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal } from '@/components/motion/Reveal'
import { education, jobs } from '@/content/experience'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Experience() {
  return (
    <section id="experience" className="bg-base-200 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I have worked" />
        </Reveal>
        <ul className="timeline timeline-vertical timeline-snap-icon timeline-compact">
          {jobs.map((job, i) => (
            <motion.li
              key={job.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {i > 0 && <hr className="bg-base-300" />}
              <div className="timeline-middle">
                <span className="from-primary to-accent ring-primary/20 block size-3.5 rounded-full bg-gradient-to-br ring-4" />
              </div>
              <div className="timeline-end mb-10 ml-2">
                <time className="text-base-content/60 text-sm">{job.period}</time>
                <h3 className="text-lg font-semibold">{job.role}</h3>
                <p className="text-accent font-medium">{job.company}</p>
                <ul className="text-base-content/75 mt-2 list-disc space-y-1 pl-5">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
              <hr className="bg-base-300" />
            </motion.li>
          ))}
        </ul>
        <Reveal className="card bg-base-100 border-base-300 mt-4 border">
          <div className="card-body flex-row items-center gap-4">
            <GraduationCap className="text-primary size-8 shrink-0" />
            <div>
              <p className="font-semibold">
                {education.degree}, <em>{education.honors.toLowerCase()}</em>
              </p>
              <p className="text-base-content/70 text-sm">
                {education.school} · {education.period}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
