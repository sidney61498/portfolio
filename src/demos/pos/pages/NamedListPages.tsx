import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { can } from '../domain/permissions'
import { Modal } from '../components/Modal'
import { attempt } from '../components/toast'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

interface Item {
  id: string
  name: string
  contact?: string
}

interface Props {
  title: string
  noun: string
  items: Item[]
  usage: (id: string) => number
  withContact?: boolean
  save: (item: { id?: string; name: string; contact?: string }) => Promise<void>
  remove: (id: string) => Promise<void>
}

/** Categories and suppliers are both "a named list that products point at", so they share a page. */
function NamedListPage({ title, noun, items, usage, withContact, save, remove }: Props) {
  const role = usePosStore((s) => s.role)
  const editable = can(role, 'catalog.edit')
  const [editing, setEditing] = useState<Item | 'new' | null>(null)
  const [confirming, setConfirming] = useState<Item | null>(null)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={title}
        subtitle={editable ? `A ${noun} that products still use can't be deleted.` : 'Read-only for cashiers.'}
        actions={editable && <button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing('new')}><Plus className="size-4" /> Add {noun}</button>}
      />
      <div className="card bg-base-100 border-base-300 border">
        <ul className="divide-base-300 divide-y">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-base-content/60 text-xs">
                  {usage(item.id)} product{usage(item.id) === 1 ? '' : 's'}
                  {item.contact && ` · ${item.contact}`}
                </p>
              </div>
              {editable && (
                <div className="flex">
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => setEditing(item)} aria-label={`Edit ${item.name}`}><Pencil className="size-4" /></button>
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => setConfirming(item)} aria-label={`Delete ${item.name}`}><Trash2 className="size-4" /></button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? `Add ${noun}` : `Edit ${noun}`}>
        {editing && (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              const ok = await attempt(
                () => save({ id: editing === 'new' ? undefined : editing.id, name: String(f.get('name')), contact: withContact ? String(f.get('contact') ?? '') : undefined }).then(() => true),
                'Saved.',
              )
              if (ok) setEditing(null)
            }}
          >
            <label className="fieldset">
              <span className="fieldset-legend">Name</span>
              <input name="name" className="input w-full" defaultValue={editing === 'new' ? '' : editing.name} required minLength={2} autoFocus />
            </label>
            {withContact && (
              <label className="fieldset">
                <span className="fieldset-legend">Contact (optional)</span>
                <input name="contact" className="input w-full" defaultValue={editing === 'new' ? '' : editing.contact ?? ''} />
              </label>
            )}
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title={`Delete ${confirming?.name ?? ''}?`}
        actions={
          <>
            <button type="button" className="btn" onClick={() => setConfirming(null)}>Cancel</button>
            <button
              type="button"
              className="btn btn-error"
              onClick={async () => {
                const ok = await attempt(() => remove(confirming!.id).then(() => true), 'Deleted.')
                if (ok) setConfirming(null)
              }}
            >
              Delete
            </button>
          </>
        }
      >
        <p>This can’t be undone (except by resetting the demo).</p>
      </Modal>
    </div>
  )
}

export function CategoriesPage() {
  const categories = usePosStore((s) => s.categories)
  const products = usePosStore((s) => s.products)
  return (
    <NamedListPage
      title="Categories"
      noun="category"
      items={categories}
      usage={(id) => products.filter((p) => p.categoryId === id).length}
      save={posService.saveCategory}
      remove={posService.deleteCategory}
    />
  )
}

export function SuppliersPage() {
  const suppliers = usePosStore((s) => s.suppliers)
  const products = usePosStore((s) => s.products)
  return (
    <NamedListPage
      title="Suppliers"
      noun="supplier"
      items={suppliers}
      usage={(id) => products.filter((p) => p.supplierId === id).length}
      withContact
      save={posService.saveSupplier}
      remove={posService.deleteSupplier}
    />
  )
}
