import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'ai-harness',
        lazy: async () => ({ Component: (await import('@/pages/HarnessPage')).HarnessPage }),
      },
      {
        path: 'work/:slug',
        lazy: async () => ({ Component: (await import('@/pages/CaseStudyPage')).CaseStudyPage }),
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    // The demo has its own layout and lives in its own chunk, so it never slows the homepage.
    path: '/demo/pos/*',
    lazy: async () => ({ Component: (await import('@/demos/pos/PosApp')).PosApp }),
  },
])
