// localStorage can throw (private mode, blocked site data). Every access goes through here
// and falls back to memory, so the site still works, just without remembering anything.
const memory = new Map<string, string>()
let available: boolean | null = null

export function storageAvailable(): boolean {
  if (available === null) {
    try {
      const key = '__storage_test__'
      localStorage.setItem(key, key)
      localStorage.removeItem(key)
      available = true
    } catch {
      available = false
    }
  }
  return available
}

export const safeStorage = {
  getItem(key: string): string | null {
    if (!storageAvailable()) return memory.get(key) ?? null
    try {
      return localStorage.getItem(key)
    } catch {
      return memory.get(key) ?? null
    }
  },
  setItem(key: string, value: string): void {
    memory.set(key, value)
    if (!storageAvailable()) return
    try {
      localStorage.setItem(key, value)
    } catch {
      /* quota or blocked: keep the in-memory copy */
    }
  },
  removeItem(key: string): void {
    memory.delete(key)
    if (!storageAvailable()) return
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}
