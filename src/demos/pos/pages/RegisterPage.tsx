import { Minus, Plus, ScanBarcode, Search, ShoppingCart, Tag, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { computeTotals, lineGross, maxLineDiscount } from '../domain/cart'
import { formatPHP, parsePesos, toPesoString } from '../domain/money'
import { can } from '../domain/permissions'
import type { ID, Product, Sale } from '../domain/types'
import { Modal } from '../components/Modal'
import { Receipt } from '../components/Receipt'
import { attempt, toast } from '../components/toast'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'
import { PaymentModal } from './register/PaymentModal'
import { Tour } from './register/Tour'

interface CartItem {
  productId: ID
  qty: number
  discount: number
}

export function RegisterPage() {
  const products = usePosStore((s) => s.products)
  const categories = usePosStore((s) => s.categories)
  const settings = usePosStore((s) => s.settings)
  const role = usePosStore((s) => s.role)
  const tourDone = usePosStore((s) => s.tourDone)

  const [cart, setCart] = useState<CartItem[]>([])
  const [orderDiscount, setOrderDiscount] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ID | 'all'>('all')
  const [barcode, setBarcode] = useState('')
  const [paying, setPaying] = useState(false)
  const [receipt, setReceipt] = useState<Sale | null>(null)
  const [discountFor, setDiscountFor] = useState<ID | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const barcodeRef = useRef<HTMLInputElement>(null)

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
  const lines = cart
    .filter((c) => byId.has(c.productId))
    .map((c) => {
      const p = byId.get(c.productId)!
      // Derived, not stored: switching to Cashier caps any larger discount immediately.
      const discount = Math.min(c.discount, maxLineDiscount(role, p.price * c.qty))
      return { ...c, discount, name: p.name, unitPrice: p.price, unitCost: p.cost }
    })
  const totals = computeTotals(
    lines,
    can(role, 'discount.order') ? orderDiscount : 0,
    settings.vatRate,
    settings.vatInclusive,
  )

  const visible = products.filter(
    (p) =>
      p.active &&
      (category === 'all' || p.categoryId === category) &&
      (query === '' || `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase())),
  )

  // Keyboard shortcuts, like a real till.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === 'F4') {
        e.preventDefault()
        barcodeRef.current?.focus()
      } else if (e.key === 'F9') {
        e.preventDefault()
        if (cart.length) setPaying(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cart.length])

  function add(product: Product) {
    const inCart = cart.find((c) => c.productId === product.id)?.qty ?? 0
    if (inCart + 1 > product.stock) {
      toast.error(`Only ${product.stock} ${product.name} in stock.`)
      return
    }
    setCart((c) =>
      inCart
        ? c.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { productId: product.id, qty: 1, discount: 0 }],
    )
  }

  function setQty(id: ID, qty: number) {
    const product = byId.get(id)!
    if (qty > product.stock) return toast.error(`Only ${product.stock} ${product.name} in stock.`)
    if (qty <= 0) return setCart((c) => c.filter((i) => i.productId !== id))
    setCart((c) => c.map((i) => (i.productId === id ? { ...i, qty } : i)))
  }

  function scan(e: React.FormEvent) {
    e.preventDefault()
    const code = barcode.trim()
    if (!code) return
    const product = products.find((p) => p.barcode === code || p.sku === code.toUpperCase())
    setBarcode('')
    if (!product || !product.active) return toast.error(`No product with barcode ${code}.`)
    add(product)
  }

  async function pay(payment: Parameters<typeof posService.checkout>[0]['payment']) {
    const sale = await attempt(() =>
      posService.checkout({
        lines: lines.map(({ productId, qty, discount }) => ({ productId, qty, discount })),
        orderDiscount: can(role, 'discount.order') ? orderDiscount : 0,
        payment,
      }),
    )
    if (!sale) return
    setPaying(false)
    setCart([])
    setOrderDiscount(0)
    setReceipt(sale)
  }

  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="mx-auto max-w-7xl">
      {!tourDone && <Tour sampleBarcode={products.find((p) => p.stock > 0)?.barcode ?? ''} />}

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Catalog */}
        <section aria-label="Products" className="min-w-0">
          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            <label className="input w-full">
              <Search className="size-4 opacity-60" />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search name or SKU"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
              <kbd className="kbd kbd-sm">F2</kbd>
            </label>
            <form onSubmit={scan}>
              <label className="input w-full">
                <ScanBarcode className="size-4 opacity-60" />
                <input
                  ref={barcodeRef}
                  inputMode="numeric"
                  placeholder="Scan or type barcode, Enter"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  aria-label="Barcode"
                />
                <kbd className="kbd kbd-sm">F4</kbd>
              </label>
            </form>
          </div>

          <div
            role="tablist"
            aria-label="Categories"
            className="tabs tabs-box bg-base-100 mb-3 flex-nowrap overflow-x-auto"
          >
            {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={category === c.id}
                className={`tab whitespace-nowrap ${category === c.id ? 'tab-active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => {
              const out = p.stock === 0
              const low = !out && p.stock <= p.reorderLevel
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={out}
                  onClick={() => add(p)}
                  className="card bg-base-100 border-base-300 hover:border-primary focus-visible:outline-primary border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  title={`Barcode ${p.barcode}`}
                >
                  <div className="card-body gap-1 p-3">
                    <div className="bg-primary/10 text-primary rounded-field grid h-12 place-items-center text-lg font-bold">
                      {initials(p.name)}
                    </div>
                    <p className="line-clamp-2 min-h-10 text-sm leading-tight font-medium">
                      {p.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{formatPHP(p.price)}</span>
                      <span
                        className={`badge badge-xs ${out ? 'badge-error' : low ? 'badge-warning' : 'badge-ghost'}`}
                      >
                        {out ? 'Out' : `${p.stock} left`}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
            {visible.length === 0 && (
              <p className="text-base-content/60 col-span-full py-10 text-center">
                No products match.
              </p>
            )}
          </div>
        </section>

        {/* Cart */}
        <section
          id="cart"
          aria-label="Cart"
          className="card bg-base-100 border-base-300 h-fit border lg:sticky lg:top-20"
        >
          <div className="card-body gap-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">
                <ShoppingCart className="size-5" /> Cart{' '}
                {itemCount > 0 && <span className="badge badge-primary badge-sm">{itemCount}</span>}
              </h2>
              {cart.length > 0 && (
                <button type="button" className="btn btn-ghost btn-xs" onClick={() => setCart([])}>
                  Clear
                </button>
              )}
            </div>

            {lines.length === 0 ? (
              <p className="text-base-content/60 py-8 text-center text-sm">
                Tap a product or scan a barcode to start.
              </p>
            ) : (
              <ul className="divide-base-300 -mx-1 max-h-[45vh] divide-y overflow-y-auto">
                {lines.map((l) => {
                  const gross = lineGross(l)
                  const cap = maxLineDiscount(role, gross)
                  return (
                    <li key={l.productId} className="px-1 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm leading-tight font-medium">{l.name}</span>
                        <span className="text-sm font-semibold whitespace-nowrap">
                          {formatPHP(gross - l.discount)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="join">
                          <button
                            type="button"
                            className="btn btn-xs join-item"
                            onClick={() => setQty(l.productId, l.qty - 1)}
                            aria-label={`One less ${l.name}`}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span
                            className="btn btn-xs join-item pointer-events-none w-8"
                            aria-label="Quantity"
                          >
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            className="btn btn-xs join-item"
                            onClick={() => setQty(l.productId, l.qty + 1)}
                            aria-label={`One more ${l.name}`}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-base-content/60 text-xs">
                          @ {formatPHP(l.unitPrice)}
                        </span>
                        <div className="flex">
                          <button
                            type="button"
                            className={`btn btn-ghost btn-xs ${l.discount ? 'text-accent' : ''}`}
                            onClick={() =>
                              setDiscountFor(discountFor === l.productId ? null : l.productId)
                            }
                            aria-label={`Discount on ${l.name}`}
                            title="Line discount"
                          >
                            <Tag className="size-3" />{' '}
                            {l.discount > 0 && `−${formatPHP(l.discount)}`}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setQty(l.productId, 0)}
                            aria-label={`Remove ${l.name}`}
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                      {discountFor === l.productId && (
                        <DiscountEditor
                          value={l.discount}
                          max={cap}
                          capped={role === 'cashier'}
                          onApply={(d) => {
                            setCart((c) =>
                              c.map((i) =>
                                i.productId === l.productId ? { ...i, discount: d } : i,
                              ),
                            )
                            setDiscountFor(null)
                          }}
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            )}

            {can(role, 'discount.order') && lines.length > 0 && (
              <label className="input input-sm w-full">
                <span className="text-base-content/60 text-xs">Order discount ₱</span>
                <input
                  inputMode="decimal"
                  defaultValue={orderDiscount ? toPesoString(orderDiscount) : ''}
                  key={orderDiscount === 0 ? 'reset' : 'set'}
                  onBlur={(e) => {
                    const v = e.target.value.trim() === '' ? 0 : parsePesos(e.target.value)
                    if (Number.isNaN(v) || v < 0) return toast.error('Enter a valid amount.')
                    setOrderDiscount(v)
                  }}
                  aria-label="Order discount in pesos"
                />
              </label>
            )}

            <dl className="border-base-300 space-y-1 border-t pt-3 text-sm" aria-live="polite">
              <Row label="Subtotal" value={formatPHP(totals.subtotal)} />
              {totals.discountTotal > 0 && (
                <Row label="Discounts" value={`−${formatPHP(totals.discountTotal)}`} />
              )}
              <Row label="VATable sales" value={formatPHP(totals.vatableSales)} muted />
              <Row
                label={`VAT ${Math.round(settings.vatRate * 100)}%${settings.vatInclusive ? ' (included)' : ''}`}
                value={formatPHP(totals.vat)}
                muted
              />
              <div className="flex justify-between pt-1 text-xl font-bold">
                <dt>Total</dt>
                <dd>{formatPHP(totals.total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="btn btn-primary btn-lg w-full"
              disabled={!cart.length}
              onClick={() => setPaying(true)}
            >
              Pay <kbd className="kbd kbd-sm text-base-content">F9</kbd>
            </button>
          </div>
        </section>
      </div>

      {/* Phones: a sticky summary bar so the cart is always one tap away. */}
      {cart.length > 0 && (
        <div className="bg-base-100 border-base-300 sticky bottom-0 z-20 -mx-3 mt-4 flex items-center justify-between border-t p-3 lg:hidden">
          <a href="#cart" className="link text-sm">
            {itemCount} item{itemCount === 1 ? '' : 's'} · {formatPHP(totals.total)}
          </a>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setPaying(true)}>
            Pay
          </button>
        </div>
      )}

      <PaymentModal
        open={paying}
        total={totals.total}
        onClose={() => setPaying(false)}
        onPay={pay}
      />

      <Modal
        open={!!receipt}
        onClose={() => setReceipt(null)}
        title="Payment complete"
        actions={
          <>
            <button type="button" className="btn" onClick={() => window.print()}>
              Print
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setReceipt(null)}
              autoFocus
            >
              New sale
            </button>
          </>
        }
      >
        {receipt && (
          <>
            {receipt.payment.method === 'cash' && (
              <div className="bg-success/15 rounded-box mb-4 p-4 text-center">
                <p className="text-sm">Change</p>
                <p className="text-3xl font-bold">{formatPHP(receipt.change)}</p>
              </div>
            )}
            <div className="border-base-300 rounded-box max-h-[50vh] overflow-y-auto border p-4">
              <Receipt sale={receipt} settings={settings} />
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

/** "Coffee 3-in-1 Sachet" → "CS", "Cola 290ml" → "CO": first letters of the first two words. */
function initials(name: string) {
  const words = name.split(' ').filter((w) => /^[A-Za-z]/.test(w))
  return (
    words.length > 1 ? words[0][0] + words[1][0] : (words[0]?.slice(0, 2) ?? '?')
  ).toUpperCase()
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? 'text-base-content/60' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function DiscountEditor({
  value,
  max,
  capped,
  onApply,
}: {
  value: number
  max: number
  capped: boolean
  onApply: (d: number) => void
}) {
  const [text, setText] = useState(value ? toPesoString(value) : '')
  const parsed = text.trim() === '' ? 0 : parsePesos(text)
  const invalid = Number.isNaN(parsed) || parsed < 0 || parsed > max
  return (
    <form
      className="mt-2 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!invalid) onApply(parsed)
      }}
    >
      <label className={`input input-xs flex-1 ${invalid ? 'input-error' : ''}`}>
        ₱
        <input
          autoFocus
          inputMode="decimal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Line discount in pesos"
        />
      </label>
      <button type="submit" className="btn btn-xs btn-primary" disabled={invalid}>
        Apply
      </button>
      <button
        type="button"
        className="btn btn-xs btn-ghost"
        onClick={() => onApply(0)}
        aria-label="Remove discount"
      >
        <X className="size-3" />
      </button>
      <span className={`text-xs ${invalid ? 'text-error' : 'text-base-content/60'}`}>
        max {formatPHP(max)}
        {capped && ' (10%)'}
      </span>
    </form>
  )
}
