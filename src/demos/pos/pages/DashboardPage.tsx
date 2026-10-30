import { TriangleAlert } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { formatPHP } from '../domain/money'
import { dashboard } from '../domain/reports'
import { ManagerOnly } from '../components/ManagerOnly'
import { SalesChart } from '../components/SalesChart'
import { fmtDateTime, STATUS_BADGE, statusLabel } from '../components/format'
import { currentData, usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

function Dashboard() {
  const sales = usePosStore((s) => s.sales)
  const products = usePosStore((s) => s.products)
  // Recompute when sales or stock change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const d = useMemo(() => dashboard(currentData(), new Date()), [sales, products])

  const stats = [
    { label: 'Today’s sales', value: formatPHP(d.todaySales) },
    { label: 'Transactions', value: String(d.transactions) },
    { label: 'Average basket', value: formatPHP(d.avgBasket) },
    { label: 'Gross profit today', value: formatPHP(d.grossProfit) },
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Dashboard" subtitle="Voided sales are excluded; refunds are subtracted." />
      <div className="stats stats-vertical sm:stats-horizontal bg-base-100 border-base-300 mb-4 w-full border">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-title">{s.label}</div>
            <div className="stat-value text-2xl">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card bg-base-100 border-base-300 border lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-base">Sales, last 7 days</h2>
            <SalesChart rows={d.last7} />
            <details className="text-sm">
              <summary className="text-base-content/60 cursor-pointer">Show as table</summary>
              <table className="table-sm table mt-2">
                <thead><tr><th>Day</th><th className="text-right">Sales</th><th className="text-right">Transactions</th></tr></thead>
                <tbody>
                  {d.last7.map((r) => (
                    <tr key={r.date}><td>{r.date}</td><td className="text-right">{formatPHP(r.sales)}</td><td className="text-right">{r.transactions}</td></tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
        </div>

        <div className="card bg-base-100 border-base-300 border">
          <div className="card-body">
            <h2 className="card-title text-base">
              <TriangleAlert className="text-warning size-5" /> Low stock
            </h2>
            {d.lowStock.length === 0 ? (
              <p className="text-base-content/60 text-sm">Everything is above its reorder level.</p>
            ) : (
              <ul className="divide-base-300 divide-y text-sm">
                {d.lowStock.slice(0, 8).map((p) => (
                  <li key={p.id} className="flex justify-between py-1.5">
                    <span>{p.name}</span>
                    <span className={`badge badge-sm ${p.stock === 0 ? 'badge-error' : 'badge-warning'}`}>
                      {p.stock} / {p.reorderLevel}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/demo/pos/inventory/stock-in" className="btn btn-sm btn-soft btn-primary mt-2">
              Receive stock
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 border-base-300 border lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-base">Top products, last 30 days</h2>
            <div className="overflow-x-auto">
              <table className="table-sm table">
                <thead><tr><th>Product</th><th className="text-right">Units</th><th className="text-right">Revenue</th></tr></thead>
                <tbody>
                  {d.topProducts.map((p) => (
                    <tr key={p.productId}><td>{p.name}</td><td className="text-right">{p.qty}</td><td className="text-right">{formatPHP(p.revenue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border-base-300 border">
          <div className="card-body">
            <h2 className="card-title text-base">Recent sales</h2>
            <ul className="divide-base-300 divide-y text-sm">
              {d.recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 py-1.5">
                  <Link to={`/demo/pos/sales/${s.id}`} className="link-hover">
                    <span className="font-mono">{s.orNumber}</span>
                    <span className="text-base-content/60 block text-xs">{fmtDateTime(s.at)}</span>
                  </Link>
                  <div className="text-right">
                    <span>{formatPHP(s.total)}</span>
                    {s.status !== 'completed' && <span className={`badge badge-xs ml-1 ${STATUS_BADGE[s.status]}`}>{statusLabel(s.status)}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ManagerOnly action="reports.view">
      <Dashboard />
    </ManagerOnly>
  )
}
