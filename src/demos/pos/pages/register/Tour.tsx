import { X } from 'lucide-react'
import { posService } from '../../services/posService'

/** First-run guide: shows the system's rules working in under a minute. */
export function Tour({ sampleBarcode }: { sampleBarcode: string }) {
  return (
    <div className="alert alert-info alert-soft border-info/30 mb-4 items-start border">
      <div className="w-full">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold">Try this (about one minute)</h2>
          <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={posService.finishTour} aria-label="Dismiss guide">
            <X className="size-4" />
          </button>
        </div>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          <li>
            Type barcode <code className="kbd kbd-sm">{sampleBarcode}</code> in the barcode box and press Enter (or tap any product).
          </li>
          <li>
            Press <kbd className="kbd kbd-sm">F9</kbd> or <b>Pay</b>, choose <b>Exact</b>, and complete the payment.
          </li>
          <li>
            Open <b>Stock ledger</b>: the sale shows up with stock before → after.
          </li>
          <li>
            Open <b>Sales history</b>, open the sale and void it. As a cashier you need the manager PIN <code className="kbd kbd-sm">1234</code>; as a Manager you don’t. Stock goes back.
          </li>
          <li>Switch to <b>Manager</b> (top right) to unlock the dashboard, reports, stock-in and settings.</li>
        </ol>
      </div>
    </div>
  )
}
