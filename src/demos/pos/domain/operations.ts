// Every write in the demo is one of these pure functions: (data, input) → new data.
// They validate, check permissions and keep the stock ledger consistent, and they never touch
// React or storage, so they are easy to test and could sit behind a real API unchanged.

import { allocateOrderDiscount, computeTotals, lineGross, lineNet, maxLineDiscount, type CartLine } from './cart'
import type { Centavos } from './money'
import { assertCan } from './permissions'
import { applyMovements, newId, type MovementInput } from './stock'
import type { Category, ID, PaymentMethod, PosData, Product, Role, Sale, Settings, StockInLine, Supplier } from './types'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ValidationError(message)
}

const isWhole = (n: number) => Number.isInteger(n)
const isMoney = (n: number) => Number.isInteger(n) && n >= 0

/** Local calendar day, e.g. "2026-10-30". Used for "same day" rules and daily reports. */
export function dayKey(iso: string): string {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** Splits `total` across `weights` proportionally; the last share absorbs rounding. */
export function distribute(total: Centavos, weights: number[]): Centavos[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum === 0) return weights.map(() => 0)
  const shares = weights.map((w) => Math.floor((total * w) / sum))
  shares[shares.length - 1] += total - shares.reduce((a, b) => a + b, 0)
  return shares
}

/** What the customer actually paid for each line, order discount and VAT included. */
export function linePaidAmounts(sale: Pick<Sale, 'lines' | 'orderDiscount' | 'total'>): Centavos[] {
  const alloc = allocateOrderDiscount(sale.lines, sale.orderDiscount)
  const afterOrderDiscount = sale.lines.map((l, i) => lineNet(l) - alloc[i])
  return distribute(sale.total, afterOrderDiscount)
}

// ---- Checkout ------------------------------------------------------------------------------

export interface CheckoutInput {
  lines: Pick<CartLine, 'productId' | 'qty' | 'discount'>[]
  orderDiscount: Centavos
  payment: { method: PaymentMethod; tendered?: Centavos; reference?: string }
  role: Role
  at: string
}

export function checkout(data: PosData, input: CheckoutInput): { data: PosData; sale: Sale } {
  const { role, at } = input
  assertCan(role, 'register.use')
  invariant(input.lines.length > 0, 'The cart is empty.')

  // Prices come from the catalog, never from the cart, so a stale or edited cart can't change them.
  const lines: CartLine[] = input.lines.map((l) => {
    const product = data.products.find((p) => p.id === l.productId)
    invariant(product && product.active, 'A product in the cart is no longer available.')
    invariant(isWhole(l.qty) && l.qty >= 1, `Quantity for ${product.name} must be at least 1.`)
    const line: CartLine = {
      productId: product.id,
      name: product.name,
      qty: l.qty,
      unitPrice: product.price,
      unitCost: product.cost,
      discount: l.discount,
    }
    const gross = lineGross(line)
    invariant(isMoney(l.discount) && l.discount <= gross, `Discount on ${product.name} can't exceed the line amount.`)
    invariant(
      l.discount <= maxLineDiscount(role, gross),
      `Cashiers can discount up to 10% per line. Ask a manager for ${product.name}.`,
    )
    return line
  })

  invariant(isMoney(input.orderDiscount), 'Order discount must be a positive amount.')
  if (input.orderDiscount > 0) assertCan(role, 'discount.order')

  const { vatRate, vatInclusive } = data.settings
  const totals = computeTotals(lines, input.orderDiscount, vatRate, vatInclusive)
  const appliedOrderDiscount = totals.discountTotal - lines.reduce((s, l) => s + l.discount, 0)

  const { method, tendered, reference } = input.payment
  let change = 0
  if (method === 'cash') {
    invariant(tendered !== undefined && isMoney(tendered), 'Enter the cash amount received.')
    invariant(tendered >= totals.total, 'Cash received is less than the total.')
    change = tendered - totals.total
  } else {
    invariant((reference ?? '').trim().length >= 4, 'Enter the e-wallet reference number (at least 4 characters).')
  }

  const saleId = newId()
  const movementInputs: MovementInput[] = lines.map((l) => ({
    productId: l.productId,
    type: 'SALE',
    qty: -l.qty,
    role,
    at,
    refType: 'sale',
    refId: saleId,
  }))
  // Throws (and changes nothing) if any line, or the same product on two lines, exceeds stock.
  const { products, movements } = applyMovements(data.products, movementInputs)

  const orCounter = data.orCounter + 1
  const sale: Sale = {
    id: saleId,
    orNumber: `OR-${String(orCounter).padStart(6, '0')}`,
    lines: lines.map((l) => ({ ...l, returnedQty: 0 })),
    orderDiscount: appliedOrderDiscount,
    ...totals,
    payment: {
      method,
      amount: totals.total,
      ...(method === 'cash' ? { tendered } : { reference: reference!.trim() }),
    },
    change,
    status: 'completed',
    role,
    at,
    refunds: [],
  }

  return {
    sale,
    data: { ...data, products, movements: [...data.movements, ...movements], sales: [...data.sales, sale], orCounter },
  }
}

