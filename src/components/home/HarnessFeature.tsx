import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { harness, terminalSessions } from '@/content/harness'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import { Terminal } from '@/components/harness/Terminal'

/** Dark, high-contrast band on the homepage introducing the AI harness. */
export function HarnessFeature() {
  return (
    <section
      id="harness"
      className="relative isolate overflow-hidden bg-[#070b18] py-24 text-slate-100"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-accent/20 animate-aurora absolute -top-32 right-0 size-[30rem] rounded-full blur-3xl" />
        <div className="bg-primary/30 animate-aurora absolute -bottom-40 -left-20 size-[28rem] rounded-full blur-3xl [animation-delay:-8s]" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-teal-300 uppercase">
            <Sparkles className="size-4" /> Featured · AI-assisted development
          </p>
          <h2 className="text-3xl leading-tight font-bold sm:text-5xl">
            I built the harness that keeps AI agents{' '}
            <span className="bg-gradient-to-r from-sky-300 to-teal-300 bg-clip-text text-transparent">
              inside the rules
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-300">{harness.tagline}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {harness.stats.map((s) => (
              <div key={s.label}>
                <dd className="font-display text-3xl font-bold text-white">
                  <CountUp value={s.value} />
                </dd>
                <dt className="text-sm text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
          <Link
            to="/ai-harness"
            className="btn mt-8 border-0 bg-white text-slate-900 hover:bg-slate-200"
          >
            Explore the harness <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <Reveal delay={0.15}>
          <Terminal sessions={terminalSessions} />
        </Reveal>
      </div>
    </section>
  )
}
