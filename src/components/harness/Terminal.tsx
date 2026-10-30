import { CheckCircle2, Hand, Info } from 'lucide-react'
import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { TerminalLine } from '@/content/harness'

const ICON = {
  ok: <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />,
  gate: <Hand className="size-4 shrink-0 text-amber-300" />,
  info: <Info className="size-4 shrink-0 text-sky-300" />,
  out: <span className="w-4 shrink-0 text-center text-slate-500">›</span>,
  prompt: null,
}

/**
 * A simulated Claude Code session that types a command, then reveals its output line by line,
 * and moves on to the next session. Starts when scrolled into view; static when motion is reduced.
 */
export function Terminal({ sessions }: { sessions: TerminalLine[][] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const [session, setSession] = useState(0)
  const [typed, setTyped] = useState(0)
  const [shown, setShown] = useState(0)

  const lines = sessions[session]
  const command = lines[0].text
  const animate = inView && !reduce

  useEffect(() => {
    if (!animate) return
    let t: ReturnType<typeof setTimeout>
    if (typed < command.length) t = setTimeout(() => setTyped(typed + 1), 55)
    else if (shown < lines.length - 1)
      t = setTimeout(() => setShown(shown + 1), shown === 0 ? 500 : 650)
    else
      t = setTimeout(() => {
        setSession((session + 1) % sessions.length)
        setTyped(0)
        setShown(0)
      }, 3200)
    return () => clearTimeout(t)
  }, [animate, typed, shown, session, command.length, lines.length, sessions.length])

  const visibleTyped = reduce ? command.length : typed
  const visibleShown = reduce ? lines.length - 1 : shown

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] font-mono text-sm text-slate-200 shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-slate-400">claude · feature/holiday-requests</span>
      </div>
      <div className="min-h-64 space-y-2 p-5" aria-live="off">
        <p className="flex gap-2">
          <span className="text-emerald-400">❯</span>
          <span>
            {command.slice(0, visibleTyped)}
            {visibleTyped < command.length || visibleShown === 0 ? (
              <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-slate-200" />
            ) : null}
          </span>
        </p>
        {lines.slice(1, visibleShown + 1).map((line, i) => (
          <p
            key={`${session}-${i}`}
            className={`flex items-start gap-2 ${reduce ? '' : 'animate-[fadeIn_.35s_ease-out]'} ${line.kind === 'gate' ? 'text-amber-200' : ''}`}
          >
            {ICON[line.kind]}
            <span>{line.text}</span>
          </p>
        ))}
      </div>
      <div className="flex gap-1.5 border-t border-white/10 px-5 py-3" aria-hidden="true">
        {sessions.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${i === session ? 'w-6 bg-emerald-400' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
      {/* The full transcript for screen readers, since the animation is visual only. */}
      <div className="sr-only">
        {sessions.map((s, i) => (
          <p key={i}>{s.map((l) => l.text).join('. ')}</p>
        ))}
      </div>
    </div>
  )
}
