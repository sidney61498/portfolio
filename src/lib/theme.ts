import { useEffect, useState } from 'react'
import { safeStorage } from './storage'

export type Theme = 'sidney' | 'sidney-dark'

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'sidney-dark' ? 'sidney-dark' : 'sidney'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'sidney' ? 'sidney-dark' : 'sidney'
    safeStorage.setItem('theme', next)
    setTheme(next)
  }

  return { theme, toggle }
}

/** Reads a daisyUI color token (e.g. "--color-primary") and re-reads it when the theme changes. */
export function useCssVar(name: string): string {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const [value, setValue] = useState(read)

  useEffect(() => {
    const observer = new MutationObserver(() => setValue(read()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  return value
}
