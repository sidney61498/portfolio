import type { Variants } from 'motion/react'

export const EASE = [0.22, 1, 0.36, 1] as const

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

/** For children of <Stagger>: each appears slightly after the previous one. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}
