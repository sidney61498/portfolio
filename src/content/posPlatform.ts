// Personal project. Facts (routes, fields, statuses, rules) are taken from the project's own code;
// values in the example payloads are made up.

export const posPlatform = {
  title: 'POS Inventory',
  tagline: 'A web back office, an offline-first desktop till and a mobile app, all running on the same Laravel API.',
  disclaimer:
    'A personal, self-taught project built in 2026 to learn desktop and mobile development. Laravel and React are my professional stack; Electron and React Native are not part of my work experience.',
  stats: [
    { value: 85, label: 'API endpoints' },
    { value: 24, label: 'Eloquent models' },
    { value: 3, label: 'client apps' },
    { value: 9, label: 'API feature test suites' },
  ],
}

export interface ClientApp {
  name: string
  platform: string
  stack: string[]
  features: string[]
  icon: 'web' | 'desktop' | 'mobile'
}

export const clients: ClientApp[] = [
  {
    name: 'Web back office',
    platform: 'Browser',
    icon: 'web',
    stack: ['Laravel 13', 'React 19', 'React Router 7', 'Tailwind CSS 4', 'daisyUI 5', 'MySQL 8.4', 'Redis'],
    features: ['Catalog, unit conversions and branch pricing', 'Purchases, stock transfers and adjustments', 'Receivables, payables and expenses', 'Bulk inventory import with a preview step', 'Sales, stock and profit reports'],
  },
  {
    name: 'Desktop till',
    platform: 'Electron',
    icon: 'desktop',
    stack: ['Electron', 'better-sqlite3', 'ES modules', 'electron-builder'],
    features: ['Local-first: SQLite database on the device', 'Signs in online, reopens offline from a cached session', 'Held carts, durable cart drafts and a checkout queue', 'Sync center with conflict tracking', 'Native receipt printing and export'],
  },
  {
    name: 'Mobile app',
    platform: 'React Native (Expo)',
    icon: 'mobile',
    stack: ['Expo Router', 'TypeScript', 'Tamagui', 'TanStack Query', 'expo-sqlite', 'Zustand', 'Zod'],
    features: ['POS checkout and customer lookup', 'Offline drafts that sync when the network returns', 'Receivables and branch context', 'Back-office screens for inventory, transfers and reports', 'Secure token storage on the device'],
  },
]

export const highlights = [
  { title: 'Idempotent offline writes', text: 'Clients send a client_mutation_id with each checkout or transfer. A queued request that is retried after a dropped connection returns the original record instead of creating a second one.' },
  { title: 'Branch-scoped by middleware', text: 'An active-branch middleware resolves the user’s current branch once, so every catalog, POS and inventory query is scoped to it without repeating the check in each controller.' },
  { title: 'Thin controllers', text: 'Form requests validate, single-purpose action classes do the work inside database transactions, and API resources shape every response.' },
  { title: 'A real state machine for transfers', text: 'Stock transfers move draft → submitted → approved → shipped → received, or are cancelled before shipping. Each transition checks the current status and which branch is allowed to make it.' },
]

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiExample {
  id: string
  group: string
  method: HttpMethod
  path: string
  summary: string
  notes: string[]
  request?: unknown
  status: number
  response: unknown
}

