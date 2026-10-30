import { beforeEach, describe, expect, it } from 'vitest'
import { pesos } from '../domain/money'
import * as ops from '../domain/operations'
import { PermissionError } from '../domain/permissions'
import { ledgerMismatches, StockError } from '../domain/stock'
import type { PosData } from '../domain/types'
import { baseData, buildSeed } from '../seed/seed'

const AT = '2026-10-30T10:00:00+08:00'
let data: PosData

const stockOf = (d: PosData, id: string) => d.products.find((p) => p.id === id)!.stock
const cash = (tendered: number) => ({ method: 'cash' as const, tendered: pesos(tendered) })

// p-01 Bottled Water ₱15 (stock 120), p-02 Cola ₱25 (stock 96)
beforeEach(() => {
  data = baseData('2026-10-01T06:00:00+08:00')
})

describe('checkout', () => {
  it('records the sale, reduces stock and writes SALE movements', () => {
    const { data: next, sale } = ops.checkout(data, {
      lines: [
        { productId: 'p-01', qty: 2, discount: 0 },
        { productId: 'p-02', qty: 1, discount: 0 },
      ],
      orderDiscount: 0,
      payment: cash(100),
      role: 'cashier',
      at: AT,
    })
    expect(sale.total).toBe(pesos(55))
    expect(sale.change).toBe(pesos(45))
    expect(sale.orNumber).toBe('OR-000001')
    expect(stockOf(next, 'p-01')).toBe(118)
    expect(next.movements.filter((m) => m.refId === sale.id)).toHaveLength(2)
    expect(ledgerMismatches(next)).toEqual([])
  })

  it('uses catalog prices, not prices sent from the cart', () => {
    const input = { productId: 'p-01', qty: 1, discount: 0, unitPrice: 1 } as never
    const { sale } = ops.checkout(data, { lines: [input], orderDiscount: 0, payment: cash(15), role: 'cashier', at: AT })
    expect(sale.total).toBe(pesos(15))
  })

  it('blocks selling more than is on hand, even split across two lines, and changes nothing', () => {
    const attempt = () =>
      ops.checkout(data, {
        lines: [
          { productId: 'p-01', qty: 100, discount: 0 },
          { productId: 'p-01', qty: 21, discount: 0 },
        ],
        orderDiscount: 0,
        payment: cash(5000),
        role: 'cashier',
        at: AT,
      })
    expect(attempt).toThrow(StockError)
    expect(stockOf(data, 'p-01')).toBe(120)
  })

  it('rejects cash below the total', () => {
    expect(() =>
      ops.checkout(data, { lines: [{ productId: 'p-02', qty: 1, discount: 0 }], orderDiscount: 0, payment: cash(20), role: 'cashier', at: AT }),
    ).toThrow(/less than the total/)
  })

  it('requires an e-wallet reference', () => {
    expect(() =>
      ops.checkout(data, {
        lines: [{ productId: 'p-02', qty: 1, discount: 0 }],
        orderDiscount: 0,
        payment: { method: 'ewallet', reference: '12' },
        role: 'cashier',
        at: AT,
      }),
    ).toThrow(/reference/)
  })

  it('caps cashier line discounts at 10% and allows managers more', () => {
    const lines = [{ productId: 'p-02', qty: 4, discount: pesos(20) }] // 20% of ₱100
    expect(() => ops.checkout(data, { lines, orderDiscount: 0, payment: cash(100), role: 'cashier', at: AT })).toThrow(/10%/)
    expect(ops.checkout(data, { lines, orderDiscount: 0, payment: cash(100), role: 'manager', at: AT }).sale.total).toBe(pesos(80))
  })

  it('only lets managers give an order discount', () => {
    const input = { lines: [{ productId: 'p-02', qty: 1, discount: 0 }], orderDiscount: pesos(5), payment: cash(25), at: AT }
    expect(() => ops.checkout(data, { ...input, role: 'cashier' })).toThrow(PermissionError)
    expect(ops.checkout(data, { ...input, role: 'manager' }).sale.total).toBe(pesos(20))
  })

  it('never reuses OR numbers', () => {
    const one = ops.checkout(data, { lines: [{ productId: 'p-01', qty: 1, discount: 0 }], orderDiscount: 0, payment: cash(15), role: 'cashier', at: AT })
    const voided = ops.voidSale(one.data, { saleId: one.sale.id, reason: 'test', role: 'manager', at: AT })
    const two = ops.checkout(voided, { lines: [{ productId: 'p-01', qty: 1, discount: 0 }], orderDiscount: 0, payment: cash(15), role: 'cashier', at: AT })
    expect(two.sale.orNumber).toBe('OR-000002')
  })
})

