import { Pencil, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { formatPHP, parsePesos, toPesoString } from '../domain/money'
import { ADJUSTMENT_REASONS, type ProductInput } from '../domain/operations'
import { can } from '../domain/permissions'
import type { Product } from '../domain/types'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { paginate } from '../components/paging'
import { attempt } from '../components/toast'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

export default function ProductsPage() {
  const products = usePosStore((s) => s.products)
  const categories = usePosStore((s) => s.categories)
  const role = usePosStore((s) => s.role)
  const editable = can(role, 'catalog.edit')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [lowOnly, setLowOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [adjusting, setAdjusting] = useState<Product | null>(null)

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'
  const filtered = products
    .filter((p) => category === 'all' || p.categoryId === category)
    .filter((p) => !lowOnly || p.stock <= p.reorderLevel)
    .filter((p) => !query || `${p.name} ${p.sku} ${p.barcode}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Products"
        subtitle={editable ? 'Stock changes only through stock-in, sales and adjustments, so every change is in the ledger.' : 'Read-only for cashiers.'}
        actions={
          editable && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
              <Plus className="size-4" /> Add product
            </button>
          )
        }
      />
      <div className="card bg-base-100 border-base-300 border">
        <div className="card-body p-4">
          <div className="flex flex-wrap gap-2">
            <label className="input input-sm min-w-48 flex-1">
              <Search className="size-4 opacity-60" />
              <input type="search" placeholder="Name, SKU or barcode" value={query} onChange={(e) => resetPage(setQuery)(e.target.value)} aria-label="Search products" />
            </label>
            <select className="select select-sm w-auto" value={category} onChange={(e) => resetPage(setCategory)(e.target.value)} aria-label="Category">
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label className="label cursor-pointer gap-2 text-sm">
              <input type="checkbox" className="toggle toggle-sm toggle-warning" checked={lowOnly} onChange={(e) => resetPage(setLowOnly)(e.target.checked)} />
              Low stock only
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="table-sm table-zebra table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="hidden md:table-cell">Category</th>
                  <th className="text-right">Cost</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Stock</th>
                  {editable && <th className="sr-only">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginate(filtered, page).map((p) => (
                  <tr key={p.id} className={p.active ? '' : 'opacity-50'}>
                    <td>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-base-content/60 font-mono text-xs">{p.sku} · {p.barcode}</div>
                    </td>
                    <td className="hidden md:table-cell">{catName(p.categoryId)}</td>
                    <td className="text-right">{formatPHP(p.cost)}</td>
                    <td className="text-right">{formatPHP(p.price)}</td>
                    <td className="text-right">
                      <span className={`badge badge-sm ${p.stock === 0 ? 'badge-error' : p.stock <= p.reorderLevel ? 'badge-warning' : 'badge-ghost'}`}>
                        {p.stock}
                      </span>
                      <div className="text-base-content/50 text-xs">reorder ≤ {p.reorderLevel}</div>
                    </td>
                    {editable && (
                      <td className="text-right whitespace-nowrap">
                        <button type="button" className="btn btn-ghost btn-xs" onClick={() => setAdjusting(p)} title="Adjust stock" aria-label={`Adjust stock for ${p.name}`}>
                          <SlidersHorizontal className="size-4" />
                        </button>
                        <button type="button" className="btn btn-ghost btn-xs" onClick={() => setEditing(p)} title="Edit" aria-label={`Edit ${p.name}`}>
                          <Pencil className="size-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-base-content/60 py-8 text-center">No products match.</p>}
          </div>
          <Pagination page={page} total={filtered.length} onChange={setPage} />
        </div>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'} wide>
        {editing && <ProductForm product={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!adjusting} onClose={() => setAdjusting(null)} title={`Adjust stock: ${adjusting?.name ?? ''}`}>
        {adjusting && <AdjustForm product={adjusting} onDone={() => setAdjusting(null)} />}
      </Modal>
    </div>
  )
}

function ProductForm({ product, onDone }: { product: Product | null; onDone: () => void }) {
  const categories = usePosStore((s) => s.categories)
  const suppliers = usePosStore((s) => s.suppliers)
  const [form, setForm] = useState({
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    barcode: product?.barcode ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    supplierId: product?.supplierId ?? '',
    cost: product ? toPesoString(product.cost) : '',
    price: product ? toPesoString(product.price) : '',
    reorderLevel: String(product?.reorderLevel ?? 10),
    initialStock: '0',
    active: product?.active ?? true,
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value })

  const cost = parsePesos(form.cost)
  const price = parsePesos(form.price)
  const belowCost = !Number.isNaN(cost) && !Number.isNaN(price) && price < cost

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const input: ProductInput = {
      id: product?.id,
      name: form.name,
      sku: form.sku,
      barcode: form.barcode,
      categoryId: form.categoryId,
      supplierId: form.supplierId || undefined,
      cost,
      price,
      reorderLevel: Number(form.reorderLevel),
      active: form.active,
      initialStock: product ? undefined : Number(form.initialStock),
    }
    const ok = await attempt(() => posService.saveProduct(input).then(() => true), product ? 'Product updated.' : 'Product added.')
    if (ok) onDone()
  }

  const field = (label: string, el: React.ReactNode, hint?: string) => (
    <label className="fieldset">
      <span className="fieldset-legend">{label}</span>
      {el}
      {hint && <p className="label whitespace-normal">{hint}</p>}
    </label>
  )

  return (
    <form onSubmit={submit}>
      <div className="grid gap-x-4 sm:grid-cols-2">
        {field('Name', <input className="input w-full" value={form.name} onChange={set('name')} required minLength={2} autoFocus />)}
        {field('SKU', <input className="input w-full uppercase" value={form.sku} onChange={set('sku')} required />, 'Letters, numbers, dashes.')}
        {field('Barcode', <input className="input w-full" inputMode="numeric" value={form.barcode} onChange={set('barcode')} required />, '6–14 digits.')}
        {field('Category', <select className="select w-full" value={form.categoryId} onChange={set('categoryId')}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>)}
        {field('Supplier', <select className="select w-full" value={form.supplierId} onChange={set('supplierId')}><option value="">None</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>)}
        {field('Reorder level', <input className="input w-full" type="number" min={0} step={1} value={form.reorderLevel} onChange={set('reorderLevel')} />, 'Low-stock alert at or below this.')}
        {field('Cost (₱)', <input className="input w-full" inputMode="decimal" value={form.cost} onChange={set('cost')} required />)}
        {field('Price, VAT included (₱)', <input className={`input w-full ${belowCost ? 'input-warning' : ''}`} inputMode="decimal" value={form.price} onChange={set('price')} required />, belowCost ? 'Warning: price is below cost.' : undefined)}
        {!product && field('Opening stock', <input className="input w-full" type="number" min={0} step={1} value={form.initialStock} onChange={set('initialStock')} />, 'Recorded in the ledger as INITIAL.')}
        <label className="label mt-6 cursor-pointer gap-2">
          <input type="checkbox" className="toggle toggle-success" checked={form.active} onChange={set('active')} />
          Active (sellable)
        </label>
      </div>
      <div className="modal-action">
        <button type="button" className="btn" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}

function AdjustForm({ product, onDone }: { product: Product; onDone: () => void }) {
  const [direction, setDirection] = useState<1 | -1>(-1)
  const [qty, setQty] = useState('1')
  const [reason, setReason] = useState<string>(ADJUSTMENT_REASONS[0])
  const n = Number(qty)
  const after = product.stock + direction * (Number.isInteger(n) ? n : 0)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await attempt(() => posService.adjustStock(product.id, direction * n, reason).then(() => true), 'Stock adjusted.')
    if (ok) onDone()
  }

  return (
    <form onSubmit={submit}>
      <div className="join mb-3 w-full">
        <button type="button" className={`btn join-item flex-1 ${direction === -1 ? 'btn-primary' : ''}`} onClick={() => setDirection(-1)}>Remove</button>
        <button type="button" className={`btn join-item flex-1 ${direction === 1 ? 'btn-primary' : ''}`} onClick={() => setDirection(1)}>Add</button>
      </div>
      <label className="fieldset">
        <span className="fieldset-legend">Quantity</span>
        <input className="input w-full" type="number" min={1} step={1} value={qty} onChange={(e) => setQty(e.target.value)} required autoFocus />
      </label>
      <label className="fieldset">
        <span className="fieldset-legend">Reason</span>
        <select className="select w-full" value={reason} onChange={(e) => setReason(e.target.value)}>
          {ADJUSTMENT_REASONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <p className={`mt-3 text-sm ${after < 0 ? 'text-error' : 'text-base-content/70'}`}>
        Stock: {product.stock} → <b>{after}</b>
      </p>
      <div className="modal-action">
        <button type="button" className="btn" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={after < 0 || !Number.isInteger(n) || n < 1}>Save adjustment</button>
      </div>
    </form>
  )
}
