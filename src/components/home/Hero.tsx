import { ArrowRight, Bot, Download, MapPin, Sparkles, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { CountUp } from '@/components/motion/CountUp'
import photo from '@/assets/sidney.webp'

const ROTATING = [
  'internal systems people rely on',
  'APIs and integrations',
  'workflow automations',
  'AI tooling with guardrails',
]
const EASE = [0.22, 1, 0.36, 1] as const

const STATS = [
  { value: 5, suffix: '+', label: 'years in production' },
  { value: 7000, prefix: '~', label: 'staff on the system I maintain' },
  { value: projects.length, label: 'projects on this site' },
  { value: 32, label: 'commands in my AI harness' },
]

function RotatingWord() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING.length), 2800)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-grid align-bottom">
      {/* Invisible longest phrase reserves the width so nothing jumps. */}
      <span className="invisible col-start-1 row-start-1">
        {ROTATING.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING[index]}
          className="text-gradient col-start-1 row-start-1"
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {ROTATING[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-primary/15 animate-aurora absolute -top-40 -left-32 size-[34rem] rounded-full blur-3xl" />
      <div className="bg-accent/25 animate-aurora absolute top-20 -right-40 size-[30rem] rounded-full blur-3xl [animation-delay:-6s]" />
      <div className="bg-info/15 animate-aurora absolute -bottom-40 left-1/3 size-[28rem] rounded-full blur-3xl [animation-delay:-12s]" />
      <div className="bg-grid absolute inset-0" />
    </div>
  )
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Background />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-12 sm:pt-24 md:grid-cols-[1fr_auto]">
        <div>
          <motion.p
            {...fadeUp(0)}
            className="badge badge-lg border-base-300 bg-base-100/70 gap-2 backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-success relative inline-flex size-2 rounded-full" />
            </span>
            {profile.title} · {profile.availability}
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl"
          >
            Sidney <span className="text-gradient">Medrano</span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="text-base-content/85 mt-5 text-2xl font-medium sm:text-3xl"
          >
            I build <RotatingWord />
          </motion.p>
          <motion.p {...fadeUp(0.3)} className="text-base-content/70 mt-6 max-w-2xl text-lg">
            {profile.pitch}
          </motion.p>
          <motion.div {...fadeUp(0.4)} className="mt-8 flex flex-wrap gap-3">
            <Link to={{ pathname: '/', hash: 'work' }} className="btn btn-primary btn-lg group">
              View my work{' '}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/ai-harness" className="btn btn-lg btn-outline">
              <Sparkles className="size-4" /> See the AI harness
            </Link>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn btn-ghost btn-lg" download>
                <Download className="size-4" /> Resume
              </a>
            )}
          </motion.div>
          <motion.p
            {...fadeUp(0.5)}
            className="text-base-content/60 mt-6 flex items-center gap-2 text-sm"
          >
            <MapPin className="size-4" /> {profile.location}
          </motion.p>
        </div>

        <motion.div
          className="relative justify-self-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          <div className="relative size-56 sm:size-72">
            <div
              aria-hidden="true"
              className="animate-spin-slow absolute -inset-1.5 rounded-full bg-[conic-gradient(from_0deg,var(--color-primary),var(--color-accent),var(--color-info),var(--color-primary))] opacity-80 blur-[2px]"
            />
            <img
              src={photo}
              alt={`Portrait of ${profile.name}`}
              width={288}
              height={288}
              className="border-base-100 relative size-full rounded-full border-4 object-cover"
            />
          </div>
          <div className="bg-base-100/90 border-base-300 animate-float absolute top-6 -left-10 hidden items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-lg backdrop-blur xl:flex">
            <Users className="text-accent size-4" /> ~7,000 users
          </div>
          <div className="bg-base-100/90 border-base-300 animate-float absolute -right-8 bottom-10 hidden items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-lg backdrop-blur [animation-delay:-3s] xl:flex">
            <Bot className="text-primary size-4" /> AI-assisted dev
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mb-16 max-w-6xl px-4">
        <motion.dl
          {...fadeUp(0.6)}
          className="border-base-300 bg-base-100/60 rounded-box grid grid-cols-2 overflow-hidden border backdrop-blur sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-base-100/40 p-5 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-bold sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </dd>
              <dd className="text-base-content/60 mt-1 text-sm">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
