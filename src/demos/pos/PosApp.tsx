import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { PosLayout } from './PosLayout'
import { RegisterPage } from './pages/RegisterPage'

// Register is the landing screen; everything else loads when first opened.
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const CategoriesPage = lazy(() => import('./pages/NamedListPages').then((m) => ({ default: m.CategoriesPage })))
const SuppliersPage = lazy(() => import('./pages/NamedListPages').then((m) => ({ default: m.SuppliersPage })))
const StockInPage = lazy(() => import('./pages/StockInPage'))
const MovementsPage = lazy(() => import('./pages/MovementsPage'))
const SalesPage = lazy(() => import('./pages/SalesPage'))
const SaleDetailPage = lazy(() => import('./pages/SaleDetailPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const Loading = () => (
  <div className="grid min-h-[40vh] place-items-center">
    <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading" />
  </div>
)

export function PosApp() {
  return (
    <Routes>
      <Route element={<PosLayout />}>
        <Route index element={<Navigate to="/demo/pos/register" replace />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Suspense fallback={<Loading />}><LazyRoutes /></Suspense>} />
      </Route>
    </Routes>
  )
}

function LazyRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="inventory" element={<Navigate to="/demo/pos/inventory/products" replace />} />
      <Route path="inventory/products" element={<ProductsPage />} />
      <Route path="inventory/categories" element={<CategoriesPage />} />
      <Route path="inventory/suppliers" element={<SuppliersPage />} />
      <Route path="inventory/stock-in" element={<StockInPage />} />
      <Route path="inventory/movements" element={<MovementsPage />} />
      <Route path="sales" element={<SalesPage />} />
      <Route path="sales/:id" element={<SaleDetailPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/demo/pos/register" replace />} />
    </Routes>
  )
}
