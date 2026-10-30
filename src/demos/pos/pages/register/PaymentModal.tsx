import { Banknote, Wallet } from 'lucide-react'
import { useState } from 'react'
import { formatPHP, parsePesos, pesos } from '../../domain/money'
import type { PaymentMethod } from '../../domain/types'
import { Modal } from '../../components/Modal'

type Payment = { method: PaymentMethod; tendered?: number; reference?: string }

interface Props {
  open: boolean
  total: number
  onClose: () => void
  onPay: (p: Payment) => void
}

export function PaymentModal({ open, total, onClose, onPay }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={`Collect ${formatPHP(total)}`}>
      {/* Remount the form each time so it always starts clean. */}
      {open && <PaymentForm total={total} onPay={onPay} />}
    </Modal>
  )
}

function PaymentForm({ total, onPay }: { total: number; onPay: (p: Payment) => void }) {
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [cash, setCash] = useState('')
  const [reference, setReference] = useState('')

  const tendered = cash.trim() === '' ? NaN : parsePesos(cash)
  const change = Number.isNaN(tendered) ? null : tendered - total
  const canPay = method === 'cash' ? change !== null && change >= 0 : reference.trim().length >= 4

  // Quick-cash buttons: exact, then the next common bills above the total.
  const quick = [
    total,
    ...[pesos(100), pesos(200), pesos(500), pesos(1000)].map(
      (bill) => Math.ceil(total / bill) * bill,
    ),
  ]
  const uniqueQuick = [...new Set(quick)].filter((v) => v >= total).slice(0, 4)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!canPay) return
        onPay(method === 'cash' ? { method, tendered } : { method, reference: reference.trim() })
      }}
    >
      <div role="tablist" className="tabs tabs-box mb-4">
        <button
          type="button"
          role="tab"
          aria-selected={method === 'cash'}
          className={`tab flex-1 gap-2 ${method === 'cash' ? 'tab-active' : ''}`}
          onClick={() => setMethod('cash')}
        >
          <Banknote className="size-4" /> Cash
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === 'ewallet'}
          className={`tab flex-1 gap-2 ${method === 'ewallet' ? 'tab-active' : ''}`}
          onClick={() => setMethod('ewallet')}
        >
          <Wallet className="size-4" /> E-wallet
        </button>
      </div>

      {method === 'cash' ? (
        <>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Cash received</legend>
            <label className="input input-lg w-full">
              ₱
              <input
                autoFocus
                inputMode="decimal"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                aria-label="Cash received in pesos"
              />
            </label>
          </fieldset>
          <div className="mt-2 flex flex-wrap gap-2">
            {uniqueQuick.map((v, i) => (
              <button
                key={v}
                type="button"
                className="btn btn-sm"
                onClick={() => setCash((v / 100).toFixed(2))}
              >
                {i === 0 ? 'Exact' : formatPHP(v)}
              </button>
            ))}
          </div>
          <div
            className={`rounded-box mt-4 p-3 text-center ${change !== null && change < 0 ? 'bg-error/15' : 'bg-base-200'}`}
            aria-live="polite"
          >
            <span className="text-sm">{change !== null && change < 0 ? 'Short by' : 'Change'}</span>
            <p className="text-2xl font-bold">
              {change === null ? '—' : formatPHP(Math.abs(change))}
            </p>
          </div>
        </>
      ) : (
        <fieldset className="fieldset">
          <legend className="fieldset-legend">E-wallet reference number</legend>
          <input
            autoFocus
            className="input w-full"
            aria-label="E-wallet reference number"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. 1029384756"
          />
          <p className="label">
            The customer’s confirmation number from their wallet app (demo: anything 4+ characters).
          </p>
        </fieldset>
      )}

      <button type="submit" className="btn btn-primary btn-lg mt-5 w-full" disabled={!canPay}>
        Complete payment
      </button>
    </form>
  )
}
