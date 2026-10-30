import type { Centavos } from './money'
import { CASHIER_DISCOUNT_CAP, can } from './permissions'
import type { ID, Role } from './types'

export interface CartLine {
  productId: ID
  name: string
  qty: number
  unitPrice: Centavos
  unitCost: Centavos
  discount: Centavos
}

export interface Totals {
  subtotal: Centavos
  discountTotal: Centavos
  vatableSales: Centavos
  vat: Centavos
  total: Centavos
}

export const lineGross = (line: Pick<CartLine, 'qty' | 'unitPrice'>): Centavos =>
  line.qty * line.unitPrice

export const lineNet = (line: Pick<CartLine, 'qty' | 'unitPrice' | 'discount'>): Centavos =>
  lineGross(line) - line.discount

/** The biggest line discount this role may give. */
export function maxLineDiscount(role: Role, gross: Centavos): Centavos {
  return can(role, 'discount.overCap') ? gross : Math.floor(gross * CASHIER_DISCOUNT_CAP)
}

/**
 * Cart totals. With VAT-inclusive pricing (PH retail), VAT is split out of the total once, at
 * the end, so rounding never drifts across lines.
 */
export function computeTotals(
  lines: CartLine[],
  orderDiscount: Centavos,
  vatRate: number,
  vatInclusive: boolean,
): Totals {
  const subtotal = lines.reduce((sum, l) => sum + lineGross(l), 0)
  const lineDiscounts = lines.reduce((sum, l) => sum + l.discount, 0)
  const afterLineDiscounts = subtotal - lineDiscounts
  const appliedOrderDiscount = Math.min(Math.max(orderDiscount, 0), afterLineDiscounts)
  const net = afterLineDiscounts - appliedOrderDiscount

  if (vatInclusive) {
    const vatableSales = Math.round(net / (1 + vatRate))
    return {
      subtotal,
      discountTotal: lineDiscounts + appliedOrderDiscount,
      vatableSales,
      vat: net - vatableSales,
      total: net,
    }
  }

  const vat = Math.round(net * vatRate)
  return {
    subtotal,
    discountTotal: lineDiscounts + appliedOrderDiscount,
    vatableSales: net,
    vat,
    total: net + vat,
  }
}

/**
 * Spreads the order discount across lines in proportion to each line's net, so a partial refund
 * gives back exactly what the customer paid for those units. The last line absorbs rounding.
 */
export function allocateOrderDiscount(lines: Pick<CartLine, 'qty' | 'unitPrice' | 'discount'>[], orderDiscount: Centavos): Centavos[] {
  const nets = lines.map(lineNet)
  const totalNet = nets.reduce((a, b) => a + b, 0)
  if (totalNet === 0 || orderDiscount === 0) return lines.map(() => 0)
  const shares = nets.map((n) => Math.floor((orderDiscount * n) / totalNet))
  const remainder = orderDiscount - shares.reduce((a, b) => a + b, 0)
  shares[shares.length - 1] += remainder
  return shares
}
