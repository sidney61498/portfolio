import { PackagePlus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatPHP, parsePesos, toPesoString } from '../domain/money'
import { ManagerOnly } from '../components/ManagerOnly'
import { fmtDateTime } from '../components/format'
import { attempt } from '../components/toast'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

interface Line {
  key: number
  productId: string
  qty: string
  unitCost: string
}

let lineKey = 1

function StockIn() {
  const products = usePosStore((s) => s.products)
  const suppliers = usePosStore((s) => s.suppliers)
  const stockIns = usePosStore((s) => s.stockIns)
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? '')
  const [lines, setLines] = useState<Line[]>([])

  // Suggest this supplier's low-stock products first.
  const supplierProducts = products.filter((p) => p.active && (!supplierId || p.supplierId === supplierId))
  const options = [...supplierProducts].sort((a, b) => a.stock - a.reorderLevel - (b.stock - b.reorderLevel))

  const addLine = (productId = options[0]?.id ?? '') => {
    const p = products.find((x) => x.id === productId)
    setLines((l) => [...l, { key: lineKey++, productId, qty: String(p ? Math.max(p.reorderLevel * 2, 1) : 1), unitCost: p ? toPesoString(p.cost) : '' }])
  }
  const update = (key: number, patch: Partial<Line>) => setLines((l) => l.map((x) => (x.key === key ? { ...x, ...patch } : x)))

  const parsed = lines.map((l) => ({ productId: l.productId, qty: Number(l.qty), unitCost: parsePesos(l.unitCost) }))
  const total = parsed.reduce((s, l) => s + (Number.isNaN(l.unitCost) ? 0 : l.unitCost * (l.qty || 0)), 0)

  async function receive() {
    const ok = await attempt(() => posService.receiveStock(supplierId, parsed).then(() => true), 'Stock received and added to the ledger.')
    if (ok) setLines([])
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Stock-in" subtitle="Receive a delivery. Each line adds a STOCK_IN ledger entry and updates the product cost." />
      <div className="card bg-base-100 border-base-300 mb-6 border">
        <div className="card-body p-4">
          <label className="fieldset max-w-sm">
            <span className="fieldset-legend">Supplier</span>
            <select className="select w-full" value={supplierId} onChange={(e) => { setSupplierId(e.target.value); setLines([]) }}>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>

          {lines.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table-sm table">
                <thead><tr><th>Product</th><th className="w-24">Qty</th><th className="w-32">Unit cost ₱</th><th className="text-right">Line</th><th /></tr></thead>
                <tbody>
                  {lines.map((l, i) => {
                    const p = products.find((x) => x.id === l.productId)
                    return (
                      <tr key={l.key}>
                        <td>
                          <select className="select select-sm w-full min-w-48" value={l.productId} onChange={(e) => {
                            const np = products.find((x) => x.id === e.target.value)
                            update(l.key, { productId: e.target.value, unitCost: np ? toPesoString(np.cost) : l.unitCost })
                          }} aria-label="Product">
                            {options.map((o) => <option key={o.id} value={o.id}>{o.name} (on hand {o.stock})</option>)}
                          </select>
                          {p && p.stock <= p.reorderLevel && <span className="text-warning text-xs">Low: {p.stock} on hand</span>}
                        </td>
                        <td><input className="input input-sm w-full" type="number" min={1} step={1} value={l.qty} onChange={(e) => update(l.key, { qty: e.target.value })} aria-label="Quantity" /></td>
                        <td><input className="input input-sm w-full" inputMode="decimal" value={l.unitCost} onChange={(e) => update(l.key, { unitCost: e.target.value })} aria-label="Unit cost" /></td>
                        <td className="text-right">{Number.isNaN(parsed[i].unitCost) ? '—' : formatPHP(parsed[i].unitCost * (parsed[i].qty || 0))}</td>
                        <td><button type="button" className="btn btn-ghost btn-xs" onClick={() => setLines((x) => x.filter((y) => y.key !== l.key))} aria-label="Remove line"><Trash2 className="size-4" /></button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="btn btn-sm" onClick={() => addLine()} disabled={!options.length}>
              <Plus className="size-4" /> Add line
            </button>
            {lines.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-semibold">Total cost {formatPHP(total)}</span>
                <button type="button" className="btn btn-primary" onClick={receive}>
                  <PackagePlus className="size-4" /> Receive stock
                </button>
              </div>
            )}
          </div>
          {!options.length && <p className="text-base-content/60 text-sm">This supplier has no active products.</p>}
        </div>
      </div>

      <h2 className="mb-2 font-semibold">Past deliveries</h2>
      <div className="card bg-base-100 border-base-300 border">
        <div className="overflow-x-auto">
          <table className="table-sm table">
            <thead><tr><th>No.</th><th>Date</th><th>Supplier</th><th className="text-right">Lines</th><th className="text-right">Cost</th></tr></thead>
            <tbody>
              {[...stockIns].reverse().map((s) => (
                <tr key={s.id}>
                  <td className="font-mono">{s.number}</td>
                  <td>{fmtDateTime(s.at)}</td>
                  <td>{suppliers.find((x) => x.id === s.supplierId)?.name ?? '—'}</td>
                  <td className="text-right">{s.lines.length}</td>
                  <td className="text-right">{formatPHP(s.lines.reduce((t, l) => t + l.qty * l.unitCost, 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function StockInPage() {
  return (
    <ManagerOnly action="inventory.adjust">
      <StockIn />
    </ManagerOnly>
  )
}
