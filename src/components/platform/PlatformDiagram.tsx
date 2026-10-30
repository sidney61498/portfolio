import { Database, Monitor, Server, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'

const CLIENTS = [
  { label: 'Web back office', sub: 'React SPA', Icon: Monitor },
  { label: 'Desktop till', sub: 'Electron + SQLite', Icon: Monitor },
  { label: 'Mobile app', sub: 'Expo + SQLite', Icon: Smartphone },
]

/** Three clients feeding one API, with pulses travelling along the connections. */
export function PlatformDiagram() {
  return (
    <div
      className="relative mx-auto max-w-3xl"
      role="img"
      aria-label="Three client apps (web, desktop and mobile) connect to one Laravel API, which uses MySQL. Desktop and mobile also keep a local SQLite copy for offline use."
    >
      <div className="grid grid-cols-3 gap-3">
        {CLIENTS.map(({ label, sub, Icon }, i) => (
          <motion.div
            key={label}
            className="border-base-300 bg-base-100 rounded-box flex flex-col items-center gap-1 border p-4 text-center shadow-sm"
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
          >
            <Icon className="text-accent size-6" />
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-base-content/60 text-xs">{sub}</p>
          </motion.div>
        ))}
      </div>

      <svg
        viewBox="0 0 300 70"
        className="h-16 w-full sm:h-20"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {[50, 150, 250].map((x, i) => (
          <g key={x}>
            <path
              d={`M${x} 0 C ${x} 35, 150 35, 150 70`}
              fill="none"
              stroke="var(--color-base-300)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <circle r="2.5" fill="var(--color-accent)">
              <animateMotion
                dur={`${2.2 + i * 0.3}s`}
                repeatCount="indefinite"
                path={`M${x} 0 C ${x} 35, 150 35, 150 70`}
              />
            </circle>
          </g>
        ))}
      </svg>

      <motion.div
        className="from-primary to-accent text-primary-content rounded-box mx-auto flex max-w-sm items-center justify-center gap-3 bg-gradient-to-r p-4 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Server className="size-6" />
        <div>
          <p className="font-semibold">Laravel 13 API</p>
          <p className="text-xs opacity-80">Sanctum · 85 endpoints · branch-scoped</p>
        </div>
      </motion.div>
      <div className="mx-auto h-6 w-px bg-[var(--color-base-300)]" aria-hidden="true" />
      <div className="border-base-300 bg-base-100 rounded-box mx-auto flex max-w-[12rem] items-center justify-center gap-2 border p-3 text-sm shadow-sm">
        <Database className="text-primary size-5" /> MySQL 8.4 + Redis
      </div>
    </div>
  )
}
