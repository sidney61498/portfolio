// Builds the demo store: a fictional sari-sari store and café with ~30 days of history.
// Everything goes through the real operations, so the seeded ledger is consistent by
// construction. Randomness is seeded, so every reset produces the same pattern.

import { pesos } from '../domain/money'
import { adjustStock, checkout, dayKey, receiveStock, refundSale, voidSale } from '../domain/operations'
import { applyMovements } from '../domain/stock'
import type { Category, PosData, Product, Role, Settings, Supplier } from '../domain/types'

export const DEFAULT_SETTINGS: Settings = {
  storeName: 'Tindahan ni Sidney',
  address: 'Brgy. San Agustin, Sarrat, Ilocos Norte',
  tin: '000-123-456-00000 (demo)',
  vatRate: 0.12,
  vatInclusive: true,
  lowStockDefault: 10,
  managerPin: '1234',
}

const CATEGORIES: Category[] = [
  { id: 'cat-bev', name: 'Beverages' },
  { id: 'cat-snk', name: 'Snacks & Bakery' },
  { id: 'cat-gro', name: 'Grocery' },
  { id: 'cat-per', name: 'Personal Care' },
  { id: 'cat-hou', name: 'Household' },
  { id: 'cat-cof', name: 'Coffee Bar' },
]

// Fictional suppliers only.
const SUPPLIERS: Supplier[] = [
  { id: 'sup-a', name: 'Amianan Trading', contact: '0900 000 0001' },
  { id: 'sup-b', name: 'Paoay Snack House', contact: '0900 000 0002' },
  { id: 'sup-c', name: 'Batac Wholesale', contact: '0900 000 0003' },
  { id: 'sup-d', name: 'Sarrat Bakehouse Supply', contact: '0900 000 0004' },
]

type Row = [category: string, supplier: string, name: string, cost: number, price: number, stock: number, reorder: number, weight?: number]

const PRODUCTS: Row[] = [
  ['cat-bev', 'sup-a', 'Bottled Water 500ml', 9, 15, 120, 24, 3],
  ['cat-bev', 'sup-a', 'Cola 290ml', 17, 25, 96, 24, 2],
  ['cat-bev', 'sup-a', 'Lemon-Lime Soda 1.5L', 62, 85, 36, 8],
  ['cat-bev', 'sup-a', 'Calamansi Juice 250ml', 14, 22, 60, 12],
  ['cat-bev', 'sup-a', 'Iced Tea 500ml', 19, 28, 60, 12],
  ['cat-bev', 'sup-a', 'Chocolate Milk 250ml', 22, 32, 48, 12],
  ['cat-bev', 'sup-c', 'Coffee 3-in-1 Sachet', 7, 10, 200, 40, 3],
  ['cat-snk', 'sup-b', 'Chicharon 60g', 28, 40, 40, 10],
  ['cat-snk', 'sup-b', 'Banana Chips 100g', 32, 45, 40, 10],
  ['cat-snk', 'sup-b', 'Adobong Mani 100g', 25, 35, 40, 10],
  ['cat-snk', 'sup-b', 'Cheese Crackers', 6, 9, 150, 30, 2],
  ['cat-snk', 'sup-d', 'Pandesal (10 pcs)', 22, 30, 30, 10, 2],
  ['cat-snk', 'sup-d', 'Ensaymada', 18, 28, 24, 8],
  ['cat-snk', 'sup-d', 'Polvoron (6 pcs)', 35, 50, 24, 6],
  ['cat-gro', 'sup-c', 'Corned Beef 150g', 42, 58, 48, 12],
  ['cat-gro', 'sup-c', 'Sardines in Tomato Sauce 155g', 18, 25, 72, 18, 2],
  ['cat-gro', 'sup-c', 'Tuna Flakes 180g', 30, 42, 48, 12],
  ['cat-gro', 'sup-c', 'Pork & Beans 230g', 24, 34, 36, 10],
  ['cat-gro', 'sup-c', 'Liver Spread 85g', 20, 28, 36, 10],
  ['cat-gro', 'sup-c', 'Evaporated Milk 370ml', 34, 45, 36, 10],
  ['cat-gro', 'sup-c', 'Ube Halaya Jar 250g', 85, 120, 10, 6],
  ['cat-gro', 'sup-c', 'Instant Pancit Canton', 11, 16, 120, 30, 3],
  ['cat-gro', 'sup-c', 'Rice 1kg', 48, 58, 50, 15, 2],
  ['cat-gro', 'sup-a', 'Eggs (6 pcs)', 45, 60, 30, 10],
  ['cat-gro', 'sup-c', 'Peanut Butter 220g', 70, 95, 8, 5],
  ['cat-per', 'sup-c', 'Shampoo Sachet', 6, 9, 150, 30, 2],
  ['cat-per', 'sup-c', 'Bath Soap 90g', 30, 42, 48, 12],
  ['cat-per', 'sup-c', 'Toothpaste 50g', 38, 52, 36, 10],
  ['cat-per', 'sup-c', 'Toothbrush', 25, 38, 30, 8],
  ['cat-per', 'sup-c', 'Rubbing Alcohol 250ml', 45, 65, 30, 8],
  ['cat-per', 'sup-c', 'Face Mask (5 pcs)', 15, 25, 40, 10],
  ['cat-hou', 'sup-a', 'Laundry Powder 70g', 9, 14, 100, 25, 2],
  ['cat-hou', 'sup-a', 'Dishwashing Liquid 250ml', 32, 45, 36, 10],
  ['cat-hou', 'sup-a', 'Candles (4 pcs)', 20, 30, 24, 6],
  ['cat-hou', 'sup-a', 'Matches (10 boxes)', 12, 18, 30, 8],
  ['cat-hou', 'sup-a', 'Garbage Bags (10 pcs)', 38, 55, 24, 6],
  ['cat-cof', 'sup-d', 'Hot Americano 12oz', 28, 75, 60, 15, 2],
  ['cat-cof', 'sup-d', 'Iced Coffee 16oz', 35, 85, 60, 15, 3],
  ['cat-cof', 'sup-d', 'Ube Latte 16oz', 45, 120, 50, 12, 2],
  ['cat-cof', 'sup-d', 'Calamansi Cooler 16oz', 25, 70, 50, 12],
]

