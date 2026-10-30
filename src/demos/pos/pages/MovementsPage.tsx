import { useState } from 'react'
import { Link } from 'react-router'
import type { MovementType } from '../domain/types'
import { fmtDateTime } from '../components/format'
import { Pagination } from '../components/Pagination'
import { paginate } from '../components/paging'
import { usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

const TYPES: MovementType[] = ['INITIAL', 'STOCK_IN', 'SALE', 'RETURN', 'ADJUSTMENT']
const TYPE_BADGE: Record<MovementType, string> = {
  INITIAL: 'badge-ghost',
  STOCK_IN: 'badge-success',
  SALE: 'badge-info',
  RETURN: 'badge-warning',
  ADJUSTMENT: 'badge-secondary',
}

export default function MovementsPage() {
  const movements = usePosStore((s) => s.movements)
  const products = usePosStore((s) => s.products)
  const sales = usePosStore((s) => s.sales)
  const stockIns = usePosStore((s) => s.stockIns)
  const [productId, setProductId] = useState('all')
  const [type, setType] = useState<'all' | MovementType>('all')
  const [page, setPage] = useState(1)

  const name = (id: string) => products.find((p) => p.id === id)?.name ?? 'Deleted product'
  const filtered = movements
    .filter((m) => (productId === 'all' || m.productId === productId) && (type === 'all' || m.type === type))
    .slice()
    .reverse()

  const ref = (refType?: string, refId?: string) => {
    if (refType === 'sale') {
      const sale = sales.find((s) => s.id === refId)
      return sale && <Link to={`/demo/pos/sales/${sale.id}`} className="link font-mono">{sale.orNumber}</Link>
    }
    if (refType === 'stockIn') return <span className="font-mono">{stockIns.find((s) => s.id === refId)?.number}</span>
    return null
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Stock ledger" subtitle="Every stock change, newest first. Each product’s stock is the sum of its entries." />
      <div className="card bg-base-100 border-base-300 border">
        <div className="card-body p-4">
          <div className="flex flex-wrap gap-2">
            <select className="select select-sm w-auto" value={productId} onChange={(e) => { setProductId(e.target.value); setPage(1) }} aria-label="Product">
              <option value="all">All products</option>
              {[...products].sort((a, b) => a.name.localeCompare(b.name)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="select select-sm w-auto" value={type} onChange={(e) => { setType(e.target.value as typeof type); setPage(1) }} aria-label="Movement type">
              <option value="all">All types</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="table-sm table-zebra table">
              <thead>
                <tr><th>When</th><th>Product</th><th>Type</th><th className="text-right">Qty</th><th className="text-right">Before → after</th><th>Reference</th><th className="hidden lg:table-cell">By</th></tr>
              </thead>
              <tbody>
                {paginate(filtered, page).map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap">{fmtDateTime(m.at)}</td>
                    <td>{name(m.productId)}</td>
                    <td><span className={`badge badge-sm ${TYPE_BADGE[m.type]}`}>{m.type}</span></td>
                    <td className={`text-right font-mono ${m.qty < 0 ? 'text-error' : 'text-success'}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</td>
                    <td className="text-right font-mono whitespace-nowrap">{m.before} → {m.after}</td>
                    <td>{ref(m.refType, m.refId) ?? <span className="text-base-content/60 text-xs">{m.reason}</span>}</td>
                    <td className="hidden capitalize lg:table-cell">{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