// ---- Void and refund -----------------------------------------------------------------------

export function voidSale(
  data: PosData,
  input: { saleId: ID; reason: string; role: Role; at: string },
): PosData {
  assertCan(input.role, 'sales.void')
  const sale = data.sales.find((s) => s.id === input.saleId)
  invariant(sale, 'Sale not found.')
  invariant(sale.status === 'completed', 'Only completed sales with no refunds can be voided.')
  invariant(dayKey(sale.at) === dayKey(input.at), 'Sales can only be voided on the same day. Use a refund instead.')
  invariant(input.reason.trim().length > 0, 'A reason is required to void a sale.')

  const { products, movements } = applyMovements(
    data.products,
    sale.lines.map((l) => ({
      productId: l.productId,
      type: 'RETURN' as const,
      qty: l.qty,
      role: input.role,
      at: input.at,
      refType: 'sale' as const,
      refId: sale.id,
      reason: `Void: ${input.reason.trim()}`,
    })),
  )

  return {
    ...data,
    products,
    movements: [...data.movements, ...movements],
    sales: data.sales.map((s) =>
      s.id === sale.id
        ? { ...s, status: 'voided', voidReason: input.reason.trim(), lines: s.lines.map((l) => ({ ...l, returnedQty: l.qty })) }
        : s,
    ),
  }
}

export function refundSale(
  data: PosData,
  input: { saleId: ID; items: { productId: ID; qty: number }[]; reason: string; role: Role; at: string },
): { data: PosData; amount: Centavos } {
  assertCan(input.role, 'sales.void')
  const sale = data.sales.find((s) => s.id === input.saleId)
  invariant(sale, 'Sale not found.')
  invariant(sale.status !== 'voided' && sale.status !== 'refunded', 'This sale has nothing left to refund.')
  invariant(input.reason.trim().length > 0, 'A reason is required for a refund.')
  const items = input.items.filter((i) => i.qty > 0)
  invariant(items.length > 0, 'Choose at least one item to refund.')

  const paid = linePaidAmounts(sale)
  let amount = 0
  const lines = sale.lines.map((l) => ({ ...l }))

  for (const item of items) {
    const index = lines.findIndex((l) => l.productId === item.productId)
    invariant(index >= 0, 'That item is not on this sale.')
    const line = lines[index]
    invariant(isWhole(item.qty), 'Refund quantity must be a whole number.')
    invariant(item.qty <= line.qty - line.returnedQty, `Only ${line.qty - line.returnedQty} of ${line.name} can still be refunded.`)
    // Cumulative rounding: refunding all units across several refunds adds up to exactly what was paid.
    const before = Math.round((paid[index] * line.returnedQty) / line.qty)
    line.returnedQty += item.qty
    amount += Math.round((paid[index] * line.returnedQty) / line.qty) - before
  }

  const { products, movements } = applyMovements(
    data.products,
    items.map((i) => ({
      productId: i.productId,
      type: 'RETURN' as const,
      qty: i.qty,
      role: input.role,
      at: input.at,
      refType: 'sale' as const,
      refId: sale.id,
      reason: `Refund: ${input.reason.trim()}`,
    })),
  )

  const fullyReturned = lines.every((l) => l.returnedQty === l.qty)
  const updated: Sale = {
    ...sale,
    lines,
    status: fullyReturned ? 'refunded' : 'partially_refunded',
    refunds: [...sale.refunds, { at: input.at, reason: input.reason.trim(), amount, items }],
  }

  return {
    amount,
    data: {
      ...data,
      products,
      movements: [...data.movements, ...movements],
      sales: data.sales.map((s) => (s.id === sale.id ? updated : s)),
    },
  }
}

