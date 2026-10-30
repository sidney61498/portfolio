import { motion } from 'motion/react'
import { EASE, staggerContainer } from './variants'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Children wrapped in <motion.div variants={staggerItem}> appear one after another. */
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}
