import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from './Footer'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { Navbar } from './Navbar'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="btn btn-sm btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