// ---- Stock in and adjustments --------------------------------------------------------------

export function receiveStock(
  data: PosData,
  input: { supplierId: ID; lines: StockInLine[]; role: Role; at: string },
): PosData {
  assertCan(input.role, 'inventory.adjust')
  invariant(data.suppliers.some((s) => s.id === input.supplierId), 'Choose a supplier.')
  invariant(input.lines.length > 0, 'Add at least one product to receive.')
  for (const l of input.lines) {
    invariant(isWhole(l.qty) && l.qty > 0, 'Received quantities must be whole numbers above zero.')
    invariant(isMoney(l.unitCost), 'Unit cost must be a positive amount.')
  }

  const stockInId = newId()
  const applied = applyMovements(
    data.products,
    input.lines.map((l) => ({
      productId: l.productId,
      type: 'STOCK_IN' as const,
      qty: l.qty,
      role: input.role,
      at: input.at,
      refType: 'stockIn' as const,
      refId: stockInId,
    })),
  )
  // The latest received cost becomes the product cost for future sales.
  const lastCost = new Map(input.lines.map((l) => [l.productId, l.unitCost]))
  const products = applied.products.map((p) => (lastCost.has(p.id) ? { ...p, cost: lastCost.get(p.id)! } : p))
  const stockInCounter = data.stockInCounter + 1

  return {
    ...data,
    products,
    movements: [...data.movements, ...applied.movements],
    stockIns: [
      ...data.stockIns,
      { id: stockInId, number: `SI-${String(stockInCounter).padStart(4, '0')}`, supplierId: input.supplierId, lines: input.lines, at: input.at },
    ],
    stockInCounter,
  }
}

export const ADJUSTMENT_REASONS = ['Damaged', 'Expired', 'Count correction', 'Internal use'] as const

export function adjustStock(
  data: PosData,
  input: { productId: ID; delta: number; reason: string; role: Role; at: string },
): PosData {
  assertCan(input.role, 'inventory.adjust')
  invariant(input.reason.trim().length > 0, 'Choose a reason for the adjustment.')
  const { products, movements } = applyMovements(data.products, [
    { productId: input.productId, type: 'ADJUSTMENT', qty: input.delta, role: input.role, at: input.at, reason: input.reason.trim() },
  ])
  return { ...data, products, movements: [...data.movements, ...movements] }
}

// ---- Catalog -------------------------------------------------------------------------------

export interface ProductInput {
  id?: ID
  name: string
  sku: string
  barcode: string
  categoryId: ID
  supplierId?: ID
  cost: Centavos
  price: Centavos
  reorderLevel: number
  active: boolean
  /** Only used when creating: becomes an INITIAL ledger entry. */
  initialStock?: number
}

