import { Briefcase, GraduationCap } from 'lucide-react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { education, jobs, type Job } from '@/content/experience'
import { Reveal } from '@/components/motion/Reveal'
import { EASE } from '@/components/motion/variants'
import { SectionHeading } from '@/components/ui/SectionHeading'

function Period({ job, current }: { job: Job; current: boolean }) {
  return (
    <p className="text-base-content/60 flex flex-wrap items-center gap-2 text-sm font-medium md:justify-end">
      <time>{job.period}</time>
      {current && <span className="badge badge-success badge-soft badge-sm">Current</span>}
    </p>
  )
}

function JobCard({ job, current }: { job: Job; current: boolean }) {
  return (
    <article
      className={`card bg-base-100 border transition duration-300 hover:shadow-lg ${current ? 'border-accent/50 shadow-md' : 'border-base-300'}`}
    >
      <div className="card-body gap-3 p-5 sm:p-6">
        <div className="md:hidden">
          <Period job={job} current={current} />
        </div>
        <div>
          <h3 className="text-lg leading-tight font-semibold">{job.role}</h3>
          <p className="text-accent font-medium">{job.company}</p>
        </div>
        <ul className="text-base-content/80 list-disc space-y-1.5 pl-5">
          {job.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Stack">
          {job.stack.map((s) => (
            <li key={s} className="badge badge-ghost badge-sm">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null)
  // The coloured line fills in as the timeline scrolls past the middle of the screen.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" className="bg-base-200 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I have worked" />
        </Reveal>

        <ol ref={listRef} className="relative">
          {/* Track and progress line: left edge on phones, between the columns on desktop. */}
          <span
            aria-hidden="true"
            className="bg-base-300 absolute top-2 bottom-2 left-3 w-0.5 md:left-[12.75rem]"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="from-primary to-accent absolute top-2 bottom-2 left-3 w-0.5 origin-top bg-gradient-to-b md:left-[12.75rem]"
          />

          {jobs.map((job, i) => (
            <motion.li
              key={job.company}
              className="relative grid grid-cols-[1.5rem_1fr] gap-x-4 pb-6 last:pb-0 md:grid-cols-[11rem_3.5rem_1fr] md:gap-x-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div className="hidden pt-6 md:block">
                <Period job={job} current={i === 0} />
              </div>
              <div className="relative flex justify-center pt-6">
                <span
                  className={`ring-base-200 relative z-10 grid size-6 place-items-center rounded-full ring-4 ${
                    i === 0
                      ? 'from-primary to-accent text-primary-content bg-gradient-to-br'
                      : 'bg-base-100 border-base-300 text-base-content/60 border'
                  }`}
                >
                  <Briefcase className="size-3" />
                </span>
              </div>
              <JobCard job={job} current={i === 0} />
            </motion.li>
          ))}
        </ol>

        <Reveal className="mt-8 ml-10 md:ml-[14.5rem]">
          <div className="card bg-base-100 border-base-300 border">
            <div className="card-body flex-row items-center gap-4 p-5">
              <span className="from-primary to-accent text-primary-content grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br">
                <GraduationCap className="size-5" />
              </span>
              <div>
                <p className="font-semibold">
                  {education.degree}, <em>{education.honors.toLowerCase()}</em>
                </p>
                <p className="text-base-content/70 text-sm">
                  {education.school} · {education.period}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
