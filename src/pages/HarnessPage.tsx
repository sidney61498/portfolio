import { ArrowLeft, Lightbulb, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import {
  commandGroups,
  evolution,
  guardrails,
  harness,
  lessons,
  pipeline,
  primitives,
  terminalSessions,
} from '@/content/harness'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { staggerItem } from '@/components/motion/variants'
import { Pipeline } from '@/components/harness/Pipeline'
import { PrimitiveIcon } from '@/components/harness/PrimitiveIcon'
import { Terminal } from '@/components/harness/Terminal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

export function HarnessPage() {
  useEffect(() => {
    document.title = 'AI development harness | Sidney Medrano'
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#070b18] text-slate-100">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-accent/20 animate-aurora absolute -top-40 right-10 size-[32rem] rounded-full blur-3xl" />
          <div className="bg-primary/35 animate-aurora absolute -bottom-48 -left-24 size-[30rem] rounded-full blur-3xl [animation-delay:-8s]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">
          <Link
            to={{ pathname: '/', hash: 'harness' }}
            className="btn btn-ghost btn-sm mb-10 -ml-3 text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <p className="mb-3 text-sm font-semibold tracking-widest text-teal-300 uppercase">
                Personal tooling · Cloudstaff · 2026
              </p>
              <h1 className="text-4xl leading-tight font-bold sm:text-6xl">
                {harness.title.replace('harness', '')}
                <span className="bg-gradient-to-r from-sky-300 to-teal-300 bg-clip-text text-transparent">
                  harness
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-300">{harness.intro}</p>
              <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {harness.stats.map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-4xl font-bold text-white">
                      <CountUp value={s.value} />
                    </dd>
                    <dt className="text-sm text-slate-400">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.15}>
              <Terminal sessions={terminalSessions} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Building blocks */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Architecture"
              title="Each piece lives where its trigger says it should"
              intro="The design rule: put things where who starts them, and whether they need their own context, says they belong. A skill fires when the agent recognises a situation; a command only when I decide."
            />
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {primitives.map((p) => (
              <motion.div key={p.name} variants={staggerItem}>
                <SpotlightCard className="card bg-base-100 border-base-300 h-full border transition-transform duration-300 hover:-translate-y-1">
                  <div className="card-body">
                    <div className="from-primary to-accent text-primary-content mb-2 grid size-11 place-items-center rounded-xl bg-gradient-to-br shadow-md">
                      <PrimitiveIcon icon={p.icon} className="size-5" />
                    </div>
                    <h3 className="card-title text-lg">{p.name}</h3>
                    <p className="text-accent text-sm font-medium">{p.trigger}</p>
                    <p className="text-base-content/70">{p.useFor}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Pipeline */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Workflow"
              title="From ticket to production, with humans at the gates"
              intro="Everything up to an approved PR runs on its own. Every step that changes a shared environment waits for an explicit go-ahead, in the same conversation."
            />
          </Reveal>
          <Pipeline steps={pipeline} />
        </div>
      </section>

      {/* Guardrails */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Guardrails"
              title="Rules the agent can’t talk its way around"
              intro="Several rules keep the exact wording they were written in after a real near-miss, so the lesson isn’t lost in a rewrite."
            />
          </Reveal>
          <Stagger className="grid gap-4 md:grid-cols-2">
            {guardrails.map((g) => (
              <motion.div
                key={g.rule}
                variants={staggerItem}
                className="border-base-300 bg-base-100 rounded-box flex gap-4 border p-5"
              >
                <ShieldCheck className="text-success mt-0.5 size-6 shrink-0" />
                <div>
                  <h3 className="font-semibold">{g.rule}</h3>
                  <p className="text-base-content/70 mt-1">{g.detail}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Commands */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Commands"
              title="One command per routine job"
              intro="A sample of the 32 slash commands, grouped by what they’re for."
            />
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {commandGroups.map((g) => (
              <motion.div
                key={g.name}
                variants={staggerItem}
                className="card bg-base-100 border-base-300 border"
              >
                <div className="card-body">
                  <h3 className="card-title text-base">{g.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((c) => (
                      <code
                        key={c}
                        className="bg-base-200 text-primary rounded-field px-2 py-1 text-sm"
                      >
                        {c}
                      </code>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Evolution + lessons */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading eyebrow="Evolution" title="Version two, rebuilt on purpose" />
            </Reveal>
            <ol className="border-base-300 relative space-y-8 border-l-2 pl-8">
              {evolution.map((e, i) => (
                <Reveal key={e.version} delay={i * 0.1}>
                  <li className="relative">
                    <span className="from-primary to-accent text-primary-content absolute top-0 -left-[2.95rem] grid size-9 place-items-center rounded-full bg-gradient-to-br text-xs font-bold">
                      {e.version}
                    </span>
                    <h3 className="text-lg font-semibold">{e.title}</h3>
                    <p className="text-base-content/70 mt-1">{e.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <Reveal>
              <SectionHeading eyebrow="Lessons" title="What building it taught me" />
            </Reveal>
            <Stagger className="space-y-3">
              {lessons.map((l) => (
                <motion.p
                  key={l}
                  variants={staggerItem}
                  className="bg-base-200 rounded-box flex gap-3 p-4"
                >
                  <Lightbulb className="text-warning mt-0.5 size-5 shrink-0" />
                  <span>{l}</span>
                </motion.p>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <Reveal className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Want something like this for your team?
          </h2>
          <p className="text-base-content/70 mt-3">
            I’m happy to walk through how it works and what I’d do differently.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={{ pathname: '/', hash: 'contact' }} className="btn btn-primary">
              Get in touch
            </Link>
            <Link to={{ pathname: '/', hash: 'work' }} className="btn btn-ghost">
              See other work
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
