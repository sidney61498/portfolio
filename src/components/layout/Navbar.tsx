import { Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { profile } from '@/content/profile'
import { useScrollSpy } from '@/lib/useScrollSpy'
import { ThemeToggle } from './ThemeToggle'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'harness', label: 'AI Harness' },
  { id: 'demo', label: 'Demo' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
const SECTION_IDS = SECTIONS.map((s) => s.id)

export function Navbar() {
  const { pathname } = useLocation()
  const active = useScrollSpy(pathname === '/' ? SECTION_IDS : [])

  const links = SECTIONS.map((s) => (
    <li key={s.id}>
      <Link
        to={{ pathname: '/', hash: s.id }}
        className={active === s.id ? 'menu-active' : undefined}
        aria-current={active === s.id ? 'true' : undefined}
      >
        {s.label}
      </Link>
    </li>
  ))

  return (
    <header className="bg-base-100/85 border-base-300 sticky top-0 z-40 border-b backdrop-blur">
      <nav className="navbar mx-auto max-w-6xl px-4" aria-label="Main">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box border-base-300 z-50 mt-3 w-52 border p-2 shadow-lg"
            >
              {links}
            </ul>
          </div>
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            {profile.name}
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal menu-sm gap-1">{links}</ul>
        </div>
        <div className="navbar-end gap-2">
          <ThemeToggle />
          <Link to="/demo/pos" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Try the POS demo
          </Link>
        </div>
      </nav>
    </header>
  )
}
