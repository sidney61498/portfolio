import { Check, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { ApiExample, HttpMethod } from '@/content/posPlatform'

const METHOD_STYLE: Record<HttpMethod, string> = {
  GET: 'bg-sky-500/15 text-sky-300',
  POST: 'bg-emerald-500/15 text-emerald-300',
  PUT: 'bg-amber-500/15 text-amber-300',
  PATCH: 'bg-violet-500/15 text-violet-300',
  DELETE: 'bg-rose-500/15 text-rose-300',
}

/** Minimal JSON highlighter: keys, strings, numbers and literals, no dependencies. */
function Json({ value }: { value: unknown }) {
  const text = JSON.stringify(value, null, 2)
  const parts = text.split(
    /("(?:\\.|[^"\\])*"(?:\s*:)?|\b-?\d+(?:\.\d+)?\b|\btrue\b|\bfalse\b|\bnull\b)/g,
  )
  return (
    <code>
      {parts.map((p, i) => {
        if (i % 2 === 0) return <span key={i}>{p}</span>
        const cls = p.endsWith(':')
          ? 'text-sky-300'
          : p.startsWith('"')
            ? 'text-emerald-300'
            : /true|false|null/.test(p)
              ? 'text-violet-300'
              : 'text-amber-300'
        return (
          <span key={i} className={cls}>
            {p}
          </span>
        )
      })}
    </code>
  )
}

function statusClass(status: number) {
  if (status >= 400) return 'bg-rose-500/15 text-rose-300'
  return 'bg-emerald-500/15 text-emerald-300'
}

/** A Postman-style viewer for real endpoints with example payloads. */
export function ApiExplorer({ examples }: { examples: ApiExample[] }) {
  const [activeId, setActiveId] = useState(examples[0].id)
  const [copied, setCopied] = useState(false)
  const active = examples.find((e) => e.id === activeId)!
  const groups = [...new Set(examples.map((e) => e.group))]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(active.response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] text-slate-200 shadow-2xl shadow-black/30 lg:grid-cols-[18rem_1fr]">
      <nav
        aria-label="Endpoints"
        className="border-b border-white/10 p-3 lg:border-r lg:border-b-0"
      >
        {groups.map((g) => (
          <div key={g} className="mb-3">
            <p className="px-2 pb-1 text-xs font-semibold tracking-widest text-slate-500 uppercase">
              {g}
            </p>
            <ul>
              {examples
                .filter((e) => e.group === g)
                .map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(e.id)}
                      aria-current={e.id === activeId}
                      className={`flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${e.id === activeId ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <span
                        className={`mt-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${METHOD_STYLE[e.method]}`}
                      >
                        {e.method}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-mono text-xs text-slate-300">
                          {e.path.split('?')[0]}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {e.status >= 400
                            ? `${e.status} example`
                            : e.summary.split(':')[0].split('.')[0]}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="min-w-0 p-5"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            <span
              className={`rounded px-2 py-0.5 text-xs font-bold ${METHOD_STYLE[active.method]}`}
            >
              {active.method}
            </span>
            <span className="break-all text-slate-100">{active.path}</span>
          </div>
          <p className="mt-3 text-slate-300">{active.summary}</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-400">
            {active.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-teal-400">•</span>
                {n}
              </li>
            ))}
          </ul>

          {active.request !== undefined && (
            <>
              <p className="mt-5 mb-2 text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Request body
              </p>
              <pre className="max-h-64 overflow-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed">
                <Json value={active.request} />
              </pre>
            </>
          )}

          <div className="mt-5 mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Response{' '}
              <span
                className={`ml-2 rounded px-1.5 py-0.5 font-mono normal-case ${statusClass(active.status)}`}
              >
                {active.status}
              </span>
            </p>
            <button
              type="button"
              onClick={copy}
              className="btn btn-ghost btn-xs text-slate-400 hover:bg-white/10"
              aria-label="Copy response JSON"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed">
            <Json value={active.response} />
          </pre>
          <p className="mt-3 text-xs text-slate-500">
            Routes, fields and rules match the project’s code; the values are examples.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
