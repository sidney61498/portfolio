import { Lock } from 'lucide-react'
import { can, type Action } from '../domain/permissions'
import { posService } from '../services/posService'
import { usePosStore } from '../store/posStore'

/** Wraps a manager-only page. Cashiers see why they can't open it, and a one-click way to switch. */
export function ManagerOnly({ action, children }: { action: Action; children: React.ReactNode }) {
  const role = usePosStore((s) => s.role)
  if (can(role, action)) return <>{children}</>
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="card bg-base-100 border-base-300 max-w-md border text-center">
        <div className="card-body items-center">
          <Lock className="text-warning size-10" />
          <h2 className="card-title">Managers only</h2>
          <p className="text-base-content/70">
            Cashiers can’t open this page. In a real store this is enforced on the server; here the same rule is enforced in the
            service layer too, not just by hiding the menu.
          </p>
          <button type="button" className="btn btn-primary mt-2" onClick={() => posService.setRole('manager')}>
            Switch to Manager
          </button>
        </div>
      </div>
    </div>
  )
}
