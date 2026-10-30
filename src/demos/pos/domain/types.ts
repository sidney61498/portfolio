import type { Centavos } from './money'

export type ID = string
export type Role = 'cashier' | 'manager'

export interface Category {
  id: ID
  name: string
}

export interface Supplier {
  id: ID
  name: string
  contact?: string
}

export interface Product {
  id: ID
  sku: string
  barcode: string
  name: string
  categoryId: ID
  supplierId?: ID
  cost: Centavos
  /** VAT-inclusive selling price. */
  price: Centavos
  /** Cached sum of this product's stock movements. Only the ledger changes it. */
  stock: number
  reorderLevel: number
  active: boolean
}

export type MovementType = 'INITIAL' | 'STOCK_IN' | 'SALE' | 'RETURN' | 'ADJUSTMENT'

export interface StockMovement {
  id: ID
  productId: ID
  type: MovementType
  /** Signed: SALE is negative, STOCK_IN and RETURN are positive. */
  qty: number
  before: number
  after: number
  refType?: 'sale' | 'stockIn'
  refId?: ID
  reason?: string
  role: Role
  at: string
}

export interface SaleLine {
  productId: ID
  name: string
  qty: number
  /** Price and cost are snapshots at the time of sale, so later edits never rewrite history. */
  unitPrice: Centavos
  unitCost: Centavos
  discount: Centavos
  returnedQty: number
}

export type PaymentMethod = 'cash' | 'ewallet'

export interface Payment {
  method: PaymentMethod
  amount: Centavos
  tendered?: Centavos
  reference?: string
}

export interface Refund {
  at: string
  reason: string
  amount: Centavos
  items: { productId: ID; qty: number }[]
}

export type SaleStatus = 'completed' | 'voided' | 'partially_refunded' | 'refunded'

export interface Sale {
  id: ID
  orNumber: string
  lines: SaleLine[]
  orderDiscount: Centavos
  subtotal: Centavos
  discountTotal: Centavos
  vatableSales: Centavos
  vat: Centavos
  total: Centavos
  payment: Payment
  change: Centavos
  status: SaleStatus
  role: Role
  at: string
  voidReason?: string
  refunds: Refund[]
}

export interface StockInLine {
  productId: ID
  qty: number
  unitCost: Centavos
}

export interface StockIn {
  id: ID
  number: string
  supplierId: ID
  lines: StockInLine[]
  at: string
}

export interface Settings {
  storeName: string
  address: string
  tin: string
  /** e.g. 0.12 */
  vatRate: number
  vatInclusive: boolean
  lowStockDefault: number
  /** Demo manager override PIN for cashier voids. Shown in the tour; not a real secret. */
  managerPin: string
}

/** Everything the demo persists. Operations take one and return a new one. */
export interface PosData {
  settings: Settings
  categories: Category[]
  suppliers: Supplier[]
  products: Product[]
  movements: StockMovement[]
  sales: Sale[]
  stockIns: StockIn[]
  orCounter: number
  stockInCounter: number
}
