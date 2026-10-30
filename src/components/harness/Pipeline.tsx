import { Hand } from 'lucide-react'
import { motion } from 'motion/react'
import type { PipelineStep } from '@/content/harness'

/** Ticket-to-production flow. Steps light up in order; human gates are called out. */
export function Pipeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-7 md:gap-2">
      {steps.map((step, i) => (
        <motion.li
          key={step.label}
          className="relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: i * 0.12 }}
        >
          <div
            className={`rounded-box flex h-full flex-col gap-1 border p-3 ${
              step.gate ? 'border-warning/60 bg-warning/10' : 'border-base-300 bg-base-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-base-content/50 font-mono text-xs">
                {String(i + 1).padStart(2, '0')}
              </span>
              {step.gate && (
                <span
                  className="badge badge-warning badge-xs gap-1"
                  title="Needs an explicit human go-ahead"
                >
                  <Hand className="size-3" /> gate
                </span>
              )}
            </div>
            <p className="font-semibold">{step.label}</p>
            <p className="text-base-content/65 text-xs leading-snug">{step.detail}</p>
          </div>
          {i < steps.length - 1 && (
            <motion.span
              aria-hidden="true"
              className="from-primary to-accent absolute top-1/2 -right-2 hidden h-0.5 w-2 origin-left bg-gradient-to-r md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.12 + 0.3 }}
            />
          )}
        </motion.li>
      ))}
    </ol>
  )
}
