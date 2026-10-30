# POS + Inventory Demo — Spec

**Working name:** *Tindahan POS* (rename freely). It's a point-of-sale and inventory system for a
small Philippine retail store or café. It runs entirely in the browser with seeded demo data.

**Why it's on the portfolio:** you built POS and inventory systems at MMSU (Laravel + Vue/React)
and inventory for a hospital, but none of them are public. This demo is a clean-room rebuild
that people can try, showing that you understand the domain and its rules, not only CRUD screens.

## 1. Roles

A switcher in the top bar lets visitors swap roles instantly. There are no real accounts.

| Capability | Cashier | Manager |
|---|---|---|
| Use register, take payment, print receipt | ✅ | ✅ |
| Apply line discount up to 10% | ✅ | ✅ |
| Apply discount above 10% / order discount | ❌ | ✅ |
| View sales history, reprint receipt | ✅ (own shift) | ✅ (all) |
| Void / refund a sale | ❌ (needs manager override PIN `1234`, shown in the tour) | ✅ |
| Products / categories / suppliers CRUD | ❌ (read-only) | ✅ |
| Stock-in, adjustments | ❌ | ✅ |
| Dashboard, reports, CSV export | ❌ | ✅ |
| Settings, reset demo data | ❌ | ✅ |

Permissions are checked in `domain/permissions.ts` and enforced in the **service layer**. The UI
hides what a role can't do, but a forced call is still rejected, and there's a unit test for that.

## 2. Features

### 2.1 Register (`/demo/pos/register`)
- Product grid with images or initials, category tabs, and a search box (name/SKU)
- **Barcode input:** a focused text field that adds an item on Enter. This works with a real USB
  scanner (keyboard wedge). The demo shows the seed barcodes in a tooltip.
- Cart: qty +/−, remove, line discount (% or ₱), order discount (manager), held/parked carts (max 3)
- Totals panel: subtotal, discounts, **VAT 12% (VAT-inclusive pricing, PH style)**, total
- Payment modal: Cash (amount tendered, quick buttons ₱100/₱500/₱1000, exact) or E-wallet
  (reference no.); change computed live; Pay is disabled until tendered ≥ total
- Receipt modal: store header, OR number, items, VAT breakdown (VATable sales / VAT amount),
  payment, change, cashier, timestamp. **Print** uses `window.print()` with a 58mm/80mm print CSS.
- Out-of-stock items are disabled; you can't add more than the stock on hand
- Keyboard: `F2` focus search, `F4` barcode, `F9` pay, `Esc` close modal, `+/-` on selected line

### 2.2 Inventory
- **Products** (`/inventory/products`): table with search, category filter, low-stock filter,
  sort, pagination; create/edit in a modal (name, SKU, barcode, category, supplier, cost, price,
  reorder level, active). Validation: price ≥ cost (warning only), unique SKU/barcode.
- **Categories / Suppliers:** simple CRUD. A category or supplier that's in use can't be deleted.
- **Stock-in** (`/inventory/stock-in`): pick a supplier, add lines (product, qty, unit cost),
  receive. This creates `STOCK_IN` movements and updates the last cost.
- **Adjustments:** +/− qty with a required reason (Damaged, Expired, Count correction,
  Internal use). Creates an `ADJUSTMENT` movement.
