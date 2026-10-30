import type { Centavos } from './money'
import { dayKey, linePaidAmounts } from './operations'
import { isLowStock } from './stock'
import type { ID, PosData, Product, Sale } from './types'

// Report rules: voided sales count for nothing; refunds are subtracted from revenue and their
// units from cost of goods sold; cost uses the snapshot on each sale line.

export const saleNet = (s: Sale): Centavos =>
  s.status === 'voided' ? 0 : s.total - s.refunds.reduce((sum, r) => sum + r.amount, 0)

export const saleCogs = (s: Sale): Centavos =>
  s.status === 'voided' ? 0 : s.lines.reduce((sum, l) => sum + l.unitCost * (l.qty - l.returnedQty), 0)

export interface DateRange {
  /** Inclusive local days, "YYYY-MM-DD". */
  from: string
  to: string
}

const inRange = (iso: string, r: DateRange) => {
  const k = dayKey(iso)
  return k >= r.from && k <= r.to
}

export function daysBetween(r: DateRange): string[] {
  const out: string[] = []
  const d = new Date(`${r.from}T00:00:00`)
  const end = new Date(`${r.to}T00:00:00`)
  while (d <= end) {
    out.push(dayKey(d.toISOString()))
    d.setDate(d.getDate() + 1)
  }
  return out
}

export function lastNDays(n: number, now: Date): DateRange {
  const start = new Date(now)
  start.setDate(start.getDate() - (n - 1))
  return { from: dayKey(start.toISOString()), to: dayKey(now.toISOString()) }
}

const countable = (data: PosData, r: DateRange) =>
  data.sales.filter((s) => s.status !== 'voided' && inRange(s.at, r))

export interface DayRow {
  date: string
  sales: Centavos
  transactions: number
  grossProfit: Centavos
}

export function salesByDay(data: PosData, r: DateRange): DayRow[] {
  const rows = new Map(daysBetween(r).map((date) => [date, { date, sales: 0, transactions: 0, grossProfit: 0 }]))
  for (const s of countable(data, r)) {
    const row = rows.get(dayKey(s.at))
    if (!row) continue
    row.sales += saleNet(s)
    row.transactions += 1
    row.grossProfit += saleNet(s) - saleCogs(s)
  }
  return [...rows.values()]
}

export interface ProductRow {
  productId: ID
  name: string
  categoryId: ID | undefined
  qty: number
  revenue: Centavos
}

export function salesByProduct(data: PosData, r: DateRange): ProductRow[] {
  const rows = new Map<ID, ProductRow>()
  for (const s of countable(data, r)) {
    const paid = linePaidAmounts(s)
    s.lines.forEach((l, i) => {
      const kept = l.qty - l.returnedQty
      if (kept === 0) return
      const row = rows.get(l.productId) ?? {
        productId: l.productId,
        name: l.name,
        categoryId: data.products.find((p) => p.id === l.productId)?.categoryId,
        qty: 0,
        revenue: 0,
      }
      row.qty += kept
      row.revenue += Math.round((paid[i] * kept) / l.qty)
      rows.set(l.productId, row)
    })
  }
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue)
}

export interface CategoryRow {
  categoryId: ID
  name: string
  qty: number
  revenue: Centavos
}

export function salesByCategory(data: PosData, r: DateRange): CategoryRow[] {
  const rows = new Map<ID, CategoryRow>()
  for (const p of salesByProduct(data, r)) {
    const id = p.categoryId ?? 'none'
    const row = rows.get(id) ?? {
      categoryId: id,
      name: data.categories.find((c) => c.id === id)?.name ?? 'Uncategorized',
      qty: 0,
      revenue: 0,
    }
    row.qty += p.qty
    row.revenue += p.revenue
    rows.set(id, row)
  }
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue)
}

export interface ValuationRow {
  product: Product
  value: Centavos
}

export function inventoryValuation(data: PosData): { rows: ValuationRow[]; total: Centavos } {
  const rows = data.products
    .filter((p) => p.active)
    .map((product) => ({ product, value: product.stock * product.cost }))
    .sort((a, b) => b.value - a.value)
  return { rows, total: rows.reduce((s, r) => s + r.value, 0) }
}

export function dashboard(data: PosData, now: Date) {
  const today = lastNDays(1, now)
  const todays = countable(data, today)
  const sales = todays.reduce((s, x) => s + saleNet(x), 0)
  const cogs = todays.reduce((s, x) => s + saleCogs(x), 0)
  return {
    todaySales: sales,
    transactions: todays.length,
    avgBasket: todays.length ? Math.round(sales / todays.length) : 0,
    grossProfit: sales - cogs,
    last7: salesByDay(data, lastNDays(7, now)),
    topProducts: salesByProduct(data, lastNDays(30, now)).slice(0, 5),
    lowStock: data.products.filter(isLowStock).sort((a, b) => a.stock - b.stock),
    recent: [...data.sales].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6),
  }
}

/**
 * RFC 4180-style CSV: quotes every field and doubles embedded quotes. Text starting with = + - @
 * gets a leading apostrophe so a spreadsheet won't run it as a formula.
 */
export function toCsv(header: string[], rows: (string | number)[][]): string {
  const cell = (v: string | number) => {
    const text = typeof v === 'string' && /^[=+\-@]/.test(v) ? `'${v}` : String(v)
    return `"${text.replace(/"/g, '""')}"`
  }
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')
}