export const apiExamples: ApiExample[] = [
  {
    id: 'login',
    group: 'Auth',
    method: 'POST',
    path: '/api/auth/login',
    summary: 'Sign in and get the user’s roles, permissions and branches.',
    notes: ['Session-based Sanctum auth for the SPA.', 'With exactly one branch, it becomes the active branch automatically.'],
    request: { email: 'cashier@example.test', password: '••••••••', remember: true },
    status: 200,
    response: {
      data: {
        id: 7,
        name: 'Ana Cruz',
        email: 'cashier@example.test',
        roles: ['staff'],
        permissions: ['pos.checkout', 'catalog.view'],
        branches: [{ id: 2, name: 'Laoag Main', code: 'LAO' }],
        active_branch: { id: 2, name: 'Laoag Main', code: 'LAO' },
        requires_branch_selection: false,
      },
    },
  },
  {
    id: 'search',
    group: 'Catalog',
    method: 'GET',
    path: '/api/catalog/products/search?q=coffee&limit=25',
    summary: 'Till lookup: active products that are in stock at the current branch.',
    notes: ['Uses the branch price when one is set, otherwise the base price.', 'limit is clamped between 1 and 200.'],
    status: 200,
    response: {
      data: [
        {
          id: 41,
          name: 'Coffee 3-in-1 Sachet',
          sku: 'BEV-007',
          barcode: '4801000055433',
          base_unit: 'pc',
          category: 'Beverages',
          selling_price: '10.00',
          stock_quantity: '184.000',
          reorder_level: '40.000',
          is_low_stock: false,
        },
      ],
    },
  },
  {
    id: 'checkout',
    group: 'POS',
    method: 'POST',
    path: '/api/pos/checkouts',
    summary: 'Complete a sale. Supports split payments and credit sales.',
    notes: ['client_mutation_id makes the request safe to retry from an offline queue.', 'Stock is deducted and the receipt created in one transaction.'],
    request: {
      client_mutation_id: 'till-03:2026-10-30T09:14:22Z:0187',
      items: [
        { product_id: 41, quantity: 3 },
        { product_id: 12, quantity: 1, line_discount: 5 },
      ],
      payments: [{ method: 'cash', amount: 100 }],
    },
    status: 201,
    response: {
      data: {
        id: 9021,
        receipt_number: 'LAO-000917',
        credit_status: 'paid',
        sold_at: '2026-10-30T09:14:23+08:00',
        branch: { id: 2, name: 'Laoag Main', code: 'LAO' },
        cashier: { id: 7, name: 'Ana Cruz' },
        items: [
          { product_name: 'Coffee 3-in-1 Sachet', quantity: '3.000', unit_price: '10.00', line_discount: '0.00', line_total: '30.00' },
          { product_name: 'Corned Beef 150g', quantity: '1.000', unit_price: '58.00', line_discount: '5.00', line_total: '53.00' },
        ],
        totals: { subtotal: '88.00', discount: '5.00', tax: '0.00', total: '83.00', paid: '100.00', outstanding: '0.00', change: '17.00' },
      },
    },
  },
  {
    id: 'checkout-retry',
    group: 'POS',
    method: 'POST',
    path: '/api/pos/checkouts',
    summary: 'The same checkout, retried after the connection dropped.',
    notes: ['Same client_mutation_id, so no second sale and no double stock deduction.', 'The original receipt comes back.'],
    request: { client_mutation_id: 'till-03:2026-10-30T09:14:22Z:0187', items: ['…same items…'], payments: ['…same payment…'] },
    status: 201,
    response: { data: { id: 9021, receipt_number: 'LAO-000917', '…': 'identical to the first response' } },
  },
  {
    id: 'approve',
    group: 'Inventory',
    method: 'POST',
    path: '/api/transfers/318/approve',
    summary: 'Approve a submitted stock transfer between branches.',
    notes: ['Only submitted transfers can be approved.', 'Every transition records a timestamp.'],
    status: 200,
    response: {
      data: {
        id: 318,
        reference_number: 'TRF-2026-0318',
        status: 'approved',
        source_branch: { id: 2, name: 'Laoag Main', code: 'LAO' },
        target_branch: { id: 5, name: 'Batac', code: 'BAT' },
        items: [{ product_name: 'Rice 1kg', product_sku: 'GRO-023', quantity: '50.000' }],
        submitted_at: '2026-10-30T08:02:10+08:00',
        approved_at: '2026-10-30T08:40:55+08:00',
        shipped_at: null,
        received_at: null,
      },
    },
  },
  {
    id: 'receive-wrong-branch',
    group: 'Inventory',
    method: 'POST',
    path: '/api/transfers/318/receive',
    summary: 'A branch tries to receive a transfer that isn’t addressed to it.',
    notes: ['Business-rule failures use the same 422 shape as validation errors, so every client handles them the same way.'],
    status: 422,
    response: {
      message: 'Only the destination branch can receive this transfer.',
      errors: { transfer: ['Only the destination branch can receive this transfer.'] },
    },
  },
]