/** Never restocked in the seed, so the low-stock alerts have something to show. */
const NO_RESTOCK = new Set(['Ube Halaya Jar 250g', 'Peanut Butter 220g'])
/** Counted to zero at the end, so one product shows as out of stock. */
const OUT_OF_STOCK = 'Candles (4 pcs)'

const SKU_PREFIX: Record<string, string> = {
  'cat-bev': 'BEV',
  'cat-snk': 'SNK',
  'cat-gro': 'GRO',
  'cat-per': 'PER',
  'cat-hou': 'HOU',
  'cat-cof': 'COF',
}

/** mulberry32: tiny seeded PRNG so the demo history is the same on every reset. */
function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedProducts(): Product[] {
  return PRODUCTS.map(([categoryId, supplierId, name, cost, price, , reorderLevel], i) => ({
    id: `p-${String(i + 1).padStart(2, '0')}`,
    sku: `${SKU_PREFIX[categoryId]}-${String(i + 1).padStart(3, '0')}`,
    barcode: `480${String(1_000_000_000 + (i + 1) * 7919).slice(-10)}`,
    name,
    categoryId,
    supplierId,
    cost: pesos(cost),
    price: pesos(price),
    stock: 0,
    reorderLevel,
    active: true,
  }))
}

/** An empty store with the catalog and opening stock, and no history. Used by tests. */
export function baseData(at: string): PosData {
  const products = seedProducts()
  const opening = applyMovements(
    products,
    PRODUCTS.map(([, , , , , stock], i) => ({
      productId: products[i].id,
      type: 'INITIAL' as const,
      qty: stock,
      role: 'manager' as const,
      at,
      reason: 'Opening stock',
    })),
  )
  return {
    settings: { ...DEFAULT_SETTINGS },
    categories: CATEGORIES.map((c) => ({ ...c })),
    suppliers: SUPPLIERS.map((s) => ({ ...s })),
    products: opening.products,
    movements: opening.movements,
    sales: [],
    stockIns: [],
    orCounter: 0,
    stockInCounter: 0,
  }
}

const atTime = (base: Date, daysAgo: number, hour: number, minute: number) => {
  const d = new Date(base)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d
}

type Random = () => number

function restock(data: PosData, at: string): PosData {
  // Everything running low (except the NO_RESTOCK items) gets topped up, one stock-in per supplier.
  const bySupplier = new Map<string, { productId: string; qty: number; unitCost: number }[]>()
  for (const p of data.products) {
    if (NO_RESTOCK.has(p.name) || p.stock >= p.reorderLevel * 3) continue
    const lines = bySupplier.get(p.supplierId!) ?? []
    lines.push({ productId: p.id, qty: p.reorderLevel * 4, unitCost: p.cost })
    bySupplier.set(p.supplierId!, lines)
  }
  for (const [supplierId, lines] of bySupplier) {
    data = receiveStock(data, { supplierId, lines, role: 'manager', at })
  }
  return data
}

