import {
  ArrowLeft,
  Boxes,
  ChartColumn,
  History,
  LayoutDashboard,
  Menu,
  PackagePlus,
  Receipt,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Truck,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { can, type Action } from './domain/permissions'
import { isLowStock } from './domain/stock'
import type { Role } from './domain/types'
import { Toaster } from './components/Toaster'
import { posService } from './services/posService'
import { persistenceAvailable, usePosStore } from './store/posStore'

interface NavItem {
  to: string
  label: string
  icon: typeof Store
  action?: Action
  badge?: 'lowStock'
}

const NAV: { heading?: string; items: NavItem[] }[] = [
  {
    items: [
      { to: 'register', label: 'Register', icon: ShoppingCart },
      { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: 'reports.view' },
    ],
  },
  {
    heading: 'Inventory',
    items: [
      { to: 'inventory/products', label: 'Products', icon: Boxes, badge: 'lowStock' },
      {
        to: 'inventory/stock-in',
        label: 'Stock-in',
        icon: PackagePlus,
        action: 'inventory.adjust',
      },
      { to: 'inventory/movements', label: 'Stock ledger', icon: History },
      { to: 'inventory/categories', label: 'Categories', icon: Tags },
      { to: 'inventory/suppliers', label: 'Suppliers', icon: Truck },
    ],
  },
  {
    heading: 'Sales',
    items: [
      { to: 'sales', label: 'Sales history', icon: Receipt },
      { to: 'reports', label: 'Reports', icon: ChartColumn, action: 'reports.view' },
      { to: 'settings', label: 'Settings', icon: Settings, action: 'settings.edit' },
    ],
  },
]

function RoleSwitch() {
  const role = usePosStore((s) => s.role)
  const roles: Role[] = ['cashier', 'manager']
  return (
    <div className="join" role="radiogroup" aria-label="Demo role">
      {roles.map((r) => (
        <button
          key={r}
          type="button"
          role="radio"
          aria-checked={role === r}
          className={`btn btn-sm join-item capitalize ${role === r ? 'btn-primary' : ''}`}
          onClick={() => posService.setRole(r)}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

export function PosLayout() {
  const role = usePosStore((s) => s.role)
  const storeName = usePosStore((s) => s.settings.storeName)
  const lowStock = usePosStore((s) => s.products.filter(isLowStock).length)
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = `Tindahan POS demo | Sidney Medrano`
  }, [])

  // Close the mobile drawer after navigating.
  useEffect(() => {
    const toggle = document.getElementById('pos-drawer') as HTMLInputElement | null
    if (toggle) toggle.checked = false
  }, [pathname])

  return (
    <div className="drawer lg:drawer-open">
      <input id="pos-drawer" type="checkbox" className="drawer-toggle" aria-label="Toggle menu" />
      <div className="drawer-content bg-base-200 flex min-h-screen flex-col">
        <header className="navbar bg-base-100 border-base-300 sticky top-0 z-30 gap-2 border-b px-3">
          <label
            htmlFor="pos-drawer"
            className="btn btn-ghost btn-sm btn-circle lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </label>
          <div className="flex-1 truncate font-semibold">
            <span className="hidden sm:inline">{storeName}</span>
          </div>
          <span className="text-base-content/60 hidden text-sm md:inline">Role:</span>
          <RoleSwitch />
          <ThemeToggle />
        </header>
        <div className="bg-info/10 text-info-content/90 border-base-300 border-b px-4 py-1.5 text-center text-xs">
          <span className="text-base-content/80">
            Clean-room rebuild for my portfolio. The original systems are private. All data is
            fictional and stays in your browser.
            {!persistenceAvailable() && ' Storage is blocked here, so changes won’t be saved.'}
          </span>
        </div>
        <main className="flex-1 p-3 sm:p-6">
          <Outlet />
        </main>
        <Toaster />
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="pos-drawer" aria-label="Close menu" className="drawer-overlay" />
        <aside className="bg-base-100 border-base-300 flex min-h-full w-64 flex-col border-r">
          <div className="flex items-center gap-2 px-5 py-4">
            <Store className="text-primary size-6" />
            <div>
              <p className="font-display leading-tight font-bold">Tindahan POS</p>
              <p className="text-base-content/60 text-xs">
                Demo · {role === 'manager' ? 'Manager' : 'Cashier'}
              </p>
            </div>
          </div>
          <nav className="flex-1" aria-label="Demo">
            <ul className="menu w-full">
              {NAV.map((group, gi) => (
                <li key={gi}>
                  {group.heading && <h2 className="menu-title">{group.heading}</h2>}
                  <ul className={group.heading ? '' : 'ml-0 pl-0 before:hidden'}>
                    {group.items.map((item) => {
                      const locked = item.action && !can(role, item.action)
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={`/demo/pos/${item.to}`}
                            className={({ isActive }) => (isActive ? 'menu-active' : '')}
                          >
                            <item.icon className="size-4" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge === 'lowStock' && lowStock > 0 && (
                              <span
                                className="badge badge-warning badge-sm"
                                title={`${lowStock} low on stock`}
                              >
                                {lowStock}
                              </span>
                            )}
                            {locked && <span className="badge badge-ghost badge-xs">mgr</span>}
                          </NavLink>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4">
            <Link to="/#demo" className="btn btn-ghost btn-sm w-full justify-start">
              <ArrowLeft className="size-4" /> Back to portfolio
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
