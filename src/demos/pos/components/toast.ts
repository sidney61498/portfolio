import { create } from 'zustand'

export interface Toast {
  id: number
  kind: 'success' | 'error' | 'info'
  message: string
}

interface ToastState {
  toasts: Toast[]
  push: (kind: Toast['kind'], message: string) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (kind, message) => {
    const id = nextId++
    set({ toasts: [...get().toasts, { id, kind, message }].slice(-4) })
    setTimeout(() => get().dismiss(id), kind === 'error' ? 6000 : 3500)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = {
  success: (m: string) => useToasts.getState().push('success', m),
  error: (m: string) => useToasts.getState().push('error', m),
  info: (m: string) => useToasts.getState().push('info', m),
}

/**
 * Runs a service call and turns any thrown rule violation into an error toast.
 * Returns the result, or undefined if it failed.
 */
export async function attempt<T>(fn: () => Promise<T>, success?: string): Promise<T | undefined> {
  try {
    const result = await fn()
    if (success) toast.success(success)
    return result
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Something went wrong.')
    return undefined
  }
}