function simulateSale(data: PosData, random: Random, weighted: number[], at: string): PosData {
  const chosen = new Map<string, number>()
  const lineCount = 1 + Math.floor(random() * 4)
  for (let i = 0; i < lineCount; i++) {
    const product = data.products[weighted[Math.floor(random() * weighted.length)]]
    const qty = 1 + Math.floor(random() * 3)
    const already = chosen.get(product.id) ?? 0
    if (product.stock - already >= qty) chosen.set(product.id, already + qty)
  }
  if (chosen.size === 0) return data

  const role: Role = random() < 0.2 ? 'manager' : 'cashier'
  const lines = [...chosen].map(([productId, qty]) => ({ productId, qty, discount: 0 }))
  const total = lines.reduce((s, l) => s + data.products.find((p) => p.id === l.productId)!.price * l.qty, 0)
  const payment =
    random() < 0.75
      ? { method: 'cash' as const, tendered: random() < 0.3 ? total : Math.ceil(total / 5000) * 5000 }
      : { method: 'ewallet' as const, reference: `EW${Math.floor(100000 + random() * 900000)}` }

  return checkout(data, { lines, orderDiscount: 0, payment, role, at }).data
}

function simulateDay(data: PosData, random: Random, weighted: number[], now: Date, daysAgo: number): PosData {
  const count = 8 + Math.floor(random() * 10)
  const times = Array.from({ length: count }, () =>
    atTime(now, daysAgo, 7 + Math.floor(random() * 13), Math.floor(random() * 60)),
  )
    .filter((t) => t <= now)
    .sort((a, b) => a.getTime() - b.getTime())
  for (const time of times) data = simulateSale(data, random, weighted, time.toISOString())
  return data
}

/**
 * Edge cases, applied on the day they are dated so the ledger stays chronological:
 * damaged goods (5 days ago), a partial refund (2 days ago), a same-day void and a product
 * counted to zero (today).
 */
function addEdgeCases(data: PosData, now: Date, daysAgo: number): PosData {
  if (daysAgo === 5) {
    const eggs = data.products.find((p) => p.name === 'Eggs (6 pcs)')!
    if (eggs.stock >= 2) {
      data = adjustStock(data, { productId: eggs.id, delta: -2, reason: 'Damaged', role: 'manager', at: atTime(now, 5, 21, 0).toISOString() })
    }
  }

  if (daysAgo === 2) {
    const day = dayKey(atTime(now, 2, 12, 0).toISOString())
    const refundable = data.sales.find((s) => dayKey(s.at) === day && s.lines.some((l) => l.qty >= 2))
    if (refundable) {
      const line = refundable.lines.find((l) => l.qty >= 2)!
      data = refundSale(data, {
        saleId: refundable.id,
        items: [{ productId: line.productId, qty: 1 }],
        reason: 'Customer changed mind',
        role: 'manager',
        at: atTime(now, 2, 20, 30).toISOString(),
      }).data
    }
  }

  if (daysAgo === 0) {
    const todayKey = dayKey(now.toISOString())
    const lastToday = data.sales.findLast((s) => dayKey(s.at) === todayKey)
    if (lastToday) {
      data = voidSale(data, { saleId: lastToday.id, reason: 'Wrong item rung up', role: 'manager', at: now.toISOString() })
    }
    const candles = data.products.find((p) => p.name === OUT_OF_STOCK)!
    if (candles.stock > 0) {
      data = adjustStock(data, { productId: candles.id, delta: -candles.stock, reason: 'Count correction', role: 'manager', at: now.toISOString() })
    }
  }
  return data
}

export function buildSeed(now: Date = new Date()): PosData {
  const random = rng(20261030)
  // Popular items appear several times, so they sell more often.
  const weighted = PRODUCTS.flatMap(([, , , , , , , weight = 1], i) => new Array<number>(weight).fill(i))

  let data = baseData(atTime(now, 30, 6, 0).toISOString())
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    if (daysAgo === 20 || daysAgo === 10) data = restock(data, atTime(now, daysAgo, 6, 30).toISOString())
    data = simulateDay(data, random, weighted, now, daysAgo)
    data = addEdgeCases(data, now, daysAgo)
  }
  return data
}