- **Stock ledger** (`/inventory/movements`): every movement with type, qty ±, before → after,
  reference (sale #, stock-in #), user, time. Filter by product/type/date.
- **Low-stock alerts:** badge in the sidebar plus a dashboard card when `stock ≤ reorderLevel`.

### 2.3 Sales
- **History** (`/sales`): list with date range, cashier, payment method and status filters
- **Detail:** line items, payments, receipt reprint
- **Void** (same day, full sale) / **Refund** (any line, partial qty): the status changes,
  `RETURN` movements restore stock, and a reason is required. A voided sale is excluded from reports.

### 2.4 Dashboard (`/dashboard`)
- Stat cards (daisyUI `stats`): Today's sales, Transactions, Avg basket, Gross profit
- Line/bar chart: sales for the last 7 days (Recharts)
- Top 5 products (qty and revenue), low-stock list, recent sales

### 2.5 Reports (`/reports`)
- Sales by day / by product / by category for a date range
- Inventory valuation: qty × cost per product and the total
- Gross profit: revenue − cost of goods sold (cost captured on each sale line)
- **Export CSV** for each report (built client-side as a Blob download)

### 2.6 Settings (`/settings`)
- Store name, address and TIN (fake) for the receipt header
- VAT rate (default 12%), VAT-inclusive toggle, currency (PHP)
- Low-stock default threshold
- **Reset demo data** (confirm modal) → re-seed

### 2.7 First-run tour
A short daisyUI-styled step popover: "Scan this barcode → Pay → See stock drop in Inventory →
Switch to Manager → Void it → Stock is back." Visitors see the system's rules in under a minute.

## 3. Routes

```
/demo/pos                 → redirect to /demo/pos/register
/demo/pos/register
/demo/pos/dashboard       (manager)
/demo/pos/inventory/products
/demo/pos/inventory/categories
/demo/pos/inventory/suppliers
/demo/pos/inventory/stock-in        (manager)
/demo/pos/inventory/movements
/demo/pos/sales
/demo/pos/sales/:id
/demo/pos/reports         (manager)
/demo/pos/settings        (manager)
```

## 4. Data model (`domain/types.ts`)

```ts
type Centavos = number            // integer, ₱1.00 = 100
type ID = string                  // crypto.randomUUID()
type Role = 'cashier' | 'manager'

interface Category { id: ID; name: string }
interface Supplier { id: ID; name: string; contact?: string }

interface Product {
  id: ID; sku: string; barcode: string; name: string
  categoryId: ID; supplierId?: ID
  cost: Centavos; price: Centavos          // price is VAT-inclusive
  stock: number                            // cached sum of movements
  reorderLevel: number; active: boolean; imageUrl?: string
}

type MovementType = 'STOCK_IN' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'INITIAL'
interface StockMovement {
  id: ID; productId: ID; type: MovementType
  qty: number                              // signed: SALE negative, STOCK_IN positive
  before: number; after: number
  refType?: 'sale' | 'stockIn'; refId?: ID
  reason?: string; userRole: Role; at: string  // ISO
}

interface SaleLine {
  productId: ID; name: string; qty: number
  unitPrice: Centavos; unitCost: Centavos  // snapshot at time of sale
  discount: Centavos; returnedQty: number
}
interface Payment { method: 'cash' | 'ewallet'; amount: Centavos; tendered?: Centavos; reference?: string }
interface Sale {
  id: ID; orNumber: string                 // e.g. OR-000123
  lines: SaleLine[]; orderDiscount: Centavos
  subtotal: Centavos; vatableSales: Centavos; vat: Centavos; total: Centavos
  payment: Payment; change: Centavos
  status: 'completed' | 'voided' | 'partially_refunded' | 'refunded'
  cashierRole: Role; at: string; voidReason?: string
}

interface StockIn { id: ID; supplierId: ID; lines: { productId: ID; qty: number; unitCost: Centavos }[]; at: string }
interface Settings { storeName: string; address: string; tin: string; vatRate: number; vatInclusive: boolean; lowStockDefault: number }
```

## 5. Business rules (each one gets a unit test)

1. **VAT-inclusive math:** `vatableSales = round(total / (1 + rate))`, `vat = total − vatableSales`.
   Round once, at the total level, to avoid centavo drift across lines.
2. **Discounts:** a line discount can't exceed the line amount. A cashier is capped at 10% per
   line. The order discount is manager-only. Discounts are applied before VAT is split out.
3. **Stock:** you can't sell more than `stock`. A sale creates one `SALE` movement per line, and
   it's **atomic**: if any line fails, nothing is written.
4. **Void/Refund:** void is for same-day, completed sales only. A refund qty can't be more than
   `qty − returnedQty`. Both create `RETURN` movements, and voided sales are excluded from reports.
5. **Ledger integrity:** for every product, `stock === sum(movements.qty)`. In dev, this is checked
   after each write and logs loudly in the console if it breaks.
6. **OR numbers** are sequential and never reused, even after a void.
7. **Change** = tendered − total. Cash payment requires `tendered ≥ total`.
8. **Gross profit** uses the `unitCost` snapshot on the sale line, not the current product cost.

## 6. Persistence

- Zustand `persist` → `localStorage` key `tindahan-pos:v1`, with a `version` field and a
  `migrate` function for when the shape changes later.
- All storage access is wrapped in try/catch. If storage is unavailable (private mode), the demo
  still works in memory and shows a small "Changes won't be saved" notice.
- On first load with no data, auto-seed.
- If data volume outgrows localStorage (~5 MB), switch the persist storage to IndexedDB via
  `idb-keyval` (a one-line change in the store config).

## 7. Seed data (`seed/`)

- **Store:** "Tindahan ni Sidney", Sarrat, Ilocos Norte (fake TIN)
- **Categories (6):** Beverages, Snacks, Canned Goods, Personal Care, Household, Coffee Bar
- **Products (~40):** realistic local items with plausible ₱ prices, a few already below their
  reorder level and one out of stock so alerts show immediately
- **Suppliers (4):** generic fictional distributors (no real company names)
- **History:** about 30 days of generated sales (seeded random, deterministic) so the dashboard and
  reports have data on first open, and 2 stock-ins plus a few adjustments in the ledger

## 8. UI (daisyUI components)

| Screen | Components |
|---|---|
| Layout | `drawer` (sidebar, collapses on mobile), `navbar`, `menu`, `badge` (low-stock count), `swap` (theme) |
| Register | `tabs` (categories), `card` (products), `join` (qty +/−), `input`, `kbd` (shortcut hints), `modal` (payment/receipt) |
| Tables | `table table-zebra table-pin-rows`, `join` pagination, `dropdown` filters |
| Forms | `fieldset`, `input`, `select`, `toggle`, `validator` hints |
| Dashboard | `stats`, `card`, Recharts inside cards |
| Feedback | `toast` + `alert` for success/errors, `loading`, `skeleton` |

Layout breakpoints: the register is two-column (grid | cart) at `lg`. On tablets the cart becomes
a bottom sheet, and on phones the cart opens as a full-screen drawer.

## 9. Acceptance checklist

- [ ] Fresh visitor lands on Register with seeded data and the tour
- [ ] Scanning/typing a barcode adds the item; scanning again increments qty
- [ ] Checkout with cash shows correct change and VAT breakdown; receipt prints cleanly
- [ ] Stock decreases by the sold qty and the ledger shows a `SALE` movement with before → after
- [ ] Selling beyond stock is blocked with a clear message
- [ ] Cashier can't open stock-in/reports/settings, and a direct service call is also rejected
- [ ] Manager voids a sale → stock restored, sale excluded from dashboard totals
- [ ] Partial refund restores only the refunded qty
- [ ] Reports match the dashboard for the same range; CSV export opens correctly in Excel/Sheets
- [ ] Reset demo restores the original seed exactly
- [ ] Full checkout possible with keyboard only
- [ ] Works on phone and tablet widths, in both themes
