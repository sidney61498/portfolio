import type { ID, MovementType, PosData, Product, Role, StockMovement } from './types'

export class StockError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StockError'
  }
}

export interface MovementInput {
  productId: ID
  type: MovementType
  qty: number
  role: Role
  at: string
  refType?: StockMovement['refType']
  refId?: ID
  reason?: string
}

export const newId = (): ID =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/**
 * Applies a batch of movements to the product list. All or nothing: if any movement would take
 * stock below zero, it throws and nothing changes. This is the only way stock ever changes.
 */
export function applyMovements(
  products: Product[],
  inputs: MovementInput[],
): { products: Product[]; movements: StockMovement[] } {
  const stock = new Map(products.map((p) => [p.id, p.stock]))
  const movements: StockMovement[] = []

  for (const input of inputs) {
    if (!Number.isInteger(input.qty) || input.qty === 0) {
      throw new StockError('Quantity must be a whole number other than zero.')
    }
    const before = stock.get(input.productId)
    if (before === undefined) throw new StockError('Product not found.')
    const after = before + input.qty
    if (after < 0) {
      const name = products.find((p) => p.id === input.productId)?.name ?? 'this product'
      throw new StockError(`Not enough stock for ${name}: ${before} on hand.`)
    }
    stock.set(input.productId, after)
    movements.push({ id: newId(), before, after, ...input })
  }

  return {
    products: products.map((p) => (stock.get(p.id) === p.stock ? p : { ...p, stock: stock.get(p.id)! })),
    movements,
  }
}

/** Products whose cached stock doesn't match the sum of their ledger. Should always be empty. */
export function ledgerMismatches(data: Pick<PosData, 'products' | 'movements'>): ID[] {
  const sums = new Map<ID, number>()
  for (const m of data.movements) sums.set(m.productId, (sums.get(m.productId) ?? 0) + m.qty)
  return data.products.filter((p) => (sums.get(p.id) ?? 0) !== p.stock).map((p) => p.id)
}

export const isLowStock = (p: Product) => p.active && p.stock <= p.reorderLevel
