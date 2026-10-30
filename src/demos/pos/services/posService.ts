// The API the screens call. Today it runs the domain operations against the in-browser store;
// a Laravel backend could replace each function with a fetch() without touching any screen.
// Every function re-checks permissions here, so hiding a button is never the only guard.

import { assertCan } from '../domain/permissions'
import { ledgerMismatches } from '../domain/stock'
import * as ops from '../domain/operations'
import type { ID, PosData, Role, Settings, StockInLine } from '../domain/types'
import { currentData, freshState, usePosStore } from '../store/posStore'

const now = () => new Date().toISOString()
const role = (): Role => usePosStore.getState().role

function commit(data: PosData) {
  usePosStore.setState(data)
  if (import.meta.env.DEV) {
    const broken = ledgerMismatches(data)
    if (broken.length) console.error('[pos] Ledger mismatch for products:', broken)
  }
}

/**
 * A cashier can void or refund with the manager PIN (the override a supervisor would key in at a
 * real till). The operation then runs with manager rights; the PIN itself is checked here.
 */
function effectiveRole(managerPin?: string): Role {
  const current = role()
  if (current === 'manager') return current
  if (managerPin !== undefined) {
    if (managerPin !== usePosStore.getState().settings.managerPin) throw new ops.ValidationError('Incorrect manager PIN.')
    return 'manager'
  }
  return current
}

export const posService = {
  async checkout(input: Omit<ops.CheckoutInput, 'role' | 'at'>) {
    const { data, sale } = ops.checkout(currentData(), { ...input, role: role(), at: now() })
    commit(data)
    return sale
  },

  async voidSale(saleId: ID, reason: string, managerPin?: string) {
    commit(ops.voidSale(currentData(), { saleId, reason, role: effectiveRole(managerPin), at: now() }))
  },

  async refundSale(saleId: ID, items: { productId: ID; qty: number }[], reason: string, managerPin?: string) {
    const { data, amount } = ops.refundSale(currentData(), { saleId, items, reason, role: effectiveRole(managerPin), at: now() })
    commit(data)
    return amount
  },

  async receiveStock(supplierId: ID, lines: StockInLine[]) {
    commit(ops.receiveStock(currentData(), { supplierId, lines, role: role(), at: now() }))
  },

  async adjustStock(productId: ID, delta: number, reason: string) {
    commit(ops.adjustStock(currentData(), { productId, delta, reason, role: role(), at: now() }))
  },

  async saveProduct(input: ops.ProductInput) {
    commit(ops.saveProduct(currentData(), input, role(), now()))
  },

  async saveCategory(input: { id?: ID; name: string }) {
    commit(ops.saveCategory(currentData(), input, role()))
  },

  async deleteCategory(id: ID) {
    commit(ops.deleteCategory(currentData(), id, role()))
  },

  async saveSupplier(input: { id?: ID; name: string; contact?: string }) {
    commit(ops.saveSupplier(currentData(), input, role()))
  },

  async deleteSupplier(id: ID) {
    commit(ops.deleteSupplier(currentData(), id, role()))
  },

  async updateSettings(settings: Settings) {
    commit(ops.updateSettings(currentData(), settings, role()))
  },

  async resetDemo() {
    assertCan(role(), 'settings.edit')
    const { role: keepRole } = usePosStore.getState()
    usePosStore.setState({ ...freshState(), role: keepRole, tourDone: true })
  },

  setRole(next: Role) {
    usePosStore.setState({ role: next })
  },

  finishTour() {
    usePosStore.setState({ tourDone: true })
  },
}
