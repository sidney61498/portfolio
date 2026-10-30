import { useState } from 'react'
import { useNavigate } from 'react-router'
import { formatPHP } from '../domain/money'
import { dayKey } from '../domain/operations'
import { can } from '../domain/permissions'
import { lastNDays } from '../domain/reports'
import type { SaleStatus } from '../domain/types'
import { fmtDateTime, STATUS_BADGE, statusLabel } from '../components/format'
import { Pagination } from '../components/Pagination'
import { paginate } from '../components/paging'
import { usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

export default function SalesPage() {
  const sales = usePosStore((s) => s.sales)
  const role = usePosStore((s) => s.role)
  const navigate = useNavigate()
  const seeAll = can(role, 'sales.viewAll')

  const week = lastNDays(7, new Date())
  const today = dayKey(new Date().toISOString())
  const [from, setFrom] = useState(week.from)
  const [to, setTo] = useState(week.to)
  const [status, setStatus] = useState<'all' | SaleStatus>('all')
  const [method, setMethod] = useState<'all' | 'cash' | 'ewallet'>('all')
  const [page, setPage] = useState(1)

  // Cashiers see only today's sales (their shift); managers can look at any range.
  const range = seeAll ? { from, to } : { from: today, to: today }
  const filtered = sales
    .filter((s) => {
      const k = dayKey(s.at)
      return k >= range.from && k <= range.to && (status === 'all' || s.status === status) && (method === 'all' || s.payment.method === method)
    })
    .slice()
    .reverse()

  const reset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1) }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Sales history" subtitle={seeAll ? 'Open a sale to reprint, void or refund it.' : 'Cashiers see today’s sales only. Switch to Manager to see everything.'} />
      <div className="card bg-base-100 border-base-300 border">
        <div className="card-body p-4">
          <div className="flex flex-wrap items-end gap-2">
            {seeAll && (
              <>
                <label className="input input-sm w-auto"><span className="text-base-content/60 text-xs">From</span><input type="date" value={from} max={to} onChange={(e) => reset(setFrom)(e.target.value)} /></label>
                <label className="input input-sm w-auto"><span className="text-base-content/60 text-xs">To</span><input type="date" value={to} min={from} onChange={(e) => reset(setTo)(e.target.value)} /></label>
              </>
            )}
            <select className="select select-sm w-auto" value={status} onChange={(e) => reset(setStatus)(e.target.value as typeof status)} aria-label="Status">
              <option value="all">All statuses</option>
              {(['completed', 'voided', 'partially_refunded', 'refunded'] as const).map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </select>
            <select className="select select-sm w-auto" value={method} onChange={(e) => reset(setMethod)(e.target.value as typeof method)} aria-label="Payment method">
              <option value="all">Cash and e-wallet</option>
              <option value="cash">Cash</option>
              <option value="ewallet">E-wallet</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="table-sm table-zebra table">
              <thead><tr><th>OR no.</th><th>When</th><th className="text-right">Items</th><th className="text-right">Total</th><th className="hidden sm:table-cell">Payment</th><th>Status</th></tr></thead>
              <tbody>
                {paginate(filtered, page).map((s) => (
                  <tr key={s.id} className="hover:bg-base-200 cursor-pointer" onClick={() => navigate(`/demo/pos/sales/${s.id}`)}>
                    <td>
                      <a href={`/demo/pos/sales/${s.id}`} className="link font-mono" onClick={(e) => { e.preventDefault(); navigate(`/demo/pos/sales/${s.id}`) }}>{s.orNumber}</a>
                    </td>
                    <td className="whitespace-nowrap">{fmtDateTime(s.at)}</td>
                    <td className="text-right">{s.lines.reduce((n, l) => n + l.qty, 0)}</td>
                    <td className="text-right">{formatPHP(s.total)}</td>
                    <td className="hidden sm:table-cell">{s.payment.method === 'cash' ? 'Cash' : 'E-wallet'}</td>
                    <td><span className={`badge badge-sm capitalize ${STATUS_BADGE[s.status]}`}>{statusLabel(s.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-base-content/60 py-8 text-center">No sales in this range.</p>}
          </div>
          <Pagination page={page} total={filtered.length} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