describe('void and refund', () => {
  const sell = () =>
    ops.checkout(data, {
      lines: [
        { productId: 'p-01', qty: 3, discount: 0 },
        { productId: 'p-02', qty: 2, discount: 0 },
      ],
      orderDiscount: 0,
      payment: cash(200),
      role: 'cashier',
      at: AT,
    })

  it('void restores all stock and marks the sale voided', () => {
    const { data: sold, sale } = sell()
    const next = ops.voidSale(sold, { saleId: sale.id, reason: 'Wrong item', role: 'manager', at: AT })
    expect(stockOf(next, 'p-01')).toBe(120)
    expect(stockOf(next, 'p-02')).toBe(96)
    expect(next.sales[0].status).toBe('voided')
    expect(ledgerMismatches(next)).toEqual([])
  })

  it('cashiers cannot void', () => {
    const { data: sold, sale } = sell()
    expect(() => ops.voidSale(sold, { saleId: sale.id, reason: 'x', role: 'cashier', at: AT })).toThrow(PermissionError)
  })

  it('voids only on the same day', () => {
    const { data: sold, sale } = sell()
    expect(() => ops.voidSale(sold, { saleId: sale.id, reason: 'x', role: 'manager', at: '2026-10-31T10:00:00+08:00' })).toThrow(/same day/)
  })

  it('needs a reason', () => {
    const { data: sold, sale } = sell()
    expect(() => ops.voidSale(sold, { saleId: sale.id, reason: '  ', role: 'manager', at: AT })).toThrow(/reason/)
  })

  it('partial refund restores only the refunded quantity and returns what was paid', () => {
    const { data: sold, sale } = sell()
    const { data: next, amount } = ops.refundSale(sold, {
      saleId: sale.id,
      items: [{ productId: 'p-01', qty: 1 }],
      reason: 'Changed mind',
      role: 'manager',
      at: AT,
    })
    expect(amount).toBe(pesos(15))
    expect(stockOf(next, 'p-01')).toBe(118)
    expect(next.sales[0].status).toBe('partially_refunded')
  })

  it('refunding everything in pieces adds up to exactly the amount paid', () => {
    const { data: sold, sale } = ops.checkout(data, {
      lines: [{ productId: 'p-02', qty: 3, discount: 0 }],
      orderDiscount: pesos(10),
      payment: cash(100),
      role: 'manager',
      at: AT,
    })
    let d = sold
    let refunded = 0
    for (let i = 0; i < 3; i++) {
      const r = ops.refundSale(d, { saleId: sale.id, items: [{ productId: 'p-02', qty: 1 }], reason: 'x', role: 'manager', at: AT })
      d = r.data
      refunded += r.amount
    }
    expect(refunded).toBe(sale.total)
    expect(d.sales[0].status).toBe('refunded')
  })

  it('cannot refund more than is left', () => {
    const { data: sold, sale } = sell()
    expect(() =>
      ops.refundSale(sold, { saleId: sale.id, items: [{ productId: 'p-02', qty: 3 }], reason: 'x', role: 'manager', at: AT }),
    ).toThrow(/can still be refunded/)
  })
})

describe('inventory', () => {
  it('stock-in adds stock, records the document and updates cost', () => {
    const next = ops.receiveStock(data, { supplierId: 'sup-a', lines: [{ productId: 'p-01', qty: 24, unitCost: pesos(10) }], role: 'manager', at: AT })
    expect(stockOf(next, 'p-01')).toBe(144)
    expect(next.products.find((p) => p.id === 'p-01')!.cost).toBe(pesos(10))
    expect(next.stockIns[0].number).toBe('SI-0001')
  })

  it('adjustments need a reason and cannot go below zero', () => {
    expect(() => ops.adjustStock(data, { productId: 'p-01', delta: -1, reason: '', role: 'manager', at: AT })).toThrow(/reason/)
    expect(() => ops.adjustStock(data, { productId: 'p-01', delta: -121, reason: 'Damaged', role: 'manager', at: AT })).toThrow(StockError)
  })

  it('cashiers cannot change inventory or the catalog', () => {
    expect(() => ops.adjustStock(data, { productId: 'p-01', delta: 1, reason: 'Count correction', role: 'cashier', at: AT })).toThrow(PermissionError)
    expect(() => ops.saveCategory(data, { name: 'New' }, 'cashier')).toThrow(PermissionError)
  })

  it('new products get an INITIAL movement; edits never change stock', () => {
    const input = { name: 'Test Item', sku: 'tst-1', barcode: '1234567', categoryId: 'cat-bev', cost: 100, price: 200, reorderLevel: 2, active: true, initialStock: 5 }
    const created = ops.saveProduct(data, input, 'manager', AT)
    const product = created.products.find((p) => p.sku === 'TST-1')!
    expect(product.stock).toBe(5)
    const edited = ops.saveProduct(created, { ...input, id: product.id, initialStock: 999 }, 'manager', AT)
    expect(edited.products.find((p) => p.id === product.id)!.stock).toBe(5)
    expect(ledgerMismatches(edited)).toEqual([])
  })

  it('rejects duplicate SKUs and barcodes', () => {
    const p1 = data.products[0]
    const base = { name: 'Dup', sku: 'NEW-1', barcode: '99999999', categoryId: 'cat-bev', cost: 1, price: 2, reorderLevel: 0, active: true }
    expect(() => ops.saveProduct(data, { ...base, sku: p1.sku }, 'manager', AT)).toThrow(/SKU/)
    expect(() => ops.saveProduct(data, { ...base, barcode: p1.barcode }, 'manager', AT)).toThrow(/Barcode/)
  })

  it('cannot delete a category that still has products', () => {
    expect(() => ops.deleteCategory(data, 'cat-bev', 'manager')).toThrow(/still has products/)
  })
})

describe('seed', () => {
  it('builds a consistent ledger with every sale status and a low-stock item', () => {
    const seeded = buildSeed(new Date('2026-10-30T15:00:00+08:00'))
    expect(ledgerMismatches(seeded)).toEqual([])
    expect(seeded.sales.length).toBeGreaterThan(200)
    const statuses = new Set(seeded.sales.map((s) => s.status))
    expect(statuses).toContain('voided')
    expect(statuses).toContain('partially_refunded')
    expect(seeded.products.some((p) => p.stock === 0)).toBe(true)
    expect(seeded.products.filter((p) => p.stock <= p.reorderLevel).length).toBeGreaterThanOrEqual(2)
  })
})
