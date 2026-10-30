import { FileDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatPHP, toPesoString } from '../domain/money'
import { inventoryValuation, lastNDays, salesByCategory, salesByDay, salesByProduct, toCsv, type DateRange } from '../domain/reports'
import { ManagerOnly } from '../components/ManagerOnly'
import { SalesChart } from '../components/SalesChart'
import { downloadCsv, fmtDay } from '../components/format'
import { currentData, usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

type Tab = 'day' | 'product' | 'category' | 'valuation'
const TABS: { id: Tab; label: string }[] = [
  { id: 'day', label: 'By day' },
  { id: 'product', label: 'By product' },
  { id: 'category', label: 'By category' },
  { id: 'valuation', label: 'Inventory valuation' },
]

function Reports() {
  const sales = usePosStore((s) => s.sales)
  const products = usePosStore((s) => s.products)
  const [tab, setTab] = useState<Tab>('day')
  const [range, setRange] = useState<DateRange>(() => lastNDays(30, new Date()))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => currentData(), [sales, products])
  const byDay = useMemo(() => salesByDay(data, range), [data, range])
  const byProduct = useMemo(() => salesByProduct(data, range), [data, range])
  const byCategory = useMemo(() => salesByCategory(data, range), [data, range])
  const valuation = useMemo(() => inventoryValuation(data), [data])

  const totalSales = byDay.reduce((s, r) => s + r.sales, 0)
  const totalProfit = byDay.reduce((s, r) => s + r.grossProfit, 0)
  const totalTx = byDay.reduce((s, r) => s + r.transactions, 0)

  const preset = (n: number) => setRange(lastNDays(n, new Date()))
  const suffix = `${range.from}_to_${range.to}`

  function exportCsv() {
    if (tab === 'day') {
      downloadCsv(`sales-by-day_${suffix}.csv`, toCsv(['Date', 'Transactions', 'Net sales (PHP)', 'Gross profit (PHP)'], byDay.map((r) => [r.date, r.transactions, toPesoString(r.sales), toPesoString(r.grossProfit)])))
    } else if (tab === 'product') {
      downloadCsv(`sales-by-product_${suffix}.csv`, toCsv(['Product', 'Units', 'Revenue (PHP)'], byProduct.map((r) => [r.name, r.qty, toPesoString(r.revenue)])))
    } else if (tab === 'category') {
      downloadCsv(`sales-by-category_${suffix}.csv`, toCsv(['Category', 'Units', 'Revenue (PHP)'], byCategory.map((r) => [r.name, r.qty, toPesoString(r.revenue)])))
    } else {
      downloadCsv('inventory-valuation.csv', toCsv(['SKU', 'Product', 'Stock', 'Unit cost (PHP)', 'Value (PHP)'], valuation.rows.map((r) => [r.product.sku, r.product.name, r.product.stock, toPesoString(r.product.cost), toPesoString(r.value)])))
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports"
        subtitle="Voided sales are excluded. Refunds come off revenue, and refunded units come off cost of goods."
        actions={<button type="button" className="btn btn-sm btn-primary" onClick={exportCsv}><FileDown className="size-4" /> Export CSV</button>}
      />

      {tab !== 'valuation' && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="join">
            {[7, 30].map((n) => (
              <button key={n} type="button" className="btn btn-sm join-item" onClick={() => preset(n)}>Last {n} days</button>
            ))}
          </div>
          <label className="input input-sm w-auto"><span className="text-base-content/60 text-xs">From</span><input type="date" value={range.from} max={range.to} onChange={(e) => e.target.value && setRange({ ...range, from: e.target.value })} /></label>
          <label className="input input-sm w-auto"><span className="text-base-content/60 text-xs">To</span><input type="date" value={range.to} min={range.from} onChange={(e) => e.target.value && setRange({ ...range, to: e.target.value })} /></label>
        </div>
      )}

      <div role="tablist" className="tabs tabs-box bg-base-100 mb-4 inline-flex flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'tab-active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab !== 'valuation' && (
        <div className="stats stats-vertical sm:stats-horizontal bg-base-100 border-base-300 mb-4 w-full border">
          <div className="stat"><div className="stat-title">Net sales</div><div className="stat-value text-2xl">{formatPHP(totalSales)}</div></div>
          <div className="stat"><div className="stat-title">Gross profit</div><div className="stat-value text-2xl">{formatPHP(totalProfit)}</div><div className="stat-desc">{totalSales ? Math.round((totalProfit / totalSales) * 100) : 0}% margin</div></div>
          <div className="stat"><div className="stat-title">Transactions</div><div className="stat-value text-2xl">{totalTx}</div></div>
        </div>
      )}

      <div className="card bg-base-100 border-base-300 border">
        <div className="card-body p-4">
          {tab === 'day' && (
            <>
              <h2 className="card-title text-base">Net sales per day</h2>
              <SalesChart rows={byDay} height={280} />
              <Table head={['Date', 'Transactions', 'Net sales', 'Gross profit']} rows={[...byDay].reverse().map((r) => [fmtDay(r.date), r.transactions, formatPHP(r.sales), formatPHP(r.grossProfit)])} />
            </>
          )}
          {tab === 'product' && <Table head={['Product', 'Units', 'Revenue']} rows={byProduct.map((r) => [r.name, r.qty, formatPHP(r.revenue)])} />}
          {tab === 'category' && <Table head={['Category', 'Units', 'Revenue', 'Share']} rows={byCategory.map((r) => [r.name, r.qty, formatPHP(r.revenue), `${totalSales ? Math.round((r.revenue / totalSales) * 100) : 0}%`])} />}
          {tab === 'valuation' && (
            <>
              <p className="text-lg">Stock on hand at cost: <b>{formatPHP(valuation.total)}</b></p>
              <Table head={['Product', 'Stock', 'Unit cost', 'Value']} rows={valuation.rows.map((r) => [r.product.name, r.product.stock, formatPHP(r.product.cost), formatPHP(r.value)])} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-sm table-zebra table">
        <thead><tr>{head.map((h, i) => <th key={h} className={i > 0 ? 'text-right' : ''}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, ri) => <tr key={ri}>{r.map((c, i) => <td key={i} className={i > 0 ? 'text-right' : ''}>{c}</td>)}</tr>)}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-base-content/60 py-8 text-center">No data in this range.</p>}
    </div>
  )
}

export default function ReportsPage() {
  return (
    <ManagerOnly action="reports.view">
      <Reports />
    </ManagerOnly>
  )
}
