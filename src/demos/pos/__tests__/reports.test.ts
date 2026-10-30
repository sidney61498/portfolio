import { describe, expect, it } from 'vitest'
import { pesos } from '../domain/money'
import * as ops from '../domain/operations'
import { dashboard, salesByCategory, salesByDay, salesByProduct, toCsv } from '../domain/reports'
import { baseData, buildSeed } from '../seed/seed'

const AT = '2026-10-30T10:00:00+08:00'
const range = { from: '2026-10-30', to: '2026-10-30' }

function scenario() {
  let d = baseData('2026-10-01T06:00:00+08:00')
  const a = ops.checkout(d, { lines: [{ productId: 'p-01', qty: 2, discount: 0 }], orderDiscount: 0, payment: { method: 'cash', tendered: pesos(30) }, role: 'cashier', at: AT })
  d = a.data
  const b = ops.checkout(d, { lines: [{ productId: 'p-02', qty: 4, discount: 0 }], orderDiscount: 0, payment: { method: 'cash', tendered: pesos(100) }, role: 'cashier', at: AT })
  d = ops.voidSale(b.data, { saleId: b.sale.id, reason: 'x', role: 'manager', at: AT })
  const c = ops.checkout(d, { lines: [{ productId: 'p-02', qty: 2, discount: 0 }], orderDiscount: 0, payment: { method: 'cash', tendered: pesos(50) }, role: 'cashier', at: AT })
  d = ops.refundSale(c.data, { saleId: c.sale.id, items: [{ productId: 'p-02', qty: 1 }], reason: 'x', role: 'manager', at: AT }).data
  return d
}

describe('reports', () => {
  it('exclude voided sales and subtract refunds', () => {
    const [day] = salesByDay(scenario(), range)
    expect(day.transactions).toBe(2)
    expect(day.sales).toBe(pesos(30 + 25))
  })

  it('product revenue only counts units the customer kept', () => {
    const rows = salesByProduct(scenario(), range)
    const cola = rows.find((r) => r.productId === 'p-02')!
    expect(cola.qty).toBe(1)
    expect(cola.revenue).toBe(pesos(25))
  })

  it('category totals equal product totals', () => {
    const d = scenario()
    const byProduct = salesByProduct(d, range).reduce((s, r) => s + r.revenue, 0)
    const byCategory = salesByCategory(d, range).reduce((s, r) => s + r.revenue, 0)
    expect(byCategory).toBe(byProduct)
  })

  it('dashboard today matches the daily report', () => {
    const now = new Date('2026-10-30T15:00:00+08:00')
    const seeded = buildSeed(now)
    const dash = dashboard(seeded, now)
    expect(dash.last7).toHaveLength(7)
    expect(dash.last7[6].sales).toBe(dash.todaySales)
  })

  it('CSV quotes fields and neutralises formulas', () => {
    expect(toCsv(['a', 'b'], [['=SUM(A1)', 'say "hi"']])).toBe('"a","b"\r\n"\'=SUM(A1)","say ""hi"""')
  })
})
