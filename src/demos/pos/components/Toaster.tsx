import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { useToasts } from './toast'

const STYLE = {
  success: { cls: 'alert-success', Icon: CircleCheck },
  error: { cls: 'alert-error', Icon: TriangleAlert },
  info: { cls: 'alert-info', Icon: Info },
}

export function Toaster() {
  const { toasts, dismiss } = useToasts()
  return (
    <div className="toast toast-end toast-bottom z-[60]" role="status" aria-live="polite">
      {toasts.map((t) => {
        const { cls, Icon } = STYLE[t.kind]
        return (
          <div key={t.id} className={`alert ${cls} max-w-sm shadow-lg`}>
            <Icon className="size-5 shrink-0" />
            <span className="text-sm whitespace-normal">{t.message}</span>
            <button
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
