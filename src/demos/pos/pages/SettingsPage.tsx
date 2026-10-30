import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Modal } from '../components/Modal'
import { ManagerOnly } from '../components/ManagerOnly'
import { attempt } from '../components/toast'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'
import { PageHeader } from './PageHeader'

function SettingsForm() {
  const settings = usePosStore((s) => s.settings)
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...settings, vatPercent: String(Math.round(settings.vatRate * 100)), lowStock: String(settings.lowStockDefault) })
  const [confirmReset, setConfirmReset] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const { vatPercent, lowStock, ...rest } = form
    await attempt(() => posService.updateSettings({ ...rest, vatRate: Number(vatPercent) / 100, lowStockDefault: Number(lowStock) }), 'Settings saved.')
  }

  const text = (key: 'storeName' | 'address' | 'tin', label: string) => (
    <label className="fieldset">
      <span className="fieldset-legend">{label}</span>
      <input className="input w-full" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </label>
  )

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" />
      <form onSubmit={save} className="card bg-base-100 border-base-300 mb-6 border">
        <div className="card-body p-5">
          <h2 className="card-title text-base">Receipt header</h2>
          {text('storeName', 'Store name')}
          {text('address', 'Address')}
          {text('tin', 'TIN')}
          <h2 className="card-title mt-4 text-base">Tax and stock</h2>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <label className="fieldset">
              <span className="fieldset-legend">VAT rate (%)</span>
              <input className="input w-full" type="number" min={0} max={50} step={1} value={form.vatPercent} onChange={(e) => setForm({ ...form, vatPercent: e.target.value })} />
            </label>
            <label className="fieldset">
              <span className="fieldset-legend">Default low-stock threshold</span>
              <input className="input w-full" type="number" min={0} step={1} value={form.lowStock} onChange={(e) => setForm({ ...form, lowStock: e.target.value })} />
            </label>
          </div>
          <label className="label mt-2 cursor-pointer gap-2">
            <input type="checkbox" className="toggle" checked={form.vatInclusive} onChange={(e) => setForm({ ...form, vatInclusive: e.target.checked })} />
            Prices include VAT (standard for PH retail)
          </label>
          <label className="fieldset max-w-xs">
            <span className="fieldset-legend">Manager override PIN</span>
            <input className="input w-full" inputMode="numeric" maxLength={4} value={form.managerPin} onChange={(e) => setForm({ ...form, managerPin: e.target.value })} />
            <p className="label">Demo only, so it’s shown in plain text.</p>
          </label>
          <div className="card-actions mt-4 justify-end">
            <button type="submit" className="btn btn-primary">Save settings</button>
          </div>
        </div>
      </form>

      <div className="card bg-base-100 border-error/40 border">
        <div className="card-body p-5">
          <h2 className="card-title text-base">Reset demo data</h2>
          <p className="text-base-content/70 text-sm">Puts back the original products, suppliers and 30 days of history. Everything you changed is discarded.</p>
          <div className="card-actions justify-end">
            <button type="button" className="btn btn-error btn-soft" onClick={() => setConfirmReset(true)}><RotateCcw className="size-4" /> Reset demo</button>
          </div>
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all demo data?"
        actions={
          <>
            <button type="button" className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
            <button
              type="button"
              className="btn btn-error"
              onClick={async () => {
                await attempt(() => posService.resetDemo(), 'Demo data reset.')
                setConfirmReset(false)
                navigate('/demo/pos/register')
              }}
            >
              Reset
            </button>
          </>
        }
      >
        <p>Sales, stock changes and settings go back to the starting point.</p>
      </Modal>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ManagerOnly action="settings.edit">
      <SettingsForm />
    </ManagerOnly>
  )
}
