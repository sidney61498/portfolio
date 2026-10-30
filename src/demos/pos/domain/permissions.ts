import type { Role } from './types'

export type Action =
  | 'register.use'
  | 'discount.overCap'
  | 'discount.order'
  | 'sales.viewAll'
  | 'sales.void'
  | 'catalog.edit'
  | 'inventory.adjust'
  | 'reports.view'
  | 'settings.edit'

const MATRIX: Record<Action, Role[]> = {
  'register.use': ['cashier', 'manager'],
  'discount.overCap': ['manager'],
  'discount.order': ['manager'],
  'sales.viewAll': ['manager'],
  'sales.void': ['manager'],
  'catalog.edit': ['manager'],
  'inventory.adjust': ['manager'],
  'reports.view': ['manager'],
  'settings.edit': ['manager'],
}

/** A cashier's line discount is capped at this share of the line amount. */
export const CASHIER_DISCOUNT_CAP = 0.1

export const can = (role: Role, action: Action): boolean => MATRIX[action].includes(role)

export class PermissionError extends Error {
  constructor(action: Action) {
    super(`Your role can't do this (${action}). Switch to Manager to continue.`)
    this.name = 'PermissionError'
  }
}

export function assertCan(role: Role, action: Action): void {
  if (!can(role, action)) throw new PermissionError(action)
}
