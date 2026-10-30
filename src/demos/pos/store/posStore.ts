import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage, storageAvailable } from '@/lib/storage'
import type { PosData, Role } from '../domain/types'
import { buildSeed } from '../seed/seed'

export interface PosState extends PosData {
  role: Role
  tourDone: boolean
}

export const STORAGE_KEY = 'tindahan-pos:v1'

export const freshState = (): PosState => ({ ...buildSeed(), role: 'cashier', tourDone: false })

/**
 * The whole demo database. Screens read from it with selectors, but all writes go through
 * ../services, which run the domain operations and then replace the data here in one step.
 */
export const usePosStore = create<PosState>()(
  persist(freshState, {
    name: STORAGE_KEY,
    version: 1,
    storage: createJSONStorage(() => safeStorage),
  }),
)

export const persistenceAvailable = storageAvailable

/** Snapshot of just the persisted domain data, for passing to operations. */
export function currentData(): PosData {
  const { settings, categories, suppliers, products, movements, sales, stockIns, orCounter, stockInCounter } =
    usePosStore.getState()
  return { settings, categories, suppliers, products, movements, sales, stockIns, orCounter, stockInCounter }
}
