import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

/** Counts from 0 to `value` once it scrolls into view. Renders the final value without JS. */
export function CountUp({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number
  suffix?: string
  prefix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const format = (n: number) => `${prefix}${Math.round(n).toLocaleString('en-US')}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!inView || !el || reduce) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => {
        el.textContent = format(n)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value])

  return <span ref={ref}>{format(value)}</span>
}
