import { ArrowLeft, Info, Monitor, PlayCircle, Smartphone, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import {
  apiExamples,
  clients,
  highlights,
  posPlatform,
  type ClientApp,
} from '@/content/posPlatform'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { staggerItem } from '@/components/motion/variants'
import { ApiExplorer } from '@/components/platform/ApiExplorer'
import { PlatformDiagram } from '@/components/platform/PlatformDiagram'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

const CLIENT_ICON: Record<ClientApp['icon'], typeof Monitor> = {
  web: Monitor,
  desktop: Monitor,
  mobile: Smartphone,
}

export function PosPlatformPage() {
  useEffect(() => {
    document.title = 'POS Inventory platform | Sidney Medrano'
  }, [])

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-accent/20 animate-aurora absolute -top-32 right-0 size-[30rem] rounded-full blur-3xl" />
          <div className="bg-primary/15 animate-aurora absolute top-40 -left-32 size-[26rem] rounded-full blur-3xl [animation-delay:-7s]" />
          <div className="bg-grid absolute inset-0" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-16">
          <Link
            to={{ pathname: '/', hash: 'projects' }}
            className="btn btn-ghost btn-sm mb-8 -ml-3"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <Reveal>
            <p className="text-accent mb-3 text-sm font-semibold tracking-widest uppercase">
              Personal project · 2026
            </p>
            <h1 className="max-w-3xl text-4xl leading-tight font-bold sm:text-6xl">
              {posPlatform.title}: <span className="text-gradient">one API, three apps</span>
            </h1>
            <p className="text-base-content/75 mt-5 max-w-3xl text-lg">{posPlatform.tagline}</p>
            <div className="alert alert-info alert-soft mt-6 max-w-3xl">
              <Info className="size-5 shrink-0" />
              <span>{posPlatform.disclaimer}</span>
            </div>
            <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {posPlatform.stats.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-4xl font-bold">
                    <CountUp value={s.value} />
                  </dd>
                  <dt className="text-base-content/60 text-sm">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading
              eyebrow="Architecture"
              title="Three clients, one contract"
              intro="Every app talks to the same Laravel API. The desktop and mobile apps also keep a local SQLite copy, so a till keeps selling when the internet drops and syncs when it’s back."
            />
          </Reveal>
          <PlatformDiagram />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#070b18] py-20 text-slate-100">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-primary/30 animate-aurora absolute -top-40 -left-24 size-[30rem] rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="mb-10 max-w-2xl">
            <p className="mb-2 text-sm font-semibold tracking-widest text-teal-300 uppercase">
              API
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">Explore the API</h2>
            <p className="mt-4 text-lg text-slate-300">
              Six real endpoints, including a retried offline checkout and a business-rule failure.
              Pick one to see the request and the response.
            </p>
          </Reveal>
          <Reveal>
            <ApiExplorer examples={apiExamples} />
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading eyebrow="Design" title="Decisions worth pointing out" />
          </Reveal>
          <Stagger className="grid gap-4 md:grid-cols-2">
            {highlights.map((h) => (
              <motion.div
                key={h.title}
                variants={staggerItem}
                className="border-base-300 bg-base-100 rounded-box flex gap-4 border p-5"
              >
                <Zap className="text-accent mt-0.5 size-6 shrink-0" />
                <div>
                  <h3 className="font-semibold">{h.title}</h3>
                  <p className="text-base-content/70 mt-1">{h.text}</p>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeading eyebrow="Clients" title="What each app does" />
          </Reveal>
          <Stagger className="grid gap-4 lg:grid-cols-3">
            {clients.map((c) => {
              const Icon = CLIENT_ICON[c.icon]
              return (
                <motion.div key={c.name} variants={staggerItem}>
                  <SpotlightCard className="card bg-base-100 border-base-300 h-full border">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <span className="from-primary to-accent text-primary-content grid size-10 place-items-center rounded-xl bg-gradient-to-br">
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <p className="text-base-content/60 text-xs">{c.platform}</p>
                        </div>
                      </div>
                      <ul className="text-base-content/80 mt-3 list-disc space-y-1 pl-5 text-sm">
                        {c.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.stack.map((s) => (
                          <span key={s} className="badge badge-ghost badge-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </Stagger>
        </div>
      </section>

      <section className="py-16">
        <Reveal className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold">Want to click through a POS?</h2>
          <p className="text-base-content/70 mt-2">
            The Tindahan demo on this site runs entirely in your browser, no sign-in needed.
          </p>
          <Link to="/demo/pos" className="btn btn-primary mt-5">
            <PlayCircle className="size-4" /> Open the live demo
          </Link>
        </Reveal>
      </section>
    </>
  )
}
