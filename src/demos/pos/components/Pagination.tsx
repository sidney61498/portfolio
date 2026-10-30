import { PAGE_SIZE } from './paging'

export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (pages === 1) return null
  return (
    <div className="mt-4 flex items-center justify-between gap-2 text-sm">
      <span className="text-base-content/60">
        {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
      </span>
      <div className="join">
        <button type="button" className="btn btn-sm join-item" disabled={page === 1} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        <span className="btn btn-sm join-item pointer-events-none">
          {page} / {pages}
        </span>
        <button type="button" className="btn btn-sm join-item" disabled={page === pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