export function saveProduct(data: PosData, input: ProductInput, role: Role, at: string): PosData {
  assertCan(role, 'catalog.edit')
  const name = input.name.trim()
  const sku = input.sku.trim().toUpperCase()
  const barcode = input.barcode.trim()
  invariant(name.length >= 2, 'Product name is required.')
  invariant(/^[A-Z0-9-]{2,20}$/.test(sku), 'SKU must be 2–20 letters, numbers or dashes.')
  invariant(/^\d{6,14}$/.test(barcode), 'Barcode must be 6–14 digits.')
  invariant(data.categories.some((c) => c.id === input.categoryId), 'Choose a category.')
  invariant(!input.supplierId || data.suppliers.some((s) => s.id === input.supplierId), 'Supplier not found.')
  invariant(isMoney(input.cost) && isMoney(input.price) && input.price > 0, 'Cost and price must be positive amounts.')
  invariant(isWhole(input.reorderLevel) && input.reorderLevel >= 0, 'Reorder level must be a whole number.')

  const others = data.products.filter((p) => p.id !== input.id)
  invariant(!others.some((p) => p.sku === sku), `SKU ${sku} is already used.`)
  invariant(!others.some((p) => p.barcode === barcode), `Barcode ${barcode} is already used.`)

  const fields = {
    name,
    sku,
    barcode,
    categoryId: input.categoryId,
    supplierId: input.supplierId || undefined,
    cost: input.cost,
    price: input.price,
    reorderLevel: input.reorderLevel,
    active: input.active,
  }

  if (input.id) {
    invariant(data.products.some((p) => p.id === input.id), 'Product not found.')
    // Editing never changes stock; that only happens through stock-in, sales and adjustments.
    return { ...data, products: data.products.map((p) => (p.id === input.id ? { ...p, ...fields } : p)) }
  }

  const initialStock = input.initialStock ?? 0
  invariant(isWhole(initialStock) && initialStock >= 0, 'Opening stock must be a whole number.')
  const product: Product = { id: newId(), stock: 0, ...fields }
  const withProduct = [...data.products, product]
  if (initialStock === 0) return { ...data, products: withProduct }

  const { products, movements } = applyMovements(withProduct, [
    { productId: product.id, type: 'INITIAL', qty: initialStock, role, at, reason: 'Opening stock' },
  ])
  return { ...data, products, movements: [...data.movements, ...movements] }
}

export function saveCategory(data: PosData, input: { id?: ID; name: string }, role: Role): PosData {
  assertCan(role, 'catalog.edit')
  const name = input.name.trim()
  invariant(name.length >= 2, 'Category name is required.')
  invariant(!data.categories.some((c) => c.id !== input.id && c.name.toLowerCase() === name.toLowerCase()), `${name} already exists.`)
  if (input.id) return { ...data, categories: data.categories.map((c) => (c.id === input.id ? { ...c, name } : c)) }
  const category: Category = { id: newId(), name }
  return { ...data, categories: [...data.categories, category] }
}

export function deleteCategory(data: PosData, id: ID, role: Role): PosData {
  assertCan(role, 'catalog.edit')
  invariant(!data.products.some((p) => p.categoryId === id), 'This category still has products. Move them first.')
  return { ...data, categories: data.categories.filter((c) => c.id !== id) }
}

export function saveSupplier(data: PosData, input: { id?: ID; name: string; contact?: string }, role: Role): PosData {
  assertCan(role, 'catalog.edit')
  const name = input.name.trim()
  invariant(name.length >= 2, 'Supplier name is required.')
  invariant(!data.suppliers.some((s) => s.id !== input.id && s.name.toLowerCase() === name.toLowerCase()), `${name} already exists.`)
  const contact = input.contact?.trim() || undefined
  if (input.id) return { ...data, suppliers: data.suppliers.map((s) => (s.id === input.id ? { ...s, name, contact } : s)) }
  const supplier: Supplier = { id: newId(), name, contact }
  return { ...data, suppliers: [...data.suppliers, supplier] }
}

export function deleteSupplier(data: PosData, id: ID, role: Role): PosData {
  assertCan(role, 'catalog.edit')
  invariant(!data.products.some((p) => p.supplierId === id), 'Products still use this supplier.')
  invariant(!data.stockIns.some((s) => s.supplierId === id), 'This supplier has stock-in history and can’t be deleted.')
  return { ...data, suppliers: data.suppliers.filter((s) => s.id !== id) }
}

export function updateSettings(data: PosData, input: Settings, role: Role): PosData {
  assertCan(role, 'settings.edit')
  invariant(input.storeName.trim().length >= 2, 'Store name is required.')
  invariant(input.vatRate >= 0 && input.vatRate <= 0.5, 'VAT rate must be between 0% and 50%.')
  invariant(isWhole(input.lowStockDefault) && input.lowStockDefault >= 0, 'Low-stock threshold must be a whole number.')
  invariant(/^\d{4}$/.test(input.managerPin), 'Manager PIN must be 4 digits.')
  return { ...data, settings: { ...input, storeName: input.storeName.trim() } }
}
