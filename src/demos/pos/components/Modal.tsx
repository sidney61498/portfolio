import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  wide?: boolean
}

/** Native <dialog> with showModal(): focus trapping and Esc-to-close come from the browser. */
export function Modal({ open, onClose, title, children, actions, wide }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle" onClose={onClose} aria-label={title}>
      {open && (
        <div className={`modal-box ${wide ? 'sm:max-w-3xl' : ''}`}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={onClose} aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
          {children}
          {actions && <div className="modal-action">{actions}</div>}
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Close dialog">close</button>
      </form>
    </dialog>
  )
}
