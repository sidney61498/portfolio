import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Screenshot } from '@/content/projects'

/** Screenshot grid with a keyboard-friendly lightbox (native <dialog>: Esc closes, arrows page). */
export function Gallery({ shots }: { shots: Screenshot[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open !== null && !d.open) d.showModal()
    if (open === null && d.open) d.close()
  }, [open])

  const step = (delta: number) =>
    setOpen((i) => (i === null ? i : (i + delta + shots.length) % shots.length))

  return (
    <>
      <div className={`grid gap-4 ${shots.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {shots.map((s, i) => (
          <figure key={s.src} className="group">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="border-base-300 rounded-box block w-full overflow-hidden border shadow-sm transition hover:shadow-lg focus-visible:outline-2"
              aria-label={`Enlarge: ${s.alt}`}
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
            <figcaption className="text-base-content/60 mt-2 text-sm">{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="modal"
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        aria-label="Screenshot viewer"
      >
        {open !== null && (
          <div className="modal-box max-w-6xl p-3">
            <img src={shots[open].src} alt={shots[open].alt} className="rounded-field w-full" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm">{shots[open].caption}</p>
              <div className="flex shrink-0 gap-1">
                {shots.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-circle btn-ghost"
                      onClick={() => step(-1)}
                      aria-label="Previous"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-circle btn-ghost"
                      onClick={() => step(1)}
                      aria-label="Next"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>
    </>
  )
}
