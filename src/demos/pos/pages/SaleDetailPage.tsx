import { ArrowLeft, Ban, Printer, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { formatPHP } from '../domain/money'
import { dayKey } from '../domain/operations'
import { can } from '../domain/permissions'
import type { Sale } from '../domain/types'
import { Modal } from '../components/Modal'
import { Receipt } from '../components/Receipt'
import { fmtDateTime, STATUS_BADGE, statusLabel } from '../components/format'
import { attempt, toast } from '../components/toast'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'

export default function SaleDetailPage() {
  const { id } = useParams()
  const sale = usePosStore((s) => s.sales.find((x) => x.id === id))
  const settings = usePosStore((s) => s.settings)
  const role = usePosStore((s) => s.role)
  const [modal, setModal] = useState<'receipt' | 'void' | 'refund' | null>(null)

  if (!sale) {
    return (
      <div className="py-20 text-center">
        <p>Sale not found. It may have been removed by a demo reset.</p>
        <Link to="/demo/pos/sales" className="btn btn-primary mt-4">Back to sales</Link>
      </div>
    )
  }

  const sameDay = dayKey(sale.at) === dayKey(new Date().toISOString())
  const canVoid = sale.status === 'completed' && sameDay
  const canRefund = sale.status === 'completed' || sale.status === 'partially_refunded'
  const needsPin = !can(role, 'sales.void')

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/demo/pos/sales" className="btn btn-ghost btn-sm mb-3 -ml-2"><ArrowLeft className="size-4" /> Sales history</Link>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold">{sale.orNumber}</h1>
          <p className="text-base-content/60 text-sm">{fmtDateTime(sale.at)} · rung up by {sale.role}</p>
        </div>
        <span className={`badge capitalize ${STATUS_BADGE[sale.status]}`}>{statusLabel(sale.status)}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-sm" onClick={() => setModal('receipt')}><Printer className="size-4" /> Reprint receipt</button>
        <button type="button" className="btn btn-sm btn-error btn-soft" disabled={!canVoid} onClick={() => setModal('void')} title={canVoid ? '' : 'Only completed sales from today can be voided'}>
          <Ban className="size-4" /> Void
        </button>
        <button type="button" className="btn btn-sm btn-warning btn-soft" disabled={!canRefund} onClick={() => setModal('refund')}>
          <Undo2 className="size-4" /> Refund items
        </button>
      </div>
      {!canVoid && sale.status === 'completed' && <p className="text-base-content/60 mb-4 text-sm">Voids are same-day only. Use a refund for older sales.</p>}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="card bg-base-100 border-base-300 border">
          <div className="overflow-x-auto">
            <table className="table-sm table">
              <thead><tr><th>Item</th><th className="text-right">Qty</th><th className="text-right">Price</th><th className="text-right">Discount</th><th className="text-right">Line</th></tr></thead>
              <tbody>
                {sale.lines.map((l) => (
                  <tr key={l.productId}>
                    <td>{l.name}{l.returnedQty > 0 && <span className="badge badge-warning badge-xs ml-2">{l.returnedQty} returned</span>}</td>
                    <td className="text-right">{l.qty}</td>
                    <td className="text-right">{formatPHP(l.unitPrice)}</td>
                    <td className="text-right">{l.discount ? `−${formatPHP(l.discount)}` : '—'}</td>
                    <td className="text-right">{formatPHP(l.qty * l.unitPrice - l.discount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card bg-base-100 border-base-300 border">
          <div className="card-body gap-1 p-4 text-sm">
            <Line label="Subtotal" value={formatPHP(sale.subtotal)} />
            {sale.discountTotal > 0 && <Line label="Discounts" value={`−${formatPHP(sale.discountTotal)}`} />}
            <Line label="VATable sales" value={formatPHP(sale.vatableSales)} />
            <Line label="VAT" value={formatPHP(sale.vat)} />
            <Line label="Total" value={formatPHP(sale.total)} bold />
            <div className="divider my-1" />
            <Line label="Payment" value={sale.payment.method === 'cash' ? 'Cash' : `E-wallet · ${sale.payment.reference}`} />
            {sale.payment.method === 'cash' && <><Line label="Received" value={formatPHP(sale.payment.tendered ?? 0)} /><Line label="Change" value={formatPHP(sale.change)} /></>}
            {sale.voidReason && <p className="text-error mt-2">Voided: {sale.voidReason}</p>}
            {sale.refunds.map((r, i) => (
              <p key={i} className="text-warning mt-2">Refunded {formatPHP(r.amount)} · {fmtDateTime(r.at)} · {r.reason}</p>
            ))}
          </div>
        </div>
      </div>

      <Modal open={modal === 'receipt'} onClose={() => setModal(null)} title="Receipt" actions={<button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer className="size-4" /> Print</button>}>
        <div className="border-base-300 rounded-box max-h-[60vh] overflow-y-auto border p-4"><Receipt sale={sale} settings={settings} /></div>
      </Modal>
      <Modal open={modal === 'void'} onClose={() => setModal(null)} title={`Void ${sale.orNumber}?`}>
        {modal === 'void' && <VoidForm sale={sale} needsPin={needsPin} onDone={() => setModal(null)} />}
      </Modal>
      <Modal open={modal === 'refund'} onClose={() => setModal(null)} title={`Refund items from ${sale.orNumber}`}>
        {modal === 'refund' && <RefundForm sale={sale} needsPin={needsPin} onDone={() => setModal(null)} />}
      </Modal>
    </div>
  )
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between gap-2 ${bold ? 'text-base font-bold' : ''}`}><span>{label}</span><span className="text-right">{value}</span></div>
}

function PinField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="fieldset">
      <span className="fieldset-legend">Manager PIN</span>
      <input className="input w-full" type="password" inputMode="numeric" maxLength={4} value={value} onChange={(e) => onChange(e.target.value)} required autoComplete="off" />
      <p className="label">Cashiers need a manager override. Demo PIN: 1234.</p>
    </label>
  )
}

function VoidForm({ sale, needsPin, onDone }: { sale: Sale; needsPin: boolean; onDone: () => void }) {
  const [reason, setReason] = useState('')
  const [pin, setPin] = useState('')
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const ok = await attempt(() => posService.voidSale(sale.id, reason, needsPin ? pin : undefined).then(() => true), 'Sale voided. Stock restored.')
        if (ok) onDone()
      }}
    >
      <p className="text-base-content/70 mb-3 text-sm">All {sale.lines.reduce((n, l) => n + l.qty, 0)} items go back into stock and the sale drops out of reports. The OR number is never reused.</p>
      <label className="fieldset">
        <span className="fieldset-legend">Reason</span>
        <input className="input w-full" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Wrong item rung up" required autoFocus />
      </label>
      {needsPin && <PinField value={pin} onChange={setPin} />}
      <div className="modal-action">
        <button type="button" className="btn" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-error">Void sale</button>
      </div>
    </form>
  )
}

function RefundForm({ sale, needsPin, onDone }: { sale: Sale; needsPin: boolean; onDone: () => void }) {
  const [qty, setQty] = useState<Record<string, number>>({})
  const [reason, setReason] = useState('')
  const [pin, setPin] = useState('')
  const items = Object.entries(qty).filter(([, q]) => q > 0).map(([productId, q]) => ({ productId, qty: q }))
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const amount = await attempt(() => posService.refundSale(sale.id, items, reason, needsPin ? pin : undefined))
        if (amount !== undefined) {
          toast.success(`Refunded ${formatPHP(amount)}. Stock restored.`)
          onDone()
        }
      }}
    >
      <ul className="divide-base-300 mb-3 divide-y">
        {sale.lines.map((l) => {
          const left = l.qty - l.returnedQty
          return (
            <li key={l.productId} className="flex items-center justify-between gap-3 py-2">
              <div>
                <p className="text-sm font-medium">{l.name}</p>
                <p className="text-base-content/60 text-xs">{left} of {l.qty} refundable</p>
              </div>
              <input
                className="input input-sm w-20"
                type="number"
                min={0}
                max={left}
                step={1}
                disabled={left === 0}
                value={qty[l.productId] ?? 0}
                onChange={(e) => setQty({ ...qty, [l.productId]: Math.min(left, Math.max(0, Math.floor(Number(e.target.value) || 0))) })}
                aria-label={`Quantity of ${l.name} to refund`}
              />
            </li>
          )
        })}
      </ul>
      <label className="fieldset">
        <span className="fieldset-legend">Reason</span>
        <input className="input w-full" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Damaged item" required />
      </label>
      {needsPin && <PinField value={pin} onChange={setPin} />}
      <div className="modal-action">
        <button type="button" className="btn" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-warning" disabled={!items.length}>Refund</button>
      </div>
    </form>
  )
}
