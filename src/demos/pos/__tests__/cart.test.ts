import { describe, expect, it } from 'vitest'
import { allocateOrderDiscount, computeTotals, maxLineDiscount, type CartLine } from '../domain/cart'
import { formatPHP, parsePesos, pesos } from '../domain/money'

const line = (unitPrice: number, qty: number, discount = 0): CartLine => ({
  productId: 'p',
  name: 'Item',
  qty,
  unitPrice: pesos(unitPrice),
  unitCost: 0,
  discount: pesos(discount),
})

describe('money', () => {
  it('stores pesos as whole centavos', () => {
    expect(pesos(0.1 + 0.2)).toBe(30)
    expect(pesos(123.45)).toBe(12345)
  })

  it('parses only valid peso amounts', () => {
    expect(parsePesos('85')).toBe(8500)
    expect(parsePesos('85.5')).toBe(8550)
    expect(parsePesos('85.555')).toBeNaN()
    expect(parsePesos('abc')).toBeNaN()
  })

  it('formats as Philippine pesos', () => {
    expect(formatPHP(123456)).toBe('₱1,234.56')
  })
})

describe('computeTotals (VAT-inclusive)', () => {
  it('splits 12% VAT out of the total', () => {
    const t = computeTotals([line(112, 1)], 0, 0.12, true)
    expect(t).toMatchObject({ subtotal: 11200, total: 11200, vatableSales: 10000, vat: 1200 })
  })

  it('rounds once at the total so lines never drift', () => {
    // 3 × ₱0.10 items: per-line rounding would differ from rounding the total.
    const t = computeTotals([line(0.1, 1), line(0.1, 1), line(0.1, 1)], 0, 0.12, true)
    expect(t.total).toBe(30)
    expect(t.vatableSales + t.vat).toBe(t.total)
  })

  it('applies line and order discounts before splitting VAT', () => {
    const t = computeTotals([line(100, 2, 20)], pesos(30), 0.12, true)
    expect(t.subtotal).toBe(20000)
    expect(t.discountTotal).toBe(5000)
    expect(t.total).toBe(15000)
    expect(t.vatableSales + t.vat).toBe(15000)
  })

  it('never lets the order discount push the total below zero', () => {
    const t = computeTotals([line(50, 1)], pesos(999), 0.12, true)
    expect(t.total).toBe(0)
    expect(t.discountTotal).toBe(5000)
  })
})

describe('computeTotals (VAT-exclusive)', () => {
  it('adds VAT on top', () => {
    const t = computeTotals([line(100, 1)], 0, 0.12, false)
    expect(t).toMatchObject({ vatableSales: 10000, vat: 1200, total: 11200 })
  })
})

describe('discount caps', () => {
  it('caps cashiers at 10% per line and lets managers go to 100%', () => {
    expect(maxLineDiscount('cashier', 10000)).toBe(1000)
    expect(maxLineDiscount('manager', 10000)).toBe(10000)
  })
})

describe('allocateOrderDiscount', () => {
  it('splits proportionally and adds up exactly', () => {
    const shares = allocateOrderDiscount([line(10, 1), line(20, 1), line(70, 1)], 1001)
    expect(shares.reduce((a, b) => a + b, 0)).toBe(1001)
    expect(shares[2]).toBeGreaterThan(shares[1])
  })
})
